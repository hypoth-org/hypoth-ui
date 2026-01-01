/**
 * MDX frontmatter validation using the contract schema
 */

import { readFile } from "node:fs/promises";
import { glob } from "glob";
import matter from "gray-matter";

import type { DocsFrontmatter } from "../types/manifest.js";
import type {
  FileValidationResult,
  ValidationError,
  ValidationResult,
  ValidationWarning,
} from "../types/validation.js";
import { createEmptyResult } from "../types/validation.js";
import { formatDocsError } from "./error-messages.js";
import { formatAjvErrors, getFrontmatterValidator } from "./schema-compiler.js";

/**
 * Default pattern for discovering docs files
 */
export const DEFAULT_DOCS_PATTERN = "**/docs-content/**/*.mdx";

/**
 * Options for docs validation
 */
export interface ValidateDocsOptions {
  /** Root directory to search for docs */
  rootDir?: string;
  /** Glob pattern for docs files */
  pattern?: string;
  /** Whether to include detailed error messages */
  verbose?: boolean;
}

/**
 * Extract frontmatter from MDX content
 */
export function extractFrontmatter(
  content: string
): { data: Record<string, unknown>; content: string } | null {
  try {
    const result = matter(content);
    return { data: result.data, content: result.content };
  } catch {
    return null;
  }
}

/**
 * Validate a single docs file's frontmatter
 */
export async function validateDocsFile(filePath: string): Promise<FileValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  try {
    const content = await readFile(filePath, "utf-8");
    const parsed = extractFrontmatter(content);

    if (!parsed) {
      errors.push({
        file: filePath,
        field: "/",
        message: "Failed to parse frontmatter",
        code: "PARSE_ERROR",
      });
      return { file: filePath, valid: false, errors, warnings };
    }

    const { data: frontmatter } = parsed;

    // Check if frontmatter exists
    if (Object.keys(frontmatter).length === 0) {
      errors.push({
        file: filePath,
        field: "/",
        message: "Documentation file must have frontmatter with title, component, and status",
        code: "MISSING_REQUIRED_FIELD",
      });
      return { file: filePath, valid: false, errors, warnings };
    }

    const validate = getFrontmatterValidator();
    const valid = validate(frontmatter);

    if (!valid && validate.errors) {
      const formattedErrors = formatAjvErrors(validate.errors);
      for (const msg of formattedErrors) {
        const error = formatDocsError(filePath, msg);
        errors.push(error);
      }
    }

    // Check for optional field warnings
    const fm = frontmatter as unknown as DocsFrontmatter;
    if (!fm.description) {
      warnings.push({
        file: filePath,
        field: "/description",
        message: "No description provided - consider adding for SEO",
        code: "MISSING_OPTIONAL_FIELD",
      });
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
 * Discover all docs files matching the pattern
 */
export async function discoverDocs(options: ValidateDocsOptions = {}): Promise<string[]> {
  const { rootDir = process.cwd(), pattern = DEFAULT_DOCS_PATTERN } = options;

  const files = await glob(pattern, {
    cwd: rootDir,
    absolute: true,
    ignore: ["**/node_modules/**", "**/dist/**"],
  });

  return files;
}

/**
 * Validate all docs matching the pattern
 */
export async function validateAllDocs(
  options: ValidateDocsOptions = {}
): Promise<ValidationResult> {
  const result = createEmptyResult();
  const files = await discoverDocs(options);

  if (files.length === 0) {
    return result;
  }

  for (const file of files) {
    const fileResult = await validateDocsFile(file);
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
 * Load and validate a docs file, returning the typed frontmatter if valid
 */
export async function loadAndValidateDocs(
  filePath: string
): Promise<{ frontmatter: DocsFrontmatter | null; content: string; result: FileValidationResult }> {
  const result = await validateDocsFile(filePath);

  if (!result.valid) {
    return { frontmatter: null, content: "", result };
  }

  const fileContent = await readFile(filePath, "utf-8");
  const parsed = extractFrontmatter(fileContent);

  if (!parsed) {
    return { frontmatter: null, content: "", result };
  }

  return {
    frontmatter: parsed.data as unknown as DocsFrontmatter,
    content: parsed.content,
    result,
  };
}
