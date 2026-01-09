"use client";

/**
 * Density Provider
 *
 * Lightweight provider for density-only contexts.
 * Use this when you only need density control without color mode.
 *
 * @packageDocumentation
 */

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Density, DensityContextValue, StorageKeys } from "./types.js";
import { DEFAULT_STORAGE_KEYS, THEME_ATTRIBUTES } from "./types.js";
import { getStoredDensity, syncThemeStorage } from "./storage.js";

/**
 * Density context
 */
const DensityContext = createContext<DensityContextValue | null>(null);

DensityContext.displayName = "DensityContext";

/**
 * Props for DensityProvider
 */
export interface DensityProviderProps {
  /** Child components */
  children: ReactNode;
  /** Default density */
  defaultDensity?: Density;
  /** Storage keys for persistence */
  storageKeys?: StorageKeys;
  /** Whether to sync density to DOM attributes (default: true) */
  syncToDOM?: boolean;
  /** Custom attribute name for density */
  attribute?: string;
  /** Forced density value (disables user preference) */
  forcedDensity?: Density;
}

/**
 * Density Provider Component
 *
 * Provides density context to the component tree without color mode support.
 * Use this for sections that need independent density control.
 *
 * @example
 * ```tsx
 * // Make a data table section more compact
 * function DataSection() {
 *   return (
 *     <DensityProvider defaultDensity="compact">
 *       <DataTable data={data} />
 *     </DensityProvider>
 *   );
 * }
 *
 * // Force compact density for a specific area
 * function SidePanel() {
 *   return (
 *     <DensityProvider forcedDensity="compact">
 *       <Navigation />
 *       <FilterControls />
 *     </DensityProvider>
 *   );
 * }
 * ```
 */
export function DensityProvider({
  children,
  defaultDensity = "default",
  storageKeys = DEFAULT_STORAGE_KEYS,
  syncToDOM = true,
  attribute = THEME_ATTRIBUTES.density,
  forcedDensity,
}: DensityProviderProps): JSX.Element {
  const [density, setDensityState] = useState<Density>(() => {
    if (forcedDensity) return forcedDensity;
    if (typeof window === "undefined") return defaultDensity;
    return getStoredDensity(storageKeys);
  });

  // Sync to DOM attribute
  useEffect(() => {
    if (!syncToDOM || typeof document === "undefined") return;
    document.documentElement.setAttribute(attribute, density);
  }, [density, syncToDOM, attribute]);

  const setDensity = useCallback(
    (newDensity: Density) => {
      if (forcedDensity) return; // Ignore if forced
      setDensityState(newDensity);
      syncThemeStorage({ density: newDensity }, storageKeys);
    },
    [forcedDensity, storageKeys]
  );

  const contextValue = useMemo(
    () => ({
      density: forcedDensity ?? density,
      setDensity,
    }),
    [density, forcedDensity, setDensity]
  );

  return (
    <DensityContext.Provider value={contextValue}>
      {children}
    </DensityContext.Provider>
  );
}

DensityProvider.displayName = "DensityProvider";

/**
 * Hook to access density context from DensityProvider
 *
 * @throws Error if used outside of DensityProvider or ThemeProvider
 *
 * @example
 * ```tsx
 * function CompactToggle() {
 *   const { density, setDensity } = useDensityContext();
 *
 *   return (
 *     <button onClick={() => setDensity(density === 'compact' ? 'default' : 'compact')}>
 *       Toggle Compact Mode
 *     </button>
 *   );
 * }
 * ```
 */
export function useDensityContext(): DensityContextValue {
  const context = useContext(DensityContext);
  if (!context) {
    throw new Error(
      "useDensityContext must be used within a DensityProvider or ThemeProvider"
    );
  }
  return context;
}
