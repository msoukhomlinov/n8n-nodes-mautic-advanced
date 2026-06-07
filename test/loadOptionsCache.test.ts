import { beforeEach, describe, expect, test } from 'vitest';
import {
  clearMauticLoadOptionsCacheForTests,
  getCachedMauticLoadOptions,
} from '../nodes/MauticAdvanced/utils/loadOptionsCache';

type TestContextOptions = {
  authentication?: string;
  credentialId?: string;
  credentialName?: string;
  url: string;
  mauticVersion?: string;
};

function createLoadOptionsContext({
  authentication = 'credentials',
  credentialId,
  credentialName,
  url,
  mauticVersion = 'v6',
}: TestContextOptions) {
  const expectedCredentialType =
    authentication === 'credentials' ? 'mauticAdvancedApi' : 'mauticAdvancedOAuth2Api';

  return {
    getNode() {
      return {
        credentials: {
          [expectedCredentialType]:
            credentialId || credentialName
              ? {
                  id: credentialId,
                  name: credentialName,
                }
              : undefined,
        },
      };
    },
    getNodeParameter(parameterName: string) {
      if (parameterName !== 'authentication') {
        throw new Error(`Unexpected node parameter: ${parameterName}`);
      }

      return authentication;
    },
    async getCredentials(credentialType: string) {
      if (credentialType !== expectedCredentialType) {
        throw new Error(`Unexpected credential type: ${credentialType}`);
      }

      return {
        url,
        mauticVersion,
      };
    },
  } as never;
}

describe('getCachedMauticLoadOptions', () => {
  beforeEach(() => {
    clearMauticLoadOptionsCacheForTests();
  });

  test('shares concurrent loads for the same credential and cache key', async () => {
    const context = createLoadOptionsContext({
      url: 'https://mautic.example.test/',
      mauticVersion: 'v7',
    });
    const loadResult = [{ name: 'Customer', value: 1 }];
    let loadCalls = 0;
    let resolveLoad: (value: typeof loadResult) => void = () => undefined;

    const firstLoad = getCachedMauticLoadOptions(context, 'tags', async () => {
      loadCalls += 1;
      return await new Promise<typeof loadResult>((resolve) => {
        resolveLoad = resolve;
      });
    });
    const secondLoad = getCachedMauticLoadOptions(context, 'tags', async () => {
      loadCalls += 1;
      return [];
    });

    await Promise.resolve();
    expect(loadCalls).toBe(1);

    resolveLoad(loadResult);
    const [firstResult, secondResult] = await Promise.all([firstLoad, secondLoad]);

    expect(firstResult).toBe(loadResult);
    expect(secondResult).toBe(loadResult);
  });

  test('separates cache entries by credential URL', async () => {
    const firstContext = createLoadOptionsContext({
      url: 'https://first.example.test/',
    });
    const secondContext = createLoadOptionsContext({
      url: 'https://second.example.test/',
    });
    const firstResult = [{ name: 'First', value: 1 }];
    const secondResult = [{ name: 'Second', value: 2 }];
    let loadCalls = 0;

    await expect(
      getCachedMauticLoadOptions(firstContext, 'tags', async () => {
        loadCalls += 1;
        return firstResult;
      }),
    ).resolves.toBe(firstResult);
    await expect(
      getCachedMauticLoadOptions(secondContext, 'tags', async () => {
        loadCalls += 1;
        return secondResult;
      }),
    ).resolves.toBe(secondResult);
    await expect(
      getCachedMauticLoadOptions(firstContext, 'tags', async () => {
        throw new Error('First credential URL should already be cached');
      }),
    ).resolves.toBe(firstResult);

    expect(loadCalls).toBe(2);
  });

  test('separates cache entries by credential reference when URL and version match', async () => {
    const firstContext = createLoadOptionsContext({
      credentialId: 'credential-a',
      url: 'https://mautic.example.test/',
    });
    const secondContext = createLoadOptionsContext({
      credentialId: 'credential-b',
      url: 'https://mautic.example.test/',
    });
    const firstResult = [{ name: 'First', value: 1 }];
    const secondResult = [{ name: 'Second', value: 2 }];
    let loadCalls = 0;

    await expect(
      getCachedMauticLoadOptions(firstContext, 'tags', async () => {
        loadCalls += 1;
        return firstResult;
      }),
    ).resolves.toBe(firstResult);
    await expect(
      getCachedMauticLoadOptions(secondContext, 'tags', async () => {
        loadCalls += 1;
        return secondResult;
      }),
    ).resolves.toBe(secondResult);
    await expect(
      getCachedMauticLoadOptions(firstContext, 'tags', async () => {
        throw new Error('First credential should already be cached');
      }),
    ).resolves.toBe(firstResult);

    expect(loadCalls).toBe(2);
  });

  test('does not keep rejected loads in the cache', async () => {
    const context = createLoadOptionsContext({
      url: 'https://mautic.example.test/',
    });
    const expectedError = new Error('load failed');
    const retryResult = [{ name: 'Retry', value: 3 }];
    let loadCalls = 0;

    await expect(
      getCachedMauticLoadOptions(context, 'tags', async () => {
        loadCalls += 1;
        throw expectedError;
      }),
    ).rejects.toBe(expectedError);
    await expect(
      getCachedMauticLoadOptions(context, 'tags', async () => {
        loadCalls += 1;
        return retryResult;
      }),
    ).resolves.toBe(retryResult);

    expect(loadCalls).toBe(2);
  });
});
