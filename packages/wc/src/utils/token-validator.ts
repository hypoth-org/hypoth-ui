/**
 * Token Validation Utility
 *
 * Validates that prop values are valid design tokens.
 * Logs warnings in development mode for invalid values.
 * Silently ignores invalid values in production.
 */

/**
 * Check if we're in development mode.
 * Checks NODE_ENV environment variable.
 */
function isDevelopment(): boolean {
  // Check for development mode via global or process.env
  if (typeof globalThis !== "undefined") {
    const g = globalThis as Record<string, unknown>;
    if (g.__DEV__ === true) return true;
  }

  // SSR/Node.js environment
  if (typeof process !== "undefined" && process.env) {
    return process.env.NODE_ENV === "development";
  }

  return false;
}

/**
 * Validate a token value against a list of valid tokens.
 *
 * @param value - The value to validate
 * @param validTokens - Array of valid token values
 * @param propName - Name of the prop for error messages
 * @param componentName - Name of the component for error messages
 * @returns True if valid, false if invalid
 *
 * @example
 * validateToken("lg", ["sm", "md", "lg"], "gap", "ds-flow")
 * // Returns: true
 *
 * validateToken("13px", ["sm", "md", "lg"], "gap", "ds-flow")
 * // Logs warning in dev, returns false
 */
export function validateToken(
  value: string | undefined | null,
  validTokens: readonly string[],
  propName: string,
  componentName: string
): boolean {
  if (value === undefined || value === null || value === "") {
    return true; // Empty values are valid (use default)
  }

  const isValid = validTokens.includes(value);

  if (!isValid && isDevelopment()) {
    console.warn(
      `[${componentName}] Invalid value "${value}" for prop "${propName}". ` +
        `Valid values are: ${validTokens.join(", ")}`
    );
  }

  return isValid;
}

/**
 * Validate a responsive token value.
 * Checks each value in the responsive string.
 *
 * @param value - The responsive string value
 * @param validTokens - Array of valid token values
 * @param propName - Name of the prop for error messages
 * @param componentName - Name of the component for error messages
 * @returns True if all values are valid, false if any are invalid
 *
 * @example
 * validateResponsiveToken("base:sm md:lg", ["sm", "md", "lg"], "gap", "ds-flow")
 * // Returns: true
 *
 * validateResponsiveToken("base:sm md:13px", ["sm", "md", "lg"], "gap", "ds-flow")
 * // Logs warning in dev for "13px", returns false
 */
export function validateResponsiveToken(
  value: string | undefined | null,
  validTokens: readonly string[],
  propName: string,
  componentName: string
): boolean {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  const parts = value.trim().split(/\s+/);
  let allValid = true;

  for (const part of parts) {
    let tokenValue = part;

    // Extract value from "breakpoint:value" format
    if (part.includes(":")) {
      const [, val] = part.split(":") as [string, string];
      tokenValue = val;
    }

    if (!validateToken(tokenValue, validTokens, propName, componentName)) {
      allValid = false;
    }
  }

  return allValid;
}

/**
 * Create a validator function bound to specific valid tokens.
 * Useful for creating reusable validators for common token sets.
 *
 * @param validTokens - Array of valid token values
 * @returns A validator function
 *
 * @example
 * const validateSpacing = createValidator(SPACING_TOKENS);
 * validateSpacing("lg", "gap", "ds-flow"); // true
 * validateSpacing("13px", "gap", "ds-flow"); // false, warns in dev
 */
export function createValidator(validTokens: readonly string[]) {
  return (value: string | undefined | null, propName: string, componentName: string): boolean =>
    validateToken(value, validTokens, propName, componentName);
}

/**
 * Create a responsive validator function bound to specific valid tokens.
 *
 * @param validTokens - Array of valid token values
 * @returns A responsive validator function
 */
export function createResponsiveValidator(validTokens: readonly string[]) {
  return (value: string | undefined | null, propName: string, componentName: string): boolean =>
    validateResponsiveToken(value, validTokens, propName, componentName);
}
