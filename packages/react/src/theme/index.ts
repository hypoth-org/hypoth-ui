/**
 * Theme System
 *
 * Provides theme (color mode) and density management for the design system.
 *
 * @packageDocumentation
 */

// Types
export type {
  ColorMode,
  Density,
  ResolvedColorMode,
  ThemeConfig,
  ResolvedTheme,
  ThemeContextValue,
  DensityContextValue,
  StorageKeys,
} from "./types.js";

export {
  DEFAULT_STORAGE_KEYS,
  DEFAULT_THEME,
  THEME_ATTRIBUTES,
} from "./types.js";

// Context
export { ThemeContext } from "./theme-context.js";

// Providers
export { ThemeProvider } from "./theme-provider.js";
export type { ThemeProviderProps } from "./theme-provider.js";

export { DensityProvider, useDensityContext } from "./density-provider.js";
export type { DensityProviderProps } from "./density-provider.js";

// Hooks
export {
  useTheme,
  useThemeState,
  useColorMode,
  useDensity,
} from "./use-theme.js";
export type { UseThemeStateOptions } from "./use-theme.js";

// Storage utilities
export {
  getStorageValue,
  setStorageValue,
  removeStorageValue,
  getStoredColorMode,
  setStoredColorMode,
  getStoredDensity,
  setStoredDensity,
  getStoredTheme,
  setStoredTheme,
  parseThemeCookie,
  parseCookies,
  setCookie,
  getCookie,
  deleteCookie,
  syncThemeStorage,
  getSystemColorMode,
  subscribeToSystemColorMode,
} from "./storage.js";

// Theme script utilities (for SSR)
export {
  getThemeScriptContent,
  getThemeScriptTag,
  getThemeScriptProps,
  getThemeScriptContentReadable,
} from "./theme-script.js";
export type {
  ThemeScriptOptions,
  ThemeScriptProps,
} from "./theme-script.js";
