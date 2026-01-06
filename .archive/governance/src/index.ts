/**
 * @ds/governance
 *
 * Governance tooling for the Hypoth UI design system.
 * Provides versioning, deprecation tracking, contribution gates,
 * and tenant update management.
 */

// Types
export type {
  BreakingChange,
  ChangeEntry,
  ChangelogRelease,
  ChangesetEntry,
  ChangeType,
  Codemod,
  ContributionGate,
  DeprecationRecord,
  DeprecationRegistry,
  DeprecationStatus,
  DeprecationType,
  Edition,
  FilteredChange,
  GateResult,
  GatesCheckResult,
  GatesConfig,
  GateType,
  MigrationGuide,
  MigrationStep,
  OverlayConflict,
  SecurityAlert,
  TenantUpdateSummary,
} from "./types/index.js";

// Validation
export {
  assertValid,
  formatErrors,
  validate,
  validateDeprecationRegistry,
  validateGatesConfig,
  validateMigrationGuide,
} from "./validation/schema-validator.js";
export type {
  SchemaType,
  ValidationError,
  ValidationResult,
} from "./validation/schema-validator.js";

// Changelog
export {
  filterByEdition,
  filterByPackage,
  filterByPackages,
  filterBreakingChanges,
  filterSecurityUpdates,
  aggregateChangesForTenant,
  requiresAction,
  getActionRequiredChanges,
  prioritizeChanges,
} from "./changelog/filter.js";
export type { PrioritizedChanges } from "./changelog/filter.js";
export {
  generateChangelogEntry,
  groupChangesByType,
  generateChangelog,
  generateChangelogHeader,
  prependToChangelog,
  generateReleaseSummary,
} from "./changelog/generator.js";
export {
  parseChangesetFile,
  parseChangesets,
  toChangesetEntries,
  getPendingChangesets,
} from "./changelog/parser.js";
export type {
  GroupedChanges,
  ReleaseWithEntries,
  TenantChangelogAggregate,
  ParsedChangeset,
  ChangelogOptions,
} from "./changelog/types.js";

// Deprecation
export {
  calculateDeprecationStatus,
  loadDeprecationRegistry,
  saveDeprecationRegistry,
  addDeprecation,
  removeDeprecation,
  queryDeprecations,
  getUpcomingRemovals,
  getActiveDeprecations,
  validateDeprecationWindow,
  createDeprecation,
} from "./deprecation/registry.js";
export {
  generateWarning,
  formatConsoleWarning,
  logDeprecationWarning,
  createDeprecationWarner,
  generateJSDocDeprecation,
  generateTSDeprecation,
} from "./deprecation/warnings.js";
export type { WarningSeverity, DeprecationWarning } from "./deprecation/warnings.js";
export {
  generateMigrationMarkdown,
  createMigrationStep,
  deprecationToMigrationSteps,
  estimateMigrationEffort,
  generateVersionMigration,
} from "./deprecation/migration.js";
export type {
  DeprecationWithStatus,
  DeprecationQueryOptions,
  DeprecationAnnouncement,
  MigrationGuideData,
} from "./deprecation/types.js";

// Tenant
export {
  calculateVersionDiff,
  summarizeChanges,
  generateTenantUpdateReport,
  determineUpdateUrgency,
  generateUpdateRecommendation,
  formatUpdateReport,
} from "./tenant/diff.js";
export type {
  TenantInfo,
  VersionDiff,
  TenantChangeSummary,
  TenantUpdateReport,
  UpdateUrgency,
  UpdateRecommendation,
} from "./tenant/types.js";

// Gates
export {
  loadGatesConfig,
  runGates,
  formatGatesReport,
  checkGates,
  getRequiredFailures,
} from "./gates/checker.js";
export {
  gateRunners,
  testCoverageRunner,
  accessibilityRunner,
  manifestValidationRunner,
  docsPresenceRunner,
  typecheckRunner,
  lintRunner,
  changesetRunner,
} from "./gates/runners.js";
export type {
  GateContext,
  GateCheckResult,
  GatesReport,
  GateRunner,
  GateDefinition,
} from "./gates/types.js";
