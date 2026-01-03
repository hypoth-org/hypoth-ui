/**
 * CSS Emitter
 * Generates CSS custom properties from resolved tokens
 */

import type { BorderValue, ShadowValue, TokenValue, TypographyValue } from "../../types/dtcg.js";
import type { ResolvedValue } from "../resolver.js";
import { tokenPathToCSS } from "../utils/paths.js";

/** CSS emission options */
export interface CSSEmitOptions {
  /** Include @layer declarations */
  useLayers?: boolean;
  /** Layer name for tokens */
  layerName?: string;
  /** Include media queries for user preferences */
  includeMediaQueries?: boolean;
}

/** CSS output structure */
export interface CSSOutput {
  /** Default tokens (no brand/mode) */
  default: string;
  /** Mode-specific tokens */
  modes: Map<string, string>;
  /** Brand-specific tokens */
  brands: Map<string, string>;
  /** Brand+mode specific tokens */
  brandModes: Map<string, Map<string, string>>;
}

/**
 * Convert a token value to CSS
 */
export function tokenValueToCSS(value: TokenValue): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    // Font family array or shadow array
    if (value.length > 0) {
      if (typeof value[0] === "string") {
        // Font family
        return (value as string[]).map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ");
      }
      if (typeof value[0] === "number") {
        // Cubic bezier
        return `cubic-bezier(${value.join(", ")})`;
      }
      if (typeof value[0] === "object" && "color" in value[0]) {
        // Shadow array
        return (value as ShadowValue[]).map(shadowToCSS).join(", ");
      }
    }
    return String(value);
  }

  if (typeof value === "object" && value !== null) {
    // Composite values
    if ("offsetX" in value && "offsetY" in value && "blur" in value) {
      return shadowToCSS(value as ShadowValue);
    }
    if ("width" in value && "style" in value && "color" in value) {
      return borderToCSS(value as BorderValue);
    }
    if ("fontFamily" in value && "fontSize" in value) {
      // Typography is typically not a single CSS value
      // Return as JSON for now, or handle specially
      return typographyToCSS(value as TypographyValue);
    }
  }

  return String(value);
}

/**
 * Convert shadow value to CSS
 */
function shadowToCSS(shadow: ShadowValue): string {
  return `${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} ${shadow.color}`;
}

/**
 * Convert border value to CSS
 */
function borderToCSS(border: BorderValue): string {
  return `${border.width} ${border.style} ${border.color}`;
}

/**
 * Convert typography value to CSS (returns font shorthand)
 */
function typographyToCSS(typography: TypographyValue): string {
  const fontFamily = Array.isArray(typography.fontFamily)
    ? typography.fontFamily.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ")
    : typography.fontFamily;

  return `${typography.fontWeight} ${typography.fontSize}/${typography.lineHeight} ${fontFamily}`;
}

/**
 * Generate CSS lines for a set of resolved tokens
 */
function generateTokenLines(
  resolved: Map<string, ResolvedValue>,
  sortedPaths: string[],
  indent = "  "
): string[] {
  const lines: string[] = [];
  for (const path of sortedPaths) {
    const value = resolved.get(path);
    if (!value) continue;
    const cssVar = tokenPathToCSS(path);
    const cssValue = tokenValueToCSS(value.resolvedValue);
    lines.push(`${indent}${cssVar}: ${cssValue};`);
  }
  return lines;
}

/**
 * Generate CSS custom properties from resolved tokens
 */
export function generateCSS(
  resolved: Map<string, ResolvedValue>,
  options: CSSEmitOptions = {}
): string {
  const { useLayers = true, layerName = "tokens" } = options;

  const lines: string[] = [];

  if (useLayers) {
    lines.push(`@layer ${layerName} {`);
  }

  lines.push(":root {");

  // Sort keys for deterministic output
  const sortedPaths = [...resolved.keys()].sort();
  lines.push(...generateTokenLines(resolved, sortedPaths));

  lines.push("}");

  if (useLayers) {
    lines.push("}");
  }

  return lines.join("\n");
}

/**
 * Generate scoped CSS for a specific brand
 */
export function generateBrandCSS(
  resolved: Map<string, ResolvedValue>,
  brand: string,
  options: CSSEmitOptions = {}
): string {
  const { useLayers = true, layerName = "tokens" } = options;

  const lines: string[] = [];

  if (useLayers) {
    lines.push(`@layer ${layerName} {`);
  }

  lines.push(`:root[data-brand="${brand}"] {`);

  const sortedPaths = [...resolved.keys()].sort();
  lines.push(...generateTokenLines(resolved, sortedPaths));

  lines.push("}");

  if (useLayers) {
    lines.push("}");
  }

  return lines.join("\n");
}

/**
 * Generate scoped CSS for a specific mode
 */
export function generateModeCSS(
  resolved: Map<string, ResolvedValue>,
  mode: string,
  options: CSSEmitOptions = {}
): string {
  const { useLayers = true, layerName = "tokens", includeMediaQueries = true } = options;

  const lines: string[] = [];

  if (useLayers) {
    lines.push(`@layer ${layerName} {`);
  }

  lines.push(`:root[data-mode="${mode}"] {`);

  const sortedPaths = [...resolved.keys()].sort();
  lines.push(...generateTokenLines(resolved, sortedPaths));

  lines.push("}");

  // Add media query for dark mode
  if (includeMediaQueries && mode === "dark") {
    lines.push("");
    lines.push("@media (prefers-color-scheme: dark) {");
    lines.push("  :root:not([data-mode]) {");
    lines.push(...generateTokenLines(resolved, sortedPaths, "    "));
    lines.push("  }");
    lines.push("}");
  }

  // Add media query for high contrast
  if (includeMediaQueries && mode === "high-contrast") {
    lines.push("");
    lines.push("@media (prefers-contrast: more) {");
    lines.push("  :root:not([data-mode]) {");
    lines.push(...generateTokenLines(resolved, sortedPaths, "    "));
    lines.push("  }");
    lines.push("}");
  }

  // Add media query for reduced motion
  if (includeMediaQueries && mode === "reduced-motion") {
    lines.push("");
    lines.push("@media (prefers-reduced-motion: reduce) {");
    lines.push("  :root {");
    lines.push(...generateTokenLines(resolved, sortedPaths, "    "));
    lines.push("  }");
    lines.push("}");
  }

  if (useLayers) {
    lines.push("}");
  }

  return lines.join("\n");
}

/**
 * Generate scoped CSS for brand + mode combination
 */
export function generateBrandModeCSS(
  resolved: Map<string, ResolvedValue>,
  brand: string,
  mode: string,
  options: CSSEmitOptions = {}
): string {
  const { useLayers = true, layerName = "tokens" } = options;

  const lines: string[] = [];

  if (useLayers) {
    lines.push(`@layer ${layerName} {`);
  }

  lines.push(`:root[data-brand="${brand}"][data-mode="${mode}"] {`);

  const sortedPaths = [...resolved.keys()].sort();
  lines.push(...generateTokenLines(resolved, sortedPaths));

  lines.push("}");

  if (useLayers) {
    lines.push("}");
  }

  return lines.join("\n");
}

/**
 * Combine all CSS outputs into a single file
 */
export function combineCSS(output: CSSOutput): string {
  const parts: string[] = [];

  // Default tokens first
  parts.push("/* Default tokens */");
  parts.push(output.default);

  // Mode tokens
  for (const [mode, css] of output.modes) {
    parts.push("");
    parts.push(`/* Mode: ${mode} */`);
    parts.push(css);
  }

  // Brand tokens
  for (const [brand, css] of output.brands) {
    parts.push("");
    parts.push(`/* Brand: ${brand} */`);
    parts.push(css);
  }

  // Brand+mode tokens
  for (const [brand, modes] of output.brandModes) {
    for (const [mode, css] of modes) {
      parts.push("");
      parts.push(`/* Brand: ${brand}, Mode: ${mode} */`);
      parts.push(css);
    }
  }

  return parts.join("\n");
}
