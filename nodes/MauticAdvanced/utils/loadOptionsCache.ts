import type { ICredentialDataDecryptedObject, ILoadOptionsFunctions, INode } from 'n8n-workflow';

export const MAUTIC_LOAD_OPTIONS_CACHE_TTL_MS = 60_000;

type MauticCredentialType = 'mauticAdvancedApi' | 'mauticAdvancedOAuth2Api';

type LoadOptionsCacheEntry<T> = {
  expiresAt: number;
  promise: Promise<T>;
};

const loadOptionsCache = new Map<string, LoadOptionsCacheEntry<unknown>>();

function getCredentialType(authenticationMethod: string): MauticCredentialType {
  return authenticationMethod === 'credentials' ? 'mauticAdvancedApi' : 'mauticAdvancedOAuth2Api';
}

function withoutTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}

function normalizeCredentialUrl(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  try {
    const url = new URL(trimmed);
    url.protocol = url.protocol.toLowerCase();
    url.hostname = url.hostname.toLowerCase();
    url.hash = '';
    url.search = '';
    url.pathname = withoutTrailingSlashes(url.pathname);

    return withoutTrailingSlashes(url.toString());
  } catch {
    return withoutTrailingSlashes(trimmed);
  }
}

function getMauticVersion(credentials: ICredentialDataDecryptedObject): string {
  return String(credentials.mauticVersion || 'v6');
}

function credentialRefPart(value: unknown): string | undefined {
  if (typeof value === 'string' && value) {
    return value;
  }

  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  const credentialRef = value as { id?: string | null; name?: string | null };

  if (credentialRef.id) {
    return credentialRef.id;
  }

  if (credentialRef.name) {
    return credentialRef.name;
  }

  return undefined;
}

function getCredentialReference(context: ILoadOptionsFunctions, credentialType: string): string {
  const contextWithNode = context as ILoadOptionsFunctions & { getNode?: () => INode };
  const credentialRef = contextWithNode.getNode?.().credentials?.[credentialType];
  const nodeCredentialPart = credentialRefPart(credentialRef);

  if (nodeCredentialPart) {
    return nodeCredentialPart;
  }

  return 'unknown';
}

function getCacheKey(
  authenticationMethod: string,
  credentialType: MauticCredentialType,
  credentialReference: string,
  credentials: ICredentialDataDecryptedObject,
  datasetKey: string,
): string {
  return JSON.stringify([
    authenticationMethod,
    credentialType,
    credentialReference,
    normalizeCredentialUrl(credentials.url),
    getMauticVersion(credentials),
    datasetKey,
  ]);
}

export async function getCachedMauticLoadOptions<T>(
  context: ILoadOptionsFunctions,
  datasetKey: string,
  loadOptions: () => Promise<T>,
  ttlMs = MAUTIC_LOAD_OPTIONS_CACHE_TTL_MS,
): Promise<T> {
  const authenticationMethod = context.getNodeParameter('authentication', 'credentials') as string;
  const credentialType = getCredentialType(authenticationMethod);
  const credentials = await context.getCredentials(credentialType);
  const credentialReference = getCredentialReference(context, credentialType);
  const cacheKey = getCacheKey(
    authenticationMethod,
    credentialType,
    credentialReference,
    credentials,
    datasetKey,
  );
  const now = Date.now();
  const cachedEntry = loadOptionsCache.get(cacheKey) as LoadOptionsCacheEntry<T> | undefined;

  if (cachedEntry && cachedEntry.expiresAt > now) {
    return await cachedEntry.promise;
  }

  if (cachedEntry) {
    loadOptionsCache.delete(cacheKey);
  }

  const promise = (async () => loadOptions())().catch((error: unknown) => {
    const latestEntry = loadOptionsCache.get(cacheKey);

    if (latestEntry?.promise === promise) {
      loadOptionsCache.delete(cacheKey);
    }

    throw error;
  });

  loadOptionsCache.set(cacheKey, {
    expiresAt: now + ttlMs,
    promise,
  });

  return await promise;
}

export function clearMauticLoadOptionsCacheForTests(): void {
  loadOptionsCache.clear();
}
