/**
 * ARIA ID Generation Utility
 *
 * Simple counter-based ID generator for ARIA relationships.
 * Uses a global counter to ensure unique IDs across the page lifecycle.
 *
 * @packageDocumentation
 */

// Global counter for ID generation
let counter = 0;

/**
 * Generate a unique ARIA ID with optional prefix.
 *
 * IDs are globally unique within the page lifecycle using an incrementing counter.
 * The counter resets on page refresh but maintains uniqueness during the session.
 *
 * @param prefix - ID prefix (default: "aria")
 * @returns Unique ID string (e.g., "dialog-title-1", "dialog-title-2")
 *
 * @example
 * ```ts
 * const titleId = generateAriaId("dialog-title");    // "dialog-title-1"
 * const descId = generateAriaId("dialog-desc");      // "dialog-desc-2"
 * const autoId = generateAriaId();                   // "aria-3"
 * ```
 */
export function generateAriaId(prefix = "aria"): string {
  return `${prefix}-${++counter}`;
}

/**
 * Reset the ARIA ID counter.
 *
 * Useful for testing to ensure predictable IDs.
 * Do NOT call in production code.
 *
 * @internal
 */
export function resetAriaIdCounter(): void {
  counter = 0;
}

/**
 * Get the current ARIA ID counter value.
 *
 * Useful for debugging or testing.
 *
 * @internal
 */
export function getAriaIdCounter(): number {
  return counter;
}
