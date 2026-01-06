/**
 * Diff command - Check for component updates
 *
 * Usage:
 *   npx @hypoth-ui/cli diff
 *   npx @hypoth-ui/cli diff --json
 */

import pc from "picocolors";
import { readConfig } from "../utils/config.js";
import { fetchRegistry, getComponent } from "../utils/registry.js";
import type { DiffOptions, DSConfig } from "../types/index.js";

interface UpdateInfo {
  name: string;
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
}

/**
 * Execute the diff command
 */
export async function diffCommand(options: DiffOptions = {}): Promise<void> {
  const cwd = process.cwd();

  // Load config (required)
  let config: DSConfig;
  try {
    config = readConfig(cwd);
  } catch (error) {
    console.error(pc.red((error as Error).message));
    process.exit(1);
  }

  if (config.components.length === 0) {
    console.log(pc.yellow("No components installed yet."));
    console.log(pc.dim("Run 'npx @hypoth-ui/cli add <component>' to add components."));
    return;
  }

  // Fetch registry (with fallback to bundled)
  console.log(pc.dim("Checking for updates..."));
  const registry = await fetchRegistry();

  // Compare versions
  const updates: UpdateInfo[] = [];

  for (const installed of config.components) {
    const component = getComponent(registry, installed.name);
    if (!component) {
      updates.push({
        name: installed.name,
        currentVersion: installed.version,
        latestVersion: "unknown",
        hasUpdate: false,
      });
      continue;
    }

    const hasUpdate = compareVersions(installed.version, component.version) < 0;
    updates.push({
      name: installed.name,
      currentVersion: installed.version,
      latestVersion: component.version,
      hasUpdate,
    });
  }

  // JSON output
  if (options.json) {
    console.log(JSON.stringify(updates, null, 2));
    return;
  }

  // Table output
  const updatesAvailable = updates.filter((u) => u.hasUpdate);

  console.log("");

  if (updatesAvailable.length === 0) {
    console.log(pc.green("All components are up to date!"));
    console.log("");
    return;
  }

  console.log(pc.bold(`${updatesAvailable.length} update(s) available`));
  console.log("");

  // Header
  const nameWidth = 20;
  const currentWidth = 15;
  const latestWidth = 15;

  console.log(
    pc.dim(
      `${"Component".padEnd(nameWidth)}${"Current".padEnd(currentWidth)}${"Latest".padEnd(latestWidth)}`
    )
  );
  console.log(pc.dim("─".repeat(nameWidth + currentWidth + latestWidth)));

  // Rows
  for (const update of updates) {
    const name = update.name.padEnd(nameWidth);
    const current = update.currentVersion.padEnd(currentWidth);
    const latest = update.hasUpdate
      ? pc.green(update.latestVersion.padEnd(latestWidth))
      : update.latestVersion.padEnd(latestWidth);

    const indicator = update.hasUpdate ? pc.yellow("↑ ") : "  ";

    console.log(`${indicator}${name}${current}${latest}`);
  }

  console.log("");
  console.log(pc.dim("To update, run: npx @hypoth-ui/cli add <component> --overwrite"));
  console.log("");
}

/**
 * Compare semantic versions
 * Returns: -1 if a < b, 0 if a === b, 1 if a > b
 */
function compareVersions(a: string, b: string): number {
  const partsA = a.replace(/^v/, "").split(".").map(Number);
  const partsB = b.replace(/^v/, "").split(".").map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const numA = partsA[i] ?? 0;
    const numB = partsB[i] ?? 0;

    if (numA < numB) return -1;
    if (numA > numB) return 1;
  }

  return 0;
}
