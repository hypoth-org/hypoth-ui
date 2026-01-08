/**
 * Tenant Version Diff
 *
 * Calculates differences between tenant version and latest,
 * filtered by edition.
 */

import {
  filterBreakingChanges,
  filterByEdition,
  filterSecurityUpdates,
} from "../changelog/filter.js";
import type { ReleaseWithEntries } from "../changelog/types.js";
import type { ChangesetEntry, Edition } from "../types/index.js";
import type {
  TenantChangeSummary,
  TenantInfo,
  TenantUpdateReport,
  UpdateRecommendation,
  UpdateUrgency,
  VersionDiff,
} from "./types.js";

/**
 * Parse semantic version
 */
function parseVersion(version: string): { major: number; minor: number; patch: number } {
  const parts = version.split(".").map(Number);
  return {
    major: parts[0] ?? 0,
    minor: parts[1] ?? 0,
    patch: parts[2] ?? 0,
  };
}

/**
 * Compare semantic versions
 */
function compareVersions(a: string, b: string): number {
  const aParts = parseVersion(a);
  const bParts = parseVersion(b);

  if (aParts.major !== bParts.major) return aParts.major - bParts.major;
  if (aParts.minor !== bParts.minor) return aParts.minor - bParts.minor;
  return aParts.patch - bParts.patch;
}

/**
 * Calculate version diff between two versions
 */
export function calculateVersionDiff(
  fromVersion: string,
  toVersion: string,
  releases: ReleaseWithEntries[],
  edition: Edition
): VersionDiff {
  // Filter releases between versions
  const relevantReleases = releases.filter((r) => {
    return (
      compareVersions(r.version, fromVersion) > 0 && compareVersions(r.version, toVersion) <= 0
    );
  });

  const from = parseVersion(fromVersion);
  const to = parseVersion(toVersion);

  // Collect all entries filtered by edition
  let allEntries: ChangesetEntry[] = [];
  for (const release of relevantReleases) {
    const filtered = filterByEdition(release.entries, edition);
    allEntries = allEntries.concat(filtered);
  }

  const securityUpdates = filterSecurityUpdates(allEntries);
  const breakingChanges = filterBreakingChanges(allEntries);

  return {
    fromVersion,
    toVersion,
    versionsBehind: relevantReleases.length,
    hasMajorUpgrade: to.major > from.major,
    hasSecurityUpdates: securityUpdates.length > 0,
    hasBreakingChanges: breakingChanges.length > 0,
  };
}

/**
 * Summarize changes for a tenant
 */
export function summarizeChanges(entries: ChangesetEntry[]): TenantChangeSummary {
  const security = entries.filter((e) => e.security === true);
  const breaking = entries.filter((e) => e.type === "major" || e.breaking_type);
  const features = entries.filter((e) => e.type === "minor" && !e.security && !e.breaking_type);
  const fixes = entries.filter((e) => e.type === "patch" && !e.security);
  const actionRequired = entries.filter(
    (e) => e.security || e.type === "major" || e.breaking_type || e.migration_required
  );

  return {
    totalChanges: entries.length,
    securityUpdates: security.length,
    breakingChanges: breaking.length,
    features: features.length,
    fixes: fixes.length,
    actionRequired: actionRequired.length,
  };
}

/**
 * Generate full update report for a tenant
 */
export function generateTenantUpdateReport(
  tenant: TenantInfo,
  releases: ReleaseWithEntries[],
  latestVersion: string
): TenantUpdateReport {
  // Get all changes between tenant version and latest
  const relevantReleases = releases.filter((r) => {
    return (
      compareVersions(r.version, tenant.currentVersion) > 0 &&
      compareVersions(r.version, latestVersion) <= 0
    );
  });

  // Filter by edition
  let allChanges: ChangesetEntry[] = [];
  for (const release of relevantReleases) {
    const filtered = filterByEdition(release.entries, tenant.edition);
    allChanges = allChanges.concat(filtered);
  }

  const securityUpdates = filterSecurityUpdates(allChanges);
  const breakingChanges = filterBreakingChanges(allChanges);
  const actionItems = allChanges.filter(
    (e) => e.security || e.type === "major" || e.breaking_type || e.migration_required
  );

  return {
    tenant,
    diff: calculateVersionDiff(tenant.currentVersion, latestVersion, releases, tenant.edition),
    summary: summarizeChanges(allChanges),
    changes: allChanges,
    securityUpdates,
    breakingChanges,
    actionItems,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Determine update urgency
 */
export function determineUpdateUrgency(report: TenantUpdateReport): UpdateUrgency {
  // Critical: security updates
  if (report.summary.securityUpdates > 0) {
    return "critical";
  }

  // High: many versions behind or breaking changes
  if (report.diff.versionsBehind > 5 || report.summary.breakingChanges > 0) {
    return "high";
  }

  // Medium: 2-5 versions behind
  if (report.diff.versionsBehind > 1) {
    return "medium";
  }

  // Low: 1 version behind
  if (report.diff.versionsBehind === 1) {
    return "low";
  }

  // None: up to date
  return "none";
}

/**
 * Generate update recommendation
 */
export function generateUpdateRecommendation(report: TenantUpdateReport): UpdateRecommendation {
  const urgency = determineUpdateUrgency(report);
  const reasons: string[] = [];
  const nextSteps: string[] = [];

  if (report.summary.securityUpdates > 0) {
    reasons.push(`${report.summary.securityUpdates} security update(s) available`);
    nextSteps.push("Apply security updates immediately");
  }

  if (report.summary.breakingChanges > 0) {
    reasons.push(`${report.summary.breakingChanges} breaking change(s) in update path`);
    nextSteps.push("Review breaking changes and migration guides");
  }

  if (report.diff.versionsBehind > 3) {
    reasons.push(`${report.diff.versionsBehind} versions behind latest`);
    nextSteps.push("Consider incremental updates to reduce migration risk");
  }

  if (report.summary.features > 0) {
    reasons.push(`${report.summary.features} new feature(s) available`);
  }

  if (report.summary.fixes > 0) {
    reasons.push(`${report.summary.fixes} bug fix(es) available`);
  }

  // Generate message
  let message: string;
  switch (urgency) {
    case "critical":
      message = "Critical security updates available. Update immediately.";
      break;
    case "high":
      message = "Significant updates available. Plan update soon.";
      break;
    case "medium":
      message = "Multiple updates available. Schedule update within next sprint.";
      break;
    case "low":
      message = "Minor updates available. Update at your convenience.";
      break;
    default:
      message = "You are up to date!";
  }

  // Add default next steps
  if (nextSteps.length === 0 && urgency !== "none") {
    nextSteps.push("Review changelog for your edition");
    nextSteps.push("Test update in staging environment");
    nextSteps.push("Deploy to production");
  }

  return {
    urgency,
    message,
    reasons,
    nextSteps,
  };
}

/**
 * Format update report as text
 */
export function formatUpdateReport(report: TenantUpdateReport): string {
  const recommendation = generateUpdateRecommendation(report);
  const lines: string[] = [];

  lines.push(`=== Update Report for ${report.tenant.name} ===`);
  lines.push("");
  lines.push(`Edition: ${report.tenant.edition}`);
  lines.push(`Current Version: ${report.tenant.currentVersion}`);
  lines.push(`Latest Version: ${report.diff.toVersion}`);
  lines.push(`Versions Behind: ${report.diff.versionsBehind}`);
  lines.push("");
  lines.push(`Urgency: ${recommendation.urgency.toUpperCase()}`);
  lines.push(recommendation.message);
  lines.push("");

  if (recommendation.reasons.length > 0) {
    lines.push("Reasons:");
    for (const reason of recommendation.reasons) {
      lines.push(`  - ${reason}`);
    }
    lines.push("");
  }

  if (recommendation.nextSteps.length > 0) {
    lines.push("Next Steps:");
    for (const step of recommendation.nextSteps) {
      lines.push(`  1. ${step}`);
    }
    lines.push("");
  }

  lines.push("Summary:");
  lines.push(`  Security Updates: ${report.summary.securityUpdates}`);
  lines.push(`  Breaking Changes: ${report.summary.breakingChanges}`);
  lines.push(`  New Features: ${report.summary.features}`);
  lines.push(`  Bug Fixes: ${report.summary.fixes}`);
  lines.push("");
  lines.push(`Report generated: ${report.generatedAt}`);

  return lines.join("\n");
}
