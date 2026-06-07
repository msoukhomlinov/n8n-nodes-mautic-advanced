import { describe, expect, test } from 'vitest';
import { ERROR_TYPES, formatApiError } from '../nodes/MauticAdvanced/ai-tools/error-formatter';
import { OAUTH_REFRESH_ERROR_MESSAGE } from '../nodes/MauticAdvanced/utils/authErrorHelpers';

describe('formatApiError', () => {
  test('maps invalid_grant to permission denied instead of validation error', () => {
    const envelope = formatApiError('{"error":"invalid_grant"}', 'contact', 'update');

    expect(envelope.success).toBe(false);
    expect(envelope.error.errorType).toBe(ERROR_TYPES.PERMISSION_DENIED);
    expect(envelope.error.message).toBe(OAUTH_REFRESH_ERROR_MESSAGE);
  });

  test('detects invalid_grant from object-shaped API errors', () => {
    const envelope = formatApiError(
      { response: { body: { error: 'invalid_grant' } }, message: 'Request failed' },
      'contact',
      'update',
    );

    expect(envelope.success).toBe(false);
    expect(envelope.error.errorType).toBe(ERROR_TYPES.PERMISSION_DENIED);
    expect(envelope.error.message).toBe(OAUTH_REFRESH_ERROR_MESSAGE);
  });

  test('keeps ordinary invalid input errors as validation errors', () => {
    const envelope = formatApiError(
      'Invalid data provided for update Contact.',
      'contact',
      'update',
    );

    expect(envelope.success).toBe(false);
    expect(envelope.error.errorType).toBe(ERROR_TYPES.VALIDATION_ERROR);
  });

  test('maps numeric auth status messages to permission denied', () => {
    const envelope = formatApiError('Request failed with status 401', 'contact', 'get');

    expect(envelope.success).toBe(false);
    expect(envelope.error.errorType).toBe(ERROR_TYPES.PERMISSION_DENIED);
  });
});
