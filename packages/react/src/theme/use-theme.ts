"use client";

/**
 * useTheme Hook
 *
 * React hook for accessing and modifying theme settings.
 *
 * @packageDocumentation
 */

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./theme-context.js";
import {
  type ColorMode,
  type Density,
  type ResolvedColorMode,
  type StorageKeys,
  type ThemeContextValue,
  DEFAULT_STORAGE_KEYS,
  THEME_ATTRIBUTES,
} from "./types.js";
import {
  getStoredColorMode,
  getStoredDensity,
  getSystemColorMode,
  subscribeToSystemColorMode,
  syncThemeStorage,
} from "./storage.js";

/**
 * Hook to access theme context
 *
 * @throws Error if used outside of ThemeProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { colorMode, setColorMode, density, setDensity } = useTheme();
 *
 *   return (
 *     <div>
 *       <p>Current mode: {colorMode}</p>
 *       <button onClick={() => setColorMode('dark')}>Dark</button>
 *       <button onClick={() => setDensity('compact')}>Compact</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Options for useThemeState hook
 */
export interface UseThemeStateOptions {
  /** Default color mode */
  defaultColorMode?: ColorMode;
  /** Default density */
  defaultDensity?: Density;
  /** Storage keys */
  storageKeys?: StorageKeys;
  /** Whether to sync to DOM attributes */
  syncToDOM?: boolean;
  /** Attribute names for DOM sync */
  attributes?: {
    colorMode?: string;
    density?: string;
  };
}

/**
 * Low-level hook for managing theme state
 *
 * This hook manages the theme state internally and can be used
 * to build custom ThemeProvider implementations.
 *
 * @example
 * ```tsx
 * function CustomThemeProvider({ children }) {
 *   const themeState = useThemeState({
 *     defaultColorMode: 'system',
 *     defaultDensity: 'default',
 *   });
 *
 *   return (
 *     <ThemeContext.Provider value={themeState}>
 *       {children}
 *     </ThemeContext.Provider>
 *   );
 * }
 * ```
 */
export function useThemeState(
  options: UseThemeStateOptions = {}
): ThemeContextValue {
  const {
    defaultColorMode = "system",
    defaultDensity = "default",
    storageKeys = DEFAULT_STORAGE_KEYS,
    syncToDOM = true,
    attributes = THEME_ATTRIBUTES,
  } = options;

  // Initialize from storage or defaults
  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    if (typeof window === "undefined") return defaultColorMode;
    return getStoredColorMode(storageKeys);
  });

  const [density, setDensityState] = useState<Density>(() => {
    if (typeof window === "undefined") return defaultDensity;
    return getStoredDensity(storageKeys);
  });

  const [systemColorMode, setSystemColorMode] = useState<ResolvedColorMode>(
    () => {
      if (typeof window === "undefined") return "light";
      return getSystemColorMode();
    }
  );

  // Resolve the actual color mode
  const resolvedColorMode: ResolvedColorMode = useMemo(() => {
    if (colorMode === "system") {
      return systemColorMode;
    }
    return colorMode;
  }, [colorMode, systemColorMode]);

  // Subscribe to system color mode changes
  useEffect(() => {
    return subscribeToSystemColorMode((mode) => {
      setSystemColorMode(mode);
    });
  }, []);

  // Sync to DOM attributes
  useEffect(() => {
    if (!syncToDOM || typeof document === "undefined") return;

    const colorModeAttr = attributes.colorMode ?? THEME_ATTRIBUTES.colorMode;
    const densityAttr = attributes.density ?? THEME_ATTRIBUTES.density;

    document.documentElement.setAttribute(colorModeAttr, resolvedColorMode);
    document.documentElement.setAttribute(densityAttr, density);
  }, [resolvedColorMode, density, syncToDOM, attributes]);

  // Set color mode with storage sync
  const setColorMode = useCallback(
    (mode: ColorMode) => {
      setColorModeState(mode);
      syncThemeStorage({ colorMode: mode }, storageKeys);
    },
    [storageKeys]
  );

  // Set density with storage sync
  const setDensity = useCallback(
    (newDensity: Density) => {
      setDensityState(newDensity);
      syncThemeStorage({ density: newDensity }, storageKeys);
    },
    [storageKeys]
  );

  // Toggle between light and dark
  const toggleColorMode = useCallback(() => {
    const newMode = resolvedColorMode === "light" ? "dark" : "light";
    setColorMode(newMode);
  }, [resolvedColorMode, setColorMode]);

  return useMemo(
    () => ({
      colorMode,
      resolvedColorMode,
      density,
      setColorMode,
      setDensity,
      toggleColorMode,
    }),
    [colorMode, resolvedColorMode, density, setColorMode, setDensity, toggleColorMode]
  );
}

/**
 * Hook to get only the resolved color mode
 *
 * @example
 * ```tsx
 * function ThemedIcon() {
 *   const colorMode = useColorMode();
 *   return <Icon name={colorMode === 'dark' ? 'moon' : 'sun'} />;
 * }
 * ```
 */
export function useColorMode(): ResolvedColorMode {
  const { resolvedColorMode } = useTheme();
  return resolvedColorMode;
}

/**
 * Hook to get only the density setting
 *
 * @example
 * ```tsx
 * function DenseTable() {
 *   const density = useDensity();
 *   return <Table compact={density === 'compact'} />;
 * }
 * ```
 */
export function useDensity(): Density {
  const { density } = useTheme();
  return density;
}
