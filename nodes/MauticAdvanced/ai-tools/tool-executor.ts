// nodes/MauticAdvanced/ai-tools/tool-executor.ts
import type { ISupplyDataFunctions } from 'n8n-workflow';
import { wrapSuccess, wrapError, formatApiError, ERROR_TYPES } from './error-formatter';
import { mauticApiRequest } from '../GenericFunctions';

const N8N_METADATA_FIELDS = new Set([
	'sessionId',
	'action',
	'chatInput',
	// Named rule: "root field injection" — n8n canvas UUID injected into every tool call
	'root',
	'tool',
	'toolName',
	'toolCallId',
	// Named rule: "operation leaks" — func() strips it but execute() path passes raw item.json
	'operation',
]);

const NUMERIC_FIELDS = new Set<string>([
	'id',
	'contactId',
	'companyId',
	'campaignId',
	'segmentId',
	'emailId',
	'lead',
	'limit',
	'owner_id',
]);

// Map resource names to their Mautic API response property keys
const RESOURCE_PROPERTY_MAP: Record<string, { single: string; plural: string }> = {
	contact: { single: 'contact', plural: 'contacts' },
	company: { single: 'company', plural: 'companies' },
	campaign: { single: 'campaign', plural: 'campaigns' },
	email: { single: 'email', plural: 'emails' },
	segment: { single: 'list', plural: 'lists' },
	tag: { single: 'tag', plural: 'tags' },
	note: { single: 'note', plural: 'notes' },
	category: { single: 'category', plural: 'categories' },
	field: { single: 'field', plural: 'fields' },
	user: { single: 'user', plural: 'users' },
};

// Map resource names to their API endpoint paths
const RESOURCE_ENDPOINT_MAP: Record<string, string> = {
	contact: '/contacts',
	company: '/companies',
	campaign: '/campaigns',
	email: '/emails',
	segment: '/segments',
	tag: '/tags',
	note: '/notes',
	category: '/categories',
	user: '/users',
};

function isEmpty(result: any): boolean {
	return (
		result === null ||
		result === undefined ||
		(Array.isArray(result) && result.length === 0) ||
		(typeof result === 'object' && !Array.isArray(result) && Object.keys(result).length === 0)
	);
}

function buildFilters(params: Record<string, unknown>): Record<string, unknown> {
	const filters: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== '') {
			filters[key] = value;
		}
	}
	return filters;
}

async function apiRequest(
	context: ISupplyDataFunctions,
	method: string,
	endpoint: string,
	body: any = {},
	query: any = {},
): Promise<any> {
	return mauticApiRequest.call(context as any, method as any, endpoint, body, query);
}

// Detect mautic version from credentials
async function getMauticVersionFromContext(context: ISupplyDataFunctions): Promise<string> {
	try {
		const authMethod = context.getNodeParameter('authentication', 0, 'credentials') as string;
		const credName =
			authMethod === 'oAuth2' ? 'mauticAdvancedOAuth2Api' : 'mauticAdvancedApi';
		const credentials = await context.getCredentials(credName);
		return (credentials.mauticVersion as string) || 'v6';
	} catch {
		return 'v6';
	}
}

export async function executeAiTool(
	context: ISupplyDataFunctions,
	resource: string,
	operation: string,
	rawParams: Record<string, unknown>,
	validOps: string[] = [],
): Promise<string> {
	// Layer 3 write safety — defense-in-depth inside the executor itself
	const WRITE_OPS = new Set([
		'create', 'update', 'delete', 'sendEmail',
		'addToSegments', 'removeFromSegments', 'addToCampaigns', 'removeFromCampaigns',
		'addContact', 'removeContact', 'add', 'remove', 'send',
	]);
	if (validOps.length > 0 && WRITE_OPS.has(operation) && !validOps.includes(operation)) {
		return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.WRITE_OPERATION_BLOCKED,
			'Write operations are disabled for this tool.',
			'Enable allowWriteOperations on the MauticAdvancedAiTools node to use mutating operations.'));
	}

	// Strip n8n framework metadata
	const params: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(rawParams)) {
		if (!N8N_METADATA_FIELDS.has(key)) params[key] = value;
	}

	// Coerce numeric strings to numbers (LLMs occasionally pass "10" instead of 10)
	for (const key of NUMERIC_FIELDS) {
		if (key in params && typeof params[key] === 'string' && /^\d+$/.test(params[key] as string)) {
			params[key] = parseInt(params[key] as string, 10);
		}
	}

	try {
		// Route to resource-specific handlers
		switch (resource) {
			case 'contact':
				return await executeContactTool(context, operation, params);
			case 'company':
				return await executeCrudTool(context, resource, operation, params);
			case 'campaign':
				return await executeCrudTool(context, resource, operation, params);
			case 'email':
				return await executeCrudTool(context, resource, operation, params);
			case 'segment':
				return await executeSegmentTool(context, operation, params);
			case 'tag':
				return await executeTagTool(context, operation, params);
			case 'note':
				return await executeCrudTool(context, resource, operation, params);
			case 'category':
				return await executeCrudTool(context, resource, operation, params);
			case 'field':
				return await executeFieldTool(context, operation, params);
			case 'user':
				return await executeReadOnlyTool(context, resource, operation, params);
			case 'companyContact':
				return await executeCompanyContactTool(context, operation, params);
			case 'campaignContact':
				return await executeCampaignContactTool(context, operation, params);
			case 'contactSegment':
				return await executeContactSegmentTool(context, operation, params);
			case 'segmentEmail':
				return await executeSegmentEmailTool(context, operation, params);
			default:
				return JSON.stringify(
					wrapError(
						resource,
						operation,
						ERROR_TYPES.INVALID_OPERATION,
						'Unsupported resource.',
						'Use one of the available resource tools.',
					),
				);
		}
	} catch (error) {
		const msg = error instanceof Error ? error.message : String(error);
		return JSON.stringify(formatApiError(msg, resource, operation));
	}
}

// ---------------------------------------------------------------------------
// Standard CRUD handler (company, campaign, email, note, category)
// ---------------------------------------------------------------------------

async function executeCrudTool(
	context: ISupplyDataFunctions,
	resource: string,
	operation: string,
	params: Record<string, unknown>,
): Promise<string> {
	const propMap = RESOURCE_PROPERTY_MAP[resource];
	const endpoint = RESOURCE_ENDPOINT_MAP[resource];
	if (!propMap || !endpoint) {
		return JSON.stringify(
			wrapError(resource, operation, ERROR_TYPES.INVALID_OPERATION, 'Unknown resource.', ''),
		);
	}

	switch (operation) {
		case 'get': {
			if (!params.id) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				`A numeric entity ID is required for ${resource}.get.`,
				`Call mauticadvanced_${resource} with operation 'getAll' and the 'search' parameter to find the record and get its numeric 'id' first.`));
			const response = await apiRequest(context, 'GET', `${endpoint}/${params.id}`);
			const result = response[propMap.single];
			if (isEmpty(result)) {
				return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.ENTITY_NOT_FOUND,
					`No ${resource} record found with ID ${params.id}.`,
					`Call mauticadvanced_${resource} with operation 'getAll' and the 'search' parameter to find the record by text, then use the numeric ID from the results.`));
			}
			return JSON.stringify(wrapSuccess(resource, operation, result));
		}
		case 'getAll': {
			const { limit = 25, ...filterParams } = params;
			const effectiveLimit = limit as number;
			const qs: any = {};
			if (filterParams.search) qs.search = filterParams.search;
			qs.limit = effectiveLimit;
			qs.orderBy = 'id';
			qs.orderByDir = 'asc';

			const response = await apiRequest(context, 'GET', endpoint, {}, qs);
			const records = response[propMap.plural]
				? (Object.values(response[propMap.plural]) as any[])
				: [];

			const filters = buildFilters(filterParams);
			const hasFilters = Object.keys(filters).length > 0;

			if (records.length === 0 && hasFilters) {
				return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.NO_RESULTS_FOUND,
					`No ${resource} records matched the provided filters.`,
					'Broaden your search criteria, check for typos, or verify the record exists.',
					{ filtersUsed: filters }));
			}

			const resultPayload: Record<string, unknown> = { items: records, count: records.length };
			if (records.length >= effectiveLimit) {
				resultPayload.truncated = true;
				resultPayload.note = `Results capped at ${effectiveLimit}. Use filters to narrow or increase 'limit' (max 100).`;
			}
			return JSON.stringify(wrapSuccess(resource, operation, resultPayload));
		}
		case 'create': {
			const { id: _id, ...createBody } = params;
			// Parse customFields JSON if present
			if (typeof createBody.customFields === 'string') {
				try {
					const custom = JSON.parse(createBody.customFields as string);
					delete createBody.customFields;
					Object.assign(createBody, custom);
				} catch { /* ignore parse errors */ }
			}
			// Handle comma-separated tags
			if (typeof createBody.tags === 'string') {
				createBody.tags = (createBody.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean);
			}
			const response = await apiRequest(context, 'POST', `${endpoint}/new`, createBody);
			const result = response[propMap.single];
			return JSON.stringify(wrapSuccess(resource, operation, result));
		}
		case 'update': {
			if (!params.id) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				`A numeric entity ID is required for ${resource}.update.`,
				`Call mauticadvanced_${resource} with operation 'getAll' and the 'search' parameter to find the record and get its numeric 'id' first.`));
			const { id, ...updateBody } = params;
			// Parse customFields JSON if present
			if (typeof updateBody.customFields === 'string') {
				try {
					const custom = JSON.parse(updateBody.customFields as string);
					delete updateBody.customFields;
					Object.assign(updateBody, custom);
				} catch { /* ignore parse errors */ }
			}
			// Handle comma-separated tags
			if (typeof updateBody.tags === 'string') {
				updateBody.tags = (updateBody.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean);
			}
			const response = await apiRequest(context, 'PATCH', `${endpoint}/${id}/edit`, updateBody);
			const result = response[propMap.single];
			return JSON.stringify(wrapSuccess(resource, operation, result));
		}
		case 'delete': {
			if (!params.id) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				`A numeric entity ID is required for ${resource}.delete.`,
				`Call mauticadvanced_${resource} with operation 'getAll' and the 'search' parameter to find the record and get its numeric 'id' first.`));
			await apiRequest(context, 'DELETE', `${endpoint}/${params.id}/delete`);
			return JSON.stringify(wrapSuccess(resource, operation, { id: params.id, deleted: true }));
		}
		default:
			return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.INVALID_OPERATION,
				'Unsupported operation.',
				'Check allowed operations for this resource.'));
	}
}

// ---------------------------------------------------------------------------
// Contact handler (extra operations: sendEmail, segments, campaigns)
// ---------------------------------------------------------------------------

async function executeContactTool(
	context: ISupplyDataFunctions,
	operation: string,
	params: Record<string, unknown>,
): Promise<string> {
	const resource = 'contact';

	switch (operation) {
		case 'get':
		case 'getAll':
		case 'create':
		case 'update':
		case 'delete':
			return executeCrudTool(context, resource, operation, params);

		case 'sendEmail': {
			const contactId = params.id ?? params.contactId;
			const emailId = params.emailId;
			if (!contactId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				'A numeric contact ID is required.',
				"Call mauticadvanced_contact with operation 'getAll' and 'search' to find the contact ID."));
			if (!emailId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_REQUIRED_FIELD,
				'A numeric email ID is required.',
				"Call mauticadvanced_email with operation 'getAll' and 'search' to find the email ID."));
			const response = await apiRequest(context, 'POST', `/emails/${emailId}/contact/${contactId}/send`);
			return JSON.stringify(wrapSuccess(resource, operation, response));
		}
		case 'addToSegments': {
			const contactId = params.id;
			if (!contactId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				'A numeric contact ID is required.',
				"Call mauticadvanced_contact with operation 'getAll' and 'search' to find the contact ID."));
			const segmentIds = typeof params.segmentIds === 'string'
				? (params.segmentIds as string).split(',').map((s: string) => s.trim()).filter(Boolean)
				: params.segmentIds;
			const response = await apiRequest(context, 'POST', `/contacts/${contactId}/segments/add`, { segments: segmentIds });
			return JSON.stringify(wrapSuccess(resource, operation, response.contact ?? response));
		}
		case 'removeFromSegments': {
			const contactId = params.id;
			if (!contactId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				'A numeric contact ID is required.',
				"Call mauticadvanced_contact with operation 'getAll' and 'search' to find the contact ID."));
			const segmentIds = typeof params.segmentIds === 'string'
				? (params.segmentIds as string).split(',').map((s: string) => s.trim()).filter(Boolean)
				: params.segmentIds;
			const response = await apiRequest(context, 'POST', `/contacts/${contactId}/segments/remove`, { segments: segmentIds });
			return JSON.stringify(wrapSuccess(resource, operation, response.contact ?? response));
		}
		case 'addToCampaigns': {
			const contactId = params.id;
			if (!contactId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				'A numeric contact ID is required.',
				"Call mauticadvanced_contact with operation 'getAll' and 'search' to find the contact ID."));
			const campaignIds = typeof params.campaignIds === 'string'
				? (params.campaignIds as string).split(',').map((s: string) => s.trim()).filter(Boolean)
				: params.campaignIds;
			const response = await apiRequest(context, 'POST', `/contacts/${contactId}/campaigns/add`, { campaigns: campaignIds });
			return JSON.stringify(wrapSuccess(resource, operation, response.contact ?? response));
		}
		case 'removeFromCampaigns': {
			const contactId = params.id;
			if (!contactId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				'A numeric contact ID is required.',
				"Call mauticadvanced_contact with operation 'getAll' and 'search' to find the contact ID."));
			const campaignIds = typeof params.campaignIds === 'string'
				? (params.campaignIds as string).split(',').map((s: string) => s.trim()).filter(Boolean)
				: params.campaignIds;
			const response = await apiRequest(context, 'POST', `/contacts/${contactId}/campaigns/remove`, { campaigns: campaignIds });
			return JSON.stringify(wrapSuccess(resource, operation, response.contact ?? response));
		}
		default:
			return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.INVALID_OPERATION,
				'Unsupported operation for contact.',
				'Allowed: get, getAll, create, update, delete, sendEmail, addToSegments, removeFromSegments, addToCampaigns, removeFromCampaigns.'));
	}
}

// ---------------------------------------------------------------------------
// Segment handler (extra operations: addContact, removeContact)
// ---------------------------------------------------------------------------

async function executeSegmentTool(
	context: ISupplyDataFunctions,
	operation: string,
	params: Record<string, unknown>,
): Promise<string> {
	const resource = 'segment';

	switch (operation) {
		case 'get': {
			if (!params.id) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				'A numeric segment ID is required.',
				"Call mauticadvanced_segment with operation 'getAll' and 'search' to find the segment ID."));
			const response = await apiRequest(context, 'GET', `/segments/${params.id}`);
			const result = response.list;
			if (isEmpty(result)) {
				return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.ENTITY_NOT_FOUND,
					`No segment found with ID ${params.id}.`,
					"Call mauticadvanced_segment with operation 'getAll' and 'search' to find the segment."));
			}
			return JSON.stringify(wrapSuccess(resource, operation, result));
		}
		case 'getAll': {
			const { limit = 25, ...filterParams } = params;
			const effectiveLimit = limit as number;
			const qs: any = {};
			if (filterParams.search) qs.search = filterParams.search;
			qs.limit = effectiveLimit;
			const response = await apiRequest(context, 'GET', '/segments', {}, qs);
			const records = response.lists ? (Object.values(response.lists) as any[]) : [];

			const filters = buildFilters(filterParams);
			const hasFilters = Object.keys(filters).length > 0;

			if (records.length === 0 && hasFilters) {
				return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.NO_RESULTS_FOUND,
					'No segment records matched the provided filters.',
					'Broaden your search criteria, check for typos, or verify the record exists.',
					{ filtersUsed: filters }));
			}

			const resultPayload: Record<string, unknown> = { items: records, count: records.length };
			if (records.length >= effectiveLimit) {
				resultPayload.truncated = true;
				resultPayload.note = `Results capped at ${effectiveLimit}. Increase 'limit' (max 100) if needed.`;
			}
			return JSON.stringify(wrapSuccess(resource, operation, resultPayload));
		}
		case 'create': {
			const { id: _id, ...body } = params;
			const response = await apiRequest(context, 'POST', '/segments/new', body);
			return JSON.stringify(wrapSuccess(resource, operation, response.list));
		}
		case 'update': {
			if (!params.id) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				'A numeric segment ID is required.',
				"Call mauticadvanced_segment with operation 'getAll' and 'search' to find the segment ID."));
			const { id, ...body } = params;
			const response = await apiRequest(context, 'PATCH', `/segments/${id}/edit`, body);
			return JSON.stringify(wrapSuccess(resource, operation, response.list));
		}
		case 'delete': {
			if (!params.id) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				'A numeric segment ID is required.',
				"Call mauticadvanced_segment with operation 'getAll' and 'search' to find the segment ID."));
			await apiRequest(context, 'DELETE', `/segments/${params.id}/delete`);
			return JSON.stringify(wrapSuccess(resource, operation, { id: params.id, deleted: true }));
		}
		case 'addContact': {
			if (!params.id) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				'A numeric segment ID is required.', ''));
			if (!params.contactId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_REQUIRED_FIELD,
				'A numeric contact ID is required.', ''));
			const response = await apiRequest(context, 'POST', `/segments/${params.id}/contact/${params.contactId}/add`);
			return JSON.stringify(wrapSuccess(resource, operation, response));
		}
		case 'removeContact': {
			if (!params.id) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				'A numeric segment ID is required.', ''));
			if (!params.contactId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_REQUIRED_FIELD,
				'A numeric contact ID is required.', ''));
			const response = await apiRequest(context, 'POST', `/segments/${params.id}/contact/${params.contactId}/remove`);
			return JSON.stringify(wrapSuccess(resource, operation, response));
		}
		default:
			return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.INVALID_OPERATION,
				'Unsupported operation for segment.',
				'Allowed: get, getAll, create, update, delete, addContact, removeContact.'));
	}
}

// ---------------------------------------------------------------------------
// Tag handler (v1/v2 version routing)
// ---------------------------------------------------------------------------

async function executeTagTool(
	context: ISupplyDataFunctions,
	operation: string,
	params: Record<string, unknown>,
): Promise<string> {
	const resource = 'tag';
	const mauticVersion = await getMauticVersionFromContext(context);
	const useV2 = mauticVersion === 'v7';
	const tagEndpoint = useV2 ? '/v2/tags' : '/tags';

	switch (operation) {
		case 'get': {
			if (!params.id) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				'A numeric tag ID is required.',
				"Call mauticadvanced_tag with operation 'getAll' and 'search' to find the tag ID."));
			const response = await apiRequest(context, 'GET', `${tagEndpoint}/${params.id}`);
			const result = useV2 ? normaliseV2Tag(response) : response.tag;
			if (isEmpty(result)) {
				return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.ENTITY_NOT_FOUND,
					`No tag found with ID ${params.id}.`,
					"Call mauticadvanced_tag with operation 'getAll' and 'search' to find the tag."));
			}
			return JSON.stringify(wrapSuccess(resource, operation, result));
		}
		case 'getAll': {
			const { limit = 25, ...filterParams } = params;
			const effectiveLimit = limit as number;
			const qs: any = {};
			if (filterParams.search) qs.search = filterParams.search;
			qs.limit = effectiveLimit;
			qs.orderBy = 'id';
			qs.orderByDir = 'asc';

			let records: any[];
			if (useV2) {
				const response = await apiRequest(context, 'GET', tagEndpoint, {}, qs);
				records = normaliseV2TagCollection(response);
			} else {
				const response = await apiRequest(context, 'GET', tagEndpoint, {}, qs);
				records = response.tags ? (Object.values(response.tags) as any[]) : [];
			}

			const filters = buildFilters(filterParams);
			const hasFilters = Object.keys(filters).length > 0;

			if (records.length === 0 && hasFilters) {
				return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.NO_RESULTS_FOUND,
					'No tag records matched the provided filters.',
					'Broaden your search criteria, check for typos, or verify the record exists.',
					{ filtersUsed: filters }));
			}

			const resultPayload: Record<string, unknown> = { items: records, count: records.length };
			if (records.length >= effectiveLimit) {
				resultPayload.truncated = true;
			}
			return JSON.stringify(wrapSuccess(resource, operation, resultPayload));
		}
		case 'create': {
			const body: any = {};
			if (params.tag) body.tag = params.tag;
			let response: any;
			if (useV2) {
				const headers = { 'Content-Type': 'application/json' };
				response = await mauticApiRequest.call(context as any, 'POST', '/v2/tags', body, {}, undefined, headers);
				return JSON.stringify(wrapSuccess(resource, operation, normaliseV2Tag(response)));
			} else {
				response = await apiRequest(context, 'POST', '/tags/new', body);
				return JSON.stringify(wrapSuccess(resource, operation, response.tag));
			}
		}
		case 'update': {
			if (!params.id) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				'A numeric tag ID is required.',
				"Call mauticadvanced_tag with operation 'getAll' and 'search' to find the tag ID."));
			const { id, ...body } = params;
			let response: any;
			if (useV2) {
				const headers = { 'Content-Type': 'application/merge-patch+json' };
				response = await mauticApiRequest.call(context as any, 'PATCH', `/v2/tags/${id}`, body, {}, undefined, headers);
				return JSON.stringify(wrapSuccess(resource, operation, normaliseV2Tag(response)));
			} else {
				response = await apiRequest(context, 'PATCH', `/tags/${id}/edit`, body);
				return JSON.stringify(wrapSuccess(resource, operation, response.tag));
			}
		}
		case 'delete': {
			if (!params.id) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				'A numeric tag ID is required.',
				"Call mauticadvanced_tag with operation 'getAll' and 'search' to find the tag ID."));
			if (useV2) {
				await apiRequest(context, 'DELETE', `/v2/tags/${params.id}`);
			} else {
				await apiRequest(context, 'DELETE', `/tags/${params.id}/delete`);
			}
			return JSON.stringify(wrapSuccess(resource, operation, { id: params.id, deleted: true }));
		}
		default:
			return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.INVALID_OPERATION,
				'Unsupported operation for tag.',
				'Allowed: get, getAll, create, update, delete.'));
	}
}

// Tag v2 normalization helpers (from TagOperations.ts)
function normaliseV2Tag(response: any): any {
	if (!response) return {};
	if (response.data && typeof response.data === 'object') {
		const data = response.data;
		return { id: data.id, ...(data.attributes || {}) };
	}
	if (Array.isArray(response)) return response[0] || {};
	if (response.attributes) return { id: response.id, ...response.attributes };
	return response;
}

function normaliseV2TagCollection(response: any): any[] {
	if (!response) return [];
	if (response.data && Array.isArray(response.data)) {
		return response.data.map((entry: any) => normaliseV2Tag({ data: entry }));
	}
	if (Array.isArray(response)) return response;
	if (Array.isArray(response.member)) return response.member;
	return [];
}

// ---------------------------------------------------------------------------
// Field handler (read-only: get, getAll)
// ---------------------------------------------------------------------------

async function executeFieldTool(
	context: ISupplyDataFunctions,
	operation: string,
	params: Record<string, unknown>,
): Promise<string> {
	const resource = 'field';
	const fieldObject = (params.fieldObject as string) || 'contact';

	switch (operation) {
		case 'get': {
			if (!params.id) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				'A numeric field ID is required.', ''));
			const response = await apiRequest(context, 'GET', `/fields/${fieldObject}/${params.id}`);
			const result = response.field;
			if (isEmpty(result)) {
				return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.ENTITY_NOT_FOUND,
					`No field found with ID ${params.id}.`, ''));
			}
			return JSON.stringify(wrapSuccess(resource, operation, result));
		}
		case 'getAll': {
			const limit = (params.limit as number) ?? 25;
			const effectiveLimit = limit as number;
			const qs: any = { limit: effectiveLimit };

			const response = await apiRequest(context, 'GET', `/fields/${fieldObject}`, {}, qs);
			const records = response.fields ? (Object.values(response.fields) as any[]) : [];

			if (records.length === 0) {
				return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.NO_RESULTS_FOUND,
					`No ${fieldObject} fields found.`,
					'Check the fieldObject value (contact or company) and try again.',
					{ filtersUsed: { fieldObject } }));
			}

			const resultPayload: Record<string, unknown> = { items: records, count: records.length };
			if (records.length >= effectiveLimit) {
				resultPayload.truncated = true;
			}
			return JSON.stringify(wrapSuccess(resource, operation, resultPayload));
		}
		default:
			return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.INVALID_OPERATION,
				'Unsupported operation for field.',
				'Allowed: get, getAll.'));
	}
}

// ---------------------------------------------------------------------------
// Read-only handler (user: get, getAll)
// ---------------------------------------------------------------------------

async function executeReadOnlyTool(
	context: ISupplyDataFunctions,
	resource: string,
	operation: string,
	params: Record<string, unknown>,
): Promise<string> {
	const propMap = RESOURCE_PROPERTY_MAP[resource];
	const endpoint = RESOURCE_ENDPOINT_MAP[resource];
	if (!propMap || !endpoint) {
		return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.INVALID_OPERATION, 'Unknown resource.', ''));
	}

	switch (operation) {
		case 'get': {
			if (!params.id) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_ENTITY_ID,
				`A numeric ${resource} ID is required.`,
				`Call mauticadvanced_${resource} with operation 'getAll' and 'search' to find the ${resource} ID.`));
			const response = await apiRequest(context, 'GET', `${endpoint}/${params.id}`);
			const result = response[propMap.single];
			if (isEmpty(result)) {
				return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.ENTITY_NOT_FOUND,
					`No ${resource} found with ID ${params.id}.`,
					`Call mauticadvanced_${resource} with operation 'getAll' and 'search' to find the ${resource}.`));
			}
			return JSON.stringify(wrapSuccess(resource, operation, result));
		}
		case 'getAll': {
			const { limit = 25, ...filterParams } = params;
			const effectiveLimit = limit as number;
			const qs: any = {};
			if (filterParams.search) qs.search = filterParams.search;
			qs.limit = effectiveLimit;
			qs.orderBy = 'id';
			qs.orderByDir = 'asc';

			const response = await apiRequest(context, 'GET', endpoint, {}, qs);
			const rawData = response[propMap.plural];
			const records = rawData
				? Array.isArray(rawData)
					? rawData
					: (Object.values(rawData) as any[])
				: [];

			const filters = buildFilters(filterParams);
			const hasFilters = Object.keys(filters).length > 0;

			if (records.length === 0 && hasFilters) {
				return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.NO_RESULTS_FOUND,
					`No ${resource} records matched the provided filters.`,
					'Broaden your search criteria, check for typos, or verify the record exists.',
					{ filtersUsed: filters }));
			}

			const resultPayload: Record<string, unknown> = { items: records, count: records.length };
			if (records.length >= effectiveLimit) {
				resultPayload.truncated = true;
			}
			return JSON.stringify(wrapSuccess(resource, operation, resultPayload));
		}
		default:
			return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.INVALID_OPERATION,
				`Unsupported operation for ${resource}.`,
				`Allowed: get, getAll.`));
	}
}

// ---------------------------------------------------------------------------
// Association handlers (companyContact, campaignContact, contactSegment)
// ---------------------------------------------------------------------------

async function executeCompanyContactTool(
	context: ISupplyDataFunctions,
	operation: string,
	params: Record<string, unknown>,
): Promise<string> {
	const resource = 'companyContact';
	if (!params.companyId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_REQUIRED_FIELD,
		'A numeric company ID is required.', "Call mauticadvanced_company with operation 'getAll' to find the company ID."));
	if (!params.contactId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_REQUIRED_FIELD,
		'A numeric contact ID is required.', "Call mauticadvanced_contact with operation 'getAll' to find the contact ID."));

	const action = operation === 'add' ? 'add' : 'remove';
	const response = await apiRequest(context, 'POST', `/companies/${params.companyId}/contact/${params.contactId}/${action}`);
	return JSON.stringify(wrapSuccess(resource, operation, response));
}

async function executeCampaignContactTool(
	context: ISupplyDataFunctions,
	operation: string,
	params: Record<string, unknown>,
): Promise<string> {
	const resource = 'campaignContact';
	if (!params.campaignId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_REQUIRED_FIELD,
		'A numeric campaign ID is required.', "Call mauticadvanced_campaign with operation 'getAll' to find the campaign ID."));
	if (!params.contactId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_REQUIRED_FIELD,
		'A numeric contact ID is required.', "Call mauticadvanced_contact with operation 'getAll' to find the contact ID."));

	const action = operation === 'add' ? 'add' : 'remove';
	const response = await apiRequest(context, 'POST', `/campaigns/${params.campaignId}/contact/${params.contactId}/${action}`);
	return JSON.stringify(wrapSuccess(resource, operation, response));
}

async function executeContactSegmentTool(
	context: ISupplyDataFunctions,
	operation: string,
	params: Record<string, unknown>,
): Promise<string> {
	const resource = 'contactSegment';
	if (!params.segmentId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_REQUIRED_FIELD,
		'A numeric segment ID is required.', "Call mauticadvanced_segment with operation 'getAll' to find the segment ID."));
	if (!params.contactId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_REQUIRED_FIELD,
		'A numeric contact ID is required.', "Call mauticadvanced_contact with operation 'getAll' to find the contact ID."));

	const action = operation === 'add' ? 'add' : 'remove';
	const response = await apiRequest(context, 'POST', `/segments/${params.segmentId}/contact/${params.contactId}/${action}`);
	return JSON.stringify(wrapSuccess(resource, operation, response));
}

// ---------------------------------------------------------------------------
// Segment Email handler (send only)
// ---------------------------------------------------------------------------

async function executeSegmentEmailTool(
	context: ISupplyDataFunctions,
	operation: string,
	params: Record<string, unknown>,
): Promise<string> {
	const resource = 'segmentEmail';
	if (operation !== 'send') {
		return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.INVALID_OPERATION,
			'Only the send operation is supported for segmentEmail.', ''));
	}
	if (!params.emailId) return JSON.stringify(wrapError(resource, operation, ERROR_TYPES.MISSING_REQUIRED_FIELD,
		"A numeric email ID is required. Must be a 'list' type email.",
		"Call mauticadvanced_email with operation 'getAll' and 'search' to find the email ID."));

	const response = await apiRequest(context, 'POST', `/emails/${params.emailId}/send`);
	return JSON.stringify(wrapSuccess(resource, operation, response));
}
