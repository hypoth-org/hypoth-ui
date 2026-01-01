import Ajv, { type ValidateFunction, type ErrorObject } from "ajv";
import type { ComponentManifest } from "./loader.js";

/**
 * Validation result for a manifest
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Component manifest JSON Schema
 */
const componentManifestSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Component Manifest",
  type: "object",
  required: [
    "id",
    "name",
    "status",
    "availabilityTags",
    "platforms",
    "a11y",
    "tokensUsed",
    "category",
  ],
  properties: {
    $schema: { type: "string" },
    id: {
      type: "string",
      pattern: "^[a-z][a-z0-9-]*$",
    },
    name: {
      type: "string",
      minLength: 1,
    },
    description: {
      type: "string",
    },
    status: {
      type: "string",
      enum: ["alpha", "beta", "stable", "deprecated"],
    },
    since: {
      type: "string",
      pattern: "^\\d+\\.\\d+\\.\\d+$",
    },
    availabilityTags: {
      type: "array",
      items: {
        type: "string",
        enum: ["public", "enterprise", "internal-only", "regulated"],
      },
      minItems: 1,
    },
    platforms: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
    },
    a11y: {
      type: "object",
    },
    tokensUsed: {
      type: "array",
      items: { type: "string" },
    },
    slots: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "description"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    cssCustomProperties: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "description"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    props: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "type", "description"],
        properties: {
          name: { type: "string" },
          type: { type: "string" },
          default: { type: "string" },
          description: { type: "string" },
          required: { type: "boolean" },
        },
      },
    },
    events: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "description"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          detail: { type: "string" },
        },
      },
    },
    examples: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "code"],
        properties: {
          title: { type: "string" },
          code: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    recommendedUsage: {
      oneOf: [
        { type: "string", minLength: 1 },
        { type: "array", items: { type: "string" } },
      ],
    },
    antiPatterns: {
      oneOf: [
        { type: "string", minLength: 1 },
        { type: "array", items: { type: "string" } },
      ],
    },
    relatedComponents: {
      type: "array",
      items: { type: "string" },
    },
    category: {
      type: "string",
      minLength: 1,
    },
  },
  additionalProperties: true,
};

/**
 * Create a manifest validator instance
 */
export function createManifestValidator(): ValidateFunction<ComponentManifest> {
  const ajv = new Ajv({ allErrors: true });
  return ajv.compile<ComponentManifest>(componentManifestSchema);
}

/**
 * Validate a component manifest
 */
export function validateManifest(manifest: unknown): ValidationResult {
  const validate = createManifestValidator();
  const valid = validate(manifest);

  if (valid) {
    return { valid: true, errors: [] };
  }

  const errors = (validate.errors ?? []).map((err: ErrorObject) => {
    const path = err.instancePath || "/";
    return `${path}: ${err.message}`;
  });

  return { valid: false, errors };
}

/**
 * Validate multiple manifests and return all results
 */
export function validateManifests(manifests: unknown[]): Map<number, ValidationResult> {
  const results = new Map<number, ValidationResult>();

  for (let i = 0; i < manifests.length; i++) {
    results.set(i, validateManifest(manifests[i]));
  }

  return results;
}
