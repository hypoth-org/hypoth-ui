/**
 * Governance Types
 *
 * Shared TypeScript interfaces for the governance package.
 */

/** Valid editions for edition filtering */
export type Edition = "core" | "pro" | "enterprise";

/** Type of deprecated item */
export type DeprecationType =
  | "component"
  | "api"
  | "token"
  | "prop"
  | "event"
  | "slot"
  | "css-var"
  | "css-variable"
  | "utility"
  | "pattern";

/** Deprecation status lifecycle */
export type DeprecationStatus = "announced" | "active" | "removable" | "removed";

/** A single deprecation record */
export interface DeprecationRecord {
  /** Identifier of the deprecated item */
  item: string;
  /** Type of deprecated item */
  type: DeprecationType;
  /** Version when deprecation was announced */
  deprecated_in: string;
  /** Target version for removal (must be >= deprecated_in + 2 major) */
  removal_version: string;
  /** Package containing the deprecated item */
  package?: string;
  /** Replacement item identifier (if applicable) */
  replacement?: string;
  /** URL path to migration guide */
  migration_guide?: string;
  /** Brief explanation for deprecation */
  reason?: string;
  /** Affected editions (if not all) */
  editions?: Edition[];
  /** Current deprecation status */
  status?: DeprecationStatus;
}

/** The deprecation registry schema */
export interface DeprecationRegistry {
  /** Schema version */
  version: string;
  /** List of deprecated items */
  deprecations: DeprecationRecord[];
}

/** Change type in a changeset */
export type ChangeType = "major" | "minor" | "patch";

/** Extended changeset entry with edition metadata */
export interface ChangesetEntry {
  /** Auto-generated unique ID */
  id: string;
  /** Affected packages */
  packages: string[];
  /** Change type */
  type: ChangeType;
  /** Affected editions for tenant filtering */
  editions: Edition[];
  /** Whether this is a security-related change */
  security?: boolean;
  /** Human-readable change description */
  summary: string;
  /** Type of breaking change (for major version bumps) */
  breaking_type?: "api-change" | "component-removal" | "token-rename" | "behavior-change";
  /** Whether migration guide is required */
  migration_required?: boolean;
}

/** Contribution gate type */
export type GateType = "automated" | "manual";

/** A contribution quality gate */
export interface ContributionGate {
  /** Unique gate ID (kebab-case) */
  id: string;
  /** Human-readable name */
  name: string;
  /** Whether gate is automated or manual */
  type: GateType;
  /** Numeric threshold for pass/fail (e.g., 80 for 80% coverage) */
  threshold?: number;
  /** Whether gate blocks merge */
  required: boolean;
  /** File patterns this gate applies to */
  applies_to?: string[];
  /** Explanation of what the gate checks */
  description: string;
  /** Instructions for fixing gate failures */
  remediation?: string;
  /** Command to run in CI (for automated gates) */
  command?: string;
  /** URL to manual checklist (for manual gates) */
  checklist_url?: string;
}

/** Contribution gates configuration */
export interface GatesConfig {
  /** Schema version */
  version?: string;
  /** List of contribution gates */
  gates: ContributionGate[];
}

/** Breaking change entry in migration guide */
export interface BreakingChange {
  /** Change identifier for linking */
  id: string;
  /** Brief title of the change */
  title: string;
  /** Type of breaking change */
  type: "api-change" | "component-removal" | "token-rename" | "behavior-change" | "dependency-update";
  /** Impact severity */
  severity?: "low" | "medium" | "high";
  /** Components affected by this change */
  affected_components?: string[];
}

/** A step in the migration process */
export interface MigrationStep {
  /** Step order */
  order: number;
  /** Step title */
  title: string;
  /** Step description */
  description: string;
  /** Code example before the change */
  before?: string;
  /** Code example after the change */
  after?: string;
  /** File patterns affected */
  affected_files?: string[];
}

/** Codemod for automated migration */
export interface Codemod {
  /** Codemod name */
  name: string;
  /** Command to run the codemod */
  command: string;
  /** What the codemod does */
  description: string;
  /** Which breaking changes this codemod addresses */
  breaking_changes?: string[];
}

/** Migration guide frontmatter */
export interface MigrationGuide {
  /** Guide title */
  title: string;
  /** Brief summary of the migration */
  description?: string;
  /** Starting major version */
  from_version: string;
  /** Target major version */
  to_version: string;
  /** Time estimate for migration */
  estimated_effort?: string;
  /** Editions affected by this migration */
  editions?: Edition[];
  /** List of breaking changes covered */
  breaking_changes: BreakingChange[];
  /** Available automated migration scripts */
  codemods?: Codemod[];
  /** Display order in navigation */
  order?: number;
}

/** A single changelog entry */
export interface ChangeEntry {
  /** Change description */
  description: string;
  /** Affected packages */
  packages: string[];
  /** Affected editions */
  editions: Edition[];
  /** PR number */
  pr?: number;
  /** Author */
  author?: string;
  /** Link to migration guide */
  migration_guide?: string;
}

/** Changelog release */
export interface ChangelogRelease {
  /** Release version */
  version: string;
  /** Release date (ISO8601) */
  date: string;
  /** High-level release summary */
  summary?: string;
  /** Breaking changes */
  breaking?: ChangeEntry[];
  /** New features */
  features?: ChangeEntry[];
  /** Bug fixes */
  fixes?: ChangeEntry[];
  /** Newly deprecated items */
  deprecations?: DeprecationRecord[];
  /** Security-related changes */
  security?: ChangeEntry[];
}

/** Filtered change for tenant update summary */
export interface FilteredChange {
  /** Version this change was introduced */
  version: string;
  /** Type of change */
  type: "breaking" | "feature" | "fix" | "deprecation" | "security";
  /** Change description */
  description: string;
  /** True if tenant uses affected component */
  affects_tenant: boolean;
  /** True if action is required */
  action_required: boolean;
}

/** Overlay conflict detection */
export interface OverlayConflict {
  /** Tenant's overridden file path */
  path: string;
  /** Whether base file changed */
  base_changed: boolean;
  /** Conflict severity */
  severity: "info" | "warning" | "error";
  /** Conflict message */
  message: string;
}

/** Security alert */
export interface SecurityAlert {
  /** Alert ID */
  id: string;
  /** Severity level */
  severity: "low" | "medium" | "high" | "critical";
  /** Alert title */
  title: string;
  /** Alert description */
  description: string;
  /** Version containing the fix */
  fixed_in: string;
  /** Affected components */
  affected_components: string[];
}

/** Tenant update summary */
export interface TenantUpdateSummary {
  /** Tenant identifier */
  tenant_id: string;
  /** Tenant's edition tier */
  edition: Edition;
  /** Tenant's current version */
  current_version: string;
  /** Version to update to */
  target_version: string;
  /** Changes relevant to this edition */
  changes: FilteredChange[];
  /** Potential conflicts with tenant overlays */
  conflicts?: OverlayConflict[];
  /** Security updates requiring action */
  security_alerts?: SecurityAlert[];
  /** Upgrade time estimate */
  estimated_effort?: string;
}

/** Gate execution result */
export interface GateResult {
  /** Gate ID */
  gate_id: string;
  /** Gate name */
  gate_name: string;
  /** Whether gate passed */
  passed: boolean;
  /** Result message */
  message: string;
  /** Detailed output */
  details?: string;
  /** Duration in milliseconds */
  duration_ms?: number;
}

/** Overall gates check result */
export interface GatesCheckResult {
  /** Whether all required gates passed */
  passed: boolean;
  /** Individual gate results */
  results: GateResult[];
  /** Total duration in milliseconds */
  total_duration_ms: number;
  /** Summary message */
  summary: string;
}
