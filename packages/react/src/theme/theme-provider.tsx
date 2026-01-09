"use client";

/**
 * Theme Provider
 *
 * React context provider for theme and density settings.
 *
 * @packageDocumentation
 */

import type { ReactNode } from "react";
import { ThemeContext } from "./theme-context.js";
import type { ColorMode, Density, StorageKeys } from "./types.js";
import { DEFAULT_STORAGE_KEYS, THEME_ATTRIBUTES } from "./types.js";
import { useThemeState } from "./use-theme.js";

/**
 * Props for ThemeProvider
 */
export interface ThemeProviderProps {
  /** Child components */
  children: ReactNode;
  /** Default color mode */
  defaultColorMode?: ColorMode;
  /** Default density */
  defaultDensity?: Density;
  /** Storage keys for persistence */
  storageKeys?: StorageKeys;
  /** Whether to sync theme to DOM attributes (default: true) */
  syncToDOM?: boolean;
  /** Custom attribute names */
  attributes?: {
    colorMode?: string;
    density?: string;
  };
  /** Forced color mode (disables user preference) */
  forcedColorMode?: ColorMode;
  /** Forced density (disables user preference) */
  forcedDensity?: Density;
}

/**
 * Theme Provider Component
 *
 * Provides theme context to the component tree. Handles:
 * - Color mode (light/dark/system)
 * - Density (compact/default/spacious)
 * - Persistence to localStorage/cookies
 * - System color mode detection
 * - DOM attribute synchronization
 *
 * @example
 * ```tsx
 * // Basic usage
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <MyApp />
 *     </ThemeProvider>
 *   );
 * }
 *
 * // With custom defaults
 * function App() {
 *   return (
 *     <ThemeProvider
 *       defaultColorMode="dark"
 *       defaultDensity="compact"
 *     >
 *       <MyApp />
 *     </ThemeProvider>
 *   );
 * }
 *
 * // In Next.js App Router
 * // app/layout.tsx
 * import { ThemeProvider, getThemeScriptProps } from '@ds/react/theme';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <script {...getThemeScriptProps()} />
 *       </head>
 *       <body>
 *         <ThemeProvider>{children}</ThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ThemeProvider({
  children,
  defaultColorMode = "system",
  defaultDensity = "default",
  storageKeys = DEFAULT_STORAGE_KEYS,
  syncToDOM = true,
  attributes = THEME_ATTRIBUTES,
  forcedColorMode,
  forcedDensity,
}: ThemeProviderProps): JSX.Element {
  const themeState = useThemeState({
    defaultColorMode: forcedColorMode ?? defaultColorMode,
    defaultDensity: forcedDensity ?? defaultDensity,
    storageKeys,
    syncToDOM,
    attributes,
  });

  // Override with forced values if provided
  const contextValue =
    forcedColorMode || forcedDensity
      ? {
          ...themeState,
          ...(forcedColorMode && {
            colorMode: forcedColorMode,
            resolvedColorMode:
              forcedColorMode === "system"
                ? themeState.resolvedColorMode
                : forcedColorMode,
          }),
          ...(forcedDensity && { density: forcedDensity }),
        }
      : themeState;

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.displayName = "ThemeProvider";
