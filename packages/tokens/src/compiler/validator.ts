/**
 * Token Validator
 * Validates token references and detects issues
 */

import type { ParsedToken } from './parser.js';
import { isReference, parseReference, findReferences } from './utils/references.js';
import { isTokenCategory } from '../types/categories.js';

/** Validation result */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/** Validation error (blocks compilation) */
export interface ValidationError {
  type: 'circular-reference' | 'undefined-reference' | 'invalid-category';
  path: string;
  message: string;
  referencePath?: string;
}

/** Validation warning (allows compilation but reported) */
export interface ValidationWarning {
  type: 'missing-type' | 'missing-description' | 'unused-token';
  path: string;
  message: string;
}

/**
 * Detect circular references in token set
 * Returns paths that form cycles
 */
export function detectCircularReferences(tokens: ParsedToken[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const tokenMap = new Map<string, ParsedToken>();

  for (const token of tokens) {
    tokenMap.set(token.path, token);
  }

  function findCycle(path: string, visited: Set<string>, stack: Set<string>): string[] | null {
    if (stack.has(path)) {
      // Found cycle - return the path that forms the cycle
      return [path];
    }
    if (visited.has(path)) {
      return null;
    }

    const token = tokenMap.get(path);
    if (!token) return null;

    visited.add(path);
    stack.add(path);

    // Get all references from this token's value
    const refs = extractReferences(token.value);

    for (const ref of refs) {
      const cycle = findCycle(ref, visited, stack);
      if (cycle) {
        cycle.unshift(path);
        return cycle;
      }
    }

    stack.delete(path);
    return null;
  }

  const visited = new Set<string>();
  for (const token of tokens) {
    if (visited.has(token.path)) continue;

    const cycle = findCycle(token.path, visited, new Set());
    if (cycle) {
      const cyclePath = cycle.join(' -> ');
      const firstPath = cycle[0] ?? 'unknown';
      const lastPath = cycle[cycle.length - 1];
      errors.push({
        type: 'circular-reference',
        path: firstPath,
        message: `Circular reference detected: ${cyclePath}`,
        referencePath: lastPath,
      });
    }
  }

  return errors;
}

/**
 * Detect undefined references in token set
 */
export function detectUndefinedReferences(tokens: ParsedToken[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const definedPaths = new Set(tokens.map((t) => t.path));

  for (const token of tokens) {
    const refs = extractReferences(token.value);

    for (const ref of refs) {
      if (!definedPaths.has(ref)) {
        errors.push({
          type: 'undefined-reference',
          path: token.path,
          message: `Reference to undefined token: ${ref}`,
          referencePath: ref,
        });
      }
    }
  }

  return errors;
}

/**
 * Validate token categories
 */
export function validateCategories(tokens: ParsedToken[]): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const token of tokens) {
    const parts = token.path.split('.');
    const category = parts[0];
    if (!category || !isTokenCategory(category)) {
      errors.push({
        type: 'invalid-category',
        path: token.path,
        message: `Invalid token category: ${category ?? 'empty'}. Must be one of: color, typography, spacing, sizing, border, shadow, motion, opacity, z-index, breakpoint, icon, radius`,
      });
    }
  }

  return errors;
}

/**
 * Generate warnings for missing metadata
 */
export function generateWarnings(tokens: ParsedToken[]): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  for (const token of tokens) {
    if (!token.type) {
      warnings.push({
        type: 'missing-type',
        path: token.path,
        message: `Token is missing $type declaration`,
      });
    }
  }

  return warnings;
}

/**
 * Validate a set of tokens
 */
export function validateTokens(tokens: ParsedToken[]): ValidationResult {
  const circularErrors = detectCircularReferences(tokens);
  const undefinedErrors = detectUndefinedReferences(tokens);
  const categoryErrors = validateCategories(tokens);
  const warnings = generateWarnings(tokens);

  const errors = [...circularErrors, ...undefinedErrors, ...categoryErrors];

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Extract all reference paths from a token value
 */
function extractReferences(value: unknown): string[] {
  if (typeof value === 'string') {
    if (isReference(value)) {
      const ref = parseReference(value);
      return ref ? [ref] : [];
    }
    return findReferences(value);
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractReferences(item));
  }

  if (typeof value === 'object' && value !== null) {
    return Object.values(value).flatMap((v) => extractReferences(v));
  }

  return [];
}

/**
 * Validate that all tokensUsed paths exist in the token set
 */
export function validateTokensUsed(
  tokensUsed: string[],
  availableTokens: ParsedToken[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  const definedPaths = new Set(availableTokens.map((t) => t.path));

  for (const path of tokensUsed) {
    // First validate category
    const parts = path.split('.');
    const category = parts[0];
    if (!category || !isTokenCategory(category)) {
      errors.push({
        type: 'invalid-category',
        path,
        message: `Invalid token category in tokensUsed: ${category ?? 'empty'}`,
      });
      continue;
    }

    // Then check if token exists
    if (!definedPaths.has(path)) {
      errors.push({
        type: 'undefined-reference',
        path,
        message: `Token not found: ${path}`,
        referencePath: path,
      });
    }
  }

  return errors;
}
