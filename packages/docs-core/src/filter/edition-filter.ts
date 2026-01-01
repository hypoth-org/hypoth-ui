import type { ComponentManifest } from "../manifest/loader.js";
import type { ContentFrontmatter } from "../content/frontmatter.js";

/**
 * Edition configuration for white-label documentation filtering
 */
export interface EditionConfig {
  /** Unique edition identifier */
  id: string;
  /** Display name */
  name: string;
  /** Included availability tags (intersection filter) */
  availabilityFilter: Array<"public" | "enterprise" | "internal-only" | "regulated">;
  /** Explicitly excluded component IDs */
  excludeComponents: string[];
  /** Content file overrides (base path → overlay path) */
  contentOverlays: Record<string, string>;
  /** Branding customization */
  branding: {
    logoUrl: string;
    primaryColor: string;
    siteTitle?: string;
    faviconUrl?: string;
  };
  /** Feature flags */
  features?: {
    showSourceLinks?: boolean;
    enableSearch?: boolean;
    showVersions?: boolean;
  };
}

/**
 * Filter options
 */
export interface FilterOptions {
  /** The edition config to apply */
  edition: EditionConfig;
}

/**
 * Check if a component is visible for an edition
 */
export function isComponentVisibleForEdition(
  manifest: ComponentManifest,
  edition: EditionConfig
): boolean {
  // Check if explicitly excluded
  if (edition.excludeComponents.includes(manifest.id)) {
    return false;
  }

  // Check availability tag intersection
  const hasMatchingTag = manifest.availabilityTags.some((tag) =>
    edition.availabilityFilter.includes(tag)
  );

  return hasMatchingTag;
}

/**
 * Filter components for an edition
 */
export function filterComponentsForEdition(
  manifests: ComponentManifest[],
  edition: EditionConfig
): ComponentManifest[] {
  return manifests.filter((manifest) =>
    isComponentVisibleForEdition(manifest, edition)
  );
}

/**
 * Check if content is visible for an edition based on frontmatter
 */
export function isContentVisibleForEdition(
  frontmatter: ContentFrontmatter,
  edition: EditionConfig
): boolean {
  // If hidden, never show
  if (frontmatter.hidden) {
    return false;
  }

  // If editions specified in frontmatter, check if current edition is included
  if (frontmatter.editions && frontmatter.editions.length > 0) {
    return frontmatter.editions.includes(edition.id);
  }

  // If componentId specified, check if that component is visible
  // This will be handled at a higher level when we have manifest data

  // Default: visible
  return true;
}

/**
 * Get the effective content path, applying overlays if configured
 */
export function getEffectiveContentPath(
  basePath: string,
  edition: EditionConfig
): string {
  // Check if there's an overlay for this path
  const overlay = edition.contentOverlays[basePath];
  return overlay ?? basePath;
}

/**
 * Create a default edition config (shows all public components)
 */
export function createDefaultEdition(overrides?: Partial<EditionConfig>): EditionConfig {
  return {
    id: "default",
    name: "Default",
    availabilityFilter: ["public"],
    excludeComponents: [],
    contentOverlays: {},
    branding: {
      logoUrl: "/logo.svg",
      primaryColor: "#0066cc",
      siteTitle: "Design System",
    },
    features: {
      showSourceLinks: true,
      enableSearch: true,
      showVersions: true,
    },
    ...overrides,
  };
}

/**
 * Create an enterprise edition config
 */
export function createEnterpriseEdition(overrides?: Partial<EditionConfig>): EditionConfig {
  return {
    id: "enterprise",
    name: "Enterprise",
    availabilityFilter: ["public", "enterprise"],
    excludeComponents: [],
    contentOverlays: {},
    branding: {
      logoUrl: "/logo.svg",
      primaryColor: "#0066cc",
      siteTitle: "Design System - Enterprise",
    },
    features: {
      showSourceLinks: true,
      enableSearch: true,
      showVersions: true,
    },
    ...overrides,
  };
}

/**
 * Merge edition configs, with overrides taking precedence
 */
export function mergeEditionConfigs(
  base: EditionConfig,
  overrides: Partial<EditionConfig>
): EditionConfig {
  return {
    ...base,
    ...overrides,
    branding: {
      ...base.branding,
      ...overrides.branding,
    },
    features: {
      ...base.features,
      ...overrides.features,
    },
  };
}
