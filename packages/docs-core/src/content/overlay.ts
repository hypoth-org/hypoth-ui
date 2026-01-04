import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type {
  ContentPack,
  ContentPackConfig,
  ContractManifest,
  DocsFrontmatter,
  ResolvedContent,
} from "../types/manifest.js";
import { parseFrontmatter } from "./frontmatter.js";

/**
 * Options for initializing content packs
 */
export interface InitContentPacksOptions {
  /** Base content pack root directory */
  basePackRoot: string;
  /** Overlay content pack configurations */
  overlayPacks?: ContentPackConfig[];
  /** Function to resolve package root from package name */
  resolvePackageRoot?: (packageName: string) => string;
}

/**
 * Options for resolving content
 */
export interface ResolveContentOptions {
  /** Content packs to search (in priority order) */
  packs: ContentPack[];
  /** Parse content after resolution */
  parseContent?: boolean;
}

/**
 * Default package root resolver using node_modules
 */
function defaultResolvePackageRoot(packageName: string): string {
  // Try to resolve from node_modules
  try {
    const packagePath = require.resolve(`${packageName}/package.json`);
    return resolve(packagePath, "..");
  } catch {
    // Fallback to current working directory's node_modules
    return join(process.cwd(), "node_modules", packageName);
  }
}

/**
 * Read package.json to get version
 */
async function getPackageVersion(root: string): Promise<string> {
  try {
    const packageJsonPath = join(root, "package.json");
    const content = await readFile(packageJsonPath, "utf-8");
    const pkg = JSON.parse(content);
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

/**
 * Initialize content packs from configuration
 * Returns sorted array with overlays first (highest priority first), then base
 */
export async function initContentPacks(
  options: InitContentPacksOptions
): Promise<ContentPack[]> {
  const {
    basePackRoot,
    overlayPacks = [],
    resolvePackageRoot = defaultResolvePackageRoot,
  } = options;

  const packs: ContentPack[] = [];

  // Add base pack (always lowest priority = 0)
  const baseVersion = await getPackageVersion(basePackRoot);
  packs.push({
    id: "@ds/docs-content",
    root: basePackRoot,
    type: "base",
    priority: 0,
    version: baseVersion,
  });

  // Add overlay packs sorted by priority (descending)
  const sortedOverlays = [...overlayPacks].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
  );

  for (const overlay of sortedOverlays) {
    const root = resolvePackageRoot(overlay.package);
    if (existsSync(root)) {
      const version = await getPackageVersion(root);
      packs.push({
        id: overlay.package,
        root,
        type: "overlay",
        priority: overlay.priority ?? 1,
        version,
      });
    } else {
      console.warn(
        `[docs-core] Overlay pack not found: ${overlay.package} at ${root}`
      );
    }
  }

  // Return overlays first (sorted by priority desc), then base
  return packs.sort((a, b) => b.priority - a.priority);
}

/**
 * Validate that overlay content references existing base content
 * T061: Development mode validation for tenant overlays
 */
export function validateOverlayReferences(
  contentPath: string,
  packs: ContentPack[]
): { valid: boolean; warning?: string } {
  const basePack = packs.find((p) => p.type === "base");
  const overlayPacks = packs.filter((p) => p.type === "overlay");

  // Check if content exists in an overlay but not in base
  for (const overlay of overlayPacks) {
    const overlayPath = join(overlay.root, contentPath);

    if (existsSync(overlayPath)) {
      // This is an override - check if base exists
      if (basePack) {
        const basePath = join(basePack.root, contentPath);
        if (!existsSync(basePath)) {
          // Only warn in development mode
          if (process.env.NODE_ENV === "development") {
            const warning = `[docs-core] Overlay content '${contentPath}' in ${overlay.id} has no corresponding base content. This may be intentional for new tenant-only content.`;
            console.warn(warning);
            return { valid: true, warning };
          }
        }
      }
    }
  }

  return { valid: true };
}

/**
 * Resolve content path through overlay chain
 * Checks packs in priority order (overlays first, then base)
 */
export async function resolveContent(
  contentPath: string,
  options: ResolveContentOptions
): Promise<ResolvedContent | null> {
  const { packs, parseContent = false } = options;

  // T061: Validate overlay references in development
  if (process.env.NODE_ENV === "development") {
    validateOverlayReferences(contentPath, packs);
  }

  // Check each pack in priority order
  for (const pack of packs) {
    const fullPath = join(pack.root, contentPath);

    if (existsSync(fullPath)) {
      const isOverridden = pack.type === "overlay";

      const result: ResolvedContent = {
        type: getContentType(contentPath),
        requestedPath: contentPath,
        resolvedPath: fullPath,
        source: {
          packId: pack.id,
          packType: pack.type,
        },
        isOverridden,
      };

      // Parse content if requested
      if (parseContent) {
        result.content = await parseContentFile(fullPath, result.type);
      }

      return result;
    }
  }

  return null; // Not found in any pack
}

/**
 * Resolve all content files matching a pattern in the overlay chain
 * Returns deduplicated list with overlays taking precedence
 */
export async function resolveAllContent(
  directory: string,
  pattern: RegExp,
  options: ResolveContentOptions
): Promise<ResolvedContent[]> {
  const { packs } = options;
  const resolved = new Map<string, ResolvedContent>();

  // Process packs in priority order (overlays first)
  for (const pack of packs) {
    const dirPath = join(pack.root, directory);

    if (!existsSync(dirPath)) {
      continue;
    }

    // Use glob to find files matching pattern
    const { glob } = await import("glob");
    const files = await glob("**/*", {
      cwd: dirPath,
      nodir: true,
    });

    for (const file of files) {
      if (!pattern.test(file)) {
        continue;
      }

      const contentPath = join(directory, file);

      // Skip if already resolved (overlay takes precedence)
      if (resolved.has(contentPath)) {
        continue;
      }

      const fullPath = join(pack.root, contentPath);
      const isOverridden = pack.type === "overlay";

      resolved.set(contentPath, {
        type: getContentType(contentPath),
        requestedPath: contentPath,
        resolvedPath: fullPath,
        source: {
          packId: pack.id,
          packType: pack.type,
        },
        isOverridden,
      });
    }
  }

  return Array.from(resolved.values());
}

/**
 * Get content type from file path
 */
function getContentType(
  path: string
): "manifest" | "mdx" | "asset" {
  if (path.endsWith(".json") && path.includes("manifest")) {
    return "manifest";
  }
  if (path.endsWith(".mdx") || path.endsWith(".md")) {
    return "mdx";
  }
  return "asset";
}

/**
 * Parse content file based on type
 */
async function parseContentFile(
  filePath: string,
  type: "manifest" | "mdx" | "asset"
): Promise<ResolvedContent["content"]> {
  try {
    const content = await readFile(filePath, "utf-8");

    if (type === "manifest") {
      const manifest = JSON.parse(content) as ContractManifest;
      return { manifest };
    }

    if (type === "mdx") {
      const parsed = parseFrontmatter(content);
      return {
        frontmatter: parsed.frontmatter as DocsFrontmatter,
        body: parsed.content,
      };
    }

    return {};
  } catch (error) {
    console.error(`[docs-core] Failed to parse content: ${filePath}`, error);
    return {};
  }
}

/**
 * Merge manifests from overlay on top of base
 * Used when tenant extends a base component
 */
export function mergeManifests(
  base: ContractManifest,
  overlay: Partial<ContractManifest>
): ContractManifest {
  return {
    ...base,
    ...overlay,
    // Deep merge accessibility
    accessibility: {
      ...base.accessibility,
      ...overlay.accessibility,
    },
    // Merge arrays
    tokensUsed: overlay.tokensUsed ?? base.tokensUsed,
    platforms: overlay.platforms ?? base.platforms,
    editions: overlay.editions ?? base.editions,
  };
}

/**
 * Check if content path exists in any pack
 */
export function contentExists(
  contentPath: string,
  packs: ContentPack[]
): boolean {
  for (const pack of packs) {
    const fullPath = join(pack.root, contentPath);
    if (existsSync(fullPath)) {
      return true;
    }
  }
  return false;
}

/**
 * T062: Detect cycles in content pack dependencies
 * Checks if content packs have circular priority relationships
 */
export interface CycleDetectionResult {
  hasCycle: boolean;
  cycle?: string[];
  message?: string;
}

/**
 * Detect cycles in content pack priority chain
 * Content packs are ordered by priority - cycles can occur if
 * pack A depends on pack B which depends on pack A
 */
export function detectContentPackCycles(
  packs: ContentPack[]
): CycleDetectionResult {
  // For overlay-based systems, cycles manifest as:
  // 1. Duplicate pack IDs at different priorities
  // 2. Self-referencing packs

  const seenIds = new Map<string, number>();
  const duplicates: string[] = [];

  for (const pack of packs) {
    if (seenIds.has(pack.id)) {
      // Same pack appears multiple times
      duplicates.push(pack.id);
    }
    seenIds.set(pack.id, pack.priority);
  }

  if (duplicates.length > 0) {
    const cycle = duplicates;
    const message = `[docs-core] Content pack cycle detected: ${cycle.join(" -> ")}. Each pack ID should appear only once in the overlay chain.`;

    if (process.env.NODE_ENV === "development") {
      console.error(message);
    }

    return {
      hasCycle: true,
      cycle,
      message,
    };
  }

  return { hasCycle: false };
}

/**
 * Validate content pack configuration before use
 * Combines cycle detection and other validations
 */
export function validateContentPacks(packs: ContentPack[]): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for cycles
  const cycleResult = detectContentPackCycles(packs);
  if (cycleResult.hasCycle && cycleResult.message) {
    errors.push(cycleResult.message);
  }

  // Check for base pack
  const hasBase = packs.some((p) => p.type === "base");
  if (!hasBase) {
    warnings.push("[docs-core] No base content pack found. Content resolution may fail.");
  }

  // Check for overlays without base
  const hasOverlays = packs.some((p) => p.type === "overlay");
  if (hasOverlays && !hasBase) {
    warnings.push("[docs-core] Overlay packs found without a base pack.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get all available content paths from all packs
 * Returns deduplicated list with source information
 */
export async function getAllContentPaths(
  directory: string,
  extension: string,
  packs: ContentPack[]
): Promise<Array<{ path: string; source: string }>> {
  const paths = new Map<string, string>();

  // Process packs in priority order
  for (const pack of packs) {
    const dirPath = join(pack.root, directory);

    if (!existsSync(dirPath)) {
      continue;
    }

    const { glob } = await import("glob");
    const files = await glob(`**/*${extension}`, {
      cwd: dirPath,
      nodir: true,
    });

    for (const file of files) {
      const contentPath = join(directory, file);
      // Only set if not already present (overlay precedence)
      if (!paths.has(contentPath)) {
        paths.set(contentPath, pack.id);
      }
    }
  }

  return Array.from(paths.entries()).map(([path, source]) => ({
    path,
    source,
  }));
}
