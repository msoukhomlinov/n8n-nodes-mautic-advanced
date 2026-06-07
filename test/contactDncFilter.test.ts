import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../nodes/MauticAdvanced/utils/ApiHelpers', async () => {
  const actual = await vi.importActual<typeof import('../nodes/MauticAdvanced/utils/ApiHelpers')>(
    '../nodes/MauticAdvanced/utils/ApiHelpers',
  );

  return {
    ...actual,
    makeApiRequest: vi.fn(),
  };
});

import { executeContactOperation } from '../nodes/MauticAdvanced/operations/ContactOperations';
import { makeApiRequest } from '../nodes/MauticAdvanced/utils/ApiHelpers';

const mockedMakeApiRequest = vi.mocked(makeApiRequest);

function makeDncContacts(count: number, startId: number): Record<string, unknown> {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => {
      const id = startId + index;
      return [
        String(id),
        {
          id,
          doNotContact: [{ channel: 'email' }],
          fields: { all: { id } },
        },
      ];
    }),
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

describe('contact DNC filtering', () => {
  beforeEach(() => {
    mockedMakeApiRequest.mockReset();
  });

  test('returns all matching DNC contacts when returnAll is enabled', async () => {
    mockedMakeApiRequest
      .mockResolvedValueOnce({ contacts: makeDncContacts(100, 1) })
      .mockResolvedValueOnce({ contacts: makeDncContacts(5, 101) });

    const context = makeContext({
      returnAll: true,
      options: { emailDncOnly: true, rawData: true },
    });

    const result = await executeContactOperation(context, 'getAll', 0);

    expect(result).toHaveLength(105);
    expect(result[0].json).toMatchObject({ id: 1 });
    expect(result[104].json).toMatchObject({ id: 105 });
    expect(mockedMakeApiRequest).toHaveBeenCalledTimes(2);
    expect(mockedMakeApiRequest.mock.calls[0][4]).toMatchObject({ start: 0, limit: 100 });
    expect(mockedMakeApiRequest.mock.calls[1][4]).toMatchObject({ start: 100, limit: 100 });
  });

  test('stops at the requested limit when returnAll is disabled', async () => {
    mockedMakeApiRequest.mockResolvedValueOnce({ contacts: makeDncContacts(10, 1) });

    const context = makeContext({
      returnAll: false,
      limit: 10,
      options: { emailDncOnly: true, rawData: true },
    });

    const result = await executeContactOperation(context, 'getAll', 0);

    expect(result).toHaveLength(10);
    expect(mockedMakeApiRequest).toHaveBeenCalledTimes(1);
    expect(mockedMakeApiRequest.mock.calls[0][4]).toMatchObject({ start: 0, limit: 10 });
  });
});
