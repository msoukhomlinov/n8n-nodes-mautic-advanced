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

describe('contact editDoNotContactList', () => {
  beforeEach(() => {
    mockedMakeApiRequest.mockReset();
    mockedMakePaginatedRequest.mockReset();
  });

  test('sends reason, channelId and comments from the additionalFields collection', async () => {
    mockedMakeApiRequest.mockResolvedValueOnce({ contact: { id: 7 } });

    const context = makeContext({
      contactId: '7',
      action: 'add',
      channel: 'email',
      additionalFields: {
        reason: '1',
        channelId: '42',
        comments: 'Bounced: user unknown',
      },
    });

    await executeContactOperation(context, 'editDoNotContactList', 0);

    expect(mockedMakeApiRequest).toHaveBeenCalledTimes(1);
    expect(mockedMakeApiRequest).toHaveBeenCalledWith(
      context,
      'POST',
      '/contacts/7/dnc/email/add',
      { reason: '1', channelId: '42', comments: 'Bounced: user unknown' },
    );
  });

  test('defaults to Manual (3) and omits empty channelId/comments when additionalFields is empty', async () => {
    mockedMakeApiRequest.mockResolvedValueOnce({ contact: { id: 7 } });

    const context = makeContext({
      contactId: '7',
      action: 'add',
      channel: 'email',
      additionalFields: {},
    });

    await executeContactOperation(context, 'editDoNotContactList', 0);

    expect(mockedMakeApiRequest).toHaveBeenCalledTimes(1);
    expect(mockedMakeApiRequest).toHaveBeenCalledWith(
      context,
      'POST',
      '/contacts/7/dnc/email/add',
      { reason: 3 },
    );
  });

  test('removes from the DNC list on the given channel and still sends comments', async () => {
    mockedMakeApiRequest.mockResolvedValueOnce({ contact: { id: 7 } });

    const context = makeContext({
      contactId: '7',
      action: 'remove',
      channel: 'sms',
      additionalFields: { comments: 'ok' },
    });

    await executeContactOperation(context, 'editDoNotContactList', 0);

    expect(mockedMakeApiRequest).toHaveBeenCalledTimes(1);
    expect(mockedMakeApiRequest).toHaveBeenCalledWith(
      context,
      'POST',
      '/contacts/7/dnc/sms/remove',
      { reason: 3, comments: 'ok' },
    );
  });
});
