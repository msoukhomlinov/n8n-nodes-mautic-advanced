// nodes/MauticAdvanced/ai-tools/description-builders.ts

export function dateTimeReferenceSnippet(referenceUtc: string): string {
	return `Reference: current UTC date-time when these tools were loaded is ${referenceUtc}. Use this for "today", "recent", or date-based filtering. `;
}

const REQUIRED_FIELDS_BY_RESOURCE: Record<string, string[]> = {
	contact: ['email'],
	company: ['companyname'],
	campaign: ['name'],
	email: ['name', 'subject'],
	segment: ['name'],
	tag: ['tag'],
	note: ['text', 'lead'],
	category: ['title', 'bundle'],
};

export function getRequiredFields(resource: string): string[] {
	return REQUIRED_FIELDS_BY_RESOURCE[resource] ?? [];
}

function buildGetDescription(label: string, supportsSearch = true): string {
	const lookupHint = supportsSearch
		? `call this tool with operation 'getAll' and 'search' first, extract the 'id' from results, then call again with operation 'get'.`
		: `call this tool with operation 'getAll' and available filters to find the record, extract the 'id', then call again with operation 'get'.`;
	return (
		`Fetch a single ${label} record by its numeric ID. ` +
		`ONLY use this when you already have a numeric ID — never pass a name or text. ` +
		`If you only have a name or description, ${lookupHint}`
	);
}

function buildGetAllDescription(label: string, supportsSearch = true): string {
	if (supportsSearch) {
		return (
			`Search and list ${label} records. ` +
			`ALWAYS use 'search' for any text or name lookup (partial match across multiple fields) — do not use 'name' for text lookups. ` +
			`Results contain a numeric 'id' field on each record — capture this ID for subsequent calls. ` +
			`Increase 'limit' (max 100) if you expect many results.`
		);
	}
	return (
		`List ${label} records using the available filters. ` +
		`Results contain a numeric 'id' field on each record — capture this ID for subsequent calls. ` +
		`Increase 'limit' (max 100) if you expect many results.`
	);
}

function buildCreateDescription(label: string, requiredFields: string[]): string {
	const reqList =
		requiredFields.length > 0 ? `Required fields: ${requiredFields.join(', ')}. ` : '';
	return (
		`Create a new ${label} record. ` +
		reqList +
		`Confirm field values with user before executing when acting autonomously. ` +
		`On success returns the created record including its assigned numeric 'id'.`
	);
}

function buildUpdateDescription(label: string, supportsSearch = true): string {
	const lookupHint = supportsSearch
		? `call this tool with operation 'getAll' and 'search' first to get the 'id'.`
		: `call this tool with operation 'getAll' and available filters to find the record and get the 'id'.`;
	return (
		`Update an existing ${label} record by numeric ID. ` +
		`PREREQUISITE: you need the numeric ID. If you only have a name or text, ${lookupHint} ` +
		`Confirm field values with user before executing when acting autonomously. ` +
		`Provide only the fields you want to change (PATCH semantics). Returns the updated record.`
	);
}

function buildDeleteDescription(label: string, supportsSearch = true): string {
	const confirmHint = supportsSearch
		? `call this tool with operation 'getAll' and 'search' if unsure.`
		: `call this tool with operation 'getAll' and available filters if unsure.`;
	return (
		`Permanently delete a ${label} record by numeric ID. ` +
		`ONLY execute on explicit user intent — do not infer from context. ` +
		`Confirm ID is correct before proceeding — ${confirmHint}`
	);
}

// Custom descriptions for non-CRUD operations
const CUSTOM_OPERATION_DESCRIPTIONS: Record<string, Record<string, string>> = {
	contact: {
		sendEmail:
			'Send a template email to a specific contact. Requires contact ID and email template ID. If unknown, use getAll on the respective resource first.',
		addToSegments:
			'Add a contact to one or more segments. Provide the contact ID and comma-separated segment IDs.',
		removeFromSegments:
			'Remove a contact from one or more segments. Provide the contact ID and comma-separated segment IDs.',
		addToCampaigns:
			'Add a contact to one or more campaigns. Provide the contact ID and comma-separated campaign IDs.',
		removeFromCampaigns:
			'Remove a contact from one or more campaigns. Provide the contact ID and comma-separated campaign IDs.',
	},
	segment: {
		addContact:
			'Add a single contact to this segment. Requires segment ID and contact ID.',
		removeContact:
			'Remove a single contact from this segment. Requires segment ID and contact ID.',
	},
	companyContact: {
		add: 'Associate a contact with a company. Requires company ID and contact ID.',
		remove: 'Remove association between a contact and a company. Requires company ID and contact ID.',
	},
	campaignContact: {
		add: 'Add a contact to a campaign. Requires campaign ID and contact ID.',
		remove: 'Remove a contact from a campaign. Requires campaign ID and contact ID.',
	},
	contactSegment: {
		add: 'Add a contact to a segment. Requires segment ID and contact ID.',
		remove: 'Remove a contact from a segment. Requires segment ID and contact ID.',
	},
	segmentEmail: {
		send: "Send a segment (list) email to all contacts in its assigned segments. Requires the email ID. The email must be of type 'list'.",
	},
};

export function buildUnifiedDescription(
	resourceLabel: string,
	resource: string,
	operations: string[],
	referenceUtc: string,
	supportsSearch: boolean,
): string {
	const enabledOps = Array.from(new Set(operations));
	const requiredFields = getRequiredFields(resource);

	const operationLines = enabledOps.map((operation) => {
		// Check for custom descriptions first
		const customDesc = CUSTOM_OPERATION_DESCRIPTIONS[resource]?.[operation];
		if (customDesc) {
			return `- ${operation}: ${customDesc}`;
		}

		switch (operation) {
			case 'get':
				return `- get: ${buildGetDescription(resourceLabel, supportsSearch)}`;
			case 'getAll':
				return `- getAll: ${buildGetAllDescription(resourceLabel, supportsSearch)}`;
			case 'create':
				return `- create: ${buildCreateDescription(resourceLabel, requiredFields)}`;
			case 'update':
				return `- update: ${buildUpdateDescription(resourceLabel, supportsSearch)}`;
			case 'delete':
				return `- delete: ${buildDeleteDescription(resourceLabel, supportsSearch)}`;
			default:
				return `- ${operation}: Operation available for this resource.`;
		}
	});

	return [
		`${dateTimeReferenceSnippet(referenceUtc)}Manage ${resourceLabel} records in Mautic.`,
		'Pass one of the following values in the required "operation" field:',
		...operationLines,
		'Prefer running getAll first to discover numeric IDs before get, update, or delete.',
	]
		.filter(Boolean)
		.join('\n');
}
