import { NodeOperationError } from 'n8n-workflow';
import type {
	NodeConnectionType,
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeType,
	INodeTypeDescription,
	INodePropertyOptions,
	INodeExecutionData,
	ISupplyDataFunctions,
	SupplyData,
} from 'n8n-workflow';
import { executeAiTool } from './ai-tools/tool-executor';
import { buildUnifiedDescription } from './ai-tools/description-builders';
import { getRuntimeSchemaBuilders } from './ai-tools/schema-generator';
import { RuntimeDynamicStructuredTool, runtimeZod } from './ai-tools/runtime';
import { wrapError, ERROR_TYPES } from './ai-tools/error-formatter';

const runtimeSchemas = getRuntimeSchemaBuilders(runtimeZod);

const OPERATION_LABELS: Record<string, string> = {
	get: 'Get by ID',
	getAll: 'Get many (with filters)',
	create: 'Create',
	update: 'Update',
	delete: 'Delete',
	sendEmail: 'Send email to contact',
	addToSegments: 'Add to segments',
	removeFromSegments: 'Remove from segments',
	addToCampaigns: 'Add to campaigns',
	removeFromCampaigns: 'Remove from campaigns',
	addContact: 'Add contact',
	removeContact: 'Remove contact',
	add: 'Add association',
	remove: 'Remove association',
	send: 'Send segment email',
};

const WRITE_OPERATIONS = [
	'create',
	'update',
	'delete',
	'sendEmail',
	'addToSegments',
	'removeFromSegments',
	'addToCampaigns',
	'removeFromCampaigns',
	'addContact',
	'removeContact',
	'add',
	'remove',
	'send',
];

const RESOURCE_OPERATIONS: Record<
	string,
	{ label: string; ops: string[] }
> = {
	contact: {
		label: 'Contact',
		ops: [
			'get',
			'getAll',
			'create',
			'update',
			'delete',
			'sendEmail',
			'addToSegments',
			'removeFromSegments',
			'addToCampaigns',
			'removeFromCampaigns',
		],
	},
	company: {
		label: 'Company',
		ops: ['get', 'getAll', 'create', 'update', 'delete'],
	},
	campaign: {
		label: 'Campaign',
		ops: ['get', 'getAll', 'create', 'update', 'delete'],
	},
	email: {
		label: 'Email',
		ops: ['get', 'getAll', 'create', 'update', 'delete'],
	},
	segment: {
		label: 'Segment',
		ops: ['get', 'getAll', 'create', 'update', 'delete', 'addContact', 'removeContact'],
	},
	tag: {
		label: 'Tag',
		ops: ['get', 'getAll', 'create', 'update', 'delete'],
	},
	note: {
		label: 'Note',
		ops: ['get', 'getAll', 'create', 'update', 'delete'],
	},
	category: {
		label: 'Category',
		ops: ['get', 'getAll', 'create', 'update', 'delete'],
	},
	field: {
		label: 'Field',
		ops: ['get', 'getAll'],
	},
	user: {
		label: 'User',
		ops: ['get', 'getAll'],
	},
	companyContact: {
		label: 'Company Contact',
		ops: ['add', 'remove'],
	},
	campaignContact: {
		label: 'Campaign Contact',
		ops: ['add', 'remove'],
	},
	contactSegment: {
		label: 'Contact Segment',
		ops: ['add', 'remove'],
	},
	segmentEmail: {
		label: 'Segment Email',
		ops: ['send'],
	},
};

const EXECUTE_METADATA_FIELDS = new Set([
	'resource',
	'operation',
	'tool',
	'toolName',
	'toolCallId',
	'sessionId',
	'action',
	'chatInput',
	// Named rule: "root field injection" — n8n canvas UUID
	'root',
]);

function getDefaultOperation(operations: string[]): string {
	if (operations.includes('getAll')) return 'getAll';
	if (operations.includes('get')) return 'get';
	return operations[0] ?? '';
}

function parseToolResult(resultJson: string): IDataObject {
	try {
		return JSON.parse(resultJson) as IDataObject;
	} catch {
		return { error: resultJson };
	}
}

function stripExecuteMetadata(params: Record<string, unknown>): Record<string, unknown> {
	const cleaned: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(params)) {
		if (!EXECUTE_METADATA_FIELDS.has(key)) cleaned[key] = value;
	}
	return cleaned;
}

export class MauticAdvancedAiTools implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mautic Advanced AI Tools',
		name: 'mauticAdvancedAiTools',
		icon: 'file:MauticAdvancedIcon.svg',
		group: ['output'],
		version: 1,
		description: 'Expose Mautic Advanced operations as AI tools for the AI Agent',
		defaults: { name: 'Mautic Advanced AI Tools' },
		inputs: [],
		outputs: [{ type: 'ai_tool' as NodeConnectionType, displayName: 'Tools' }],
		credentials: [
			{
				name: 'mauticAdvancedApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['credentials'],
					},
				},
			},
			{
				name: 'mauticAdvancedOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: ['oAuth2'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Credentials',
						value: 'credentials',
					},
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
				],
				default: 'credentials',
			},
			{
				displayName: 'Resource Name or ID',
				name: 'resource',
				type: 'options',
				required: true,
				noDataExpression: true,
				typeOptions: { loadOptionsMethod: 'getToolResources' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Operations Names or IDs',
				name: 'operations',
				type: 'multiOptions',
				required: true,
				typeOptions: {
					loadOptionsMethod: 'getToolResourceOperations',
					loadOptionsDependsOn: ['resource', 'allowWriteOperations'],
				},
				default: [],
				description:
					'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Allow Write Operations',
				name: 'allowWriteOperations',
				type: 'boolean',
				default: false,
				description:
					'Whether to enable mutating tools (create, update, delete, send, etc). Disabled = read-only.',
			},
		],
	};

	methods = {
		loadOptions: {
			async getToolResources(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				return Object.entries(RESOURCE_OPERATIONS)
					.map(([value, config]) => ({
						name: config.label,
						value,
						description: `${config.label} resource`,
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			},
			async getToolResourceOperations(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const resource = this.getCurrentNodeParameter('resource') as string;
				const allowWrite = (this.getCurrentNodeParameter('allowWriteOperations') ??
					false) as boolean;
				if (!resource) return [];
				const config = RESOURCE_OPERATIONS[resource];
				if (!config) return [];
				return config.ops
					.filter((op) => allowWrite || !WRITE_OPERATIONS.includes(op))
					.map((op) => ({
						name: OPERATION_LABELS[op] ?? op,
						value: op,
						description: `${op} operation for ${config.label}`,
					}));
			},
		},
	};

	async supplyData(
		this: ISupplyDataFunctions,
		itemIndex: number,
	): Promise<SupplyData> {
		const resource = this.getNodeParameter('resource', itemIndex) as string;
		const operations = this.getNodeParameter('operations', itemIndex) as string[];
		const allowWriteOperations = this.getNodeParameter(
			'allowWriteOperations',
			itemIndex,
			false,
		) as boolean;

		if (!resource)
			throw new NodeOperationError(this.getNode(), 'Resource is required');
		if (!operations?.length)
			throw new NodeOperationError(
				this.getNode(),
				'At least one operation must be selected',
			);

		const config = RESOURCE_OPERATIONS[resource];
		if (!config)
			throw new NodeOperationError(
				this.getNode(),
				`Unknown resource: ${resource}`,
			);

		// Layer 1 write safety — filter operations based on allowWriteOperations toggle
		const enabledOperations = operations.filter((op) => {
			if (WRITE_OPERATIONS.includes(op) && !allowWriteOperations) return false;
			return config.ops.includes(op);
		});

		if (enabledOperations.length === 0) {
			throw new NodeOperationError(
				this.getNode(),
				'No tools to expose. Select operations and enable "Allow Write Operations" if needed.',
			);
		}

		// Detect if resource supports search by checking the getAll schema
		const getAllSchema = runtimeSchemas.buildUnifiedSchema(resource, ['getAll']);
		const supportsSearch = 'search' in getAllSchema.shape;
		const referenceUtc = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

		const unifiedSchema = runtimeSchemas.buildUnifiedSchema(
			resource,
			enabledOperations,
		);
		const unifiedDescription = buildUnifiedDescription(
			config.label,
			resource,
			enabledOperations,
			referenceUtc,
			supportsSearch,
		);

		// Tool name must match ^[a-zA-Z0-9_-]{1,128}$ — no spaces, ASCII only, unique per node
		const toolName = `mauticadvanced_${resource}`;

		const unifiedTool = new RuntimeDynamicStructuredTool({
			name: toolName,
			description: unifiedDescription,
			schema: unifiedSchema as any,
			func: async (params: Record<string, unknown>) => {
				const operationFromArgs = params.operation;
				const operation =
					typeof operationFromArgs === 'string' ? operationFromArgs : undefined;

				// Layer 2 write safety — re-check after schema parsing (defense-in-depth)
				if (
					operation &&
					WRITE_OPERATIONS.includes(operation) &&
					!allowWriteOperations
				) {
					return JSON.stringify(
						wrapError(
							resource,
							operation,
							ERROR_TYPES.WRITE_OPERATION_BLOCKED,
							'Write operations are disabled for this tool.',
							'Enable allowWriteOperations on the MauticAdvancedAiTools node to use mutating operations.',
						),
					);
				}
				if (!operation || !enabledOperations.includes(operation)) {
					return JSON.stringify(
						wrapError(
							resource,
							(operationFromArgs as string) ?? 'unknown',
							ERROR_TYPES.INVALID_OPERATION,
							'Missing or unsupported operation for this tool call.',
							`Allowed operations: ${enabledOperations.join(', ')}.`,
						),
					);
				}
				const { operation: _operation, ...operationParams } = params;
				return executeAiTool(
					this,
					resource,
					operation,
					operationParams,
					enabledOperations,
				);
			},
		});

		return { response: unifiedTool };
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as string;
		const operations = this.getNodeParameter('operations', 0) as string[];
		const allowWriteOperations = this.getNodeParameter(
			'allowWriteOperations',
			0,
			false,
		) as boolean;

		if (!resource || !operations?.length) {
			throw new NodeOperationError(
				this.getNode(),
				'Resource and at least one operation must be configured.',
			);
		}

		const config = RESOURCE_OPERATIONS[resource];
		if (!config)
			throw new NodeOperationError(
				this.getNode(),
				`Unknown resource: ${resource}`,
			);

		const effectiveOps = operations.filter(
			(op) => !WRITE_OPERATIONS.includes(op) || allowWriteOperations,
		);
		if (effectiveOps.length === 0) {
			throw new NodeOperationError(
				this.getNode(),
				'No permitted operations. Enable "Allow Write Operations" if needed.',
			);
		}

		const items = this.getInputData();
		const response: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const item = items[itemIndex];
			if (!item) continue;

			const requestedOp = item.json.operation as string | undefined;

			// Layer 3 write safety — execute() path
			if (
				requestedOp &&
				WRITE_OPERATIONS.includes(requestedOp) &&
				!allowWriteOperations
			) {
				response.push({
					json: parseToolResult(
						JSON.stringify(
							wrapError(
								resource,
								requestedOp,
								ERROR_TYPES.WRITE_OPERATION_BLOCKED,
								'Write operations are disabled.',
								'Enable allowWriteOperations on this node to use mutating operations.',
							),
						),
					),
					pairedItem: { item: itemIndex },
				});
				continue;
			}
			const effectiveOp =
				requestedOp && effectiveOps.includes(requestedOp)
					? requestedOp
					: getDefaultOperation(effectiveOps);

			try {
				const params = stripExecuteMetadata(
					item.json as Record<string, unknown>,
				);
				const resultJson = await executeAiTool(
					this as unknown as ISupplyDataFunctions,
					resource,
					effectiveOp,
					params,
					effectiveOps,
				);
				response.push({
					json: parseToolResult(resultJson),
					pairedItem: { item: itemIndex },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					response.push({
						json: { error: error instanceof Error ? error.message : String(error) },
						pairedItem: { item: itemIndex },
					});
					continue;
				}
				throw new NodeOperationError(
					this.getNode(),
					error instanceof Error ? error.message : String(error),
					{ itemIndex },
				);
			}
		}

		return [response];
	}
}
