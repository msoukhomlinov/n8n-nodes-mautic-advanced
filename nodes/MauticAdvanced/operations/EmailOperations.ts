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

export async function executeEmailOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: any;
  try {
    switch (operation) {
      case 'create':
        responseData = await createEmail(context, i);
        break;
      case 'update':
        responseData = await updateEmail(context, i);
        break;
      case 'get':
        responseData = await getEmail(context, i);
        break;
      case 'getAll':
        responseData = await getAllEmails(context, i);
        break;
      case 'delete':
        responseData = await deleteEmail(context, i);
        break;
      case 'createReply':
        responseData = await createReply(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Email resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Email');
  }
}

async function createEmail(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const name = getRequiredParam<string>(context, 'name', itemIndex);
  const additionalFields = getOptionalParam<IDataObject>(
    context,
    'additionalFields',
    itemIndex,
    {},
  );

  const body: IDataObject = {
    name,
  };

  if (additionalFields.subject) {
    body.subject = additionalFields.subject as string;
  }

  if (additionalFields.customHtml) {
    body.customHtml = additionalFields.customHtml as string;
  }

  if (additionalFields.plainText) {
    body.plainText = additionalFields.plainText as string;
  }

  if (additionalFields.emailType) {
    body.emailType = additionalFields.emailType as string;
  }

  if (additionalFields.fromAddress) {
    body.fromAddress = additionalFields.fromAddress as string;
  }

  if (additionalFields.fromName) {
    body.fromName = additionalFields.fromName as string;
  }

  if (additionalFields.replyToAddress) {
    body.replyToAddress = additionalFields.replyToAddress as string;
  }

  if (additionalFields.bccAddress) {
    body.bccAddress = additionalFields.bccAddress as string;
  }

  if (additionalFields.isPublished !== undefined) {
    body.isPublished = additionalFields.isPublished as boolean;
  }

  if (additionalFields.publishUp) {
    body.publishUp = additionalFields.publishUp as string;
  }

  if (additionalFields.publishDown) {
    body.publishDown = additionalFields.publishDown as string;
  }

  if (additionalFields.language) {
    body.language = additionalFields.language as string;
  }

  if (additionalFields.template) {
    body.template = additionalFields.template as string;
  }

  if (additionalFields.category) {
    body.category = additionalFields.category;
  }

  if (additionalFields.unsubscribeForm) {
    body.unsubscribeForm = additionalFields.unsubscribeForm;
  }

  if (additionalFields.lists && Array.isArray(additionalFields.lists)) {
    body.lists = additionalFields.lists;
  }

  if (additionalFields.assetAttachments) {
    if (Array.isArray(additionalFields.assetAttachments)) {
      body.assetAttachments = additionalFields.assetAttachments;
    }
  }

  if (additionalFields.dynamicContent) {
    body.dynamicContent = additionalFields.dynamicContent;
  }

  const response = await makeApiRequest(context, 'POST', '/emails/new', body);
  return response.email;
}

async function updateEmail(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const emailId = getRequiredParam<string>(context, 'emailId', itemIndex);
  const createIfNotFound = getOptionalParam<boolean>(context, 'createIfNotFound', itemIndex, false);
  const updateFields = getOptionalParam<IDataObject>(context, 'updateFields', itemIndex, {});

  const body: IDataObject = {};

  if (updateFields.name) {
    body.name = updateFields.name as string;
  }

  if (updateFields.subject !== undefined) {
    body.subject = updateFields.subject as string;
  }

  if (updateFields.customHtml !== undefined) {
    body.customHtml = updateFields.customHtml as string;
  }

  if (updateFields.plainText !== undefined) {
    body.plainText = updateFields.plainText as string;
  }

  if (updateFields.emailType !== undefined) {
    body.emailType = updateFields.emailType as string;
  }

  if (updateFields.fromAddress !== undefined) {
    body.fromAddress = updateFields.fromAddress as string;
  }

  if (updateFields.fromName !== undefined) {
    body.fromName = updateFields.fromName as string;
  }

  if (updateFields.replyToAddress !== undefined) {
    body.replyToAddress = updateFields.replyToAddress as string;
  }

  if (updateFields.bccAddress !== undefined) {
    body.bccAddress = updateFields.bccAddress as string;
  }

  if (updateFields.isPublished !== undefined) {
    body.isPublished = updateFields.isPublished as boolean;
  }

  if (updateFields.publishUp !== undefined) {
    body.publishUp = updateFields.publishUp as string;
  }

  if (updateFields.publishDown !== undefined) {
    body.publishDown = updateFields.publishDown as string;
  }

  if (updateFields.language !== undefined) {
    body.language = updateFields.language as string;
  }

  if (updateFields.template !== undefined) {
    body.template = updateFields.template as string;
  }

  if (updateFields.category !== undefined) {
    body.category = updateFields.category;
  }

  if (updateFields.unsubscribeForm !== undefined) {
    body.unsubscribeForm = updateFields.unsubscribeForm;
  }

  if (updateFields.lists !== undefined && Array.isArray(updateFields.lists)) {
    body.lists = updateFields.lists;
  }

  if (updateFields.assetAttachments !== undefined) {
    if (Array.isArray(updateFields.assetAttachments)) {
      body.assetAttachments = updateFields.assetAttachments;
    }
  }

  if (updateFields.dynamicContent !== undefined) {
    body.dynamicContent = updateFields.dynamicContent;
  }

  const method = createIfNotFound ? 'PUT' : 'PATCH';
  const response = await makeApiRequest(context, method, `/emails/${emailId}/edit`, body);
  return response.email;
}

async function getEmail(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const emailId = getRequiredParam<string>(context, 'emailId', itemIndex);
  const response = await makeApiRequest(context, 'GET', `/emails/${emailId}`);
  return convertNumericStrings(response.email);
}

async function getAllEmails(context: IExecuteFunctions, itemIndex: number): Promise<any[]> {
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const limit = getOptionalParam<number>(context, 'limit', itemIndex, 50);
  const options = getOptionalParam<any>(context, 'options', itemIndex, {});

  const query = buildQueryFromOptions(options);

  if (returnAll) {
    const result = await makePaginatedRequest(context, 'emails', 'GET', '/emails', {}, query);
    return convertNumericStrings(result);
  } else {
    query.limit = limit;
    const response = await makeApiRequest(context, 'GET', '/emails', {}, query);
    const data = Object.values(response.emails || {});
    return convertNumericStrings(data);
  }
}

async function deleteEmail(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const emailId = getRequiredParam<string>(context, 'emailId', itemIndex);
  const response = await makeApiRequest(context, 'DELETE', `/emails/${emailId}/delete`);
  return response.email ?? { success: true };
}

async function createReply(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const trackingHash = getRequiredParam<string>(context, 'trackingHash', itemIndex);
  const response = await makeApiRequest(context, 'POST', `/emails/reply/${trackingHash}`);
  return response;
}
