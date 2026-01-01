#!/usr/bin/env tsx
/**
 * Component Audit CLI
 *
 * Generates audit reports showing component status, editions, and validation state.
 *
 * Usage: pnpm audit [--root-dir <dir>] [--format json|markdown|table] [--status <status>]
 */

import { readFile } from "node:fs/promises";
import type { ComponentStatus, DocsFrontmatter, Edition } from "../types/manifest.js";
import { buildManifestMap, generateCrossRefReport } from "../validation/validate-cross-refs.js";
import { discoverDocs, extractFrontmatter } from "../validation/validate-frontmatter.js";
import { loadValidManifests } from "../validation/validate-manifests.js";

type OutputFormat = "json" | "markdown" | "table";

interface CliOptions {
  rootDir: string;
  format: OutputFormat;
  statusFilter?: ComponentStatus;
  editionFilter?: Edition;
  showUndocumented: boolean;
  showWarnings: boolean;
}

interface AuditResult {
  timestamp: string;
  totalComponents: number;
  components: ComponentAuditEntry[];
  summary: {
    byStatus: Record<ComponentStatus, number>;
    byEdition: Record<Edition, number>;
    documented: number;
    undocumented: number;
    withWarnings: number;
  };
}

interface ComponentAuditEntry {
  id: string;
  name: string;
  status: ComponentStatus;
  editions: Edition[];
  hasDocumentation: boolean;
  warnings: string[];
  validationState: "valid" | "warnings" | "missing-docs";
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    rootDir: process.cwd(),
    format: "table",
    showUndocumented: true,
    showWarnings: true,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i] as string;
    const nextArg = args[i + 1];
    if (arg === "--root-dir" && nextArg) {
      options.rootDir = nextArg;
      i++;
    } else if ((arg === "--format" || arg === "-f") && nextArg) {
      if (["json", "markdown", "table"].includes(nextArg)) {
        options.format = nextArg as OutputFormat;
      }
      i++;
    } else if ((arg === "--status" || arg === "-s") && nextArg) {
      options.statusFilter = nextArg as ComponentStatus;
      i++;
    } else if ((arg === "--edition" || arg === "-e") && nextArg) {
      options.editionFilter = nextArg as Edition;
      i++;
    } else if (arg === "--no-undocumented") {
      options.showUndocumented = false;
    } else if (arg === "--no-warnings") {
      options.showWarnings = false;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else if (!arg.startsWith("--")) {
      options.rootDir = arg;
    }
  }

  return options;
}

function printHelp(): void {
  console.info(`
\x1b[1mUsage:\x1b[0m pnpm audit [options] [root-dir]

\x1b[1mOptions:\x1b[0m
  --root-dir <dir>         Root directory to search (default: cwd)
  --format, -f <format>    Output format: json, markdown, table (default: table)
  --status, -s <status>    Filter by status: experimental, alpha, beta, stable, deprecated
  --edition, -e <edition>  Filter by edition: core, pro, enterprise
  --no-undocumented        Hide undocumented components
  --no-warnings            Hide warning details
  --help, -h               Show this help message

\x1b[1mExamples:\x1b[0m
  pnpm audit                          # Audit all components
  pnpm audit --format json            # Output as JSON
  pnpm audit --status deprecated      # Show only deprecated components
  pnpm audit --edition enterprise     # Show only enterprise components
`);
}

async function generateAudit(options: CliOptions): Promise<AuditResult> {
  // Load and validate manifests
  const { manifests } = await loadValidManifests({
    rootDir: options.rootDir,
    pattern: "**/components/**/manifest.json",
  });

  // Load docs
  const docFiles = await discoverDocs({
    rootDir: options.rootDir,
    pattern: "**/docs-content/**/*.mdx",
  });

  // Build manifest map for cross-reference
  const manifestMap = buildManifestMap(manifests);

  // Load docs frontmatter
  const docsWithFrontmatter: Array<{ filePath: string; frontmatter: DocsFrontmatter }> = [];
  for (const file of docFiles) {
    const content = await readFile(file, "utf-8");
    const parsed = extractFrontmatter(content);
    if (parsed?.data.component) {
      docsWithFrontmatter.push({
        filePath: file,
        frontmatter: parsed.data as unknown as DocsFrontmatter,
      });
    }
  }

  // Get cross-reference report
  const crossRefReport = generateCrossRefReport(docsWithFrontmatter, manifestMap);

  // Build audit entries
  const components: ComponentAuditEntry[] = [];
  const documentedSet = new Set(crossRefReport.documented);
  const statusMismatchMap = new Map(crossRefReport.statusMismatches.map((m) => [m.component, m]));

  for (const manifest of manifests) {
    const hasDoc = documentedSet.has(manifest.id);
    const warnings: string[] = [];

    // Check for status mismatch
    const mismatch = statusMismatchMap.get(manifest.id);
    if (mismatch) {
      warnings.push(
        `Status mismatch: doc="${mismatch.docStatus}" manifest="${mismatch.manifestStatus}"`
      );
    }

    // Check for missing recommended usage
    if (!manifest.recommendedUsage) {
      warnings.push("Missing recommended usage guidance");
    }

    // Check for missing tokens
    if (!manifest.tokensUsed || manifest.tokensUsed.length === 0) {
      warnings.push("No tokens specified");
    }

    // Determine validation state
    let validationState: ComponentAuditEntry["validationState"] = "valid";
    if (!hasDoc) {
      validationState = "missing-docs";
    } else if (warnings.length > 0) {
      validationState = "warnings";
    }

    components.push({
      id: manifest.id,
      name: manifest.name,
      status: manifest.status,
      editions: manifest.editions,
      hasDocumentation: hasDoc,
      warnings,
      validationState,
    });
  }

  // Apply filters
  let filtered = components;

  if (options.statusFilter) {
    filtered = filtered.filter((c) => c.status === options.statusFilter);
  }

  if (options.editionFilter) {
    const editionToFilter = options.editionFilter;
    filtered = filtered.filter((c) => c.editions.includes(editionToFilter));
  }

  if (!options.showUndocumented) {
    filtered = filtered.filter((c) => c.hasDocumentation);
  }

  // Calculate summary
  const summary = {
    byStatus: {} as Record<ComponentStatus, number>,
    byEdition: {} as Record<Edition, number>,
    documented: 0,
    undocumented: 0,
    withWarnings: 0,
  };

  for (const c of filtered) {
    // Status counts
    summary.byStatus[c.status] = (summary.byStatus[c.status] || 0) + 1;

    // Edition counts
    for (const edition of c.editions) {
      summary.byEdition[edition] = (summary.byEdition[edition] || 0) + 1;
    }

    // Documentation counts
    if (c.hasDocumentation) {
      summary.documented++;
    } else {
      summary.undocumented++;
    }

    if (c.warnings.length > 0) {
      summary.withWarnings++;
    }
  }

  return {
    timestamp: new Date().toISOString(),
    totalComponents: filtered.length,
    components: filtered,
    summary,
  };
}

function formatAsTable(result: AuditResult, showWarnings: boolean): string {
  const lines: string[] = [];

  // Header
  lines.push("\n\x1b[1mComponent Audit Report\x1b[0m");
  lines.push(`Generated: ${result.timestamp}`);
  lines.push(`Total components: ${result.totalComponents}\n`);

  // Status summary
  lines.push("\x1b[1mBy Status:\x1b[0m");
  for (const [status, count] of Object.entries(result.summary.byStatus)) {
    lines.push(`  ${status}: ${count}`);
  }
  lines.push("");

  // Edition summary
  lines.push("\x1b[1mBy Edition:\x1b[0m");
  for (const [edition, count] of Object.entries(result.summary.byEdition)) {
    lines.push(`  ${edition}: ${count}`);
  }
  lines.push("");

  // Documentation summary
  lines.push("\x1b[1mDocumentation:\x1b[0m");
  lines.push(`  Documented: ${result.summary.documented}`);
  lines.push(`  Undocumented: ${result.summary.undocumented}`);
  lines.push(`  With warnings: ${result.summary.withWarnings}`);
  lines.push("");

  // Component table
  lines.push("\x1b[1mComponents:\x1b[0m");
  lines.push(
    "┌─────────────────────┬────────────┬────────────┬───────┬─────────────────────────────┐"
  );
  lines.push(
    "│ Component           │ Status     │ Editions   │ Docs  │ State                       │"
  );
  lines.push(
    "├─────────────────────┼────────────┼────────────┼───────┼─────────────────────────────┤"
  );

  for (const c of result.components) {
    const name = c.name.padEnd(19).slice(0, 19);
    const status = c.status.padEnd(10);
    const editions = c.editions.join(",").padEnd(10).slice(0, 10);
    const docs = c.hasDocumentation ? "  ✓  " : "  ✗  ";
    const stateIcon =
      c.validationState === "valid"
        ? "\x1b[32m✓ valid\x1b[0m"
        : c.validationState === "warnings"
          ? "\x1b[33m⚠ warnings\x1b[0m"
          : "\x1b[31m✗ missing-docs\x1b[0m";
    const state = stateIcon.padEnd(38);

    lines.push(`│ ${name} │ ${status} │ ${editions} │${docs}│ ${state}│`);

    if (showWarnings && c.warnings.length > 0) {
      for (const warning of c.warnings) {
        lines.push(`│   \x1b[33m↳ ${warning.padEnd(74).slice(0, 74)}\x1b[0m │`);
      }
    }
  }

  lines.push(
    "└─────────────────────┴────────────┴────────────┴───────┴─────────────────────────────┘"
  );
  lines.push("");

  return lines.join("\n");
}

function formatAsMarkdown(result: AuditResult): string {
  const lines: string[] = [];

  lines.push("# Component Audit Report");
  lines.push("");
  lines.push(`**Generated:** ${result.timestamp}`);
  lines.push(`**Total Components:** ${result.totalComponents}`);
  lines.push("");

  lines.push("## Summary");
  lines.push("");
  lines.push("### By Status");
  lines.push("");
  for (const [status, count] of Object.entries(result.summary.byStatus)) {
    lines.push(`- **${status}:** ${count}`);
  }
  lines.push("");

  lines.push("### By Edition");
  lines.push("");
  for (const [edition, count] of Object.entries(result.summary.byEdition)) {
    lines.push(`- **${edition}:** ${count}`);
  }
  lines.push("");

  lines.push("### Documentation Coverage");
  lines.push("");
  lines.push(`- **Documented:** ${result.summary.documented}`);
  lines.push(`- **Undocumented:** ${result.summary.undocumented}`);
  lines.push(`- **With warnings:** ${result.summary.withWarnings}`);
  lines.push("");

  lines.push("## Components");
  lines.push("");
  lines.push("| Component | Status | Editions | Docs | State |");
  lines.push("|-----------|--------|----------|------|-------|");

  for (const c of result.components) {
    const docs = c.hasDocumentation ? "✓" : "✗";
    const state =
      c.validationState === "valid"
        ? "✓ Valid"
        : c.validationState === "warnings"
          ? "⚠ Warnings"
          : "✗ Missing Docs";
    lines.push(`| ${c.name} | ${c.status} | ${c.editions.join(", ")} | ${docs} | ${state} |`);
  }
  lines.push("");

  return lines.join("\n");
}

async function main(): Promise<void> {
  const options = parseArgs();

  console.info("\n\x1b[1mRunning Component Audit...\x1b[0m\n");

  const result = await generateAudit(options);

  switch (options.format) {
    case "json":
      console.info(JSON.stringify(result, null, 2));
      break;
    case "markdown":
      console.info(formatAsMarkdown(result));
      break;
    default:
      console.info(formatAsTable(result, options.showWarnings));
      break;
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
