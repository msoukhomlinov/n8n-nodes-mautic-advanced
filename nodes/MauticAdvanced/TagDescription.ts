import type { INodeProperties } from 'n8n-workflow';

export const tagOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['tag'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new tag',
        action: 'Create a tag',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a tag',
        action: 'Delete a tag',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get data of a tag',
        action: 'Get a tag',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get data of many tags',
        action: 'Get many tags',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a tag',
        action: 'Update a tag',
      },
    ],
    default: 'create',
  },
];

export const tagFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                  tag:create                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Tag',
    name: 'tag',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The name of the tag to create',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The description of the tag',
  },

  /* -------------------------------------------------------------------------- */
  /*                                  tag:update                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Tag ID',
    name: 'tagId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        operation: ['update'],
        resource: ['tag'],
      },
    },
    default: '',
    description: 'The ID of the tag to update',
  },
  {
    displayName: 'Create If Not Found',
    name: 'createIfNotFound',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['update'],
      },
    },
    default: false,
    description: 'Whether to create a new tag if one with the given ID is not found',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'The new description of the tag',
      },
      {
        displayName: 'Tag',
        name: 'tag',
        type: 'string',
        default: '',
        description: 'The new name of the tag',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                   tag:get                                  */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Tag ID',
    name: 'tagId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        operation: ['get'],
        resource: ['tag'],
      },
    },
    default: '',
    description: 'The ID of the tag to return',
  },

  /* -------------------------------------------------------------------------- */
  /*                                  tag:getAll                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['tag'],
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
        resource: ['tag'],
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
        resource: ['tag'],
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
        description: 'String or search command to filter tags by.',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /*                                  tag:delete                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Tag ID',
    name: 'tagId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        operation: ['delete'],
        resource: ['tag'],
      },
    },
    default: '',
    description: 'ID of the tag to delete',
  },
];
