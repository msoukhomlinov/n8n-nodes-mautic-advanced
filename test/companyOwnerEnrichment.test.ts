import { beforeEach, describe, expect, test, vi } from 'vitest';

// Mock the request layer so no network happens, and force v2 detection to "usable".
vi.mock('../nodes/MauticAdvanced/utils/ApiHelpers', async () => {
  const actual = await vi.importActual<typeof import('../nodes/MauticAdvanced/utils/ApiHelpers')>(
    '../nodes/MauticAdvanced/utils/ApiHelpers',
  );
  return { ...actual, makeApiRequest: vi.fn(), makePaginatedRequest: vi.fn() };
});

vi.mock('../nodes/MauticAdvanced/GenericFunctions', async () => {
  const actual = await vi.importActual<
    typeof import('../nodes/MauticAdvanced/GenericFunctions')
  >('../nodes/MauticAdvanced/GenericFunctions');
  return { ...actual, getMauticV2Status: vi.fn(), getMauticVersion: vi.fn() };
});

import { executeCompanyOperation } from '../nodes/MauticAdvanced/operations/CompanyOperations';
import { makeApiRequest, makePaginatedRequest } from '../nodes/MauticAdvanced/utils/ApiHelpers';
import { getMauticV2Status } from '../nodes/MauticAdvanced/GenericFunctions';

const mockedMakeApiRequest = vi.mocked(makeApiRequest);
const mockedMakePaginatedRequest = vi.mocked(makePaginatedRequest);
const mockedV2Status = vi.mocked(getMauticV2Status);

function makeContext(parameters: Record<string, unknown>) {
  return {
    getNode: vi.fn(() => ({ name: 'Mautic Advanced' })),
    getNodeParameter: vi.fn((name: string, _i?: number, def?: unknown) =>
      name in parameters ? parameters[name] : def,
    ),
    logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn(), debug: vi.fn() },
    helpers: {
      returnJsonArray: vi.fn((data: unknown) => {
        const items = Array.isArray(data) ? data : [data];
        return items.map((json) => ({ json }));
      }),
    },
  } as any;
}

describe('company owner enrichment — Get (single)', () => {
  beforeEach(() => {
    mockedMakeApiRequest.mockReset();
    mockedMakePaginatedRequest.mockReset();
    mockedV2Status.mockReset();
  });

  test('resolves owner id from JSON-LD @id and keeps custom fields', async () => {
    mockedV2Status.mockResolvedValue('usable');
    mockedMakeApiRequest.mockImplementation(async (_ctx, _m, endpoint) => {
      if (endpoint === '/companies/5') {
        return { company: { id: 5, fields: { all: { companyname: 'Acme', custom_x: 'y' } } } };
      }
      if (endpoint === '/v2/companies/5') {
        return { '@id': '/api/v2/companies/5', owner: { '@id': '/api/v2/users/3', '@type': 'User' } };
      }
      throw new Error(`unexpected endpoint ${endpoint}`);
    });

    const context = makeContext({ companyId: '5', simple: false });
    const result = await executeCompanyOperation(context, 'get', 0);

    expect(result[0].json).toMatchObject({ id: 5, owner: { id: 3 } });
    expect((result[0].json as any).fields.all.custom_x).toBe('y');
  });

  test('parses a bare IRI string owner', async () => {
    mockedV2Status.mockResolvedValue('usable');
    mockedMakeApiRequest.mockImplementation(async (_ctx, _m, endpoint) => {
      if (endpoint === '/companies/8') return { company: { id: 8, fields: { all: {} } } };
      if (endpoint === '/v2/companies/8') return { owner: '/api/v2/users/7' };
      throw new Error(`unexpected ${endpoint}`);
    });
    const context = makeContext({ companyId: '8', simple: false });
    const result = await executeCompanyOperation(context, 'get', 0);
    expect(result[0].json).toMatchObject({ owner: { id: 7 } });
  });

  test('owner null when v7 owner is null', async () => {
    mockedV2Status.mockResolvedValue('usable');
    mockedMakeApiRequest.mockImplementation(async (_ctx, _m, endpoint) => {
      if (endpoint === '/companies/9') return { company: { id: 9, fields: { all: {} } } };
      if (endpoint === '/v2/companies/9') return { owner: null };
      throw new Error(`unexpected ${endpoint}`);
    });
    const context = makeContext({ companyId: '9', simple: false });
    const result = await executeCompanyOperation(context, 'get', 0);
    expect((result[0].json as any).owner).toBeNull();
  });

  test('unauthorized v2 logs a warning and leaves v1 data (no v7 call)', async () => {
    mockedV2Status.mockResolvedValue('unauthorized');
    mockedMakeApiRequest.mockImplementation(async (_ctx, _m, endpoint) => {
      if (endpoint === '/companies/5') return { company: { id: 5, fields: { all: { x: 1 } } } };
      throw new Error(`unexpected ${endpoint}`);
    });
    const context = makeContext({ companyId: '5', simple: false });
    const result = await executeCompanyOperation(context, 'get', 0);
    expect((result[0].json as any).id).toBe(5);
    expect(context.logger.warn).toHaveBeenCalledTimes(1);
    // only the v1 call happened
    expect(mockedMakeApiRequest).toHaveBeenCalledTimes(1);
  });
});

describe('company owner enrichment — Get Many (bounded map)', () => {
  beforeEach(() => {
    mockedMakeApiRequest.mockReset();
    mockedMakePaginatedRequest.mockReset();
    mockedV2Status.mockReset();
  });

  test('enriches only returned IDs and early-stops the v2 scan (hydra:member)', async () => {
    mockedV2Status.mockResolvedValue('usable');
    mockedMakeApiRequest.mockImplementation(async (_ctx, _m, endpoint, _b, qs) => {
      if (endpoint === '/companies') {
        return { companies: { '1': { id: 1, fields: { all: {} } }, '2': { id: 2, fields: { all: {} } } } };
      }
      if (endpoint === '/v2/companies') {
        // page 1 contains both needed ids (1,2) plus an extra (3) -> early stop after this page
        if ((qs as any).page === 1) {
          return {
            'hydra:member': [
              { id: 1, owner: { '@id': '/api/v2/users/10' } },
              { id: 2, owner: { '@id': '/api/v2/users/20' } },
              { id: 3, owner: { '@id': '/api/v2/users/30' } },
            ],
            'hydra:totalItems': 3,
          };
        }
        throw new Error('should have early-stopped; page 2 must not be fetched');
      }
      throw new Error(`unexpected ${endpoint}`);
    });

    const context = makeContext({ returnAll: false, simple: false, additionalFields: {}, limit: 2 });
    const result = await executeCompanyOperation(context, 'getAll', 0);

    const byId = Object.fromEntries(result.map((r: any) => [r.json.id, r.json.owner]));
    expect(byId[1]).toMatchObject({ id: 10 });
    expect(byId[2]).toMatchObject({ id: 20 });
    // v1 list (1) + v2 page 1 (1) = 2 calls; no page 2
    expect(mockedMakeApiRequest).toHaveBeenCalledTimes(2);
  });

  test('reads API Platform 4.x member/totalItems keys too', async () => {
    mockedV2Status.mockResolvedValue('usable');
    mockedMakeApiRequest.mockImplementation(async (_ctx, _m, endpoint, _b, qs) => {
      if (endpoint === '/companies') return { companies: { '1': { id: 1, fields: { all: {} } } } };
      if (endpoint === '/v2/companies') {
        if ((qs as any).page === 1) {
          return { member: [{ id: 1, owner: '/api/v2/users/42' }], totalItems: 1 };
        }
        throw new Error('unexpected page 2');
      }
      throw new Error(`unexpected ${endpoint}`);
    });

    const context = makeContext({ returnAll: false, simple: false, additionalFields: {}, limit: 1 });
    const result = await executeCompanyOperation(context, 'getAll', 0);
    expect((result[0].json as any).owner).toMatchObject({ id: 42 });
  });

  test('skips v2 entirely when v1 returns no companies', async () => {
    mockedV2Status.mockResolvedValue('usable');
    mockedMakeApiRequest.mockImplementation(async (_ctx, _m, endpoint) => {
      if (endpoint === '/companies') return { companies: {} };
      throw new Error(`unexpected ${endpoint}`);
    });
    const context = makeContext({ returnAll: false, simple: false, additionalFields: {}, limit: 5 });
    const result = await executeCompanyOperation(context, 'getAll', 0);
    expect(result).toHaveLength(0);
    expect(mockedMakeApiRequest).toHaveBeenCalledTimes(1); // only v1 list
  });
});
