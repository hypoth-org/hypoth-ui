/**
 * Edition Config Loader
 *
 * Loads and validates tenant-specific edition configuration files.
 */

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { Edition, EditionConfig } from "../types/manifest.js";
import { getEditionConfigValidator } from "./schema-compiler.js";

/**
 * Default edition configuration
 */
export const DEFAULT_EDITION_CONFIG: EditionConfig = {
  edition: "enterprise",
  features: {
    search: true,
    darkMode: true,
    versionSwitcher: true,
    feedback: true,
  },
};

/**
 * Default file names to search for edition config
 */
export const EDITION_CONFIG_FILE_NAMES = ["edition.config.json", "edition.json", ".editionrc.json"];

/**
 * Options for loading edition config
 */
export interface LoadEditionConfigOptions {
  /** Directory to search for config files */
  configDir?: string;
  /** Specific config file path (overrides search) */
  configPath?: string;
  /** Whether to throw on missing config (default: false, returns default config) */
  required?: boolean;
}

/**
 * Result of loading edition config
 */
export interface LoadEditionConfigResult {
  /** The loaded or default config */
  config: EditionConfig;
  /** Path to the config file (null if using default) */
  configPath: string | null;
  /** Whether the config was loaded from a file */
  fromFile: boolean;
  /** Validation warnings (if any) */
  warnings: string[];
}

/**
 * Load edition configuration from file or return default
 */
export async function loadEditionConfig(
  options: LoadEditionConfigOptions = {}
): Promise<LoadEditionConfigResult> {
  const { configDir = process.cwd(), configPath, required = false } = options;
  const warnings: string[] = [];

  // If specific path provided, try to load it
  if (configPath) {
    if (!existsSync(configPath)) {
      if (required) {
        throw new Error(`Edition config file not found: ${configPath}`);
      }
      return {
        config: DEFAULT_EDITION_CONFIG,
        configPath: null,
        fromFile: false,
        warnings: [`Config file not found: ${configPath}, using defaults`],
      };
    }

    const config = await loadAndValidateConfig(configPath);
    return {
      config,
      configPath,
      fromFile: true,
      warnings,
    };
  }

  // Search for config files in order of preference
  for (const fileName of EDITION_CONFIG_FILE_NAMES) {
    const filePath = join(configDir, fileName);
    if (existsSync(filePath)) {
      const config = await loadAndValidateConfig(filePath);
      return {
        config,
        configPath: filePath,
        fromFile: true,
        warnings,
      };
    }
  }

  // No config file found
  if (required) {
    throw new Error(
      `Edition config file not found in ${configDir}. Expected one of: ${EDITION_CONFIG_FILE_NAMES.join(", ")}`
    );
  }

  return {
    config: DEFAULT_EDITION_CONFIG,
    configPath: null,
    fromFile: false,
    warnings: ["No edition config found, using defaults (enterprise edition)"],
  };
}

/**
 * Load and validate a config file
 */
async function loadAndValidateConfig(filePath: string): Promise<EditionConfig> {
  const content = await readFile(filePath, "utf-8");
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Invalid JSON in edition config: ${filePath}`);
  }

  const validate = getEditionConfigValidator();
  const valid = validate(parsed);

  if (!valid && validate.errors) {
    const errorMessages = validate.errors.map((e) => `${e.instancePath}: ${e.message}`).join("; ");
    throw new Error(`Invalid edition config at ${filePath}: ${errorMessages}`);
  }

  return parsed as EditionConfig;
}

/**
 * Get the current edition from environment or config
 */
export async function getCurrentEdition(options: LoadEditionConfigOptions = {}): Promise<Edition> {
  // Environment variable takes precedence
  const envEdition = process.env.DS_EDITION;
  if (envEdition && isValidEdition(envEdition)) {
    return envEdition as Edition;
  }

  // Fall back to config file
  const { config } = await loadEditionConfig(options);
  return config.edition;
}

/**
 * Check if a string is a valid edition
 */
function isValidEdition(value: string): boolean {
  return ["core", "pro", "enterprise"].includes(value);
}

/**
 * Merge two edition configs, with overrides taking precedence
 */
export function mergeEditionConfigs(
  base: EditionConfig,
  overrides: Partial<EditionConfig>
): EditionConfig {
  return {
    ...base,
    ...overrides,
    branding: {
      ...base.branding,
      ...overrides.branding,
    },
    features: {
      ...base.features,
      ...overrides.features,
    },
  };
}
