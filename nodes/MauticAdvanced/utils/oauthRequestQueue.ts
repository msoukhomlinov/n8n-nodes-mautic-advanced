const oauthRequestQueue = new Map<string, Promise<void>>();

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

export function _getOAuthRequestQueueSizeForTests(): number {
  return oauthRequestQueue.size;
}
