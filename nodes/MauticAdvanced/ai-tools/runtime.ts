// nodes/MauticAdvanced/ai-tools/runtime.ts
import { createRequire } from 'module';
import type { z as ZodNamespace } from 'zod';

type DynamicStructuredToolCtor = new (fields: {
  name: string;
  description: string;
  schema: any;
  func: (params: Record<string, unknown>) => Promise<string>;
}) => any;

export type RuntimeZod = typeof ZodNamespace;

/**
 * Runtime resolution of `zod` and `@langchain/core`'s DynamicStructuredTool.
 *
 * IMPORTANT: resolution must NEVER run at module-import time. n8n's
 * node-directory-loader requires every node file in this package (including
 * this one) purely to register node metadata, long before any workflow
 * executes — and it aborts loading the ENTIRE package if any one file throws
 * while being required. Doing filesystem resolution here at import time is
 * exactly what took down the plain, non-AI `mauticAdvanced` node and its
 * trigger under pnpm-strict-isolated installs (issue #2). Resolution is
 * therefore deferred to first actual use inside the Proxy traps below, which
 * only fire when a connected AI tool is invoked at workflow-execution time.
 *
 * By execution time n8n's own Agent/MCP Trigger machinery has already loaded
 * `@n8n/n8n-nodes-langchain` (and therefore zod and @langchain/core) into the
 * process-global require.cache. We resolve the SAME module identity n8n uses —
 * the copy its `normalizeToolSchema` runs `instanceof ZodType` / `instanceof
 * ZodType`-style checks against — by two strategies, in order:
 *
 *   1. `require.main` — n8n's own entry point. For a correctly-installed
 *      (non-isolated) host this lands on n8n's top-level copies directly.
 *      Guarded for `require.main` being undefined (ESM launch, worker_threads /
 *      queue-mode workers). We do NOT fall back to `__filename`: anchoring at
 *      this file would resolve THIS package's own bundled copy, which is the
 *      wrong module identity and fails n8n's `instanceof` checks silently.
 *
 *   2. An n8n-owned-tree anchor — a module already resident in require.cache
 *      whose path belongs to a package only n8n owns and community nodes never
 *      bundle. We `createRequire()` the dependency FROM that module's path, so
 *      the resolved copy is tied to n8n's tree by identity — independent of
 *      cache iteration order and of pnpm virtual-store path naming.
 *
 * If neither strategy resolves, we FAIL CLEAN (throw a diagnostic). We do NOT
 * scan require.cache for a bare `zod` / `@langchain/core` and guess which copy
 * is n8n's: under pnpm strict-isolated installs the cache key is the flat
 * virtual-store realpath (`.../.pnpm/zod@3.x.x/node_modules/zod/...`) which does
 * not encode the dependent package, so another installed community node's
 * bundled copy can win the scan and yield a wrong-instance `ZodType` that
 * n8n's `instanceof` check drops silently (issue #4). Returning nothing and
 * throwing is safer than returning a possibly-wrong copy.
 */

// n8n-owned anchor packages, in priority order. `@n8n/n8n-nodes-langchain` is
// always loaded at execution time and is the code that runs the instanceof
// checks, so resolving from it guarantees identical module identity.
const N8N_ANCHOR_PACKAGES = [
  { name: '@n8n/n8n-nodes-langchain', pattern: /[\\/]@n8n[\\/]n8n-nodes-langchain[\\/]/ },
  { name: '@langchain/classic', pattern: /[\\/]@langchain[\\/]classic[\\/]/ },
  { name: 'n8n-workflow', pattern: /[\\/]n8n-workflow[\\/]/ },
  { name: 'n8n-core', pattern: /[\\/]n8n-core[\\/]/ },
] as const;

let _anchorDiagnostic: string | null = null;

/**
 * Yields a createRequire() for EACH n8n-owned anchor package currently resident
 * in Node's process-global module cache, in the priority order of
 * N8N_ANCHOR_PACKAGES. Must be called lazily (not at module load) — n8n requires
 * node files for registration before any workflow runs, i.e. before the anchor
 * packages are necessarily resident in cache.
 *
 * IMPORTANT: this yields ALL available anchors rather than memoizing the first
 * one found. Different anchors resolve different dependencies: `n8n-workflow` /
 * `n8n-core` are imported by this package at registration time, so they are
 * resident FIRST — but they can resolve `zod` and NOT `@langchain/core/tools`.
 * Memoizing `n8n-workflow` as THE anchor would permanently starve
 * DynamicStructuredTool resolution even after `@langchain/*` later loads. So the
 * caller tries each anchor against the actual dependency and memoizes only at
 * the dependency level (on success). Re-scanning the cache each unresolved call
 * is cheap and only happens until the dependency resolves.
 */
function* iterN8nAnchorRequires(): Generator<{ req: NodeRequire; source: string }> {
  let cache: NodeJS.Dict<NodeModule> | undefined;
  try {
    // require.cache is the documented CommonJS alias for Module._cache, available
    // directly in CJS module scope (this file compiles to CJS via tsc).
    cache = require.cache;
  } catch (_e) {
    // best-effort — require.cache introspection is not guaranteed across Node versions
    cache = undefined;
  }
  if (!cache) {
    _anchorDiagnostic = 'require.cache unavailable';
    return;
  }

  const keys = Object.keys(cache);
  const available: string[] = [];
  for (const anchor of N8N_ANCHOR_PACKAGES) {
    const key = keys.find((k) => anchor.pattern.test(k));
    if (!key) continue;
    try {
      const req = createRequire(key);
      available.push(anchor.name);
      yield { req, source: `anchor ${anchor.name}` };
    } catch (_e) {
      // createRequire failed for this anchor — try the next
    }
  }

  _anchorDiagnostic = available.length
    ? `anchors available: ${available.join(', ')}`
    : `no n8n-owned anchor resident in require.cache (tried ${N8N_ANCHOR_PACKAGES.map(
        (a) => a.name,
      ).join(', ')})`;
}

/**
 * Yields candidate requires in resolution priority order: require.main first
 * (guarded for undefined), then EACH n8n-owned-tree anchor. Symmetric for every
 * dependency — no bare-cache scan, no self-exclusion. The caller must try the
 * requested dependency against each yielded require and stop at the first that
 * loads it.
 */
function* candidateRequires(): Generator<{ req: NodeRequire; source: string }> {
  if (require.main?.filename) {
    try {
      yield { req: createRequire(require.main.filename), source: 'require.main' };
    } catch (_e) {
      // require.main resolution unavailable — fall through to anchors
    }
  }
  yield* iterN8nAnchorRequires();
}

let _RuntimeDynamicStructuredTool: DynamicStructuredToolCtor | undefined;
let _runtimeZod: RuntimeZod | undefined;
let _langchainLoadError: string | null = null;
let _langchainDiagnostic: string | null = null;
let _zodLoadError: string | null = null;
let _zodDiagnostic: string | null = null;

function resolveDynamicStructuredTool(): DynamicStructuredToolCtor | undefined {
  if (_RuntimeDynamicStructuredTool) return _RuntimeDynamicStructuredTool;

  const attempts: string[] = [];
  for (const { req, source } of candidateRequires()) {
    try {
      const coreTools = req('@langchain/core/tools') as Record<string, unknown>;
      if (typeof coreTools?.['DynamicStructuredTool'] === 'function') {
        _RuntimeDynamicStructuredTool = coreTools[
          'DynamicStructuredTool'
        ] as DynamicStructuredToolCtor;
        _langchainDiagnostic = `resolved DynamicStructuredTool via ${source}`;
        _langchainLoadError = null;
        return _RuntimeDynamicStructuredTool;
      }
      attempts.push(`${source}: @langchain/core/tools lacked DynamicStructuredTool`);
    } catch (e) {
      attempts.push(`${source}: ${(e as Error).message}`);
    }
  }

  _langchainLoadError = attempts.length
    ? attempts.join('; ')
    : 'no n8n-owned resolution source available (require.main undefined, no anchor in cache)';
  return undefined;
}

function resolveZod(): RuntimeZod | undefined {
  if (_runtimeZod) return _runtimeZod;

  const attempts: string[] = [];
  for (const { req, source } of candidateRequires()) {
    try {
      const z = req('zod') as Record<string, unknown>;
      // Validate the exports look like zod via `ZodType` (the class n8n's
      // normalizeToolSchema does `instanceof` against — the meaningful correctness
      // signal) plus the `object` factory our schema-generator calls.
      if (typeof z?.['ZodType'] === 'function' && typeof z?.['object'] === 'function') {
        _runtimeZod = z as unknown as RuntimeZod;
        _zodDiagnostic = `resolved zod via ${source}`;
        _zodLoadError = null;
        return _runtimeZod;
      }
      attempts.push(`${source}: module did not look like zod`);
    } catch (e) {
      attempts.push(`${source}: ${(e as Error).message}`);
    }
  }

  _zodLoadError = attempts.length
    ? attempts.join('; ')
    : 'no n8n-owned resolution source available (require.main undefined, no anchor in cache)';
  return undefined;
}

// IMPORTANT: Proxy target MUST be `function () {}`, not `{}`.
// ECMAScript spec §10.5.13: a Proxy only has [[Construct]] if its target does.
// Plain objects lack [[Construct]], so `new Proxy({}, ...)` throws
// "is not a constructor" before the construct trap ever fires.
export const RuntimeDynamicStructuredTool: DynamicStructuredToolCtor = new Proxy(
  function () {} as unknown as DynamicStructuredToolCtor,
  {
    construct(_target, args) {
      const ctor = resolveDynamicStructuredTool();
      if (!ctor) {
        throw new Error(
          `[MauticAdvancedAiTools] Could not resolve LangChain's DynamicStructuredTool ` +
            `via require.main or an n8n-owned require.cache anchor. ` +
            `Ensure @n8n/n8n-nodes-langchain is installed in n8n's node_modules.` +
            (_anchorDiagnostic ? ` Anchor: ${_anchorDiagnostic}.` : '') +
            (_langchainDiagnostic ? ` ${_langchainDiagnostic}.` : '') +
            (_langchainLoadError ? ` Load error: ${_langchainLoadError}` : ''),
        );
      }
      return new (ctor as any)(...args) as object;
    },
    get(_target, prop) {
      const ctor = resolveDynamicStructuredTool();
      if (ctor) {
        return (ctor as any)[prop];
      }
      return undefined;
    },
  },
) as DynamicStructuredToolCtor;

export const runtimeZod: RuntimeZod = new Proxy({} as RuntimeZod, {
  get(_target, prop) {
    // Guard: frameworks probe Symbol.toPrimitive, Symbol.toStringTag, .then
    // (Promise thenable), and .constructor. Throwing on these causes
    // misleading errors during structural inspection.
    if (typeof prop === 'symbol' || prop === 'then' || prop === 'constructor') return undefined;
    const z = resolveZod();
    if (!z) {
      throw new Error(
        `[MauticAdvancedAiTools] Could not resolve zod (accessing .${String(prop)}) ` +
          `via require.main or an n8n-owned require.cache anchor. ` +
          `Ensure @n8n/n8n-nodes-langchain is installed in n8n's node_modules.` +
          (_anchorDiagnostic ? ` Anchor: ${_anchorDiagnostic}.` : '') +
          (_zodDiagnostic ? ` ${_zodDiagnostic}.` : '') +
          (_zodLoadError ? ` Load error: ${_zodLoadError}` : ''),
      );
    }
    return (z as any)[prop];
  },
});
