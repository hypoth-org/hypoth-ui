/**
 * Changeset Parser
 *
 * Parses changeset files from the .changeset/ directory.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type { ChangeType, ChangesetEntry, Edition } from "../types/index.js";
import type { ParsedChangeset } from "./types.js";

/** Parse YAML-like frontmatter from changeset content */
function parseFrontmatter(content: string): {
  packages: Record<string, ChangeType>;
  frontmatter: ParsedChangeset["frontmatter"];
  summary: string;
} {
  const lines = content.split("\n");
  const packages: Record<string, ChangeType> = {};
  const frontmatter: ParsedChangeset["frontmatter"] = {};
  let inFrontmatter = false;
  const summaryLines: string[] = [];
  let pastFrontmatter = false;

  for (const line of lines) {
    if (line.trim() === "---") {
      if (!inFrontmatter) {
        inFrontmatter = true;
      } else {
        inFrontmatter = false;
        pastFrontmatter = true;
      }
      continue;
    }

    if (inFrontmatter) {
      // Parse package bumps like '"@ds/wc": minor'
      const packageMatch = line.match(/^["']?(@[^"']+)["']?\s*:\s*(major|minor|patch)/);
      if (packageMatch?.[1] && packageMatch[2]) {
        packages[packageMatch[1]] = packageMatch[2] as ChangeType;
        continue;
      }

      // Parse extended frontmatter
      const editionsMatch = line.match(/^editions\s*:\s*\[([^\]]+)\]/);
      if (editionsMatch?.[1]) {
        frontmatter.editions = editionsMatch[1]
          .split(",")
          .map((e) => e.trim().replace(/["']/g, "") as Edition);
        continue;
      }

      const securityMatch = line.match(/^security\s*:\s*(true|false)/);
      if (securityMatch) {
        frontmatter.security = securityMatch[1] === "true";
        continue;
      }

      const breakingTypeMatch = line.match(/^breaking_type\s*:\s*["']?([^"'\n]+)["']?/);
      if (breakingTypeMatch?.[1]) {
        frontmatter.breaking_type = breakingTypeMatch[1].trim();
        continue;
      }

      const migrationMatch = line.match(/^migration_required\s*:\s*(true|false)/);
      if (migrationMatch) {
        frontmatter.migration_required = migrationMatch[1] === "true";
      }
    } else if (pastFrontmatter) {
      summaryLines.push(line);
    }
  }

  return {
    packages,
    frontmatter,
    summary: summaryLines.join("\n").trim(),
  };
}

/**
 * Parse a single changeset file
 */
export function parseChangesetFile(filePath: string): ParsedChangeset | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const id = path.basename(filePath, ".md");

  // Skip README and config files
  if (id === "README" || id === "config") {
    return null;
  }

  const { packages, frontmatter, summary } = parseFrontmatter(content);

  // Must have at least one package bump
  if (Object.keys(packages).length === 0) {
    return null;
  }

  return {
    id,
    packages,
    frontmatter,
    summary,
  };
}

/**
 * Parse all changesets in a directory
 */
export function parseChangesets(changesetDir: string): ParsedChangeset[] {
  if (!fs.existsSync(changesetDir)) {
    return [];
  }

  const files = fs.readdirSync(changesetDir).filter((f) => f.endsWith(".md"));
  const changesets: ParsedChangeset[] = [];

  for (const file of files) {
    const parsed = parseChangesetFile(path.join(changesetDir, file));
    if (parsed) {
      changesets.push(parsed);
    }
  }

  return changesets;
}

/**
 * Convert parsed changesets to ChangesetEntry format
 */
export function toChangesetEntries(changesets: ParsedChangeset[]): ChangesetEntry[] {
  return changesets.map((cs) => {
    // Determine overall change type (highest bump wins)
    const types = Object.values(cs.packages);
    let overallType: ChangeType = "patch";
    if (types.includes("major")) {
      overallType = "major";
    } else if (types.includes("minor")) {
      overallType = "minor";
    }

    return {
      id: cs.id,
      packages: Object.keys(cs.packages),
      type: overallType,
      editions: cs.frontmatter.editions ?? ["core", "pro", "enterprise"],
      security: cs.frontmatter.security,
      summary: cs.summary,
      breaking_type: cs.frontmatter.breaking_type as ChangesetEntry["breaking_type"],
      migration_required: cs.frontmatter.migration_required,
    };
  });
}

/**
 * Get pending changesets from the .changeset directory
 */
export function getPendingChangesets(repoRoot: string): ChangesetEntry[] {
  const changesetDir = path.join(repoRoot, ".changeset");
  const parsed = parseChangesets(changesetDir);
  return toChangesetEntries(parsed);
}
