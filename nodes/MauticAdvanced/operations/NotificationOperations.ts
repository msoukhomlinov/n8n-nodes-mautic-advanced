import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
  handleApiError,
  makeApiRequest,
  makePaginatedRequest,
  getOptionalParam,
  getRequiredParam,
} from '../utils/ApiHelpers';
import { buildQueryFromOptions, wrapSingleItem } from '../utils/DataHelpers';

export async function executeNotificationOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: any;
  try {
    switch (operation) {
      case 'create':
        responseData = await createNotification(context, i);
        break;
      case 'update':
        responseData = await updateNotification(context, i);
        break;
      case 'get':
        responseData = await getNotification(context, i);
        break;
      case 'getAll':
        responseData = await getAllNotifications(context, i);
        break;
      case 'delete':
        responseData = await deleteNotification(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Notification resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Notification');
  }
}

async function createNotification(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const name = getRequiredParam<string>(context, 'name', itemIndex);
  const heading = getRequiredParam<string>(context, 'heading', itemIndex);
  const message = getRequiredParam<string>(context, 'message', itemIndex);
  const url = getOptionalParam<string>(context, 'url', itemIndex, '');
  const isPublished = getOptionalParam<boolean>(context, 'isPublished', itemIndex, false);
  const language = getOptionalParam<string>(context, 'language', itemIndex, '');
  const publishUp = getOptionalParam<string>(context, 'publishUp', itemIndex, '');
  const publishDown = getOptionalParam<string>(context, 'publishDown', itemIndex, '');
  const additionalFields = getOptionalParam<any>(context, 'additionalFields', itemIndex, {});

  const body: any = {
    name,
    heading,
    message,
  };

  if (url) {
    body.url = url;
  }

  if (isPublished !== undefined) {
    body.isPublished = isPublished;
  }

  if (language) {
    body.language = language;
  }

  if (publishUp) {
    body.publishUp = publishUp;
  }

  if (publishDown) {
    body.publishDown = publishDown;
  }

  if (additionalFields.category) {
    body.category = additionalFields.category;
  }

  const endpoint = '/notifications/new';
  const response = await makeApiRequest(context, 'POST', endpoint, body);
  return response.notification;
}

async function updateNotification(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const notificationId = getRequiredParam<string>(context, 'notificationId', itemIndex);
  const createIfNotFound = getOptionalParam<boolean>(context, 'createIfNotFound', itemIndex, false);
  const updateFields = getOptionalParam<any>(context, 'updateFields', itemIndex, {});

  const body: any = {};

  if (updateFields.name) {
    body.name = updateFields.name;
  }

  if (updateFields.heading) {
    body.heading = updateFields.heading;
  }

  if (updateFields.message) {
    body.message = updateFields.message;
  }

  if (updateFields.url !== undefined) {
    body.url = updateFields.url;
  }

  if (updateFields.isPublished !== undefined) {
    body.isPublished = updateFields.isPublished;
  }

  if (updateFields.language !== undefined) {
    body.language = updateFields.language;
  }

  if (updateFields.publishUp !== undefined) {
    body.publishUp = updateFields.publishUp;
  }

  if (updateFields.publishDown !== undefined) {
    body.publishDown = updateFields.publishDown;
  }

  if (updateFields.category !== undefined) {
    body.category = updateFields.category;
  }

  const endpoint = `/notifications/${notificationId}/edit`;
  const method = createIfNotFound ? 'PUT' : 'PATCH';
  const response = await makeApiRequest(context, method, endpoint, body);
  return response.notification;
}

async function getNotification(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const notificationId = getRequiredParam<string>(context, 'notificationId', itemIndex);

  const endpoint = `/notifications/${notificationId}`;
  const response = await makeApiRequest(context, 'GET', endpoint);
  return response.notification;
}

async function getAllNotifications(context: IExecuteFunctions, itemIndex: number): Promise<any[]> {
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const limit = getOptionalParam<number>(context, 'limit', itemIndex, 50);
  const options = getOptionalParam<any>(context, 'options', itemIndex, {});

  const query = buildQueryFromOptions(options);

  if (returnAll) {
    return await makePaginatedRequest(context, 'notifications', 'GET', '/notifications', {}, query);
  } else {
    query.limit = limit;
    const response = await makeApiRequest(context, 'GET', '/notifications', {}, query);
    return Object.values(response.notifications || {});
  }
}

async function deleteNotification(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const notificationId = getRequiredParam<string>(context, 'notificationId', itemIndex);

  const endpoint = `/notifications/${notificationId}/delete`;
  const response = await makeApiRequest(context, 'DELETE', endpoint);
  return response.notification;
}
