/**
 * Changelog Types
 *
 * Types specific to changelog generation and parsing.
 */

import type { ChangesetEntry, Edition } from "../types/index.js";

/** Grouped changes by type for changelog sections */
export interface GroupedChanges {
  /** Breaking changes (major version bumps) */
  breaking: ChangesetEntry[];
  /** New features (minor version bumps) */
  features: ChangesetEntry[];
  /** Bug fixes (patch version bumps) */
  fixes: ChangesetEntry[];
  /** Security-related changes */
  security: ChangesetEntry[];
  /** Deprecation announcements */
  deprecations: ChangesetEntry[];
}

/** A release with its changelog entries */
export interface ReleaseWithEntries {
  /** Version number */
  version: string;
  /** Date of release (ISO8601) */
  date?: string;
  /** Changeset entries for this release */
  entries: ChangesetEntry[];
}

/** Aggregated tenant changelog */
export interface TenantChangelogAggregate {
  /** Edition this changelog is for */
  edition: Edition;
  /** Starting version */
  from_version: string;
  /** Target version */
  to_version: string;
  /** All changes affecting this edition */
  changes: ChangesetEntry[];
  /** Security updates requiring immediate attention */
  security_updates: ChangesetEntry[];
  /** Breaking changes requiring migration */
  breaking_changes: ChangesetEntry[];
  /** Version boundaries for reference */
  versions: string[];
}

/** Parsed changeset file */
export interface ParsedChangeset {
  /** Changeset ID (from filename) */
  id: string;
  /** Package version bumps */
  packages: Record<string, "major" | "minor" | "patch">;
  /** Extended frontmatter (editions, security, etc.) */
  frontmatter: {
    editions?: Edition[];
    security?: boolean;
    breaking_type?: string;
    migration_required?: boolean;
  };
  /** Summary content (markdown) */
  summary: string;
}

/** Changelog generation options */
export interface ChangelogOptions {
  /** Include PR links */
  includePrLinks?: boolean;
  /** Include author attribution */
  includeAuthors?: boolean;
  /** Filter by edition */
  edition?: Edition;
  /** Only include security updates */
  securityOnly?: boolean;
  /** Repository for link generation */
  repo?: string;
}
