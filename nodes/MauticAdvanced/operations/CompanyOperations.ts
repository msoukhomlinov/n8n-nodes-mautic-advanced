import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
  handleApiError,
  makeApiRequest,
  makePaginatedRequest,
  getOptionalParam,
  getRequiredParam,
} from '../utils/ApiHelpers';
import { getMauticVersion, getMauticV2Status } from '../GenericFunctions';
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
    isPublished,
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
    if (isPublished !== undefined) body.isPublished = isPublished as boolean;
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
      Accept: 'application/json',
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
    isPublished,
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
    if (isPublished !== undefined) body.isPublished = isPublished as boolean;
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
      { 'Content-Type': 'application/merge-patch+json', Accept: 'application/json' },
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

// Logged once per Get/Get Many call when the v2 API exists but rejected the credential, so the
// reason owner is null is visible in the n8n logs instead of failing silently.
const V2_UNAUTHORIZED_OWNER_WARNING =
  'Mautic company owner enrichment skipped: the v2 API (API Platform) rejected this credential (401/403). ' +
  'Owner is a v7-only field that requires an auth method the v2 API accepts — Basic auth is confirmed working; ' +
  'OAuth2 depends on the Mautic server allowing v2 access for the token. Returning owner: null. ' +
  'Switch the credential to Basic auth (or enable v2 access for OAuth2 on the Mautic server) to populate owner.';

// Force API Platform to return JSON-LD/Hydra so the owner is serialised with its `@id` IRI
// (/api/v2/users/{id}). The default `application/json` representation omits the IRI, leaving only
// FormEntity fields (isPublished/dateAdded/dateModified) with no way to resolve the owner's user ID.
const LD_JSON_HEADERS = { Accept: 'application/ld+json' };

// Extract the owner's user ID from a v7 (JSON-LD) company object.
// JSON-LD embeds the owner with `@id: "/api/v2/users/{id}"`; some shapes also expose a plain `id`.
function extractOwnerFromV7(v7Item: any): any {
  const owner = v7Item?.owner;
  if (owner === null || owner === undefined) return null;
  // Owner may be embedded as an object (with @id), or serialised as a bare IRI string.
  const iri = typeof owner === 'string' ? owner : (owner['@id'] as string | undefined);
  if (iri) {
    const match = /\/(\d+)$/.exec(iri);
    if (match) return { id: Number(match[1]) };
  }
  if (typeof owner === 'object' && owner.id !== undefined && owner.id !== null) {
    return { id: Number(owner.id) };
  }
  // No IRI and no id (plain-JSON owner) — return the partial FormEntity data as-is
  return owner;
}

// Fetch all companies from v7 and return a map of companyId → owner.
// Uses JSON-LD so the response includes the owner `@id` IRI for user-ID extraction.
async function buildV7OwnerMap(context: IExecuteFunctions): Promise<Map<number, any>> {
  const ownerMap = new Map<number, any>();
  let page = 1;
  const MAX_PAGES = 100;
  while (page <= MAX_PAGES) {
    const response = await makeApiRequest(
      context,
      'GET',
      '/v2/companies',
      {},
      { page },
      undefined,
      LD_JSON_HEADERS,
    );
    const items: any[] = Array.isArray(response)
      ? response
      : ((response?.['hydra:member'] as any[]) ?? []);
    if (!items.length) break;
    for (const item of items) {
      const id = Number(item.id);
      if (id) ownerMap.set(id, extractOwnerFromV7(item));
    }
    const total = response?.['hydra:totalItems'];
    if (typeof total === 'number' && ownerMap.size >= total) break;
    page++;
  }
  return ownerMap;
}

async function getCompany(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const companyId = getRequiredParam<string>(context, 'companyId', itemIndex);
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, false);
  const v2Status = await getMauticV2Status(context);

  // v1: custom fields via fields.all
  const v1Response = await makeApiRequest(context, 'GET', `/companies/${companyId}`);
  let result = v1Response.company;

  if (v2Status === 'usable') {
    try {
      // JSON-LD response includes the owner @id IRI for user-ID extraction
      const v7Company = await makeApiRequest(
        context,
        'GET',
        `/v2/companies/${companyId}`,
        {},
        {},
        undefined,
        LD_JSON_HEADERS,
      );
      result = { ...result, owner: extractOwnerFromV7(v7Company) };
    } catch (error: any) {
      // Enrichment failed unexpectedly (v2 was usable at probe time). Surface it instead of
      // silently degrading to owner: null, so the cause is visible in the logs.
      context.logger.warn(
        `Mautic company owner enrichment failed for company ${companyId}: ${error?.message ?? error}. Returning owner: null.`,
      );
    }
  } else if (v2Status === 'unauthorized') {
    // v2 route exists but the credential is rejected there — owner cannot be enriched. Warn once.
    context.logger.warn(V2_UNAUTHORIZED_OWNER_WARNING);
  }

  if (simple) result = toSimpleCompany(result);
  return convertNumericStrings(result);
}

async function getAllCompanies(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const simple = getOptionalParam<boolean>(context, 'simple', itemIndex, false);
  const v2Status = await getMauticV2Status(context);

  const additionalFields = getOptionalParam<IDataObject>(
    context,
    'additionalFields',
    itemIndex,
    {},
  );
  const qs = buildQueryFromOptions(additionalFields);
  if (!qs.orderBy) qs.orderBy = 'id';
  if (!qs.orderByDir) qs.orderByDir = 'asc';

  // v1: custom fields via fields.all
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

  if (v2Status === 'usable') {
    try {
      // v7 enrichment: overlay owner on each v1 result using a single paginated v7 fetch
      const ownerMap = await buildV7OwnerMap(context);
      responseData = responseData.map((company: any) => ({
        ...company,
        owner: ownerMap.get(Number(company.id)) ?? null,
      }));
    } catch (error: any) {
      // Enrichment failed unexpectedly (v2 was usable at probe time). Surface it instead of
      // silently degrading to owner: null, so the cause is visible in the logs.
      context.logger.warn(
        `Mautic company owner enrichment failed for Get Many: ${error?.message ?? error}. Returning owner: null for all rows.`,
      );
    }
  } else if (v2Status === 'unauthorized') {
    // v2 route exists but the credential is rejected there — owner cannot be enriched. Warn once.
    context.logger.warn(V2_UNAUTHORIZED_OWNER_WARNING);
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
    await makeApiRequest(context, 'DELETE', `/v2/companies/${companyId}`, {}, {}, undefined, {
      Accept: 'application/json',
    });
    return { id: Number(companyId) };
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
