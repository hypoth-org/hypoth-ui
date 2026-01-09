/**
 * Contrast Ratio Calculator
 *
 * Calculates WCAG contrast ratios and generates recommended color pairings.
 * Supports WCAG 2.1 Level AA and AAA requirements.
 *
 * WCAG Contrast Requirements:
 * - Level AA: 4.5:1 for normal text, 3:1 for large text
 * - Level AAA: 7:1 for normal text, 4.5:1 for large text
 * - Large text: 14pt bold or 18pt regular
 *
 * @packageDocumentation
 */

/**
 * RGB color with values 0-255
 */
export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/**
 * WCAG conformance level
 */
export type WcagLevel = "AA" | "AAA";

/**
 * Text size category for contrast requirements
 */
export type TextSize = "normal" | "large";

/**
 * Contrast check result
 */
export interface ContrastResult {
  /** Calculated contrast ratio */
  ratio: number;
  /** Whether it passes WCAG AA for normal text (4.5:1) */
  passesAA: boolean;
  /** Whether it passes WCAG AA for large text (3:1) */
  passesAALarge: boolean;
  /** Whether it passes WCAG AAA for normal text (7:1) */
  passesAAA: boolean;
  /** Whether it passes WCAG AAA for large text (4.5:1) */
  passesAAALarge: boolean;
}

/**
 * Color pairing recommendation
 */
export interface ColorPairing {
  /** Background color step (1-16) */
  background: number;
  /** Foreground color step (1-16) */
  foreground: number;
  /** Background hex color */
  backgroundHex: string;
  /** Foreground hex color */
  foregroundHex: string;
  /** Contrast ratio */
  ratio: number;
  /** Recommended use cases */
  useCases: string[];
}

/**
 * WCAG contrast thresholds
 */
export const WCAG_THRESHOLDS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5,
} as const;

/**
 * Parse hex color string to RGB
 */
export function hexToRgb(hex: string): RgbColor {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, "");

  // Handle shorthand (3 char) hex
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((c) => c + c)
          .join("")
      : cleanHex;

  const num = parseInt(fullHex, 16);

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Convert RGB component to relative luminance component
 * sRGB to linear RGB conversion
 */
function toLinearComponent(component: number): number {
  const srgb = component / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
}

/**
 * Calculate relative luminance of a color
 * Per WCAG 2.1 definition
 *
 * @param rgb - RGB color (0-255 values)
 * @returns Relative luminance (0-1)
 */
export function getRelativeLuminance(rgb: RgbColor): number {
  const r = toLinearComponent(rgb.r);
  const g = toLinearComponent(rgb.g);
  const b = toLinearComponent(rgb.b);

  // WCAG luminance coefficients
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate relative luminance from hex color
 */
export function getLuminanceFromHex(hex: string): number {
  return getRelativeLuminance(hexToRgb(hex));
}

/**
 * Calculate contrast ratio between two colors
 * Per WCAG 2.1 definition
 *
 * @param color1 - First color hex string
 * @param color2 - Second color hex string
 * @returns Contrast ratio (1:1 to 21:1)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminanceFromHex(color1);
  const l2 = getLuminanceFromHex(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG requirements
 */
export function checkContrast(color1: string, color2: string): ContrastResult {
  const ratio = getContrastRatio(color1, color2);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA: ratio >= WCAG_THRESHOLDS.AA_NORMAL,
    passesAALarge: ratio >= WCAG_THRESHOLDS.AA_LARGE,
    passesAAA: ratio >= WCAG_THRESHOLDS.AAA_NORMAL,
    passesAAALarge: ratio >= WCAG_THRESHOLDS.AAA_LARGE,
  };
}

/**
 * Get minimum required contrast for a given level and text size
 */
export function getMinimumContrast(level: WcagLevel, textSize: TextSize): number {
  if (level === "AAA") {
    return textSize === "large" ? WCAG_THRESHOLDS.AAA_LARGE : WCAG_THRESHOLDS.AAA_NORMAL;
  }
  return textSize === "large" ? WCAG_THRESHOLDS.AA_LARGE : WCAG_THRESHOLDS.AA_NORMAL;
}

/**
 * Find all valid color pairings in a scale that meet contrast requirements
 *
 * @param scale - Object with step numbers as keys and hex colors as values
 * @param minContrast - Minimum contrast ratio required (default: 4.5 for AA)
 */
export function findValidPairings(
  scale: Record<string, string>,
  minContrast: number = WCAG_THRESHOLDS.AA_NORMAL
): ColorPairing[] {
  const pairings: ColorPairing[] = [];
  const steps = Object.keys(scale)
    .map(Number)
    .sort((a, b) => a - b);

  for (const bgStep of steps) {
    for (const fgStep of steps) {
      if (bgStep === fgStep) continue;

      const bgHex = scale[bgStep.toString()];
      const fgHex = scale[fgStep.toString()];
      const ratio = getContrastRatio(bgHex, fgHex);

      if (ratio >= minContrast) {
        const useCases = getUseCases(bgStep, fgStep, ratio);
        pairings.push({
          background: bgStep,
          foreground: fgStep,
          backgroundHex: bgHex,
          foregroundHex: fgHex,
          ratio: Math.round(ratio * 100) / 100,
          useCases,
        });
      }
    }
  }

  // Sort by contrast ratio (highest first)
  return pairings.sort((a, b) => b.ratio - a.ratio);
}

/**
 * Determine recommended use cases based on step numbers and contrast ratio
 */
function getUseCases(bgStep: number, fgStep: number, ratio: number): string[] {
  const useCases: string[] = [];

  // Light backgrounds (1-4) with dark text (14-16)
  if (bgStep <= 4 && fgStep >= 14) {
    useCases.push("Primary text on page background");
    if (ratio >= WCAG_THRESHOLDS.AAA_NORMAL) {
      useCases.push("Small text");
    }
  }

  // Light backgrounds with solid fills (11-13)
  if (bgStep <= 4 && fgStep >= 11 && fgStep <= 13) {
    useCases.push("Buttons and links");
    useCases.push("Interactive elements");
  }

  // Element backgrounds (5-7) with text (14-16)
  if (bgStep >= 5 && bgStep <= 7 && fgStep >= 14) {
    useCases.push("Text on hover states");
    useCases.push("Selected element text");
  }

  // Solid fills (11-14) with white/light text (1-2)
  if (bgStep >= 11 && bgStep <= 14 && fgStep <= 2) {
    useCases.push("Button text");
    useCases.push("Badge text");
    useCases.push("Solid background labels");
  }

  // Dark backgrounds (15-16) with light text (1-4)
  if (bgStep >= 15 && fgStep <= 4) {
    useCases.push("Dark mode text");
    useCases.push("Inverted sections");
  }

  // Border pairings
  if ((bgStep <= 4 && fgStep >= 8 && fgStep <= 10) || (bgStep >= 8 && bgStep <= 10 && fgStep >= 14)) {
    useCases.push("Border visibility");
  }

  // If no specific use cases, add generic one
  if (useCases.length === 0) {
    if (ratio >= WCAG_THRESHOLDS.AAA_NORMAL) {
      useCases.push("High contrast pairing (AAA)");
    } else if (ratio >= WCAG_THRESHOLDS.AA_NORMAL) {
      useCases.push("Standard contrast pairing (AA)");
    } else {
      useCases.push("Large text or decorative use");
    }
  }

  return useCases;
}

/**
 * Generate recommended pairings for a color scale
 * Focuses on the most useful combinations for UI design
 */
export function generateRecommendedPairings(
  scale: Record<string, string>
): {
  textOnBackground: ColorPairing[];
  buttonText: ColorPairing[];
  borders: ColorPairing[];
} {
  const allPairings = findValidPairings(scale, WCAG_THRESHOLDS.AA_LARGE);

  return {
    // Text on light backgrounds
    textOnBackground: allPairings.filter(
      (p) => p.background <= 4 && p.foreground >= 14 && p.ratio >= WCAG_THRESHOLDS.AA_NORMAL
    ),
    // Button text (white/light on solid fills)
    buttonText: allPairings.filter(
      (p) => p.background >= 11 && p.background <= 14 && p.foreground <= 3 && p.ratio >= WCAG_THRESHOLDS.AA_NORMAL
    ),
    // Border visibility
    borders: allPairings.filter(
      (p) => p.background <= 4 && p.foreground >= 8 && p.foreground <= 10 && p.ratio >= WCAG_THRESHOLDS.AA_LARGE
    ),
  };
}

/**
 * Format contrast ratio for display
 */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

/**
 * Generate a contrast matrix showing all step combinations
 */
export function generateContrastMatrix(scale: Record<string, string>): number[][] {
  const steps = Object.keys(scale)
    .map(Number)
    .sort((a, b) => a - b);
  const matrix: number[][] = [];

  for (const rowStep of steps) {
    const row: number[] = [];
    for (const colStep of steps) {
      const ratio = getContrastRatio(scale[rowStep.toString()], scale[colStep.toString()]);
      row.push(Math.round(ratio * 100) / 100);
    }
    matrix.push(row);
  }

  return matrix;
}

