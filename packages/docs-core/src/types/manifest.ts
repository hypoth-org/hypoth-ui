/**
 * Component manifest types derived from component-manifest.schema.json
 * These types represent the new contract-based manifest format
 */

/**
 * Edition tiers for component availability
 */
export type Edition = "core" | "pro" | "enterprise";

/**
 * Component maturity status
 */
export type ComponentStatus = "experimental" | "alpha" | "beta" | "stable" | "deprecated";

/**
 * Platform availability
 */
export type Platform = "wc" | "react" | "html-recipe";

/**
 * Accessibility metadata for a component
 */
export interface ComponentAccessibility {
  /** ARIA Authoring Practices Guide pattern name */
  apgPattern: string;
  /** Supported keyboard interactions */
  keyboard: string[];
  /** Screen reader behavior notes */
  screenReader: string;
  /** ARIA roles, states, and properties used */
  ariaPatterns?: string[];
  /** Documented accessibility gaps or workarounds needed */
  knownLimitations?: string[];
}

/**
 * Component manifest following the contract schema
 * This is the canonical source of truth for component metadata
 */
export interface ContractManifest {
  /** JSON Schema reference for IDE support */
  $schema?: string;
  /** Unique identifier (kebab-case) */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Semantic version */
  version: string;
  /** Component maturity status */
  status: ComponentStatus;
  /** Short description (1-2 sentences) */
  description: string;
  /** Edition tiers where this component is available */
  editions: Edition[];
  /** Accessibility metadata */
  accessibility: ComponentAccessibility;
  /** Semantic token groups consumed by this component */
  tokensUsed?: string[];
  /** Short guidance on when to use this component */
  recommendedUsage?: string;
  /** What NOT to do with this component */
  antiPatterns?: string;
  /** Platforms where this component is available */
  platforms?: Platform[];
}

/**
 * Content pack configuration for overlay resolution
 */
export interface ContentPackConfig {
  /** Package name (e.g., "@tenant/docs-content") */
  package: string;
  /** Priority (higher = checked first for overlays) */
  priority?: number;
}

/**
 * Component visibility configuration
 */
export interface VisibilityConfig {
  /** Explicitly hidden component IDs */
  hiddenComponents?: string[];
  /** Explicitly shown component IDs (overrides edition filtering) */
  shownComponents?: string[];
}

/**
 * Branding configuration for white-label customization
 */
export interface BrandingConfig {
  /** Display name for header and titles */
  name?: string;
  /** Logo URL (absolute or relative to public/) */
  logo?: string;
  /** Primary brand color (CSS hex) */
  primaryColor?: string;
  /** Favicon URL */
  favicon?: string;
  /** Custom CSS file URL */
  customCss?: string;
}

/**
 * Feature toggles for optional UI elements
 */
export interface FeatureConfig {
  /** Show search input */
  search?: boolean;
  /** Show dark mode toggle */
  darkMode?: boolean;
  /** Show version switcher */
  versionSwitcher?: boolean;
  /** Show feedback widget */
  feedback?: boolean;
  /** Show source code links */
  sourceLinks?: boolean;
}

/**
 * Upgrade prompt configuration
 */
export interface UpgradeConfig {
  /** URL for upgrade CTA */
  url: string;
  /** CTA button text */
  ctaText?: string;
  /** Message shown on filtered content */
  message?: string;
}

/**
 * Edition configuration for tenant filtering
 */
export interface EditionConfig {
  /** JSON Schema reference for IDE support */
  $schema?: string;
  /** Active edition tier for this tenant */
  edition: Edition;
  /** Brand customization overrides */
  branding?: {
    name?: string;
    logo?: string;
    primaryColor?: string;
  };
  /** Feature toggles */
  features?: {
    search?: boolean;
    darkMode?: boolean;
    versionSwitcher?: boolean;
    feedback?: boolean;
  };
  /** URL for upgrade prompts */
  upgradeUrl?: string;
}

/**
 * Extended edition configuration for white-label docs
 * Includes content packs, visibility overrides, and upgrade prompts
 */
export interface EditionConfigExtended {
  /** JSON Schema reference for IDE support */
  $schema?: string;
  /** Configuration identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Active edition tier */
  edition: Edition;
  /** Content pack configuration */
  contentPacks?: ContentPackConfig[];
  /** Component visibility rules */
  visibility?: VisibilityConfig;
  /** Branding customization */
  branding?: BrandingConfig;
  /** Feature toggles */
  features?: FeatureConfig;
  /** Upgrade prompt configuration */
  upgrade?: UpgradeConfig;
}

/**
 * Generated edition map for SSR filtering
 */
export interface EditionMap {
  /** Schema version for compatibility checks */
  version: string;
  /** ISO timestamp of generation */
  generatedAt: string;
  /** Map of component id to metadata */
  components: Record<
    string,
    {
      editions: Edition[];
      status: ComponentStatus;
      name: string;
    }
  >;
  /** Edition inheritance hierarchy */
  editionHierarchy: {
    core: string[];
    pro: string[];
    enterprise: string[];
  };
}

/**
 * Documentation frontmatter following the contract schema
 * Note: component and status are required only for component docs,
 * not for general guides/tutorials
 */
export interface DocsFrontmatter {
  /** Page title */
  title: string;
  /** Meta description for SEO */
  description?: string;
  /** Reference to component id (must match manifest) - required for component docs */
  component?: string;
  /** Component status (should match manifest status) - required when component is specified */
  status?: ComponentStatus;
  /** Override editions (defaults to manifest editions if not specified) */
  editions?: Edition[];
  /** Last content update date */
  lastUpdated?: string;
  /** If true, page is excluded from production build */
  draft?: boolean;
  /** Sort order in navigation */
  order?: number;
  /** Navigation category grouping */
  category?: string;
  /** Searchable tags for discovery */
  tags?: string[];
}

/**
 * Metadata for a documentation content pack
 */
export interface ContentPack {
  /** Package identifier (e.g., "@ds/docs-content") */
  id: string;
  /** Absolute path to package root */
  root: string;
  /** Pack type: base provides foundation, overlay extends/overrides */
  type: "base" | "overlay";
  /** Priority for overlay resolution (higher = checked first) */
  priority: number;
  /** Package version from package.json */
  version: string;
}

/**
 * Result of resolving content through overlay chain
 */
export interface ResolvedContent {
  /** Content type */
  type: "manifest" | "mdx" | "asset";
  /** Original requested path (e.g., "components/button.mdx") */
  requestedPath: string;
  /** Resolved absolute file path */
  resolvedPath: string;
  /** Source pack that provided this content */
  source: {
    packId: string;
    packType: "base" | "overlay";
  };
  /** Whether content was overridden from base */
  isOverridden: boolean;
  /** Parsed content (if applicable) */
  content?: {
    frontmatter?: DocsFrontmatter;
    body?: string;
    manifest?: ContractManifest;
  };
}

/**
 * Search entry in the index
 */
export interface SearchEntry {
  /** Unique entry ID */
  id: string;
  /** Content type */
  type: "component" | "guide";
  /** Page title */
  title: string;
  /** Short description */
  description: string;
  /** URL path */
  url: string;
  /** Navigation category */
  category: string;
  /** Searchable tags */
  tags: string[];
  /** Indexed body content (first N characters) */
  excerpt: string;
  /** Component status (if applicable) */
  status?: ComponentStatus;
  /** Search ranking boost */
  boost?: number;
}

/**
 * Search index generated at build time
 */
export interface SearchIndex {
  /** Schema version for compatibility */
  version: "1.0.0";
  /** ISO timestamp of generation */
  generatedAt: string;
  /** Edition this index was generated for */
  edition: Edition;
  /** Indexed content entries */
  entries: SearchEntry[];
  /** Category facets for filtering */
  facets: {
    categories: string[];
    types: Array<"component" | "guide">;
    tags: string[];
  };
}

/**
 * Required feature configuration with all defaults applied
 */
export interface RequiredFeatureConfig {
  /** Show search input */
  search: boolean;
  /** Show dark mode toggle */
  darkMode: boolean;
  /** Show version switcher */
  versionSwitcher: boolean;
  /** Show feedback widget */
  feedback: boolean;
  /** Show source code links */
  sourceLinks: boolean;
}

/**
 * Branding values exposed via React context
 */
export interface BrandingContextValue {
  /** Site name */
  name: string;
  /** Logo URL (resolved) */
  logo: string | null;
  /** Primary color CSS value */
  primaryColor: string;
  /** Feature flags */
  features: RequiredFeatureConfig;
  /** Current edition */
  edition: Edition;
  /** Upgrade prompt data (if applicable) */
  upgrade: UpgradeConfig | null;
}
