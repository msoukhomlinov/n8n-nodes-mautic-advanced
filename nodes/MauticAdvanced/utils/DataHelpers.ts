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
  const sourceData = Array.isArray(responseData) ? responseData : [responseData];
  const filterFields = fieldsToReturn ?? options.fieldsToReturn;

  if (options.rawData === true) {
    if (Array.isArray(filterFields) && filterFields.length > 0) {
      return sourceData.map((item: IDataObject) => filterContactFields(item, item, filterFields));
    }
    return sourceData;
  }

  const processedData = sourceData.map((item: any) => item.fields?.all || item);

  if (Array.isArray(filterFields) && filterFields.length > 0) {
    return processedData.map((item: IDataObject, index: number) =>
      filterContactFields(item, sourceData[index], filterFields),
    );
  }
  return processedData;
}

function filterContactFields(
  preferredSource: IDataObject,
  originalSource: IDataObject,
  filterFields: string[],
): IDataObject {
  const filtered: IDataObject = {};
  for (const field of filterFields) {
    const preferredLookup = readContactField(preferredSource, field);
    const lookup = preferredLookup.found
      ? preferredLookup
      : readContactField(originalSource, field);
    if (lookup.found && lookup.value !== undefined) {
      filtered[field] = lookup.value;
    }
  }
  return filtered;
}

function readContactField(
  source: IDataObject | undefined,
  field: string,
): { found: boolean; value?: unknown } {
  if (!source) {
    return { found: false };
  }
  if (Object.prototype.hasOwnProperty.call(source, field)) {
    return { found: true, value: source[field] };
  }
  const rawField = readRawContactFieldAlias(source, field);
  if (rawField.found) {
    return rawField;
  }
  const fieldsAll = (source.fields as IDataObject | undefined)?.all as IDataObject | undefined;
  if (fieldsAll && Object.prototype.hasOwnProperty.call(fieldsAll, field)) {
    return { found: true, value: fieldsAll[field] };
  }
  return { found: false };
}

function readRawContactFieldAlias(
  source: IDataObject,
  field: string,
): { found: boolean; value?: unknown } {
  const rawAliasMap: Record<string, string[]> = {
    date_added: ['dateAdded'],
    date_identified: ['dateIdentified'],
    date_modified: ['dateModified'],
    last_active: ['lastActive'],
  };

  for (const alias of rawAliasMap[field] || []) {
    if (Object.prototype.hasOwnProperty.call(source, alias)) {
      return { found: true, value: source[alias] };
    }
  }

  if (field === 'owner_id' && Object.prototype.hasOwnProperty.call(source, 'owner')) {
    const owner = source.owner as IDataObject | string | number | null;
    if (owner && typeof owner === 'object' && Object.prototype.hasOwnProperty.call(owner, 'id')) {
      return { found: true, value: owner.id };
    }
    return { found: true, value: owner };
  }

  return { found: false };
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
  if (options.minimal !== undefined) query.minimal = options.minimal as boolean;
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

// Convert numeric strings to numbers recursively
export function convertNumericStrings(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    // Check if string is a valid number (including negative numbers and decimals)
    const numericRegex = /^-?\d+(\.\d+)?$/;
    if (numericRegex.test(data)) {
      const num = parseFloat(data);
      // Only convert if parseFloat doesn't lose precision and result is finite
      if (!isNaN(num) && isFinite(num) && num.toString() === data) {
        return num;
      }
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(convertNumericStrings);
  }

  if (typeof data === 'object') {
    const converted: any = {};
    for (const [key, value] of Object.entries(data)) {
      converted[key] = convertNumericStrings(value);
    }
    return converted;
  }

  return data;
}
