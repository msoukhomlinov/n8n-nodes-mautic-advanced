import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['user'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new user',
        action: 'Create a user',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a user',
        action: 'Delete a user',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get data of a user',
        action: 'Get a user',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get data of many users',
        action: 'Get many users',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a user',
        action: 'Update a user',
      },
    ],
    default: 'create',
  },
];

export const userFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                 user:create                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Username',
    name: 'username',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Username which can be used to log in to Mautic',
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Email address of the user',
  },
  {
    displayName: 'First Name',
    name: 'firstName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
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
        resource: ['user'],
        operation: ['create'],
      },
    },
    default: '',
  },
  {
    displayName: 'Password',
    name: 'plainPassword',
    type: 'fixedCollection',
    placeholder: 'Set Password',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      {
        name: 'passwordValues',
        displayName: 'Password',
        values: [
          {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: {
              password: true,
            },
            default: '',
          },
          {
            displayName: 'Confirm Password',
            name: 'confirm',
            type: 'string',
            typeOptions: {
              password: true,
            },
            default: '',
          },
        ],
      },
    ],
  },
  {
    displayName: 'Role ID',
    name: 'role',
    type: 'number',
    typeOptions: {
      minValue: 1,
    },
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    default: 1,
    description: 'ID of the role to assign to the user',
  },
  {
    displayName: 'Simplify',
    name: 'simple',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    default: true,
    description: 'Whether to return a simplified version of the response instead of the raw data',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Is Published',
        name: 'isPublished',
        type: 'boolean',
        default: true,
        description: 'Whether the user is published (enabled)',
      },
      {
        displayName: 'Position',
        name: 'position',
        type: 'string',
        default: '',
        description: "User's position title",
      },
      {
        displayName: 'Timezone',
        name: 'timezone',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Locale',
        name: 'locale',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Online Status',
        name: 'onlineStatus',
        type: 'string',
        default: '',
        description: 'Online status of the user (e.g. online, offline)',
      },
      {
        displayName: 'Signature',
        name: 'signature',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'Signature of the user which can be used in emails',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                 user:update                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['update'],
        resource: ['user'],
      },
    },
    default: '',
    description: 'The ID of the user to update',
  },
  {
    displayName: 'Simplify',
    name: 'simple',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['update'],
      },
    },
    default: true,
    description: 'Whether to return a simplified version of the response instead of the raw data',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Username',
        name: 'username',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
      },
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Role ID',
        name: 'role',
        type: 'number',
        typeOptions: {
          minValue: 1,
        },
        default: 1,
      },
      {
        displayName: 'Password',
        name: 'plainPassword',
        type: 'fixedCollection',
        placeholder: 'Set Password',
        default: {},
        options: [
          {
            name: 'passwordValues',
            displayName: 'Password',
            values: [
              {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                  password: true,
                },
                default: '',
              },
              {
                displayName: 'Confirm Password',
                name: 'confirm',
                type: 'string',
                typeOptions: {
                  password: true,
                },
                default: '',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Is Published',
        name: 'isPublished',
        type: 'boolean',
        default: true,
      },
      {
        displayName: 'Position',
        name: 'position',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Timezone',
        name: 'timezone',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Locale',
        name: 'locale',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Online Status',
        name: 'onlineStatus',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Signature',
        name: 'signature',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                  user:get                                  */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['get'],
        resource: ['user'],
      },
    },
    default: '',
    description: 'The ID of the user to return',
  },
  {
    displayName: 'Simplify',
    name: 'simple',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['get'],
      },
    },
    default: true,
    description: 'Whether to return a simplified version of the response instead of the raw data',
  },

  /* -------------------------------------------------------------------------- */
  /*                                 user:getAll                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['user'],
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
        resource: ['user'],
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
    displayName: 'Simplify',
    name: 'simple',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['getAll'],
      },
    },
    default: true,
    description: 'Whether to return a simplified version of the response instead of the raw data',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        default: '',
        description: 'Column to sort by. Can use any column listed in the response.',
      },
      {
        displayName: 'Order Direction',
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
        default: '',
        description: 'Sort direction: asc or desc',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'String or search command to filter entities by',
      },
      {
        displayName: 'Published Only',
        name: 'publishedOnly',
        type: 'boolean',
        default: false,
        description: 'Whether to return currently published entities',
      },
      {
        displayName: 'Minimal',
        name: 'minimal',
        type: 'boolean',
        default: false,
        description: 'Whether to return array of entities without additional lists in it',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                user:delete                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['delete'],
        resource: ['user'],
      },
    },
    default: '',
    description: 'The ID of the user to delete',
  },
  {
    displayName: 'Simplify',
    name: 'simple',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['delete'],
      },
    },
    default: true,
    description: 'Whether to return a simplified version of the response instead of the raw data',
  },
];
