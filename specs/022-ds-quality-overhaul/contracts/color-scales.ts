/**
 * 16-Step Color Scale Types
 *
 * Feature: 022-ds-quality-overhaul
 * This contract defines a 16-step color scale system for enhanced layering flexibility.
 * Extends beyond Radix's 12-step model to provide more granular background/surface options.
 */

// =============================================================================
// Core Types
// =============================================================================

/**
 * Color step number (1 = lightest, 16 = darkest)
 *
 * Step allocation:
 * - Steps 1-4:   Backgrounds (page, card, nested, deep nested)
 * - Steps 5-7:   Interactive backgrounds (normal, hover, active/selected)
 * - Steps 8-10:  Borders (subtle, default, strong)
 * - Steps 11-12: Solid colors (normal, hover)
 * - Steps 13-14: Solid dark (active, emphasis)
 * - Steps 15-16: Text (muted, default)
 */
export type ColorStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

/**
 * Primitive color palette names
 */
export type PrimitiveColorName =
  | "gray"
  | "blue"
  | "green"
  | "yellow"
  | "red"
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

// =============================================================================
// Scale Structure
// =============================================================================

/**
 * A 16-step color scale providing enhanced layering flexibility.
 *
 * Compared to 12-step (Radix):
 * - 4 background levels instead of 2 (better for nested cards/surfaces)
 * - 3 interactive levels (unchanged)
 * - 3 border levels instead of 3 (subtle, default, strong)
 * - 4 solid levels instead of 2 (more button/badge states)
 * - 2 text levels (unchanged)
 */
export interface ColorScale {
  // -------------------------------------------------------------------------
  // Background Steps (1-4) - For layered surfaces
  // -------------------------------------------------------------------------
  /** Step 1: Page/app background (lightest) */
  1: string;
  /** Step 2: Raised surface (cards, panels) */
  2: string;
  /** Step 3: Nested surface (card within card) */
  3: string;
  /** Step 4: Deeply nested surface (third level nesting) */
  4: string;

  // -------------------------------------------------------------------------
  // Interactive Background Steps (5-7) - For UI elements
  // -------------------------------------------------------------------------
  /** Step 5: UI element background (buttons, inputs) */
  5: string;
  /** Step 6: Hovered UI element background */
  6: string;
  /** Step 7: Active/selected/pressed UI element background */
  7: string;

  // -------------------------------------------------------------------------
  // Border Steps (8-10) - For separators and outlines
  // -------------------------------------------------------------------------
  /** Step 8: Subtle borders (dividers, separators) */
  8: string;
  /** Step 9: Default borders (input borders, card borders) */
  9: string;
  /** Step 10: Strong borders (focus rings, emphasis) */
  10: string;

  // -------------------------------------------------------------------------
  // Solid Color Steps (11-14) - For filled elements
  // -------------------------------------------------------------------------
  /** Step 11: Solid background (primary buttons, badges) */
  11: string;
  /** Step 12: Hovered solid background */
  12: string;
  /** Step 13: Active/pressed solid background */
  13: string;
  /** Step 14: Emphasis solid (high contrast solid) */
  14: string;

  // -------------------------------------------------------------------------
  // Text Steps (15-16) - For typography
  // -------------------------------------------------------------------------
  /** Step 15: Muted/secondary text */
  15: string;
  /** Step 16: Default/primary text (darkest) */
  16: string;
}

/**
 * Semantic color with additional convenience aliases
 */
export interface SemanticColorScale extends ColorScale {
  /** Default solid color (step 11) */
  default: string;
  /** Hover state (step 12) */
  hover: string;
  /** Active/pressed state (step 13) */
  active: string;
  /** Text color on solid background (white or step 1) */
  foreground: string;
  /** Subtle background for this color (step 2) */
  subtle: string;
  /** Muted text in this color (step 15) */
  muted: string;
}

// =============================================================================
// Step Usage Guide
// =============================================================================

/**
 * Recommended usage for each color step
 */
export const ColorStepUsage: Record<ColorStep, string> = {
  // Backgrounds (1-4)
  1: "Page background - App-level background, lightest",
  2: "Raised surface - Cards, panels, modals",
  3: "Nested surface - Card within card, secondary panels",
  4: "Deep nested - Third-level nesting, inset areas",

  // Interactive backgrounds (5-7)
  5: "Element background - Buttons, inputs, interactive elements",
  6: "Element hover - Hover state for interactive elements",
  7: "Element active - Active, selected, or pressed states",

  // Borders (8-10)
  8: "Subtle border - Dividers, separators, subtle outlines",
  9: "Default border - Input borders, card borders",
  10: "Strong border - Focus rings, emphasis borders",

  // Solid colors (11-14)
  11: "Solid default - Primary buttons, badges, filled elements",
  12: "Solid hover - Hover state for solid elements",
  13: "Solid active - Active/pressed state for solid elements",
  14: "Solid emphasis - High-contrast solid, icons on light bg",

  // Text (15-16)
  15: "Muted text - Secondary text, placeholders, captions",
  16: "Default text - Primary text, headings, body copy",
};

/**
 * Step categories for easier lookup
 */
export const ColorStepCategories = {
  backgrounds: [1, 2, 3, 4] as ColorStep[],
  interactive: [5, 6, 7] as ColorStep[],
  borders: [8, 9, 10] as ColorStep[],
  solids: [11, 12, 13, 14] as ColorStep[],
  text: [15, 16] as ColorStep[],
};

/**
 * WCAG AA contrast pairings (4.5:1 minimum for normal text)
 * Maps text steps to their accessible background steps
 */
export const ContrastPairings = {
  /** Step 16 (default text) is readable on background steps 1-7 */
  defaultText: {
    step: 16 as ColorStep,
    validBackgrounds: [1, 2, 3, 4, 5, 6, 7] as ColorStep[],
  },
  /** Step 15 (muted text) is readable on background steps 1-5 */
  mutedText: {
    step: 15 as ColorStep,
    validBackgrounds: [1, 2, 3, 4, 5] as ColorStep[],
  },
  /** White/light text is readable on solid steps 11-16 */
  invertedText: {
    step: "white" as const,
    validBackgrounds: [11, 12, 13, 14, 15, 16] as ColorStep[],
  },
  /** Step 14 (solid emphasis) works as icon/text on steps 1-4 */
  emphasisOnLight: {
    step: 14 as ColorStep,
    validBackgrounds: [1, 2, 3, 4] as ColorStep[],
  },
};

// =============================================================================
// DTCG Token Format
// =============================================================================

/**
 * DTCG token structure for a color step
 */
export interface DTCGColorToken {
  $value: string;
  $type: "color";
  $description?: string;
}

/**
 * DTCG token structure for a color scale
 */
export type DTCGColorScale = {
  [K in ColorStep]: DTCGColorToken;
};

/**
 * Example DTCG token file structure
 */
export interface DTCGColorTokenFile {
  $type: "color";
  [colorName: string]: DTCGColorScale | "color";
}

// =============================================================================
// Dark Mode Support
// =============================================================================

/**
 * Dark mode inversion strategy
 * In dark mode, the scale is inverted symmetrically (1↔16, 2↔15, etc.)
 * This ensures:
 * - Light backgrounds (1-4) become dark backgrounds
 * - Dark text (15-16) becomes light text
 * - Middle values remain relatively stable
 */
export const DarkModeInversion: Record<ColorStep, ColorStep> = {
  1: 16,
  2: 15,
  3: 14,
  4: 13,
  5: 12,
  6: 11,
  7: 10,
  8: 9,
  9: 8,
  10: 7,
  11: 6,
  12: 5,
  13: 4,
  14: 3,
  15: 2,
  16: 1,
};

/**
 * Dark mode configuration
 */
export interface DarkModeConfig {
  /** Whether to use automatic inversion */
  autoInvert: boolean;
  /** Custom step mappings (overrides auto-inversion) */
  customMappings?: Partial<Record<ColorStep, ColorStep>>;
  /** Steps that should not be inverted (e.g., brand colors) */
  preserveSteps?: ColorStep[];
}

// =============================================================================
// Color Generation
// =============================================================================

/**
 * Input for generating a color scale from a base color
 */
export interface ColorScaleGeneratorInput {
  /** Base color (typically the "9" step) */
  baseColor: string;
  /** Color name for the scale */
  name: string;
  /** Whether this is for dark mode */
  darkMode?: boolean;
}

/**
 * Output from color scale generation
 */
export interface ColorScaleGeneratorOutput {
  name: string;
  scale: ColorScale;
  contrastInfo: {
    /** Steps that meet WCAG AA for text on step 9 */
    textOnSolid: ColorStep[];
    /** Steps that meet WCAG AA for step 12 text */
    solidOnText: ColorStep[];
  };
}

// =============================================================================
// CSS Custom Properties
// =============================================================================

/**
 * CSS custom property naming convention
 */
export const ColorCSSProperty = {
  /** Get CSS property name for a primitive color step */
  primitive: (color: PrimitiveColorName, step: ColorStep) =>
    `--ds-color-${color}-${step}`,

  /** Get CSS property name for a semantic color step */
  semantic: (color: SemanticColorName, step: ColorStep) =>
    `--ds-color-${color}-${step}`,

  /** Get CSS property name for a semantic alias */
  alias: (color: SemanticColorName, alias: "default" | "hover" | "active" | "foreground") =>
    `--ds-color-${color}-${alias}`,
};

// =============================================================================
// Type Utilities
// =============================================================================

/**
 * Extract a color value type for use in style props
 */
export type ColorValue =
  | `${PrimitiveColorName}.${ColorStep}`
  | `${SemanticColorName}.${ColorStep}`
  | `${SemanticColorName}.${"default" | "hover" | "active" | "foreground" | "subtle" | "muted"}`
  | "transparent"
  | "currentColor"
  | "inherit";

// =============================================================================
// Usage Examples
// =============================================================================

/**
 * @example Token file (DTCG format)
 * ```json
 * {
 *   "$type": "color",
 *   "blue": {
 *     "1": { "$value": "#fafcff", "$description": "Page background" },
 *     "2": { "$value": "#f5f9ff", "$description": "Raised surface" },
 *     "3": { "$value": "#edf4ff", "$description": "Nested surface" },
 *     "4": { "$value": "#e1edff", "$description": "Deep nested" },
 *     "5": { "$value": "#d3e4ff", "$description": "Element background" },
 *     "6": { "$value": "#c1d9ff", "$description": "Element hover" },
 *     "7": { "$value": "#a8c8ff", "$description": "Element active" },
 *     "8": { "$value": "#8ab4ff", "$description": "Subtle border" },
 *     "9": { "$value": "#6a9eff", "$description": "Default border" },
 *     "10": { "$value": "#4a88ff", "$description": "Strong border" },
 *     "11": { "$value": "#0066cc", "$description": "Solid default" },
 *     "12": { "$value": "#0059b3", "$description": "Solid hover" },
 *     "13": { "$value": "#004d99", "$description": "Solid active" },
 *     "14": { "$value": "#004080", "$description": "Solid emphasis" },
 *     "15": { "$value": "#003366", "$description": "Muted text" },
 *     "16": { "$value": "#001d3d", "$description": "Default text" }
 *   }
 * }
 * ```
 *
 * @example CSS output
 * ```css
 * :root {
 *   --ds-color-blue-1: #fafcff;
 *   --ds-color-blue-2: #f5f9ff;
 *   --ds-color-blue-11: #0066cc;
 *   --ds-color-blue-16: #001d3d;
 *
 *   --ds-color-primary-default: var(--ds-color-blue-11);
 *   --ds-color-primary-hover: var(--ds-color-blue-12);
 *   --ds-color-primary-active: var(--ds-color-blue-13);
 *   --ds-color-primary-subtle: var(--ds-color-blue-2);
 *   --ds-color-primary-muted: var(--ds-color-blue-15);
 * }
 * ```
 *
 * @example Style props usage - Layered surfaces
 * ```tsx
 * <Box bg="neutral.1">                    {/* Page background *}
 *   <Box bg="neutral.2" p={4}>            {/* Card *}
 *     <Box bg="neutral.3" p={3}>          {/* Nested card *}
 *       <Box bg="neutral.4" p={2}>        {/* Deep nested *}
 *         Four levels of layering!
 *       </Box>
 *     </Box>
 *   </Box>
 * </Box>
 * ```
 *
 * @example Style props usage - Interactive elements
 * ```tsx
 * <Button bg="primary.11" color="primary.foreground">
 *   Primary Button
 * </Button>
 *
 * <Box bg="primary.subtle" color="primary.16" border="primary.9">
 *   Subtle primary card with border
 * </Box>
 *
 * <Text color="neutral.15">Muted caption text</Text>
 * <Text color="neutral.16">Default body text</Text>
 * ```
 *
 * @example Layering quick reference
 * ```
 * Step 1:  Page/app background
 * Step 2:  Card, modal, panel
 * Step 3:  Nested card, secondary panel
 * Step 4:  Deeply nested, inset area
 * Step 5:  Button/input background
 * Step 6:  Hover state
 * Step 7:  Active/selected state
 * Step 8:  Subtle border
 * Step 9:  Default border
 * Step 10: Focus ring
 * Step 11: Solid fill (buttons)
 * Step 12: Solid hover
 * Step 13: Solid active
 * Step 14: Icons/emphasis
 * Step 15: Muted text
 * Step 16: Default text
 * ```
 */
