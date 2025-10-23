import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
  handleApiError,
  makeApiRequest,
  makePaginatedRequest,
  getOptionalParam,
  getRequiredParam,
} from '../utils/ApiHelpers';
import { buildQueryFromOptions, wrapSingleItem } from '../utils/DataHelpers';

export async function executeCampaignOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: any;
  try {
    switch (operation) {
      case 'create':
        responseData = await createCampaign(context, i);
        break;
      case 'update':
        responseData = await updateCampaign(context, i);
        break;
      case 'clone':
        responseData = await cloneCampaign(context, i);
        break;
      case 'get':
        responseData = await getCampaign(context, i);
        break;
      case 'getAll':
        responseData = await getAllCampaigns(context, i);
        break;
      case 'getContacts':
        responseData = await getCampaignContacts(context, i);
        break;
      case 'delete':
        responseData = await deleteCampaign(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Campaign resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Campaign');
  }
}

async function createCampaign(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const name = getRequiredParam<string>(context, 'name', itemIndex);
  const additionalFields = getOptionalParam<IDataObject>(
    context,
    'additionalFields',
    itemIndex,
    {},
  );
  const body: IDataObject = { name, ...additionalFields };
  const response = await makeApiRequest(context, 'POST', '/campaigns/new', body);
  return response.campaign;
}

async function updateCampaign(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const campaignId = getRequiredParam<string>(context, 'campaignId', itemIndex);
  const updateFields = getOptionalParam<IDataObject>(context, 'updateFields', itemIndex, {});
  const body: IDataObject = { ...updateFields };
  const response = await makeApiRequest(context, 'PATCH', `/campaigns/${campaignId}/edit`, body);
  return response.campaign;
}

async function cloneCampaign(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const campaignId = getRequiredParam<string>(context, 'campaignId', itemIndex);
  const response = await makeApiRequest(context, 'POST', `/campaigns/${campaignId}/clone`);
  return response.campaign;
}

async function getCampaign(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const campaignId = getRequiredParam<string>(context, 'campaignId', itemIndex);
  const response = await makeApiRequest(context, 'GET', `/campaigns/${campaignId}`);
  return response.campaign;
}

async function getAllCampaigns(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const options = getOptionalParam<IDataObject>(context, 'options', itemIndex, {});
  const qs = buildQueryFromOptions(options);
  if (!qs.orderBy) qs.orderBy = 'id';
  if (!qs.orderByDir) qs.orderByDir = 'asc';
  if (returnAll) {
    return await makePaginatedRequest(context, 'campaigns', 'GET', '/campaigns', {}, qs);
  } else {
    qs.limit = getOptionalParam<number>(context, 'limit', itemIndex, 30);
    const response = await makeApiRequest(context, 'GET', '/campaigns', {}, qs);
    return response.campaigns;
  }
}

async function getCampaignContacts(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const campaignId = getRequiredParam<string>(context, 'campaignId', itemIndex);
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const options = getOptionalParam<IDataObject>(context, 'options', itemIndex, {});
  const qs = buildQueryFromOptions(options);
  if (returnAll) {
    return await makePaginatedRequest(
      context,
      'contacts',
      'GET',
      `/campaigns/${campaignId}/contacts`,
      {},
      qs,
    );
  } else {
    qs.limit = getOptionalParam<number>(context, 'limit', itemIndex, 30);
    const response = await makeApiRequest(
      context,
      'GET',
      `/campaigns/${campaignId}/contacts`,
      {},
      qs,
    );
    return response.contacts;
  }
}

async function deleteCampaign(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const campaignId = getRequiredParam<string>(context, 'campaignId', itemIndex);
  const response = await makeApiRequest(context, 'DELETE', `/campaigns/${campaignId}/delete`);
  return response.campaign;
}
