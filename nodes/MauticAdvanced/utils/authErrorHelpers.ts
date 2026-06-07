const INVALID_GRANT = 'invalid_grant';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseJsonString(value: string): unknown {
  const trimmed = value.trim();

  if (!trimmed || (!trimmed.startsWith('{') && !trimmed.startsWith('['))) {
    return undefined;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return undefined;
  }
}

function valueContainsInvalidGrant(value: unknown, seen: Set<unknown>): boolean {
  if (typeof value === 'string') {
    if (value.toLowerCase().includes(INVALID_GRANT)) {
      return true;
    }

    const parsed = parseJsonString(value);
    return parsed !== undefined && valueContainsInvalidGrant(parsed, seen);
  }

  if (!isRecord(value)) {
    return false;
  }

  if (seen.has(value)) {
    return false;
  }
  seen.add(value);

  const directFields = ['error', 'error_description', 'description', 'message'];
  for (const field of directFields) {
    if (valueContainsInvalidGrant(value[field], seen)) {
      return true;
    }
  }

  const nestedFields = ['response', 'body', 'data', 'cause'];
  for (const field of nestedFields) {
    const nested = value[field];

    if (field === 'response' && isRecord(nested)) {
      if (valueContainsInvalidGrant(nested.body, seen)) {
        return true;
      }
    }

    if (valueContainsInvalidGrant(nested, seen)) {
      return true;
    }
  }

  return false;
}

export function isInvalidGrantError(error: unknown): boolean {
  return valueContainsInvalidGrant(error, new Set<unknown>());
}

export const OAUTH_REFRESH_ERROR_MESSAGE =
  'OAuth token refresh failed for Mautic. A concurrent workflow may have already consumed the refresh token. Retry the workflow; if it persists, reconnect the Mautic OAuth2 credential.';
