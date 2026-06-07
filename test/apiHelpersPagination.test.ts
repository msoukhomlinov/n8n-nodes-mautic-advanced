import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { IDataObject } from 'n8n-workflow';

vi.mock('../nodes/MauticAdvanced/GenericFunctions', () => ({
  mauticApiRequest: vi.fn(),
  mauticApiRequestAllItems: vi.fn(async () => []),
}));

import { makePaginatedRequest } from '../nodes/MauticAdvanced/utils/ApiHelpers';
import { mauticApiRequestAllItems } from '../nodes/MauticAdvanced/GenericFunctions';

const mockedPaginatedRequest = vi.mocked(mauticApiRequestAllItems);

const context = {
  getNode: vi.fn(() => ({ name: 'Mautic Advanced' })),
} as any;

describe('makePaginatedRequest', () => {
  beforeEach(() => {
    mockedPaginatedRequest.mockClear();
  });

  test('uses explicit limit argument as maxResults and removes query limit', async () => {
    const query: IDataObject = { search: 'opened', limit: 30, start: 10 };

    await makePaginatedRequest(context, 'events', 'GET', '/contacts/activity', {}, query, 25);

    expect(mockedPaginatedRequest).toHaveBeenCalledWith(
      'events',
      'GET',
      '/contacts/activity',
      {},
      { search: 'opened', start: 10 },
      25,
    );
    expect(query).toEqual({ search: 'opened', limit: 30, start: 10 });
  });

  test('uses query limit as maxResults when explicit limit is absent', async () => {
    const query: IDataObject = { search: 'opened', limit: '40' };

    await makePaginatedRequest(context, 'events', 'GET', '/contacts/activity', {}, query);

    expect(mockedPaginatedRequest).toHaveBeenCalledWith(
      'events',
      'GET',
      '/contacts/activity',
      {},
      { search: 'opened' },
      40,
    );
    expect(query).toEqual({ search: 'opened', limit: '40' });
  });
});
