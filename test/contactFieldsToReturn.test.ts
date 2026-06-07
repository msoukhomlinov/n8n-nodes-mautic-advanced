import { describe, expect, test, vi } from 'vitest';
import { processContactFields } from '../nodes/MauticAdvanced/utils/DataHelpers';

vi.mock('../nodes/MauticAdvanced/GenericFunctions', () => {
  return {
    validateJSON: vi.fn((json: string) => JSON.parse(json)),
    mauticApiRequest: vi.fn(),
    mauticApiRequestAllItems: vi.fn(async () => [
      { label: 'Email', alias: 'email' },
      { label: 'Date Last Active', alias: 'last_active' },
      { label: 'Date Identified', alias: 'date_identified' },
      { label: 'Customer Type', alias: 'customer_type' },
    ]),
  };
});

describe('contact fields to return', () => {
  test('filters raw contact data to selected top-level and custom fields', () => {
    const contact = {
      id: '123',
      dateAdded: '2026-01-15T00:00:00+00:00',
      points: 50,
      tags: [{ tag: 'customer' }, { tag: 'vip' }],
      fields: {
        core: {
          customer_type: {
            id: 48,
            label: 'Customer Type',
            alias: 'customer_type',
            value: 'Gold',
            normalizedValue: 'Gold',
          },
        },
        all: {
          id: '123',
          email: 'person@example.test',
          customer_type: 'Gold',
        },
      },
    };

    expect(
      processContactFields([contact], {
        rawData: true,
        fieldsToReturn: ['id', 'customer_type', 'tags'],
      }),
    ).toEqual([
      {
        id: '123',
        customer_type: 'Gold',
        tags: [{ tag: 'customer' }, { tag: 'vip' }],
      },
    ]);
  });

  test('keeps full raw contact data when raw data is enabled without selected fields', () => {
    const contact = {
      id: '123',
      tags: [{ tag: 'customer' }],
      fields: {
        all: {
          email: 'person@example.test',
        },
      },
    };

    expect(processContactFields([contact], { rawData: true, fieldsToReturn: [] })).toEqual([
      contact,
    ]);
  });

  test('keeps selected null field values instead of falling back to raw data', () => {
    const contact = {
      customer_type: 'raw fallback value',
      fields: {
        all: {
          customer_type: null,
        },
      },
    };

    expect(
      processContactFields([contact], {
        rawData: false,
        fieldsToReturn: ['customer_type'],
      }),
    ).toEqual([{ customer_type: null }]);
  });

  test('filters selected custom and top-level fields when raw data is off', () => {
    const contact = {
      id: 123,
      points: 50,
      tags: [{ tag: 'customer' }],
      fields: {
        all: {
          id: 123,
          firstname: 'Alex',
          lastname: 'Example',
          email: 'person@example.test',
          customer_type: 'Gold',
        },
      },
    };

    expect(
      processContactFields([contact], {
        rawData: false,
        fieldsToReturn: ['firstname', 'customer_type', 'tags'],
      }),
    ).toEqual([
      {
        firstname: 'Alex',
        customer_type: 'Gold',
        tags: [{ tag: 'customer' }],
      },
    ]);
  });

  test('maps legacy field aliases to raw contact metadata fields', () => {
    const contact = {
      dateAdded: '2026-01-15T00:00:00+00:00',
      dateModified: '2026-01-16T00:00:00+00:00',
      dateIdentified: '2026-01-17T00:00:00+00:00',
      owner: { id: 42, username: 'owner@example.test' },
      fields: { all: {} },
    };

    expect(
      processContactFields([contact], {
        rawData: true,
        fieldsToReturn: ['date_added', 'date_modified', 'date_identified', 'owner_id'],
      }),
    ).toEqual([
      {
        date_added: '2026-01-15T00:00:00+00:00',
        date_modified: '2026-01-16T00:00:00+00:00',
        date_identified: '2026-01-17T00:00:00+00:00',
        owner_id: 42,
      },
    ]);
  });

  test('offers raw properties only in contact fields to return options', async () => {
    const { MauticAdvanced } = await import('../nodes/MauticAdvanced/MauticAdvanced.node');
    const node = new MauticAdvanced();
    const loadOptionsContext = {
      getNodeParameter: vi.fn(() => 'credentials'),
      getCredentials: vi.fn(async () => ({
        url: 'https://mautic.example.test',
        mauticVersion: 'v6',
      })),
    };

    const fields = await node.methods.loadOptions.getContactFieldsToReturn.call(
      loadOptionsContext as never,
    );

    expect(fields).toEqual(
      expect.arrayContaining([
        { name: 'ID', value: 'id' },
        { name: 'Tags', value: 'tags' },
        { name: 'Do Not Contact', value: 'doNotContact' },
        { name: 'Customer Type', value: 'customer_type' },
      ]),
    );
    expect(fields.filter((field) => field.value === 'last_active')).toHaveLength(1);
    expect(fields.filter((field) => field.value === 'date_identified')).toHaveLength(1);
    expect(fields).not.toEqual(
      expect.arrayContaining([
        { name: 'Last Active', value: 'lastActive' },
        { name: 'Date Identified', value: 'dateIdentified' },
      ]),
    );

    await expect(
      node.methods.loadOptions.getContactFields.call(loadOptionsContext as never),
    ).resolves.not.toEqual(expect.arrayContaining([{ name: 'Tags', value: 'tags' }]));
  });
});
