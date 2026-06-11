import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
  handleApiError,
  makeApiRequest,
  makePaginatedRequest,
  getOptionalParam,
  getRequiredParam,
} from '../utils/ApiHelpers';
import { getMauticVersion } from '../GenericFunctions';
import { buildQueryFromOptions, wrapSingleItem, convertNumericStrings } from '../utils/DataHelpers';

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
  const mauticVersion = await getMauticVersion(context);

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
    numberOfEmployees,
    owner,
    phone,
    website,
    annualRevenue,
    description,
    ...rest
  } = additionalFields as any;

  const body: IDataObject = {};

  if (mauticVersion === 'v7') {
    body.name = name;
    if (addressUi?.addressValues) {
      const { addressValues } = addressUi as { addressValues: IDataObject };
      if (addressValues.address1) body.address1 = addressValues.address1 as string;
      if (addressValues.address2) body.address2 = addressValues.address2 as string;
      if (addressValues.city) body.city = addressValues.city as string;
      if (addressValues.state) body.state = addressValues.state as string;
      if (addressValues.country) body.country = addressValues.country as string;
      if (addressValues.zipCode) body.zipcode = addressValues.zipCode as string;
    }
    if (companyEmail) body.email = companyEmail as string;
    if (industry) body.industry = industry as string;
    if (owner) body.owner = `/api/v2/users/${owner}`;
    if (phone) body.phone = phone as string;
    if (website) body.website = website as string;
    if (description) body.description = description as string;
    // fax, numberOfEmployees, annualRevenue not in v7 Company entity write group — omitted
  } else {
    body.companyname = name;
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
    if (numberOfEmployees) body.companynumber_of_employees = numberOfEmployees as number;
    if (owner) body.owner = owner as number;
    if (phone) body.companyphone = phone as string;
    if (website) body.companywebsite = website as string;
    if (annualRevenue) body.companyannual_revenue = annualRevenue as number;
    if (description) body.companydescription = description as string;
  }

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

  // v7 API Platform rejects unknown fields; rest only applies to v1
  if (mauticVersion !== 'v7') Object.assign(body, rest);

  let result: any;
  if (mauticVersion === 'v7') {
    const response = await makeApiRequest(context, 'POST', '/v2/companies', body, {}, undefined, {
      'Content-Type': 'application/json',
    });
    result = response;
  } else {
    const response = await makeApiRequest(context, 'POST', '/companies/new', body);
    result = response.company;
  }

  if (simple) {
    result = toSimpleCompany(result);
  }
  return result;
}

async function updateCompany(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const companyId = getRequiredParam<string>(context, 'companyId', itemIndex);
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, false);
  const mauticVersion = await getMauticVersion(context);
  const body: IDataObject = {};

  const updateFields = getOptionalParam<IDataObject>(context, 'updateFields', itemIndex, {});
  const {
    addressUi,
    customFieldsUi,
    companyEmail,
    name,
    fax,
    industry,
    numberOfEmployees,
    owner,
    phone,
    website,
    annualRevenue,
    description,
    ...rest
  } = updateFields as any;

  if (mauticVersion === 'v7') {
    if (name) body.name = name as string;
    if (addressUi?.addressValues) {
      const { addressValues } = addressUi as { addressValues: IDataObject };
      if (addressValues.address1) body.address1 = addressValues.address1 as string;
      if (addressValues.address2) body.address2 = addressValues.address2 as string;
      if (addressValues.city) body.city = addressValues.city as string;
      if (addressValues.state) body.state = addressValues.state as string;
      if (addressValues.country) body.country = addressValues.country as string;
      if (addressValues.zipCode) body.zipcode = addressValues.zipCode as string;
    }
    if (companyEmail) body.email = companyEmail as string;
    if (industry) body.industry = industry as string;
    if (owner) body.owner = `/api/v2/users/${owner}`;
    if (phone) body.phone = phone as string;
    if (website) body.website = website as string;
    if (description) body.description = description as string;
    // fax, numberOfEmployees, annualRevenue not in v7 Company entity write group — omitted
  } else {
    if (name) body.companyname = name as string;
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
    if (numberOfEmployees) body.companynumber_of_employees = numberOfEmployees as number;
    if (owner) body.owner = owner as number;
    if (phone) body.companyphone = phone as string;
    if (website) body.companywebsite = website as string;
    if (annualRevenue) body.companyannual_revenue = annualRevenue as number;
    if (description) body.companydescription = description as string;
  }

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

  // v7 API Platform rejects unknown fields; rest only applies to v1
  if (mauticVersion !== 'v7') Object.assign(body, rest);

  let result: any;
  if (mauticVersion === 'v7') {
    const response = await makeApiRequest(
      context,
      'PATCH',
      `/v2/companies/${companyId}`,
      body,
      {},
      undefined,
      { 'Content-Type': 'application/merge-patch+json' },
    );
    result = response;
  } else {
    const response = await makeApiRequest(context, 'PATCH', `/companies/${companyId}/edit`, body);
    result = response.company;
  }

  if (simple) {
    result = toSimpleCompany(result);
  }
  return result;
}

async function getCompany(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const companyId = getRequiredParam<string>(context, 'companyId', itemIndex);
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, false);
  const mauticVersion = await getMauticVersion(context);

  let result: any;
  if (mauticVersion === 'v7') {
    result = await makeApiRequest(context, 'GET', `/v2/companies/${companyId}`);
  } else {
    const response = await makeApiRequest(context, 'GET', `/companies/${companyId}`);
    result = response.company;
  }
  if (simple) {
    result = toSimpleCompany(result);
  }
  return convertNumericStrings(result);
}

async function getAllCompanies(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, false);
  const mauticVersion = await getMauticVersion(context);

  let responseData: any[];

  if (mauticVersion === 'v7') {
    // v7: page-based pagination only (no start/limit/orderBy/search)
    if (returnAll) {
      const limit = getOptionalParam<number | undefined>(context, 'limit', itemIndex, undefined);
      const allItems: any[] = [];
      let page = 1;
      while (true) {
        const response = await makeApiRequest(context, 'GET', '/v2/companies', {}, { page });
        const pageItems: any[] = Array.isArray(response)
          ? response
          : ((response?.['hydra:member'] as any[]) ?? []);
        if (!pageItems.length) break;
        allItems.push(...pageItems);
        if (limit !== undefined && allItems.length >= limit) break;
        page++;
      }
      responseData = limit !== undefined ? allItems.slice(0, limit) : allItems;
    } else {
      // page through until limit satisfied — v7 page size is fixed (~30), limit may exceed it
      const limit = getRequiredParam<number>(context, 'limit', itemIndex);
      const allItems: any[] = [];
      let page = 1;
      while (allItems.length < limit) {
        const response = await makeApiRequest(context, 'GET', '/v2/companies', {}, { page });
        const pageItems: any[] = Array.isArray(response)
          ? response
          : ((response?.['hydra:member'] as any[]) ?? []);
        if (!pageItems.length) break;
        allItems.push(...pageItems);
        page++;
      }
      responseData = allItems.slice(0, limit);
    }
  } else {
    const additionalFields = getOptionalParam<IDataObject>(
      context,
      'additionalFields',
      itemIndex,
      {},
    );
    const qs = buildQueryFromOptions(additionalFields);
    if (!qs.orderBy) qs.orderBy = 'id';
    if (!qs.orderByDir) qs.orderByDir = 'asc';

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
  }

  if (simple) {
    responseData = responseData.map((item: any) => toSimpleCompany(item));
  }
  return convertNumericStrings(responseData);
}

async function deleteCompany(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, false);
  const companyId = getRequiredParam<string>(context, 'companyId', itemIndex);
  const mauticVersion = await getMauticVersion(context);

  if (mauticVersion === 'v7') {
    // v7 DELETE returns 204 no body
    await makeApiRequest(context, 'DELETE', `/v2/companies/${companyId}`);
    return { id: companyId };
  }

  const response = await makeApiRequest(context, 'DELETE', `/companies/${companyId}/delete`);
  let result = response.company;
  if (simple) {
    result = toSimpleCompany(result);
  }
  return result;
}

function toSimpleCompany(company: any): any {
  if (company?.fields?.all) {
    // v1: fields nested under company.fields.all
    return {
      id: company.id,
      owner: company.owner ?? null,
      ...company.fields.all,
    };
  }
  // v7: fields are at the top level; owner is a User object
  const { id, owner, score, socialCache, dateAdded, dateModified, isPublished, ...fields } =
    company;
  return {
    id,
    owner: owner ?? null,
    ...fields,
  };
}
