#!/usr/bin/env node
/**
 * ds-deprecate CLI
 *
 * Manage deprecations in the design system.
 *
 * Usage:
 *   ds-deprecate add <item> --type <type> --version <version> [options]
 *   ds-deprecate list [--status <status>] [--type <type>]
 *   ds-deprecate check <version>
 *   ds-deprecate migrate <from> <to>
 */

import { Command } from "commander";
import * as path from "node:path";
import type { DeprecationType, Edition } from "../types/index.js";
import {
  addDeprecation,
  createDeprecation,
  getActiveDeprecations,
  getUpcomingRemovals,
  loadDeprecationRegistry,
  queryDeprecations,
  saveDeprecationRegistry,
  validateDeprecationWindow,
} from "../deprecation/registry.js";
import {
  formatConsoleWarning,
  generateWarning,
} from "../deprecation/warnings.js";
import {
  generateMigrationMarkdown,
  generateVersionMigration,
} from "../deprecation/migration.js";

const program = new Command();

// Default registry path
const defaultRegistryPath = path.join(process.cwd(), "packages/governance/deprecations.json");

program
  .name("ds-deprecate")
  .description("Manage deprecations in the design system")
  .version("1.0.0");

// Add deprecation command
program
  .command("add <item>")
  .description("Add a new deprecation")
  .requiredOption("-t, --type <type>", "Deprecation type (component, prop, css-variable, utility, pattern)")
  .requiredOption("-v, --version <version>", "Version where deprecation starts")
  .option("-r, --replacement <replacement>", "Replacement item")
  .option("-p, --package <package>", "Package name")
  .option("--reason <reason>", "Reason for deprecation")
  .option("--migration-guide <url>", "URL to migration guide")
  .option("--editions <editions>", "Comma-separated list of editions")
  .option("--registry <path>", "Path to deprecation registry", defaultRegistryPath)
  .action((item, options) => {
    try {
      const registry = loadDeprecationRegistry(options.registry);

      const editions = options.editions
        ? (options.editions.split(",").map((e: string) => e.trim()) as Edition[])
        : undefined;

      const record = createDeprecation(item, options.type as DeprecationType, options.version, {
        package: options.package,
        replacement: options.replacement,
        reason: options.reason,
        migrationGuide: options.migrationGuide,
        editions,
      });

      if (!validateDeprecationWindow(record)) {
        console.error("Error: Deprecation window must be at least 2 major versions.");
        process.exit(1);
      }

      const updatedRegistry = addDeprecation(registry, record);
      saveDeprecationRegistry(options.registry, updatedRegistry);

      console.log(`Added deprecation for ${options.type} "${item}"`);
      console.log(`  Deprecated in: ${record.deprecated_in}`);
      console.log(`  Removal in: ${record.removal_version}`);
      if (record.replacement) {
        console.log(`  Replacement: ${record.replacement}`);
      }
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// List deprecations command
program
  .command("list")
  .description("List deprecations")
  .option("-s, --status <status>", "Filter by status (active, warning, removal-imminent, removed)")
  .option("-t, --type <type>", "Filter by type")
  .option("-p, --package <package>", "Filter by package")
  .option("-e, --edition <edition>", "Filter by edition")
  .option("-v, --current-version <version>", "Current version for status calculation", "1.0.0")
  .option("--registry <path>", "Path to deprecation registry", defaultRegistryPath)
  .option("--json", "Output as JSON")
  .action((options) => {
    const registry = loadDeprecationRegistry(options.registry);

    const results = queryDeprecations(registry, {
      status: options.status,
      type: options.type as DeprecationType,
      package: options.package,
      edition: options.edition as Edition,
      currentVersion: options.currentVersion,
    });

    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    if (results.length === 0) {
      console.log("No deprecations found.");
      return;
    }

    console.log(`Found ${results.length} deprecation(s):\n`);

    for (const dep of results) {
      const warning = generateWarning(dep);
      console.log(formatConsoleWarning(warning));
      console.log("");
    }
  });

// Check version for removals
program
  .command("check <version>")
  .description("Check for upcoming removals in a version")
  .option("--registry <path>", "Path to deprecation registry", defaultRegistryPath)
  .action((version, options) => {
    const registry = loadDeprecationRegistry(options.registry);
    const upcoming = getUpcomingRemovals(registry, version);

    if (upcoming.length === 0) {
      console.log(`No items scheduled for removal in version ${version}.`);
      return;
    }

    console.log(`\nItems to be removed after ${version}:\n`);

    for (const dep of upcoming) {
      console.log(`  - [${dep.type}] ${dep.item}`);
      if (dep.replacement) {
        console.log(`    Replacement: ${dep.replacement}`);
      }
    }

    console.log(`\nTotal: ${upcoming.length} item(s) will be removed.\n`);
  });

// Generate migration guide
program
  .command("migrate <from> <to>")
  .description("Generate migration guide between versions")
  .option("--registry <path>", "Path to deprecation registry", defaultRegistryPath)
  .option("-o, --output <path>", "Output file path")
  .action((from, to, options) => {
    const registry = loadDeprecationRegistry(options.registry);

    // Get deprecations that were removed between these versions
    const relevantDeprecations = registry.deprecations.filter((d) => {
      const removalParts = d.removal_version.split(".").map(Number);
      const toParts = to.split(".").map(Number);
      const fromParts = from.split(".").map(Number);

      const removalMajor = removalParts[0] ?? 0;
      const toMajor = toParts[0] ?? 0;
      const fromMajor = fromParts[0] ?? 0;

      // Include if removal is between from and to versions
      return removalMajor > fromMajor && removalMajor <= toMajor;
    });

    if (relevantDeprecations.length === 0) {
      console.log(`No breaking changes between ${from} and ${to}.`);
      return;
    }

    const guide = generateVersionMigration(from, to, relevantDeprecations);
    const markdown = generateMigrationMarkdown(guide);

    if (options.output) {
      const fs = require("node:fs");
      fs.writeFileSync(options.output, markdown, "utf-8");
      console.log(`Migration guide written to ${options.output}`);
    } else {
      console.log(markdown);
    }
  });

// Active deprecations report
program
  .command("report")
  .description("Generate deprecation report")
  .option("-v, --current-version <version>", "Current version", "1.0.0")
  .option("--registry <path>", "Path to deprecation registry", defaultRegistryPath)
  .action((options) => {
    const registry = loadDeprecationRegistry(options.registry);
    const active = getActiveDeprecations(registry, options.currentVersion);

    const byStatus = {
      active: active.filter((d) => d.status === "active"),
      warning: active.filter((d) => d.status === "warning"),
      "removal-imminent": active.filter((d) => d.status === "removal-imminent"),
    };

    console.log("\n=== Deprecation Report ===\n");
    console.log(`Current Version: ${options.currentVersion}`);
    console.log(`Total Active Deprecations: ${active.length}\n`);

    if (byStatus["removal-imminent"].length > 0) {
      console.log("REMOVAL IMMINENT (next major version):");
      for (const d of byStatus["removal-imminent"]) {
        console.log(`  - [${d.type}] ${d.item}`);
      }
      console.log("");
    }

    if (byStatus.warning.length > 0) {
      console.log("WARNING (2 versions remaining):");
      for (const d of byStatus.warning) {
        console.log(`  - [${d.type}] ${d.item}`);
      }
      console.log("");
    }

    if (byStatus.active.length > 0) {
      console.log("ACTIVE:");
      for (const d of byStatus.active) {
        console.log(`  - [${d.type}] ${d.item} (${d.versionsUntilRemoval} versions)`);
      }
      console.log("");
    }
  });

program.parse();
