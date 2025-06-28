import type { INodeProperties } from 'n8n-workflow';

export const categoryOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['category'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new category',
        action: 'Create a category',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a category',
        action: 'Delete a category',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get data of a category',
        action: 'Get a category',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get data of many categories',
        action: 'Get many categories',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a category',
        action: 'Update a category',
      },
    ],
    default: 'create',
  },
];

export const categoryFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                category:create                             */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['category'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The title of the category to create',
  },
  {
    displayName: 'Bundle',
    name: 'bundle',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['category'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The bundle where the category will be available',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['category'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The description of the category',
  },
  {
    displayName: 'Color',
    name: 'color',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['category'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The color of the category',
  },

  /* -------------------------------------------------------------------------- */
  /*                                category:update                             */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Category ID',
    name: 'categoryId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        operation: ['update'],
        resource: ['category'],
      },
    },
    default: '',
    description: 'The ID of the category to update',
  },
  {
    displayName: 'Create If Not Found',
    name: 'createIfNotFound',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['category'],
        operation: ['update'],
      },
    },
    default: false,
    description: 'Whether to create a new category if one with the given ID is not found',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['category'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'The new title of the category',
      },
      {
        displayName: 'Bundle',
        name: 'bundle',
        type: 'string',
        default: '',
        description: 'The new bundle of the category',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'The new description of the category',
      },
      {
        displayName: 'Color',
        name: 'color',
        type: 'string',
        default: '',
        description: 'The new color of the category',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                 category:get                               */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Category ID',
    name: 'categoryId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        operation: ['get'],
        resource: ['category'],
      },
    },
    default: '',
    description: 'The ID of the category to return',
  },

  /* -------------------------------------------------------------------------- */
  /*                                category:getAll                             */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['category'],
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
        resource: ['category'],
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
        resource: ['category'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'String or search command to filter categories by.',
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
        description: 'Whether to return only currently published entities',
      },
      {
        displayName: 'Minimal',
        name: 'minimal',
        type: 'boolean',
        default: false,
        description: 'Whether to return a minimal set of data',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                category:delete                             */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Category ID',
    name: 'categoryId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        operation: ['delete'],
        resource: ['category'],
      },
    },
    default: '',
    description: 'ID of the category to delete',
  },
];
