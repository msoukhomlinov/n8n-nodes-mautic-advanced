import { NodeApiError, NodeOperationError, type INodeExecutionData, type IHttpRequestMethods, type JsonObject } from 'n8n-workflow';
import {
  mauticApiRequest,
  mauticApiRequestAllItems,
} from '../GenericFunctions';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';

// Standardized API request wrapper with error handling
export async function makeApiRequest(
  context: IExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  uri?: string,
): Promise<any> {
  try {
    return await mauticApiRequest.call(context, method, endpoint, body, query, uri);
  } catch (error) {
    if (error instanceof NodeApiError) {
      throw error;
    }
    throw new NodeApiError(context.getNode(), error as JsonObject);
  }
}

// Standardized paginated API request wrapper
export async function makePaginatedRequest(
  context: IExecuteFunctions,
  resource: string,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  limit?: number,
): Promise<any[]> {
  try {
    return await mauticApiRequestAllItems.call(
      context,
      resource,
      method,
      endpoint,
      body,
      query,
      limit,
    );
  } catch (error) {
    if (error instanceof NodeApiError) {
      throw error;
    }
    throw new NodeApiError(context.getNode(), error as JsonObject);
  }
}

// Handle API errors with appropriate user-friendly messages
export function handleApiError(
  context: IExecuteFunctions,
  error: unknown,
  operation: string,
  resource: string,
): INodeExecutionData[] {
  if (error instanceof NodeApiError) {
    if (error.httpCode === '404') {
      throw new NodeOperationError(
        context.getNode(),
        `${resource} not found during ${operation} operation.`,
        { itemIndex: 0 },
      );
    }
    if (error.httpCode === '403') {
      throw new NodeOperationError(
        context.getNode(),
        `Permission denied for ${operation} ${resource}. Please check your API credentials.`,
        { itemIndex: 0 },
      );
    }
    if (error.httpCode === '400') {
      throw new NodeOperationError(
        context.getNode(),
        `Invalid data provided for ${operation} ${resource}. Please check your input parameters.`,
        { itemIndex: 0 },
      );
    }
    throw error;
  }
  throw new NodeOperationError(
    context.getNode(),
    `Failed to ${operation} ${resource}: ${(error as Error)?.message || 'Unknown error'}`,
    { itemIndex: 0 },
  );
}

// Extract and validate required parameter
export function getRequiredParam<T = any>(
  context: IExecuteFunctions,
  paramName: string,
  itemIndex: number,
  errorMessage?: string,
): T {
  const value = context.getNodeParameter(paramName, itemIndex) as T;
  if ((value as unknown) === undefined || (value as unknown) === null || (value as unknown) === '') {
    throw new NodeOperationError(
      context.getNode(),
      errorMessage || `Parameter '${paramName}' is required.`,
      { itemIndex },
    );
  }
  return value;
}

// Extract optional parameter with default value
export function getOptionalParam<T = any>(
  context: IExecuteFunctions,
  paramName: string,
  itemIndex: number,
  defaultValue: T,
): T {
  try {
    return context.getNodeParameter(paramName, itemIndex, defaultValue) as T;
  } catch {
    return defaultValue;
  }
}

// Process response data based on simple/raw data options
export function processResponseData(
  responseData: any,
  options: { rawData?: boolean },
  simpleDataPath?: string,
): any {
  if (options.rawData === true) {
    return responseData;
  }
  if (options.rawData === false && simpleDataPath) {
    const pathParts = simpleDataPath.split('.');
    let result: any = responseData;
    for (const part of pathParts) {
      result = result?.[part];
    }
    return result;
  }
  return responseData;
}
