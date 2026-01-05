#!/usr/bin/env node
/**
 * ds-tenant-diff CLI
 *
 * Generate update reports for tenants based on their edition and version.
 *
 * Usage:
 *   ds-tenant-diff --version <version> --edition <edition> [--latest <version>]
 *   ds-tenant-diff --tenant <tenant-id> --releases <releases-file>
 */

import { Command } from "commander";
import * as fs from "node:fs";
import type { Edition } from "../types/index.js";
import type { ReleaseWithEntries } from "../changelog/types.js";
import type { TenantInfo } from "../tenant/types.js";
import {
  calculateVersionDiff,
  formatUpdateReport,
  generateTenantUpdateReport,
  generateUpdateRecommendation,
} from "../tenant/diff.js";

const program = new Command();

program
  .name("ds-tenant-diff")
  .description("Generate update reports for tenants")
  .version("1.0.0");

// Quick diff command
program
  .command("diff")
  .description("Calculate version diff")
  .requiredOption("-v, --version <version>", "Current tenant version")
  .requiredOption("-e, --edition <edition>", "Tenant edition (core, pro, enterprise)")
  .option("-l, --latest <version>", "Latest version", "1.0.0")
  .option("-r, --releases <path>", "Path to releases JSON file")
  .option("--json", "Output as JSON")
  .action((options) => {
    // Load releases or use empty
    let releases: ReleaseWithEntries[] = [];
    if (options.releases && fs.existsSync(options.releases)) {
      const content = fs.readFileSync(options.releases, "utf-8");
      releases = JSON.parse(content);
    }

    const diff = calculateVersionDiff(
      options.version,
      options.latest,
      releases,
      options.edition as Edition
    );

    if (options.json) {
      console.log(JSON.stringify(diff, null, 2));
    } else {
      console.log("\n=== Version Diff ===\n");
      console.log(`From: ${diff.fromVersion}`);
      console.log(`To: ${diff.toVersion}`);
      console.log(`Versions Behind: ${diff.versionsBehind}`);
      console.log(`Has Major Upgrade: ${diff.hasMajorUpgrade ? "Yes" : "No"}`);
      console.log(`Has Security Updates: ${diff.hasSecurityUpdates ? "Yes" : "No"}`);
      console.log(`Has Breaking Changes: ${diff.hasBreakingChanges ? "Yes" : "No"}`);
    }
  });

// Full report command
program
  .command("report")
  .description("Generate full update report")
  .requiredOption("-n, --name <name>", "Tenant name")
  .requiredOption("-v, --version <version>", "Current tenant version")
  .requiredOption("-e, --edition <edition>", "Tenant edition (core, pro, enterprise)")
  .option("-l, --latest <version>", "Latest version", "1.0.0")
  .option("-r, --releases <path>", "Path to releases JSON file")
  .option("-o, --output <path>", "Output file path")
  .option("--json", "Output as JSON")
  .action((options) => {
    // Load releases or use empty
    let releases: ReleaseWithEntries[] = [];
    if (options.releases && fs.existsSync(options.releases)) {
      const content = fs.readFileSync(options.releases, "utf-8");
      releases = JSON.parse(content);
    }

    const tenant: TenantInfo = {
      id: options.name.toLowerCase().replace(/\s+/g, "-"),
      name: options.name,
      edition: options.edition as Edition,
      currentVersion: options.version,
    };

    const report = generateTenantUpdateReport(tenant, releases, options.latest);

    let output: string;
    if (options.json) {
      output = JSON.stringify(report, null, 2);
    } else {
      output = formatUpdateReport(report);
    }

    if (options.output) {
      fs.writeFileSync(options.output, output, "utf-8");
      console.log(`Report written to ${options.output}`);
    } else {
      console.log(output);
    }
  });

// Recommendation command
program
  .command("recommend")
  .description("Get update recommendation")
  .requiredOption("-v, --version <version>", "Current tenant version")
  .requiredOption("-e, --edition <edition>", "Tenant edition (core, pro, enterprise)")
  .option("-l, --latest <version>", "Latest version", "1.0.0")
  .option("-r, --releases <path>", "Path to releases JSON file")
  .option("--json", "Output as JSON")
  .action((options) => {
    // Load releases or use empty
    let releases: ReleaseWithEntries[] = [];
    if (options.releases && fs.existsSync(options.releases)) {
      const content = fs.readFileSync(options.releases, "utf-8");
      releases = JSON.parse(content);
    }

    const tenant: TenantInfo = {
      id: "tenant",
      name: "Tenant",
      edition: options.edition as Edition,
      currentVersion: options.version,
    };

    const report = generateTenantUpdateReport(tenant, releases, options.latest);
    const recommendation = generateUpdateRecommendation(report);

    if (options.json) {
      console.log(JSON.stringify(recommendation, null, 2));
    } else {
      console.log(`\nUrgency: ${recommendation.urgency.toUpperCase()}`);
      console.log(recommendation.message);
      console.log("");

      if (recommendation.reasons.length > 0) {
        console.log("Reasons:");
        for (const reason of recommendation.reasons) {
          console.log(`  - ${reason}`);
        }
        console.log("");
      }

      if (recommendation.nextSteps.length > 0) {
        console.log("Next Steps:");
        for (let i = 0; i < recommendation.nextSteps.length; i++) {
          console.log(`  ${i + 1}. ${recommendation.nextSteps[i]}`);
        }
      }
    }
  });

program.parse();
