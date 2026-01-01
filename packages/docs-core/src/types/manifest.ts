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
