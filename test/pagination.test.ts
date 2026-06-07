import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { IDataObject, IRequestOptions } from 'n8n-workflow';

vi.mock('../nodes/MauticAdvanced/utils/authenticatedRequest', () => ({
  requestMauticAuthenticated: vi.fn(),
}));

import { mauticApiRequestAllItems } from '../nodes/MauticAdvanced/GenericFunctions';
import { requestMauticAuthenticated } from '../nodes/MauticAdvanced/utils/authenticatedRequest';

const mockedRequest = vi.mocked(requestMauticAuthenticated);

const context = {
  getNodeParameter: vi.fn(() => 'credentials'),
  getNode: vi.fn(() => ({ name: 'Mautic Advanced' })),
} as any;

function makeMappedItems(count: number, startId = 1): IDataObject {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => {
      const id = startId + index;
      return [String(id), { id }];
    }),
  ) as IDataObject;
}

function requestOptionsAt(callIndex: number): IRequestOptions {
  return mockedRequest.mock.calls[callIndex][2] as IRequestOptions;
}

describe('mauticApiRequestAllItems', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
    context.getNodeParameter.mockReturnValue('credentials');
  });

  test('uses a 100 item page size and does not mutate the caller query', async () => {
    mockedRequest
      .mockResolvedValueOnce({ contacts: makeMappedItems(100, 1) })
      .mockResolvedValueOnce({ contacts: makeMappedItems(1, 101) });

    const query: IDataObject = { search: 'vip', orderBy: 'id' };

    const result = await mauticApiRequestAllItems.call(
      context,
      'contacts',
      'GET',
      '/contacts',
      {},
      query,
    );

    expect(result).toHaveLength(101);
    expect(query).toEqual({ search: 'vip', orderBy: 'id' });
    expect(requestOptionsAt(0).qs).toEqual({
      search: 'vip',
      orderBy: 'id',
      limit: 100,
      start: 0,
    });
    expect(requestOptionsAt(1).qs).toEqual({
      search: 'vip',
      orderBy: 'id',
      limit: 100,
      start: 100,
    });
  });

  test('uses maxResults to cap the first page request', async () => {
    mockedRequest.mockResolvedValueOnce({ contacts: makeMappedItems(50, 1) });

    const result = await mauticApiRequestAllItems.call(
      context,
      'contacts',
      'GET',
      '/contacts',
      {},
      {},
      50,
    );

    expect(result).toHaveLength(50);
    expect(mockedRequest).toHaveBeenCalledTimes(1);
    expect(requestOptionsAt(0).qs).toEqual({ limit: 50, start: 0 });
  });

  test('preserves a caller supplied start offset on the first page', async () => {
    mockedRequest.mockResolvedValueOnce({ contacts: makeMappedItems(5, 51) });

    const result = await mauticApiRequestAllItems.call(
      context,
      'contacts',
      'GET',
      '/contacts',
      {},
      { start: 50 },
    );

    expect(result).toHaveLength(5);
    expect(requestOptionsAt(0).qs).toEqual({ limit: 100, start: 50 });
  });
});
