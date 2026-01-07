/**
 * List command - List available components
 *
 * Usage:
 *   npx @hypoth-ui/cli list
 *   npx @hypoth-ui/cli list --json
 */

import pc from "picocolors";
import type { DSConfig, ListOptions } from "../types/index.js";
import { configExists, readConfig } from "../utils/config.js";
import { getComponentsForFramework, loadBundledRegistry } from "../utils/registry.js";

/**
 * Execute the list command
 */
export async function listCommand(options: ListOptions = {}): Promise<void> {
  const cwd = process.cwd();

  // Load registry (works without config)
  const registry = loadBundledRegistry();

  // Load config if exists (to show installed status)
  let config: DSConfig | undefined;
  if (configExists(cwd)) {
    try {
      config = readConfig(cwd);
    } catch {
      // Ignore config errors for list command
    }
  }

  // Get components (filter by framework if config exists)
  const components = config
    ? getComponentsForFramework(registry, config.framework)
    : registry.components;

  // JSON output
  if (options.json) {
    const output = components.map((c) => ({
      name: c.name,
      displayName: c.displayName,
      description: c.description,
      version: c.version,
      status: c.status,
      frameworks: c.frameworks,
      installed: config?.components.some((ic) => ic.name === c.name) ?? false,
    }));
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  // Table output
  console.log("");
  console.log(pc.bold("Available Components"));
  console.log("");

  if (config) {
    console.log(pc.dim(`Framework: ${config.framework} | Mode: ${config.style}`));
    console.log("");
  }

  // Header
  const nameWidth = 20;
  const statusWidth = 10;
  const versionWidth = 10;
  const descWidth = 45;

  console.log(
    pc.dim(
      `${"Name".padEnd(nameWidth)}${"Status".padEnd(statusWidth)}${"Version".padEnd(versionWidth)}Description`
    )
  );
  console.log(pc.dim("─".repeat(nameWidth + statusWidth + versionWidth + descWidth)));

  // Rows
  for (const component of components) {
    const isInstalled = config?.components.some((ic) => ic.name === component.name);
    const installedMark = isInstalled ? pc.green("✓ ") : "  ";

    const name = (installedMark + component.name).padEnd(nameWidth + 2).slice(0, nameWidth + 2);
    const status = formatStatus(component.status).padEnd(statusWidth);
    const version = component.version.padEnd(versionWidth);
    const desc =
      component.description.length > descWidth
        ? `${component.description.slice(0, descWidth - 3)}...`
        : component.description;

    console.log(`${name}${status}${version}${pc.dim(desc)}`);
  }

  console.log("");
  console.log(pc.dim(`Total: ${components.length} components`));

  if (config) {
    const installedCount = config.components.length;
    if (installedCount > 0) {
      console.log(pc.dim(`Installed: ${installedCount} (${pc.green("✓")} marked)`));
    }
  } else {
    console.log(pc.dim("Run 'npx @hypoth-ui/cli init' to initialize your project"));
  }

  console.log("");
}

/**
 * Format status with color
 */
function formatStatus(status: "alpha" | "beta" | "stable"): string {
  switch (status) {
    case "stable":
      return pc.green(status);
    case "beta":
      return pc.yellow(status);
    case "alpha":
      return pc.red(status);
    default:
      return status;
  }
}
