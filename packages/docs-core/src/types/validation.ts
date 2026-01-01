/**
 * Validation result types for manifest and docs validation
 */

/**
 * Error code for programmatic handling
 */
export type ValidationErrorCode =
  | "MISSING_REQUIRED_FIELD"
  | "INVALID_FORMAT"
  | "INVALID_VALUE"
  | "COMPONENT_NOT_FOUND"
  | "STATUS_MISMATCH"
  | "EDITION_NOT_AVAILABLE"
  | "SCHEMA_ERROR"
  | "FILE_NOT_FOUND"
  | "PARSE_ERROR";

/**
 * Warning code for non-blocking issues
 */
export type ValidationWarningCode =
  | "STATUS_MISMATCH"
  | "DEPRECATED_PROP_USAGE"
  | "MISSING_OPTIONAL_FIELD"
  | "EDITION_OVERRIDE";

/**
 * A single validation error
 */
export interface ValidationError {
  /** Absolute file path */
  file: string;
  /** JSON path to invalid field (e.g., "/accessibility/keyboard") */
  field: string;
  /** Human-readable error message */
  message: string;
  /** Error code for programmatic handling */
  code: ValidationErrorCode;
  /** Line number if available */
  line?: number;
}

/**
 * A single validation warning
 */
export interface ValidationWarning {
  /** Absolute file path */
  file: string;
  /** JSON path to field */
  field: string;
  /** Human-readable warning message */
  message: string;
  /** Warning code */
  code: ValidationWarningCode;
  /** Line number if available */
  line?: number;
}

/**
 * Complete validation result for a single file
 */
export interface FileValidationResult {
  /** File path that was validated */
  file: string;
  /** Whether validation passed (no errors) */
  valid: boolean;
  /** Array of validation errors */
  errors: ValidationError[];
  /** Array of validation warnings */
  warnings: ValidationWarning[];
}

/**
 * Complete validation result for all files
 */
export interface ValidationResult {
  /** Overall validation result (true if no errors) */
  valid: boolean;
  /** Total count of errors across all files */
  errorCount: number;
  /** Total count of warnings across all files */
  warningCount: number;
  /** Results per file */
  files: FileValidationResult[];
  /** Errors aggregated from all files */
  errors: ValidationError[];
  /** Warnings aggregated from all files */
  warnings: ValidationWarning[];
}

/**
 * Options for validation commands
 */
export interface ValidationOptions {
  /** If true, treat warnings as errors (for CI) */
  strict?: boolean;
  /** Root directory to search for files */
  rootDir?: string;
  /** Glob pattern for manifest files */
  manifestPattern?: string;
  /** Glob pattern for docs files */
  docsPattern?: string;
  /** Whether to enable cross-reference validation */
  crossReference?: boolean;
}

/**
 * Format validation errors for console output
 */
export function formatValidationError(error: ValidationError): string {
  const location = error.line ? `:${error.line}` : "";
  return `${error.file}${location}: ${error.message} [${error.code}]`;
}

/**
 * Format validation warnings for console output
 */
export function formatValidationWarning(warning: ValidationWarning): string {
  const location = warning.line ? `:${warning.line}` : "";
  return `${warning.file}${location}: ${warning.message} [${warning.code}]`;
}

/**
 * Create an empty validation result
 */
export function createEmptyResult(): ValidationResult {
  return {
    valid: true,
    errorCount: 0,
    warningCount: 0,
    files: [],
    errors: [],
    warnings: [],
  };
}

/**
 * Merge multiple validation results
 */
export function mergeResults(...results: ValidationResult[]): ValidationResult {
  const merged = createEmptyResult();

  for (const result of results) {
    merged.files.push(...result.files);
    merged.errors.push(...result.errors);
    merged.warnings.push(...result.warnings);
  }

  merged.valid = merged.errors.length === 0;
  merged.errorCount = merged.errors.length;
  merged.warningCount = merged.warnings.length;

  return merged;
}
