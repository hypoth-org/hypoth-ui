/**
 * JSON Bundle Emitter
 * Generates resolved token tree in JSON format
 */

import { getCategoryFromPath } from "../../types/categories.js";
import type { ResolvedValue } from "../resolver.js";

/** JSON output structure */
export interface JSONBundleOutput {
  $schema: string;
  version: string;
  generatedAt: string;
  categories: Record<string, CategoryOutput>;
}

/** Category output structure */
export interface CategoryOutput {
  description?: string;
  tokens: TokenOutput[];
}

/** Token output structure */
export interface TokenOutput {
  path: string;
  type: string;
  values: Record<string, Record<string, unknown>>;
  description?: string;
  usedBy?: string[];
  cssVariable: string;
}

/** Bundle generation options */
export interface JSONBundleOptions {
  version?: string;
  includeUsedBy?: boolean;
}

/**
 * Generate JSON bundle from resolved tokens
 */
export function generateJSONBundle(
  resolved: Map<string, ResolvedValue>,
  options: JSONBundleOptions = {}
): JSONBundleOutput {
  const { version = "0.0.0" } = options;

  const categories: Record<string, CategoryOutput> = {};

  // Group tokens by category
  const sortedPaths = [...resolved.keys()].sort();

  for (const path of sortedPaths) {
    const value = resolved.get(path);
    if (!value) continue;
    const category = getCategoryFromPath(path);

    if (!category) continue;

    if (!categories[category]) {
      categories[category] = { tokens: [] };
    }

    const cssVariable = `--${path.replace(/\./g, "-")}`;

    const tokenOutput: TokenOutput = {
      path,
      type: inferType(value.resolvedValue),
      values: {
        default: {
          light: value.resolvedValue,
        },
      },
      cssVariable,
    };

    categories[category].tokens.push(tokenOutput);
  }

  return {
    $schema: "https://hypoth-ui.dev/schemas/token-reference-doc.schema.json",
    version,
    generatedAt: new Date().toISOString(),
    categories,
  };
}

/**
 * Generate JSON bundle with multiple brand/mode combinations
 */
export function generateFullJSONBundle(
  defaultTokens: Map<string, ResolvedValue>,
  modeTokens: Map<string, Map<string, ResolvedValue>>,
  brandTokens: Map<string, Map<string, ResolvedValue>>,
  options: JSONBundleOptions = {}
): JSONBundleOutput {
  const { version = "0.0.0" } = options;

  const categories: Record<string, CategoryOutput> = {};
  const allPaths = new Set<string>();

  // Collect all token paths
  for (const path of defaultTokens.keys()) {
    allPaths.add(path);
  }

  const sortedPaths = [...allPaths].sort();

  for (const path of sortedPaths) {
    const defaultValue = defaultTokens.get(path);
    if (!defaultValue) continue;

    const category = getCategoryFromPath(path);
    if (!category) continue;

    if (!categories[category]) {
      categories[category] = { tokens: [] };
    }

    const cssVariable = `--${path.replace(/\./g, "-")}`;

    // Build values for each brand/mode combination
    const values: Record<string, Record<string, unknown>> = {
      default: {
        light: defaultValue.resolvedValue,
      },
    };

    // Add mode values
    for (const [mode, tokens] of modeTokens) {
      const modeValue = tokens.get(path);
      if (modeValue) {
        if (!values.default) values.default = {};
        values.default[mode] = modeValue.resolvedValue;
      }
    }

    // Add brand values
    for (const [brand, tokens] of brandTokens) {
      const brandValue = tokens.get(path);
      if (brandValue) {
        if (!values[brand]) values[brand] = {};
        values[brand].light = brandValue.resolvedValue;
      }
    }

    const tokenOutput: TokenOutput = {
      path,
      type: inferType(defaultValue.resolvedValue),
      values,
      cssVariable,
    };

    categories[category].tokens.push(tokenOutput);
  }

  return {
    $schema: "https://hypoth-ui.dev/schemas/token-reference-doc.schema.json",
    version,
    generatedAt: new Date().toISOString(),
    categories,
  };
}

/**
 * Infer DTCG type from value
 */
function inferType(value: unknown): string {
  if (typeof value === "string") {
    if (value.startsWith("#") || value.startsWith("rgb") || value.startsWith("hsl")) {
      return "color";
    }
    if (value.match(/^\d+(\.\d+)?(px|rem|em|%|vh|vw)$/)) {
      return "dimension";
    }
    if (value.match(/^\d+(\.\d+)?(ms|s)$/)) {
      return "duration";
    }
    return "string";
  }
  if (typeof value === "number") {
    return "number";
  }
  if (Array.isArray(value)) {
    if (value.length === 4 && value.every((v) => typeof v === "number")) {
      return "cubicBezier";
    }
    if (value.every((v) => typeof v === "string")) {
      return "fontFamily";
    }
    if (value.every((v) => typeof v === "object" && v !== null && "offsetX" in v)) {
      return "shadow";
    }
  }
  if (typeof value === "object" && value !== null) {
    if ("offsetX" in value) return "shadow";
    if ("width" in value && "style" in value) return "border";
    if ("fontFamily" in value && "fontSize" in value) return "typography";
    if ("duration" in value && "timingFunction" in value) return "transition";
  }
  return "unknown";
}

/**
 * Serialize JSON bundle to string with consistent formatting
 */
export function serializeJSONBundle(bundle: JSONBundleOutput): string {
  return JSON.stringify(bundle, null, 2);
}
