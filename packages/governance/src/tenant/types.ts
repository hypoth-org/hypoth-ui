/**
 * Tenant Types
 *
 * Types for tenant update tracking and version diffing.
 */

import type { ChangesetEntry, Edition } from "../types/index.js";

/** Tenant information */
export interface TenantInfo {
  /** Tenant identifier */
  id: string;
  /** Tenant name */
  name: string;
  /** Edition tier */
  edition: Edition;
  /** Current installed version */
  currentVersion: string;
  /** Last updated timestamp */
  lastUpdated?: string;
}

/** Version diff between tenant and latest */
export interface VersionDiff {
  /** Tenant's current version */
  fromVersion: string;
  /** Target/latest version */
  toVersion: string;
  /** Number of versions behind */
  versionsBehind: number;
  /** Whether major version upgrade is required */
  hasMajorUpgrade: boolean;
  /** Whether there are security updates */
  hasSecurityUpdates: boolean;
  /** Whether there are breaking changes */
  hasBreakingChanges: boolean;
}

/** Summary of changes for tenant */
export interface TenantChangeSummary {
  /** Total number of changes */
  totalChanges: number;
  /** Security updates count */
  securityUpdates: number;
  /** Breaking changes count */
  breakingChanges: number;
  /** New features count */
  features: number;
  /** Bug fixes count */
  fixes: number;
  /** Changes requiring action */
  actionRequired: number;
}

/** Full tenant update report */
export interface TenantUpdateReport {
  /** Tenant information */
  tenant: TenantInfo;
  /** Version difference */
  diff: VersionDiff;
  /** Change summary */
  summary: TenantChangeSummary;
  /** All relevant changes */
  changes: ChangesetEntry[];
  /** Security updates (critical) */
  securityUpdates: ChangesetEntry[];
  /** Breaking changes (high priority) */
  breakingChanges: ChangesetEntry[];
  /** Action required items */
  actionItems: ChangesetEntry[];
  /** Generated at timestamp */
  generatedAt: string;
}

/** Update urgency level */
export type UpdateUrgency = "critical" | "high" | "medium" | "low" | "none";

/** Update recommendation */
export interface UpdateRecommendation {
  /** Urgency level */
  urgency: UpdateUrgency;
  /** Human-readable recommendation */
  message: string;
  /** Key reasons for the recommendation */
  reasons: string[];
  /** Suggested next steps */
  nextSteps: string[];
}
