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
  // Extended types for white-label docs
  ContentPackConfig,
  VisibilityConfig,
  BrandingConfig,
  FeatureConfig,
  UpgradeConfig,
  EditionConfigExtended,
  ContentPack,
  ResolvedContent,
  SearchEntry,
  SearchIndex,
  RequiredFeatureConfig,
  BrandingContextValue,
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
  getExtendedEditionConfigValidator,
  resetValidators,
  formatAjvErrors,
} from "./validation/schema-compiler.js";

// Manifest validation
export {
  validateManifestFile,
  validateAllManifests,
  discoverManifests,
  loadValidManifests,
  loadValidManifestsFromPacks,
  loadAndValidateManifest,
  DEFAULT_MANIFEST_PATTERN,
  type ValidateManifestsOptions,
  type LoadManifestsFromPacksOptions,
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
  isContentAvailableForEditionTier,
  filterContentForEdition,
  filterMdxContentForEdition,
  type FilterOptions,
  type FilterableContentSection,
} from "./filter/edition-filter.js";

// Navigation generation
export {
  generateNavigation,
  generateNavigationFromPacks,
  flattenNavigation,
  findNavItemByHref,
  getBreadcrumbs,
  type NavItem,
  type NavigationTree,
  type GenerateNavigationOptions,
  type GenerateNavigationFromPacksOptions,
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
  loadEditionConfigExtended,
  getCurrentEdition,
  mergeEditionConfigs as mergeEditionConfigsNew,
  mergeExtendedEditionConfigs,
  applyDefaultFeatures,
  DEFAULT_EDITION_CONFIG,
  DEFAULT_EXTENDED_EDITION_CONFIG,
  DEFAULT_FEATURES,
  EDITION_CONFIG_FILE_NAMES,
  EXTENDED_EDITION_CONFIG_FILE_NAMES,
  type LoadEditionConfigOptions,
  type LoadEditionConfigResult,
  type LoadExtendedEditionConfigOptions,
  type LoadExtendedEditionConfigResult,
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

// Content overlay resolution
export {
  initContentPacks,
  resolveContent,
  resolveAllContent,
  mergeManifests,
  contentExists,
  getAllContentPaths,
  validateOverlayReferences,
  detectContentPackCycles,
  validateContentPacks,
  type InitContentPacksOptions,
  type ResolveContentOptions,
  type CycleDetectionResult,
} from "./content/overlay.js";

// Search index generation
export {
  generateSearchIndex,
  serializeSearchIndex,
  createMinimalSearchIndex,
  type GenerateSearchIndexOptions,
} from "./search/indexer.js";

// Accessibility conformance
export {
  loadConformanceData,
  getCategories,
  filterConformanceData,
  loadTenantConformance,
  getLatestReportPath,
  createTenantConformanceLoader,
  createTenantConfig,
  DEFAULT_TENANT_CONFIG,
  type ConformanceStatus,
  type ComponentConformance,
  type ConformanceData,
  type CategoryInfo,
  type ConformanceFilterOptions,
  type TenantConformanceConfig,
  type TenantConformanceOptions,
} from "./conformance/index.js";
