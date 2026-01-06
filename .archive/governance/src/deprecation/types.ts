/**
 * Deprecation Types
 *
 * Types specific to deprecation management.
 */

import type { DeprecationRecord, DeprecationType, Edition } from "../types/index.js";

/** Deprecation with computed status */
export interface DeprecationWithStatus extends Omit<DeprecationRecord, "status"> {
  /** Current status based on version comparison */
  status: "active" | "warning" | "removal-imminent" | "removed";
  /** Number of major versions until removal */
  versionsUntilRemoval: number | null;
}

/** Registry of all deprecations */
export interface DeprecationRegistry {
  /** Schema version */
  $schema?: string;
  /** All deprecation records */
  deprecations: DeprecationRecord[];
}

/** Options for deprecation queries */
export interface DeprecationQueryOptions {
  /** Filter by type */
  type?: DeprecationType;
  /** Filter by package */
  package?: string;
  /** Filter by status */
  status?: DeprecationWithStatus["status"];
  /** Filter by edition */
  edition?: Edition;
  /** Current version for status calculation */
  currentVersion?: string;
}

/** Deprecation announcement for release notes */
export interface DeprecationAnnouncement {
  /** Item being deprecated */
  item: string;
  /** Type of deprecation */
  type: DeprecationType;
  /** Replacement item if available */
  replacement?: string;
  /** Version when deprecated */
  since: string;
  /** Version when removed */
  until: string;
  /** Migration guide reference */
  migrationGuide?: string;
}

/** Migration step */
export interface MigrationStep {
  /** Step description */
  description: string;
  /** Code before migration */
  before?: string;
  /** Code after migration */
  after?: string;
  /** Whether this step is automated */
  automated?: boolean;
}

/** Full migration guide */
export interface MigrationGuideData {
  /** Title */
  title: string;
  /** Source version */
  fromVersion: string;
  /** Target version */
  toVersion: string;
  /** Breaking changes in this migration */
  breakingChanges: {
    item: string;
    type: DeprecationType;
    reason: string;
    migration: MigrationStep[];
  }[];
  /** Estimated migration effort */
  effort: "low" | "medium" | "high";
  /** Prerequisites */
  prerequisites?: string[];
}
