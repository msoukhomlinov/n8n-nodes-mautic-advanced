import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { validateJSON } from '../GenericFunctions';

// Process simple response data extraction
export function processSimpleResponse(responseData: any, simple: boolean, dataPath?: string): any {
  if (!simple || !dataPath) {
    return responseData;
  }
  const pathParts = dataPath.split('.');
  let result: any = responseData;
  for (const part of pathParts) {
    result = result?.[part];
  }
  return result?.fields?.all || result;
}

// Ensure single item responses are wrapped in arrays for consistency
export function wrapSingleItem<T = any>(data: T | T[]): T[] {
  if (Array.isArray(data)) {
    return data;
  }
  return data ? [data] : [];
}

// Process contact fields data for simple mode
export function processContactFields(
  responseData: any,
  options: { rawData?: boolean; fieldsToReturn?: string[] },
  fieldsToReturn?: string[],
): any[] {
  if (options.rawData !== false) {
    return responseData;
  }
  const processedData = Array.isArray(responseData)
    ? responseData.map((item: any) => item.fields?.all || item)
    : [responseData.fields?.all || responseData];

  const filterFields = fieldsToReturn || options.fieldsToReturn;
  if (Array.isArray(filterFields) && filterFields.length > 0) {
    return processedData.map((item: IDataObject) => {
      const filtered: IDataObject = {};
      for (const field of filterFields) {
        if (Object.prototype.hasOwnProperty.call(item, field)) {
          filtered[field] = item[field];
        }
      }
      return filtered;
    });
  }
  return processedData;
}

// Validate and parse JSON input parameters
export function validateJsonParameter(
  context: IExecuteFunctions,
  paramName: string,
  itemIndex: number,
): IDataObject {
  const jsonString = context.getNodeParameter(paramName, itemIndex) as string;
  const parsed = validateJSON(jsonString) as IDataObject | undefined;
  if (parsed === undefined) {
    throw new Error(`Invalid JSON provided in '${paramName}' parameter`);
  }
  return parsed;
}

// Build query parameters from options object
export function buildQueryFromOptions(
  options: IDataObject = {},
  additionalParams: IDataObject = {},
): IDataObject {
  const query: IDataObject = { ...additionalParams };
  if (options.limit) query.limit = options.limit as number;
  if (options.start) query.start = options.start as number;
  if (options.orderBy) query.orderBy = options.orderBy as string;
  if (options.orderByDir) query.orderByDir = options.orderByDir as string;
  if (options.search) query.search = options.search as string;
  if (options.publishedOnly !== undefined) query.publishedOnly = options.publishedOnly as boolean;
  return query;
}

// Process batch operation input (comma-separated IDs or array from input items)
export function processBatchIds(
  explicitIds: string | undefined,
  inputItems: Array<{ json: IDataObject }>,
  idField: string = 'id',
): string {
  if (explicitIds) {
    return explicitIds;
  }
  if (!inputItems || inputItems.length === 0) {
    throw new Error('No IDs provided or found in input items.');
  }
  const ids = inputItems
    .map((item) => item.json?.[idField] ?? item.json?.id)
    .filter((id) => id !== undefined && id !== null && id !== '')
    .map((id) => String(id));
  if (ids.length === 0) {
    throw new Error(`No valid ${idField} values found in input items.`);
  }
  return ids.join(',');
}

// Create success response for batch operations
export function createBatchSuccessResponse(
  operation: string,
  ids: string[],
  customMessage?: string,
): IDataObject {
  return {
    success: true,
    processedIds: ids,
    count: ids.length,
    message: customMessage || `Successfully ${operation} ${ids.length} items.`,
  } as IDataObject;
}
