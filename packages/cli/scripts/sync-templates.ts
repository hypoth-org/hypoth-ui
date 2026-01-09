#!/usr/bin/env tsx
/**
 * Sync Templates Script
 *
 * Copies component source files from @ds/react and @ds/wc packages
 * to the CLI templates directory for use with the copy command.
 *
 * Usage: pnpm sync:templates
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CLI_ROOT = join(import.meta.dirname, "..");
const TEMPLATES_DIR = join(CLI_ROOT, "templates");
const REACT_SRC = join(CLI_ROOT, "../../react/src/components");
const WC_SRC = join(CLI_ROOT, "../../wc/src/components");

interface SyncResult {
  component: string;
  files: string[];
  errors: string[];
}

/**
 * Components to sync (subset of registry for copy mode)
 */
const COMPONENTS_TO_SYNC = [
  "button",
  "input",
  "textarea",
  "checkbox",
  "dialog",
  "menu",
  "popover",
  "tooltip",
  "select",
  "field",
  "icon",
  "link",
  "spinner",
  "text",
];

/**
 * Sync a single component
 */
function syncComponent(componentName: string): SyncResult {
  const result: SyncResult = {
    component: componentName,
    files: [],
    errors: [],
  };

  const templateDir = join(TEMPLATES_DIR, componentName);

  // Ensure template directory exists
  if (!existsSync(templateDir)) {
    mkdirSync(templateDir, { recursive: true });
  }

  // Sync React files
  const reactDir = join(REACT_SRC, componentName);
  if (existsSync(reactDir)) {
    try {
      const files = readdirSync(reactDir).filter(
        (f) => f.endsWith(".tsx") || f.endsWith(".ts")
      );
      for (const file of files) {
        const src = join(reactDir, file);
        const dest = join(templateDir, file);
        const content = readFileSync(src, "utf-8");
        // Transform imports for copy mode
        const transformed = transformForCopyMode(content, "react");
        writeFileSync(dest, transformed, "utf-8");
        result.files.push(`react: ${file}`);
      }
    } catch (error) {
      result.errors.push(`React: ${(error as Error).message}`);
    }
  }

  // Sync WC files (into subdirectory to avoid conflicts)
  const wcDir = join(WC_SRC, componentName);
  if (existsSync(wcDir)) {
    try {
      const files = readdirSync(wcDir).filter(
        (f) => f.endsWith(".ts") && !f.endsWith(".test.ts")
      );
      for (const file of files) {
        const src = join(wcDir, file);
        // Put WC files in wc/ subdirectory
        const wcTemplateDir = join(templateDir, "wc");
        if (!existsSync(wcTemplateDir)) {
          mkdirSync(wcTemplateDir, { recursive: true });
        }
        const dest = join(wcTemplateDir, file);
        const content = readFileSync(src, "utf-8");
        const transformed = transformForCopyMode(content, "wc");
        writeFileSync(dest, transformed, "utf-8");
        result.files.push(`wc: ${file}`);
      }
    } catch (error) {
      result.errors.push(`WC: ${(error as Error).message}`);
    }
  }

  return result;
}

/**
 * Transform imports for copy mode
 * Replaces internal package imports with relative imports
 */
function transformForCopyMode(content: string, framework: "react" | "wc"): string {
  let result = content;

  if (framework === "react") {
    // Transform @ds/react imports to relative
    result = result.replace(
      /from ["']@ds\/react["']/g,
      'from "@/components/ui"'
    );
    result = result.replace(
      /from ["']@ds\/wc["']/g,
      'from "@hypoth-ui/wc"'
    );
    // Transform internal imports
    result = result.replace(
      /from ["']\.\.\/primitives\//g,
      'from "@/lib/primitives/'
    );
  } else {
    // Transform @ds/wc imports
    result = result.replace(
      /from ["']@ds\/wc["']/g,
      'from "@/components/ui"'
    );
  }

  // Transform token imports
  result = result.replace(
    /from ["']@ds\/tokens["']/g,
    'from "@hypoth-ui/tokens"'
  );

  return result;
}

/**
 * Main sync function
 */
async function main(): Promise<void> {
  console.log("\n\x1b[1mSyncing CLI Templates\x1b[0m\n");

  // Ensure templates directory exists
  if (!existsSync(TEMPLATES_DIR)) {
    mkdirSync(TEMPLATES_DIR, { recursive: true });
  }

  const results: SyncResult[] = [];
  let totalFiles = 0;
  let totalErrors = 0;

  for (const component of COMPONENTS_TO_SYNC) {
    const result = syncComponent(component);
    results.push(result);
    totalFiles += result.files.length;
    totalErrors += result.errors.length;

    if (result.files.length > 0) {
      console.log(`\x1b[32m✓\x1b[0m ${component}: ${result.files.length} files`);
    }
    if (result.errors.length > 0) {
      console.log(`\x1b[31m✗\x1b[0m ${component}: ${result.errors.join(", ")}`);
    }
  }

  console.log("\n\x1b[1mSummary:\x1b[0m");
  console.log(`  Components: ${results.length}`);
  console.log(`  Files synced: ${totalFiles}`);
  if (totalErrors > 0) {
    console.log(`  Errors: ${totalErrors}`);
  }
  console.log("");
}

main().catch((error) => {
  console.error("Sync failed:", error);
  process.exit(1);
});
