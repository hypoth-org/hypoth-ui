/**
 * File copy utilities for copy mode installation
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { ComponentDefinition, ComponentFile, DSConfig, Framework } from "../types/index.js";

/**
 * Copy component files to the target directory
 */
export async function copyComponentFiles(
  component: ComponentDefinition,
  config: DSConfig,
  options: {
    cwd?: string;
    overwrite?: boolean;
    sourceDir?: string;
  } = {}
): Promise<CopyResult> {
  const { cwd = process.cwd(), overwrite = false, sourceDir } = options;
  const targetDir = join(cwd, config.paths.components);

  // Filter files for the user's framework
  const files = filterFilesForFramework(component.files, config.framework);

  const result: CopyResult = {
    copied: [],
    skipped: [],
    errors: [],
  };

  for (const file of files) {
    const targetPath = join(targetDir, component.name, file.target);

    // Check if file already exists
    if (existsSync(targetPath) && !overwrite) {
      result.skipped.push({
        file: file.target,
        reason: "exists",
      });
      continue;
    }

    try {
      // Get source content
      const content = await getSourceContent(file, component, sourceDir);

      // Transform imports based on aliases
      const transformedContent = transformImports(content, config, file.type);

      // Ensure directory exists
      const dir = dirname(targetPath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      // Write file
      writeFileSync(targetPath, transformedContent, "utf-8");
      result.copied.push(targetPath);
    } catch (error) {
      result.errors.push({
        file: file.target,
        error: (error as Error).message,
      });
    }
  }

  return result;
}

/**
 * Filter files based on target framework
 * - Files without framework specified are included for all
 * - React files are used for react and next frameworks
 * - WC files are used for wc and vanilla frameworks
 */
export function filterFilesForFramework(
  files: ComponentFile[],
  framework: Framework
): ComponentFile[] {
  const frameworkMap: Record<Framework, "react" | "wc"> = {
    react: "react",
    next: "react",
    wc: "wc",
    vanilla: "wc",
  };

  const targetFramework = frameworkMap[framework];

  return files.filter((file) => {
    // Shared files (no framework specified) are always included
    if (!file.framework) {
      return true;
    }
    // Framework-specific files only included if they match
    return file.framework === targetFramework;
  });
}

/**
 * Get source content for a component file
 * In production, this would fetch from bundled templates or remote URL
 * For now, reads from local source directory if provided
 */
async function getSourceContent(
  file: ComponentFile,
  component: ComponentDefinition,
  sourceDir?: string
): Promise<string> {
  if (sourceDir) {
    // Read from local source directory (for development/testing)
    const sourcePath = join(sourceDir, component.name, file.path);
    if (existsSync(sourcePath)) {
      return readFileSync(sourcePath, "utf-8");
    }
  }

  // Try bundled templates directory
  const bundledPath = getBundledTemplatePath(component.name, file.path);
  if (existsSync(bundledPath)) {
    return readFileSync(bundledPath, "utf-8");
  }

  throw new Error(`Source file not found: ${file.path}`);
}

/**
 * Get path to bundled template file
 */
function getBundledTemplatePath(componentName: string, filePath: string): string {
  // Templates are bundled relative to CLI package
  // In production, these would be in packages/cli/templates/
  const __dirname = new URL(".", import.meta.url).pathname;
  return join(__dirname, "../../templates", componentName, filePath);
}

/**
 * Transform imports in source code to use configured aliases
 */
export function transformImports(
  content: string,
  config: DSConfig,
  fileType: ComponentFile["type"]
): string {
  // Only transform TypeScript/JavaScript files
  if (fileType !== "ts" && fileType !== "tsx") {
    return content;
  }

  let result = content;

  // Transform @/components imports
  result = result.replace(/@\/components\//g, `${config.aliases.components}/`);

  // Transform @/lib imports
  result = result.replace(/@\/lib\//g, `${config.aliases.lib}/`);

  return result;
}

/**
 * Check if a component's files already exist
 */
export function componentFilesExist(
  component: ComponentDefinition,
  config: DSConfig,
  cwd: string = process.cwd()
): ExistingFilesCheck {
  const targetDir = join(cwd, config.paths.components);
  const files = filterFilesForFramework(component.files, config.framework);

  const existing: string[] = [];
  const missing: string[] = [];

  for (const file of files) {
    const targetPath = join(targetDir, component.name, file.target);
    if (existsSync(targetPath)) {
      existing.push(file.target);
    } else {
      missing.push(file.target);
    }
  }

  return {
    hasExisting: existing.length > 0,
    allExist: missing.length === 0,
    existing,
    missing,
  };
}

/**
 * Ensure the components directory exists
 */
export function ensureComponentsDir(config: DSConfig, cwd: string = process.cwd()): void {
  const targetDir = join(cwd, config.paths.components);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }
}

/**
 * Get the target path for a component
 */
export function getComponentTargetPath(
  componentName: string,
  config: DSConfig,
  cwd: string = process.cwd()
): string {
  return join(cwd, config.paths.components, componentName);
}

// =============================================================================
// Types
// =============================================================================

export interface CopyResult {
  /** Files successfully copied */
  copied: string[];
  /** Files skipped (with reason) */
  skipped: Array<{
    file: string;
    reason: "exists" | "filtered";
  }>;
  /** Files that failed to copy */
  errors: Array<{
    file: string;
    error: string;
  }>;
}

export interface ExistingFilesCheck {
  /** Whether any files exist */
  hasExisting: boolean;
  /** Whether all files exist */
  allExist: boolean;
  /** List of existing files */
  existing: string[];
  /** List of missing files */
  missing: string[];
}
