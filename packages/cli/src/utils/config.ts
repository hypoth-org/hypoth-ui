/**
 * Configuration management utilities for ds.config.json
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { DSConfig, InstalledComponent } from "../types/index.js";

const CONFIG_FILE_NAME = "ds.config.json";
const CONFIG_SCHEMA_URL = "https://hypoth-ui.dev/schema/ds.config.json";

/**
 * Check if ds.config.json exists in the directory
 */
export function configExists(cwd: string = process.cwd()): boolean {
  return existsSync(join(cwd, CONFIG_FILE_NAME));
}

/**
 * Get the path to ds.config.json
 */
export function getConfigPath(cwd: string = process.cwd()): string {
  return join(cwd, CONFIG_FILE_NAME);
}

/**
 * Read and parse ds.config.json
 * @throws Error if file doesn't exist or is invalid JSON
 */
export function readConfig(cwd: string = process.cwd()): DSConfig {
  const configPath = getConfigPath(cwd);

  if (!existsSync(configPath)) {
    throw new Error(`Configuration file not found. Run 'hypoth-ui init' first.`);
  }

  try {
    const content = readFileSync(configPath, "utf-8");
    const config = JSON.parse(content) as DSConfig;
    return validateConfig(config);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${CONFIG_FILE_NAME}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Write configuration to ds.config.json
 */
export function writeConfig(config: DSConfig, cwd: string = process.cwd()): void {
  const configPath = getConfigPath(cwd);
  const content = JSON.stringify(config, null, 2);
  writeFileSync(configPath, `${content}\n`, "utf-8");
}

/**
 * Create a new configuration with defaults
 */
export function createConfig(options: Partial<DSConfig>): DSConfig {
  const config: DSConfig = {
    $schema: CONFIG_SCHEMA_URL,
    style: options.style ?? "package",
    framework: options.framework ?? "react",
    typescript: options.typescript ?? true,
    packageManager: options.packageManager ?? "npm",
    paths: options.paths ?? {
      components: "src/components/ui",
      utils: "src/lib",
    },
    aliases: options.aliases ?? {
      components: "@/components/ui",
      lib: "@/lib",
    },
    components: options.components ?? [],
  };

  return config;
}

/**
 * Validate configuration structure
 * @throws Error if config is invalid
 */
export function validateConfig(config: unknown): DSConfig {
  if (!config || typeof config !== "object") {
    throw new Error("Invalid configuration: expected object");
  }

  const cfg = config as Record<string, unknown>;

  // Required fields
  if (!["copy", "package"].includes(cfg.style as string)) {
    throw new Error('Invalid configuration: style must be "copy" or "package"');
  }

  if (!["react", "next", "wc", "vanilla"].includes(cfg.framework as string)) {
    throw new Error('Invalid configuration: framework must be "react", "next", "wc", or "vanilla"');
  }

  if (typeof cfg.typescript !== "boolean") {
    throw new Error("Invalid configuration: typescript must be a boolean");
  }

  if (!["npm", "pnpm", "yarn", "bun"].includes(cfg.packageManager as string)) {
    throw new Error(
      'Invalid configuration: packageManager must be "npm", "pnpm", "yarn", or "bun"'
    );
  }

  // Paths validation
  if (!cfg.paths || typeof cfg.paths !== "object") {
    throw new Error("Invalid configuration: paths must be an object");
  }

  const paths = cfg.paths as Record<string, unknown>;
  if (typeof paths.components !== "string" || typeof paths.utils !== "string") {
    throw new Error("Invalid configuration: paths.components and paths.utils must be strings");
  }

  // Aliases validation
  if (!cfg.aliases || typeof cfg.aliases !== "object") {
    throw new Error("Invalid configuration: aliases must be an object");
  }

  const aliases = cfg.aliases as Record<string, unknown>;
  if (typeof aliases.components !== "string" || typeof aliases.lib !== "string") {
    throw new Error("Invalid configuration: aliases.components and aliases.lib must be strings");
  }

  // Components array validation
  if (!Array.isArray(cfg.components)) {
    throw new Error("Invalid configuration: components must be an array");
  }

  return config as DSConfig;
}

/**
 * Add an installed component to the config
 */
export function addInstalledComponent(
  config: DSConfig,
  component: Omit<InstalledComponent, "installedAt">
): DSConfig {
  const now = new Date().toISOString();

  // Remove existing if present (for --overwrite)
  const filtered = config.components.filter((c) => c.name !== component.name);

  return {
    ...config,
    components: [
      ...filtered,
      {
        ...component,
        installedAt: now,
      },
    ],
  };
}

/**
 * Check if a component is already installed
 */
export function isComponentInstalled(config: DSConfig, name: string): boolean {
  return config.components.some((c) => c.name === name);
}

/**
 * Get installed component by name
 */
export function getInstalledComponent(
  config: DSConfig,
  name: string
): InstalledComponent | undefined {
  return config.components.find((c) => c.name === name);
}
