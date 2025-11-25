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
    description: 'The title or name of the category',
  },
  {
    displayName: 'Bundle',
    name: 'bundle',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['category'],
        operation: ['create'],
      },
    },
    options: [
      {
        name: 'Global',
        value: 'global',
        description: 'Available across all Mautic elements',
      },
      {
        name: 'Asset',
        value: 'asset',
        description: 'For downloadable assets',
      },
      {
        name: 'Campaign',
        value: 'campaign',
        description: 'For marketing campaigns',
      },
      {
        name: 'Email',
        value: 'email',
        description: 'For email templates',
      },
      {
        name: 'Focus Items',
        value: 'plugin:focus',
        description: 'For focus items',
      },
      {
        name: 'Form',
        value: 'form',
        description: 'For forms',
      },
      {
        name: 'Marketing Messages',
        value: 'messages',
        description: 'For marketing messages',
      },
      {
        name: 'Page',
        value: 'page',
        description: 'For landing pages',
      },
      {
        name: 'Point',
        value: 'point',
        description: 'For point actions',
      },
      {
        name: 'Segment',
        value: 'segment',
        description: 'For contact segments',
      },
      {
        name: 'Text Message',
        value: 'sms',
        description: 'For SMS/text messages',
      },
      {
        name: 'Social Monitoring',
        value: 'plugin:mauticSocial',
        description: 'For social monitoring',
      },
      {
        name: 'Stage',
        value: 'stage',
        description: 'For contact stages',
      },
    ],
    default: 'global',
    description:
      'The bundle where the category will be available. Determines which Mautic elements can use this category',
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
    description: 'Optional description of the category to help identify its purpose',
  },
  {
    displayName: 'Color',
    name: 'color',
    type: 'color',
    displayOptions: {
      show: {
        resource: ['category'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Color for visual organisation and identification of the category in Mautic',
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
        displayName: 'Bundle',
        name: 'bundle',
        type: 'options',
        default: '',
        options: [
          {
            name: 'Global',
            value: 'global',
            description: 'Available across all Mautic elements',
          },
          {
            name: 'Asset',
            value: 'asset',
            description: 'For downloadable assets',
          },
          {
            name: 'Campaign',
            value: 'campaign',
            description: 'For marketing campaigns',
          },
          {
            name: 'Email',
            value: 'email',
            description: 'For email templates',
          },
          {
            name: 'Focus Items',
            value: 'plugin:focus',
            description: 'For focus items',
          },
          {
            name: 'Form',
            value: 'form',
            description: 'For forms',
          },
          {
            name: 'Marketing Messages',
            value: 'messages',
            description: 'For marketing messages',
          },
          {
            name: 'Page',
            value: 'page',
            description: 'For landing pages',
          },
          {
            name: 'Point',
            value: 'point',
            description: 'For point actions',
          },
          {
            name: 'Segment',
            value: 'segment',
            description: 'For contact segments',
          },
          {
            name: 'Text Message',
            value: 'sms',
            description: 'For SMS/text messages',
          },
          {
            name: 'Social Monitoring',
            value: 'plugin:mauticSocial',
            description: 'For social monitoring',
          },
          {
            name: 'Stage',
            value: 'stage',
            description: 'For contact stages',
          },
        ],
        description:
          'The bundle where the category will be available. Determines which Mautic elements can use this category',
      },
      {
        displayName: 'Color',
        name: 'color',
        type: 'color',
        default: '',
        description: 'Color for visual organisation and identification of the category in Mautic',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Optional description of the category to help identify its purpose',
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'The new title or name of the category',
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
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'String or search command to filter categories by.',
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
