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
        name: 'Get Campaigns',
        value: 'getCampaigns',
        description: "Get a contact's campaigns",
        action: "Get a contact's campaigns",
      },
      {
        name: 'Get Devices',
        value: 'getDevices',
        description: "Get a contact's devices",
        action: "Get a contact's devices",
      },
      {
        name: 'Get Segments',
        value: 'getSegments',
        description: "Get a contact's segments",
        action: "Get a contact's segments",
      },
      {
        name: 'Add to Segments',
        value: 'addToSegments',
        description: 'Add contact to segments',
        action: 'Add contact to segments',
      },
      {
        name: 'Remove from Segments',
        value: 'removeFromSegments',
        description: 'Remove contact from segments',
        action: 'Remove contact from segments',
      },
      {
        name: 'Add to Campaigns',
        value: 'addToCampaigns',
        description: 'Add contact to campaigns',
        action: 'Add contact to campaigns',
      },
      {
        name: 'Remove from Campaigns',
        value: 'removeFromCampaigns',
        description: 'Remove contact from campaigns',
        action: 'Remove contact from campaigns',
      },
      {
        name: 'Get All Activity',
        value: 'getAllActivity',
        description: 'Get activity events for all contacts',
        action: 'Get activity events for all contacts',
      },
      {
        name: 'Get Owners',
        value: 'getOwners',
        description: 'Get list of available owners',
        action: 'Get list of available owners',
      },
      {
        name: 'Get Fields',
        value: 'getFields',
        description: 'Get list of available contact fields',
        action: 'Get list of available contact fields',
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
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'RAW Data',
        name: 'rawData',
        type: 'boolean',
        default: true,
        description:
          'By default only the data of the fields get returned. If this option is set, the RAW response with all data gets returned.',
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
    type: 'string',
    description:
      'Enter the company name or ID. You can use an <a href="https://docs.n8n.io/code/expressions/">expression</a> to get the company ID from a previous Company > Get All operation.',
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
  /*                                contact:delete                              */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['delete'],
      },
    },
    default: '',
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
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'RAW Data',
        name: 'rawData',
        type: 'boolean',
        default: true,
        description:
          'By default only the data of the fields get returned. If this option is set, the RAW response with all data gets returned.',
      },
    ],
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
        type: 'string',
        description:
          'Enter the company name or ID. You can use an <a href="https://docs.n8n.io/code/expressions/">expression</a> to get the company ID from a previous Company > Get All operation.',
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
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['get'],
      },
    },
    options: [
      {
        displayName: 'Fields to Return',
        name: 'fieldsToReturn',
        type: 'multiOptions',
        typeOptions: {
          loadOptionsMethod: 'getContactFields',
        },
        default: [],
        description:
          'Select which fields to include in the output. Leave empty to return all fields.',
      },
      {
        displayName: 'RAW Data',
        name: 'rawData',
        type: 'boolean',
        default: true,
        description:
          'By default only the data of the fields get returned. If this option is set, the RAW response with all data gets returned.',
      },
    ],
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

  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Any Do Not Contact Only',
        name: 'anyDncOnly',
        type: 'boolean',
        default: false,
        description: 'Return only contacts with any Do Not Contact enabled',
      },
      {
        displayName: 'Campaign(s)',
        name: 'campaigns',
        type: 'multiOptions',
        typeOptions: {
          loadOptionsMethod: 'getCampaigns',
        },
        displayOptions: {
          show: {
            '/resource': ['contact'],
            '/operation': ['getAll'],
          },
        },
        default: [],
        description:
          'Filter contacts by membership in one or more campaigns. Uses Mautic search syntax (campaign:id) under the hood.',
      },
      {
        displayName: 'Email Do Not Contact Only',
        name: 'emailDncOnly',
        type: 'boolean',
        default: false,
        description: 'Return only contacts with Email Do Not Contact enabled',
      },
      {
        displayName: 'Fields to Return',
        name: 'fieldsToReturn',
        type: 'multiOptions',
        typeOptions: {
          loadOptionsMethod: 'getContactFields',
        },
        default: [],
        description:
          'Select which fields to include in the output. Leave empty to return all fields.',
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
        displayName: 'Owner(s)',
        name: 'owners',
        type: 'multiOptions',
        typeOptions: {
          loadOptionsMethod: 'getOwners',
        },
        displayOptions: {
          show: {
            '/resource': ['contact'],
            '/operation': ['getAll'],
          },
        },
        default: [],
        description:
          'Filter contacts by owner (assigned user). Uses Mautic search syntax (owner:id) under the hood.',
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
        displayName: 'RAW Data',
        name: 'rawData',
        type: 'boolean',
        default: true,
        description:
          'By default only the data of the fields get returned. If this option gets set the RAW response with all data gets returned.',
      },
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
        displayName: 'Segment Match Type',
        name: 'segmentMatchType',
        type: 'options',
        options: [
          {
            name: 'Any Selected Segment',
            value: 'any',
          },
          {
            name: 'All Selected Segments',
            value: 'all',
          },
        ],
        displayOptions: {
          show: {
            '/resource': ['contact'],
            '/operation': ['getAll'],
          },
        },
        default: 'any',
        description:
          'When multiple segments are selected, choose whether to return contacts in any selected segment or only those that are in all selected segments.',
      },
      {
        displayName: 'Segment(s)',
        name: 'segments',
        type: 'multiOptions',
        typeOptions: {
          loadOptionsMethod: 'getSegmentAliases',
        },
        displayOptions: {
          show: {
            '/resource': ['contact'],
            '/operation': ['getAll'],
          },
        },
        default: [],
        description:
          'Filter contacts by membership in one or more segments. Uses Mautic search syntax (segment:alias) under the hood.',
      },
      {
        displayName: 'SMS Do Not Contact Only',
        name: 'smsDncOnly',
        type: 'boolean',
        default: false,
        description: 'Return only contacts with SMS Do Not Contact enabled',
      },
      {
        displayName: 'Stage(s)',
        name: 'stages',
        type: 'multiOptions',
        typeOptions: {
          loadOptionsMethod: 'getStages',
        },
        displayOptions: {
          show: {
            '/resource': ['contact'],
            '/operation': ['getAll'],
          },
        },
        default: [],
        description:
          'Filter contacts by one or more stages. Uses Mautic search syntax (stage:id) under the hood.',
      },
      {
        displayName: 'Tag Match Type',
        name: 'tagMatchType',
        type: 'options',
        options: [
          {
            name: 'Any Selected Tag',
            value: 'any',
          },
          {
            name: 'All Selected Tags',
            value: 'all',
          },
        ],
        displayOptions: {
          show: {
            '/resource': ['contact'],
            '/operation': ['getAll'],
          },
        },
        default: 'any',
        description:
          'When multiple tags are selected, choose whether to return contacts with any selected tag or only those with all selected tags.',
      },
      {
        displayName: 'Tag(s)',
        name: 'tags',
        type: 'multiOptions',
        typeOptions: {
          loadOptionsMethod: 'getTags',
        },
        displayOptions: {
          show: {
            '/resource': ['contact'],
            '/operation': ['getAll'],
          },
        },
        default: [],
        description:
          'Filter contacts by one or more tags. Uses Mautic search syntax (tag:name) under the hood.',
      },
      {
        displayName: 'Where',
        name: 'where',
        type: 'fixedCollection',
        placeholder: 'Add Condition',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        options: [
          {
            name: 'conditions',
            displayName: 'Condition',
            values: [
              {
                displayName: 'Column',
                name: 'col',
                type: 'options',
                typeOptions: {
                  loadOptionsMethod: 'getContactFields',
                },
                default: '',
                description: 'Database column (snake_case, e.g. date_modified, or custom field)',
              },
              {
                displayName: 'Expression',
                name: 'expr',
                type: 'options',
                options: [
                  { name: 'Equals', value: 'eq' },
                  { name: 'Not Equals', value: 'neq' },
                  { name: 'Less Than', value: 'lt' },
                  { name: 'Less Than or Equal', value: 'lte' },
                  { name: 'Greater Than', value: 'gt' },
                  { name: 'Greater Than or Equal', value: 'gte' },
                  { name: 'Between', value: 'between' },
                  { name: 'In', value: 'in' },
                  { name: 'Is Null', value: 'isNull' },
                  { name: 'Is Not Null', value: 'isNotNull' },
                  { name: 'AND (andX)', value: 'andX' },
                  { name: 'OR (orX)', value: 'orX' },
                ],
                default: 'eq',
                description: 'Comparison expression',
              },
              {
                displayName: 'Value',
                name: 'val',
                type: 'string',
                default: '',
                description:
                  'Value for the condition. For andX/orX, leave blank and use nested conditions below.',
                displayOptions: {
                  hide: {
                    expr: ['andX', 'orX'],
                  },
                },
              },
              {
                displayName: 'Nested Conditions',
                name: 'nested',
                type: 'fixedCollection',
                typeOptions: {
                  multipleValues: true,
                },
                default: {},
                options: [
                  {
                    name: 'conditions',
                    displayName: 'Condition',
                    values: [
                      {
                        displayName: 'Column',
                        name: 'col',
                        type: 'options',
                        typeOptions: {
                          loadOptionsMethod: 'getContactFields',
                        },
                        default: '',
                        description:
                          'Database column (snake_case, e.g. date_modified, or custom field)',
                      },
                      {
                        displayName: 'Expression',
                        name: 'expr',
                        type: 'options',
                        options: [
                          { name: 'Equals', value: 'eq' },
                          { name: 'Not Equals', value: 'neq' },
                          { name: 'Less Than', value: 'lt' },
                          { name: 'Less Than or Equal', value: 'lte' },
                          { name: 'Greater Than', value: 'gt' },
                          { name: 'Greater Than or Equal', value: 'gte' },
                          { name: 'Between', value: 'between' },
                          { name: 'In', value: 'in' },
                          { name: 'Is Null', value: 'isNull' },
                          { name: 'Is Not Null', value: 'isNotNull' },
                          { name: 'AND (andX)', value: 'andX' },
                          { name: 'OR (orX)', value: 'orX' },
                        ],
                        default: 'eq',
                        description: 'Comparison expression',
                      },
                      {
                        displayName: 'Value',
                        name: 'val',
                        type: 'string',
                        default: '',
                        description:
                          'Value for the condition. For andX/orX, leave blank and use nested conditions below.',
                        displayOptions: {
                          hide: {
                            expr: ['andX', 'orX'],
                          },
                        },
                      },
                      // Nested again for further levels if needed (recursive pattern)
                    ],
                  },
                ],
                displayOptions: {
                  show: {
                    expr: ['andX', 'orX'],
                  },
                },
              },
            ],
          },
        ],
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
  {
    displayName: 'Tokens',
    name: 'tokensUi',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    placeholder: 'Add Token',
    description:
      'Custom tokens to pass to the email template. These will be available as {token_name} in your email template.',
    default: {},
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['sendEmail'],
      },
    },
    options: [
      {
        name: 'tokenValues',
        displayName: 'Token',
        values: [
          {
            displayName: 'Token Name',
            name: 'tokenKey',
            type: 'string',
            default: '',
            description: 'The token name (e.g., "order_id", "customer_name")',
          },
          {
            displayName: 'Token Value',
            name: 'tokenValue',
            type: 'string',
            default: '',
            description: 'The token value (e.g., "12345", "John")',
          },
        ],
      },
    ],
  },
  {
    displayName: 'Asset Attachments',
    name: 'assetAttachments',
    type: 'string',
    description: 'Comma-separated list of asset IDs to attach to the email',
    default: '',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['sendEmail'],
      },
    },
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
  /*                             contact:getCampaigns                           */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['getCampaigns'],
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

  /* -------------------------------------------------------------------------- */
  /*                             contact:getSegments                             */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['getSegments'],
      },
    },
    default: '',
  },

  /* -------------------------------------------------------------------------- */
  /*                             contact:addToSegments                           */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['addToSegments'],
      },
    },
    default: '',
  },
  {
    displayName: 'Segment IDs',
    name: 'segmentIds',
    type: 'multiOptions',
    required: true,
    description:
      'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    typeOptions: {
      loadOptionsMethod: 'getSegments',
    },
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['addToSegments'],
      },
    },
    default: [],
  },

  /* -------------------------------------------------------------------------- */
  /*                             contact:removeFromSegments                     */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['removeFromSegments'],
      },
    },
    default: '',
  },
  {
    displayName: 'Segment IDs',
    name: 'segmentIds',
    type: 'multiOptions',
    required: true,
    description:
      'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    typeOptions: {
      loadOptionsMethod: 'getSegments',
    },
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['removeFromSegments'],
      },
    },
    default: [],
  },

  /* -------------------------------------------------------------------------- */
  /*                             contact:addToCampaigns                          */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['addToCampaigns'],
      },
    },
    default: '',
  },
  {
    displayName: 'Campaign IDs',
    name: 'campaignIds',
    type: 'multiOptions',
    required: true,
    description:
      'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    typeOptions: {
      loadOptionsMethod: 'getCampaigns',
    },
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['addToCampaigns'],
      },
    },
    default: [],
  },

  /* -------------------------------------------------------------------------- */
  /*                             contact:removeFromCampaigns                    */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['removeFromCampaigns'],
      },
    },
    default: '',
  },
  {
    displayName: 'Campaign IDs',
    name: 'campaignIds',
    type: 'multiOptions',
    required: true,
    description:
      'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    typeOptions: {
      loadOptionsMethod: 'getCampaigns',
    },
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['removeFromCampaigns'],
      },
    },
    default: [],
  },

  /* -------------------------------------------------------------------------- */
  /*                             contact:getAllActivity                         */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['getAllActivity'],
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
];
