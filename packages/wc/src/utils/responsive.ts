/**
 * Responsive Value Parser
 *
 * Parses responsive string values from Web Component attributes
 * into CSS classes for each breakpoint.
 *
 * Input format: "base:value breakpoint:value ..."
 * Example: "base:column md:row lg:row-reverse"
 */

import type { BreakpointToken } from "../types/layout-tokens.js";

/**
 * Parsed responsive value with base and breakpoint overrides.
 */
export interface ResponsiveValue<T> {
  base: T;
  overrides: Partial<Record<BreakpointToken, T>>;
}

/**
 * Parse a responsive string value into structured data.
 *
 * @param value - The responsive string (e.g., "base:column md:row")
 * @returns Parsed responsive value with base and overrides
 *
 * @example
 * parseResponsiveString("base:column md:row")
 * // Returns: { base: "column", overrides: { md: "row" } }
 *
 * @example
 * parseResponsiveString("column")
 * // Returns: { base: "column", overrides: {} }
 */
export function parseResponsiveString<T extends string>(value: string): ResponsiveValue<T> {
  const parts = value.trim().split(/\s+/);
  let base: T | undefined;
  const overrides: Partial<Record<BreakpointToken, T>> = {};

  for (const part of parts) {
    if (part.includes(":")) {
      const [breakpoint, val] = part.split(":") as [string, T];
      if (breakpoint === "base") {
        base = val;
      } else {
        overrides[breakpoint as BreakpointToken] = val;
      }
    } else {
      // If no prefix, treat as base value
      base = part as T;
    }
  }

  return {
    base: base as T,
    overrides,
  };
}

/**
 * Generate CSS classes for a responsive property.
 *
 * @param component - Component name prefix (e.g., "flow")
 * @param property - Property short name (e.g., "dir" for direction)
 * @param value - The responsive string value
 * @returns Array of CSS classes to apply
 *
 * @example
 * generateResponsiveClasses("flow", "dir", "base:column md:row")
 * // Returns: ["ds-flow--md:dir-row"]
 * // Note: base value is applied via data attribute, not class
 */
export function generateResponsiveClasses(
  component: string,
  property: string,
  value: string
): string[] {
  const parsed = parseResponsiveString(value);
  const classes: string[] = [];

  // Add breakpoint-specific classes
  for (const [breakpoint, val] of Object.entries(parsed.overrides)) {
    if (val) {
      classes.push(`ds-${component}--${breakpoint}:${property}-${val}`);
    }
  }

  return classes;
}

/**
 * Get the base value from a responsive string.
 *
 * @param value - The responsive string
 * @returns The base value
 */
export function getBaseValue<T extends string>(value: string): T {
  const parsed = parseResponsiveString<T>(value);
  return parsed.base;
}

/**
 * Check if a value is responsive (has breakpoint prefixes).
 *
 * @param value - The value to check
 * @returns True if value contains breakpoint prefixes
 */
export function isResponsiveValue(value: string): boolean {
  return value.includes(":");
}
