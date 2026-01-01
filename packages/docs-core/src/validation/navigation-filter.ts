/**
 * Navigation Filter for Edition-Based Filtering
 *
 * Provides utilities to filter navigation items based on edition configuration.
 * Works with the generated edition map for efficient SSR filtering.
 */

import type { Edition, EditionMap } from "../types/manifest.js";
import { getMinimumEditionForComponent, isComponentInEdition } from "./generate-edition-map.js";

/**
 * Navigation item structure
 */
export interface NavItem {
  /** Display title */
  title: string;
  /** URL path */
  href: string;
  /** Component ID (if this is a component page) */
  componentId?: string;
  /** Child navigation items */
  children?: NavItem[];
  /** Whether this item is disabled (edition not available) */
  disabled?: boolean;
  /** Required edition for this item */
  requiredEdition?: Edition;
}

/**
 * Filter options for navigation
 */
export interface NavigationFilterOptions {
  /** The edition map to use for filtering */
  editionMap: EditionMap;
  /** The current edition to filter for */
  edition: Edition;
  /** Whether to include disabled items (with upgrade prompts) */
  includeDisabled?: boolean;
  /** URL pattern for upgrade prompts */
  upgradeUrl?: string;
}

/**
 * Filter navigation items based on edition
 */
export function filterNavigationForEdition(
  items: NavItem[],
  options: NavigationFilterOptions
): NavItem[] {
  const { includeDisabled = false } = options;

  return items
    .map((item) => filterNavItem(item, options))
    .filter((item): item is NavItem => {
      if (item === null) return false;
      if (item.disabled && !includeDisabled) return false;
      return true;
    });
}

/**
 * Filter a single navigation item
 */
function filterNavItem(item: NavItem, options: NavigationFilterOptions): NavItem | null {
  const { editionMap, edition, includeDisabled = false } = options;

  // If this is a component item, check edition availability
  if (item.componentId) {
    const isAvailable = isComponentInEdition(editionMap, item.componentId, edition);

    if (!isAvailable) {
      if (includeDisabled) {
        const requiredEdition = getMinimumEditionForComponent(editionMap, item.componentId);
        return {
          ...item,
          disabled: true,
          requiredEdition: requiredEdition ?? undefined,
          children: undefined, // No children for disabled items
        };
      }
      return null;
    }
  }

  // Filter children recursively
  let filteredChildren: NavItem[] | undefined;
  if (item.children && item.children.length > 0) {
    filteredChildren = filterNavigationForEdition(item.children, options);

    // If all children were filtered out, hide the parent too
    if (filteredChildren.length === 0) {
      return null;
    }
  }

  return {
    ...item,
    children: filteredChildren,
  };
}

/**
 * Get upgrade prompt data for a disabled nav item
 */
export interface UpgradePromptData {
  /** The component that requires an upgrade */
  componentId: string;
  /** The component name */
  componentName: string;
  /** The current user edition */
  currentEdition: Edition;
  /** The required edition */
  requiredEdition: Edition;
  /** URL for upgrade */
  upgradeUrl: string;
}

/**
 * Get upgrade prompt data for a component
 */
export function getUpgradePromptData(
  componentId: string,
  editionMap: EditionMap,
  currentEdition: Edition,
  upgradeUrl: string
): UpgradePromptData | null {
  const component = editionMap.components[componentId];
  if (!component) return null;

  const requiredEdition = getMinimumEditionForComponent(editionMap, componentId);
  if (!requiredEdition) return null;

  // If already available, no upgrade needed
  if (isComponentInEdition(editionMap, componentId, currentEdition)) {
    return null;
  }

  return {
    componentId,
    componentName: component.name,
    currentEdition,
    requiredEdition,
    upgradeUrl,
  };
}

/**
 * Build navigation from edition map
 */
export function buildNavigationFromEditionMap(
  editionMap: EditionMap,
  options: {
    edition: Edition;
    basePath?: string;
    includeStatus?: boolean;
  }
): NavItem[] {
  const { edition, basePath = "/components", includeStatus = true } = options;

  const items: NavItem[] = [];

  for (const [id, meta] of Object.entries(editionMap.components)) {
    // Check if available for this edition
    const isAvailable = isComponentInEdition(editionMap, id, edition);
    if (!isAvailable) continue;

    const title =
      includeStatus && meta.status !== "stable" ? `${meta.name} (${meta.status})` : meta.name;

    items.push({
      title,
      href: `${basePath}/${id}`,
      componentId: id,
    });
  }

  // Sort alphabetically
  items.sort((a, b) => a.title.localeCompare(b.title));

  return items;
}
