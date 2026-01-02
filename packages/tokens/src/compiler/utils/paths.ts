/**
 * Token path utilities
 * Functions for converting between token paths and CSS custom property names
 */

/**
 * Convert a token path to a CSS custom property name
 * @example tokenPathToCSS('color.background.primary') => '--color-background-primary'
 */
export function tokenPathToCSS(path: string): string {
  return `--${path.replace(/\./g, '-')}`;
}

/**
 * Convert a CSS custom property name to a token path
 * @example cssToTokenPath('--color-background-primary') => 'color.background.primary'
 */
export function cssToTokenPath(cssVar: string): string {
  const withoutPrefix = cssVar.startsWith('--') ? cssVar.slice(2) : cssVar;
  return withoutPrefix.replace(/-/g, '.');
}

/**
 * Parse a token path into its parts
 * @example parseTokenPath('color.background.primary') => ['color', 'background', 'primary']
 */
export function parseTokenPath(path: string): string[] {
  return path.split('.');
}

/**
 * Join path parts into a token path
 * @example joinTokenPath(['color', 'background', 'primary']) => 'color.background.primary'
 */
export function joinTokenPath(parts: string[]): string {
  return parts.join('.');
}

/**
 * Get the parent path of a token path
 * @example getParentPath('color.background.primary') => 'color.background'
 */
export function getParentPath(path: string): string | null {
  const parts = parseTokenPath(path);
  if (parts.length <= 1) return null;
  return joinTokenPath(parts.slice(0, -1));
}

/**
 * Get the leaf name of a token path
 * @example getLeafName('color.background.primary') => 'primary'
 */
export function getLeafName(path: string): string {
  const parts = parseTokenPath(path);
  return parts[parts.length - 1] || '';
}

/**
 * Check if a path is a child of another path
 * @example isChildPath('color.background', 'color.background.primary') => true
 */
export function isChildPath(parent: string, child: string): boolean {
  return child.startsWith(`${parent}.`);
}
