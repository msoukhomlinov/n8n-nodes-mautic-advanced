import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
  makeApiRequest,
  makePaginatedRequest,
  getOptionalParam,
  getRequiredParam,
  handleApiError,
} from '../utils/ApiHelpers';
import { buildQueryFromOptions, processBatchIds, wrapSingleItem } from '../utils/DataHelpers';

export async function executeSegmentOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: any;
  try {
    switch (operation) {
      case 'create':
        responseData = await createSegment(context, i);
        break;
      case 'update':
        responseData = await updateSegment(context, i);
        break;
      case 'get':
        responseData = await getSegment(context, i);
        break;
      case 'getAll':
        responseData = await getAllSegments(context, i);
        break;
      case 'delete':
        responseData = await deleteSegment(context, i);
        break;
      case 'addContact':
        responseData = await addContactToSegment(context, i);
        break;
      case 'removeContact':
        responseData = await removeContactFromSegment(context, i);
        break;
      case 'addContacts':
        responseData = await addContactsToSegment(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Segment resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Segment');
  }
}

async function createSegment(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const name = getRequiredParam<string>(context, 'name', itemIndex);
  const additionalFields = getOptionalParam<IDataObject>(
    context,
    'additionalFields',
    itemIndex,
    {},
  );
  const body: IDataObject = { name, ...additionalFields };
  const response = await makeApiRequest(context, 'POST', '/segments/new', body);
  return response.list;
}

async function updateSegment(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const segmentId = getRequiredParam<string>(context, 'segmentId', itemIndex);
  const createIfNotFound = getOptionalParam<boolean>(context, 'createIfNotFound', itemIndex, false);
  const name = getRequiredParam<string>(context, 'name', itemIndex);
  const additionalFields = getOptionalParam<IDataObject>(
    context,
    'additionalFields',
    itemIndex,
    {},
  );
  const body: IDataObject = { name, ...additionalFields };
  const method = createIfNotFound ? 'PUT' : 'PATCH';
  const response = await makeApiRequest(context, method, `/segments/${segmentId}/edit`, body);
  return response.list;
}

async function getSegment(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const segmentId = getRequiredParam<string>(context, 'segmentId', itemIndex);
  const response = await makeApiRequest(context, 'GET', `/segments/${segmentId}`);
  return response.list;
}

async function getAllSegments(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const options = getOptionalParam<IDataObject>(context, 'options', itemIndex, {});
  const qs = buildQueryFromOptions(options);
  if (returnAll) {
    return await makePaginatedRequest(context, 'lists', 'GET', '/segments', {}, qs);
  } else {
    const limit = getOptionalParam<number>(context, 'limit', itemIndex, 30);
    qs.limit = limit;
    const response = await makeApiRequest(context, 'GET', '/segments', {}, qs);
    return response.lists ? Object.values(response.lists) : [];
  }
}

async function deleteSegment(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const segmentId = getRequiredParam<string>(context, 'segmentId', itemIndex);
  const response = await makeApiRequest(context, 'DELETE', `/segments/${segmentId}/delete`);
  return response.list;
}

async function addContactToSegment(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const segmentId = getRequiredParam<string>(context, 'segmentId', itemIndex);
  const contactId = getRequiredParam<string>(context, 'contactId', itemIndex);
  return await makeApiRequest(context, 'POST', `/segments/${segmentId}/contact/${contactId}/add`);
}

async function removeContactFromSegment(
  context: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const segmentId = getRequiredParam<string>(context, 'segmentId', itemIndex);
  const contactId = getRequiredParam<string>(context, 'contactId', itemIndex);
  return await makeApiRequest(
    context,
    'POST',
    `/segments/${segmentId}/contact/${contactId}/remove`,
  );
}

async function addContactsToSegment(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const segmentId = getRequiredParam<string>(context, 'segmentId', itemIndex);
  const contactIdsString = getOptionalParam<string>(context, 'contactIds', itemIndex, '');
  const contactIds = processBatchIds(contactIdsString, context.getInputData(), 'contactId');
  const body: IDataObject = { ids: contactIds.split(',') };
  return await makeApiRequest(context, 'POST', `/segments/${segmentId}/contacts/add`, body);
}
