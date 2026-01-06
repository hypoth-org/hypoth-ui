/**
 * Shared types for @hypoth-ui/cli
 * Based on data-model.md specification
 */

// =============================================================================
// Configuration (ds.config.json)
// =============================================================================

export interface DSConfig {
  /** Schema version for future migrations */
  $schema: string;

  /** Installation mode: copy sources or install packages */
  style: "copy" | "package";

  /** Detected or configured framework */
  framework: Framework;

  /** Whether project uses TypeScript */
  typescript: boolean;

  /** Detected package manager */
  packageManager: PackageManager;

  /** Path configuration */
  paths: {
    /** Where to copy components (copy mode only) */
    components: string;
    /** Where to place utility files */
    utils: string;
  };

  /** Import alias configuration (for path mapping) */
  aliases: {
    /** Maps @/components to actual path */
    components: string;
    /** Maps @/lib to actual path */
    lib: string;
  };

  /** Installed components registry */
  components: InstalledComponent[];
}

export interface InstalledComponent {
  /** Component identifier (e.g., "button") */
  name: string;
  /** Version installed */
  version: string;
  /** When installed */
  installedAt: string;
  /** Installation mode used */
  mode: "copy" | "package";
}

export type Framework = "react" | "next" | "wc" | "vanilla";
export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

// =============================================================================
// Component Registry (components.json)
// =============================================================================

export interface ComponentRegistry {
  /** Registry format version */
  version: string;

  /** Last updated timestamp */
  updatedAt: string;

  /** Available components */
  components: ComponentDefinition[];
}

export interface ComponentDefinition {
  /** Unique identifier (kebab-case) */
  name: string;

  /** Display name */
  displayName: string;

  /** Short description */
  description: string;

  /** Semantic version */
  version: string;

  /** Component maturity */
  status: "alpha" | "beta" | "stable";

  /** Supported frameworks */
  frameworks: ("react" | "wc")[];

  /** npm package dependencies (always installed) */
  dependencies: string[];

  /** Other components this depends on */
  registryDependencies: string[];

  /** Files to copy (copy mode) */
  files: ComponentFile[];

  /** Accessibility metadata */
  a11y: {
    apgPattern: string;
    keyboardSupport: string[];
  };
}

export interface ComponentFile {
  /** Relative path in source */
  path: string;
  /** Target filename (may differ per framework) */
  target: string;
  /** File type for syntax highlighting */
  type: "tsx" | "ts" | "css" | "json";
  /** Framework-specific (undefined = shared) */
  framework?: "react" | "wc";
}

// =============================================================================
// Detection Result
// =============================================================================

export interface DetectionResult {
  /** Detected framework */
  framework: Framework | "unknown";

  /** Detected package manager */
  packageManager: PackageManager;

  /** TypeScript detected */
  typescript: boolean;

  /** Path to tsconfig if exists */
  tsconfigPath?: string;

  /** Detected source directory */
  srcDir: string;

  /** Detection confidence */
  confidence: "high" | "medium" | "low";

  /** Signals used for detection */
  signals: string[];
}

// =============================================================================
// CLI Options
// =============================================================================

export interface InitOptions {
  style?: "copy" | "package";
  framework?: Framework;
  yes?: boolean;
}

export interface AddOptions {
  overwrite?: boolean;
  all?: boolean;
}

export interface ListOptions {
  json?: boolean;
}

export interface DiffOptions {
  json?: boolean;
}
