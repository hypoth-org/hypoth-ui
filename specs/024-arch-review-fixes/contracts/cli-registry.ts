/**
 * CLI Registry Contract
 *
 * Defines the schema for the CLI component registry.
 * Used by hypoth-ui CLI for component installation.
 */

/**
 * Framework identifiers supported by the CLI.
 */
export type Framework = "react" | "wc";

/**
 * File types for template transformation handling.
 */
export type FileType = "ts" | "tsx" | "css" | "json";

/**
 * Individual file within a component template.
 */
export interface ComponentFile {
  /**
   * Source path relative to the template directory.
   * Example: "button.tsx"
   */
  path: string;

  /**
   * Target path relative to user's components directory.
   * Example: "button.tsx" or "button/index.tsx"
   */
  target: string;

  /**
   * File type for import transformation handling.
   * Only "ts" and "tsx" files have imports transformed.
   */
  type: FileType;

  /**
   * Framework filter. If specified, file is only copied for matching framework.
   * Omit for shared files that apply to all frameworks.
   */
  framework?: Framework;
}

/**
 * Component definition in the CLI registry.
 */
export interface ComponentDefinition {
  /**
   * Unique component identifier (kebab-case).
   * Must match directory name in templates/.
   * Example: "button", "alert-dialog", "radio-group"
   */
  name: string;

  /**
   * Human-readable description for CLI list output.
   */
  description: string;

  /**
   * Semantic version of the component template.
   */
  version: string;

  /**
   * Supported frameworks. Component will only be available for these.
   */
  frameworks: Framework[];

  /**
   * Other registry components this component depends on.
   * These will be installed automatically when this component is installed.
   * Values must be valid component names in the registry.
   */
  registryDependencies: string[];

  /**
   * npm packages required by this component.
   * CLI will install these via pnpm when component is added.
   */
  dependencies: string[];

  /**
   * Source files included in this component's template.
   */
  files: ComponentFile[];
}

/**
 * Root structure of the CLI registry file.
 */
export interface ComponentRegistry {
  /**
   * Schema version for backward compatibility.
   */
  version: string;

  /**
   * Array of all available components.
   */
  components: ComponentDefinition[];
}

/**
 * Contract: CLI registry MUST include all WC components.
 *
 * Requirements:
 * 1. Every directory in packages/wc/src/components/ MUST have a registry entry
 * 2. Component names MUST be consistent between WC and registry
 * 3. All registryDependencies MUST reference valid component names
 * 4. All files[].path MUST exist in templates/[name]/ directory
 */
export const CLI_REGISTRY_CONTRACT = {
  location: "packages/cli/registry/components.json",
  wcComponentsDir: "packages/wc/src/components/",
  templatesDir: "packages/cli/templates/",
  requirement: "1:1 mapping between WC components and registry entries",
} as const;
