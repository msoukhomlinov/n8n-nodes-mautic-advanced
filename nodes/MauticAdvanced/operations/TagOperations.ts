import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
  makeApiRequest,
  makePaginatedRequest,
  getOptionalParam,
  getRequiredParam,
} from '../utils/ApiHelpers';
import { buildQueryFromOptions, convertNumericStrings } from '../utils/DataHelpers';

type MauticVersion = 'v6' | 'v7';

export async function getMauticVersion(context: IExecuteFunctions): Promise<MauticVersion> {
  const authenticationMethod = context.getNodeParameter(
    'authentication',
    0,
    'credentials',
  ) as string;

  if (authenticationMethod === 'credentials') {
    const credentials = await context.getCredentials('mauticAdvancedApi');
    const version = (credentials.mauticVersion as string) || 'v6';
    return version === 'v7' ? 'v7' : 'v6';
  }

  const credentials = await context.getCredentials('mauticAdvancedOAuth2Api');
  const version = (credentials.mauticVersion as string) || 'v6';
  return version === 'v7' ? 'v7' : 'v6';
}

// -----------------------------
// v1 tag helpers (legacy API)
// -----------------------------

export async function createTagV1(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const tag = getRequiredParam<string>(context, 'tag', itemIndex);
  const body: IDataObject = { tag };
  // v1 API ignores description for tags, so we do not send it to avoid confusion.
  const response = await makeApiRequest(context, 'POST', '/tags/new', body);
  return response.tag;
}

export async function updateTagV1(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const tagId = getRequiredParam<string>(context, 'tagId', itemIndex);
  const createIfNotFound = getOptionalParam<boolean>(context, 'createIfNotFound', itemIndex, false);
  const updateFields = getOptionalParam<IDataObject>(context, 'updateFields', itemIndex, {});
  const body: IDataObject = {};
  if (updateFields.tag) {
    body.tag = updateFields.tag as string;
  }
  // v1 API ignores description for tags, so we do not send it.
  const method = createIfNotFound ? 'PUT' : 'PATCH';
  const response = await makeApiRequest(context, method, `/tags/${tagId}/edit`, body);
  return response.tag;
}

export async function getTagV1(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const tagId = getRequiredParam<string>(context, 'tagId', itemIndex);
  const response = await makeApiRequest(context, 'GET', `/tags/${tagId}`);
  return convertNumericStrings(response.tag);
}

export async function getAllTagsV1(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const options = getOptionalParam<IDataObject>(context, 'options', itemIndex, {});
  const qs = buildQueryFromOptions(options);
  if (!qs.orderBy) qs.orderBy = 'id';
  if (!qs.orderByDir) qs.orderByDir = 'asc';

  if (returnAll) {
    const limit = getOptionalParam<number | undefined>(context, 'limit', itemIndex, undefined);
    const result = await makePaginatedRequest(context, 'tags', 'GET', '/tags', {}, qs, limit);
    return convertNumericStrings(result);
  }

  qs.limit = getOptionalParam<number>(context, 'limit', itemIndex, 30);
  const response = await makeApiRequest(context, 'GET', '/tags', {}, qs);
  const data = response.tags ? Object.values(response.tags) : [];
  return convertNumericStrings(data);
}

export async function deleteTagV1(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const tagId = getRequiredParam<string>(context, 'tagId', itemIndex);
  const response = await makeApiRequest(context, 'DELETE', `/tags/${tagId}/delete`);
  return response.tag ?? { success: true };
}

// -----------------------------
// v2 tag helpers (Mautic 7+)
// -----------------------------

function normaliseV2Tag(response: any): IDataObject {
  if (!response) return {};

  // JSON:API style
  if (response.data && typeof response.data === 'object') {
    const data = response.data;
    const attributes = (data.attributes || {}) as IDataObject;
    const id = data.id;
    return convertNumericStrings({
      id,
      ...attributes,
    });
  }

  // Plain JSON array or object as per application/json schema
  if (Array.isArray(response)) {
    return convertNumericStrings(response[0] || {});
  }

  if (response.attributes) {
    return convertNumericStrings({
      id: response.id,
      ...(response.attributes as IDataObject),
    });
  }

  return convertNumericStrings(response as IDataObject);
}

function normaliseV2TagCollection(response: any): IDataObject[] {
  if (!response) return [];

  // JSON:API collection
  if (response.data && Array.isArray(response.data)) {
    return response.data.map((entry: any) => normaliseV2Tag({ data: entry }));
  }

  // application/json array
  if (Array.isArray(response)) {
    return response.map((entry: IDataObject) => convertNumericStrings(entry));
  }

  // Hydra collection under member
  if (Array.isArray(response.member)) {
    return response.member.map((entry: IDataObject) => convertNumericStrings(entry));
  }

  return [];
}

export async function createTagV2(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const tag = getRequiredParam<string>(context, 'tag', itemIndex);
  const description = getOptionalParam<string>(context, 'description', itemIndex, '');

  const body: IDataObject = {
    tag,
  };
  if (description) {
    body.description = description;
  }

  const headers = { 'Content-Type': 'application/json' };
  const response = await makeApiRequest(context, 'POST', '/v2/tags', body, {}, undefined, headers);
  return normaliseV2Tag(response);
}

export async function updateTagV2(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const tagId = getRequiredParam<string>(context, 'tagId', itemIndex);
  const createIfNotFound = getOptionalParam<boolean>(context, 'createIfNotFound', itemIndex, false);
  const updateFields = getOptionalParam<IDataObject>(context, 'updateFields', itemIndex, {});

  const body: IDataObject = {};
  if (updateFields.tag) {
    body.tag = updateFields.tag as string;
  }
  if (updateFields.description) {
    body.description = updateFields.description as string;
  }

  // PUT creates if not found, PATCH only updates existing
  // v2 API requires specific Content-Type headers
  const method = createIfNotFound ? 'PUT' : 'PATCH';
  const contentType = method === 'PATCH' ? 'application/merge-patch+json' : 'application/json';
  const headers = { 'Content-Type': contentType };
  const response = await makeApiRequest(
    context,
    method,
    `/v2/tags/${tagId}`,
    body,
    {},
    undefined,
    headers,
  );
  return normaliseV2Tag(response);
}

export async function getTagV2(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const tagId = getRequiredParam<string>(context, 'tagId', itemIndex);
  const response = await makeApiRequest(context, 'GET', `/v2/tags/${tagId}`);
  return normaliseV2Tag(response);
}

export async function getAllTagsV2(context: IExecuteFunctions, itemIndex: number): Promise<any[]> {
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const options = getOptionalParam<IDataObject>(context, 'options', itemIndex, {});

  const qs: IDataObject = buildQueryFromOptions(options);

  // v2 uses page-based pagination; keep it simple and either:
  // - fetch once with optional limit
  // - or loop pages until we reach the requested limit
  const results: IDataObject[] = [];
  let page = 1;

  const limit = returnAll
    ? getOptionalParam<number | undefined>(context, 'limit', itemIndex, undefined)
    : getOptionalParam<number>(context, 'limit', itemIndex, 30);

  // Basic loop with page parameter; stops when no data or limit reached.
  // This relies on Mautic's v2 default page size.
  // We avoid overcomplicating until more pagination tweaking is needed.
  while (true) {
    qs.page = page;
    const response = await makeApiRequest(context, 'GET', '/v2/tags', {}, qs);
    const pageItems = normaliseV2TagCollection(response);
    if (!pageItems.length) {
      break;
    }

    if (limit !== undefined && results.length + pageItems.length > limit) {
      const needed = limit - results.length;
      results.push(...pageItems.slice(0, needed));
      break;
    } else {
      results.push(...pageItems);
    }

    if (limit !== undefined && results.length >= limit) {
      break;
    }

    page += 1;
  }

  return results;
}

export async function deleteTagV2(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const tagId = getRequiredParam<string>(context, 'tagId', itemIndex);
  const response = await makeApiRequest(context, 'DELETE', `/v2/tags/${tagId}`);
  // v2 typically returns empty body or JSON-API meta; provide a simple success flag.
  return response ?? { success: true };
}
