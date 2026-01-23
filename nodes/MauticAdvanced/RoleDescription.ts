import type { INodeProperties } from 'n8n-workflow';

export const roleOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['role'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new role',
        action: 'Create a role',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a role',
        action: 'Delete a role',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get data of a role',
        action: 'Get a role',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get data of many roles',
        action: 'Get many roles',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a role',
        action: 'Update a role',
      },
    ],
    default: 'create',
  },
];

export const roleFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                 role:create                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['role'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Name of the role',
  },
  {
    displayName: 'Simplify',
    name: 'simple',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['role'],
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
        resource: ['role'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the role',
      },
      {
        displayName: 'Is Admin',
        name: 'isAdmin',
        type: 'boolean',
        default: false,
        description: 'Whether the role has full administrative access',
      },
      {
        displayName: 'Is Published',
        name: 'isPublished',
        type: 'boolean',
        default: true,
        description: 'Whether the role is published (enabled)',
      },
      {
        displayName: 'Raw Permissions (JSON)',
        name: 'rawPermissions',
        type: 'json',
        default: '{}',
        description:
          'JSON object defining permissions. Example: {"email:emails": ["viewown", "viewother"]}',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                 role:update                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Role ID',
    name: 'roleId',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['update'],
        resource: ['role'],
      },
    },
    default: '',
    description: 'The ID of the role to update',
  },
  {
    displayName: 'Simplify',
    name: 'simple',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['role'],
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
        resource: ['role'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the role',
      },
      {
        displayName: 'Is Admin',
        name: 'isAdmin',
        type: 'boolean',
        default: false,
        description: 'Whether the role has full administrative access',
      },
      {
        displayName: 'Is Published',
        name: 'isPublished',
        type: 'boolean',
        default: true,
        description: 'Whether the role is published (enabled)',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the role',
      },
      {
        displayName: 'Raw Permissions (JSON)',
        name: 'rawPermissions',
        type: 'json',
        default: '{}',
        description:
          'JSON object defining permissions. Example: {"email:emails": ["viewown", "viewother"]}',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                  role:get                                  */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Role ID',
    name: 'roleId',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['get'],
        resource: ['role'],
      },
    },
    default: '',
    description: 'The ID of the role to return',
  },
  {
    displayName: 'Simplify',
    name: 'simple',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['role'],
        operation: ['get'],
      },
    },
    default: true,
    description: 'Whether to return a simplified version of the response instead of the raw data',
  },

  /* -------------------------------------------------------------------------- */
  /*                                 role:getAll                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['role'],
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
        resource: ['role'],
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
        resource: ['role'],
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
        resource: ['role'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Minimal',
        name: 'minimal',
        type: 'boolean',
        default: false,
        description: 'Whether to return array of entities without additional lists in it',
      },
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
        displayName: 'Published Only',
        name: 'publishedOnly',
        type: 'boolean',
        default: false,
        description: 'Whether to return currently published entities',
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
  /*                                role:delete                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Role ID',
    name: 'roleId',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['delete'],
        resource: ['role'],
      },
    },
    default: '',
    description: 'The ID of the role to delete',
  },
  {
    displayName: 'Simplify',
    name: 'simple',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['role'],
        operation: ['delete'],
      },
    },
    default: true,
    description: 'Whether to return a simplified version of the response instead of the raw data',
  },
];
