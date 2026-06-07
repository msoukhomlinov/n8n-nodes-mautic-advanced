export class NodeApiError extends Error {
  constructor(_node?: unknown, error?: unknown) {
    super(error instanceof Error ? error.message : 'Node API error');
  }
}

export class NodeOperationError extends Error {
  constructor(_node?: unknown, message?: string) {
    super(message || 'Node operation error');
  }
}
