#!/usr/bin/env tsx
/**
 * Sync Templates Script
 *
 * Auto-discovers component source files from @hypoth-ui/react and @hypoth-ui/wc
 * packages and copies them to the CLI templates directory for use with the copy command.
 *
 * Components are synced if they exist in EITHER framework source directory AND
 * are registered in the component registry.
 *
 * Usage: pnpm sync:templates
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLI_ROOT = join(__dirname, "..");
const TEMPLATES_DIR = join(CLI_ROOT, "templates");
const REACT_SRC = join(CLI_ROOT, "../react/src/components");
const WC_SRC = join(CLI_ROOT, "../wc/src/components");
const REGISTRY_PATH = join(CLI_ROOT, "registry/components.json");

interface SyncResult {
  component: string;
  files: string[];
  errors: string[];
}

interface RegistryComponent {
  name: string;
  [key: string]: unknown;
}

interface Registry {
  components: RegistryComponent[];
}

/**
 * Discover all component directories from source packages
 */
function discoverComponents(): Set<string> {
  const components = new Set<string>();

  // Scan React source
  if (existsSync(REACT_SRC)) {
    for (const entry of readdirSync(REACT_SRC)) {
      const fullPath = join(REACT_SRC, entry);
      if (statSync(fullPath).isDirectory()) {
        components.add(entry);
      }
    }
  }

  // Scan WC source
  if (existsSync(WC_SRC)) {
    for (const entry of readdirSync(WC_SRC)) {
      const fullPath = join(WC_SRC, entry);
      if (statSync(fullPath).isDirectory()) {
        components.add(entry);
      }
    }
  }

  return components;
}

/**
 * Load registered component names from the registry
 */
function loadRegisteredNames(): Set<string> {
  if (!existsSync(REGISTRY_PATH)) {
    console.warn("Registry not found at", REGISTRY_PATH);
    return new Set();
  }

  const registry: Registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf-8"));
  return new Set(registry.components.map((c) => c.name));
}

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
    // Transform @hypoth-ui/react imports to relative
    result = result.replace(
      /from ["']@hypoth-ui\/react["']/g,
      'from "@/components/ui"'
    );
    result = result.replace(
      /from ["']@hypoth-ui\/wc["']/g,
      'from "@hypoth-ui/wc"'
    );
    // Transform internal imports
    result = result.replace(
      /from ["']\.\.\/primitives\//g,
      'from "@/lib/primitives/'
    );
  } else {
    // Transform @hypoth-ui/wc imports
    result = result.replace(
      /from ["']@hypoth-ui\/wc["']/g,
      'from "@/components/ui"'
    );
  }

  // Transform token imports (keep as @hypoth-ui/tokens — it's an npm package the user installs)
  result = result.replace(
    /from ["']@hypoth-ui\/tokens["']/g,
    'from "@hypoth-ui/tokens"'
  );

  return result;
}

/**
 * Main sync function
 */
async function main(): Promise<void> {
  console.log("\n\x1b[1mSyncing CLI Templates (auto-discovery)\x1b[0m\n");

  // Ensure templates directory exists
  if (!existsSync(TEMPLATES_DIR)) {
    mkdirSync(TEMPLATES_DIR, { recursive: true });
  }

  // Auto-discover components from source directories
  const sourceComponents = discoverComponents();
  const registeredNames = loadRegisteredNames();

  // Only sync components that exist in both source AND registry
  const toSync: string[] = [];
  const skippedNotInRegistry: string[] = [];
  const skippedNoSource: string[] = [];

  for (const name of [...sourceComponents].sort()) {
    if (registeredNames.has(name)) {
      toSync.push(name);
    } else {
      skippedNotInRegistry.push(name);
    }
  }

  for (const name of [...registeredNames].sort()) {
    if (!sourceComponents.has(name)) {
      skippedNoSource.push(name);
    }
  }

  console.log(`Discovered ${sourceComponents.size} source components`);
  console.log(`Registry has ${registeredNames.size} registered components`);
  console.log(`Syncing ${toSync.length} components (in source AND registry)\n`);

  const results: SyncResult[] = [];
  let totalFiles = 0;
  let totalErrors = 0;

  for (const component of toSync) {
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

  if (skippedNotInRegistry.length > 0) {
    console.log(`\n\x1b[33mSkipped (not in registry):\x1b[0m ${skippedNotInRegistry.join(", ")}`);
  }
  if (skippedNoSource.length > 0) {
    console.log(`\x1b[33mSkipped (no source files):\x1b[0m ${skippedNoSource.join(", ")}`);
  }

  console.log("\n\x1b[1mSummary:\x1b[0m");
  console.log(`  Components synced: ${results.length}`);
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
