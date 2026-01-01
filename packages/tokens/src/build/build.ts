import StyleDictionary from "style-dictionary";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "../..");

async function build() {
  console.log("Building tokens...");

  // Load Style Dictionary config
  const configPath = join(rootDir, "style-dictionary.config.js");
  const config = await import(configPath);

  // Ensure dist directories exist
  const distCss = join(rootDir, "dist/css");
  const distTs = join(rootDir, "dist/ts");
  mkdirSync(distCss, { recursive: true });
  mkdirSync(distTs, { recursive: true });

  // Build main tokens
  const sd = new StyleDictionary(config.default);
  await sd.buildAllPlatforms();

  // Build dark mode tokens
  const sdDark = new StyleDictionary(config.darkModeConfig);
  await sdDark.buildAllPlatforms();

  // Build high-contrast mode tokens
  const sdHighContrast = new StyleDictionary(config.highContrastConfig);
  await sdHighContrast.buildAllPlatforms();

  // Generate combined CSS file
  const tokensCSS = readFileSync(join(distCss, "tokens.css"), "utf-8");
  const darkCSS = existsSync(join(distCss, "dark.css"))
    ? readFileSync(join(distCss, "dark.css"), "utf-8")
    : "";
  const highContrastCSS = existsSync(join(distCss, "high-contrast.css"))
    ? readFileSync(join(distCss, "high-contrast.css"), "utf-8")
    : "";

  const combinedCSS = `/* Design System Tokens - Auto-generated */\n\n${tokensCSS}\n${darkCSS}\n${highContrastCSS}`;
  writeFileSync(join(distCss, "tokens.css"), combinedCSS);

  // Generate TypeScript index
  const indexContent = `// Auto-generated barrel export
export { tokens, type Tokens } from "./tokens.js";
`;
  writeFileSync(join(distTs, "index.ts"), indexContent);

  console.log("Tokens built successfully!");
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
