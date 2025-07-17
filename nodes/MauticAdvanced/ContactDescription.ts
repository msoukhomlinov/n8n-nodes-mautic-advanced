import type { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['contact'],
      },
    },
    options: [
      {
        name: 'Add UTM Tags',
        value: 'addUtm',
        description: 'Add UTM tags to a contact',
        action: 'Add UTM tags to a contact',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new contact',
        action: 'Create a contact',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a contact',
        action: 'Delete a contact',
      },
      {
        name: 'Delete Batch',
        value: 'deleteBatch',
        description: 'Delete multiple contacts in one operation',
        action: 'Delete multiple contacts',
      },
      {
        name: 'Edit Contact Points',
        value: 'editContactPoint',
        description: "Edit contact's points",
        action: "Edit a contact's points",
      },
      {
        name: 'Edit Do Not Contact List',
        value: 'editDoNotContactList',
        description: 'Add/remove contacts from/to the do not contact list',
        action: 'Add/remove contacts from/to the do not contact list',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get data of a contact',
        action: 'Get a contact',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get data of many contacts',
        action: 'Get many contacts',
      },
      {
        name: 'Get Notes',
        value: 'getNotes',
        description: "Get a contact's notes",
        action: "Get a contact's notes",
      },
      {
        name: 'Remove UTM Tags',
        value: 'removeUtm',
        description: 'Remove UTM tags from a contact',
        action: 'Remove UTM tags from a contact',
      },
      {
        name: 'Send Email',
        value: 'sendEmail',
        description: 'Send email to contact',
        action: 'Send email to a contact',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a contact',
        action: 'Update a contact',
      },
      {
        name: 'Get Activity',
        value: 'getActivity',
        description: "Get a contact's activity",
        action: "Get a contact's activity",
      },
      {
        name: 'Get Companies',
        value: 'getCompanies',
        description: "Get a contact's companies",
        action: "Get a contact's companies",
      },
      {
        name: 'Get Devices',
        value: 'getDevices',
        description: "Get a contact's devices",
        action: "Get a contact's devices",
      },
    ],
    default: 'create',
  },
];

export const contactFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                contact:create                              */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'JSON Parameters',
    name: 'jsonParameters',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        operation: ['create'],
        resource: ['contact'],
      },
    },
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['create'],
        jsonParameters: [false],
      },
    },
    default: '',
    description: 'Email address of the contact',
  },
  {
    displayName: 'First Name',
    name: 'firstName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['create'],
        jsonParameters: [false],
      },
    },
    default: '',
  },
  {
    displayName: 'Last Name',
    name: 'lastName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['create'],
        jsonParameters: [false],
      },
    },
    default: '',
  },
  {
    displayName: 'Primary Company Name or ID',
    name: 'company',
    type: 'options',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    typeOptions: {
      loadOptionsMethod: 'getCompanies',
    },
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['create'],
        jsonParameters: [false],
      },
    },
    default: '',
  },
  {
    displayName: 'Position',
    name: 'position',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['create'],
        jsonParameters: [false],
      },
    },
    default: '',
  },
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['create'],
        jsonParameters: [false],
      },
    },
    default: '',
  },
  {
    displayName: 'Body',
    name: 'bodyJson',
    type: 'json',
    displayOptions: {
      show: {
        operation: ['create'],
        resource: ['contact'],
        jsonParameters: [true],
      },
    },
    default: '',
    description: 'Contact parameters',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Address',
        name: 'addressUi',
        placeholder: 'Address',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: false,
        },
        default: {},
        options: [
          {
            name: 'addressValues',
            displayName: 'Address',
            values: [
              {
                displayName: 'Address Line 1',
                name: 'address1',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Address Line 2',
                name: 'address2',
                type: 'string',
                default: '',
              },
              {
                displayName: 'City',
                name: 'city',
                type: 'string',
                default: '',
              },
              {
                displayName: 'State',
                name: 'state',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Country',
                name: 'country',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Zip Code',
                name: 'zipCode',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
      },
      {
        displayName: 'B2B or B2C',
        name: 'b2bOrb2c',
        type: 'options',
        options: [
          {
            name: 'B2B',
            value: 'B2B',
          },
          {
            name: 'B2C',
            value: 'B2C',
          },
        ],
        default: '',
      },
      {
        displayName: 'CRM ID',
        name: 'crmId',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Custom Fields',
        name: 'customFieldsUi',
        placeholder: 'Add Custom Fields',
        description: 'Adds a custom fields to set also values which have not been predefined',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        options: [
          {
            name: 'customFieldValues',
            displayName: 'Field',
            values: [
              {
                displayName: 'Field Name or ID',
                name: 'fieldId',
                type: 'options',
                typeOptions: {
                  loadOptionsMethod: 'getContactFields',
                },
                default: '',
                description:
                  'ID of the field to set. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
              },
              {
                displayName: 'Field Value',
                name: 'fieldValue',
                type: 'string',
                default: '',
                description: 'Value of the field to set',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Fax',
        name: 'fax',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Has Purchased',
        name: 'hasPurchased',
        type: 'boolean',
        default: false,
      },
      {
        displayName: 'IP Address',
        name: 'ipAddress',
        type: 'string',
        default: '',
        description: 'IP address to associate with the contact',
      },
      {
        displayName: 'Last Active',
        name: 'lastActive',
        type: 'dateTime',
        default: '',
        description: 'Date/time in UTC;',
      },
      {
        displayName: 'Mobile',
        name: 'mobile',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Owner ID',
        name: 'ownerId',
        type: 'string',
        default: '',
        description: 'ID of a Mautic user to assign this contact to',
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Prospect or Customer',
        name: 'prospectOrCustomer',
        type: 'options',
        options: [
          {
            name: 'Prospect',
            value: 'Prospect',
          },
          {
            name: 'Customer',
            value: 'Customer',
          },
        ],
        default: '',
      },
      {
        displayName: 'Sandbox',
        name: 'sandbox',
        type: 'boolean',
        default: false,
      },
      {
        displayName: 'Stage Name or ID',
        name: 'stage',
        type: 'options',
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        typeOptions: {
          loadOptionsMethod: 'getStages',
        },
        default: '',
      },
      {
        displayName: 'Tag Names or IDs',
        name: 'tags',
        type: 'multiOptions',
        description:
          'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        typeOptions: {
          loadOptionsMethod: 'getTags',
        },
        default: [],
      },
      {
        displayName: 'Social Media',
        name: 'socialMediaUi',
        placeholder: 'Social Media',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: false,
        },
        default: {},
        options: [
          {
            name: 'socialMediaValues',
            displayName: 'Social Media',
            values: [
              {
                displayName: 'Facebook',
                name: 'facebook',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Foursquare',
                name: 'foursquare',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Instagram',
                name: 'instagram',
                type: 'string',
                default: '',
              },
              {
                displayName: 'LinkedIn',
                name: 'linkedIn',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Skype',
                name: 'skype',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Twitter',
                name: 'twitter',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Website',
        name: 'website',
        type: 'string',
        default: '',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                contact:addUtm                              */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['addUtm'],
      },
    },
    default: '',
  },
  {
    displayName: 'UTM Fields',
    name: 'utmFields',
    type: 'collection',
    placeholder: 'Add UTM Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['addUtm'],
      },
    },
    options: [
      {
        displayName: 'UTM Campaign',
        name: 'utmCampaign',
        type: 'string',
        default: '',
      },
      {
        displayName: 'UTM Source',
        name: 'utmSource',
        type: 'string',
        default: '',
      },
      {
        displayName: 'UTM Medium',
        name: 'utmMedium',
        type: 'string',
        default: '',
      },
      {
        displayName: 'UTM Content',
        name: 'utmContent',
        type: 'string',
        default: '',
      },
      {
        displayName: 'UTM Term',
        name: 'utmTerm',
        type: 'string',
        default: '',
      },
      {
        displayName: 'User Agent',
        name: 'userAgent',
        type: 'string',
        default: '',
      },
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Referer',
        name: 'referer',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        default: '',
        description:
          'Any extra query parameters you wish to include, as a string (e.g. "cid=abc&cond=new")',
      },
      {
        displayName: 'Remote Host',
        name: 'remoteHost',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Last Active',
        name: 'lastActive',
        type: 'dateTime',
        default: '',
        description:
          "The date that the action occurred. Contact's lastActive date will be updated if included.",
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                              contact:removeUtm                             */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['removeUtm'],
      },
    },
    default: '',
  },
  {
    displayName: 'UTM ID',
    name: 'utmId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['removeUtm'],
      },
    },
    default: '',
    description: 'The ID of the UTM tag set to remove',
  },

  /* -------------------------------------------------------------------------- */
  /*                               contact:update                               */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['update'],
        resource: ['contact'],
      },
    },
    default: '',
  },
  {
    displayName: 'JSON Parameters',
    name: 'jsonParameters',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        operation: ['update'],
        resource: ['contact'],
      },
    },
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Body',
        name: 'bodyJson',
        type: 'json',
        displayOptions: {
          show: {
            '/jsonParameters': [true],
          },
        },
        default: '',
        description: 'Contact parameters',
      },
      {
        displayName: 'Address',
        name: 'addressUi',
        placeholder: 'Address',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: false,
        },
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: {},
        options: [
          {
            name: 'addressValues',
            displayName: 'Address',
            values: [
              {
                displayName: 'Address Line 1',
                name: 'address1',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Address Line 2',
                name: 'address2',
                type: 'string',
                default: '',
              },
              {
                displayName: 'City',
                name: 'city',
                type: 'string',
                default: '',
              },
              {
                displayName: 'State',
                name: 'state',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Country',
                name: 'country',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Zip Code',
                name: 'zipCode',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
      },
      {
        displayName: 'B2B or B2C',
        name: 'b2bOrb2c',
        type: 'options',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        options: [
          {
            name: 'B2B',
            value: 'B2B',
          },
          {
            name: 'B2C',
            value: 'B2C',
          },
        ],
        default: '',
      },
      {
        displayName: 'CRM ID',
        name: 'crmId',
        type: 'string',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
      },
      {
        displayName: 'Custom Fields',
        name: 'customFieldsUi',
        placeholder: 'Add Custom Fields',
        description: 'Adds a custom fields to set also values which have not been predefined',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        options: [
          {
            name: 'customFieldValues',
            displayName: 'Field',
            values: [
              {
                displayName: 'Field Name or ID',
                name: 'fieldId',
                type: 'options',
                typeOptions: {
                  loadOptionsMethod: 'getContactFields',
                },
                default: '',
                description:
                  'ID of the field to set. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
              },
              {
                displayName: 'Field Value',
                name: 'fieldValue',
                type: 'string',
                default: '',
                description: 'Value of the field to set',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
        description: 'Email address of the contact',
      },
      {
        displayName: 'Fax',
        name: 'fax',
        type: 'string',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
      },
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
      },
      {
        displayName: 'Has Purchased',
        name: 'hasPurchased',
        type: 'boolean',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: false,
      },
      {
        displayName: 'IP Address',
        name: 'ipAddress',
        type: 'string',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
        description: 'IP address to associate with the contact',
      },
      {
        displayName: 'Last Active',
        name: 'lastActive',
        type: 'dateTime',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
        description: 'Date/time in UTC;',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
        description: 'LastName',
      },
      {
        displayName: 'Mobile',
        name: 'mobile',
        type: 'string',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
      },
      {
        displayName: 'Owner ID',
        name: 'ownerId',
        type: 'string',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
        description: 'ID of a Mautic user to assign this contact to',
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
      },
      {
        displayName: 'Position',
        name: 'position',
        type: 'string',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
      },
      {
        displayName: 'Primary Company Name or ID',
        name: 'company',
        type: 'options',
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        typeOptions: {
          loadOptionsMethod: 'getCompanies',
        },
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
      },
      {
        displayName: 'Prospect or Customer',
        name: 'prospectOrCustomer',
        type: 'options',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        options: [
          {
            name: 'Prospect',
            value: 'Prospect',
          },
          {
            name: 'Customer',
            value: 'Customer',
          },
        ],
        default: '',
      },
      {
        displayName: 'Sandbox',
        name: 'sandbox',
        type: 'boolean',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: false,
      },
      {
        displayName: 'Stage Name or ID',
        name: 'stage',
        type: 'options',
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        typeOptions: {
          loadOptionsMethod: 'getStages',
        },
        default: '',
      },
      {
        displayName: 'Tag Names or IDs',
        name: 'tags',
        type: 'multiOptions',
        description:
          'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        typeOptions: {
          loadOptionsMethod: 'getTags',
        },
        default: [],
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
      },
      {
        displayName: 'Social Media',
        name: 'socialMediaUi',
        placeholder: 'Social Media',
        type: 'fixedCollection',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        typeOptions: {
          multipleValues: false,
        },
        default: {},
        options: [
          {
            name: 'socialMediaValues',
            displayName: 'Social Media',
            values: [
              {
                displayName: 'Facebook',
                name: 'facebook',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Foursquare',
                name: 'foursquare',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Instagram',
                name: 'instagram',
                type: 'string',
                default: '',
              },
              {
                displayName: 'LinkedIn',
                name: 'linkedIn',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Skype',
                name: 'skype',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Twitter',
                name: 'twitter',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Website',
        name: 'website',
        type: 'string',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
      },
      {
        displayName: 'IP Address',
        name: 'ipAddress',
        type: 'string',
        displayOptions: {
          show: {
            '/jsonParameters': [false],
          },
        },
        default: '',
        description: 'IP address to associate with the contact',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                   contact:editDoNotContactList                             */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['editDoNotContactList'],
        resource: ['contact'],
      },
    },
    default: '',
  },
  {
    displayName: 'Action',
    name: 'action',
    type: 'options',
    displayOptions: {
      show: {
        operation: ['editDoNotContactList'],
        resource: ['contact'],
      },
    },
    options: [
      {
        name: 'Add',
        value: 'add',
        action: 'Add a contact',
      },
      {
        name: 'Remove',
        value: 'remove',
        action: 'Remove a contact',
      },
    ],
    default: 'add',
  },
  {
    displayName: 'Channel',
    name: 'channel',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['editDoNotContactList'],
      },
    },
    options: [
      {
        name: 'Email',
        value: 'email',
      },
      {
        name: 'SMS',
        value: 'sms',
      },
    ],
    default: 'email',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['editDoNotContactList'],
      },
    },
    options: [
      {
        displayName: 'Reason To Do Not Contact',
        name: 'reason',
        type: 'options',
        options: [
          {
            name: 'Unsubscribed',
            value: '1',
          },
          {
            name: 'Bounced',
            value: '2',
          },
          {
            name: 'Manual',
            value: '3',
          },
        ],
        default: '3',
      },
      {
        displayName: 'Comments',
        name: 'comments',
        type: 'string',
        default: '',
        description: 'A text describing details of Do Not Contact entry',
      },
    ],
  },
  /* -------------------------------------------------------------------------- */
  /*                   contact:editContactPoint                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['editContactPoint'],
        resource: ['contact'],
      },
    },
    default: '',
  },
  {
    displayName: 'Action',
    name: 'action',
    type: 'options',
    displayOptions: {
      show: {
        operation: ['editContactPoint'],
        resource: ['contact'],
      },
    },
    options: [
      {
        name: 'Add',
        value: 'add',
        action: 'Add a contact',
      },
      {
        name: 'Remove',
        value: 'remove',
        action: 'Remove a contact',
      },
    ],
    default: 'add',
  },
  {
    displayName: 'Points',
    name: 'points',
    type: 'number',
    displayOptions: {
      show: {
        operation: ['editContactPoint'],
        resource: ['contact'],
      },
    },
    default: 0,
  },
  /* -------------------------------------------------------------------------- */
  /*                                 contact:get                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['get'],
        resource: ['contact'],
      },
    },
    default: '',
  },

  /* -------------------------------------------------------------------------- */
  /*                                contact:getAll                              */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['contact'],
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
        resource: ['contact'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
    },
    default: 30,
    description:
      'Max number of results to return. If you request more than 30 records, the node will automatically use pagination to fetch up to the requested number.',
  },

  /* -------------------------------------------------------------------------- */
  /*                               contact:delete                               */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['delete'],
        resource: ['contact'],
      },
    },
    default: '',
  },

  /* -------------------------------------------------------------------------- */
  /*                             contact:deleteBatch                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact IDs',
    name: 'contactIds',
    type: 'string',
    required: false,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['deleteBatch'],
      },
    },
    default: '',
    placeholder: '1,2,3,4,5',
    description:
      'Comma-separated list of contact IDs to delete (e.g., "1,2,3,4,5"). If left empty, all input items\' contactId fields will be used for batch deletion.',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['deleteBatch'],
      },
    },
    placeholder: 'Add option',
    default: {},
    options: [
      {
        displayName: 'RAW Data',
        name: 'rawData',
        type: 'boolean',
        default: true,
        description:
          'Whether to return the raw response data from the API or just a success summary',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                 contact:all                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    displayOptions: {
      show: {
        resource: ['contact'],
      },
      hide: {
        operation: ['sendEmail', 'editDoNotContactList', 'editContactPoint', 'deleteBatch'],
      },
    },
    placeholder: 'Add option',
    default: {},
    options: [
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        displayOptions: {
          show: {
            '/resource': ['contact'],
            '/operation': ['getAll'],
          },
        },
        default: '',
        description: 'String or search command to filter entities by',
      },
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        displayOptions: {
          show: {
            '/resource': ['contact'],
            '/operation': ['getAll'],
          },
        },
        default: '',
        description: 'Column to sort by. Can use any column listed in the response.',
      },
      {
        displayName: 'Order By Dir',
        name: 'orderByDir',
        type: 'options',
        displayOptions: {
          show: {
            '/resource': ['contact'],
            '/operation': ['getAll'],
          },
        },
        default: '',
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
        description: 'Sort direction: ASC or DESC',
      },
      {
        displayName: 'Published Only',
        name: 'publishedOnly',
        type: 'boolean',
        displayOptions: {
          show: {
            '/resource': ['contact'],
            '/operation': ['getAll'],
          },
        },
        default: false,
        description: 'Whether to return currently published entities',
      },
      {
        displayName: 'Minimal',
        name: 'minimal',
        type: 'boolean',
        displayOptions: {
          show: {
            '/resource': ['contact'],
            '/operation': ['getAll'],
          },
        },
        default: false,
        description: 'Whether to return array of entities without additional lists in it',
      },
      {
        displayName: 'RAW Data',
        name: 'rawData',
        type: 'boolean',
        default: true,
        // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
        description:
          'By default only the data of the fields get returned. If this options gets set the RAW response with all data gets returned.',
      },
    ],
  },
  /* -------------------------------------------------------------------------- */
  /*                                contact:sendEmail                           */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Campaign Email Name or ID',
    name: 'campaignEmailId',
    type: 'options',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['sendEmail'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getCampaignEmails',
    },
    default: '',
  },
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['sendEmail'],
      },
    },
    default: '',
  },

  /* -------------------------------------------------------------------------- */
  /*                                contact:getNotes                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['getNotes'],
      },
    },
    default: '',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['getNotes'],
      },
    },
    options: [
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'String or search command to filter notes by',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
          minValue: 1,
        },
        default: 50,
        description: 'Max number of results to return',
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
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                             contact:getActivity                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['getActivity'],
      },
    },
    default: '',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['getActivity'],
      },
    },
    options: [
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'String or search command to filter events by',
      },
      {
        displayName: 'Include Events',
        name: 'includeEvents',
        type: 'string',
        default: '',
        description: 'Array of event types to include, separated by comma',
      },
      {
        displayName: 'Exclude Events',
        name: 'excludeEvents',
        type: 'string',
        default: '',
        description: 'Array of event types to exclude, separated by comma',
      },
      {
        displayName: 'Date From',
        name: 'dateFrom',
        type: 'dateTime',
        default: '',
      },
      {
        displayName: 'Date To',
        name: 'dateTo',
        type: 'dateTime',
        default: '',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
          minValue: 1,
        },
        default: 50,
        description: 'Max number of results to return',
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
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                             contact:getCompanies                           */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['getCompanies'],
      },
    },
    default: '',
  },

  /* -------------------------------------------------------------------------- */
  /*                             contact:getDevices                             */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['getDevices'],
      },
    },
    default: '',
  },
];
