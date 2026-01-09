/**
 * Density System Types
 *
 * Defines types for compact/default/spacious density modes.
 */

// =============================================================================
// Density Mode Types
// =============================================================================

/**
 * Available density modes
 */
export type DensityMode = "compact" | "default" | "spacious";

/**
 * Density scale multipliers relative to default (1)
 */
export const DensityScales: Record<DensityMode, number> = {
  compact: 0.875,
  default: 1,
  spacious: 1.125,
};

// =============================================================================
// Spacing Scale Types
// =============================================================================

/**
 * Spacing scale keys
 */
export type SpacingScale = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

/**
 * Spacing token values by density mode
 */
export const SpacingByDensity: Record<DensityMode, Record<SpacingScale, string>> = {
  compact: {
    1: "0.125rem",
    2: "0.25rem",
    3: "0.375rem",
    4: "0.5rem",
    5: "0.625rem",
    6: "0.75rem",
    8: "1rem",
    10: "1.25rem",
    12: "1.5rem",
  },
  default: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
  },
  spacious: {
    1: "0.375rem",
    2: "0.75rem",
    3: "1rem",
    4: "1.25rem",
    5: "1.5rem",
    6: "1.75rem",
    8: "2.5rem",
    10: "3rem",
    12: "3.5rem",
  },
};

// =============================================================================
// Component Token Types
// =============================================================================

/**
 * Component sizes
 */
export type ComponentSize = "sm" | "md" | "lg";

/**
 * Component token keys
 */
export type ComponentTokenKey =
  | `button-padding-${"x" | "y"}`
  | `button-height-${ComponentSize}`
  | `input-padding-${"x" | "y"}`
  | `input-height-${ComponentSize}`
  | "card-padding"
  | `list-item-padding-${"x" | "y"}`
  | `table-cell-padding-${"x" | "y"}`
  | `icon-size-${ComponentSize}`;

// =============================================================================
// CSS Variable Types
// =============================================================================

/**
 * Spacing CSS variable name
 */
export type SpacingCSSVariable = `--ds-spacing-${SpacingScale}`;

/**
 * Component CSS variable name
 */
export type ComponentCSSVariable = `--ds-${ComponentTokenKey}`;

/**
 * All density-related CSS variables
 */
export type DensityCSSVariable = SpacingCSSVariable | ComponentCSSVariable;

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get the CSS variable reference for a spacing token
 */
export function getSpacingVar(scale: SpacingScale): string {
  return `var(--ds-spacing-${scale})`;
}

/**
 * Get the CSS variable reference for a component token
 */
export function getComponentVar(key: ComponentTokenKey): string {
  return `var(--ds-${key})`;
}

/**
 * Get the data attribute selector for a density mode
 */
export function getDensitySelector(mode: DensityMode): string {
  if (mode === "default") {
    return ":root";
  }
  return `[data-density="${mode}"]`;
}
