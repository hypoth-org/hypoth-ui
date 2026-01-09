/**
 * 16-Step Color Scale Types
 *
 * Defines types for the expanded color system with better layering support.
 */

// =============================================================================
// Step Types
// =============================================================================

/**
 * Color step number (1 = lightest, 16 = darkest)
 *
 * Step allocation:
 * - Steps 1-4:   Backgrounds (page, card, nested, deep nested)
 * - Steps 5-7:   Interactive backgrounds (normal, hover, active/selected)
 * - Steps 8-10:  Borders (subtle, default, strong)
 * - Steps 11-14: Solid colors (normal, hover, active, emphasis)
 * - Steps 15-16: Text (muted, default)
 */
export type ColorStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

// =============================================================================
// Color Name Types
// =============================================================================

/**
 * Primitive color palette names
 */
export type PrimitiveColorName =
  | "gray"
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "orange"
  | "cyan"
  | "pink";

/**
 * Semantic color names (mapped to primitives)
 */
export type SemanticColorName =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "neutral";

/**
 * Semantic color aliases for convenience
 */
export type SemanticColorAlias =
  | "default"
  | "hover"
  | "active"
  | "foreground"
  | "subtle"
  | "muted";

// =============================================================================
// Color Value Types
// =============================================================================

/**
 * Color token reference value
 * Used for style props and type-safe color references
 */
export type ColorTokenValue =
  | `${PrimitiveColorName}.${ColorStep}`
  | `${SemanticColorName}.${ColorStep}`
  | `${SemanticColorName}.${SemanticColorAlias}`
  | "transparent"
  | "currentColor"
  | "inherit";

/**
 * CSS custom property name for a color token
 */
export type ColorCSSVariable =
  | `--ds-color-${PrimitiveColorName}-${ColorStep}`
  | `--ds-color-${SemanticColorName}-${ColorStep}`
  | `--ds-color-${SemanticColorName}-${SemanticColorAlias}`;

// =============================================================================
// Step Categories
// =============================================================================

/**
 * Color step categories for easier lookup
 */
export const ColorStepCategories = {
  /** Steps 1-4: Page/card/nested backgrounds */
  backgrounds: [1, 2, 3, 4] as const,
  /** Steps 5-7: Interactive element states */
  interactive: [5, 6, 7] as const,
  /** Steps 8-10: Border strengths */
  borders: [8, 9, 10] as const,
  /** Steps 11-14: Solid fill states */
  solids: [11, 12, 13, 14] as const,
  /** Steps 15-16: Text variations */
  text: [15, 16] as const,
} as const;

/**
 * Step usage descriptions
 */
export const ColorStepUsage: Record<ColorStep, string> = {
  1: "Page background - App-level background, lightest",
  2: "Raised surface - Cards, panels, modals",
  3: "Nested surface - Card within card, secondary panels",
  4: "Deep nested - Third-level nesting, inset areas",
  5: "Element background - Buttons, inputs, interactive elements",
  6: "Element hover - Hover state for interactive elements",
  7: "Element active - Active, selected, or pressed states",
  8: "Subtle border - Dividers, separators, subtle outlines",
  9: "Default border - Input borders, card borders",
  10: "Strong border - Focus rings, emphasis borders",
  11: "Solid default - Primary buttons, badges, filled elements",
  12: "Solid hover - Hover state for solid elements",
  13: "Solid active - Active/pressed state for solid elements",
  14: "Solid emphasis - High-contrast solid, icons on light bg",
  15: "Muted text - Secondary text, placeholders, captions",
  16: "Default text - Primary text, headings, body copy",
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get the CSS variable reference for a color token
 */
export function getColorVar(
  color: PrimitiveColorName | SemanticColorName,
  step: ColorStep | SemanticColorAlias
): string {
  return `var(--ds-color-${color}-${step})`;
}

/**
 * Get the CSS variable name for a color token (without var())
 */
export function getColorCSSVarName(
  color: PrimitiveColorName | SemanticColorName,
  step: ColorStep | SemanticColorAlias
): ColorCSSVariable {
  return `--ds-color-${color}-${step}` as ColorCSSVariable;
}
