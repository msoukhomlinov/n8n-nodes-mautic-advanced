import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
  handleApiError,
  makeApiRequest,
  makePaginatedRequest,
  getOptionalParam,
  getRequiredParam,
} from '../utils/ApiHelpers';
import { buildQueryFromOptions, wrapSingleItem, convertNumericStrings } from '../utils/DataHelpers';
import { validateJSON } from '../GenericFunctions';

export async function executeRoleOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: any;
  try {
    switch (operation) {
      case 'create':
        responseData = await createRole(context, i);
        break;
      case 'update':
        responseData = await updateRole(context, i);
        break;
      case 'get':
        responseData = await getRole(context, i);
        break;
      case 'getAll':
        responseData = await getAllRoles(context, i);
        break;
      case 'delete':
        responseData = await deleteRole(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Role resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Role');
  }
}

async function createRole(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, true);
  const name = getRequiredParam<string>(context, 'name', itemIndex);
  const body: IDataObject = { name };

  const additionalFields = getOptionalParam<IDataObject>(
    context,
    'additionalFields',
    itemIndex,
    {},
  );
  const { description, isAdmin, isPublished, rawPermissions, ...rest } = additionalFields as any;

  if (description) body.description = description as string;
  if (isAdmin !== undefined) body.isAdmin = isAdmin as boolean;
  if (isPublished !== undefined) body.isPublished = isPublished as boolean;

  if (rawPermissions) {
    const parsedPermissions = validateJSON(rawPermissions as string);
    if (parsedPermissions !== undefined) {
      body.rawPermissions = parsedPermissions;
    }
  }

  Object.assign(body, rest);

  const response = await makeApiRequest(context, 'POST', '/roles/new', body);
  let result = response.role ?? response;
  if (simple && result?.fields?.all) {
    result = result.fields.all;
  }
  return convertNumericStrings(result);
}

async function updateRole(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const roleId = getRequiredParam<string>(context, 'roleId', itemIndex);
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, true);
  const body: IDataObject = {};

  const updateFields = getOptionalParam<IDataObject>(context, 'updateFields', itemIndex, {});
  const { name, description, isAdmin, isPublished, rawPermissions, ...rest } = updateFields as any;

  if (name) body.name = name as string;
  if (description) body.description = description as string;
  if (isAdmin !== undefined) body.isAdmin = isAdmin as boolean;
  if (isPublished !== undefined) body.isPublished = isPublished as boolean;

  if (rawPermissions) {
    const parsedPermissions = validateJSON(rawPermissions as string);
    if (parsedPermissions !== undefined) {
      body.rawPermissions = parsedPermissions;
    }
  }

  Object.assign(body, rest);

  const response = await makeApiRequest(context, 'PATCH', `/roles/${roleId}/edit`, body);
  let result = response.role ?? response;
  if (simple && result?.fields?.all) {
    result = result.fields.all;
  }
  return convertNumericStrings(result);
}

async function getRole(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const roleId = getRequiredParam<string>(context, 'roleId', itemIndex);
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, true);
  const response = await makeApiRequest(context, 'GET', `/roles/${roleId}`);
  let result = response.role ?? response;
  if (simple && result?.fields?.all) {
    result = result.fields.all;
  }
  return convertNumericStrings(result);
}

async function getAllRoles(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, true);
  const additionalFields = getOptionalParam<IDataObject>(
    context,
    'additionalFields',
    itemIndex,
    {},
  );
  const qs = buildQueryFromOptions(additionalFields);
  if (!qs.orderBy) qs.orderBy = 'id';
  if (!qs.orderByDir) qs.orderByDir = 'asc';

  let responseData: any[];
  if (returnAll) {
    const limit = getOptionalParam<number | undefined>(context, 'limit', itemIndex, undefined);
    responseData = await makePaginatedRequest(context, 'roles', 'GET', '/roles', {}, qs, limit);
  } else {
    const limit = getRequiredParam<number>(context, 'limit', itemIndex);
    qs.limit = limit;
    const response = await makeApiRequest(context, 'GET', '/roles', {}, qs);
    const rolesContainer = response.roles ?? [];
    responseData = Array.isArray(rolesContainer)
      ? (rolesContainer as any[])
      : (Object.values(rolesContainer) as any[]);
  }

  if (simple) {
    responseData = responseData.map((item: any) => {
      if (item?.fields?.all) {
        return item.fields.all;
      }
      return item;
    });
  }

  return convertNumericStrings(responseData);
}

async function deleteRole(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, true);
  const roleId = getRequiredParam<string>(context, 'roleId', itemIndex);
  const response = await makeApiRequest(context, 'DELETE', `/roles/${roleId}/delete`);
  let result = response.role ?? response;
  if (simple && result?.fields?.all) {
    result = result.fields.all;
  }
  return convertNumericStrings(result);
}
