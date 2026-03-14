/**
 * Token Build Orchestration
 * Loads all token sets, compiles outputs, and writes to dist/
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  type CSSOutput,
  combineCSS,
  generateBrandCSS,
  generateCSS,
  generateModeCSS,
} from "../compiler/emitters/css.js";
import { generateJSONBundle, serializeJSONBundle } from "../compiler/emitters/json.js";
import { generateRuntimeTypes, generateTypeScript } from "../compiler/emitters/typescript.js";
import { type ParsedToken, parseTokenSet } from "../compiler/parser.js";
import { buildTokenSources, resolveTokens } from "../compiler/resolver.js";
import { validateTokens } from "../compiler/validator.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = join(__dirname, "../tokens");
const COLORS_DIR = join(__dirname, "../colors");
const DENSITY_DIR = join(__dirname, "../density");
const TYPE_TOKENS_DIR = join(TOKENS_DIR, "type");
const COMPONENT_TOKENS_DIR = join(TOKENS_DIR, "component");
const DIST_DIR = join(__dirname, "../../dist");

interface BuildResult {
  success: boolean;
  tokenCount: number;
  warnings: string[];
  errors: string[];
}

/**
 * Load all JSON files from a directory
 */
function loadTokensFromDir(dir: string): ParsedToken[] {
  if (!existsSync(dir)) return [];

  const tokens: ParsedToken[] = [];
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const content = readFileSync(join(dir, file), "utf-8");
    const tokenSet = JSON.parse(content);
    const result = parseTokenSet(tokenSet);
    tokens.push(...result.tokens);
  }

  return tokens;
}

/**
 * Load brand tokens from brands directory
 */
function loadBrandTokens(): Map<string, ParsedToken[]> {
  const brandsDir = join(TOKENS_DIR, "brands");
  if (!existsSync(brandsDir)) return new Map();

  const brands = new Map<string, ParsedToken[]>();
  const brandDirs = readdirSync(brandsDir);

  for (const brandDir of brandDirs) {
    const brandPath = join(brandsDir, brandDir);
    const tokensFile = join(brandPath, "tokens.json");
    if (existsSync(tokensFile)) {
      const content = readFileSync(tokensFile, "utf-8");
      const tokenSet = JSON.parse(content);
      const result = parseTokenSet(tokenSet);
      brands.set(brandDir, result.tokens);
    }
  }

  return brands;
}

/**
 * Load mode tokens from modes directory
 */
function loadModeTokens(): Map<string, ParsedToken[]> {
  const modesDir = join(TOKENS_DIR, "modes");
  if (!existsSync(modesDir)) return new Map();

  const modes = new Map<string, ParsedToken[]>();
  const files = readdirSync(modesDir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const modeName = basename(file, ".json");
    const content = readFileSync(join(modesDir, file), "utf-8");
    const tokenSet = JSON.parse(content);
    const result = parseTokenSet(tokenSet);
    modes.set(modeName, result.tokens);
  }

  return modes;
}

/**
 * Load 16-step color tokens from colors directory
 */
function loadColorTokens(): { primitives: ParsedToken[]; semantic: ParsedToken[]; dark: ParsedToken[] } {
  const result = { primitives: [] as ParsedToken[], semantic: [] as ParsedToken[], dark: [] as ParsedToken[] };

  // Load primitive colors
  const primitivesDir = join(COLORS_DIR, "primitives");
  if (existsSync(primitivesDir)) {
    const files = readdirSync(primitivesDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const content = readFileSync(join(primitivesDir, file), "utf-8");
      const tokenSet = JSON.parse(content);
      const parsed = parseTokenSet(tokenSet);
      result.primitives.push(...parsed.tokens);
    }
  }

  // Load semantic colors
  const semanticFile = join(COLORS_DIR, "semantic.json");
  if (existsSync(semanticFile)) {
    const content = readFileSync(semanticFile, "utf-8");
    const tokenSet = JSON.parse(content);
    const parsed = parseTokenSet(tokenSet);
    result.semantic.push(...parsed.tokens);
  }

  // Load dark mode colors
  const darkFile = join(COLORS_DIR, "dark.json");
  if (existsSync(darkFile)) {
    const content = readFileSync(darkFile, "utf-8");
    const tokenSet = JSON.parse(content);
    const parsed = parseTokenSet(tokenSet);
    result.dark.push(...parsed.tokens);
  }

  return result;
}

/**
 * Load density tokens from density directory
 */
function loadDensityTokens(): Map<string, ParsedToken[]> {
  const modes = new Map<string, ParsedToken[]>();
  if (!existsSync(DENSITY_DIR)) return modes;

  const files = readdirSync(DENSITY_DIR).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const modeName = basename(file, ".json");
    const content = readFileSync(join(DENSITY_DIR, file), "utf-8");
    const tokenSet = JSON.parse(content);
    const result = parseTokenSet(tokenSet);
    modes.set(modeName, result.tokens);
  }

  return modes;
}

/**
 * Generate CSS for 16-step color tokens
 */
/**
 * Non-color semantic bridge tokens that map --ds- prefixed names
 * to values from the global token namespace.
 * These are needed because type/component tokens reference --ds-* vars.
 */
const BRIDGE_TOKENS: Record<string, string> = {
  "--ds-font-family-sans": "var(--font-geist-sans, 'Geist'), system-ui, -apple-system, sans-serif",
  "--ds-font-family-mono": "var(--font-geist-mono, 'Geist Mono'), ui-monospace, monospace",
  "--ds-font-family-serif": "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
  "--ds-radius-sm": "0.125rem",
  "--ds-radius-md": "0.375rem",
  "--ds-radius-lg": "0.5rem",
  "--ds-radius-xl": "0.75rem",
  "--ds-radius-full": "9999px",
  "--ds-font-weight-medium": "500",
  "--ds-font-weight-semibold": "600",
  "--ds-font-weight-bold": "700",
  "--ds-font-size-xs": "0.75rem",
  "--ds-font-size-sm": "0.875rem",
  "--ds-font-size-base": "1rem",
  "--ds-font-size-lg": "1.125rem",
  "--ds-font-size-xl": "1.25rem",
  "--ds-shadow-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  "--ds-shadow-md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  "--ds-shadow-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  "--ds-shadow-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  "--ds-spacing-1": "0.25rem",
  "--ds-spacing-2": "0.5rem",
  "--ds-spacing-3": "0.75rem",
  "--ds-spacing-4": "1rem",
};

function generateColorCSS(primitives: ParsedToken[], semantic: ParsedToken[], dark: ParsedToken[]): string {
  const lines: string[] = [];

  lines.push("/**");
  lines.push(" * 16-Step Color System");
  lines.push(" * Generated from DTCG tokens");
  lines.push(" */");
  lines.push("");
  lines.push("@layer tokens.colors {");

  // Generate primitive colors
  lines.push("  :root {");
  lines.push("    /* Primitive Color Scales */");
  for (const token of primitives) {
    const cssVar = `--ds-color-${token.path.replace(/\./g, "-")}`;
    lines.push(`    ${cssVar}: ${token.value};`);
  }
  lines.push("");
  lines.push("    /* Semantic Color Aliases */");
  for (const token of semantic) {
    const cssVar = `--ds-color-${token.path.replace(/\./g, "-")}`;
    // Handle references - convert {blue.1} to var(--ds-color-blue-1)
    let value = String(token.value);
    if (value.startsWith("{") && value.endsWith("}")) {
      const ref = value.slice(1, -1).replace(/\./g, "-");
      value = `var(--ds-color-${ref})`;
    }
    lines.push(`    ${cssVar}: ${value};`);
  }
  lines.push("  }");
  lines.push("");

  // Generate dark mode overrides
  lines.push("  /* Dark Mode Color Inversions */");
  lines.push('  [data-color-mode="dark"], [data-theme="dark"] {');
  for (const token of dark) {
    const cssVar = `--ds-color-${token.path.replace(/\./g, "-")}`;
    let value = String(token.value);
    if (value.startsWith("{") && value.endsWith("}")) {
      const ref = value.slice(1, -1).replace(/\./g, "-");
      value = `var(--ds-color-${ref})`;
    }
    lines.push(`    ${cssVar}: ${value};`);
  }
  lines.push("  }");
  lines.push("");

  // Add system preference media query
  lines.push("  @media (prefers-color-scheme: dark) {");
  lines.push('    :root:not([data-color-mode="light"]):not([data-theme="light"]) {');
  for (const token of dark) {
    const cssVar = `--ds-color-${token.path.replace(/\./g, "-")}`;
    let value = String(token.value);
    if (value.startsWith("{") && value.endsWith("}")) {
      const ref = value.slice(1, -1).replace(/\./g, "-");
      value = `var(--ds-color-${ref})`;
    }
    lines.push(`      ${cssVar}: ${value};`);
  }
  lines.push("    }");
  lines.push("  }");

  // Non-color semantic bridge tokens
  lines.push("");
  lines.push("  /* Non-Color Semantic Bridge Tokens */");
  lines.push("  :root {");
  for (const [varName, value] of Object.entries(BRIDGE_TOKENS)) {
    lines.push(`    ${varName}: ${value};`);
  }
  lines.push("  }");
  lines.push("}");

  return lines.join("\n");
}

/**
 * Generate TypeScript types for 16-step color scales
 */
function generateColorTypes(): string {
  const lines: string[] = [];

  lines.push("/**");
  lines.push(" * 16-Step Color Scale Types");
  lines.push(" * Auto-generated from DTCG tokens");
  lines.push(" */");
  lines.push("");

  // Color step type
  lines.push("/** Color step number (1 = lightest, 16 = darkest) */");
  lines.push("export type ColorStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;");
  lines.push("");

  // Primitive color names
  lines.push("/** Primitive color palette names */");
  lines.push('export type PrimitiveColorName = "gray" | "blue" | "green" | "red" | "yellow" | "purple" | "orange" | "cyan" | "pink";');
  lines.push("");

  // Semantic color names
  lines.push("/** Semantic color names */");
  lines.push('export type SemanticColorName = "primary" | "secondary" | "success" | "warning" | "error" | "neutral";');
  lines.push("");

  // Semantic aliases
  lines.push("/** Semantic color aliases */");
  lines.push('export type SemanticColorAlias = "default" | "hover" | "active" | "foreground" | "subtle" | "muted";');
  lines.push("");

  // Color value type for style props
  lines.push("/** Color value type for referencing tokens */");
  lines.push("export type ColorValue =");
  lines.push("  | `${PrimitiveColorName}.${ColorStep}`");
  lines.push("  | `${SemanticColorName}.${ColorStep}`");
  lines.push("  | `${SemanticColorName}.${SemanticColorAlias}`");
  lines.push('  | "transparent"');
  lines.push('  | "currentColor"');
  lines.push('  | "inherit";');
  lines.push("");

  // CSS variable helper type
  lines.push("/** CSS variable name for a color token */");
  lines.push("export type ColorCSSVar =");
  lines.push("  | `--ds-color-${PrimitiveColorName}-${ColorStep}`");
  lines.push("  | `--ds-color-${SemanticColorName}-${ColorStep}`");
  lines.push("  | `--ds-color-${SemanticColorName}-${SemanticColorAlias}`;");
  lines.push("");

  // Step category constants
  lines.push("/** Color step categories */");
  lines.push("export const ColorStepCategories = {");
  lines.push("  backgrounds: [1, 2, 3, 4] as const,");
  lines.push("  interactive: [5, 6, 7] as const,");
  lines.push("  borders: [8, 9, 10] as const,");
  lines.push("  solids: [11, 12, 13, 14] as const,");
  lines.push("  text: [15, 16] as const,");
  lines.push("} as const;");
  lines.push("");

  // Helper function types
  lines.push("/** Get CSS variable for a color */");
  lines.push("export function getColorVar(color: PrimitiveColorName | SemanticColorName, step: ColorStep | SemanticColorAlias): string {");
  lines.push("  return `var(--ds-color-${color}-${step})`;");
  lines.push("}");

  return lines.join("\n");
}

/**
 * Generate CSS for density tokens
 */
function generateDensityCSS(densityModes: Map<string, ParsedToken[]>): string {
  const lines: string[] = [];

  lines.push("/**");
  lines.push(" * Density System");
  lines.push(" * Compact, Default, and Spacious modes");
  lines.push(" */");
  lines.push("");
  lines.push("@layer tokens.density {");

  // Generate each density mode
  for (const [mode, tokens] of densityModes) {
    if (mode === "default") {
      // Default mode goes on :root
      lines.push("  /* Default Density */");
      lines.push("  :root {");
    } else {
      lines.push(`  /* ${mode.charAt(0).toUpperCase() + mode.slice(1)} Density */`);
      lines.push(`  [data-density="${mode}"] {`);
    }

    for (const token of tokens) {
      const cssVar = `--ds-${token.path.replace(/\./g, "-")}`;
      lines.push(`    ${cssVar}: ${token.value};`);
    }
    lines.push("  }");
    lines.push("");
  }

  lines.push("}");

  return lines.join("\n");
}

/**
 * Convert a DTCG {reference} value to a CSS var() expression.
 * If the value is not a reference, return it as-is.
 */
function referenceToVar(value: string): string {
  if (value.startsWith("{") && value.endsWith("}")) {
    const ref = value.slice(1, -1).replace(/\./g, "-");
    return `var(--ds-${ref})`;
  }
  return value;
}

/**
 * Generate CSS for tiered tokens (type or component).
 * Unlike global tokens which are fully resolved, these preserve {reference}
 * values as var() calls to maintain the CSS cascade chain.
 */
function generateTierCSS(tokens: ParsedToken[], tierName: string): string {
  if (tokens.length === 0) return "";

  const lines: string[] = [];

  lines.push("/**");
  lines.push(` * ${tierName} Tokens`);
  lines.push(" * Generated from DTCG tokens — references preserved as var()");
  lines.push(" */");
  lines.push("");
  lines.push("@layer tokens {");
  lines.push("  :root {");

  const sorted = [...tokens].sort((a, b) => a.path.localeCompare(b.path));
  for (const token of sorted) {
    const cssVar = `--ds-${token.path.replace(/\./g, "-")}`;
    const cssValue = referenceToVar(String(token.value));
    if (token.description) {
      lines.push(`    /* ${token.description} */`);
    }
    lines.push(`    ${cssVar}: ${cssValue};`);
  }

  lines.push("  }");
  lines.push("}");

  return lines.join("\n");
}

/**
 * Generate TypeScript union types for tiered token paths
 */
function generateTierTypes(tokens: ParsedToken[], typeName: string): string {
  if (tokens.length === 0) return "";

  const sorted = [...tokens].sort((a, b) => a.path.localeCompare(b.path));
  const paths = sorted.map((t) => `  | '${t.path}'`).join("\n");

  const lines: string[] = [];
  lines.push(`/** ${typeName} token paths */`);
  lines.push(`export type ${typeName} =`);
  lines.push(paths);
  lines.push(";");
  lines.push("");
  return lines.join("\n");
}

/**
 * Generate CSS for density mode tokens that override type-tier tokens.
 * Uses --ds- prefix to match the type-tier CSS variables, and
 * [data-density="..."] selectors for activation.
 */
function generateDensityModeCSS(tokens: ParsedToken[], densityName: string): string {
  if (tokens.length === 0) return "";

  const lines: string[] = [];

  lines.push("@layer tokens {");
  lines.push(`  /* ${densityName.charAt(0).toUpperCase() + densityName.slice(1)} Density — type-tier overrides */`);
  lines.push(`  [data-density="${densityName}"] {`);

  const sorted = [...tokens].sort((a, b) => a.path.localeCompare(b.path));
  for (const token of sorted) {
    const cssVar = `--ds-${token.path.replace(/\./g, "-")}`;
    const cssValue = referenceToVar(String(token.value));
    lines.push(`    ${cssVar}: ${cssValue};`);
  }

  lines.push("  }");
  lines.push("}");

  return lines.join("\n");
}

/**
 * Main build function
 */
async function build(): Promise<BuildResult> {
  const result: BuildResult = {
    success: false,
    tokenCount: 0,
    warnings: [],
    errors: [],
  };

  console.info("Building tokens...");

  // Load all token sources
  const globalTokens = loadTokensFromDir(join(TOKENS_DIR, "global"));
  const brandTokens = loadBrandTokens();
  const modeTokens = loadModeTokens();

  // Load new 16-step color and density tokens
  const colorTokens = loadColorTokens();
  const densityTokens = loadDensityTokens();

  // Load type and component tier tokens
  const typeTokens = loadTokensFromDir(TYPE_TOKENS_DIR);
  const componentTokens = loadTokensFromDir(COMPONENT_TOKENS_DIR);

  console.info(`Loaded ${globalTokens.length} global tokens`);
  console.info(`Loaded ${brandTokens.size} brands`);
  console.info(`Loaded ${modeTokens.size} modes`);
  console.info(`Loaded ${colorTokens.primitives.length} primitive color tokens`);
  console.info(`Loaded ${colorTokens.semantic.length} semantic color tokens`);
  console.info(`Loaded ${colorTokens.dark.length} dark mode color tokens`);
  console.info(`Loaded ${densityTokens.size} density modes`);
  console.info(`Loaded ${typeTokens.length} type tokens`);
  console.info(`Loaded ${componentTokens.length} component tokens`);

  // Validate tokens
  const validation = validateTokens(globalTokens);
  if (!validation.valid) {
    for (const error of validation.errors) {
      result.errors.push(`${error.type}: ${error.message}`);
      console.error(`ERROR: ${error.message}`);
    }
    return result;
  }

  for (const warning of validation.warnings) {
    result.warnings.push(`${warning.type}: ${warning.message}`);
    console.warn(`WARNING: ${warning.message}`);
  }

  // Build token sources for resolution
  const sources = buildTokenSources(
    globalTokens,
    modeTokens,
    brandTokens,
    new Map() // brand+mode combinations
  );

  // Generate CSS output
  const cssOutput: CSSOutput = {
    default: "",
    modes: new Map(),
    brands: new Map(),
    brandModes: new Map(),
  };

  // Resolve and generate default CSS
  const defaultResolved = resolveTokens(globalTokens, sources, {});
  cssOutput.default = generateCSS(defaultResolved.resolved);

  // Resolve and generate mode CSS
  for (const [mode, tokens] of modeTokens) {
    if (mode.startsWith("density-")) {
      // Density modes use --ds- prefix to match type-tier tokens
      // and [data-density="..."] selectors for activation
      const densityName = mode.replace("density-", "");
      cssOutput.modes.set(mode, generateDensityModeCSS(tokens, densityName));
    } else {
      const resolved = resolveTokens(tokens, sources, { mode });
      cssOutput.modes.set(mode, generateModeCSS(resolved.resolved, mode));
    }
  }

  // Resolve and generate brand CSS
  for (const [brand, tokens] of brandTokens) {
    const resolved = resolveTokens(tokens, sources, { brand });
    cssOutput.brands.set(brand, generateBrandCSS(resolved.resolved, brand));
  }

  // Combine all CSS
  const combinedCSS = combineCSS(cssOutput);

  // Create dist directories
  mkdirSync(join(DIST_DIR, "css"), { recursive: true });
  mkdirSync(join(DIST_DIR, "json"), { recursive: true });
  mkdirSync(join(DIST_DIR, "ts"), { recursive: true });

  // Write CSS output
  writeFileSync(join(DIST_DIR, "css/tokens.css"), combinedCSS);
  console.info("Written: dist/css/tokens.css");

  // Write 16-step color CSS
  if (colorTokens.primitives.length > 0) {
    const colorCSS = generateColorCSS(colorTokens.primitives, colorTokens.semantic, colorTokens.dark);
    writeFileSync(join(DIST_DIR, "css/colors.css"), colorCSS);
    console.info("Written: dist/css/colors.css");
  }

  // Write density CSS
  if (densityTokens.size > 0) {
    const densityCSS = generateDensityCSS(densityTokens);
    writeFileSync(join(DIST_DIR, "css/density.css"), densityCSS);
    console.info("Written: dist/css/density.css");
  }

  // Write type token CSS
  if (typeTokens.length > 0) {
    const typeCSS = generateTierCSS(typeTokens, "Type");
    writeFileSync(join(DIST_DIR, "css/type-tokens.css"), typeCSS);
    console.info(`Written: dist/css/type-tokens.css (${typeTokens.length} tokens)`);
  } else {
    // Write empty file so imports don't break
    writeFileSync(join(DIST_DIR, "css/type-tokens.css"), "/* Type tokens — none defined yet */\n");
    console.info("Written: dist/css/type-tokens.css (empty)");
  }

  // Write component token CSS
  if (componentTokens.length > 0) {
    const componentCSS = generateTierCSS(componentTokens, "Component");
    writeFileSync(join(DIST_DIR, "css/component-tokens.css"), componentCSS);
    console.info(`Written: dist/css/component-tokens.css (${componentTokens.length} tokens)`);
  } else {
    writeFileSync(join(DIST_DIR, "css/component-tokens.css"), "/* Component tokens — none defined yet */\n");
    console.info("Written: dist/css/component-tokens.css (empty)");
  }

  // Write JSON output using new emitter
  const jsonBundle = generateJSONBundle(defaultResolved.resolved, { version: "0.0.0" });
  writeFileSync(join(DIST_DIR, "json/tokens.json"), serializeJSONBundle(jsonBundle));
  console.info("Written: dist/json/tokens.json");

  // Write TypeScript output using new emitter
  let tsOutput = generateTypeScript(globalTokens);

  // Append type and component tier types
  const typeTypes = generateTierTypes(typeTokens, "TypeTokenPath");
  const componentTypes = generateTierTypes(componentTokens, "ComponentTokenPath");
  if (typeTypes) tsOutput += `\n${typeTypes}`;
  if (componentTypes) tsOutput += `\n${componentTypes}`;

  writeFileSync(join(DIST_DIR, "ts/index.ts"), tsOutput);
  console.info("Written: dist/ts/index.ts");

  // Write runtime TypeScript utilities
  mkdirSync(join(DIST_DIR, "ts/runtime"), { recursive: true });
  const runtimeOutput = generateRuntimeTypes();
  writeFileSync(join(DIST_DIR, "ts/runtime/index.ts"), runtimeOutput);
  console.info("Written: dist/ts/runtime/index.ts");

  // Write color TypeScript types
  mkdirSync(join(DIST_DIR, "types"), { recursive: true });
  const colorTypesOutput = generateColorTypes();
  writeFileSync(join(DIST_DIR, "types/colors.d.ts"), colorTypesOutput);
  console.info("Written: dist/types/colors.d.ts");

  result.success = true;
  result.tokenCount = globalTokens.length;
  console.info(`Build complete: ${result.tokenCount} tokens`);

  return result;
}

// Run build
build().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
