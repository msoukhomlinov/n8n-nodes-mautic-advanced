import type { INodeProperties } from 'n8n-workflow';

export const themeOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['theme'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new theme from a zip file',
        action: 'Create a theme',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a theme',
        action: 'Delete a theme',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a theme as a zip file',
        action: 'Get a theme',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get data of many themes',
        action: 'Get many themes',
      },
    ],
    default: 'getAll',
  },
];

export const themeFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                theme:create                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'File',
    name: 'file',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['theme'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Binary property name containing the zip file to upload',
  },

  /* -------------------------------------------------------------------------- */
  /*                                 theme:get                                   */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Theme Name',
    name: 'themeName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        operation: ['get'],
        resource: ['theme'],
      },
    },
    default: '',
    description: 'The name of the theme to retrieve',
  },

  /* -------------------------------------------------------------------------- */
  /*                                theme:getAll                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['theme'],
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
        resource: ['theme'],
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
        resource: ['theme'],
        operation: ['getAll'],
      },
    },
    options: [
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
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'String or search command to filter themes by',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                theme:delete                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Theme Name',
    name: 'themeName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        operation: ['delete'],
        resource: ['theme'],
      },
    },
    default: '',
    description: 'The name of the theme to delete',
  },
];
