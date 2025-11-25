import type { INodeProperties } from 'n8n-workflow';

export const emailOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['email'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new email',
        action: 'Create an email',
      },
      {
        name: 'Create Reply',
        value: 'createReply',
        description: 'Create a reply record for an email send stat',
        action: 'Create a reply record',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete an email',
        action: 'Delete an email',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get data of an email',
        action: 'Get an email',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get data of many emails',
        action: 'Get many emails',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an email',
        action: 'Update an email',
      },
    ],
    default: 'create',
  },
];

export const emailFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                email:create                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['email'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Internal name of the email',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['email'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Asset Attachments',
        name: 'assetAttachments',
        type: 'multiOptions',
        typeOptions: {
          loadOptionsMethod: 'getAssets',
        },
        default: [],
        description: 'Array of asset IDs to attach to the email',
      },
      {
        displayName: 'BCC Address',
        name: 'bccAddress',
        type: 'string',
        default: '',
        description: 'The BCC email address if different than the one in Mautic configuration',
      },
      {
        displayName: 'Category',
        name: 'category',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getEmailCategories',
        },
        default: '',
        description: 'Category for the email',
      },
      {
        displayName: 'Custom HTML',
        name: 'customHtml',
        type: 'string',
        typeOptions: {
          rows: 5,
        },
        default: '',
        description: 'The HTML content of the email',
      },
      {
        displayName: 'Dynamic Content',
        name: 'dynamicContent',
        type: 'json',
        default: '',
        description: 'Dynamic content configuration as JSON object',
      },
      {
        displayName: 'Email Type',
        name: 'emailType',
        type: 'options',
        options: [
          {
            name: 'List',
            value: 'list',
            description: 'Segment (list) email',
          },
          {
            name: 'Template',
            value: 'template',
            description: 'Template email',
          },
        ],
        default: 'list',
        description: 'If it is a segment (former list) email or template email',
      },
      {
        displayName: 'From Address',
        name: 'fromAddress',
        type: 'string',
        default: '',
        description: 'The from email address if different than the one in Mautic configuration',
      },
      {
        displayName: 'From Name',
        name: 'fromName',
        type: 'string',
        default: '',
        description: 'The from name if different than the one in Mautic configuration',
      },
      {
        displayName: 'Is Published',
        name: 'isPublished',
        type: 'boolean',
        default: false,
        description: 'Whether the email is published',
      },
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: '',
        description: 'Language locale of the email (e.g., en, fr, de)',
      },
      {
        displayName: 'Lists',
        name: 'lists',
        type: 'multiOptions',
        typeOptions: {
          loadOptionsMethod: 'getSegments',
        },
        default: [],
        description: 'Array of segment IDs which should be added to the segment email',
      },
      {
        displayName: 'Plain Text',
        name: 'plainText',
        type: 'string',
        typeOptions: {
          rows: 5,
        },
        default: '',
        description: 'The plain text content of the email',
      },
      {
        displayName: 'Publish Down',
        name: 'publishDown',
        type: 'dateTime',
        default: '',
        description: 'Date/time when the email should be unpublished',
      },
      {
        displayName: 'Publish Up',
        name: 'publishUp',
        type: 'dateTime',
        default: '',
        description: 'Date/time when the email should be published',
      },
      {
        displayName: 'Reply To Address',
        name: 'replyToAddress',
        type: 'string',
        default: '',
        description: 'The reply to email address if different than the one in Mautic configuration',
      },
      {
        displayName: 'Subject',
        name: 'subject',
        type: 'string',
        default: '',
        description: 'Subject of the email',
      },
      {
        displayName: 'Theme',
        name: 'template',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getThemes',
        },
        default: '',
        description: 'The theme to use as the base for the email',
      },
      {
        displayName: 'Unsubscribe Form',
        name: 'unsubscribeForm',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getForms',
        },
        default: '',
        description: 'ID of the form displayed in the unsubscribe page',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                email:update                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Email ID',
    name: 'emailId',
    type: 'options',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    required: true,
    displayOptions: {
      show: {
        resource: ['email'],
        operation: ['update'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getEmails',
    },
    default: '',
  },
  {
    displayName: 'Create If Not Found',
    name: 'createIfNotFound',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['email'],
        operation: ['update'],
      },
    },
    default: false,
    description: 'Whether to create a new email if one with the given ID is not found',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['email'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Asset Attachments',
        name: 'assetAttachments',
        type: 'multiOptions',
        typeOptions: {
          loadOptionsMethod: 'getAssets',
        },
        default: [],
        description: 'Array of asset IDs to attach to the email',
      },
      {
        displayName: 'BCC Address',
        name: 'bccAddress',
        type: 'string',
        default: '',
        description: 'The BCC email address if different than the one in Mautic configuration',
      },
      {
        displayName: 'Category',
        name: 'category',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getEmailCategories',
        },
        default: '',
        description: 'Category for the email',
      },
      {
        displayName: 'Custom HTML',
        name: 'customHtml',
        type: 'string',
        typeOptions: {
          rows: 5,
        },
        default: '',
        description: 'The HTML content of the email',
      },
      {
        displayName: 'Dynamic Content',
        name: 'dynamicContent',
        type: 'json',
        default: '',
        description: 'Dynamic content configuration as JSON object',
      },
      {
        displayName: 'Email Type',
        name: 'emailType',
        type: 'options',
        options: [
          {
            name: 'List',
            value: 'list',
            description: 'Segment (list) email',
          },
          {
            name: 'Template',
            value: 'template',
            description: 'Template email',
          },
        ],
        default: 'list',
        description: 'If it is a segment (former list) email or template email',
      },
      {
        displayName: 'From Address',
        name: 'fromAddress',
        type: 'string',
        default: '',
        description: 'The from email address if different than the one in Mautic configuration',
      },
      {
        displayName: 'From Name',
        name: 'fromName',
        type: 'string',
        default: '',
        description: 'The from name if different than the one in Mautic configuration',
      },
      {
        displayName: 'Is Published',
        name: 'isPublished',
        type: 'boolean',
        default: false,
        description: 'Whether the email is published',
      },
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: '',
        description: 'Language locale of the email (e.g., en, fr, de)',
      },
      {
        displayName: 'Lists',
        name: 'lists',
        type: 'multiOptions',
        typeOptions: {
          loadOptionsMethod: 'getSegments',
        },
        default: [],
        description: 'Array of segment IDs which should be added to the segment email',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Internal name of the email',
      },
      {
        displayName: 'Plain Text',
        name: 'plainText',
        type: 'string',
        typeOptions: {
          rows: 5,
        },
        default: '',
        description: 'The plain text content of the email',
      },
      {
        displayName: 'Publish Down',
        name: 'publishDown',
        type: 'dateTime',
        default: '',
        description: 'Date/time when the email should be unpublished',
      },
      {
        displayName: 'Publish Up',
        name: 'publishUp',
        type: 'dateTime',
        default: '',
        description: 'Date/time when the email should be published',
      },
      {
        displayName: 'Reply To Address',
        name: 'replyToAddress',
        type: 'string',
        default: '',
        description: 'The reply to email address if different than the one in Mautic configuration',
      },
      {
        displayName: 'Subject',
        name: 'subject',
        type: 'string',
        default: '',
        description: 'Subject of the email',
      },
      {
        displayName: 'Theme',
        name: 'template',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getThemes',
        },
        default: '',
        description: 'The theme to use as the base for the email',
      },
      {
        displayName: 'Unsubscribe Form',
        name: 'unsubscribeForm',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getForms',
        },
        default: '',
        description: 'ID of the form displayed in the unsubscribe page',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                  email:get                                  */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Email ID',
    name: 'emailId',
    type: 'options',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    required: true,
    displayOptions: {
      show: {
        resource: ['email'],
        operation: ['get'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getEmails',
    },
    default: '',
  },

  /* -------------------------------------------------------------------------- */
  /*                                email:getAll                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['email'],
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
        resource: ['email'],
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
        resource: ['email'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Minimal',
        name: 'minimal',
        type: 'boolean',
        default: false,
        description: 'Whether to return array of emails without additional lists',
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
        description: 'Whether to return only currently published emails',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'String or search command to filter emails by',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                email:delete                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Email ID',
    name: 'emailId',
    type: 'options',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    required: true,
    displayOptions: {
      show: {
        resource: ['email'],
        operation: ['delete'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getEmails',
    },
    default: '',
  },

  /* -------------------------------------------------------------------------- */
  /*                              email:createReply                              */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Tracking Hash',
    name: 'trackingHash',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['email'],
        operation: ['createReply'],
      },
    },
    default: '',
    description: 'The unique tracking hash for the email send stat record',
  },
];
