import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
  handleApiError,
  makeApiRequest,
  makePaginatedRequest,
  getOptionalParam,
  getRequiredParam,
} from '../utils/ApiHelpers';
import { buildQueryFromOptions, wrapSingleItem, convertNumericStrings } from '../utils/DataHelpers';

export async function executeFieldOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: any;
  try {
    switch (operation) {
      case 'create':
        responseData = await createField(context, i);
        break;
      case 'update':
        responseData = await updateField(context, i);
        break;
      case 'get':
        responseData = await getField(context, i);
        break;
      case 'getAll':
        responseData = await getAllFields(context, i);
        break;
      case 'delete':
        responseData = await deleteField(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Field resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Field');
  }
}

async function createField(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const fieldObject = getRequiredParam<string>(context, 'fieldObject', itemIndex);
  const label = getRequiredParam<string>(context, 'label', itemIndex);
  const type = getRequiredParam<string>(context, 'type', itemIndex);
  const alias = getOptionalParam<string>(context, 'alias', itemIndex, '');
  const group = getOptionalParam<string>(context, 'group', itemIndex, 'core');
  const defaultValue = getOptionalParam<string>(context, 'defaultValue', itemIndex, '');
  const isRequired = getOptionalParam<boolean>(context, 'isRequired', itemIndex, false);
  const isPubliclyUpdatable = getOptionalParam<boolean>(
    context,
    'isPubliclyUpdatable',
    itemIndex,
    false,
  );
  const isUniqueIdentifier = getOptionalParam<boolean>(
    context,
    'isUniqueIdentifier',
    itemIndex,
    false,
  );
  const properties = getOptionalParam<any>(context, 'properties', itemIndex, {});
  const additionalFields = getOptionalParam<any>(context, 'additionalFields', itemIndex, {});

  const body: any = {
    label,
    type,
    group,
    isRequired,
    isPubliclyUpdatable,
    isUniqueIdentifier,
  };

  if (alias) {
    body.alias = alias;
  }

  if (defaultValue) {
    body.defaultValue = defaultValue;
  }

  if (additionalFields.description) {
    body.description = additionalFields.description;
  }

  if (additionalFields.order !== undefined) {
    body.order = additionalFields.order;
  }

  if (additionalFields.isPublished !== undefined) {
    body.isPublished = additionalFields.isPublished;
  }

  // Process properties for select/multiselect fields
  if (properties.list && properties.list.items && Array.isArray(properties.list.items)) {
    body.properties = {
      list: properties.list.items.map((item: any) => ({
        label: item.label,
        value: item.value,
      })),
    };
  }

  const endpoint = `/fields/${fieldObject}/new`;
  const response = await makeApiRequest(context, 'POST', endpoint, body);
  return response.field;
}

async function updateField(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const fieldObject = getRequiredParam<string>(context, 'fieldObject', itemIndex);
  const fieldId = getRequiredParam<string>(context, 'fieldId', itemIndex);
  const createIfNotFound = getOptionalParam<boolean>(context, 'createIfNotFound', itemIndex, false);
  const updateFields = getOptionalParam<any>(context, 'updateFields', itemIndex, {});

  const body: any = {};

  if (updateFields.label) {
    body.label = updateFields.label;
  }

  if (updateFields.type) {
    body.type = updateFields.type;
  }

  if (updateFields.alias) {
    body.alias = updateFields.alias;
  }

  if (updateFields.group) {
    body.group = updateFields.group;
  }

  if (updateFields.defaultValue !== undefined) {
    body.defaultValue = updateFields.defaultValue;
  }

  if (updateFields.isRequired !== undefined) {
    body.isRequired = updateFields.isRequired;
  }

  if (updateFields.isPubliclyUpdatable !== undefined) {
    body.isPubliclyUpdatable = updateFields.isPubliclyUpdatable;
  }

  if (updateFields.isUniqueIdentifier !== undefined) {
    body.isUniqueIdentifier = updateFields.isUniqueIdentifier;
  }

  if (updateFields.description !== undefined) {
    body.description = updateFields.description;
  }

  if (updateFields.order !== undefined) {
    body.order = updateFields.order;
  }

  if (updateFields.isPublished !== undefined) {
    body.isPublished = updateFields.isPublished;
  }

  // Process properties for select/multiselect fields
  if (
    updateFields.properties &&
    updateFields.properties.list &&
    updateFields.properties.list.items &&
    Array.isArray(updateFields.properties.list.items)
  ) {
    body.properties = {
      list: updateFields.properties.list.items.map((item: any) => ({
        label: item.label,
        value: item.value,
      })),
    };
  }

  const endpoint = `/fields/${fieldObject}/${fieldId}/edit`;
  const method = createIfNotFound ? 'PUT' : 'PATCH';
  const response = await makeApiRequest(context, method, endpoint, body);
  return response.field;
}

async function getField(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const fieldObject = getRequiredParam<string>(context, 'fieldObject', itemIndex);
  const fieldId = getRequiredParam<string>(context, 'fieldId', itemIndex);

  const endpoint = `/fields/${fieldObject}/${fieldId}`;
  const response = await makeApiRequest(context, 'GET', endpoint);
  return convertNumericStrings(response.field);
}

async function getAllFields(context: IExecuteFunctions, itemIndex: number): Promise<any[]> {
  const fieldObject = getRequiredParam<string>(context, 'fieldObject', itemIndex);
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const limit = getOptionalParam<number>(context, 'limit', itemIndex, 50);
  const options = getOptionalParam<any>(context, 'options', itemIndex, {});

  const query = buildQueryFromOptions(options);

  if (returnAll) {
    const result = await makePaginatedRequest(
      context,
      'fields',
      'GET',
      `/fields/${fieldObject}`,
      {},
      query,
    );
    return convertNumericStrings(result);
  } else {
    query.limit = limit;
    const response = await makeApiRequest(context, 'GET', `/fields/${fieldObject}`, {}, query);
    const data = Object.values(response.fields || {});
    return convertNumericStrings(data);
  }
}

async function deleteField(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const fieldObject = getRequiredParam<string>(context, 'fieldObject', itemIndex);
  const fieldId = getRequiredParam<string>(context, 'fieldId', itemIndex);

  const endpoint = `/fields/${fieldObject}/${fieldId}/delete`;
  const response = await makeApiRequest(context, 'DELETE', endpoint);
  return response.field;
}
