#!/usr/bin/env tsx
/**
 * Search Index Builder CLI
 *
 * Generates a search index from content packs at build time.
 *
 * Usage: pnpm build:search-index [--output <path>] [--edition <edition>]
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { initContentPacks } from "../content/overlay.js";
import { generateSearchIndex, serializeSearchIndex } from "../search/indexer.js";
import type { ContentPack, Edition } from "../types/manifest.js";
import { loadValidManifests } from "../validation/validate-manifests.js";

interface CliOptions {
  outputPath: string;
  edition: Edition;
  basePackRoot: string;
  baseUrl: string;
  minimal: boolean;
}

const DEFAULT_OUTPUT_PATH = "dist/search-index.json";

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    outputPath: DEFAULT_OUTPUT_PATH,
    edition: "enterprise",
    basePackRoot: process.cwd(),
    baseUrl: "",
    minimal: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i] as string;
    const nextArg = args[i + 1];
    if ((arg === "--output" || arg === "-o") && nextArg) {
      options.outputPath = nextArg;
      i++;
    } else if (arg === "--edition" && nextArg) {
      if (nextArg === "core" || nextArg === "pro" || nextArg === "enterprise") {
        options.edition = nextArg;
      } else {
        console.error(`Invalid edition: ${nextArg}. Must be core, pro, or enterprise.`);
        process.exit(1);
      }
      i++;
    } else if (arg === "--base-pack-root" && nextArg) {
      options.basePackRoot = nextArg;
      i++;
    } else if (arg === "--base-url" && nextArg) {
      options.baseUrl = nextArg;
      i++;
    } else if (arg === "--minimal") {
      options.minimal = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp(): void {
  console.info(`
\x1b[1mUsage:\x1b[0m pnpm build:search-index [options]

\x1b[1mOptions:\x1b[0m
  --output, -o <path>       Output file path (default: ${DEFAULT_OUTPUT_PATH})
  --edition <edition>       Edition filter: core, pro, enterprise (default: enterprise)
  --base-pack-root <dir>    Root directory for base content pack (default: cwd)
  --base-url <url>          Base URL for search result links (default: empty)
  --minimal                 Generate minimal index without full content (smaller file)
  --help, -h                Show this help message

\x1b[1mDescription:\x1b[0m
  Generates a search index JSON file from content packs.
  The index includes component docs and guides, filtered by edition.
  Can be used for client-side search or backend search APIs.

\x1b[1mExamples:\x1b[0m
  pnpm build:search-index                              # Generate full index
  pnpm build:search-index --edition pro                # Only index pro-tier content
  pnpm build:search-index --minimal -o dist/search.json # Minimal index, custom output
`);
}

async function main(): Promise<void> {
  const options = parseArgs();

  console.info("\n\x1b[1mGenerating Search Index\x1b[0m\n");
  console.info(`Edition: ${options.edition}`);
  console.info(`Base pack root: ${options.basePackRoot}`);
  if (options.baseUrl) {
    console.info(`Base URL: ${options.baseUrl}`);
  }
  console.info(`Minimal mode: ${options.minimal ? "yes" : "no"}`);

  try {
    // Initialize content packs
    const packs: ContentPack[] = await initContentPacks({
      basePackRoot: options.basePackRoot,
      overlayPacks: [],
    });

    console.info(`\nFound ${packs.length} content pack(s)`);

    // Load manifests for enriching entries
    const { manifests } = await loadValidManifests({
      rootDir: join(options.basePackRoot, "components"),
    });

    console.info(`Found ${manifests.length} component manifest(s)`);

    // Generate the search index
    let index = await generateSearchIndex({
      packs,
      edition: options.edition,
      baseUrl: options.baseUrl,
      includeComponents: true,
      includeGuides: true,
      manifests,
    });

    // Apply minimal transformation if requested
    if (options.minimal) {
      index = {
        ...index,
        entries: index.entries.map((entry) => ({
          ...entry,
          excerpt: "", // Remove full excerpt for smaller bundle
        })),
      };
    }

    // Ensure output directory exists
    const outputDir = dirname(options.outputPath);
    await mkdir(outputDir, { recursive: true });

    // Write the index
    const serialized = serializeSearchIndex(index);
    await writeFile(options.outputPath, serialized, "utf-8");

    // Report results
    const componentCount = index.entries.filter((e) => e.type === "component").length;
    const guideCount = index.entries.filter((e) => e.type === "guide").length;
    const totalTags = index.entries.reduce((sum, e) => sum + (e.tags?.length ?? 0), 0);

    console.info("\n\x1b[32m✓\x1b[0m Generated search index");
    console.info(`  Output: ${options.outputPath}`);
    console.info(`  Generated at: ${index.generatedAt}`);
    console.info("");

    console.info("\x1b[1mIndex Statistics:\x1b[0m");
    console.info(`  Components: ${componentCount}`);
    console.info(`  Guides: ${guideCount}`);
    console.info(`  Total entries: ${index.entries.length}`);
    console.info(`  Total tags: ${totalTags}`);
    console.info(`  File size: ${(Buffer.byteLength(serialized) / 1024).toFixed(1)} KB`);
    console.info("");
  } catch (error) {
    console.error("\n\x1b[31m✗\x1b[0m Failed to generate search index");
    console.error(`  ${error instanceof Error ? error.message : "Unknown error"}`);
    if (error instanceof Error && error.stack) {
      console.error(`  ${error.stack.split("\n").slice(1, 3).join("\n  ")}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
