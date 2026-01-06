#!/usr/bin/env node
/**
 * ds-check-gates CLI
 *
 * Run contribution gates to validate a PR or commit.
 *
 * Usage:
 *   ds-check-gates
 *   ds-check-gates --gate test-coverage --gate lint
 *   ds-check-gates --parallel
 */

import { Command } from "commander";
import * as path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import {
  checkGates,
  formatGatesReport,
  getRequiredFailures,
  loadGatesConfig,
} from "../gates/checker.js";
import type { GateContext } from "../gates/types.js";

const execAsync = promisify(exec);

const program = new Command();

// Default config path
const defaultConfigPath = path.join(process.cwd(), "packages/governance/gates.json");

/**
 * Get changed files from git
 */
async function getChangedFiles(repoRoot: string): Promise<string[]> {
  try {
    // Get files changed in current branch compared to main
    const { stdout } = await execAsync(
      "git diff --name-only main...HEAD",
      { cwd: repoRoot }
    );
    return stdout.trim().split("\n").filter(Boolean);
  } catch {
    // Fallback: staged files
    try {
      const { stdout } = await execAsync(
        "git diff --name-only --cached",
        { cwd: repoRoot }
      );
      return stdout.trim().split("\n").filter(Boolean);
    } catch {
      return [];
    }
  }
}

/**
 * Get current branch name
 */
async function getCurrentBranch(repoRoot: string): Promise<string> {
  try {
    const { stdout } = await execAsync(
      "git rev-parse --abbrev-ref HEAD",
      { cwd: repoRoot }
    );
    return stdout.trim();
  } catch {
    return "unknown";
  }
}

program
  .name("ds-check-gates")
  .description("Run contribution gates")
  .version("1.0.0");

// Main check command
program
  .command("run", { isDefault: true })
  .description("Run contribution gates")
  .option("-c, --config <path>", "Path to gates config", defaultConfigPath)
  .option("-g, --gate <gates...>", "Specific gates to run")
  .option("-p, --parallel", "Run gates in parallel")
  .option("--json", "Output as JSON")
  .option("--fail-fast", "Stop on first failure")
  .action(async (options) => {
    const repoRoot = process.cwd();

    // Build context
    const context: GateContext = {
      repoRoot,
      files: await getChangedFiles(repoRoot),
      branch: await getCurrentBranch(repoRoot),
    };

    try {
      const report = await checkGates(options.config, context, {
        parallel: options.parallel,
        gates: options.gate,
      });

      if (options.json) {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(formatGatesReport(report));
      }

      // Exit with error code if failed
      if (!report.passed) {
        const config = loadGatesConfig(options.config);
        const requiredFailures = getRequiredFailures(report, config);

        if (requiredFailures.length > 0) {
          console.error(
            `\nBlocked: ${requiredFailures.length} required gate(s) failed.`
          );
          process.exit(1);
        }
      }
    } catch (error: unknown) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

// List gates command
program
  .command("list")
  .description("List available gates")
  .option("-c, --config <path>", "Path to gates config", defaultConfigPath)
  .option("--json", "Output as JSON")
  .action((options) => {
    try {
      const config = loadGatesConfig(options.config);

      if (options.json) {
        console.log(JSON.stringify(config.gates, null, 2));
        return;
      }

      console.log("\n=== Available Gates ===\n");

      const automated = config.gates.filter((g) => g.type === "automated");
      const manual = config.gates.filter((g) => g.type === "manual");

      if (automated.length > 0) {
        console.log("Automated Gates:");
        for (const gate of automated) {
          const required = gate.required ? "[required]" : "[optional]";
          console.log(`  - ${gate.id} ${required}`);
          console.log(`    ${gate.description}`);
        }
        console.log("");
      }

      if (manual.length > 0) {
        console.log("Manual Gates:");
        for (const gate of manual) {
          const required = gate.required ? "[required]" : "[optional]";
          console.log(`  - ${gate.id} ${required}`);
          console.log(`    ${gate.description}`);
        }
      }
    } catch (error: unknown) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

// Status command (for CI output)
program
  .command("status")
  .description("Get gate status for CI")
  .option("-c, --config <path>", "Path to gates config", defaultConfigPath)
  .option("-g, --gate <gate>", "Specific gate to check")
  .action(async (options) => {
    const repoRoot = process.cwd();

    const context: GateContext = {
      repoRoot,
      files: await getChangedFiles(repoRoot),
      branch: await getCurrentBranch(repoRoot),
    };

    try {
      const report = await checkGates(options.config, context, {
        gates: options.gate ? [options.gate] : undefined,
      });

      // Output in a CI-friendly format
      for (const result of report.results) {
        const status = result.skipped
          ? "skipped"
          : result.passed
            ? "success"
            : "failure";
        console.log(`${result.gate}:${status}`);
      }

      process.exit(report.passed ? 0 : 1);
    } catch (error: unknown) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

program.parse();
