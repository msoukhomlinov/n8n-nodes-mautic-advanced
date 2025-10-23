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

export async function executeCompanyOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: any;
  try {
    switch (operation) {
      case 'create':
        responseData = await createCompany(context, i);
        break;
      case 'update':
        responseData = await updateCompany(context, i);
        break;
      case 'get':
        responseData = await getCompany(context, i);
        break;
      case 'getAll':
        responseData = await getAllCompanies(context, i);
        break;
      case 'delete':
        responseData = await deleteCompany(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Company resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Company');
  }
}

async function createCompany(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, false);
  const name = getRequiredParam<string>(context, 'name', itemIndex);
  const body: IDataObject = { companyname: name };

  const additionalFields = getOptionalParam<IDataObject>(
    context,
    'additionalFields',
    itemIndex,
    {},
  );
  const {
    addressUi,
    customFieldsUi,
    companyEmail,
    fax,
    industry,
    numberOfEmpoyees,
    phone,
    website,
    annualRevenue,
    description,
    ...rest
  } = additionalFields as any;

  if (addressUi?.addressValues) {
    const { addressValues } = addressUi as { addressValues: IDataObject };
    body.companyaddress1 = addressValues.address1 as string;
    body.companyaddress2 = addressValues.address2 as string;
    body.companycity = addressValues.city as string;
    body.companystate = addressValues.state as string;
    body.companycountry = addressValues.country as string;
    body.companyzipcode = addressValues.zipCode as string;
  }

  if (companyEmail) body.companyemail = companyEmail as string;
  if (fax) body.companyfax = fax as string;
  if (industry) body.companyindustry = industry as string;
  if (numberOfEmpoyees) body.companynumber_of_employees = numberOfEmpoyees as number;
  if (phone) body.companyphone = phone as string;
  if (website) body.companywebsite = website as string;
  if (annualRevenue) body.companyannual_revenue = annualRevenue as number;
  if (description) body.companydescription = description as string;

  if ((customFieldsUi as any)?.customFieldValues) {
    const { customFieldValues } = customFieldsUi as {
      customFieldValues: Array<{ fieldId: string; fieldValue: string }>;
    };
    const data = customFieldValues.reduce(
      (obj, value) => Object.assign(obj, { [`${value.fieldId}`]: value.fieldValue }),
      {} as IDataObject,
    );
    Object.assign(body, data);
  }

  Object.assign(body, rest);

  const response = await makeApiRequest(context, 'POST', '/companies/new', body);
  let result = response.company;
  if (simple) {
    result = result.fields.all;
  }
  return result;
}

async function updateCompany(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const companyId = getRequiredParam<string>(context, 'companyId', itemIndex);
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, false);
  const body: IDataObject = {};

  const updateFields = getOptionalParam<IDataObject>(context, 'updateFields', itemIndex, {});
  const {
    addressUi,
    customFieldsUi,
    companyEmail,
    name,
    fax,
    industry,
    numberOfEmpoyees,
    phone,
    website,
    annualRevenue,
    description,
    ...rest
  } = updateFields as any;

  if (addressUi?.addressValues) {
    const { addressValues } = addressUi as { addressValues: IDataObject };
    body.companyaddress1 = addressValues.address1 as string;
    body.companyaddress2 = addressValues.address2 as string;
    body.companycity = addressValues.city as string;
    body.companystate = addressValues.state as string;
    body.companycountry = addressValues.country as string;
    body.companyzipcode = addressValues.zipCode as string;
  }

  if (companyEmail) body.companyemail = companyEmail as string;
  if (name) body.companyname = name as string;
  if (fax) body.companyfax = fax as string;
  if (industry) body.companyindustry = industry as string;
  if (numberOfEmpoyees) body.companynumber_of_employees = numberOfEmpoyees as number;
  if (phone) body.companyphone = phone as string;
  if (website) body.companywebsite = website as string;
  if (annualRevenue) body.companyannual_revenue = annualRevenue as number;
  if (description) body.companydescription = description as string;

  if ((customFieldsUi as any)?.customFieldValues) {
    const { customFieldValues } = customFieldsUi as {
      customFieldValues: Array<{ fieldId: string; fieldValue: string }>;
    };
    const data = customFieldValues.reduce(
      (obj, value) => Object.assign(obj, { [`${value.fieldId}`]: value.fieldValue }),
      {} as IDataObject,
    );
    Object.assign(body, data);
  }

  Object.assign(body, rest);

  const response = await makeApiRequest(context, 'PATCH', `/companies/${companyId}/edit`, body);
  let result = response.company;
  if (simple) {
    result = result.fields.all;
  }
  return result;
}

async function getCompany(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const companyId = getRequiredParam<string>(context, 'companyId', itemIndex);
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, false);
  const response = await makeApiRequest(context, 'GET', `/companies/${companyId}`);
  let result = response.company;
  if (simple) {
    result = result.fields.all;
  }
  return result;
}

async function getAllCompanies(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, false);
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
    responseData = await makePaginatedRequest(
      context,
      'companies',
      'GET',
      '/companies',
      {},
      qs,
      limit,
    );
  } else {
    const limit = getRequiredParam<number>(context, 'limit', itemIndex);
    qs.limit = limit;
    const response = await makeApiRequest(context, 'GET', '/companies', {}, qs);
    responseData = (response.companies ? Object.values(response.companies) : []) as any[];
  }
  if (simple) {
    responseData = responseData.map((item: any) => item.fields.all);
  }
  return responseData;
}

async function deleteCompany(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, false);
  const companyId = getRequiredParam<string>(context, 'companyId', itemIndex);
  const response = await makeApiRequest(context, 'DELETE', `/companies/${companyId}/delete`);
  let result = response.company;
  if (simple) {
    result = result.fields.all;
  }
  return result;
}
