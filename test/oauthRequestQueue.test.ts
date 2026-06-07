import { describe, expect, test } from 'vitest';
import {
  _getOAuthRequestQueueSizeForTests,
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
