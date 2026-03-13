// nodes/MauticAdvanced/ai-tools/schema-generator.ts
// NOTE: z is a compile-time VALUE import — we need z.object(), z.string() etc. at build time.
// Only runtime classes (DynamicStructuredTool, ZodType) come from runtime.ts.
import { z } from 'zod';
import type { RuntimeZod } from './runtime';

// ---------------------------------------------------------------------------
// Shared field schemas
// ---------------------------------------------------------------------------

const idSchema = z
	.number()
	.int()
	.positive()
	.describe('Numeric record ID (from a prior getAll result). Must be an integer.');

const limitSchema = z
	.number()
	.int()
	.min(1)
	.max(100)
	.optional()
	.default(25)
	.describe(
		'Maximum records to return (default 25, max 100). Increase to 100 if you expect many matching records.',
	);

const contactIdSchema = z
	.number()
	.int()
	.positive()
	.describe(
		"Numeric contact ID. If unknown, call mauticadvanced_contact with operation 'getAll' and 'search' to find the contact and get its id.",
	);

const segmentIdSchema = z
	.number()
	.int()
	.positive()
	.describe(
		"Numeric segment ID. If unknown, call mauticadvanced_segment with operation 'getAll' and 'search' to find the segment and get its id.",
	);

const campaignIdSchema = z
	.number()
	.int()
	.positive()
	.describe(
		"Numeric campaign ID. If unknown, call mauticadvanced_campaign with operation 'getAll' and 'search' to find the campaign and get its id.",
	);

const companyIdSchema = z
	.number()
	.int()
	.positive()
	.describe(
		"Numeric company ID. If unknown, call mauticadvanced_company with operation 'getAll' and 'search' to find the company and get its id.",
	);

const emailIdSchema = z
	.number()
	.int()
	.positive()
	.describe(
		"Numeric email ID. If unknown, call mauticadvanced_email with operation 'getAll' and 'search' to find the email and get its id.",
	);

// ---------------------------------------------------------------------------
// Operation labels
// ---------------------------------------------------------------------------

const OPERATION_LABELS: Record<string, string> = {
	get: 'Get by ID',
	getAll: 'Get many',
	create: 'Create',
	update: 'Update',
	delete: 'Delete',
	sendEmail: 'Send email to contact',
	addToSegments: 'Add contact to segments',
	removeFromSegments: 'Remove contact from segments',
	addToCampaigns: 'Add contact to campaigns',
	removeFromCampaigns: 'Remove contact from campaigns',
	addContact: 'Add contact',
	removeContact: 'Remove contact',
	add: 'Add association',
	remove: 'Remove association',
	send: 'Send segment email',
};

function isValidOperation(op: string): boolean {
	return op in OPERATION_LABELS;
}

// ---------------------------------------------------------------------------
// Per-resource getAll schemas — search MUST precede name in property order
// ---------------------------------------------------------------------------

function getContactGetAllSchema() {
	return z.object({
		search: z
			.string()
			.optional()
			.describe(
				'Partial text match across contact fields (name, email, company, etc). ALWAYS use this first for any text lookup.',
			),
		limit: limitSchema,
	});
}

function getCompanyGetAllSchema() {
	return z.object({
		search: z
			.string()
			.optional()
			.describe(
				'Partial text match across company name, city, phone, website. ALWAYS use this first for any name or text lookup.',
			),
		limit: limitSchema,
	});
}

function getCampaignGetAllSchema() {
	return z.object({
		search: z
			.string()
			.optional()
			.describe(
				'Partial text match across campaign name and description. ALWAYS use this first for any name or text lookup.',
			),
		limit: limitSchema,
	});
}

function getEmailGetAllSchema() {
	return z.object({
		search: z
			.string()
			.optional()
			.describe(
				'Partial text match across email name and subject. ALWAYS use this first for any name or text lookup.',
			),
		limit: limitSchema,
	});
}

function getSegmentGetAllSchema() {
	return z.object({
		search: z
			.string()
			.optional()
			.describe(
				'Partial text match across segment name. ALWAYS use this first for any name or text lookup.',
			),
		limit: limitSchema,
	});
}

function getTagGetAllSchema() {
	return z.object({
		search: z
			.string()
			.optional()
			.describe(
				'Partial text match across tag name. ALWAYS use this first for any name or text lookup.',
			),
		limit: limitSchema,
	});
}

function getNoteGetAllSchema() {
	return z.object({
		search: z
			.string()
			.optional()
			.describe('Partial text match across note content. ALWAYS use this first for any text lookup.'),
		limit: limitSchema,
	});
}

function getCategoryGetAllSchema() {
	return z.object({
		search: z
			.string()
			.optional()
			.describe(
				'Partial text match across category title. ALWAYS use this first for any name or text lookup.',
			),
		limit: limitSchema,
	});
}

function getFieldGetAllSchema() {
	return z.object({
		fieldObject: z
			.enum(['contact', 'company'])
			.describe("Type of field to list: 'contact' for contact fields, 'company' for company fields."),
		limit: limitSchema,
	});
}

function getUserGetAllSchema() {
	return z.object({
		search: z
			.string()
			.optional()
			.describe(
				'Partial text match across username, name, email. ALWAYS use this first for any text lookup.',
			),
		limit: limitSchema,
	});
}

// ---------------------------------------------------------------------------
// Per-resource create schemas
// ---------------------------------------------------------------------------

function getContactCreateSchema() {
	return z.object({
		email: z.string().describe('Email address for the contact (recommended for identification).'),
		firstname: z.string().optional().describe('First name of the contact.'),
		lastname: z.string().optional().describe('Last name of the contact.'),
		company: z.string().optional().describe('Company name for the contact.'),
		position: z.string().optional().describe('Job position/title of the contact.'),
		title: z.string().optional().describe("Contact's title (Mr, Mrs, etc)."),
		phone: z.string().optional().describe('Phone number.'),
		mobile: z.string().optional().describe('Mobile phone number.'),
		address1: z.string().optional().describe('Street address line 1.'),
		address2: z.string().optional().describe('Street address line 2.'),
		city: z.string().optional().describe('City.'),
		state: z.string().optional().describe('State/province.'),
		country: z.string().optional().describe('Country.'),
		zipcode: z.string().optional().describe('Postal/zip code.'),
		preferred_locale: z.string().optional().describe('Preferred locale (e.g., en_US).'),
		timezone: z.string().optional().describe('Timezone (e.g., America/New_York).'),
		owner_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe(
				"Numeric user ID for the contact owner. If unknown, call mauticadvanced_user with operation 'getAll' and 'search' to find the user.",
			),
		tags: z
			.string()
			.optional()
			.describe('Comma-separated list of tags to apply to the contact.'),
		customFields: z
			.string()
			.optional()
			.describe(
				'JSON object of custom field alias→value pairs (e.g., {"custom_field_alias": "value"}). Use mauticadvanced_field with operation getAll to discover field aliases.',
			),
	});
}

function getContactUpdateSchema() {
	return z.object({
		id: idSchema,
		email: z.string().optional().describe('Email address.'),
		firstname: z.string().optional().describe('First name.'),
		lastname: z.string().optional().describe('Last name.'),
		company: z.string().optional().describe('Company name.'),
		position: z.string().optional().describe('Job position.'),
		title: z.string().optional().describe('Title (Mr, Mrs, etc).'),
		phone: z.string().optional().describe('Phone number.'),
		mobile: z.string().optional().describe('Mobile phone number.'),
		address1: z.string().optional().describe('Street address line 1.'),
		address2: z.string().optional().describe('Street address line 2.'),
		city: z.string().optional().describe('City.'),
		state: z.string().optional().describe('State/province.'),
		country: z.string().optional().describe('Country.'),
		zipcode: z.string().optional().describe('Postal/zip code.'),
		owner_id: z.number().int().positive().optional().describe('Numeric user ID for owner.'),
		tags: z.string().optional().describe('Comma-separated list of tags.'),
		customFields: z
			.string()
			.optional()
			.describe('JSON object of custom field alias→value pairs.'),
	});
}

function getContactSendEmailSchema() {
	return z.object({
		id: contactIdSchema.describe(
			"Numeric contact ID to send email to. If unknown, call mauticadvanced_contact with operation 'getAll' and 'search' to find the contact.",
		),
		emailId: emailIdSchema.describe(
			"Numeric email template ID to send. If unknown, call mauticadvanced_email with operation 'getAll' and 'search' to find the email.",
		),
	});
}

function getContactSegmentBatchSchema() {
	return z.object({
		id: contactIdSchema.describe('Numeric contact ID.'),
		segmentIds: z
			.string()
			.describe(
				"Comma-separated segment IDs (e.g., '1,2,3'). If unknown, call mauticadvanced_segment with operation 'getAll' to find segment IDs.",
			),
	});
}

function getContactCampaignBatchSchema() {
	return z.object({
		id: contactIdSchema.describe('Numeric contact ID.'),
		campaignIds: z
			.string()
			.describe(
				"Comma-separated campaign IDs (e.g., '1,2,3'). If unknown, call mauticadvanced_campaign with operation 'getAll' to find campaign IDs.",
			),
	});
}

function getCompanyCreateSchema() {
	return z.object({
		companyname: z.string().describe('Company name (required).'),
		companyemail: z.string().optional().describe('Company email address.'),
		companyphone: z.string().optional().describe('Company phone number.'),
		companywebsite: z.string().optional().describe('Company website URL.'),
		companyindustry: z.string().optional().describe('Industry sector.'),
		companycity: z.string().optional().describe('City.'),
		companystate: z.string().optional().describe('State/province.'),
		companycountry: z.string().optional().describe('Country.'),
		companydescription: z.string().optional().describe('Company description.'),
	});
}

function getCompanyUpdateSchema() {
	return z.object({
		id: idSchema,
		companyname: z.string().optional().describe('Company name.'),
		companyemail: z.string().optional().describe('Company email address.'),
		companyphone: z.string().optional().describe('Company phone number.'),
		companywebsite: z.string().optional().describe('Company website URL.'),
		companyindustry: z.string().optional().describe('Industry sector.'),
		companycity: z.string().optional().describe('City.'),
		companystate: z.string().optional().describe('State/province.'),
		companycountry: z.string().optional().describe('Country.'),
		companydescription: z.string().optional().describe('Company description.'),
	});
}

function getCampaignCreateSchema() {
	return z.object({
		name: z.string().describe('Campaign name (required).'),
		description: z.string().optional().describe('Campaign description.'),
		isPublished: z.boolean().optional().describe('Whether the campaign is published.'),
	});
}

function getCampaignUpdateSchema() {
	return z.object({
		id: idSchema,
		name: z.string().optional().describe('Campaign name.'),
		description: z.string().optional().describe('Campaign description.'),
		isPublished: z.boolean().optional().describe('Whether the campaign is published.'),
	});
}

function getEmailCreateSchema() {
	return z.object({
		name: z.string().describe('Internal email name (required).'),
		subject: z.string().describe('Email subject line (required).'),
		customHtml: z.string().optional().describe('HTML content of the email body.'),
		emailType: z
			.enum(['template', 'list'])
			.optional()
			.describe(
				"Email type: 'template' for campaign/transactional emails, 'list' for segment broadcast emails.",
			),
		fromAddress: z.string().optional().describe('Sender email address.'),
		fromName: z.string().optional().describe('Sender display name.'),
		isPublished: z.boolean().optional().describe('Whether the email is published.'),
	});
}

function getEmailUpdateSchema() {
	return z.object({
		id: idSchema,
		name: z.string().optional().describe('Internal email name.'),
		subject: z.string().optional().describe('Email subject line.'),
		customHtml: z.string().optional().describe('HTML content of the email body.'),
		emailType: z
			.enum(['template', 'list'])
			.optional()
			.describe("Email type: 'template' or 'list'."),
		fromAddress: z.string().optional().describe('Sender email address.'),
		fromName: z.string().optional().describe('Sender display name.'),
		isPublished: z.boolean().optional().describe('Whether the email is published.'),
	});
}

function getSegmentCreateSchema() {
	return z.object({
		name: z.string().describe('Segment name (required).'),
		description: z.string().optional().describe('Segment description.'),
		isPublished: z.boolean().optional().describe('Whether the segment is published.'),
		isGlobal: z.boolean().optional().describe('Whether the segment is global (visible to all users).'),
	});
}

function getSegmentUpdateSchema() {
	return z.object({
		id: idSchema,
		name: z.string().optional().describe('Segment name.'),
		description: z.string().optional().describe('Segment description.'),
		isPublished: z.boolean().optional().describe('Whether the segment is published.'),
	});
}

function getSegmentContactSchema() {
	return z.object({
		id: segmentIdSchema.describe('Numeric segment ID.'),
		contactId: contactIdSchema.describe('Numeric contact ID to add/remove.'),
	});
}

function getTagCreateSchema() {
	return z.object({
		tag: z.string().describe('Tag name (required).'),
	});
}

function getTagUpdateSchema() {
	return z.object({
		id: idSchema,
		tag: z.string().optional().describe('New tag name.'),
	});
}

function getNoteCreateSchema() {
	return z.object({
		text: z.string().describe('Note content text (required).'),
		lead: contactIdSchema.describe('Numeric contact ID the note belongs to (required).'),
		type: z
			.enum(['general', 'email', 'call', 'meeting'])
			.optional()
			.describe(
				"Note type: 'general' (default), 'email', 'call', or 'meeting'.",
			),
		datetime: z.string().optional().describe('Date/time for the note (ISO 8601 format).'),
	});
}

function getNoteUpdateSchema() {
	return z.object({
		id: idSchema,
		text: z.string().optional().describe('Note content text.'),
		type: z
			.enum(['general', 'email', 'call', 'meeting'])
			.optional()
			.describe("Note type: 'general', 'email', 'call', or 'meeting'."),
		datetime: z.string().optional().describe('Date/time for the note (ISO 8601 format).'),
	});
}

function getCategoryCreateSchema() {
	return z.object({
		title: z.string().describe('Category title (required).'),
		bundle: z
			.enum(['asset', 'campaign', 'email', 'form', 'global', 'page', 'point', 'stage'])
			.describe('Category bundle type (required). Determines which Mautic module this category belongs to.'),
		description: z.string().optional().describe('Category description.'),
		color: z.string().optional().describe('Hex color code without # prefix (e.g., "b36262").'),
	});
}

function getCategoryUpdateSchema() {
	return z.object({
		id: idSchema,
		title: z.string().optional().describe('Category title.'),
		bundle: z
			.enum(['asset', 'campaign', 'email', 'form', 'global', 'page', 'point', 'stage'])
			.optional()
			.describe('Category bundle type.'),
		description: z.string().optional().describe('Category description.'),
		color: z.string().optional().describe('Hex color code without # prefix.'),
	});
}

function getFieldGetSchema() {
	return z.object({
		id: idSchema,
		fieldObject: z
			.enum(['contact', 'company'])
			.describe("Type of field: 'contact' or 'company'."),
	});
}

function getCompanyContactSchema() {
	return z.object({
		companyId: companyIdSchema.describe('Numeric company ID.'),
		contactId: contactIdSchema.describe('Numeric contact ID.'),
	});
}

function getCampaignContactSchema() {
	return z.object({
		campaignId: campaignIdSchema.describe('Numeric campaign ID.'),
		contactId: contactIdSchema.describe('Numeric contact ID.'),
	});
}

function getContactSegmentSchema() {
	return z.object({
		segmentId: segmentIdSchema.describe('Numeric segment ID.'),
		contactId: contactIdSchema.describe('Numeric contact ID.'),
	});
}

function getSegmentEmailSendSchema() {
	return z.object({
		emailId: emailIdSchema.describe(
			"Numeric segment (list) email ID. If unknown, call mauticadvanced_email with operation 'getAll' and 'search' to find the email. Must be of type 'list'.",
		),
	});
}

// ---------------------------------------------------------------------------
// Schema dispatchers
// ---------------------------------------------------------------------------

function getGetAllSchemaForResource(resource: string): z.ZodObject<z.ZodRawShape> {
	switch (resource) {
		case 'contact':
			return getContactGetAllSchema();
		case 'company':
			return getCompanyGetAllSchema();
		case 'campaign':
			return getCampaignGetAllSchema();
		case 'email':
			return getEmailGetAllSchema();
		case 'segment':
			return getSegmentGetAllSchema();
		case 'tag':
			return getTagGetAllSchema();
		case 'note':
			return getNoteGetAllSchema();
		case 'category':
			return getCategoryGetAllSchema();
		case 'field':
			return getFieldGetAllSchema();
		case 'user':
			return getUserGetAllSchema();
		default:
			return z.object({ limit: limitSchema });
	}
}

function getCreateSchemaForResource(resource: string): z.ZodObject<z.ZodRawShape> {
	switch (resource) {
		case 'contact':
			return getContactCreateSchema();
		case 'company':
			return getCompanyCreateSchema();
		case 'campaign':
			return getCampaignCreateSchema();
		case 'email':
			return getEmailCreateSchema();
		case 'segment':
			return getSegmentCreateSchema();
		case 'tag':
			return getTagCreateSchema();
		case 'note':
			return getNoteCreateSchema();
		case 'category':
			return getCategoryCreateSchema();
		default:
			return z.object({});
	}
}

function getUpdateSchemaForResource(resource: string): z.ZodObject<z.ZodRawShape> {
	switch (resource) {
		case 'contact':
			return getContactUpdateSchema();
		case 'company':
			return getCompanyUpdateSchema();
		case 'campaign':
			return getCampaignUpdateSchema();
		case 'email':
			return getEmailUpdateSchema();
		case 'segment':
			return getSegmentUpdateSchema();
		case 'tag':
			return getTagUpdateSchema();
		case 'note':
			return getNoteUpdateSchema();
		case 'category':
			return getCategoryUpdateSchema();
		default:
			return z.object({ id: idSchema });
	}
}

function getSchemaForOperation(
	resource: string,
	operation: string,
): z.ZodObject<z.ZodRawShape> {
	switch (operation) {
		case 'get':
			if (resource === 'field') return getFieldGetSchema();
			return z.object({ id: idSchema });
		case 'getAll':
			return getGetAllSchemaForResource(resource);
		case 'create':
			return getCreateSchemaForResource(resource);
		case 'update':
			return getUpdateSchemaForResource(resource);
		case 'delete':
			return z.object({ id: idSchema });
		case 'sendEmail':
			return getContactSendEmailSchema();
		case 'addToSegments':
		case 'removeFromSegments':
			return getContactSegmentBatchSchema();
		case 'addToCampaigns':
		case 'removeFromCampaigns':
			return getContactCampaignBatchSchema();
		case 'addContact':
		case 'removeContact':
			if (resource === 'segment') return getSegmentContactSchema();
			return z.object({});
		case 'add':
		case 'remove':
			if (resource === 'companyContact') return getCompanyContactSchema();
			if (resource === 'campaignContact') return getCampaignContactSchema();
			if (resource === 'contactSegment') return getContactSegmentSchema();
			return z.object({});
		case 'send':
			return getSegmentEmailSendSchema();
		default:
			return z.object({ id: idSchema });
	}
}

// ---------------------------------------------------------------------------
// buildUnifiedSchema()
// ---------------------------------------------------------------------------

export function buildUnifiedSchema(
	resource: string,
	operations: string[],
): z.ZodObject<z.ZodRawShape> {
	const enabledOps = Array.from(new Set(operations.filter(isValidOperation)));

	if (enabledOps.length === 0) {
		return z.object({ operation: z.string().describe('Operation to perform') });
	}

	const operationEnum = z
		.enum(enabledOps as [string, ...string[]])
		.describe(`Operation to perform. Allowed values: ${enabledOps.join(', ')}.`);

	const fieldSources = new Map<string, z.ZodTypeAny>();
	const fieldOps = new Map<string, Set<string>>();

	for (const operation of enabledOps) {
		const schema = getSchemaForOperation(resource, operation);
		for (const [field, fieldSchema] of Object.entries(schema.shape)) {
			if (!fieldSources.has(field)) fieldSources.set(field, fieldSchema as z.ZodTypeAny);
			if (!fieldOps.has(field)) fieldOps.set(field, new Set<string>());
			fieldOps.get(field)?.add(operation);
		}
	}

	const mergedShape: Record<string, z.ZodTypeAny> = { operation: operationEnum };

	for (const [field, fieldSchema] of fieldSources.entries()) {
		const opsForField = Array.from(fieldOps.get(field) ?? []);
		const baseDescription = fieldSchema.description ?? '';
		const opsDescription = `Used by operations: ${opsForField.map((op) => OPERATION_LABELS[op] ?? op).join(', ')}.`;
		const description = baseDescription ? `${baseDescription} ${opsDescription}` : opsDescription;
		mergedShape[field] = fieldSchema.optional().describe(description);
	}

	return z.object(mergedShape);
}

// ---------------------------------------------------------------------------
// Runtime Zod conversion — converts compile-time Zod schemas to runtime Zod
// ---------------------------------------------------------------------------

function toRuntimeZodSchema(schema: any, runtimeZ: RuntimeZod): any {
	const def = schema?._def as any;
	const typeName = def?.typeName as string | undefined;
	let converted: unknown;

	switch (typeName) {
		case 'ZodString': {
			let s = runtimeZ.string();
			for (const check of def.checks ?? []) {
				switch (check.kind) {
					case 'min':
						s = s.min(check.value);
						break;
					case 'max':
						s = s.max(check.value);
						break;
					case 'email':
						s = s.email();
						break;
					case 'url':
						s = s.url();
						break;
					case 'uuid':
						s = s.uuid();
						break;
					default:
						break;
				}
			}
			converted = s;
			break;
		}
		case 'ZodNumber': {
			let n = runtimeZ.number();
			for (const check of def.checks ?? []) {
				switch (check.kind) {
					case 'int':
						n = n.int();
						break;
					case 'min':
						n = check.inclusive === false ? n.gt(check.value) : n.min(check.value);
						break;
					case 'max':
						n = check.inclusive === false ? n.lt(check.value) : n.max(check.value);
						break;
					default:
						break;
				}
			}
			converted = n;
			break;
		}
		case 'ZodBoolean':
			converted = runtimeZ.boolean();
			break;
		case 'ZodUnknown':
			converted = runtimeZ.unknown();
			break;
		case 'ZodArray':
			converted = runtimeZ.array(toRuntimeZodSchema(def.type, runtimeZ));
			break;
		case 'ZodEnum':
			converted = runtimeZ.enum(def.values as [string, ...string[]]);
			break;
		case 'ZodRecord':
			converted = runtimeZ.record(toRuntimeZodSchema(def.valueType, runtimeZ));
			break;
		case 'ZodObject': {
			const shape = typeof def.shape === 'function' ? def.shape() : def.shape;
			const runtimeShape: Record<string, any> = {};
			for (const [key, value] of Object.entries(shape ?? {})) {
				runtimeShape[key] = toRuntimeZodSchema(value, runtimeZ);
			}
			let obj: any = runtimeZ.object(runtimeShape);
			if (def.unknownKeys === 'passthrough') obj = obj.passthrough();
			if (def.unknownKeys === 'strict') obj = obj.strict();
			converted = obj;
			break;
		}
		case 'ZodOptional':
			converted = toRuntimeZodSchema(def.innerType, runtimeZ).optional();
			break;
		case 'ZodNullable':
			converted = toRuntimeZodSchema(def.innerType, runtimeZ).nullable();
			break;
		case 'ZodDefault':
			converted = toRuntimeZodSchema(def.innerType, runtimeZ).default(def.defaultValue());
			break;
		case 'ZodLiteral':
			converted = runtimeZ.literal(def.value);
			break;
		case 'ZodUnion':
			converted = runtimeZ.union(
				(def.options ?? []).map((o: unknown) => toRuntimeZodSchema(o, runtimeZ)) as [any, any, ...any[]],
			);
			break;
		default:
			converted = runtimeZ.unknown();
			break;
	}

	const description = typeof schema?.description === 'string' ? schema.description : undefined;
	if (description && typeof (converted as any).describe === 'function') {
		return (converted as any).describe(description);
	}
	return converted;
}

function withRuntimeZod<T>(schemaBuilder: () => T, runtimeZ: RuntimeZod): T {
	return toRuntimeZodSchema(schemaBuilder(), runtimeZ) as any;
}

export function getRuntimeSchemaBuilders(runtimeZ: RuntimeZod) {
	return {
		buildUnifiedSchema: (resource: string, operations: string[]) =>
			withRuntimeZod(() => buildUnifiedSchema(resource, operations), runtimeZ),
	};
}
