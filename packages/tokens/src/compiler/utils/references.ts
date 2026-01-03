/**
 * Token reference utilities
 * Functions for detecting and parsing token references in DTCG format
 */

/** Pattern to detect a token reference: {token.path} */
const REFERENCE_PATTERN = /^\{([^}]+)\}$/;

/** Pattern to find all references in a string (for composite values) */
const REFERENCE_GLOBAL_PATTERN = /\{([^}]+)\}/g;

/**
 * Check if a value is a token reference
 * @example isReference('{color.primary}') => true
 * @example isReference('#ff0000') => false
 */
export function isReference(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return REFERENCE_PATTERN.test(value);
}

/**
 * Parse a reference string to get the token path
 * @example parseReference('{color.primary}') => 'color.primary'
 * @example parseReference('#ff0000') => null
 */
export function parseReference(value: string): string | null {
  const match = value.match(REFERENCE_PATTERN);
  return match?.[1] ?? null;
}

/**
 * Find all references in a string value
 * @example findReferences('{color.primary}') => ['color.primary']
 * @example findReferences('1px solid {color.border}') => ['color.border']
 */
export function findReferences(value: string): string[] {
  const matches = value.matchAll(REFERENCE_GLOBAL_PATTERN);
  return [...matches].map((m) => m[1]).filter((s): s is string => s !== undefined);
}

/**
 * Check if a value contains any references
 * @example containsReferences('{color.primary}') => true
 * @example containsReferences('1px solid {color.border}') => true
 * @example containsReferences('#ff0000') => false
 */
export function containsReferences(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return REFERENCE_GLOBAL_PATTERN.test(value);
}

/**
 * Replace references in a string with resolved values
 * @example replaceReferences('{color.primary}', { 'color.primary': '#ff0000' }) => '#ff0000'
 */
export function replaceReferences(value: string, resolvedTokens: Record<string, string>): string {
  return value.replace(REFERENCE_GLOBAL_PATTERN, (_, path: string) => {
    return resolvedTokens[path] ?? `{${path}}`;
  });
}

/**
 * Create a reference string from a token path
 * @example createReference('color.primary') => '{color.primary}'
 */
export function createReference(path: string): string {
  return `{${path}}`;
}
