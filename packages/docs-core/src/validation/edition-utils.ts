/**
 * Edition utilities for hierarchical edition filtering
 */

import type { Edition } from "../types/manifest.js";

/**
 * Edition hierarchy - each tier includes all lower tiers
 * core → pro → enterprise
 */
export const EDITION_HIERARCHY: Record<Edition, Edition[]> = {
  core: [],
  pro: ["core"],
  enterprise: ["core", "pro"],
};

/**
 * All available editions in order
 */
export const ALL_EDITIONS: Edition[] = ["core", "pro", "enterprise"];

/**
 * Get the numeric level of an edition (0 = core, 1 = pro, 2 = enterprise)
 */
export function getEditionLevel(edition: Edition): number {
  return ALL_EDITIONS.indexOf(edition);
}

/**
 * Check if targetEdition is available at the currentEdition level
 * e.g., "core" is available at "pro" level, but "enterprise" is not available at "pro" level
 */
export function isEditionAvailable(targetEdition: Edition, currentEdition: Edition): boolean {
  const targetLevel = getEditionLevel(targetEdition);
  const currentLevel = getEditionLevel(currentEdition);
  return targetLevel <= currentLevel;
}

/**
 * Get all editions included in the given edition (including itself)
 * e.g., "pro" includes ["core", "pro"]
 */
export function getIncludedEditions(edition: Edition): Edition[] {
  return [...EDITION_HIERARCHY[edition], edition];
}

/**
 * Check if a component with given editions is available at the current edition level
 * A component is available if ANY of its editions is available at the current level
 */
export function isComponentAvailable(
  componentEditions: Edition[],
  currentEdition: Edition
): boolean {
  const includedEditions = getIncludedEditions(currentEdition);
  return componentEditions.some((e) => includedEditions.includes(e));
}

/**
 * Get the minimum required edition for a component
 * Returns the lowest edition tier that includes this component
 */
export function getMinimumEdition(componentEditions: Edition[]): Edition {
  for (const edition of ALL_EDITIONS) {
    if (componentEditions.includes(edition)) {
      return edition;
    }
  }
  // Default to enterprise if no valid edition found
  return "enterprise";
}

/**
 * Filter a list of editions to only those available at the current level
 */
export function filterAvailableEditions(editions: Edition[], currentEdition: Edition): Edition[] {
  const includedEditions = getIncludedEditions(currentEdition);
  return editions.filter((e) => includedEditions.includes(e));
}

/**
 * Validate that an edition string is a valid Edition type
 */
export function isValidEdition(value: string): value is Edition {
  return ALL_EDITIONS.includes(value as Edition);
}

/**
 * Parse edition from environment variable or config
 */
export function parseEdition(value: string | undefined, defaultEdition: Edition = "core"): Edition {
  if (!value) {
    return defaultEdition;
  }
  return isValidEdition(value) ? value : defaultEdition;
}
