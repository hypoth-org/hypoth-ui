// Manifest loading and validation
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
  type EditionConfig,
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
