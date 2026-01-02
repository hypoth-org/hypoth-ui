/**
 * Token Reference Resolver
 * Resolves token references and implements cascade resolution
 */

import type { TokenValue, ShadowValue, BorderValue, TypographyValue, TransitionValue } from '../types/dtcg.js';
import type { ParsedToken } from './parser.js';
import { isReference, parseReference, containsReferences, replaceReferences } from './utils/references.js';

/** Resolution context for cascade */
export interface ResolutionContext {
  brand?: string;
  mode?: string;
}

/** Token sources for cascade resolution */
export interface TokenSources {
  /** Global base tokens (always present) */
  globalBase: Map<string, ParsedToken>;
  /** Global mode-specific tokens */
  globalModes: Map<string, Map<string, ParsedToken>>;
  /** Brand base tokens */
  brands: Map<string, Map<string, ParsedToken>>;
  /** Brand + mode specific tokens */
  brandModes: Map<string, Map<string, Map<string, ParsedToken>>>;
}

/** Resolution result */
export interface ResolutionResult {
  resolved: Map<string, ResolvedValue>;
  errors: ResolutionError[];
}

/** Resolved value with source information */
export interface ResolvedValue {
  path: string;
  originalValue: TokenValue;
  resolvedValue: TokenValue;
  source: {
    level: 'brand-mode' | 'brand-base' | 'global-mode' | 'global-base';
    brand?: string;
    mode?: string;
  };
}

/** Resolution error */
export interface ResolutionError {
  path: string;
  message: string;
  type: 'undefined-reference' | 'circular-reference' | 'resolution-failed';
}

/**
 * Resolve a single token reference
 */
export function resolveReference(
  path: string,
  sources: TokenSources,
  context: ResolutionContext
): ParsedToken | undefined {
  const { brand, mode } = context;

  // 1. Brand + Mode (most specific)
  if (brand && mode) {
    const brandModes = sources.brandModes.get(brand);
    if (brandModes) {
      const modeTokens = brandModes.get(mode);
      if (modeTokens?.has(path)) {
        return modeTokens.get(path);
      }
    }
  }

  // 2. Brand base
  if (brand) {
    const brandTokens = sources.brands.get(brand);
    if (brandTokens?.has(path)) {
      return brandTokens.get(path);
    }
  }

  // 3. Global + Mode
  if (mode) {
    const modeTokens = sources.globalModes.get(mode);
    if (modeTokens?.has(path)) {
      return modeTokens.get(path);
    }
  }

  // 4. Global base (fallback)
  return sources.globalBase.get(path);
}

/**
 * Resolve all token values, following references
 */
export function resolveTokens(
  tokens: ParsedToken[],
  sources: TokenSources,
  context: ResolutionContext
): ResolutionResult {
  const resolved = new Map<string, ResolvedValue>();
  const errors: ResolutionError[] = [];
  const resolving = new Set<string>(); // Track tokens being resolved for cycle detection

  function resolveValue(
    value: TokenValue,
    path: string,
    depth = 0
  ): TokenValue {
    // Prevent infinite recursion
    if (depth > 100) {
      errors.push({
        path,
        message: 'Maximum resolution depth exceeded',
        type: 'resolution-failed',
      });
      return value;
    }

    // Handle string references
    if (typeof value === 'string') {
      if (isReference(value)) {
        const refPath = parseReference(value);
        if (!refPath) return value;

        // Check for circular reference
        if (resolving.has(refPath)) {
          errors.push({
            path,
            message: `Circular reference detected: ${path} -> ${refPath}`,
            type: 'circular-reference',
          });
          return value;
        }

        resolving.add(refPath);

        // Find the referenced token
        const refToken = resolveReference(refPath, sources, context);
        if (!refToken) {
          errors.push({
            path,
            message: `Undefined reference: ${refPath}`,
            type: 'undefined-reference',
          });
          resolving.delete(refPath);
          return value;
        }

        // Recursively resolve the referenced value
        const resolvedRefValue = resolveValue(refToken.value, refPath, depth + 1);
        resolving.delete(refPath);
        return resolvedRefValue;
      }

      // Handle partial references in strings
      if (containsReferences(value)) {
        const resolvedStrings: Record<string, string> = {};
        const refPaths = value.match(/\{([^}]+)\}/g) || [];

        for (const ref of refPaths) {
          const refPath = ref.slice(1, -1);
          if (resolving.has(refPath)) {
            errors.push({
              path,
              message: `Circular reference detected: ${path} -> ${refPath}`,
              type: 'circular-reference',
            });
            continue;
          }

          resolving.add(refPath);
          const refToken = resolveReference(refPath, sources, context);
          if (refToken) {
            const resolved = resolveValue(refToken.value, refPath, depth + 1);
            resolvedStrings[refPath] = String(resolved);
          }
          resolving.delete(refPath);
        }

        return replaceReferences(value, resolvedStrings);
      }

      return value;
    }

    // Handle composite types
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map((item, i) =>
          typeof item === 'object' && item !== null
            ? resolveCompositeValue(item as unknown as Record<string, unknown>, `${path}[${i}]`, depth)
            : item
        ) as TokenValue;
      }

      return resolveCompositeValue(value as unknown as Record<string, unknown>, path, depth) as TokenValue;
    }

    return value;
  }

  function resolveCompositeValue(
    obj: Record<string, unknown>,
    path: string,
    depth: number
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      result[key] = typeof val === 'string'
        ? resolveValue(val, `${path}.${key}`, depth + 1)
        : val;
    }
    return result;
  }

  // Resolve each token
  for (const token of tokens) {
    resolving.clear();
    const resolvedValue = resolveValue(token.value, token.path);

    // Determine source level
    let level: ResolvedValue['source']['level'] = 'global-base';
    const { brand, mode } = context;

    if (brand && mode) {
      const brandModes = sources.brandModes.get(brand);
      if (brandModes?.get(mode)?.has(token.path)) {
        level = 'brand-mode';
      }
    }
    if (level === 'global-base' && brand && sources.brands.get(brand)?.has(token.path)) {
      level = 'brand-base';
    }
    if (level === 'global-base' && mode && sources.globalModes.get(mode)?.has(token.path)) {
      level = 'global-mode';
    }

    resolved.set(token.path, {
      path: token.path,
      originalValue: token.value,
      resolvedValue,
      source: { level, brand, mode },
    });
  }

  return { resolved, errors };
}

/**
 * Build token sources from parsed token arrays
 */
export function buildTokenSources(
  globalTokens: ParsedToken[],
  modeTokens: Map<string, ParsedToken[]>,
  brandTokens: Map<string, ParsedToken[]>,
  brandModeTokens: Map<string, Map<string, ParsedToken[]>>
): TokenSources {
  const globalBase = new Map<string, ParsedToken>();
  for (const token of globalTokens) {
    globalBase.set(token.path, token);
  }

  const globalModes = new Map<string, Map<string, ParsedToken>>();
  for (const [mode, tokens] of modeTokens) {
    const modeMap = new Map<string, ParsedToken>();
    for (const token of tokens) {
      modeMap.set(token.path, token);
    }
    globalModes.set(mode, modeMap);
  }

  const brands = new Map<string, Map<string, ParsedToken>>();
  for (const [brand, tokens] of brandTokens) {
    const brandMap = new Map<string, ParsedToken>();
    for (const token of tokens) {
      brandMap.set(token.path, token);
    }
    brands.set(brand, brandMap);
  }

  const brandModes = new Map<string, Map<string, Map<string, ParsedToken>>>();
  for (const [brand, modes] of brandModeTokens) {
    const modeMap = new Map<string, Map<string, ParsedToken>>();
    for (const [mode, tokens] of modes) {
      const tokenMap = new Map<string, ParsedToken>();
      for (const token of tokens) {
        tokenMap.set(token.path, token);
      }
      modeMap.set(mode, tokenMap);
    }
    brandModes.set(brand, modeMap);
  }

  return { globalBase, globalModes, brands, brandModes };
}
