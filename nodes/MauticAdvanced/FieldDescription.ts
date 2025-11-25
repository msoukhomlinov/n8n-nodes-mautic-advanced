import type { INodeProperties } from 'n8n-workflow';

export const fieldOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['field'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new field',
        action: 'Create a field',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a field',
        action: 'Delete a field',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get data of a field',
        action: 'Get a field',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get data of many fields',
        action: 'Get many fields',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a field',
        action: 'Update a field',
      },
    ],
    default: 'create',
  },
];

export const fieldFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                field:create                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Field Object',
    name: 'fieldObject',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['create'],
      },
    },
    options: [
      {
        name: 'Contact',
        value: 'contact',
        description: 'Create a field for contacts',
      },
      {
        name: 'Company',
        value: 'company',
        description: 'Create a field for companies',
      },
    ],
    default: 'contact',
    description: 'The type of object this field will be used for',
  },
  {
    displayName: 'Label',
    name: 'label',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The display name of the field',
  },
  {
    displayName: 'Type',
    name: 'type',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['create'],
      },
    },
    options: [
      { name: 'Text', value: 'text' },
      { name: 'Email', value: 'email' },
      { name: 'Number', value: 'number' },
      { name: 'Select', value: 'select' },
      { name: 'Multiselect', value: 'multiselect' },
      { name: 'Boolean', value: 'boolean' },
      { name: 'Date', value: 'date' },
      { name: 'DateTime', value: 'datetime' },
      { name: 'Time', value: 'time' },
      { name: 'Telephone', value: 'tel' },
      { name: 'URL', value: 'url' },
      { name: 'Textarea', value: 'textarea' },
      { name: 'HTML', value: 'html' },
      { name: 'Lookup', value: 'lookup' },
      { name: 'Country', value: 'country' },
      { name: 'Region', value: 'region' },
      { name: 'Timezone', value: 'timezone' },
      { name: 'Locale', value: 'locale' },
    ],
    default: 'text',
    description: 'The type of field to create',
  },
  {
    displayName: 'Alias',
    name: 'alias',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Unique alias for the field. If empty, will be auto-generated from label',
  },
  {
    displayName: 'Group',
    name: 'group',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['create'],
      },
    },
    default: 'core',
    description: 'Group where the field belongs',
  },
  {
    displayName: 'Default Value',
    name: 'defaultValue',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Default value for the field',
  },
  {
    displayName: 'Is Required',
    name: 'isRequired',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['create'],
      },
    },
    default: false,
    description: 'Whether this field is required',
  },
  {
    displayName: 'Is Publicly Updatable',
    name: 'isPubliclyUpdatable',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['create'],
      },
    },
    default: false,
    description: 'Whether public requests can change the field value',
  },
  {
    displayName: 'Is Unique Identifier',
    name: 'isUniqueIdentifier',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['create'],
      },
    },
    default: false,
    description: 'Whether this field is a unique identifier',
  },
  {
    displayName: 'Properties',
    name: 'properties',
    type: 'fixedCollection',
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['create'],
        type: ['select', 'multiselect'],
      },
    },
    typeOptions: {
      multipleValues: false,
    },
    default: {},
    options: [
      {
        name: 'list',
        displayName: 'List Items',
        values: [
          {
            displayName: 'Items',
            name: 'items',
            type: 'fixedCollection',
            typeOptions: {
              multipleValues: true,
            },
            default: {},
            options: [
              {
                name: 'item',
                displayName: 'Item',
                values: [
                  {
                    displayName: 'Label',
                    name: 'label',
                    type: 'string',
                    default: '',
                    description: 'Display label for the option',
                  },
                  {
                    displayName: 'Value',
                    name: 'value',
                    type: 'string',
                    default: '',
                    description: 'Value for the option',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the field',
      },
      {
        displayName: 'Is Published',
        name: 'isPublished',
        type: 'boolean',
        default: true,
        description: 'Whether the field is published and available for use',
      },
      {
        displayName: 'Order',
        name: 'order',
        type: 'number',
        default: 0,
        description: 'Order number of the field',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                field:update                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Field Object',
    name: 'fieldObject',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['update'],
      },
    },
    options: [
      {
        name: 'Contact',
        value: 'contact',
        description: 'Update a contact field',
      },
      {
        name: 'Company',
        value: 'company',
        description: 'Update a company field',
      },
    ],
    default: 'contact',
    description: 'The type of object this field is for',
  },
  {
    displayName: 'Field ID',
    name: 'fieldId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['update'],
      },
    },
    default: '',
    description: 'The ID of the field to update',
  },
  {
    displayName: 'Create If Not Found',
    name: 'createIfNotFound',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['update'],
      },
    },
    default: false,
    description: 'Whether to create a new field if one with the given ID is not found',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Alias',
        name: 'alias',
        type: 'string',
        default: '',
        description: 'Unique alias for the field',
      },
      {
        displayName: 'Default Value',
        name: 'defaultValue',
        type: 'string',
        default: '',
        description: 'Default value for the field',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the field',
      },
      {
        displayName: 'Group',
        name: 'group',
        type: 'string',
        default: '',
        description: 'Group where the field belongs',
      },
      {
        displayName: 'Is Published',
        name: 'isPublished',
        type: 'boolean',
        default: true,
        description: 'Whether the field is published and available for use',
      },
      {
        displayName: 'Is Publicly Updatable',
        name: 'isPubliclyUpdatable',
        type: 'boolean',
        default: false,
        description: 'Whether public requests can change the field value',
      },
      {
        displayName: 'Is Required',
        name: 'isRequired',
        type: 'boolean',
        default: false,
        description: 'Whether this field is required',
      },
      {
        displayName: 'Is Unique Identifier',
        name: 'isUniqueIdentifier',
        type: 'boolean',
        default: false,
        description: 'Whether this field is a unique identifier',
      },
      {
        displayName: 'Label',
        name: 'label',
        type: 'string',
        default: '',
        description: 'The display name of the field',
      },
      {
        displayName: 'Order',
        name: 'order',
        type: 'number',
        default: 0,
        description: 'Order number of the field',
      },
      {
        displayName: 'Properties',
        name: 'properties',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: false,
        },
        default: {},
        options: [
          {
            name: 'list',
            displayName: 'List Items',
            values: [
              {
                displayName: 'Items',
                name: 'items',
                type: 'fixedCollection',
                typeOptions: {
                  multipleValues: true,
                },
                default: {},
                options: [
                  {
                    name: 'item',
                    displayName: 'Item',
                    values: [
                      {
                        displayName: 'Label',
                        name: 'label',
                        type: 'string',
                        default: '',
                        description: 'Display label for the option',
                      },
                      {
                        displayName: 'Value',
                        name: 'value',
                        type: 'string',
                        default: '',
                        description: 'Value for the option',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'Text', value: 'text' },
          { name: 'Email', value: 'email' },
          { name: 'Number', value: 'number' },
          { name: 'Select', value: 'select' },
          { name: 'Multiselect', value: 'multiselect' },
          { name: 'Boolean', value: 'boolean' },
          { name: 'Date', value: 'date' },
          { name: 'DateTime', value: 'datetime' },
          { name: 'Time', value: 'time' },
          { name: 'Telephone', value: 'tel' },
          { name: 'URL', value: 'url' },
          { name: 'Textarea', value: 'textarea' },
          { name: 'HTML', value: 'html' },
          { name: 'Lookup', value: 'lookup' },
          { name: 'Country', value: 'country' },
          { name: 'Region', value: 'region' },
          { name: 'Timezone', value: 'timezone' },
          { name: 'Locale', value: 'locale' },
        ],
        default: 'text',
        description: 'The type of field',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                  field:get                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Field Object',
    name: 'fieldObject',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['get'],
      },
    },
    options: [
      {
        name: 'Contact',
        value: 'contact',
        description: 'Get a contact field',
      },
      {
        name: 'Company',
        value: 'company',
        description: 'Get a company field',
      },
    ],
    default: 'contact',
    description: 'The type of object this field is for',
  },
  {
    displayName: 'Field ID',
    name: 'fieldId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['get'],
      },
    },
    default: '',
    description: 'The ID of the field to return',
  },

  /* -------------------------------------------------------------------------- */
  /*                                field:getAll                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Field Object',
    name: 'fieldObject',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        name: 'Contact',
        value: 'contact',
        description: 'Get contact fields',
      },
      {
        name: 'Company',
        value: 'company',
        description: 'Get company fields',
      },
    ],
    default: 'contact',
    description: 'The type of object to get fields for',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['getAll'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
    },
    default: 50,
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'String or search command to filter fields by',
      },
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        default: '',
        description: 'Column to sort by',
      },
      {
        displayName: 'Order By Direction',
        name: 'orderByDir',
        type: 'options',
        options: [
          {
            name: 'ASC',
            value: 'asc',
          },
          {
            name: 'DESC',
            value: 'desc',
          },
        ],
        default: 'asc',
        description: 'Sort direction',
      },
      {
        displayName: 'Published Only',
        name: 'publishedOnly',
        type: 'boolean',
        default: false,
        description: 'Whether to return only currently published fields',
      },
      {
        displayName: 'Minimal',
        name: 'minimal',
        type: 'boolean',
        default: false,
        description: 'Whether to return array of fields without additional lists',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                field:delete                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Field Object',
    name: 'fieldObject',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['delete'],
      },
    },
    options: [
      {
        name: 'Contact',
        value: 'contact',
        description: 'Delete a contact field',
      },
      {
        name: 'Company',
        value: 'company',
        description: 'Delete a company field',
      },
    ],
    default: 'contact',
    description: 'The type of object this field is for',
  },
  {
    displayName: 'Field ID',
    name: 'fieldId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['field'],
        operation: ['delete'],
      },
    },
    default: '',
    description: 'The ID of the field to delete',
  },
];
