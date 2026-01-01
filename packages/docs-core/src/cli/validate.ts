#!/usr/bin/env tsx
/**
 * Unified Validation CLI
 *
 * Validates both component manifests and documentation files,
 * including cross-reference checking between docs and manifests.
 *
 * Usage: pnpm validate [--root-dir <dir>] [--strict] [--manifests-only] [--docs-only] [--watch]
 */

import { watch } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { DocsFrontmatter } from "../types/manifest.js";
import { createEmptyResult, mergeResults } from "../types/validation.js";
import type { ValidationError, ValidationResult, ValidationWarning } from "../types/validation.js";
import { formatErrorForConsole, formatWarningForConsole } from "../validation/error-messages.js";
import {
  buildManifestMap,
  generateCrossRefReport,
  validateAllCrossRefs,
} from "../validation/validate-cross-refs.js";
import { extractFrontmatter, validateAllDocs } from "../validation/validate-frontmatter.js";
import { loadValidManifests, validateAllManifests } from "../validation/validate-manifests.js";

interface CliOptions {
  rootDir: string;
  strict: boolean;
  manifestsOnly: boolean;
  docsOnly: boolean;
  verbose: boolean;
  watch: boolean;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    rootDir: process.cwd(),
    strict: false,
    manifestsOnly: false,
    docsOnly: false,
    verbose: false,
    watch: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i] as string;
    const nextArg = args[i + 1];
    if (arg === "--root-dir" && nextArg) {
      options.rootDir = nextArg;
      i++;
    } else if (arg === "--strict") {
      options.strict = true;
    } else if (arg === "--manifests-only") {
      options.manifestsOnly = true;
    } else if (arg === "--docs-only") {
      options.docsOnly = true;
    } else if (arg === "--verbose" || arg === "-v") {
      options.verbose = true;
    } else if (arg === "--watch" || arg === "-w") {
      options.watch = true;
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
\x1b[1mUsage:\x1b[0m pnpm validate [options] [root-dir]

\x1b[1mOptions:\x1b[0m
  --root-dir <dir>   Root directory to search (default: cwd)
  --strict           Treat warnings as errors (useful for CI)
  --manifests-only   Only validate manifests, skip docs
  --docs-only        Only validate docs, skip manifests
  --watch, -w        Watch for changes and re-validate
  --verbose, -v      Show additional details
  --help, -h         Show this help message

\x1b[1mExamples:\x1b[0m
  pnpm validate                     # Validate everything in cwd
  pnpm validate --strict            # Fail on warnings (for CI)
  pnpm validate --manifests-only    # Only check manifests
  pnpm validate --watch             # Watch mode for development
  pnpm validate /path/to/project    # Validate specific directory
`);
}

function printSection(title: string): void {
  console.info(`\n\x1b[1m${title}\x1b[0m\n`);
}

function printFileResult(
  file: string,
  rootDir: string,
  valid: boolean,
  warningCount: number
): void {
  const relativePath = file.replace(`${rootDir}/`, "");

  if (valid && warningCount === 0) {
    console.info(`  \x1b[32m✓\x1b[0m ${relativePath}`);
  } else if (valid) {
    console.info(`  \x1b[33m⚠\x1b[0m ${relativePath}`);
  } else {
    console.info(`  \x1b[31m✗\x1b[0m ${relativePath}`);
  }
}

function printErrors(errors: ValidationError[], rootDir: string): void {
  if (errors.length === 0) return;

  console.info("\x1b[31mErrors:\x1b[0m");
  for (const error of errors) {
    const relativePath = error.file.replace(`${rootDir}/`, "");
    console.info(`  \x1b[31m✗\x1b[0m ${relativePath}`);
    console.info(`    ${formatErrorForConsole(error)}`);
  }
}

function printWarnings(warnings: ValidationWarning[], rootDir: string): void {
  if (warnings.length === 0) return;

  console.info("\x1b[33mWarnings:\x1b[0m");
  for (const warning of warnings) {
    const relativePath = warning.file.replace(`${rootDir}/`, "");
    console.info(`  \x1b[33m⚠\x1b[0m ${relativePath}`);
    console.info(`    ${formatWarningForConsole(warning)}`);
  }
}

async function runValidation(options: CliOptions): Promise<boolean> {
  console.info("\n\x1b[1m╔═══════════════════════════════════════════╗\x1b[0m");
  console.info("\x1b[1m║         Contract Validation Suite         ║\x1b[0m");
  console.info("\x1b[1m╚═══════════════════════════════════════════╝\x1b[0m\n");

  console.info(`Root directory: ${options.rootDir}`);
  console.info(`Strict mode: ${options.strict ? "enabled" : "disabled"}`);
  if (options.manifestsOnly) console.info("Mode: Manifests only");
  if (options.docsOnly) console.info("Mode: Docs only");

  const allResults: ValidationResult[] = [];
  let manifestResult = createEmptyResult();
  let docsResult = createEmptyResult();
  let crossRefErrors: ValidationError[] = [];
  let crossRefWarnings: ValidationWarning[] = [];

  // Step 1: Validate manifests
  if (!options.docsOnly) {
    printSection("1. Validating Component Manifests");

    manifestResult = await validateAllManifests({
      rootDir: options.rootDir,
      pattern: "**/components/**/manifest.json",
    });

    if (manifestResult.files.length === 0) {
      console.info("  \x1b[33mNo manifest files found.\x1b[0m");
    } else {
      for (const fileResult of manifestResult.files) {
        printFileResult(
          fileResult.file,
          options.rootDir,
          fileResult.valid,
          fileResult.warnings.length
        );
      }
    }

    allResults.push(manifestResult);
  }

  // Step 2: Validate docs
  if (!options.manifestsOnly) {
    printSection("2. Validating Documentation Files");

    docsResult = await validateAllDocs({
      rootDir: options.rootDir,
      pattern: "**/docs-content/**/*.mdx",
    });

    if (docsResult.files.length === 0) {
      console.info("  \x1b[33mNo documentation files found.\x1b[0m");
    } else {
      for (const fileResult of docsResult.files) {
        printFileResult(
          fileResult.file,
          options.rootDir,
          fileResult.valid,
          fileResult.warnings.length
        );
      }
    }

    allResults.push(docsResult);
  }

  // Step 3: Cross-reference validation (only if both manifests and docs are validated)
  if (
    !options.docsOnly &&
    !options.manifestsOnly &&
    manifestResult.files.length > 0 &&
    docsResult.files.length > 0
  ) {
    printSection("3. Cross-Reference Validation");

    // Load valid manifests
    const { manifests } = await loadValidManifests({
      rootDir: options.rootDir,
      pattern: "**/components/**/manifest.json",
    });

    // Build manifest map
    const manifestMap = buildManifestMap(manifests);

    // Load valid docs frontmatter
    const docsWithFrontmatter: Array<{ filePath: string; frontmatter: DocsFrontmatter }> = [];

    for (const fileResult of docsResult.files) {
      if (fileResult.valid) {
        const content = await readFile(fileResult.file, "utf-8");
        const parsed = extractFrontmatter(content);
        if (parsed?.data.component) {
          docsWithFrontmatter.push({
            filePath: fileResult.file,
            frontmatter: parsed.data as unknown as DocsFrontmatter,
          });
        }
      }
    }

    // Validate cross-references
    const crossRefResult = validateAllCrossRefs(docsWithFrontmatter, manifestMap);
    crossRefErrors = crossRefResult.errors;
    crossRefWarnings = crossRefResult.warnings;

    // Generate and display report
    const report = generateCrossRefReport(docsWithFrontmatter, manifestMap);

    console.info(`  Documented components: ${report.documented.length}`);
    console.info(`  Undocumented components: ${report.undocumented.length}`);
    console.info(`  Orphaned docs: ${report.orphanedDocs.length}`);
    console.info(`  Status mismatches: ${report.statusMismatches.length}`);

    if (options.verbose) {
      if (report.undocumented.length > 0) {
        console.info("\n  \x1b[33mUndocumented components:\x1b[0m");
        for (const id of report.undocumented) {
          console.info(`    - ${id}`);
        }
      }

      if (report.statusMismatches.length > 0) {
        console.info("\n  \x1b[33mStatus mismatches:\x1b[0m");
        for (const mismatch of report.statusMismatches) {
          console.info(
            `    - ${mismatch.component}: docs="${mismatch.docStatus}" manifest="${mismatch.manifestStatus}"`
          );
        }
      }
    }
  }

  // Print all errors and warnings
  printSection("Results");

  const mergedResult = mergeResults(...allResults);

  // Add cross-ref errors and warnings
  mergedResult.errors.push(...crossRefErrors);
  mergedResult.warnings.push(...crossRefWarnings);
  mergedResult.errorCount = mergedResult.errors.length;
  mergedResult.warningCount = mergedResult.warnings.length;

  if (mergedResult.errors.length > 0) {
    printErrors(mergedResult.errors, options.rootDir);
    console.info("");
  }

  if (mergedResult.warnings.length > 0) {
    printWarnings(mergedResult.warnings, options.rootDir);
    console.info("");
  }

  // Summary
  printSection("Summary");

  const manifestCount = manifestResult.files.length;
  const docsCount = docsResult.files.length;
  const validManifests = manifestResult.files.filter((f) => f.valid).length;
  const validDocs = docsResult.files.filter((f) => f.valid).length;

  if (!options.docsOnly) {
    console.info(`  Manifests: ${validManifests}/${manifestCount} valid`);
  }
  if (!options.manifestsOnly) {
    console.info(`  Docs: ${validDocs}/${docsCount} valid`);
  }
  console.info(`  Errors: ${mergedResult.errorCount}`);
  console.info(`  Warnings: ${mergedResult.warningCount}`);
  console.info("");

  // Determine result
  if (mergedResult.errorCount > 0) {
    console.info("\x1b[31m✗ Validation failed.\x1b[0m\n");
    return false;
  }

  if (options.strict && mergedResult.warningCount > 0) {
    console.info(
      "\x1b[31m✗ Validation failed (strict mode - warnings treated as errors).\x1b[0m\n"
    );
    return false;
  }

  console.info("\x1b[32m✓ Validation passed.\x1b[0m\n");
  return true;
}

/**
 * Run validation in watch mode
 */
async function runWatchMode(options: CliOptions): Promise<void> {
  console.info("\n\x1b[1m👁  Watch Mode Active\x1b[0m");
  console.info("Watching for changes in manifests and docs...");
  console.info("Press Ctrl+C to stop.\n");

  // Run initial validation
  await runValidation(options);

  // Debounce timer
  let debounceTimer: NodeJS.Timeout | null = null;
  const DEBOUNCE_MS = 300;

  const handleChange = (_eventType: string, filename: string | null) => {
    if (!filename) return;

    // Only watch relevant files
    const isRelevant =
      filename.endsWith(".json") || filename.endsWith(".mdx") || filename.endsWith(".md");

    if (!isRelevant) return;

    // Debounce rapid changes
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(async () => {
      console.clear();
      console.info(`\n\x1b[33m↻ Change detected: ${filename}\x1b[0m\n`);
      await runValidation(options);
      console.info("\n\x1b[90mWatching for changes...\x1b[0m");
    }, DEBOUNCE_MS);
  };

  // Watch directories
  const watchDirs = [
    join(options.rootDir, "packages/wc/src/components"),
    join(options.rootDir, "packages/docs-content"),
  ];

  const watchers: ReturnType<typeof watch>[] = [];

  for (const dir of watchDirs) {
    try {
      const watcher = watch(dir, { recursive: true }, handleChange);
      watchers.push(watcher);
      console.info(`  Watching: ${dir.replace(`${options.rootDir}/`, "")}`);
    } catch {
      // Directory might not exist, skip
    }
  }

  console.info("\n\x1b[90mWaiting for changes...\x1b[0m");

  // Keep process alive
  process.on("SIGINT", () => {
    console.info("\n\x1b[33mStopping watch mode...\x1b[0m");
    for (const watcher of watchers) {
      watcher.close();
    }
    process.exit(0);
  });
}

async function main(): Promise<void> {
  const options = parseArgs();

  if (options.watch) {
    await runWatchMode(options);
  } else {
    const success = await runValidation(options);
    if (!success) {
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
