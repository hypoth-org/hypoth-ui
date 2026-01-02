/**
 * Shared constants for behavior utilities.
 */

/**
 * Selector for standard focusable elements.
 * Used by focus-trap and roving-focus utilities.
 */
export const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Default type-ahead buffer timeout in milliseconds.
 */
export const DEFAULT_TYPEAHEAD_TIMEOUT = 500;
