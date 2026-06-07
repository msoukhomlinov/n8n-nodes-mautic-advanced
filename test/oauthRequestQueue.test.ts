import type { IRequestOptions } from 'n8n-workflow';
import { describe, expect, test } from 'vitest';
import { requestMauticAuthenticated } from '../nodes/MauticAdvanced/utils/authenticatedRequest';
import {
  _getOAuthRequestQueueSizeForTests,
  _getTrackedOAuthRequestCountForTests,
  runWithCredentialLock,
} from '../nodes/MauticAdvanced/utils/oauthRequestQueue';

function delay(ms = 0): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe('runWithCredentialLock', () => {
  test('serialises concurrent calls for the same credential key', async () => {
    let active = 0;
    let maxActive = 0;

    const calls = Array.from({ length: 3 }, (_, index) =>
      runWithCredentialLock('credential-a', async () => {
        active += 1;
        maxActive = Math.max(maxActive, active);
        await delay(10);
        active -= 1;
        return index;
      }),
    );

    await expect(Promise.all(calls)).resolves.toEqual([0, 1, 2]);
    expect(maxActive).toBe(1);
    expect(_getOAuthRequestQueueSizeForTests()).toBe(0);
  });

  test('allows different credential keys to run in parallel', async () => {
    let active = 0;
    let maxActive = 0;

    await Promise.all([
      runWithCredentialLock('credential-a', async () => {
        active += 1;
        maxActive = Math.max(maxActive, active);
        await delay(20);
        active -= 1;
      }),
      runWithCredentialLock('credential-b', async () => {
        active += 1;
        maxActive = Math.max(maxActive, active);
        await delay(20);
        active -= 1;
      }),
    ]);

    expect(maxActive).toBe(2);
    expect(_getOAuthRequestQueueSizeForTests()).toBe(0);
  });

  test('preserves the original error object and allows later calls to run', async () => {
    const originalError = new Error('refresh failed');

    await expect(
      runWithCredentialLock('credential-a', async () => {
        throw originalError;
      }),
    ).rejects.toBe(originalError);

    await expect(runWithCredentialLock('credential-a', async () => 'next-call')).resolves.toBe(
      'next-call',
    );
    expect(_getOAuthRequestQueueSizeForTests()).toBe(0);
  });

  test('does not emit an unhandled rejection from the internal queue tail', async () => {
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => {
      unhandled.push(reason);
    };

    process.once('unhandledRejection', onUnhandled);

    try {
      await expect(
        runWithCredentialLock('credential-a', async () => {
          throw new Error('expected failure');
        }),
      ).rejects.toThrow('expected failure');

      await delay(0);
      expect(unhandled).toEqual([]);
    } finally {
      process.removeListener('unhandledRejection', onUnhandled);
    }
  });
});

describe('requestMauticAuthenticated', () => {
  test('allows ordinary concurrent OAuth requests for the same credential to overlap', async () => {
    let active = 0;
    let maxActive = 0;

    const context = {
      async getCredentials() {
        return {
          url: 'https://mautic.example',
        };
      },
      getNode() {
        return {
          credentials: {
            mauticAdvancedOAuth2Api: {
              id: 'credential-a',
            },
          },
        };
      },
      helpers: {
        requestWithAuthentication: {
          async call() {
            throw new Error('Basic Auth helper should not be called');
          },
        },
        requestOAuth2: {
          async call() {
            active += 1;
            maxActive = Math.max(maxActive, active);
            await delay(20);
            active -= 1;

            return {
              ok: true,
            };
          },
        },
      },
    };

    const options: IRequestOptions = {
      method: 'GET',
      uri: '/api/contacts',
      json: true,
    };

    await Promise.all([
      requestMauticAuthenticated(context as never, 'oAuth2', options),
      requestMauticAuthenticated(context as never, 'oAuth2', options),
    ]);

    expect(maxActive).toBe(2);
    expect(_getOAuthRequestQueueSizeForTests()).toBe(0);
  });

  test('serialises invalid-grant recovery retries for the same OAuth credential', async () => {
    let calls = 0;
    let activeRetries = 0;
    let maxActiveRetries = 0;

    const context = {
      async getCredentials() {
        return {
          url: 'https://mautic.example',
        };
      },
      getNode() {
        return {
          credentials: {
            mauticAdvancedOAuth2Api: {
              id: 'credential-a',
            },
          },
        };
      },
      helpers: {
        requestWithAuthentication: {
          async call() {
            throw new Error('Basic Auth helper should not be called');
          },
        },
        requestOAuth2: {
          async call() {
            calls += 1;

            if (calls <= 2) {
              throw { error: 'invalid_grant' };
            }

            activeRetries += 1;
            maxActiveRetries = Math.max(maxActiveRetries, activeRetries);
            await delay(20);
            activeRetries -= 1;

            return {
              ok: true,
            };
          },
        },
      },
    };

    const options: IRequestOptions = {
      method: 'GET',
      uri: '/api/contacts',
      json: true,
    };

    await Promise.all([
      requestMauticAuthenticated(context as never, 'oAuth2', options),
      requestMauticAuthenticated(context as never, 'oAuth2', options),
    ]);

    expect(calls).toBe(4);
    expect(maxActiveRetries).toBe(1);
    expect(_getOAuthRequestQueueSizeForTests()).toBe(0);
  });

  test('waits for in-flight OAuth requests before retrying invalid-grant failures', async () => {
    let calls = 0;
    let finishFirstRequest: (value: unknown) => void = () => undefined;
    const events: string[] = [];

    const context = {
      async getCredentials() {
        return {
          url: 'https://mautic.example',
        };
      },
      getNode() {
        return {
          credentials: {
            mauticAdvancedOAuth2Api: {
              id: 'credential-a',
            },
          },
        };
      },
      helpers: {
        requestWithAuthentication: {
          async call() {
            throw new Error('Basic Auth helper should not be called');
          },
        },
        requestOAuth2: {
          async call() {
            calls += 1;

            if (calls === 1) {
              events.push('first-start');
              await new Promise((resolve) => {
                finishFirstRequest = resolve;
              });
              events.push('first-finish');
              return { ok: true, request: 'first' };
            }

            if (calls === 2) {
              events.push('invalid-grant');
              throw { error: 'invalid_grant' };
            }

            events.push('retry-start');
            return { ok: true, request: 'retry' };
          },
        },
      },
    };

    const options: IRequestOptions = {
      method: 'GET',
      uri: '/api/contacts',
      json: true,
    };

    const firstRequest = requestMauticAuthenticated(context as never, 'oAuth2', options);
    await Promise.resolve();

    const secondRequest = requestMauticAuthenticated(context as never, 'oAuth2', options);
    await delay(0);

    expect(events).toEqual(['first-start', 'invalid-grant']);
    expect(calls).toBe(2);
    expect(_getTrackedOAuthRequestCountForTests('mauticAdvancedOAuth2Api:credential-a')).toBe(1);

    finishFirstRequest({ ok: true });

    await expect(Promise.all([firstRequest, secondRequest])).resolves.toEqual([
      { ok: true, request: 'first' },
      { ok: true, request: 'retry' },
    ]);
    expect(events).toEqual(['first-start', 'invalid-grant', 'first-finish', 'retry-start']);
    expect(_getOAuthRequestQueueSizeForTests()).toBe(0);
    expect(_getTrackedOAuthRequestCountForTests('mauticAdvancedOAuth2Api:credential-a')).toBe(0);
  });
});
