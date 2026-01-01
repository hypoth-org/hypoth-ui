/**
 * Edition Map Generator
 *
 * Generates a static edition map from component manifests for SSR filtering.
 * The edition map allows the docs site to filter components by edition tier
 * without needing to read all manifests at runtime.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import type { Edition, EditionMap } from "../types/manifest.js";
import { EDITION_HIERARCHY } from "./edition-utils.js";
import { loadValidManifests } from "./validate-manifests.js";

/**
 * Options for edition map generation
 */
export interface GenerateEditionMapOptions {
  /** Root directory to search for manifests */
  rootDir?: string;
  /** Output file path for the edition map */
  outputPath?: string;
  /** Glob pattern for manifest files */
  pattern?: string;
}

/**
 * Default output path for the edition map
 */
export const DEFAULT_EDITION_MAP_PATH = "packages/docs-core/src/generated/edition-map.json";

/**
 * Generate an edition map from component manifests
 */
export async function generateEditionMap(
  options: GenerateEditionMapOptions = {}
): Promise<{ editionMap: EditionMap; outputPath: string }> {
  const {
    rootDir = process.cwd(),
    outputPath = join(rootDir, DEFAULT_EDITION_MAP_PATH),
    pattern = "**/components/**/manifest.json",
  } = options;

  // Load valid manifests
  const { manifests, result } = await loadValidManifests({
    rootDir,
    pattern,
  });

  if (result.errorCount > 0) {
    throw new Error(
      `Cannot generate edition map: ${result.errorCount} manifest validation errors. Run 'pnpm validate:manifests' for details.`
    );
  }

  // Build the edition map
  const editionMap: EditionMap = {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    components: {},
    editionHierarchy: EDITION_HIERARCHY,
  };

  for (const manifest of manifests) {
    editionMap.components[manifest.id] = {
      editions: manifest.editions,
      status: manifest.status,
      name: manifest.name,
    };
  }

  // Ensure output directory exists
  const outputDir = dirname(outputPath);
  await mkdir(outputDir, { recursive: true });

  // Write the edition map
  await writeFile(outputPath, JSON.stringify(editionMap, null, 2), "utf-8");

  return { editionMap, outputPath };
}

/**
 * Get components available for a specific edition
 */
export function getComponentsForEdition(
  editionMap: EditionMap,
  edition: Edition
): Array<{ id: string; name: string; status: string }> {
  const hierarchy = editionMap.editionHierarchy[edition] as Edition[];
  const includedEditions = new Set<Edition>([edition, ...hierarchy]);

  return Object.entries(editionMap.components)
    .filter(([, meta]) => meta.editions.some((e) => includedEditions.has(e)))
    .map(([id, meta]) => ({
      id,
      name: meta.name,
      status: meta.status,
    }));
}

/**
 * Check if a component is available for a specific edition
 */
export function isComponentInEdition(
  editionMap: EditionMap,
  componentId: string,
  edition: Edition
): boolean {
  const component = editionMap.components[componentId];
  if (!component) return false;

  const hierarchy = editionMap.editionHierarchy[edition] as Edition[];
  const includedEditions = new Set<Edition>([edition, ...hierarchy]);
  return component.editions.some((e) => includedEditions.has(e));
}

/**
 * Get the minimum edition required for a component
 */
export function getMinimumEditionForComponent(
  editionMap: EditionMap,
  componentId: string
): Edition | null {
  const component = editionMap.components[componentId];
  if (!component) return null;

  // Return the lowest edition tier that includes this component
  const editionOrder: Edition[] = ["core", "pro", "enterprise"];
  for (const edition of editionOrder) {
    if (component.editions.includes(edition)) {
      return edition;
    }
  }

  return null;
}
