import type { INodeProperties } from 'n8n-workflow';

export const campaignOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['campaign'],
      },
    },
    options: [
      {
        name: 'Clone',
        value: 'clone',
        description: 'Clone a campaign',
        action: 'Clone a campaign',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new campaign',
        action: 'Create a campaign',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a campaign',
        action: 'Delete a campaign',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a campaign',
        action: 'Get a campaign',
      },
      {
        name: 'Get All',
        value: 'getAll',
        description: 'Get all campaigns',
        action: 'Get all campaigns',
      },
      {
        name: 'Get Contacts',
        value: 'getContacts',
        description: "Get a campaign's contacts",
        action: 'Get a campaigns contacts',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a campaign',
        action: 'Update a campaign',
      },
    ],
    default: 'getAll',
  },
];

export const campaignFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                 campaign:create                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Name of the campaign',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['create'],
      },
    },
    default: {},
    placeholder: 'Add Field',
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the campaign',
      },
      {
        displayName: 'Is Published',
        name: 'isPublished',
        type: 'boolean',
        default: false,
        description: 'Whether the campaign is published',
      },
      {
        displayName: 'Publish Down',
        name: 'publishDown',
        type: 'dateTime',
        default: '',
        description: 'Date/time the campaign should be unpublished',
      },
      {
        displayName: 'Publish Up',
        name: 'publishUp',
        type: 'dateTime',
        default: '',
        description: 'Date/time when the campaign should be published',
      },
    ],
  },
  /* -------------------------------------------------------------------------- */
  /*                                 campaign:update                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Campaign ID',
    name: 'campaignId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['update'],
      },
    },
    default: '',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['update'],
      },
    },
    default: {},
    placeholder: 'Add Field',
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the campaign',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the campaign',
      },
      {
        displayName: 'Is Published',
        name: 'isPublished',
        type: 'boolean',
        default: false,
        description: 'Whether the campaign is published',
      },
      {
        displayName: 'Publish Down',
        name: 'publishDown',
        type: 'dateTime',
        default: '',
        description: 'Date/time the campaign should be unpublished',
      },
      {
        displayName: 'Publish Up',
        name: 'publishUp',
        type: 'dateTime',
        default: '',
        description: 'Date/time when the campaign should be published',
      },
    ],
  },
  /* -------------------------------------------------------------------------- */
  /*                                 campaign:clone                             */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Campaign ID',
    name: 'campaignId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['clone'],
      },
    },
    default: '',
  },
  /* -------------------------------------------------------------------------- */
  /*                                 campaign:get                               */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Campaign ID',
    name: 'campaignId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['get'],
      },
    },
    default: '',
  },
  /* -------------------------------------------------------------------------- */
  /*                                 campaign:delete                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Campaign ID',
    name: 'campaignId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['delete'],
      },
    },
    default: '',
  },
  /* -------------------------------------------------------------------------- */
  /*                                 campaign:getAll                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['campaign'],
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
        resource: ['campaign'],
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
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['getAll'],
      },
    },
    default: {},
    placeholder: 'Add Field',
    options: [
      {
        displayName: 'Minimal',
        name: 'minimal',
        type: 'boolean',
        default: false,
        description: 'Return only array of entities without additional lists in it',
      },
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        default: '',
        description: 'Column to sort by. Can use any column listed in the response.',
      },
      {
        displayName: 'Order By Dir',
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
        description: 'Only return currently published entities',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'String or search command to filter entities by',
      },
    ],
  },
  /* -------------------------------------------------------------------------- */
  /*                                 campaign:getContacts                       */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Campaign ID',
    name: 'campaignId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['getContacts'],
      },
    },
    default: '',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['getContacts'],
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
        resource: ['campaign'],
        operation: ['getContacts'],
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
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['getContacts'],
      },
    },
    default: {},
    placeholder: 'Add Field',
    options: [
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        default: '',
        description: 'Column to sort by. Can use any column listed in the response.',
      },
      {
        displayName: 'Order By Dir',
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
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'String or search command to filter entities by',
      },
    ],
  },
];
