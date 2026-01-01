/**
 * Schema compiler utility using Ajv for JSON Schema validation
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import type { ValidateFunction } from "ajv";
import ajvErrors from "ajv-errors";

import type { ContractManifest, DocsFrontmatter, EditionConfig } from "../types/manifest.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMAS_DIR = join(__dirname, "..", "schemas");

// Singleton Ajv instance for caching compiled validators
let ajvInstance: Ajv | null = null;

/**
 * Get or create the Ajv instance with custom error messages enabled
 */
function getAjv(): Ajv {
  if (!ajvInstance) {
    ajvInstance = new Ajv({
      allErrors: true,
      removeAdditional: false,
      useDefaults: true,
      strict: false,
    });
    ajvErrors(ajvInstance);
  }
  return ajvInstance;
}

/**
 * Load a JSON Schema from the schemas directory
 */
function loadSchema(schemaName: string): object {
  const schemaPath = join(SCHEMAS_DIR, schemaName);
  const content = readFileSync(schemaPath, "utf-8");
  return JSON.parse(content);
}

// Cached validators
let manifestValidator: ValidateFunction<ContractManifest> | null = null;
let frontmatterValidator: ValidateFunction<DocsFrontmatter> | null = null;
let editionConfigValidator: ValidateFunction<EditionConfig> | null = null;

/**
 * Get the compiled manifest validator
 */
export function getManifestValidator(): ValidateFunction<ContractManifest> {
  if (!manifestValidator) {
    const ajv = getAjv();
    const schema = loadSchema("component-manifest.schema.json");
    manifestValidator = ajv.compile<ContractManifest>(schema);
  }
  return manifestValidator;
}

/**
 * Get the compiled frontmatter validator
 */
export function getFrontmatterValidator(): ValidateFunction<DocsFrontmatter> {
  if (!frontmatterValidator) {
    const ajv = getAjv();
    const schema = loadSchema("docs-frontmatter.schema.json");
    frontmatterValidator = ajv.compile<DocsFrontmatter>(schema);
  }
  return frontmatterValidator;
}

/**
 * Get the compiled edition config validator
 */
export function getEditionConfigValidator(): ValidateFunction<EditionConfig> {
  if (!editionConfigValidator) {
    const ajv = getAjv();
    const schema = loadSchema("edition-config.schema.json");
    editionConfigValidator = ajv.compile<EditionConfig>(schema);
  }
  return editionConfigValidator;
}

/**
 * Reset cached validators (useful for testing)
 */
export function resetValidators(): void {
  manifestValidator = null;
  frontmatterValidator = null;
  editionConfigValidator = null;
  ajvInstance = null;
}

/**
 * Format Ajv errors into human-readable messages
 */
export function formatAjvErrors(errors: typeof Ajv.prototype.errors): string[] {
  if (!errors) return [];

  return errors.map((err) => {
    const path = err.instancePath || "/";
    const message = err.message || "Unknown error";

    // Use custom errorMessage if available
    if (err.keyword === "errorMessage") {
      return `${path}: ${message}`;
    }

    return `${path}: ${message}`;
  });
}
