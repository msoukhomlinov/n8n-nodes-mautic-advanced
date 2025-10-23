import { NodeOperationError } from 'n8n-workflow';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';

// Validate required string parameter
export function validateRequiredString(
  context: IExecuteFunctions,
  paramName: string,
  itemIndex: number,
  errorMessage?: string,
): string {
  const value = context.getNodeParameter(paramName, itemIndex) as string;
  if (!value || typeof value !== 'string' || value.trim() === '') {
    throw new NodeOperationError(
      context.getNode(),
      errorMessage || `Parameter '${paramName}' is required and must be a non-empty string.`,
      { itemIndex },
    );
  }
  return value.trim();
}

// Validate required number parameter
export function validateRequiredNumber(
  context: IExecuteFunctions,
  paramName: string,
  itemIndex: number,
  min?: number,
  max?: number,
  errorMessage?: string,
): number {
  const value = context.getNodeParameter(paramName, itemIndex) as number;
  if (value === undefined || value === null || isNaN(value)) {
    throw new NodeOperationError(
      context.getNode(),
      errorMessage || `Parameter '${paramName}' is required and must be a valid number.`,
      { itemIndex },
    );
  }
  if (min !== undefined && value < min) {
    throw new NodeOperationError(
      context.getNode(),
      `Parameter '${paramName}' must be at least ${min}.`,
      { itemIndex },
    );
  }
  if (max !== undefined && value > max) {
    throw new NodeOperationError(
      context.getNode(),
      `Parameter '${paramName}' must be at most ${max}.`,
      { itemIndex },
    );
  }
  return value;
}

// Validate optional parameter with type checking
export function validateOptionalParam<T = any>(
  context: IExecuteFunctions,
  paramName: string,
  itemIndex: number,
  expectedType: 'string' | 'number' | 'boolean' | 'object' | 'any',
  defaultValue?: T,
): T {
  try {
    const value = context.getNodeParameter(paramName, itemIndex, defaultValue) as T;
    if (value === undefined || value === null) {
      return defaultValue as T;
    }
    switch (expectedType) {
      case 'string':
        if (typeof value !== 'string')
          throw new Error(`Parameter '${paramName}' must be a string.`);
        return value as T;
      case 'number':
        if (typeof value !== 'number' || isNaN(value as any))
          throw new Error(`Parameter '${paramName}' must be a valid number.`);
        return value as T;
      case 'boolean':
        if (typeof value !== 'boolean')
          throw new Error(`Parameter '${paramName}' must be a boolean.`);
        return value as T;
      case 'object':
        if (typeof value !== 'object' || (value as any) === null)
          throw new Error(`Parameter '${paramName}' must be an object.`);
        return value as T;
      default:
        return value as T;
    }
  } catch (error: any) {
    if (defaultValue !== undefined) {
      return defaultValue as T;
    }
    throw new NodeOperationError(
      context.getNode(),
      `Parameter '${paramName}' validation failed: ${error.message}`,
      { itemIndex },
    );
  }
}

// Validate email format
export function validateEmail(
  context: IExecuteFunctions,
  email: string,
  itemIndex: number,
): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new NodeOperationError(context.getNode(), 'Invalid email format provided.', {
      itemIndex,
    });
  }
  return email;
}

// Validate URL format
export function validateUrl(
  context: IExecuteFunctions,
  url: string,
  itemIndex: number,
  paramName: string = 'url',
): string {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return url;
  } catch {
    throw new NodeOperationError(
      context.getNode(),
      `Parameter '${paramName}' must be a valid URL.`,
      { itemIndex },
    );
  }
}

// Validate date format
export function validateDateString(
  context: IExecuteFunctions,
  dateString: string,
  itemIndex: number,
  paramName: string = 'date',
): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new NodeOperationError(
      context.getNode(),
      `Parameter '${paramName}' must be a valid date.`,
      { itemIndex },
    );
  }
  return dateString;
}

// Validate array parameter
export function validateArrayParam<T = any>(
  context: IExecuteFunctions,
  paramName: string,
  itemIndex: number,
  minLength?: number,
  maxLength?: number,
): T[] {
  const value = context.getNodeParameter(paramName, itemIndex) as T[];
  if (!Array.isArray(value)) {
    throw new NodeOperationError(context.getNode(), `Parameter '${paramName}' must be an array.`, {
      itemIndex,
    });
  }
  if (minLength !== undefined && value.length < minLength) {
    throw new NodeOperationError(
      context.getNode(),
      `Parameter '${paramName}' must contain at least ${minLength} items.`,
      { itemIndex },
    );
  }
  if (maxLength !== undefined && value.length > maxLength) {
    throw new NodeOperationError(
      context.getNode(),
      `Parameter '${paramName}' must contain at most ${maxLength} items.`,
      { itemIndex },
    );
  }
  return value;
}

// Validate options object structure
export function validateOptionsStructure(
  context: IExecuteFunctions,
  options: IDataObject,
  requiredFields: string[],
  itemIndex: number,
): void {
  for (const field of requiredFields) {
    if (!(field in options)) {
      throw new NodeOperationError(
        context.getNode(),
        `Options object is missing required field: '${field}'`,
        { itemIndex },
      );
    }
  }
}
