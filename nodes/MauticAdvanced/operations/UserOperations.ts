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

export async function executeUserOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: any;
  try {
    switch (operation) {
      case 'create':
        responseData = await createUser(context, i);
        break;
      case 'update':
        responseData = await updateUser(context, i);
        break;
      case 'get':
        responseData = await getUser(context, i);
        break;
      case 'getAll':
        responseData = await getAllUsers(context, i);
        break;
      case 'delete':
        responseData = await deleteUser(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for User resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'User');
  }
}

async function createUser(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, true);
  const username = getRequiredParam<string>(context, 'username', itemIndex);
  const email = getRequiredParam<string>(context, 'email', itemIndex);
  const body: IDataObject = {
    username,
    email,
  };

  const firstName = getOptionalParam<string | undefined>(
    context,
    'firstName',
    itemIndex,
    undefined,
  );
  const lastName = getOptionalParam<string | undefined>(context, 'lastName', itemIndex, undefined);

  if (firstName) body.firstName = firstName;
  if (lastName) body.lastName = lastName;

  // Password
  const plainPassword = getOptionalParam<IDataObject | undefined>(
    context,
    'plainPassword',
    itemIndex,
    undefined,
  );
  if (plainPassword && (plainPassword as any).passwordValues) {
    const { passwordValues } = plainPassword as { passwordValues: IDataObject };
    const password = passwordValues.password as string | undefined;
    const confirm = passwordValues.confirm as string | undefined;
    if (password || confirm) {
      body.plainPassword = {
        password,
        confirm,
      };
    }
  }

  const role = getOptionalParam<number | undefined>(context, 'role', itemIndex, undefined);
  if (role !== undefined) {
    body.role = role;
  }

  const additionalFields = getOptionalParam<IDataObject>(
    context,
    'additionalFields',
    itemIndex,
    {},
  );
  const { isPublished, position, timezone, locale, onlineStatus, signature, ...rest } =
    additionalFields as any;

  if (isPublished !== undefined) body.isPublished = isPublished as boolean;
  if (position) body.position = position as string;
  if (timezone) body.timezone = timezone as string;
  if (locale) body.locale = locale as string;
  if (onlineStatus) body.onlineStatus = onlineStatus as string;
  if (signature) body.signature = signature as string;

  Object.assign(body, rest);

  const response = await makeApiRequest(context, 'POST', '/users/new', body);
  let result = response.user ?? response;
  // For users, Mautic does not always provide fields.all, but handle it gracefully if present
  if (simple && result?.fields?.all) {
    result = result.fields.all;
  }
  return convertNumericStrings(result);
}

async function updateUser(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const userId = getRequiredParam<string>(context, 'userId', itemIndex);
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, true);
  const body: IDataObject = {};

  const updateFields = getOptionalParam<IDataObject>(context, 'updateFields', itemIndex, {});
  const {
    username,
    email,
    firstName,
    lastName,
    role,
    plainPassword,
    isPublished,
    position,
    timezone,
    locale,
    onlineStatus,
    signature,
    ...rest
  } = updateFields as any;

  if (username) body.username = username as string;
  if (email) body.email = email as string;
  if (firstName) body.firstName = firstName as string;
  if (lastName) body.lastName = lastName as string;
  if (role !== undefined) body.role = role as number;
  if (isPublished !== undefined) body.isPublished = isPublished as boolean;
  if (position) body.position = position as string;
  if (timezone) body.timezone = timezone as string;
  if (locale) body.locale = locale as string;
  if (onlineStatus) body.onlineStatus = onlineStatus as string;
  if (signature) body.signature = signature as string;

  if (plainPassword && plainPassword.passwordValues) {
    const { passwordValues } = plainPassword as { passwordValues: IDataObject };
    const password = passwordValues.password as string | undefined;
    const confirm = passwordValues.confirm as string | undefined;
    if (password || confirm) {
      body.plainPassword = {
        password,
        confirm,
      };
    }
  }

  Object.assign(body, rest);

  const response = await makeApiRequest(context, 'PATCH', `/users/${userId}/edit`, body);
  let result = response.user ?? response;
  if (simple && result?.fields?.all) {
    result = result.fields.all;
  }
  return convertNumericStrings(result);
}

async function getUser(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const userId = getRequiredParam<string>(context, 'userId', itemIndex);
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, true);
  const response = await makeApiRequest(context, 'GET', `/users/${userId}`);
  let result = response.user ?? response;
  if (simple && result?.fields?.all) {
    result = result.fields.all;
  }
  return convertNumericStrings(result);
}

async function getAllUsers(context: IExecuteFunctions, itemIndex: number): Promise<any> {
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
    responseData = await makePaginatedRequest(context, 'users', 'GET', '/users', {}, qs, limit);
  } else {
    const limit = getRequiredParam<number>(context, 'limit', itemIndex);
    qs.limit = limit;
    const response = await makeApiRequest(context, 'GET', '/users', {}, qs);
    const usersContainer = response.users ?? [];
    responseData = Array.isArray(usersContainer)
      ? (usersContainer as any[])
      : (Object.values(usersContainer) as any[]);
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

async function deleteUser(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, true);
  const userId = getRequiredParam<string>(context, 'userId', itemIndex);
  const response = await makeApiRequest(context, 'DELETE', `/users/${userId}/delete`);
  let result = response.user ?? response;
  if (simple && result?.fields?.all) {
    result = result.fields.all;
  }
  return convertNumericStrings(result);
}
