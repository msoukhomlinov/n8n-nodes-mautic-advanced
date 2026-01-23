import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
  handleApiError,
  makeApiRequest,
  getOptionalParam,
  getRequiredParam,
} from '../utils/ApiHelpers';
import { wrapSingleItem, convertNumericStrings } from '../utils/DataHelpers';
import { validateJSON } from '../GenericFunctions';

export async function executeStatsOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: any;
  try {
    switch (operation) {
      case 'getAvailableTables':
        responseData = await getAvailableTables(context);
        break;
      case 'get':
        responseData = await getStats(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Stats resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Stats');
  }
}

async function getAvailableTables(context: IExecuteFunctions): Promise<any> {
  const response = await makeApiRequest(context, 'GET', '/stats');
  return convertNumericStrings(response);
}

async function getStats(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const table = getRequiredParam<string>(context, 'table', itemIndex);
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const additionalOptions = getOptionalParam<IDataObject>(
    context,
    'additionalOptions',
    itemIndex,
    {},
  );

  const qs: IDataObject = {};

  // Handle pagination
  if (additionalOptions.start !== undefined) {
    qs.start = additionalOptions.start as number;
  } else {
    qs.start = 0;
  }

  if (!returnAll) {
    const limit = getRequiredParam<number>(context, 'limit', itemIndex);
    qs.limit = limit;
  }

  // Handle ordering
  if (additionalOptions.orderBy) {
    const orderDir = (additionalOptions.orderByDir as string) || 'asc';
    // Mautic expects order as array: order[0][col]=id&order[0][dir]=asc
    qs['order[0][col]'] = additionalOptions.orderBy as string;
    qs['order[0][dir]'] = orderDir;
  }

  // Handle where conditions
  if (additionalOptions.where) {
    const whereConditions = validateJSON(additionalOptions.where as string);
    if (whereConditions && Array.isArray(whereConditions)) {
      whereConditions.forEach((condition: any, idx: number) => {
        if (condition.col) qs[`where[${idx}][col]`] = condition.col;
        if (condition.expr) qs[`where[${idx}][expr]`] = condition.expr;
        if (condition.val !== undefined) qs[`where[${idx}][val]`] = condition.val;
      });
    }
  }

  const allStats: any[] = [];

  if (returnAll) {
    // Paginate through all results
    const pageSize = 100;
    qs.limit = pageSize;
    let hasMore = true;

    while (hasMore) {
      const response = await makeApiRequest(context, 'GET', `/stats/${table}`, {}, qs);
      const statsRaw = response.stats ?? [];

      let statsArray: any[];
      if (Array.isArray(statsRaw)) {
        statsArray = statsRaw;
      } else if (typeof statsRaw === 'object') {
        statsArray = Object.values(statsRaw);
      } else {
        statsArray = [];
      }

      allStats.push(...statsArray);

      if (statsArray.length < pageSize) {
        hasMore = false;
      } else {
        qs.start = (qs.start as number) + pageSize;
      }
    }

    return convertNumericStrings(allStats);
  } else {
    const response = await makeApiRequest(context, 'GET', `/stats/${table}`, {}, qs);
    const stats = response.stats ?? [];

    if (Array.isArray(stats)) {
      return convertNumericStrings(stats);
    } else if (typeof stats === 'object') {
      return convertNumericStrings(Object.values(stats));
    }

    return convertNumericStrings(stats);
  }
}
