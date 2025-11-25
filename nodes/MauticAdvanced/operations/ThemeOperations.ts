import type {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  IRequestOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { handleApiError, getOptionalParam, getRequiredParam } from '../utils/ApiHelpers';
import { convertNumericStrings, wrapSingleItem } from '../utils/DataHelpers';

export async function executeThemeOperation(
  context: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  try {
    let responseData: any;
    switch (operation) {
      case 'create':
        responseData = await createTheme(context, i);
        break;
      case 'get':
        // getTheme returns INodeExecutionData[] directly with binary data
        return await getTheme(context, i);
      case 'getAll':
        responseData = await getAllThemes(context, i);
        break;
      case 'delete':
        responseData = await deleteTheme(context, i);
        break;
      default:
        throw new NodeOperationError(
          context.getNode(),
          `Operation '${operation}' is not supported for Theme resource.`,
          { itemIndex: i },
        );
    }
    return context.helpers.returnJsonArray(wrapSingleItem(responseData));
  } catch (error) {
    return handleApiError(context, error, operation, 'Theme');
  }
}

async function createTheme(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const filePropertyName = getRequiredParam<string>(context, 'file', itemIndex);
  const items = context.getInputData();
  const binaryData = items[itemIndex].binary?.[filePropertyName];

  if (!binaryData) {
    throw new NodeOperationError(
      context.getNode(),
      `No binary data found for property '${filePropertyName}'. Please provide a zip file.`,
      { itemIndex },
    );
  }

  const authenticationMethod = context.getNodeParameter(
    'authentication',
    0,
    'credentials',
  ) as string;
  const credentials =
    authenticationMethod === 'credentials'
      ? await context.getCredentials('mauticAdvancedApi')
      : await context.getCredentials('mauticAdvancedOAuth2Api');
  const baseUrl = credentials.url as string;

  const options: IRequestOptions = {
    headers: {},
    method: 'POST',
    uri: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/themes/new`,
    formData: {
      file: {
        value: Buffer.from(binaryData.data, 'base64'),
        options: {
          filename: binaryData.fileName || 'theme.zip',
          contentType: binaryData.mimeType || 'application/zip',
        },
      },
    },
  };

  try {
    let returnData;
    if (authenticationMethod === 'credentials') {
      returnData = await context.helpers.requestWithAuthentication.call(
        context,
        'mauticAdvancedApi',
        options,
      );
    } else {
      returnData = await context.helpers.requestOAuth2.call(
        context,
        'mauticAdvancedOAuth2Api',
        options,
        {
          includeCredentialsOnRefreshOnBody: true,
        },
      );
    }

    if (returnData.errors) {
      throw new NodeOperationError(context.getNode(), 'Theme creation failed', {
        itemIndex,
        description: returnData,
      });
    }

    return returnData;
  } catch (error) {
    throw new NodeOperationError(
      context.getNode(),
      `Failed to create theme: ${(error as Error)?.message || 'Unknown error'}`,
      { itemIndex },
    );
  }
}

async function getTheme(
  context: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const themeName = getRequiredParam<string>(context, 'themeName', itemIndex);
  const authenticationMethod = context.getNodeParameter(
    'authentication',
    0,
    'credentials',
  ) as string;
  const credentials =
    authenticationMethod === 'credentials'
      ? await context.getCredentials('mauticAdvancedApi')
      : await context.getCredentials('mauticAdvancedOAuth2Api');
  const baseUrl = credentials.url as string;

  const options: IRequestOptions = {
    headers: {},
    method: 'GET',
    uri: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/themes/${themeName}`,
    encoding: null,
    json: false,
  };

  try {
    let response: Buffer;
    if (authenticationMethod === 'credentials') {
      response = (await context.helpers.requestWithAuthentication.call(
        context,
        'mauticAdvancedApi',
        options,
      )) as Buffer;
    } else {
      response = (await context.helpers.requestOAuth2.call(
        context,
        'mauticAdvancedOAuth2Api',
        options,
        {
          includeCredentialsOnRefreshOnBody: true,
        },
      )) as Buffer;
    }

    const binaryData = await context.helpers.prepareBinaryData(response, `${themeName}.zip`);

    return [
      {
        json: {
          themeName,
          success: true,
        },
        binary: {
          theme: binaryData,
        },
      },
    ];
  } catch (error) {
    throw new NodeOperationError(
      context.getNode(),
      `Failed to get theme: ${(error as Error)?.message || 'Unknown error'}`,
      { itemIndex },
    );
  }
}

async function getAllThemes(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const returnAll = getOptionalParam<boolean>(context, 'returnAll', itemIndex, false);
  const limit = getOptionalParam<number>(context, 'limit', itemIndex, 50);
  const options = getOptionalParam<IDataObject>(context, 'options', itemIndex, {});

  const query: IDataObject = {};
  if (options.search) query.search = options.search;
  if (options.orderBy) query.orderBy = options.orderBy;
  if (options.orderByDir) query.orderByDir = options.orderByDir;

  const authenticationMethod = context.getNodeParameter(
    'authentication',
    0,
    'credentials',
  ) as string;
  const credentials =
    authenticationMethod === 'credentials'
      ? await context.getCredentials('mauticAdvancedApi')
      : await context.getCredentials('mauticAdvancedOAuth2Api');
  const baseUrl = credentials.url as string;

  const requestOptions: IRequestOptions = {
    headers: {},
    method: 'GET',
    uri: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/themes`,
    qs: query,
    json: true,
  };

  try {
    let response;
    if (authenticationMethod === 'credentials') {
      response = await context.helpers.requestWithAuthentication.call(
        context,
        'mauticAdvancedApi',
        requestOptions,
      );
    } else {
      response = await context.helpers.requestOAuth2.call(
        context,
        'mauticAdvancedOAuth2Api',
        requestOptions,
        {
          includeCredentialsOnRefreshOnBody: true,
        },
      );
    }

    if (response.errors) {
      throw new NodeOperationError(context.getNode(), 'Failed to get themes', {
        itemIndex,
        description: response,
      });
    }

    const themes = response.themes || {};
    const themesArray = Object.entries(themes).map(([name, config]: [string, any]) => ({
      name,
      ...config,
    }));

    if (!returnAll && limit) {
      return convertNumericStrings(themesArray.slice(0, limit));
    }

    return convertNumericStrings(themesArray);
  } catch (error) {
    throw new NodeOperationError(
      context.getNode(),
      `Failed to get themes: ${(error as Error)?.message || 'Unknown error'}`,
      { itemIndex },
    );
  }
}

async function deleteTheme(context: IExecuteFunctions, itemIndex: number): Promise<any> {
  const themeName = getRequiredParam<string>(context, 'themeName', itemIndex);
  const authenticationMethod = context.getNodeParameter(
    'authentication',
    0,
    'credentials',
  ) as string;
  const credentials =
    authenticationMethod === 'credentials'
      ? await context.getCredentials('mauticAdvancedApi')
      : await context.getCredentials('mauticAdvancedOAuth2Api');
  const baseUrl = credentials.url as string;

  const options: IRequestOptions = {
    headers: {},
    method: 'DELETE',
    uri: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/themes/${themeName}/delete`,
    json: true,
  };

  try {
    let response;
    if (authenticationMethod === 'credentials') {
      response = await context.helpers.requestWithAuthentication.call(
        context,
        'mauticAdvancedApi',
        options,
      );
    } else {
      response = await context.helpers.requestOAuth2.call(
        context,
        'mauticAdvancedOAuth2Api',
        options,
        {
          includeCredentialsOnRefreshOnBody: true,
        },
      );
    }

    if (response.errors) {
      throw new NodeOperationError(context.getNode(), 'Theme deletion failed', {
        itemIndex,
        description: response,
      });
    }

    return response || { success: true };
  } catch (error) {
    throw new NodeOperationError(
      context.getNode(),
      `Failed to delete theme: ${(error as Error)?.message || 'Unknown error'}`,
      { itemIndex },
    );
  }
}
