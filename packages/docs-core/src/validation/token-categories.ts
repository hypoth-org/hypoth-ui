/**
 * Token category constants for docs-core
 * Mirrors the token categories from @ds/tokens
 */

/** All valid token categories */
export const TOKEN_CATEGORIES = [
  'color',
  'typography',
  'spacing',
  'sizing',
  'border',
  'shadow',
  'motion',
  'opacity',
  'z-index',
  'breakpoint',
  'icon',
  'radius',
] as const;

/** Token category type */
export type TokenCategory = (typeof TOKEN_CATEGORIES)[number];
