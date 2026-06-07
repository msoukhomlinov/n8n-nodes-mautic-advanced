const oauthRequestQueue = new Map<string, Promise<void>>();
const oauthInFlightRequests = new Map<string, Set<Promise<void>>>();

export async function runWithCredentialLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const previous = oauthRequestQueue.get(key) ?? Promise.resolve();

  const run = (async () => {
    await previous.catch(() => undefined);
    return await fn();
  })();

  const tail = run.then(
    () => undefined,
    () => undefined,
  );

  oauthRequestQueue.set(key, tail);

  try {
    return await run;
  } finally {
    if (oauthRequestQueue.get(key) === tail) {
      oauthRequestQueue.delete(key);
    }
  }
}

export async function runTrackedCredentialRequest<T>(
  key: string,
  fn: () => Promise<T>,
): Promise<T> {
  const run = Promise.resolve().then(fn);
  const tracker = run.then(
    () => undefined,
    () => undefined,
  );
  const requests = oauthInFlightRequests.get(key) ?? new Set<Promise<void>>();

  requests.add(tracker);
  oauthInFlightRequests.set(key, requests);

  try {
    return await run;
  } finally {
    requests.delete(tracker);
    if (requests.size === 0) {
      oauthInFlightRequests.delete(key);
    }
  }
}

export async function waitForTrackedCredentialRequests(key: string): Promise<void> {
  const requests = Array.from(oauthInFlightRequests.get(key) ?? []);

  await Promise.all(requests.map(async (request) => await request.catch(() => undefined)));
}

export function _getOAuthRequestQueueSizeForTests(): number {
  return oauthRequestQueue.size;
}

export function _getTrackedOAuthRequestCountForTests(key: string): number {
  return oauthInFlightRequests.get(key)?.size ?? 0;
}
