import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../nodes/MauticAdvanced/utils/ApiHelpers', async () => {
  const actual = await vi.importActual<typeof import('../nodes/MauticAdvanced/utils/ApiHelpers')>(
    '../nodes/MauticAdvanced/utils/ApiHelpers',
  );

  return {
    ...actual,
    makeApiRequest: vi.fn(),
    makePaginatedRequest: vi.fn(),
  };
});

import { executeContactOperation } from '../nodes/MauticAdvanced/operations/ContactOperations';
import { makeApiRequest, makePaginatedRequest } from '../nodes/MauticAdvanced/utils/ApiHelpers';

const mockedMakeApiRequest = vi.mocked(makeApiRequest);
const mockedMakePaginatedRequest = vi.mocked(makePaginatedRequest);

function contactsMap(
  entries: Array<{ id: number; ownerId?: number }>,
): Record<string, unknown> {
  return Object.fromEntries(
    entries.map(({ id, ownerId }) => [
      String(id),
      {
        id,
        owner: ownerId === undefined ? null : { id: ownerId },
        fields: { all: { id } },
      },
    ]),
  );
}

function makeContext(parameters: Record<string, unknown>) {
  return {
    getNode: vi.fn(() => ({ name: 'Mautic Advanced' })),
    getNodeParameter: vi.fn((name: string) => parameters[name]),
    helpers: {
      returnJsonArray: vi.fn((data: unknown) => {
        const items = Array.isArray(data) ? data : [data];
        return items.map((json) => ({ json }));
      }),
    },
  } as any;
}

describe('contact DNC filtering (server-side)', () => {
  beforeEach(() => {
    mockedMakeApiRequest.mockReset();
    mockedMakePaginatedRequest.mockReset();
  });

  test('emailDncOnly adds the dnc:email search token instead of a client-side scan', async () => {
    mockedMakeApiRequest.mockResolvedValueOnce({ contacts: contactsMap([{ id: 1 }, { id: 2 }]) });

    const context = makeContext({
      returnAll: false,
      limit: 10,
      options: { emailDncOnly: true, rawData: true },
    });

    const result = await executeContactOperation(context, 'getAll', 0);

    expect(result).toHaveLength(2);
    expect(mockedMakeApiRequest).toHaveBeenCalledTimes(1);
    expect(mockedMakeApiRequest.mock.calls[0][4]).toMatchObject({
      search: 'dnc:email',
      limit: 10,
    });
  });

  test('anyDncOnly adds dnc:any; smsDncOnly adds dnc:sms', async () => {
    mockedMakeApiRequest.mockResolvedValue({ contacts: contactsMap([{ id: 1 }]) });

    const anyCtx = makeContext({
      returnAll: false,
      limit: 5,
      options: { anyDncOnly: true, rawData: true },
    });
    await executeContactOperation(anyCtx, 'getAll', 0);
    expect(mockedMakeApiRequest.mock.calls[0][4]).toMatchObject({ search: 'dnc:any' });

    mockedMakeApiRequest.mockClear();

    const smsCtx = makeContext({
      returnAll: false,
      limit: 5,
      options: { smsDncOnly: true, rawData: true },
    });
    await executeContactOperation(smsCtx, 'getAll', 0);
    expect(mockedMakeApiRequest.mock.calls[0][4]).toMatchObject({ search: 'dnc:sms' });
  });

  test('returnAll with DNC pages server-side via makePaginatedRequest carrying the token', async () => {
    mockedMakePaginatedRequest.mockResolvedValueOnce(
      Object.values(contactsMap([{ id: 1 }, { id: 2 }, { id: 3 }])),
    );

    const context = makeContext({
      returnAll: true,
      options: { emailDncOnly: true, rawData: true },
    });

    const result = await executeContactOperation(context, 'getAll', 0);

    expect(result).toHaveLength(3);
    expect(mockedMakePaginatedRequest).toHaveBeenCalledTimes(1);
    // signature: (context, resource, method, endpoint, body, query)
    expect(mockedMakePaginatedRequest.mock.calls[0][5]).toMatchObject({ search: 'dnc:email' });
    expect(mockedMakeApiRequest).not.toHaveBeenCalled();
  });
});

describe('contact owner filtering (client-side on owner.id)', () => {
  beforeEach(() => {
    mockedMakeApiRequest.mockReset();
    mockedMakePaginatedRequest.mockReset();
  });

  test('keeps only contacts whose owner.id matches and does not send an owner: token', async () => {
    mockedMakeApiRequest.mockResolvedValueOnce({
      contacts: contactsMap([
        { id: 1, ownerId: 2 },
        { id: 2, ownerId: 5 },
        { id: 3, ownerId: 2 },
        { id: 4 },
      ]),
    });

    const context = makeContext({
      returnAll: false,
      limit: 10,
      options: { owners: [2], rawData: true },
    });

    const result = await executeContactOperation(context, 'getAll', 0);

    expect(result.map((r: any) => r.json.id)).toEqual([1, 3]);
    const sentSearch = (mockedMakeApiRequest.mock.calls[0][4] as any).search ?? '';
    expect(sentSearch).not.toContain('owner:');
  });
});
