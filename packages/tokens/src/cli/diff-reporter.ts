/**
 * Token Diff Reporter
 * Reports changes between token builds for PR reviews
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** Token change */
export interface TokenChange {
  path: string;
  type: 'added' | 'removed' | 'modified';
  oldValue?: unknown;
  newValue?: unknown;
}

/** Diff report */
export interface DiffReport {
  hasChanges: boolean;
  added: TokenChange[];
  removed: TokenChange[];
  modified: TokenChange[];
  summary: string;
}

/**
 * Compare two token JSON files and generate a diff report
 */
export function compareTokens(oldPath: string, newPath: string): DiffReport {
  const oldTokens = loadTokens(oldPath);
  const newTokens = loadTokens(newPath);

  const added: TokenChange[] = [];
  const removed: TokenChange[] = [];
  const modified: TokenChange[] = [];

  // Find added and modified tokens
  for (const [path, newValue] of Object.entries(newTokens)) {
    if (!(path in oldTokens)) {
      added.push({ path, type: 'added', newValue });
    } else if (JSON.stringify(oldTokens[path]) !== JSON.stringify(newValue)) {
      modified.push({
        path,
        type: 'modified',
        oldValue: oldTokens[path],
        newValue,
      });
    }
  }

  // Find removed tokens
  for (const path of Object.keys(oldTokens)) {
    if (!(path in newTokens)) {
      removed.push({ path, type: 'removed', oldValue: oldTokens[path] });
    }
  }

  const hasChanges = added.length > 0 || removed.length > 0 || modified.length > 0;

  const summary = generateSummary(added, removed, modified);

  return { hasChanges, added, removed, modified, summary };
}

/**
 * Load tokens from JSON file
 */
function loadTokens(path: string): Record<string, unknown> {
  if (!existsSync(path)) {
    return {};
  }

  const content = readFileSync(path, 'utf-8');
  const data = JSON.parse(content);

  // Flatten tokens to path -> value map
  const tokens: Record<string, unknown> = {};

  if (data.tokens) {
    for (const [path, value] of Object.entries(data.tokens)) {
      tokens[path] = value;
    }
  }

  return tokens;
}

/**
 * Generate human-readable summary
 */
function generateSummary(
  added: TokenChange[],
  removed: TokenChange[],
  modified: TokenChange[]
): string {
  const parts: string[] = [];

  if (added.length > 0) {
    parts.push(`${added.length} token(s) added`);
  }
  if (removed.length > 0) {
    parts.push(`${removed.length} token(s) removed`);
  }
  if (modified.length > 0) {
    parts.push(`${modified.length} token(s) modified`);
  }

  if (parts.length === 0) {
    return 'No token changes';
  }

  return parts.join(', ');
}

/**
 * Format diff report as markdown for PR comments
 */
export function formatDiffAsMarkdown(report: DiffReport): string {
  if (!report.hasChanges) {
    return '### Token Changes\n\nNo token changes detected.';
  }

  const lines: string[] = [
    '### Token Changes',
    '',
    report.summary,
    '',
  ];

  if (report.added.length > 0) {
    lines.push('#### Added Tokens');
    lines.push('');
    lines.push('| Token | Value |');
    lines.push('|-------|-------|');
    for (const change of report.added) {
      lines.push(`| \`${change.path}\` | \`${formatValue(change.newValue)}\` |`);
    }
    lines.push('');
  }

  if (report.removed.length > 0) {
    lines.push('#### Removed Tokens');
    lines.push('');
    lines.push('| Token | Previous Value |');
    lines.push('|-------|----------------|');
    for (const change of report.removed) {
      lines.push(`| \`${change.path}\` | \`${formatValue(change.oldValue)}\` |`);
    }
    lines.push('');
  }

  if (report.modified.length > 0) {
    lines.push('#### Modified Tokens');
    lines.push('');
    lines.push('| Token | Before | After |');
    lines.push('|-------|--------|-------|');
    for (const change of report.modified) {
      lines.push(
        `| \`${change.path}\` | \`${formatValue(change.oldValue)}\` | \`${formatValue(change.newValue)}\` |`
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format a value for display
 */
function formatValue(value: unknown): string {
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

// CLI runner
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  if (args.length < 2 || !args[0] || !args[1]) {
    console.log('Usage: diff-reporter.ts <old-tokens.json> <new-tokens.json>');
    process.exit(1);
  }

  const report = compareTokens(args[0], args[1]);
  console.log(formatDiffAsMarkdown(report));
}
