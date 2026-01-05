/**
 * Deprecation Registry
 *
 * Manages the deprecation registry - reading, writing, and querying deprecations.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type { DeprecationRecord, DeprecationType, Edition } from "../types/index.js";
import type {
  DeprecationQueryOptions,
  DeprecationRegistry,
  DeprecationWithStatus,
} from "./types.js";

/**
 * Parse semantic version string
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
 * Calculate status for a deprecation based on current version
 */
export function calculateDeprecationStatus(
  record: DeprecationRecord,
  currentVersion: string
): DeprecationWithStatus {
  const current = parseVersion(currentVersion);
  const deprecated = parseVersion(record.deprecated_in);
  const removal = parseVersion(record.removal_version);

  // Already removed
  if (current.major >= removal.major) {
    return {
      ...record,
      status: "removed",
      versionsUntilRemoval: null,
    };
  }

  const versionsRemaining = removal.major - current.major;

  // Removal imminent (next major version)
  if (versionsRemaining === 1) {
    return {
      ...record,
      status: "removal-imminent",
      versionsUntilRemoval: 1,
    };
  }

  // Warning (2 versions away)
  if (versionsRemaining === 2) {
    return {
      ...record,
      status: "warning",
      versionsUntilRemoval: 2,
    };
  }

  // Active deprecation (more than 2 versions)
  return {
    ...record,
    status: "active",
    versionsUntilRemoval: versionsRemaining,
  };
}

/**
 * Load deprecation registry from file
 */
export function loadDeprecationRegistry(registryPath: string): DeprecationRegistry {
  if (!fs.existsSync(registryPath)) {
    return { deprecations: [] };
  }

  const content = fs.readFileSync(registryPath, "utf-8");
  return JSON.parse(content) as DeprecationRegistry;
}

/**
 * Save deprecation registry to file
 */
export function saveDeprecationRegistry(
  registryPath: string,
  registry: DeprecationRegistry
): void {
  const content = JSON.stringify(registry, null, 2);
  fs.writeFileSync(registryPath, content, "utf-8");
}

/**
 * Add a new deprecation to the registry
 */
export function addDeprecation(
  registry: DeprecationRegistry,
  record: DeprecationRecord
): DeprecationRegistry {
  // Check for duplicates
  const existing = registry.deprecations.find(
    (d) => d.item === record.item && d.type === record.type
  );

  if (existing) {
    throw new Error(`Deprecation already exists: ${record.type} ${record.item}`);
  }

  return {
    ...registry,
    deprecations: [...registry.deprecations, record],
  };
}

/**
 * Remove a deprecation from the registry (when removal is complete)
 */
export function removeDeprecation(
  registry: DeprecationRegistry,
  item: string,
  type: DeprecationType
): DeprecationRegistry {
  return {
    ...registry,
    deprecations: registry.deprecations.filter(
      (d) => !(d.item === item && d.type === type)
    ),
  };
}

/**
 * Query deprecations with filters
 */
export function queryDeprecations(
  registry: DeprecationRegistry,
  options: DeprecationQueryOptions = {}
): DeprecationWithStatus[] {
  const currentVersion = options.currentVersion ?? "1.0.0";

  let results = registry.deprecations.map((d) =>
    calculateDeprecationStatus(d, currentVersion)
  );

  // Filter by type
  if (options.type) {
    results = results.filter((d) => d.type === options.type);
  }

  // Filter by package
  if (options.package) {
    results = results.filter((d) => d.package === options.package);
  }

  // Filter by status
  if (options.status) {
    results = results.filter((d) => d.status === options.status);
  }

  // Filter by edition
  if (options.edition) {
    results = results.filter(
      (d) => !d.editions || d.editions.includes(options.edition as Edition)
    );
  }

  return results;
}

/**
 * Get deprecations that will be removed in the next major version
 */
export function getUpcomingRemovals(
  registry: DeprecationRegistry,
  currentVersion: string
): DeprecationWithStatus[] {
  return queryDeprecations(registry, {
    currentVersion,
    status: "removal-imminent",
  });
}

/**
 * Get all active deprecations (not yet removed)
 */
export function getActiveDeprecations(
  registry: DeprecationRegistry,
  currentVersion: string
): DeprecationWithStatus[] {
  return queryDeprecations(registry, { currentVersion }).filter(
    (d) => d.status !== "removed"
  );
}

/**
 * Validate deprecation follows 2-major-version window
 */
export function validateDeprecationWindow(record: DeprecationRecord): boolean {
  const deprecated = parseVersion(record.deprecated_in);
  const removal = parseVersion(record.removal_version);

  // Removal must be at least 2 major versions after deprecation
  return removal.major >= deprecated.major + 2;
}

/**
 * Create a new deprecation record with proper window
 */
export function createDeprecation(
  item: string,
  type: DeprecationType,
  deprecatedIn: string,
  options: {
    package?: string;
    replacement?: string;
    reason?: string;
    migrationGuide?: string;
    editions?: Edition[];
  } = {}
): DeprecationRecord {
  const deprecated = parseVersion(deprecatedIn);

  // Calculate removal version (2 major versions later)
  const removalVersion = `${deprecated.major + 2}.0.0`;

  return {
    item,
    type,
    deprecated_in: deprecatedIn,
    removal_version: removalVersion,
    package: options.package,
    replacement: options.replacement,
    reason: options.reason,
    migration_guide: options.migrationGuide,
    editions: options.editions,
  };
}
