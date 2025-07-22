import type {
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  IHttpRequestMethods,
  ILoadOptionsFunctions,
  IRequestOptions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function mauticApiRequest(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,

  body: any = {},
  query?: IDataObject,
  uri?: string,
): Promise<any> {
  const authenticationMethod = this.getNodeParameter('authentication', 0, 'credentials') as string;

  const options: IRequestOptions = {
    headers: {},
    method,
    qs: query,
    uri: uri || `/api${endpoint}`,
    body,
    json: true,
  };

  try {
    let returnData;

    if (authenticationMethod === 'credentials') {
      const credentials = await this.getCredentials('mauticAdvancedApi');
      const baseUrl = credentials.url as string;

      options.uri = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${options.uri}`;
      returnData = await this.helpers.requestWithAuthentication.call(
        this,
        'mauticAdvancedApi',
        options,
      );
    } else {
      const credentials = await this.getCredentials('mauticAdvancedOAuth2Api');
      const baseUrl = credentials.url as string;

      options.uri = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${options.uri}`;
      returnData = await this.helpers.requestOAuth2.call(this, 'mauticAdvancedOAuth2Api', options, {
        includeCredentialsOnRefreshOnBody: true,
      });
    }

    if (returnData.errors) {
      // They seem to sometimes return 200 status but still error.
      throw new NodeApiError(this.getNode(), returnData as JsonObject);
    }

    return returnData;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject);
  }
}

/**
 * Make an API request to paginated mautic endpoint
 * and return all results
 */
// Optional: Slightly improved error handling
export async function mauticApiRequestAllItems(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
  propertyName: string,
  method: IHttpRequestMethods,
  endpoint: string,
  body: any = {},
  query: IDataObject = {},
  maxResults?: number,
): Promise<any> {
  const returnData: IDataObject[] = [];
  let responseData;
  query.limit = 30;
  query.start = 0;

  while (true) {
    try {
      responseData = await mauticApiRequest.call(this, method, endpoint, body, query);

      if (responseData.errors) {
        throw new NodeApiError(this.getNode(), responseData as JsonObject);
      }
      const pageItems = responseData[propertyName]
        ? Object.values(responseData[propertyName] as IDataObject[])
        : [];
      if (!pageItems.length) {
        break;
      }
      if (maxResults !== undefined && returnData.length + pageItems.length > maxResults) {
        const needed = maxResults - returnData.length;
        returnData.push(...pageItems.slice(0, needed));
        break;
      } else {
        returnData.push(...pageItems);
      }
      query.start = Number(query.start) + pageItems.length;
      // If less than limit returned, no more data
      if (pageItems.length < Number(query.limit)) {
        break;
      }
    } catch (error) {
      // Optional: Only wrap non-NodeApiError errors
      if (error instanceof NodeApiError) {
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
      if (condition.val !== undefined && condition.val !== '')
        params[`${base}[val]`] = condition.val;
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
