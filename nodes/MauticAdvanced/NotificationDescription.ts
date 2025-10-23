import type { INodeProperties } from 'n8n-workflow';

export const notificationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['notification'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new notification',
        action: 'Create a notification',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a notification',
        action: 'Delete a notification',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get data of a notification',
        action: 'Get a notification',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get data of many notifications',
        action: 'Get many notifications',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a notification',
        action: 'Update a notification',
      },
    ],
    default: 'create',
  },
];

export const notificationFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                notification:create                         */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Title of the notification',
  },
  {
    displayName: 'Heading',
    name: 'heading',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Heading of the notification',
  },
  {
    displayName: 'Message',
    name: 'message',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Message of the notification',
  },
  {
    displayName: 'URL',
    name: 'url',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'URL to go to when the notification gets clicked',
  },
  {
    displayName: 'Is Published',
    name: 'isPublished',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['create'],
      },
    },
    default: false,
    description: 'Whether the notification is published',
  },
  {
    displayName: 'Language',
    name: 'language',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Language locale of the notification (e.g., en, fr, de)',
  },
  {
    displayName: 'Publish Up',
    name: 'publishUp',
    type: 'dateTime',
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Date/time when the notification should be published',
  },
  {
    displayName: 'Publish Down',
    name: 'publishDown',
    type: 'dateTime',
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Date/time when the notification should be unpublished',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Category',
        name: 'category',
        type: 'string',
        default: '',
        description: 'Category for the notification',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                notification:update                         */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Notification ID',
    name: 'notificationId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['update'],
      },
    },
    default: '',
    description: 'The ID of the notification to update',
  },
  {
    displayName: 'Create If Not Found',
    name: 'createIfNotFound',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['update'],
      },
    },
    default: false,
    description: 'Whether to create a new notification if one with the given ID is not found',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Title of the notification',
      },
      {
        displayName: 'Heading',
        name: 'heading',
        type: 'string',
        default: '',
        description: 'Heading of the notification',
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        default: '',
        description: 'Message of the notification',
      },
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        description: 'URL to go to when the notification gets clicked',
      },
      {
        displayName: 'Is Published',
        name: 'isPublished',
        type: 'boolean',
        default: false,
        description: 'Whether the notification is published',
      },
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: '',
        description: 'Language locale of the notification (e.g., en, fr, de)',
      },
      {
        displayName: 'Publish Up',
        name: 'publishUp',
        type: 'dateTime',
        default: '',
        description: 'Date/time when the notification should be published',
      },
      {
        displayName: 'Publish Down',
        name: 'publishDown',
        type: 'dateTime',
        default: '',
        description: 'Date/time when the notification should be unpublished',
      },
      {
        displayName: 'Category',
        name: 'category',
        type: 'string',
        default: '',
        description: 'Category for the notification',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                  notification:get                          */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Notification ID',
    name: 'notificationId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['get'],
      },
    },
    default: '',
    description: 'The ID of the notification to return',
  },

  /* -------------------------------------------------------------------------- */
  /*                                notification:getAll                         */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['notification'],
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
        resource: ['notification'],
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
        resource: ['notification'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'String or search command to filter notifications by',
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
        description: 'Whether to return only currently published notifications',
      },
      {
        displayName: 'Minimal',
        name: 'minimal',
        type: 'boolean',
        default: false,
        description: 'Whether to return array of notifications without additional lists',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                notification:delete                         */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Notification ID',
    name: 'notificationId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['delete'],
      },
    },
    default: '',
    description: 'The ID of the notification to delete',
  },
];
