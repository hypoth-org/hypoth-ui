/**
 * Content Resolver for Next.js
 *
 * Wraps docs-core overlay functions for Next.js usage, providing
 * content resolution through the overlay chain (tenant packs first, then base).
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  type ContentPack,
  type ContractManifest,
  type EditionConfigExtended,
  type ResolvedContent,
  contentExists,
  getAllContentPaths,
  initContentPacks,
  loadEditionConfigExtended,
  loadValidManifests,
  mergeManifests,
  resolveAllContent,
  resolveContent,
} from "@ds/docs-core";

/**
 * Cached content packs (initialized once per build)
 */
let cachedContentPacks: ContentPack[] | null = null;
let cachedEditionConfig: EditionConfigExtended | null = null;

/**
 * Get the edition config, with caching
 */
export async function getEditionConfig(): Promise<EditionConfigExtended> {
  if (cachedEditionConfig) {
    return cachedEditionConfig;
  }

  const { config } = await loadEditionConfigExtended({
    configDir: process.cwd(),
    logWarnings: process.env.NODE_ENV === "development",
  });

  cachedEditionConfig = config;
  return config;
}

/**
 * Get initialized content packs, with caching
 */
export async function getContentPacks(): Promise<ContentPack[]> {
  if (cachedContentPacks) {
    return cachedContentPacks;
  }

  const config = await getEditionConfig();

  // Determine base content pack root
  // Check for local development path first, then node_modules
  let basePackRoot = join(process.cwd(), "..", "docs-content");
  if (!existsSync(basePackRoot)) {
    basePackRoot = join(process.cwd(), "node_modules/@ds/docs-content");
  }

  // Initialize content packs from config
  const packs = await initContentPacks({
    basePackRoot,
    overlayPacks: config.contentPacks,
    resolvePackageRoot: (packageName) => {
      // Try node_modules first
      const nodeModulesPath = join(process.cwd(), "node_modules", packageName);
      if (existsSync(nodeModulesPath)) {
        return nodeModulesPath;
      }
      // Try sibling package in monorepo
      const siblingPath = join(process.cwd(), "..", packageName.replace("@ds/", ""));
      if (existsSync(siblingPath)) {
        return siblingPath;
      }
      return nodeModulesPath;
    },
  });

  cachedContentPacks = packs;
  return packs;
}

/**
 * Reset cached values (useful for testing or hot reload)
 */
export function resetContentCache(): void {
  cachedContentPacks = null;
  cachedEditionConfig = null;
}

/**
 * Resolve a single content file through the overlay chain
 */
export async function resolveContentFile(
  contentPath: string,
  parseContent = false
): Promise<ResolvedContent | null> {
  const packs = await getContentPacks();
  return resolveContent(contentPath, { packs, parseContent });
}

/**
 * Resolve all content files matching a pattern
 */
export async function resolveAllContentFiles(
  directory: string,
  pattern: RegExp
): Promise<ResolvedContent[]> {
  const packs = await getContentPacks();
  return resolveAllContent(directory, pattern, { packs });
}

/**
 * Check if content exists in any pack
 */
export async function doesContentExist(contentPath: string): Promise<boolean> {
  const packs = await getContentPacks();
  return contentExists(contentPath, packs);
}

/**
 * Get all content paths for a directory and extension
 */
export async function getContentPaths(
  directory: string,
  extension: string
): Promise<Array<{ path: string; source: string }>> {
  const packs = await getContentPacks();
  return getAllContentPaths(directory, extension, packs);
}

/**
 * Load all valid manifests from content packs with overlay resolution
 */
export async function loadManifestsFromPacks(): Promise<ContractManifest[]> {
  const packs = await getContentPacks();
  const manifestMap = new Map<string, ContractManifest>();

  // Process packs in reverse order (base first) so overlays override
  const reversedPacks = [...packs].reverse();

  for (const pack of reversedPacks) {
    const { manifests } = await loadValidManifests({
      rootDir: pack.root,
      pattern: "**/components/**/manifest.json",
    });

    for (const manifest of manifests) {
      const existing = manifestMap.get(manifest.id);
      if (existing && pack.type === "overlay") {
        // Merge overlay on top of base
        manifestMap.set(manifest.id, mergeManifests(existing, manifest));
      } else if (!existing) {
        manifestMap.set(manifest.id, manifest);
      }
    }
  }

  return Array.from(manifestMap.values());
}

/**
 * Load a single manifest by ID with overlay resolution
 */
export async function loadManifestByIdFromPacks(
  id: string
): Promise<ContractManifest | null> {
  const manifests = await loadManifestsFromPacks();
  return manifests.find((m) => m.id === id) ?? null;
}

/**
 * Discover all guides from content packs
 */
export async function discoverGuides(): Promise<
  Array<{ id: string; path: string; source: string }>
> {
  const paths = await getContentPaths("guides", ".mdx");

  return paths.map(({ path, source }) => {
    // Extract ID from path: guides/some-guide.mdx -> some-guide
    const id = path
      .replace(/^guides\//, "")
      .replace(/\.mdx$/, "")
      .split("/")
      .pop() ?? path;

    return { id, path, source };
  });
}

/**
 * Discover all component docs from content packs
 */
export async function discoverComponentDocs(): Promise<
  Array<{ id: string; path: string; source: string }>
> {
  const paths = await getContentPaths("components", ".mdx");

  return paths.map(({ path, source }) => {
    // Extract ID from path: components/button.mdx -> button
    const id = path
      .replace(/^components\//, "")
      .replace(/\.mdx$/, "")
      .split("/")
      .pop() ?? path;

    return { id, path, source };
  });
}
