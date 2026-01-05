/**
 * Changelog Filter
 *
 * Filters changelog entries by edition, security status, and other criteria.
 * Used for tenant-specific changelog views.
 */

import type { ChangesetEntry, Edition } from "../types/index.js";
import type { ReleaseWithEntries, TenantChangelogAggregate } from "./types.js";

/**
 * Filter changelog entries by edition
 */
export function filterByEdition(
  entries: ChangesetEntry[],
  edition: Edition
): ChangesetEntry[] {
  return entries.filter((entry) => entry.editions.includes(edition));
}

/**
 * Filter to only security-related changes
 */
export function filterSecurityUpdates(
  entries: ChangesetEntry[]
): ChangesetEntry[] {
  return entries.filter((entry) => entry.security === true);
}

/**
 * Filter to only breaking changes
 */
export function filterBreakingChanges(
  entries: ChangesetEntry[]
): ChangesetEntry[] {
  return entries.filter(
    (entry) => entry.type === "major" || entry.breaking_type !== undefined
  );
}

/**
 * Filter by package
 */
export function filterByPackage(
  entries: ChangesetEntry[],
  packageName: string
): ChangesetEntry[] {
  return entries.filter((entry) => entry.packages.includes(packageName));
}

/**
 * Filter by multiple packages (OR logic)
 */
export function filterByPackages(
  entries: ChangesetEntry[],
  packageNames: string[]
): ChangesetEntry[] {
  return entries.filter((entry) =>
    entry.packages.some((pkg) => packageNames.includes(pkg))
  );
}

/**
 * Compare semantic versions
 * Returns: -1 if a < b, 0 if a === b, 1 if a > b
 */
function compareVersions(a: string, b: string): number {
  const aParts = a.split(".").map(Number);
  const bParts = b.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    const aVal = aParts[i] ?? 0;
    const bVal = bParts[i] ?? 0;
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
  }

  return 0;
}

/**
 * Check if version is in range (exclusive start, inclusive end)
 */
function isVersionInRange(
  version: string,
  fromVersion: string,
  toVersion: string
): boolean {
  return (
    compareVersions(version, fromVersion) > 0 &&
    compareVersions(version, toVersion) <= 0
  );
}

/**
 * Aggregate changes across multiple versions for a tenant
 */
export function aggregateChangesForTenant(
  releases: ReleaseWithEntries[],
  edition: Edition,
  fromVersion: string,
  toVersion: string
): TenantChangelogAggregate {
  const relevantReleases = releases.filter((r) =>
    isVersionInRange(r.version, fromVersion, toVersion)
  );

  const allEntries: ChangesetEntry[] = [];
  const versions: string[] = [];

  for (const release of relevantReleases) {
    const filtered = filterByEdition(release.entries, edition);
    allEntries.push(...filtered);
    if (filtered.length > 0) {
      versions.push(release.version);
    }
  }

  return {
    edition,
    from_version: fromVersion,
    to_version: toVersion,
    changes: allEntries,
    security_updates: filterSecurityUpdates(allEntries),
    breaking_changes: filterBreakingChanges(allEntries),
    versions: versions.sort((a, b) => compareVersions(a, b)),
  };
}

/**
 * Check if a change requires tenant action
 */
export function requiresAction(entry: ChangesetEntry): boolean {
  // Security updates always require action
  if (entry.security) {
    return true;
  }

  // Breaking changes require migration
  if (entry.type === "major" || entry.breaking_type) {
    return true;
  }

  // Migration required flag
  if (entry.migration_required) {
    return true;
  }

  return false;
}

/**
 * Get changes requiring immediate action
 */
export function getActionRequiredChanges(
  entries: ChangesetEntry[]
): ChangesetEntry[] {
  return entries.filter(requiresAction);
}

/**
 * Categorize changes by priority for tenant dashboard
 */
export interface PrioritizedChanges {
  /** Critical: security updates */
  critical: ChangesetEntry[];
  /** High: breaking changes */
  high: ChangesetEntry[];
  /** Medium: deprecations and migration-required */
  medium: ChangesetEntry[];
  /** Low: features and fixes */
  low: ChangesetEntry[];
}

export function prioritizeChanges(
  entries: ChangesetEntry[]
): PrioritizedChanges {
  const result: PrioritizedChanges = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };

  for (const entry of entries) {
    if (entry.security) {
      result.critical.push(entry);
    } else if (entry.type === "major" || entry.breaking_type) {
      result.high.push(entry);
    } else if (entry.migration_required) {
      result.medium.push(entry);
    } else {
      result.low.push(entry);
    }
  }

  return result;
}
