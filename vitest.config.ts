import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'n8n-workflow': resolve(__dirname, 'test/stubs/n8n-workflow.ts'),
    },
  },
});
