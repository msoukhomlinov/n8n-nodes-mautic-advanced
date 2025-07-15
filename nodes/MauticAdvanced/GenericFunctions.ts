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
			returnData = await this.helpers.requestWithAuthentication.call(this, 'mauticAdvancedApi', options);
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
export async function mauticApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,

	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;
	query.limit = 30;
	query.start = 0;

	do {
		responseData = await mauticApiRequest.call(this, method, endpoint, body, query);
		const values = Object.values(responseData[propertyName] as IDataObject[]);
		returnData.push.apply(returnData, values);
		query.start += query.limit;
	} while (
		responseData.total !== undefined &&
		returnData.length - parseInt(responseData.total as string, 10) < 0
	);

	// Deduplicate by 'id' property (defensive for all resources)
	const seenIds = new Set();
	const uniqueData = [];
	for (const item of returnData) {
		// Only deduplicate if item is an object
		if (typeof item === 'object' && item !== null) {
			// Defensive: support both direct id and nested id (e.g., item.fields?.id)
			const id = (item as { id?: unknown; fields?: { id?: unknown } }).id ?? (item as { fields?: { id?: unknown } }).fields?.id;
			if (id !== undefined && !seenIds.has(id)) {
				uniqueData.push(item);
				seenIds.add(id);
			} else if (id === undefined) {
				// If no id, include anyway (could be a non-standard object)
				uniqueData.push(item);
			}
		} else {
			// If not an object, include anyway
			uniqueData.push(item);
		}
	}
	return uniqueData;
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
