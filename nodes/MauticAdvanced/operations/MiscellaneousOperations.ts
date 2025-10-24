import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
  makeApiRequest,
  makePaginatedRequest,
  getOptionalParam,
  getRequiredParam,
  handleApiError,
} from '../utils/ApiHelpers';
import { buildQueryFromOptions, wrapSingleItem, convertNumericStrings } from '../utils/DataHelpers';

// Public execute entry points
export async function executeTagOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  try {
    let responseData: any;
    switch (operation) {
      case 'create':
        responseData = await createTag(context, i);
        break;
      case 'update':
        responseData = await updateTag(context, i);
        break;
      case 'get':
        responseData = await getTag(context, i);
        break;
      case 'getAll':
        responseData = await getAllTags(context, i);
        break;
      case 'delete':
        responseData = await deleteTag(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Tag resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Tag');
  }
}

export async function executeCategoryOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  try {
    let responseData: any;
    switch (operation) {
      case 'create':
        responseData = await createCategory(context, i);
        break;
      case 'update':
        responseData = await updateCategory(context, i);
        break;
      case 'get':
        responseData = await getCategory(context, i);
        break;
      case 'getAll':
        responseData = await getAllCategories(context, i);
        break;
      case 'delete':
        responseData = await deleteCategory(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Category resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Category');
  }
}

export async function executeEmailOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  try {
    let responseData: any;
    switch (operation) {
      case 'send':
        responseData = await sendEmail(context, i);
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

export async function executeContactSegmentOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  try {
    let responseData: any;
    switch (operation) {
      case 'add':
        responseData = await addContactToSegment(context, i);
        break;
      case 'remove':
        responseData = await removeContactFromSegment(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Contact Segment resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Contact Segment');
  }
}

export async function executeCampaignContactOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  try {
    let responseData: any;
    switch (operation) {
      case 'add':
        responseData = await addContactToCampaign(context, i);
        break;
      case 'remove':
        responseData = await removeContactFromCampaign(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Campaign Contact resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Campaign Contact');
  }
}

export async function executeCompanyContactOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  try {
    let responseData: any;
    switch (operation) {
      case 'add':
        responseData = await addContactToCompany(context, i);
        break;
      case 'remove':
        responseData = await removeContactFromCompany(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Company Contact resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Company Contact');
  }
}

// Tag operations
async function createTag(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const tag = getRequiredParam<string>(context, 'tag', itemIndex);
  const body: IDataObject = { tag };
  const response = await makeApiRequest(context, 'POST', '/tags/new', body);
  return response.tag;
}

async function updateTag(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const tagId = getRequiredParam<string>(context, 'tagId', itemIndex);
  const createIfNotFound = getOptionalParam<boolean>(context, 'createIfNotFound', itemIndex, false);
  const updateFields = getOptionalParam<IDataObject>(context, 'updateFields', itemIndex, {});
  const body: IDataObject = {};
  if (updateFields.tag) body.tag = updateFields.tag as string;
  const method = createIfNotFound ? 'PUT' : 'PATCH';
  const response = await makeApiRequest(context, method, `/tags/${tagId}/edit`, body);
  return response.tag;
}

async function getTag(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const tagId = getRequiredParam<string>(context, 'tagId', itemIndex);
  const response = await makeApiRequest(context, 'GET', `/tags/${tagId}`);
  return convertNumericStrings(response.tag);
}

async function getAllTags(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const options = getOptionalParam<IDataObject>(context, 'options', itemIndex, {});
  const qs = buildQueryFromOptions(options);
  if (!qs.orderBy) qs.orderBy = 'id';
  if (!qs.orderByDir) qs.orderByDir = 'asc';
  if (returnAll) {
    const limit = getOptionalParam<number | undefined>(context, 'limit', itemIndex, undefined);
    const result = await makePaginatedRequest(context, 'tags', 'GET', '/tags', {}, qs, limit);
    return convertNumericStrings(result);
  } else {
    qs.limit = getOptionalParam<number>(context, 'limit', itemIndex, 30);
    const response = await makeApiRequest(context, 'GET', '/tags', {}, qs);
    const data = response.tags ? Object.values(response.tags) : [];
    return convertNumericStrings(data);
  }
}

async function deleteTag(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const tagId = getRequiredParam<string>(context, 'tagId', itemIndex);
  const response = await makeApiRequest(context, 'DELETE', `/tags/${tagId}/delete`);
  return response.tag ?? { success: true };
}

// Category operations
async function createCategory(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const body: IDataObject = {
    title: getRequiredParam<string>(context, 'title', itemIndex),
    bundle: getRequiredParam<string>(context, 'bundle', itemIndex),
  };
  const description = getOptionalParam<string>(context, 'description', itemIndex, '');
  if (description) body.description = description;
  const color = getOptionalParam<string>(context, 'color', itemIndex, '');
  if (color) body.color = color;
  const response = await makeApiRequest(context, 'POST', '/categories/new', body);
  return response.category;
}

async function updateCategory(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const categoryId = getRequiredParam<string>(context, 'categoryId', itemIndex);
  const createIfNotFound = getOptionalParam<boolean>(context, 'createIfNotFound', itemIndex, false);
  const updateFields = getOptionalParam<IDataObject>(context, 'updateFields', itemIndex, {});
  const body: IDataObject = {};
  if (updateFields.title) body.title = updateFields.title as string;
  if (updateFields.description) body.description = updateFields.description as string;
  if (updateFields.color) body.color = updateFields.color as string;
  if (updateFields.bundle) body.bundle = updateFields.bundle as string;
  const method = createIfNotFound ? 'PUT' : 'PATCH';
  const response = await makeApiRequest(context, method, `/categories/${categoryId}/edit`, body);
  return response.category;
}

async function getCategory(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const categoryId = getRequiredParam<string>(context, 'categoryId', itemIndex);
  const response = await makeApiRequest(context, 'GET', `/categories/${categoryId}`);
  return convertNumericStrings(response.category);
}

async function getAllCategories(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const options = getOptionalParam<IDataObject>(context, 'options', itemIndex, {});
  const qs = buildQueryFromOptions(options);
  if (!qs.orderBy) qs.orderBy = 'id';
  if (!qs.orderByDir) qs.orderByDir = 'asc';
  let limit: number | undefined = undefined;
  if (!returnAll) {
    limit = getOptionalParam<number>(context, 'limit', itemIndex, 30);
  }
  const result = await makePaginatedRequest(context, 'categories', 'GET', '/categories', {}, qs, limit);
  return convertNumericStrings(result);
}

async function deleteCategory(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const categoryId = getRequiredParam<string>(context, 'categoryId', itemIndex);
  const response = await makeApiRequest(context, 'DELETE', `/categories/${categoryId}/delete`);
  return response.category ?? { success: true };
}

// Email operations
async function sendEmail(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const segmentEmailId = getRequiredParam<string>(context, 'segmentEmailId', itemIndex);
  const response = await makeApiRequest(context, 'POST', `/emails/${segmentEmailId}/send`);
  return response;
}

// Contact-Segment relationships
async function addContactToSegment(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam<string>(context, 'contactId', itemIndex);
  const segmentId = getRequiredParam<string>(context, 'segmentId', itemIndex);
  return await makeApiRequest(context, 'POST', `/segments/${segmentId}/contact/${contactId}/add`);
}

async function removeContactFromSegment(
  context: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const contactId = getRequiredParam<string>(context, 'contactId', itemIndex);
  const segmentId = getRequiredParam<string>(context, 'segmentId', itemIndex);
  return await makeApiRequest(
    context,
    'POST',
    `/segments/${segmentId}/contact/${contactId}/remove`,
  );
}

// Campaign-Contact relationships
async function addContactToCampaign(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam<string>(context, 'contactId', itemIndex);
  const campaignId = getRequiredParam<string>(context, 'campaignId', itemIndex);
  return await makeApiRequest(context, 'POST', `/campaigns/${campaignId}/contact/${contactId}/add`);
}

async function removeContactFromCampaign(
  context: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const contactId = getRequiredParam<string>(context, 'contactId', itemIndex);
  const campaignId = getRequiredParam<string>(context, 'campaignId', itemIndex);
  return await makeApiRequest(
    context,
    'POST',
    `/campaigns/${campaignId}/contact/${contactId}/remove`,
  );
}

// Company-Contact relationships
async function addContactToCompany(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const contactId = getRequiredParam<string>(context, 'contactId', itemIndex);
  const companyId = getRequiredParam<string>(context, 'companyId', itemIndex);
  return await makeApiRequest(
    context,
    'POST',
    `/companies/${companyId}/contact/${contactId}/add`,
    {},
  );
}

async function removeContactFromCompany(
  context: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const contactId = getRequiredParam<string>(context, 'contactId', itemIndex);
  const companyId = getRequiredParam<string>(context, 'companyId', itemIndex);
  return await makeApiRequest(
    context,
    'POST',
    `/companies/${companyId}/contact/${contactId}/remove`,
    {},
  );
}
