#!/usr/bin/env tsx
/**
 * Manifest Validation CLI
 *
 * Validates all component manifests against the JSON schema.
 *
 * Usage: pnpm validate:manifests [manifests-dir]
 */

import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { validateManifest } from "../manifest/validator.js";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const manifestsDir =
    args[0] ||
    join(dirname(new URL(import.meta.url).pathname), "../../../../packages/docs-content/manifests");

  console.info(`\nValidating manifests in: ${manifestsDir}\n`);

  let files: string[];
  try {
    files = await readdir(manifestsDir);
  } catch (err) {
    console.error(`Error reading directory: ${err}`);
    process.exit(1);
  }

  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  if (jsonFiles.length === 0) {
    console.info("No manifest files found.");
    process.exit(0);
  }

  let hasErrors = false;
  let validCount = 0;
  let invalidCount = 0;

  for (const file of jsonFiles) {
    const filePath = join(manifestsDir, file);

    try {
      const content = await readFile(filePath, "utf-8");
      const manifest = JSON.parse(content);
      const result = validateManifest(manifest);

      if (result.valid) {
        console.info(`  ✓ ${file}`);
        validCount++;
      } else {
        console.info(`  ✗ ${file}`);
        for (const error of result.errors) {
          console.info(`      ${error}`);
        }
        invalidCount++;
        hasErrors = true;
      }
    } catch (err) {
      console.info(`  ✗ ${file}`);
      console.info(`      Parse error: ${err}`);
      invalidCount++;
      hasErrors = true;
    }
  }

  console.info(`\nResults: ${validCount} valid, ${invalidCount} invalid\n`);

  if (hasErrors) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
