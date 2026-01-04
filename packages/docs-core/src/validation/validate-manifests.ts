/**
 * Manifest validation using the contract schema
 */

import { readFile } from "node:fs/promises";
import { glob } from "glob";

import type { ContentPack, ContractManifest } from "../types/manifest.js";
import { mergeManifests } from "../content/overlay.js";
import type {
  FileValidationResult,
  ValidationError,
  ValidationResult,
  ValidationWarning,
} from "../types/validation.js";
import { createEmptyResult } from "../types/validation.js";
import { formatManifestError, formatManifestWarning } from "./error-messages.js";
import { formatAjvErrors, getManifestValidator } from "./schema-compiler.js";

/**
 * Default pattern for discovering manifest files
 */
export const DEFAULT_MANIFEST_PATTERN = "**/components/**/manifest.json";

/**
 * Options for manifest validation
 */
export interface ValidateManifestsOptions {
  /** Root directory to search for manifests */
  rootDir?: string;
  /** Glob pattern for manifest files */
  pattern?: string;
  /** Whether to include detailed error messages */
  verbose?: boolean;
}

/**
 * Validate a single manifest file
 */
export async function validateManifestFile(filePath: string): Promise<FileValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  try {
    const content = await readFile(filePath, "utf-8");
    let manifest: unknown;

    try {
      manifest = JSON.parse(content);
    } catch (parseError) {
      errors.push({
        file: filePath,
        field: "/",
        message: `Invalid JSON: ${parseError instanceof Error ? parseError.message : "Parse error"}`,
        code: "PARSE_ERROR",
      });
      return { file: filePath, valid: false, errors, warnings };
    }

    const validate = getManifestValidator();
    const valid = validate(manifest);

    if (!valid && validate.errors) {
      const formattedErrors = formatAjvErrors(validate.errors);
      for (const msg of formattedErrors) {
        const error = formatManifestError(filePath, msg);
        errors.push(error);
      }
    }

    // Check for optional field warnings
    const manifestData = manifest as ContractManifest;
    if (!manifestData.tokensUsed || manifestData.tokensUsed.length === 0) {
      warnings.push(
        formatManifestWarning(
          filePath,
          "/tokensUsed",
          "No tokens specified - consider adding token usage"
        )
      );
    }

    if (!manifestData.recommendedUsage) {
      warnings.push(
        formatManifestWarning(
          filePath,
          "/recommendedUsage",
          "No recommended usage guidance provided"
        )
      );
    }

    return {
      file: filePath,
      valid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (err) {
    errors.push({
      file: filePath,
      field: "/",
      message: `Failed to read file: ${err instanceof Error ? err.message : "Unknown error"}`,
      code: "FILE_NOT_FOUND",
    });
    return { file: filePath, valid: false, errors, warnings };
  }
}

/**
 * Discover all manifest files matching the pattern
 */
export async function discoverManifests(options: ValidateManifestsOptions = {}): Promise<string[]> {
  const { rootDir = process.cwd(), pattern = DEFAULT_MANIFEST_PATTERN } = options;

  const files = await glob(pattern, {
    cwd: rootDir,
    absolute: true,
    ignore: ["**/node_modules/**", "**/dist/**"],
  });

  return files;
}

/**
 * Validate all manifests matching the pattern
 */
export async function validateAllManifests(
  options: ValidateManifestsOptions = {}
): Promise<ValidationResult> {
  const result = createEmptyResult();
  const files = await discoverManifests(options);

  if (files.length === 0) {
    return result;
  }

  for (const file of files) {
    const fileResult = await validateManifestFile(file);
    result.files.push(fileResult);
    result.errors.push(...fileResult.errors);
    result.warnings.push(...fileResult.warnings);
  }

  result.valid = result.errors.length === 0;
  result.errorCount = result.errors.length;
  result.warningCount = result.warnings.length;

  return result;
}

/**
 * Load and validate a manifest, returning the typed manifest if valid
 */
export async function loadAndValidateManifest(
  filePath: string
): Promise<{ manifest: ContractManifest | null; result: FileValidationResult }> {
  const result = await validateManifestFile(filePath);

  if (!result.valid) {
    return { manifest: null, result };
  }

  const content = await readFile(filePath, "utf-8");
  const manifest = JSON.parse(content) as ContractManifest;

  return { manifest, result };
}

/**
 * Load all valid manifests from directory
 */
export async function loadValidManifests(
  options: ValidateManifestsOptions = {}
): Promise<{ manifests: ContractManifest[]; result: ValidationResult }> {
  const result = await validateAllManifests(options);
  const manifests: ContractManifest[] = [];

  for (const fileResult of result.files) {
    if (fileResult.valid) {
      const content = await readFile(fileResult.file, "utf-8");
      manifests.push(JSON.parse(content) as ContractManifest);
    }
  }

  return { manifests, result };
}

/**
 * Options for loading manifests from content packs
 */
export interface LoadManifestsFromPacksOptions {
  /** Content packs to load from (in priority order) */
  packs: ContentPack[];
  /** Whether to merge overlays with base manifests */
  mergeOverlays?: boolean;
}

/**
 * Load valid manifests from content packs with overlay resolution
 *
 * Loads manifests from all packs and merges overlays with base manifests.
 * The result respects overlay precedence - tenant overrides base.
 */
export async function loadValidManifestsFromPacks(
  options: LoadManifestsFromPacksOptions
): Promise<{ manifests: ContractManifest[]; result: ValidationResult }> {
  const { packs, mergeOverlays = true } = options;
  const manifestMap = new Map<string, ContractManifest>();
  const result = createEmptyResult();

  // Process packs in reverse order (base first) so overlays override
  const reversedPacks = [...packs].reverse();

  for (const pack of reversedPacks) {
    const packResult = await validateAllManifests({
      rootDir: pack.root,
      pattern: "**/components/**/manifest.json",
    });

    result.files.push(...packResult.files);
    result.errors.push(...packResult.errors);
    result.warnings.push(...packResult.warnings);

    for (const fileResult of packResult.files) {
      if (fileResult.valid) {
        const content = await readFile(fileResult.file, "utf-8");
        const manifest = JSON.parse(content) as ContractManifest;
        const existing = manifestMap.get(manifest.id);

        if (existing && pack.type === "overlay" && mergeOverlays) {
          // Merge overlay on top of base
          manifestMap.set(manifest.id, mergeManifests(existing, manifest));
        } else if (!existing || pack.type === "overlay") {
          // New manifest or overlay replacement
          manifestMap.set(manifest.id, manifest);
        }
      }
    }
  }

  result.valid = result.errors.length === 0;
  result.errorCount = result.errors.length;
  result.warningCount = result.warnings.length;

  return { manifests: Array.from(manifestMap.values()), result };
}
