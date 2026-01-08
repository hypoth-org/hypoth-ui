/**
 * Schema Validator
 *
 * AJV-based JSON schema validation utility for governance data.
 */

import Ajv from "ajv";
import type { DeprecationRegistry, GatesConfig, MigrationGuide } from "../types/index.js";

// Import schemas
import changesetEntrySchema from "../schemas/changeset-entry.schema.json" with { type: "json" };
import contributionGatesSchema from "../schemas/contribution-gates.schema.json" with {
  type: "json",
};
import deprecationRegistrySchema from "../schemas/deprecation-registry.schema.json" with {
  type: "json",
};
import migrationGuideSchema from "../schemas/migration-guide.schema.json" with { type: "json" };

/** Validation result */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Validation errors (if any) */
  errors: ValidationError[];
}

/** Individual validation error */
export interface ValidationError {
  /** Error message */
  message: string;
  /** JSON path to the error */
  path: string;
  /** Schema keyword that failed */
  keyword: string;
}

/** Schema types supported by the validator */
export type SchemaType =
  | "deprecation-registry"
  | "changeset-entry"
  | "contribution-gates"
  | "migration-guide";

const ajv = new Ajv({ allErrors: true, strict: false });

// Compile schemas
const validators = {
  "deprecation-registry": ajv.compile(deprecationRegistrySchema),
  "changeset-entry": ajv.compile(changesetEntrySchema),
  "contribution-gates": ajv.compile(contributionGatesSchema),
  "migration-guide": ajv.compile(migrationGuideSchema),
};

/**
 * Validate data against a schema
 */
export function validate(schemaType: SchemaType, data: unknown): ValidationResult {
  const validator = validators[schemaType];

  const valid = validator(data);

  if (valid) {
    return { valid: true, errors: [] };
  }

  const errors: ValidationError[] = (validator.errors ?? []).map((err) => ({
    message: err.message ?? "Unknown validation error",
    path: err.instancePath || "/",
    keyword: err.keyword,
  }));

  return { valid: false, errors };
}

/**
 * Validate a deprecation registry
 */
export function validateDeprecationRegistry(
  data: unknown
): ValidationResult & { data?: DeprecationRegistry } {
  const result = validate("deprecation-registry", data);
  if (result.valid) {
    return { ...result, data: data as DeprecationRegistry };
  }
  return result;
}

/**
 * Validate a gates configuration
 */
export function validateGatesConfig(data: unknown): ValidationResult & { data?: GatesConfig } {
  const result = validate("contribution-gates", data);
  if (result.valid) {
    return { ...result, data: data as GatesConfig };
  }
  return result;
}

/**
 * Validate migration guide frontmatter
 */
export function validateMigrationGuide(
  data: unknown
): ValidationResult & { data?: MigrationGuide } {
  const result = validate("migration-guide", data);
  if (result.valid) {
    return { ...result, data: data as MigrationGuide };
  }
  return result;
}

/**
 * Format validation errors as a string
 */
export function formatErrors(errors: ValidationError[]): string {
  return errors.map((err) => `  - ${err.path}: ${err.message} (${err.keyword})`).join("\n");
}

/**
 * Throw if validation fails
 */
export function assertValid(schemaType: SchemaType, data: unknown, context?: string): void {
  const result = validate(schemaType, data);
  if (!result.valid) {
    const prefix = context ? `${context}: ` : "";
    throw new Error(
      `${prefix}Validation failed for ${schemaType}:\n${formatErrors(result.errors)}`
    );
  }
}
