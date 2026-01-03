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

  console.info(`Loaded ${globalTokens.length} global tokens`);
  console.info(`Loaded ${brandTokens.size} brands`);
  console.info(`Loaded ${modeTokens.size} modes`);

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
    const resolved = resolveTokens(tokens, sources, { mode });
    cssOutput.modes.set(mode, generateModeCSS(resolved.resolved, mode));
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

  // Write JSON output using new emitter
  const jsonBundle = generateJSONBundle(defaultResolved.resolved, { version: "0.0.0" });
  writeFileSync(join(DIST_DIR, "json/tokens.json"), serializeJSONBundle(jsonBundle));
  console.info("Written: dist/json/tokens.json");

  // Write TypeScript output using new emitter
  const tsOutput = generateTypeScript(globalTokens);
  writeFileSync(join(DIST_DIR, "ts/index.ts"), tsOutput);
  console.info("Written: dist/ts/index.ts");

  // Write runtime TypeScript utilities
  mkdirSync(join(DIST_DIR, "ts/runtime"), { recursive: true });
  const runtimeOutput = generateRuntimeTypes();
  writeFileSync(join(DIST_DIR, "ts/runtime/index.ts"), runtimeOutput);
  console.info("Written: dist/ts/runtime/index.ts");

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
