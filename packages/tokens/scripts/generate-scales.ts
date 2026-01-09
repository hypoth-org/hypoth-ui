/**
 * OKLCH Color Scale Generator
 *
 * Generates perceptually uniform 16-step color scales using OKLCH color space.
 * OKLCH provides better perceptual uniformity than HSL/RGB for creating scales.
 *
 * OKLCH components:
 * - L: Lightness (0-1, where 0 is black, 1 is white)
 * - C: Chroma (0+, colorfulness/saturation)
 * - H: Hue (0-360, color angle)
 *
 * @packageDocumentation
 */

/**
 * OKLCH color representation
 */
export interface OklchColor {
  /** Lightness (0-1) */
  l: number;
  /** Chroma (0+, typically 0-0.4 for displayable colors) */
  c: number;
  /** Hue angle (0-360) */
  h: number;
}

/**
 * RGB color representation (0-255 for each channel)
 */
export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Color scale step configuration
 */
export interface ColorScaleStep {
  /** Step number (1-16) */
  step: number;
  /** Lightness target for this step */
  lightness: number;
  /** Chroma multiplier for this step (0-1) */
  chromaMultiplier: number;
  /** Description of the step's intended use */
  description: string;
}

/**
 * Base color configuration for scale generation
 */
export interface BaseColorConfig {
  /** Color name (e.g., "blue", "red") */
  name: string;
  /** Base hue angle (0-360) */
  hue: number;
  /** Maximum chroma for the color */
  maxChroma: number;
  /** Description of the color scale */
  description: string;
}

/**
 * Default 16-step lightness and chroma progression
 * Designed for:
 * - Steps 1-4: Backgrounds (very light)
 * - Steps 5-7: Element backgrounds/hover states
 * - Steps 8-10: Borders
 * - Steps 11-14: Solid fills
 * - Steps 15-16: Text colors
 */
export const DEFAULT_SCALE_STEPS: ColorScaleStep[] = [
  { step: 1, lightness: 0.99, chromaMultiplier: 0.1, description: "Page background" },
  { step: 2, lightness: 0.975, chromaMultiplier: 0.15, description: "Raised surface" },
  { step: 3, lightness: 0.95, chromaMultiplier: 0.2, description: "Nested surface" },
  { step: 4, lightness: 0.92, chromaMultiplier: 0.25, description: "Deep nested" },
  { step: 5, lightness: 0.88, chromaMultiplier: 0.35, description: "Element background" },
  { step: 6, lightness: 0.83, chromaMultiplier: 0.45, description: "Element hover" },
  { step: 7, lightness: 0.77, chromaMultiplier: 0.55, description: "Element active" },
  { step: 8, lightness: 0.70, chromaMultiplier: 0.65, description: "Subtle border" },
  { step: 9, lightness: 0.62, chromaMultiplier: 0.75, description: "Default border" },
  { step: 10, lightness: 0.54, chromaMultiplier: 0.85, description: "Strong border" },
  { step: 11, lightness: 0.52, chromaMultiplier: 1.0, description: "Solid default" },
  { step: 12, lightness: 0.46, chromaMultiplier: 0.95, description: "Solid hover" },
  { step: 13, lightness: 0.40, chromaMultiplier: 0.9, description: "Solid active" },
  { step: 14, lightness: 0.34, chromaMultiplier: 0.85, description: "Solid emphasis" },
  { step: 15, lightness: 0.28, chromaMultiplier: 0.7, description: "Muted text" },
  { step: 16, lightness: 0.18, chromaMultiplier: 0.5, description: "Default text" },
];

/**
 * Base color configurations for all primitive colors
 */
export const BASE_COLORS: BaseColorConfig[] = [
  { name: "blue", hue: 240, maxChroma: 0.15, description: "Blue 16-step color scale for primary actions and links" },
  { name: "gray", hue: 240, maxChroma: 0.02, description: "Gray 16-step color scale for neutral UI elements" },
  { name: "green", hue: 145, maxChroma: 0.14, description: "Green 16-step color scale for success states" },
  { name: "red", hue: 25, maxChroma: 0.18, description: "Red 16-step color scale for error states" },
  { name: "yellow", hue: 85, maxChroma: 0.16, description: "Yellow 16-step color scale for warning states" },
  { name: "purple", hue: 290, maxChroma: 0.14, description: "Purple 16-step color scale for accents" },
  { name: "orange", hue: 50, maxChroma: 0.16, description: "Orange 16-step color scale for attention states" },
  { name: "cyan", hue: 195, maxChroma: 0.12, description: "Cyan 16-step color scale for informational states" },
  { name: "pink", hue: 350, maxChroma: 0.14, description: "Pink 16-step color scale for decorative accents" },
];

/**
 * Clamp a value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Convert OKLCH to OKLab
 * OKLab is the intermediate color space between OKLCH and linear RGB
 */
function oklchToOklab(oklch: OklchColor): { L: number; a: number; b: number } {
  const hRad = (oklch.h * Math.PI) / 180;
  return {
    L: oklch.l,
    a: oklch.c * Math.cos(hRad),
    b: oklch.c * Math.sin(hRad),
  };
}

/**
 * Convert OKLab to linear RGB
 * Uses the OKLab to linear sRGB transformation matrix
 */
function oklabToLinearRgb(lab: { L: number; a: number; b: number }): { r: number; g: number; b: number } {
  // OKLab to LMS (cone response)
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const s_ = lab.L - 0.0894841775 * lab.a - 1.2914855480 * lab.b;

  // Cube the values
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // LMS to linear sRGB
  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  };
}

/**
 * Apply sRGB gamma correction (linear to gamma)
 */
function linearToSrgb(value: number): number {
  if (value <= 0.0031308) {
    return value * 12.92;
  }
  return 1.055 * value ** (1 / 2.4) - 0.055;
}

/**
 * Convert OKLCH color to hex string
 */
export function oklchToHex(oklch: OklchColor): string {
  const oklab = oklchToOklab(oklch);
  const linearRgb = oklabToLinearRgb(oklab);

  // Apply gamma correction and convert to 0-255 range
  const r = Math.round(clamp(linearToSrgb(linearRgb.r), 0, 1) * 255);
  const g = Math.round(clamp(linearToSrgb(linearRgb.g), 0, 1) * 255);
  const b = Math.round(clamp(linearToSrgb(linearRgb.b), 0, 1) * 255);

  // Convert to hex
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Check if an OKLCH color is within the sRGB gamut
 */
export function isInGamut(oklch: OklchColor): boolean {
  const oklab = oklchToOklab(oklch);
  const linearRgb = oklabToLinearRgb(oklab);

  const epsilon = 0.0001;
  return (
    linearRgb.r >= -epsilon &&
    linearRgb.r <= 1 + epsilon &&
    linearRgb.g >= -epsilon &&
    linearRgb.g <= 1 + epsilon &&
    linearRgb.b >= -epsilon &&
    linearRgb.b <= 1 + epsilon
  );
}

/**
 * Reduce chroma until the color is within sRGB gamut
 */
export function gamutMap(oklch: OklchColor): OklchColor {
  if (isInGamut(oklch)) {
    return oklch;
  }

  // Binary search to find maximum chroma within gamut
  let low = 0;
  let high = oklch.c;
  let mapped = { ...oklch };

  while (high - low > 0.0001) {
    const mid = (low + high) / 2;
    mapped = { ...oklch, c: mid };

    if (isInGamut(mapped)) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return { ...oklch, c: low };
}

/**
 * Generate a color at a specific step in the scale
 */
export function generateColorAtStep(
  baseConfig: BaseColorConfig,
  stepConfig: ColorScaleStep
): { hex: string; oklch: OklchColor } {
  const oklch: OklchColor = {
    l: stepConfig.lightness,
    c: baseConfig.maxChroma * stepConfig.chromaMultiplier,
    h: baseConfig.hue,
  };

  // Gamut map to ensure color is displayable
  const mapped = gamutMap(oklch);
  const hex = oklchToHex(mapped);

  return { hex, oklch: mapped };
}

/**
 * Generate a complete 16-step color scale
 */
export function generateColorScale(
  baseConfig: BaseColorConfig,
  steps: ColorScaleStep[] = DEFAULT_SCALE_STEPS
): Record<string, { $value: string; $type: string; $description: string }> {
  const scale: Record<string, { $value: string; $type: string; $description: string }> = {};

  for (const step of steps) {
    const { hex } = generateColorAtStep(baseConfig, step);
    scale[step.step.toString()] = {
      $value: hex,
      $type: "color",
      $description: step.description,
    };
  }

  return scale;
}

/**
 * Generate DTCG-formatted color token file
 */
export function generateColorTokenFile(baseConfig: BaseColorConfig): object {
  return {
    $type: "color",
    $description: baseConfig.description,
    [baseConfig.name]: generateColorScale(baseConfig),
  };
}

/**
 * Generate all primitive color scale files
 */
export function generateAllColorScales(): Map<string, object> {
  const scales = new Map<string, object>();

  for (const config of BASE_COLORS) {
    scales.set(config.name, generateColorTokenFile(config));
  }

  return scales;
}

/**
 * CLI execution
 * Run with: npx tsx scripts/generate-scales.ts
 */
async function main(): Promise<void> {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const url = await import("node:url");

  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outputDir = path.join(__dirname, "../src/colors/primitives");

  console.log("Generating OKLCH-based 16-step color scales...\n");

  const scales = generateAllColorScales();

  for (const [name, tokens] of scales.entries()) {
    const filePath = path.join(outputDir, `${name}.json`);
    fs.writeFileSync(filePath, `${JSON.stringify(tokens, null, 2)}\n`);
    console.log(`Generated: ${name}.json`);
  }

  console.log("\nDone! Generated", scales.size, "color scale files.");
}

// Only run if this is the main module
if (import.meta.url.endsWith(process.argv[1]?.replace(/^file:\/\//, "") || "")) {
  main().catch(console.error);
}
