/**
 * Custom error messages for manifest and docs validation
 */

import type { ValidationError, ValidationWarning } from "../types/validation.js";

/**
 * Error message templates for common manifest validation failures
 */
export const MANIFEST_ERROR_MESSAGES: Record<string, string> = {
  // Required field errors
  "must have required property 'id'": "Component must have an 'id' field (kebab-case identifier)",
  "must have required property 'name'": "Component must have a 'name' field (display name)",
  "must have required property 'version'":
    "Component must have a 'version' field (semver format, e.g., 1.0.0)",
  "must have required property 'status'":
    "Component must have a 'status' field (experimental|alpha|beta|stable|deprecated)",
  "must have required property 'description'":
    "Component must have a 'description' field (10-500 characters)",
  "must have required property 'editions'":
    "Component must have an 'editions' array with at least one edition (core|pro|enterprise)",
  "must have required property 'accessibility'":
    "Component must have an 'accessibility' object with a11y metadata",

  // Accessibility nested errors
  "must have required property 'apgPattern'":
    "Accessibility must specify an 'apgPattern' (APG pattern name or 'custom')",
  "must have required property 'keyboard'":
    "Accessibility must specify 'keyboard' interactions (e.g., ['Enter', 'Space'])",
  "must have required property 'screenReader'":
    "Accessibility must describe 'screenReader' behavior",

  // Format errors
  'must match pattern "^[a-z][a-z0-9-]*$"':
    "ID must be kebab-case (lowercase letters, numbers, and hyphens only)",
  'must match pattern "^\\d+\\.\\d+\\.\\d+':
    "Version must be valid semver format (e.g., 1.0.0, 2.1.0-beta.1)",

  // Enum errors
  "must be equal to one of the allowed values": "Invalid value - check allowed options in schema",
};

/**
 * Error message templates for docs frontmatter validation
 */
export const DOCS_ERROR_MESSAGES: Record<string, string> = {
  "must have required property 'title'": "Documentation must have a 'title' field",
  "must have required property 'component'": "Documentation must reference a 'component' id",
  "must have required property 'status'":
    "Documentation must have a 'status' field matching the component",
};

/**
 * Format an Ajv error into a ValidationError
 */
export function formatManifestError(file: string, rawMessage: string): ValidationError {
  // Extract path and message from raw Ajv output
  const match = rawMessage.match(/^(\/[^:]*): (.+)$/);
  const field = match?.[1] ?? "/";
  const message = match?.[2] ?? rawMessage;

  // Look up custom message
  const customMessage = MANIFEST_ERROR_MESSAGES[message] ?? message;

  // Determine error code based on message
  let code: ValidationError["code"] = "SCHEMA_ERROR";
  if (message.includes("required property")) {
    code = "MISSING_REQUIRED_FIELD";
  } else if (message.includes("pattern")) {
    code = "INVALID_FORMAT";
  } else if (message.includes("allowed values") || message.includes("must be")) {
    code = "INVALID_VALUE";
  }

  return {
    file,
    field,
    message: customMessage,
    code,
  };
}

/**
 * Format an Ajv error into a ValidationError for docs
 */
export function formatDocsError(file: string, rawMessage: string): ValidationError {
  const match = rawMessage.match(/^(\/[^:]*): (.+)$/);
  const field = match?.[1] ?? "/";
  const message = match?.[2] ?? rawMessage;

  const customMessage = DOCS_ERROR_MESSAGES[message] ?? message;

  let code: ValidationError["code"] = "SCHEMA_ERROR";
  if (message.includes("required property")) {
    code = "MISSING_REQUIRED_FIELD";
  }

  return {
    file,
    field,
    message: customMessage,
    code,
  };
}

/**
 * Create a manifest validation warning
 */
export function formatManifestWarning(
  file: string,
  field: string,
  message: string
): ValidationWarning {
  return {
    file,
    field,
    message,
    code: "MISSING_OPTIONAL_FIELD",
  };
}

/**
 * Create a cross-reference validation error
 */
export function createCrossRefError(
  file: string,
  field: string,
  componentId: string,
  message: string
): ValidationError {
  return {
    file,
    field,
    message: `Component "${componentId}": ${message}`,
    code: "COMPONENT_NOT_FOUND",
  };
}

/**
 * Create a status mismatch warning
 */
export function createStatusMismatchWarning(
  file: string,
  docStatus: string,
  manifestStatus: string
): ValidationWarning {
  return {
    file,
    field: "/status",
    message: `Documentation status "${docStatus}" differs from manifest status "${manifestStatus}"`,
    code: "STATUS_MISMATCH",
  };
}

/**
 * Format error for console output with colors
 */
export function formatErrorForConsole(error: ValidationError): string {
  return `\x1b[31mERROR\x1b[0m ${error.file}${error.field !== "/" ? ` (${error.field})` : ""}: ${error.message}`;
}

/**
 * Format warning for console output with colors
 */
export function formatWarningForConsole(warning: ValidationWarning): string {
  return `\x1b[33mWARN\x1b[0m  ${warning.file}${warning.field !== "/" ? ` (${warning.field})` : ""}: ${warning.message}`;
}
