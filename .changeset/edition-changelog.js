/**
 * Custom Changelog Generator for @ds packages
 *
 * Extends @changesets/changelog-github to support edition metadata
 * and tenant-specific changelog filtering.
 */

const { getInfo } = require("@changesets/get-github-info");

const REPO = "hypoth-ui/hypoth-ui";

/**
 * Extract edition metadata from changeset content
 * Format: editions: [core, pro, enterprise]
 */
function extractEditions(content) {
  const match = content.match(/editions\s*:\s*\[([^\]]+)\]/);
  if (match?.[1]) {
    return match[1]
      .split(",")
      .map((e) => e.trim().replace(/["']/g, ""))
      .filter(Boolean);
  }
  // Default: available to all editions
  return ["core", "pro", "enterprise"];
}

/**
 * Extract security flag from changeset content
 */
function extractSecurity(content) {
  const match = content.match(/security\s*:\s*(true|false)/);
  return match ? match[1] === "true" : false;
}

/**
 * Extract breaking type from changeset content
 */
function extractBreakingType(content) {
  const match = content.match(/breaking_type\s*:\s*["']?([^"'\n]+)["']?/);
  return match ? match[1].trim() : undefined;
}

/**
 * Format the changelog line with edition and security markers
 */
function formatChangelogLine(summary, options = {}) {
  const parts = [];

  if (options.security) {
    parts.push("**[SECURITY]**");
  }

  if (options.breakingType) {
    parts.push("**[BREAKING]**");
  }

  parts.push(summary);

  if (options.editions && options.editions.length < 3) {
    const editionLabel = options.editions
      .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
      .join(", ");
    parts.push(`_(${editionLabel} only)_`);
  }

  if (options.pr) {
    parts.push(`([#${options.pr}](https://github.com/${REPO}/pull/${options.pr}))`);
  }

  if (options.author) {
    parts.push(`- [@${options.author}](https://github.com/${options.author})`);
  }

  return parts.join(" ");
}

/**
 * Get release line for a changeset
 */
async function getReleaseLine(changeset, type, options) {
  const [firstLine, ...rest] = changeset.summary.split("\n");
  const content = changeset.summary;

  // Extract extended metadata
  const editions = extractEditions(content);
  const security = extractSecurity(content);
  const breakingType = extractBreakingType(content);

  // Get GitHub info if commit is available
  let pr = null;
  let author = null;

  if (changeset.commit && options?.repo) {
    try {
      const info = await getInfo({
        repo: options.repo || REPO,
        commit: changeset.commit,
      });
      pr = info.pull;
      author = info.user;
    } catch (_e) {
      // GitHub info not available, continue without it
    }
  }

  const formattedLine = formatChangelogLine(firstLine.trim(), {
    security,
    breakingType: type === "major" ? breakingType || "breaking" : undefined,
    editions,
    pr,
    author,
  });

  // Include additional details if present
  const details = rest.filter((line) => {
    // Filter out metadata lines
    return (
      !line.match(/^editions\s*:/) &&
      !line.match(/^security\s*:/) &&
      !line.match(/^breaking_type\s*:/) &&
      !line.match(/^migration_required\s*:/) &&
      line.trim()
    );
  });

  if (details.length > 0) {
    return `- ${formattedLine}\n${details.map((d) => `  ${d}`).join("\n")}`;
  }

  return `- ${formattedLine}`;
}

/**
 * Get dependencies release line (for internal package updates)
 */
async function getDependencyReleaseLine(_changesets, dependenciesUpdated) {
  if (dependenciesUpdated.length === 0) {
    return "";
  }

  const deps = dependenciesUpdated.map((dep) => `  - ${dep.name}@${dep.newVersion}`);

  return `- Updated dependencies:\n${deps.join("\n")}`;
}

module.exports = {
  getReleaseLine,
  getDependencyReleaseLine,
};
