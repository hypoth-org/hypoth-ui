/**
 * Changelog Generator
 *
 * Generates changelog content from changeset entries.
 * Follows Keep A Changelog format (https://keepachangelog.com).
 */

import type { ChangesetEntry } from "../types/index.js";
import type { ChangelogOptions, GroupedChanges } from "./types.js";

/**
 * Generate a single changelog entry line
 */
export function generateChangelogEntry(
  entry: ChangesetEntry,
  options: ChangelogOptions = {}
): string {
  const parts: string[] = [];

  // Security marker
  if (entry.security) {
    parts.push("**[SECURITY]**");
  }

  // Breaking marker
  if (entry.type === "major" || entry.breaking_type) {
    parts.push("**[BREAKING]**");
  }

  // Summary
  parts.push(entry.summary);

  // Package info
  if (entry.packages.length > 0) {
    parts.push(`(${entry.packages.join(", ")})`);
  }

  return `- ${parts.join(" ")}`;
}

/**
 * Group changeset entries by type for changelog sections
 */
export function groupChangesByType(entries: ChangesetEntry[]): GroupedChanges {
  const grouped: GroupedChanges = {
    breaking: [],
    features: [],
    fixes: [],
    security: [],
    deprecations: [],
  };

  for (const entry of entries) {
    // Security changes go to their own section
    if (entry.security) {
      grouped.security.push(entry);
      continue;
    }

    // Breaking changes
    if (entry.type === "major" || entry.breaking_type) {
      grouped.breaking.push(entry);
      continue;
    }

    // Features (minor)
    if (entry.type === "minor") {
      grouped.features.push(entry);
      continue;
    }

    // Fixes (patch)
    grouped.fixes.push(entry);
  }

  return grouped;
}

/**
 * Generate changelog section for a group of changes
 */
function generateSection(
  title: string,
  entries: ChangesetEntry[],
  options: ChangelogOptions = {}
): string {
  if (entries.length === 0) {
    return "";
  }

  const lines = [`### ${title}`, ""];
  for (const entry of entries) {
    lines.push(generateChangelogEntry(entry, options));
  }
  lines.push("");

  return lines.join("\n");
}

/**
 * Generate complete changelog for a version
 */
export function generateChangelog(
  version: string,
  entries: ChangesetEntry[],
  options: ChangelogOptions = {}
): string {
  const date = new Date().toISOString().split("T")[0];
  const grouped = groupChangesByType(entries);

  const sections: string[] = [
    `## [${version}] - ${date}`,
    "",
  ];

  // Add sections in order
  const sectionOrder: Array<[string, ChangesetEntry[]]> = [
    ["Security", grouped.security],
    ["Breaking Changes", grouped.breaking],
    ["Added", grouped.features],
    ["Fixed", grouped.fixes],
    ["Deprecated", grouped.deprecations],
  ];

  for (const [title, sectionEntries] of sectionOrder) {
    const section = generateSection(title, sectionEntries, options);
    if (section) {
      sections.push(section);
    }
  }

  return sections.join("\n");
}

/**
 * Generate changelog header (for new changelog files)
 */
export function generateChangelogHeader(): string {
  return `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;
}

/**
 * Prepend new version to existing changelog
 */
export function prependToChangelog(
  existingContent: string,
  version: string,
  entries: ChangesetEntry[],
  options: ChangelogOptions = {}
): string {
  const newSection = generateChangelog(version, entries, options);

  // Find the first version header and insert before it
  const versionPattern = /^## \[\d+\.\d+\.\d+\]/m;
  const match = existingContent.match(versionPattern);

  if (match?.index !== undefined) {
    return (
      existingContent.slice(0, match.index) +
      newSection +
      existingContent.slice(match.index)
    );
  }

  // If no existing versions, append to end
  return existingContent + "\n" + newSection;
}

/**
 * Generate summary of changes for release notes
 */
export function generateReleaseSummary(entries: ChangesetEntry[]): string {
  const grouped = groupChangesByType(entries);
  const parts: string[] = [];

  if (grouped.security.length > 0) {
    parts.push(`${grouped.security.length} security fix(es)`);
  }
  if (grouped.breaking.length > 0) {
    parts.push(`${grouped.breaking.length} breaking change(s)`);
  }
  if (grouped.features.length > 0) {
    parts.push(`${grouped.features.length} new feature(s)`);
  }
  if (grouped.fixes.length > 0) {
    parts.push(`${grouped.fixes.length} bug fix(es)`);
  }

  if (parts.length === 0) {
    return "No changes in this release.";
  }

  return `This release includes ${parts.join(", ")}.`;
}
