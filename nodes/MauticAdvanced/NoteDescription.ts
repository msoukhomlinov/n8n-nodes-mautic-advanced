import type { INodeProperties } from 'n8n-workflow';

const noteTypeOptions = [
  { name: 'General', value: 'general' },
  { name: 'Email', value: 'email' },
  { name: 'Call', value: 'call' },
  { name: 'Meeting', value: 'meeting' },
];

export const noteOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['note'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new contact note',
        action: 'Create a note',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a note',
        action: 'Delete a note',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get data of a note',
        action: 'Get a note',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get data of many notes',
        action: 'Get many notes',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a note',
        action: 'Update a note',
      },
    ],
    default: 'create',
  },
];

export const noteFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                note:create                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'lead',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'ID of the contact this note belongs to',
  },
  {
    displayName: 'Text',
    name: 'text',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Note text',
  },
  {
    displayName: 'Type',
    name: 'type',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['create'],
      },
    },
    options: noteTypeOptions,
    default: 'general',
    description: 'Note type',
  },
  {
    displayName: 'Date Time',
    name: 'datetime',
    type: 'dateTime',
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Date and time related to the note',
  },

  /* -------------------------------------------------------------------------- */
  /*                                note:update                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Note ID',
    name: 'noteId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['update'],
      },
    },
    default: '',
    description: 'The ID of the note to update',
  },
  {
    displayName: 'Create If Not Found',
    name: 'createIfNotFound',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['update'],
      },
    },
    default: false,
    description: 'Whether to create a new note if one with the given ID is not found',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Date Time',
        name: 'datetime',
        type: 'dateTime',
        default: '',
        description: 'Date and time related to the note',
      },
      {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        default: '',
        description: 'Note text',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: noteTypeOptions,
        default: 'general',
        description: 'Note type',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                  note:get                                  */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Note ID',
    name: 'noteId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['get'],
      },
    },
    default: '',
    description: 'The ID of the note to return',
  },

  /* -------------------------------------------------------------------------- */
  /*                                note:getAll                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['note'],
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
        resource: ['note'],
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
        resource: ['note'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Minimal',
        name: 'minimal',
        type: 'boolean',
        default: false,
        description: 'Whether to return a minimal set of data',
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
          { name: 'ASC', value: 'asc' },
          { name: 'DESC', value: 'desc' },
        ],
        default: 'asc',
        description: 'Sort direction',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'String or search command to filter notes by',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                note:delete                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Note ID',
    name: 'noteId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['delete'],
      },
    },
    default: '',
    description: 'The ID of the note to delete',
  },
];
