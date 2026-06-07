import { describe, expect, test } from 'vitest';
import { isInvalidGrantError } from '../nodes/MauticAdvanced/utils/authErrorHelpers';

describe('isInvalidGrantError', () => {
  test.each([
    ['plain string', 'invalid_grant'],
    ['JSON string', '{"error":"invalid_grant"}'],
    ['error field', { error: 'invalid_grant' }],
    ['error description', { error_description: 'Refresh failed: invalid_grant' }],
    ['description', { description: 'OAuth failed with invalid_grant' }],
    ['message', { message: 'Mautic returned invalid_grant' }],
    ['body object', { body: { error: 'invalid_grant' } }],
    ['response body object', { response: { body: { error: 'invalid_grant' } } }],
    ['response body JSON string', { response: { body: '{"error":"invalid_grant"}' } }],
    ['data object', { data: { error_description: 'invalid_grant' } }],
    ['cause object', { cause: { message: 'invalid_grant' } }],
  ])('detects invalid_grant in %s', (_label, error) => {
    expect(isInvalidGrantError(error)).toBe(true);
  });

  test('does not classify ordinary Mautic validation payloads as invalid_grant', () => {
    expect(
      isInvalidGrantError({
        errors: [
          {
            message: 'email: This value is not a valid email address.',
            details: { email: ['This value is not a valid email address.'] },
          },
        ],
      }),
    ).toBe(false);
  });
});
