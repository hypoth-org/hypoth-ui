/**
 * Theme System Types
 *
 * Type definitions for the theme and density system.
 *
 * @packageDocumentation
 */

/**
 * Color mode (light or dark theme)
 */
export type ColorMode = "light" | "dark" | "system";

/**
 * Resolved color mode (excludes "system")
 */
export type ResolvedColorMode = "light" | "dark";

/**
 * Density mode for component sizing
 */
export type Density = "compact" | "default" | "spacious";

/**
 * Theme configuration
 */
export interface ThemeConfig {
  /** Color mode preference */
  colorMode: ColorMode;
  /** Density preference */
  density: Density;
}

/**
 * Resolved theme values (after resolving "system" to actual mode)
 */
export interface ResolvedTheme {
  /** Resolved color mode */
  colorMode: ResolvedColorMode;
  /** Density setting */
  density: Density;
}

/**
 * Theme context value
 */
export interface ThemeContextValue {
  /** Current color mode setting (may be "system") */
  colorMode: ColorMode;
  /** Resolved color mode (never "system") */
  resolvedColorMode: ResolvedColorMode;
  /** Current density setting */
  density: Density;
  /** Set the color mode */
  setColorMode: (mode: ColorMode) => void;
  /** Set the density */
  setDensity: (density: Density) => void;
  /** Toggle between light and dark (ignores system) */
  toggleColorMode: () => void;
}

/**
 * Density context value (subset of theme for density-only use)
 */
export interface DensityContextValue {
  /** Current density setting */
  density: Density;
  /** Set the density */
  setDensity: (density: Density) => void;
}

/**
 * Storage key configuration
 */
export interface StorageKeys {
  /** Key for color mode storage */
  colorMode: string;
  /** Key for density storage */
  density: string;
}

/**
 * Default storage keys
 */
export const DEFAULT_STORAGE_KEYS: StorageKeys = {
  colorMode: "ds-color-mode",
  density: "ds-density",
};

/**
 * Default theme configuration
 */
export const DEFAULT_THEME: ThemeConfig = {
  colorMode: "system",
  density: "default",
};

/**
 * CSS attribute names for theme
 */
export const THEME_ATTRIBUTES = {
  colorMode: "data-theme",
  density: "data-density",
} as const;
