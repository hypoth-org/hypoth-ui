import { readFile, readdir } from "node:fs/promises";
import { join, basename } from "node:path";

/**
 * Component manifest as loaded from JSON files
 */
export interface ComponentManifest {
  id: string;
  name: string;
  description?: string;
  status: "alpha" | "beta" | "stable" | "deprecated";
  since?: string;
  availabilityTags: Array<"public" | "enterprise" | "internal-only" | "regulated">;
  platforms: string[];
  a11y: {
    apgPattern?: string;
    role?: string;
    keyboardSupport?: string[];
    keyboardInteractions?: Array<{ key: string; action: string }>;
    knownLimitations?: string[];
    ariaRoles?: string[];
    ariaAttributes?: string[];
    focusManagement?: string;
  };
  tokensUsed: string[];
  slots?: Array<{ name: string; description: string }>;
  cssCustomProperties?: Array<{ name: string; description: string }>;
  props?: Array<{
    name: string;
    type: string;
    default?: string;
    description: string;
    required?: boolean;
  }>;
  events?: Array<{
    name: string;
    description: string;
    detail?: string;
  }>;
  examples?: Array<{
    title: string;
    code: string;
    description?: string;
  }>;
  recommendedUsage: string | string[];
  antiPatterns: string | string[];
  relatedComponents?: string[];
  category: string;
}

/**
 * Options for loading manifests
 */
export interface LoadManifestsOptions {
  /** Directory containing manifest JSON files */
  manifestsDir: string;
}

/**
 * Result of loading manifests
 */
export interface LoadManifestsResult {
  manifests: ComponentManifest[];
  errors: Array<{ file: string; error: string }>;
}

/**
 * Load all component manifests from a directory
 */
export async function loadManifests(
  options: LoadManifestsOptions
): Promise<LoadManifestsResult> {
  const { manifestsDir } = options;
  const manifests: ComponentManifest[] = [];
  const errors: Array<{ file: string; error: string }> = [];

  let files: string[];
  try {
    files = await readdir(manifestsDir);
  } catch (err) {
    return {
      manifests: [],
      errors: [{ file: manifestsDir, error: `Failed to read directory: ${err}` }],
    };
  }

  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  for (const file of jsonFiles) {
    const filePath = join(manifestsDir, file);
    try {
      const content = await readFile(filePath, "utf-8");
      const manifest = JSON.parse(content) as ComponentManifest;
      manifests.push(manifest);
    } catch (err) {
      errors.push({
        file,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { manifests, errors };
}

/**
 * Load a single component manifest by ID
 */
export async function loadManifestById(
  manifestsDir: string,
  id: string
): Promise<ComponentManifest | null> {
  const filePath = join(manifestsDir, `${id}.json`);
  try {
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content) as ComponentManifest;
  } catch {
    return null;
  }
}

/**
 * Get manifest file path for a component ID
 */
export function getManifestPath(manifestsDir: string, id: string): string {
  return join(manifestsDir, `${id}.json`);
}
