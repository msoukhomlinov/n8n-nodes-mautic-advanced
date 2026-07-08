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
 * Anchor candidates — packages in n8n's dependency tree that can serve as a
 * createRequire() anchor to resolve @langchain/core/tools and zod from n8n's
 * own module tree (not this package's bundled devDependency copies).
 *
 * IMPORTANT: resolution must NEVER run at module-import time. n8n's
 * node-directory-loader requires every node file in this package (including
 * this one) purely to register node metadata, long before any workflow
 * executes — and it aborts loading the ENTIRE package if any one file throws
 * while being required. That used to be exactly what happened here: under
 * pnpm-strict-isolated n8n installs (v2.29.x+) this package is installed
 * outside n8n's own node_modules tree (e.g. ~/.n8n/nodes/), so neither
 * anchor below resolves at all — @langchain/classic/@langchain/core are only
 * reachable from inside @n8n/n8n-nodes-langchain's own isolated pnpm
 * subtree, which no filesystem-based require.resolve() from here can walk
 * into. The resulting throw took down the plain, non-AI `mauticAdvanced`
 * node and its trigger too, not just this AI-tools node.
 *
 * Resolution is therefore deferred to first actual use, inside the Proxy
 * traps below (which only fire when a connected AI tool is invoked at
 * workflow-execution time via supplyData()). By then, n8n's own Agent/MCP
 * Trigger machinery has already loaded @langchain/core/tools itself (to run
 * its own tool-calling logic), so if the anchors still don't resolve, a
 * require.cache scan finds the exact module instance n8n itself loaded —
 * which works regardless of install layout.
 */
const ANCHOR_CANDIDATES = [
  // primary: @langchain/classic is a direct dep of @n8n/nodes-langchain, stable since n8n 2.4.x.
  // Its @langchain/core peerDep resolves to n8n's hoisted @langchain/core.
  '@langchain/classic/agents',
  // secondary: langchain package is in the n8n catalog and also has @langchain/core as peerDep.
  'langchain/agents',
] as const;

// Memoized ONLY on success — a failed attempt must not permanently disable
// retries (e.g. the require.cache scan fallback below may only succeed on a
// later call, once n8n has finished loading its own langchain-dependent
// nodes).
let _runtimeReq: NodeRequire | undefined;
let _anchorDiagnostic: string | null = null;

function getRuntimeRequire(): NodeRequire | undefined {
  if (_runtimeReq) return _runtimeReq;

  const tried: string[] = [];
  for (const candidate of ANCHOR_CANDIDATES) {
    try {
      const resolved = require.resolve(candidate);
      _runtimeReq = createRequire(resolved);
      _anchorDiagnostic = `resolved via anchor: ${candidate}`;
      return _runtimeReq;
    } catch (e) {
      tried.push(`${candidate}: ${(e as Error).message}`);
    }
  }

  _anchorDiagnostic = `Could not resolve LangChain anchor. Tried:\n${tried.join('\n')}`;
  return undefined;
}

/**
 * Scans Node's process-global module cache (shared across every node_modules
 * tree in this process, regardless of who loaded what) for an already-loaded
 * module whose resolved path matches `pathPattern`, returning the first
 * match whose exports satisfy `validate`. Must be called lazily (not at
 * module load) — n8n requires node files for registration before any
 * workflow runs, i.e. before langchain/zod are necessarily loaded into cache.
 */
function findCachedExports<T>(
  pathPattern: RegExp,
  validate: (exports: Record<string, unknown>) => T | undefined,
  excludeKey?: (key: string) => boolean,
): T | undefined {
  try {
    // require.cache is the public, documented CommonJS alias that points at the exact
    // same underlying object as the internal Module._cache. It is available directly in
    // CJS module scope (this file compiles to CJS via tsc), so no require('module') needed.
    const cache = require.cache;
    if (!cache) return undefined;
    for (const key of Object.keys(cache)) {
      if (!pathPattern.test(key)) continue;
      if (excludeKey && excludeKey(key)) continue;
      const entry = cache[key];
      if (!entry) continue;
      const result = validate(entry.exports as Record<string, unknown>);
      if (result !== undefined) return result;
    }
  } catch (_e) {
    // best-effort — require.cache introspection is not guaranteed across Node versions
  }
  return undefined;
}

let _RuntimeDynamicStructuredTool: DynamicStructuredToolCtor | undefined;
let _runtimeZod: RuntimeZod | undefined;
let _langchainLoadError: string | null = null;
let _zodLoadError: string | null = null;
let _zodDiagnostic: string | null = null;

function resolveDynamicStructuredTool(): DynamicStructuredToolCtor | undefined {
  if (_RuntimeDynamicStructuredTool) return _RuntimeDynamicStructuredTool;

  const runtimeReq = getRuntimeRequire();
  if (runtimeReq) {
    try {
      const coreTools = runtimeReq('@langchain/core/tools') as Record<string, any>;
      if (typeof coreTools?.['DynamicStructuredTool'] === 'function') {
        _RuntimeDynamicStructuredTool = coreTools[
          'DynamicStructuredTool'
        ] as DynamicStructuredToolCtor;
        return _RuntimeDynamicStructuredTool;
      }
    } catch (e) {
      _langchainLoadError = (e as Error).message;
    }
  }

  // Fallback for pnpm-isolated installs where no filesystem anchor reaches
  // @langchain/core at all: it is loaded by n8n's own Agent/MCP Trigger
  // machinery before our supplyData() ever runs, so grab it straight out of
  // require.cache once it is resident.
  const cached = findCachedExports(/[\\/]@langchain[\\/]core[\\/]/, (exports) =>
    typeof exports['DynamicStructuredTool'] === 'function'
      ? (exports['DynamicStructuredTool'] as DynamicStructuredToolCtor)
      : undefined,
  );
  if (cached) {
    _RuntimeDynamicStructuredTool = cached;
    _langchainLoadError = null;
  }
  return _RuntimeDynamicStructuredTool;
}

function resolveZod(): RuntimeZod | undefined {
  if (_runtimeZod) return _runtimeZod;

  // Three-step resolution, in priority order: require.main → anchor → require.cache scan.
  //
  // Primary path: resolve zod starting from n8n's own main entry point's module tree
  // (require.main). For a correctly-installed (non-isolated) setup this lands on n8n's
  // top-level zod — the exact copy n8n's own normalizeToolSchema does `instanceof ZodType`
  // against. Even under pnpm-strict isolation this is a DIFFERENT resolution path than this
  // package's own local require('zod'), so it is far more likely to reach n8n's real copy
  // (or fail cleanly) than to silently return this package's OWN bundled zod. Resolved
  // lazily here (NOT at module top level) so node registration never triggers it — that
  // laziness is the entire point of this fix (#2).
  try {
    const mainReq = createRequire(require.main?.filename ?? __filename);
    _runtimeZod = mainReq('zod') as RuntimeZod;
    if (_runtimeZod) {
      _zodDiagnostic = 'resolved zod via require.main';
      _zodLoadError = null;
      return _runtimeZod;
    }
  } catch (e) {
    _zodLoadError = (e as Error).message;
  }

  // Secondary path: the existing @langchain/classic / langchain anchor.
  const runtimeReq = getRuntimeRequire();
  if (runtimeReq) {
    try {
      _runtimeZod = runtimeReq('zod') as RuntimeZod;
      if (_runtimeZod) {
        _zodDiagnostic = 'resolved zod via anchor';
        _zodLoadError = null;
        return _runtimeZod;
      }
    } catch (e) {
      _zodLoadError = (e as Error).message;
    }
  }

  // Tertiary path: scan require.cache for an already-resident zod once neither
  // filesystem resolution reaches it (pnpm-strict-isolated installs). The path regex is
  // narrowed to zod's own entry-point directories (lib/dist/index/v3/v4) so it never
  // matches zod-adjacent package names (e.g. zod-to-json-schema). Validate the exports
  // look like zod via `ZodType` (the class n8n's normalizeToolSchema does `instanceof`
  // against — the meaningful correctness signal) plus the `object` factory our
  // schema-generator calls.
  //
  // Exclusion guard: this package declares zod as a REAL dependency and imports it at
  // node-registration time (schema-generator.ts), so this package's OWN bundled zod is
  // ALWAYS resident in require.cache — potentially earlier in iteration order than n8n's.
  // We specifically want a DIFFERENT copy (n8n's), because a self-bundled copy would fail
  // n8n's `instanceof ZodType` class-identity check. So skip any cache key belonging to
  // this package's own bundled zod. (The pathPattern has already matched the zod segment,
  // so a package-name match on the key is sufficient and robust to both nested
  // `.../n8n-nodes-mautic-advanced/node_modules/zod/...` and flatter install layouts.)
  const cached = findCachedExports(
    /[\\/]zod[\\/](lib|dist|index|v3|v4)/,
    (exports) =>
      typeof exports['ZodType'] === 'function' && typeof exports['object'] === 'function'
        ? (exports as unknown as RuntimeZod)
        : undefined,
    (key) => key.includes('n8n-nodes-mautic-advanced'),
  );
  if (cached) {
    _runtimeZod = cached;
    _zodLoadError = null;
    _zodDiagnostic = 'resolved zod via require.cache scan (pnpm-isolated install)';
  }
  return _runtimeZod;
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
          `[MauticAdvancedAiTools] Could not resolve LangChain's DynamicStructuredTool. ` +
            `Ensure @n8n/nodes-langchain is installed in n8n's node_modules.` +
            (_anchorDiagnostic ? ` Diagnostic: ${_anchorDiagnostic}` : '') +
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
          `via require.main, LangChain anchor, or require.cache scan. ` +
          `Ensure @n8n/nodes-langchain is installed in n8n's node_modules.` +
          (_zodDiagnostic
            ? ` Diagnostic: ${_zodDiagnostic}`
            : _anchorDiagnostic
              ? ` Diagnostic: ${_anchorDiagnostic}`
              : '') +
          (_zodLoadError ? ` Load error: ${_zodLoadError}` : ''),
      );
    }
    return (z as any)[prop];
  },
});
