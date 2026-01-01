// Manifest loading and validation (legacy)
export {
  loadManifests,
  loadManifestById,
  getManifestPath,
  type ComponentManifest,
  type LoadManifestsOptions,
  type LoadManifestsResult,
} from "./manifest/loader.js";

export {
  validateManifest,
  validateManifests,
  createManifestValidator,
  type ValidationResult,
} from "./manifest/validator.js";

// Contract-based types (new)
export type {
  Edition,
  ComponentStatus,
  Platform,
  ComponentAccessibility,
  ContractManifest,
  EditionConfig,
  EditionMap,
  DocsFrontmatter,
} from "./types/manifest.js";

export type {
  ValidationErrorCode,
  ValidationWarningCode,
  ValidationError,
  ValidationWarning,
  FileValidationResult,
  ValidationResult as ContractValidationResult,
  ValidationOptions,
} from "./types/validation.js";

export {
  formatValidationError,
  formatValidationWarning,
  createEmptyResult,
  mergeResults,
} from "./types/validation.js";

// Edition utilities
export {
  EDITION_HIERARCHY,
  ALL_EDITIONS,
  getEditionLevel,
  isEditionAvailable,
  getIncludedEditions,
  isComponentAvailable,
  getMinimumEdition,
  filterAvailableEditions,
  isValidEdition,
  parseEdition,
} from "./validation/edition-utils.js";

// Schema validators
export {
  getManifestValidator,
  getFrontmatterValidator,
  getEditionConfigValidator,
  resetValidators,
  formatAjvErrors,
} from "./validation/schema-compiler.js";

// Manifest validation
export {
  validateManifestFile,
  validateAllManifests,
  discoverManifests,
  loadValidManifests,
  loadAndValidateManifest,
  DEFAULT_MANIFEST_PATTERN,
  type ValidateManifestsOptions,
} from "./validation/validate-manifests.js";

// Docs frontmatter validation
export {
  validateDocsFile,
  validateAllDocs,
  discoverDocs,
  loadAndValidateDocs,
  extractFrontmatter,
  DEFAULT_DOCS_PATTERN,
  type ValidateDocsOptions,
} from "./validation/validate-frontmatter.js";

// Cross-reference validation
export {
  buildManifestMap,
  validateCrossRefs,
  validateAllCrossRefs,
  findOrphanedDocs,
  findUndocumentedComponents,
  generateCrossRefReport,
  type ManifestMap,
  type CrossRefReport,
} from "./validation/validate-cross-refs.js";

// Error message formatting
export {
  formatErrorForConsole,
  formatWarningForConsole,
  formatManifestError,
  formatDocsError,
  formatManifestWarning,
  createCrossRefError,
  createStatusMismatchWarning,
} from "./validation/error-messages.js";

// Content parsing
export {
  parseFrontmatter,
  parseFrontmatterFromFile,
  isVisibleForEdition,
  extractCategories,
  type ContentFrontmatter,
  type ParsedContent,
} from "./content/frontmatter.js";

// Edition filtering
export {
  isComponentVisibleForEdition,
  filterComponentsForEdition,
  isContentVisibleForEdition,
  getEffectiveContentPath,
  createDefaultEdition,
  createEnterpriseEdition,
  mergeEditionConfigs,
  type FilterOptions,
} from "./filter/edition-filter.js";

// Navigation generation
export {
  generateNavigation,
  flattenNavigation,
  findNavItemByHref,
  getBreadcrumbs,
  type NavItem,
  type NavigationTree,
  type GenerateNavigationOptions,
} from "./nav/navigation.js";

// Edition map generation
export {
  generateEditionMap,
  getComponentsForEdition,
  isComponentInEdition,
  getMinimumEditionForComponent,
  DEFAULT_EDITION_MAP_PATH,
  type GenerateEditionMapOptions,
} from "./validation/generate-edition-map.js";

// Edition config loading
export {
  loadEditionConfig,
  getCurrentEdition,
  mergeEditionConfigs as mergeEditionConfigsNew,
  DEFAULT_EDITION_CONFIG,
  EDITION_CONFIG_FILE_NAMES,
  type LoadEditionConfigOptions,
  type LoadEditionConfigResult,
} from "./validation/load-edition-config.js";

// Navigation filtering
export {
  filterNavigationForEdition,
  getUpgradePromptData,
  buildNavigationFromEditionMap,
  type NavItem as FilteredNavItem,
  type NavigationFilterOptions,
  type UpgradePromptData,
} from "./validation/navigation-filter.js";
