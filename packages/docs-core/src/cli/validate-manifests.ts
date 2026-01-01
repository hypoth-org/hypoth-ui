#!/usr/bin/env tsx
/**
 * Manifest Validation CLI
 *
 * Validates all component manifests against the contract JSON schema.
 *
 * Usage: pnpm validate:manifests [--root-dir <dir>] [--strict]
 */

import { formatErrorForConsole, formatWarningForConsole } from "../validation/error-messages.js";
import { validateAllManifests } from "../validation/validate-manifests.js";

interface CliOptions {
  rootDir: string;
  strict: boolean;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    rootDir: process.cwd(),
    strict: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i] as string;
    const nextArg = args[i + 1];
    if (arg === "--root-dir" && nextArg) {
      options.rootDir = nextArg;
      i++;
    } else if (arg === "--strict") {
      options.strict = true;
    } else if (!arg.startsWith("--")) {
      options.rootDir = arg;
    }
  }

  return options;
}

async function main(): Promise<void> {
  const options = parseArgs();

  console.info("\n\x1b[1mValidating component manifests...\x1b[0m\n");
  console.info(`Root directory: ${options.rootDir}`);
  console.info(`Strict mode: ${options.strict ? "enabled" : "disabled"}\n`);

  const result = await validateAllManifests({
    rootDir: options.rootDir,
    pattern: "**/components/**/manifest.json",
  });

  if (result.files.length === 0) {
    console.info("\x1b[33mNo manifest files found.\x1b[0m");
    console.info("Expected pattern: **/components/**/manifest.json\n");
    process.exit(0);
  }

  // Print results per file
  for (const fileResult of result.files) {
    const relativePath = fileResult.file.replace(`${options.rootDir}/`, "");

    if (fileResult.valid && fileResult.warnings.length === 0) {
      console.info(`\x1b[32m✓\x1b[0m ${relativePath}`);
    } else if (fileResult.valid) {
      console.info(`\x1b[33m⚠\x1b[0m ${relativePath}`);
    } else {
      console.info(`\x1b[31m✗\x1b[0m ${relativePath}`);
    }
  }

  console.info("");

  // Print errors
  if (result.errors.length > 0) {
    console.info("\x1b[31mErrors:\x1b[0m");
    for (const error of result.errors) {
      console.info(`  ${formatErrorForConsole(error)}`);
    }
    console.info("");
  }

  // Print warnings
  if (result.warnings.length > 0) {
    console.info("\x1b[33mWarnings:\x1b[0m");
    for (const warning of result.warnings) {
      console.info(`  ${formatWarningForConsole(warning)}`);
    }
    console.info("");
  }

  // Summary
  const validCount = result.files.filter((f) => f.valid).length;
  const invalidCount = result.files.length - validCount;

  console.info("\x1b[1mSummary:\x1b[0m");
  console.info(`  Files: ${result.files.length}`);
  console.info(`  Valid: ${validCount}`);
  console.info(`  Invalid: ${invalidCount}`);
  console.info(`  Errors: ${result.errorCount}`);
  console.info(`  Warnings: ${result.warningCount}`);
  console.info("");

  // Determine exit code
  if (result.errorCount > 0) {
    console.info("\x1b[31mValidation failed.\x1b[0m\n");
    process.exit(1);
  }

  if (options.strict && result.warningCount > 0) {
    console.info("\x1b[31mValidation failed (strict mode - warnings treated as errors).\x1b[0m\n");
    process.exit(1);
  }

  console.info("\x1b[32mValidation passed.\x1b[0m\n");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
