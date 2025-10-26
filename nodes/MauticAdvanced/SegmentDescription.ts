import type { INodeProperties } from 'n8n-workflow';

export const segmentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['segment'],
      },
    },
    options: [
      {
        name: 'Add Contact',
        value: 'addContact',
        description: 'Add a contact to a segment',
        action: 'Add a contact to a segment',
      },
      {
        name: 'Add Contacts',
        value: 'addContacts',
        description: 'Add contacts to a segment',
        action: 'Add contacts to a segment',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new segment',
        action: 'Create a segment',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a segment',
        action: 'Delete a segment',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get data of a segment',
        action: 'Get a segment',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get data of many segments',
        action: 'Get many segments',
      },
      {
        name: 'Remove Contact',
        value: 'removeContact',
        description: 'Remove a contact from a segment',
        action: 'Remove a contact from a segment',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a segment',
        action: 'Update a segment',
      },
    ],
    default: 'create',
  },
];

export const segmentFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                segment:create                              */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['segment'],
        operation: ['create', 'update'],
      },
    },
    default: '',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['segment'],
        operation: ['create', 'update'],
      },
    },
    options: [
      {
        displayName: 'Alias',
        name: 'alias',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Is Published',
        name: 'isPublished',
        type: 'boolean',
        default: true,
      },
      {
        displayName: 'Is Global',
        name: 'isGlobal',
        type: 'boolean',
        default: false,
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'fixedCollection',
        placeholder: 'Add Filter',
        typeOptions: {
          multiple: true,
        },
        default: {},
        options: [
          {
            displayName: 'Filter',
            name: 'filter',
            values: [
              {
                displayName: 'Glue',
                name: 'glue',
                type: 'options',
                options: [
                  { name: 'And', value: 'and' },
                  { name: 'Or', value: 'or' },
                ],
                default: 'and',
              },
              {
                displayName: 'Field',
                name: 'field',
                type: 'string',
                default: 'email',
              },
              {
                displayName: 'Object',
                name: 'object',
                type: 'options',
                options: [
                  { name: 'Contact', value: 'lead' },
                  { name: 'Company', value: 'company' },
                ],
                default: 'lead',
              },
              {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: [
                  { name: 'Boolean', value: 'boolean' },
                  { name: 'Date', value: 'date' },
                  { name: 'DateTime', value: 'datetime' },
                  { name: 'Email', value: 'email' },
                  { name: 'Country', value: 'country' },
                  { name: 'Locale', value: 'locale' },
                  { name: 'Lookup', value: 'lookup' },
                  { name: 'Number', value: 'number' },
                  { name: 'Tel', value: 'tel' },
                  { name: 'Region', value: 'region' },
                  { name: 'Select', value: 'select' },
                  { name: 'Multiselect', value: 'multiselect' },
                  { name: 'Text', value: 'text' },
                  { name: 'Textarea', value: 'textarea' },
                  { name: 'Time', value: 'time' },
                  { name: 'Timezone', value: 'timezone' },
                  { name: 'URL', value: 'url' },
                ],
                default: 'email',
              },
              {
                displayName: 'Filter',
                name: 'filter',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Operator',
                name: 'operator',
                type: 'options',
                options: [
                  { name: '=', value: '=' },
                  { name: '!=', value: '!=' },
                  { name: '>', value: 'gt' },
                  { name: '>=', value: 'gte' },
                  { name: '<', value: 'lt' },
                  { name: '<=', value: 'lte' },
                  { name: 'Empty', value: 'empty' },
                  { name: 'Not Empty', value: '!empty' },
                  { name: 'Like', value: 'like' },
                  { name: 'Not Like', value: '!like' },
                  { name: 'Regexp', value: 'regexp' },
                  { name: 'Not Regexp', value: '!regexp' },
                  { name: 'Starts With', value: 'startsWith' },
                  { name: 'Ends With', value: 'endsWith' },
                  { name: 'Contains', value: 'contains' },
                  { name: 'In', value: 'in' },
                  { name: 'Not In', value: '!in' },
                  { name: 'Between', value: 'between' },
                  { name: 'Not Between', value: '!between' },
                ],
                default: 'like',
              },
              {
                displayName: 'Display',
                name: 'display',
                type: 'string',
                default: '',
                description: 'Optional display name for the filter',
              },
            ],
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                segment:update                              */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Segment ID',
    name: 'segmentId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['segment'],
        operation: ['update', 'addContact', 'addContacts', 'removeContact'],
      },
    },
    default: '',
  },
  {
    displayName: 'Create If Not Found',
    name: 'createIfNotFound',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['segment'],
        operation: ['update'],
      },
    },
    default: false,
    description: 'Whether to create a segment if the given ID is not found',
  },

  /* -------------------------------------------------------------------------- */
  /*                                 segment:get                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Segment ID',
    name: 'segmentId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['segment'],
        operation: ['get', 'delete'],
      },
    },
    default: '',
  },

  /* -------------------------------------------------------------------------- */
  /*                                 segment:getAll                             */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['segment'],
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
        resource: ['segment'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
    },
    default: 30,
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
        resource: ['segment'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'String or search command to filter entities by',
      },
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Order By Direction',
        name: 'orderByDir',
        type: 'options',
        options: [
          { name: 'ASC', value: 'asc' },
          { name: 'DESC', value: 'desc' },
        ],
        default: 'asc',
      },
      {
        displayName: 'Published Only',
        name: 'publishedOnly',
        type: 'boolean',
        default: false,
      },
      {
        displayName: 'Minimal',
        name: 'minimal',
        type: 'boolean',
        default: false,
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                           segment:addContact                               */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['segment'],
        operation: ['addContact', 'removeContact'],
      },
    },
    default: '',
  },

  /* -------------------------------------------------------------------------- */
  /*                           segment:addContacts                              */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact IDs',
    name: 'contactIds',
    type: 'string',
    required: false,
    displayOptions: {
      show: {
        resource: ['segment'],
        operation: ['addContacts'],
      },
    },
    default: '',
    description:
      "Comma-separated list of contact IDs to add. If left empty, all input items' contactId or id fields will be used for batch adding.",
  },
];
