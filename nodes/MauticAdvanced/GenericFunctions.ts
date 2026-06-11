import type {
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  IHttpRequestMethods,
  ILoadOptionsFunctions,
  IRequestOptions,
  ISupplyDataFunctions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import { requestMauticAuthenticated } from './utils/authenticatedRequest';

export type MauticVersion = 'v6' | 'v7';

const versionCache = new Map<string, { version: MauticVersion; expiresAt: number }>();
const VERSION_CACHE_TTL_MS = 5 * 60 * 1000;

function normalizeInstanceUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  try {
    const u = new URL(trimmed);
    u.protocol = u.protocol.toLowerCase();
    u.hostname = u.hostname.toLowerCase();
    u.hash = '';
    u.search = '';
    u.pathname = u.pathname.replace(/\/+$/, '');
    return u.toString().replace(/\/+$/, '');
  } catch {
    return trimmed.replace(/\/+$/, '');
  }
}

export async function getMauticVersion(context: IExecuteFunctions): Promise<MauticVersion> {
  const authMethod = context.getNodeParameter('authentication', 0, 'credentials') as string;
  const credentialType =
    authMethod === 'credentials' ? 'mauticAdvancedApi' : 'mauticAdvancedOAuth2Api';
  const credentials = await context.getCredentials(credentialType);
  const baseUrl = normalizeInstanceUrl((credentials.url as string) || '');
  const cacheKey = `${credentialType}:${baseUrl}`;

  const cached = versionCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.version;
  }

  let version: MauticVersion;
  try {
    await mauticApiRequest.call(context, 'GET', '/v2/companies', {}, { page: 1 }, undefined, {
      Accept: 'application/json',
    });
    version = 'v7';
  } catch (error: any) {
    // 403 = v2 route exists but no permission → still v7; 404 = route absent → v6
    version = error?.httpCode === '403' ? 'v7' : 'v6';
  }

  versionCache.set(cacheKey, { version, expiresAt: Date.now() + VERSION_CACHE_TTL_MS });
  return version;
}

export async function mauticApiRequest(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | ISupplyDataFunctions,
  method: IHttpRequestMethods,
  endpoint: string,

  body: any = {},
  query?: IDataObject,
  uri?: string,
  headers?: IDataObject,
): Promise<any> {
  const authenticationMethod = this.getNodeParameter('authentication', 0, 'credentials') as string;

  const options: IRequestOptions = {
    headers: headers || {},
    method,
    qs: query,
    uri: uri || `/api${endpoint}`,
    json: true,
  };

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    options.body = body;
  }

  try {
    const returnData = await requestMauticAuthenticated<any>(this, authenticationMethod, options);

    if (returnData?.errors) {
      // They seem to sometimes return 200 status but still error.
      // Preserve the full error object including details for better error handling
      throw new NodeApiError(this.getNode(), returnData as JsonObject, {
        httpCode: '400',
        description: returnData,
      });
    }

    return returnData;
  } catch (error) {
    // Preserve error details when available for better error handling
    if (error instanceof NodeApiError || error instanceof NodeOperationError) {
      throw error;
    }
    throw new NodeApiError(this.getNode(), error as JsonObject);
  }
}

/**
 * Make an API request to paginated mautic endpoint
 * and return all results
 */
export const DEFAULT_MAUTIC_PAGE_SIZE = 100;

function toPositiveInteger(value: unknown): number | undefined {
  const numericValue =
    typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : undefined;

  if (numericValue === undefined || !Number.isFinite(numericValue) || numericValue <= 0) {
    return undefined;
  }

  return Math.floor(numericValue);
}

function getPaginationStart(value: unknown): number {
  const start = toPositiveInteger(value);
  return start ?? 0;
}

function getResponseItems(responseData: IDataObject, propertyName: string): IDataObject[] {
  const responseProperty = responseData[propertyName];

  if (!responseProperty || typeof responseProperty !== 'object') {
    return [];
  }

  if (Array.isArray(responseProperty)) {
    return responseProperty as IDataObject[];
  }

  return Object.values(responseProperty as IDataObject) as IDataObject[];
}

export async function mauticApiRequestAllItems(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | ISupplyDataFunctions,
  propertyName: string,
  method: IHttpRequestMethods,
  endpoint: string,
  body: any = {},
  query: IDataObject = {},
  maxResults?: number,
): Promise<any> {
  const returnData: IDataObject[] = [];
  const baseQuery: IDataObject = { ...query };
  const requestedStart = getPaginationStart(baseQuery.start);
  const totalLimit = toPositiveInteger(maxResults);

  delete baseQuery.start;
  delete baseQuery.limit;

  let currentStart = requestedStart;

  while (totalLimit === undefined || returnData.length < totalLimit) {
    const remaining = totalLimit === undefined ? undefined : totalLimit - returnData.length;
    const pageLimit =
      remaining === undefined
        ? DEFAULT_MAUTIC_PAGE_SIZE
        : Math.min(DEFAULT_MAUTIC_PAGE_SIZE, remaining);
    const pageQuery: IDataObject = {
      ...baseQuery,
      limit: pageLimit,
      start: currentStart,
    };

    try {
      const responseData = await mauticApiRequest.call(this, method, endpoint, body, pageQuery);

      if (responseData.errors) {
        throw new NodeApiError(this.getNode(), responseData as JsonObject);
      }
      const pageItems = getResponseItems(responseData as IDataObject, propertyName);

      if (!pageItems.length) {
        break;
      }

      returnData.push(...pageItems);

      if (pageItems.length < pageLimit) {
        break;
      }

      currentStart += pageItems.length;
    } catch (error) {
      if (error instanceof NodeApiError || error instanceof NodeOperationError) {
        throw error;
      }
      throw new NodeApiError(this.getNode(), error as JsonObject);
    }
  }

  return returnData;
}

/**
 * Serialise the n8n fixedCollection 'where' structure into Mautic API query parameters.
 * Handles nested andX/orX logic recursively.
 * @param whereArray Array of conditions from the fixedCollection
 * @param prefix Used internally for recursion (should be omitted by callers)
 * @returns Object with keys/values for qs
 */
export function serialiseMauticWhere(whereArray: any[], prefix = 'where'): IDataObject {
  const params: IDataObject = {};
  const dateFields = [
    'date_modified',
    'date_added',
    'last_active',
    'date_identified',
    'dateFrom',
    'dateTo',
  ];
  whereArray.forEach((condition, idx) => {
    const base = `${prefix}[${idx}]`;
    if (condition.expr === 'andX' || condition.expr === 'orX') {
      params[`${base}[expr]`] = condition.expr;
      // Nested conditions: recurse
      if (condition.nested && Array.isArray(condition.nested.conditions)) {
        // The value for 'val' is an array of nested conditions
        const nestedParams = serialiseMauticWhere(condition.nested.conditions, `${base}[val]`);
        Object.assign(params, nestedParams);
      } else {
        // Defensive: empty group
        params[`${base}[val]`] = [];
      }
    } else {
      // Simple condition
      if (condition.col) params[`${base}[col]`] = condition.col;
      if (condition.expr) params[`${base}[expr]`] = condition.expr;
      if (condition.val !== undefined && condition.val !== '') {
        let val = condition.val;
        // Auto-format date values for known date fields
        if (
          condition.col &&
          dateFields.includes(condition.col) &&
          typeof val === 'string' &&
          (val.includes('T') || val.match(/^\d{4}-\d{2}-\d{2}/))
        ) {
          // Try to parse and format as UTC 'YYYY-MM-DD HH:mm:ss'
          const d = new Date(val);
          if (!isNaN(d.getTime())) {
            const pad = (n: number) => n.toString().padStart(2, '0');
            val = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
          }
        }
        params[`${base}[val]`] = val;
      }
    }
  });
  return params;
}

export function validateJSON(json: string | undefined): any {
  let result;
  try {
    result = JSON.parse(json!);
  } catch (exception) {
    result = undefined;
  }
  return result;
}
