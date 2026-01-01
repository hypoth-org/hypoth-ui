#!/usr/bin/env tsx
/**
 * Edition Map Builder CLI
 *
 * Generates a static edition map from component manifests.
 *
 * Usage: pnpm build:edition-map [--root-dir <dir>] [--output <path>]
 */

import {
  DEFAULT_EDITION_MAP_PATH,
  generateEditionMap,
} from "../validation/generate-edition-map.js";

interface CliOptions {
  rootDir: string;
  outputPath: string;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    rootDir: process.cwd(),
    outputPath: "",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i] as string;
    const nextArg = args[i + 1];
    if (arg === "--root-dir" && nextArg) {
      options.rootDir = nextArg;
      i++;
    } else if ((arg === "--output" || arg === "-o") && nextArg) {
      options.outputPath = nextArg;
      i++;
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
\x1b[1mUsage:\x1b[0m pnpm build:edition-map [options] [root-dir]

\x1b[1mOptions:\x1b[0m
  --root-dir <dir>     Root directory to search for manifests (default: cwd)
  --output, -o <path>  Output file path (default: ${DEFAULT_EDITION_MAP_PATH})
  --help, -h           Show this help message

\x1b[1mDescription:\x1b[0m
  Generates a static edition map JSON file from all valid component manifests.
  The edition map is used for SSR filtering to determine which components
  are available for each edition tier.

\x1b[1mExamples:\x1b[0m
  pnpm build:edition-map                          # Generate from cwd
  pnpm build:edition-map --root-dir /path/to/repo # Generate from specific directory
  pnpm build:edition-map -o dist/edition-map.json # Custom output path
`);
}

async function main(): Promise<void> {
  const options = parseArgs();

  console.info("\n\x1b[1mGenerating Edition Map\x1b[0m\n");
  console.info(`Root directory: ${options.rootDir}`);

  try {
    const { editionMap, outputPath } = await generateEditionMap({
      rootDir: options.rootDir,
      outputPath: options.outputPath || undefined,
    });

    const componentCount = Object.keys(editionMap.components).length;

    console.info(`\n\x1b[32m✓\x1b[0m Generated edition map with ${componentCount} components`);
    console.info(`  Output: ${outputPath}`);
    console.info(`  Generated at: ${editionMap.generatedAt}`);
    console.info("");

    // Show edition breakdown
    const editionCounts = {
      core: 0,
      pro: 0,
      enterprise: 0,
    };

    for (const component of Object.values(editionMap.components)) {
      for (const edition of component.editions) {
        if (edition in editionCounts) {
          editionCounts[edition as keyof typeof editionCounts]++;
        }
      }
    }

    console.info("\x1b[1mEdition Breakdown:\x1b[0m");
    console.info(`  Core: ${editionCounts.core} components`);
    console.info(`  Pro: ${editionCounts.pro} components`);
    console.info(`  Enterprise: ${editionCounts.enterprise} components`);
    console.info("");
  } catch (error) {
    console.error("\n\x1b[31m✗\x1b[0m Failed to generate edition map");
    console.error(`  ${error instanceof Error ? error.message : "Unknown error"}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
