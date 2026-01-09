/**
 * Density System Types
 *
 * Feature: 022-ds-quality-overhaul
 * This contract defines the density system for compact/default/spacious modes.
 */

// =============================================================================
// Core Types
// =============================================================================

/**
 * Available density modes
 */
export type DensityMode = "compact" | "default" | "spacious";

/**
 * Density scale multipliers (relative to default = 1)
 */
export const DensityScales: Record<DensityMode, number> = {
  compact: 0.875,
  default: 1,
  spacious: 1.125,
};

// =============================================================================
// Token Structures
// =============================================================================

/**
 * Spacing tokens for a density mode
 * All values in rem (relative units for proper scaling)
 */
export interface DensitySpacingTokens {
  /** 0.25rem at default */
  1: string;
  /** 0.5rem at default */
  2: string;
  /** 0.75rem at default */
  3: string;
  /** 1rem at default */
  4: string;
  /** 1.25rem at default */
  5: string;
  /** 1.5rem at default */
  6: string;
  /** 2rem at default */
  8: string;
  /** 2.5rem at default */
  10: string;
  /** 3rem at default */
  12: string;
}

/**
 * Component-specific density tokens
 */
export interface DensityComponentTokens {
  /** Button horizontal padding */
  "button-padding-x": string;
  /** Button vertical padding */
  "button-padding-y": string;
  /** Button min height */
  "button-height-sm": string;
  "button-height-md": string;
  "button-height-lg": string;

  /** Input horizontal padding */
  "input-padding-x": string;
  /** Input vertical padding */
  "input-padding-y": string;
  /** Input heights by size */
  "input-height-sm": string;
  "input-height-md": string;
  "input-height-lg": string;

  /** Card padding */
  "card-padding": string;

  /** List item padding */
  "list-item-padding-x": string;
  "list-item-padding-y": string;

  /** Table cell padding */
  "table-cell-padding-x": string;
  "table-cell-padding-y": string;

  /** Icon sizes */
  "icon-size-sm": string;
  "icon-size-md": string;
  "icon-size-lg": string;
}

/**
 * Complete density token set
 */
export interface DensityTokenSet {
  mode: DensityMode;
  spacing: DensitySpacingTokens;
  component: DensityComponentTokens;
}

// =============================================================================
// Default Values
// =============================================================================

/**
 * Compact density tokens
 */
export const CompactDensity: DensityTokenSet = {
  mode: "compact",
  spacing: {
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
  component: {
    "button-padding-x": "0.75rem",
    "button-padding-y": "0.25rem",
    "button-height-sm": "1.5rem",
    "button-height-md": "1.75rem",
    "button-height-lg": "2rem",

    "input-padding-x": "0.5rem",
    "input-padding-y": "0.25rem",
    "input-height-sm": "1.5rem",
    "input-height-md": "1.75rem",
    "input-height-lg": "2rem",

    "card-padding": "0.75rem",

    "list-item-padding-x": "0.5rem",
    "list-item-padding-y": "0.25rem",

    "table-cell-padding-x": "0.5rem",
    "table-cell-padding-y": "0.25rem",

    "icon-size-sm": "0.875rem",
    "icon-size-md": "1rem",
    "icon-size-lg": "1.25rem",
  },
};

/**
 * Default density tokens
 */
export const DefaultDensity: DensityTokenSet = {
  mode: "default",
  spacing: {
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
  component: {
    "button-padding-x": "1rem",
    "button-padding-y": "0.5rem",
    "button-height-sm": "2rem",
    "button-height-md": "2.25rem",
    "button-height-lg": "2.75rem",

    "input-padding-x": "0.75rem",
    "input-padding-y": "0.5rem",
    "input-height-sm": "2rem",
    "input-height-md": "2.25rem",
    "input-height-lg": "2.75rem",

    "card-padding": "1.5rem",

    "list-item-padding-x": "0.75rem",
    "list-item-padding-y": "0.5rem",

    "table-cell-padding-x": "1rem",
    "table-cell-padding-y": "0.75rem",

    "icon-size-sm": "1rem",
    "icon-size-md": "1.25rem",
    "icon-size-lg": "1.5rem",
  },
};

/**
 * Spacious density tokens
 */
export const SpaciousDensity: DensityTokenSet = {
  mode: "spacious",
  spacing: {
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
  component: {
    "button-padding-x": "1.25rem",
    "button-padding-y": "0.625rem",
    "button-height-sm": "2.25rem",
    "button-height-md": "2.75rem",
    "button-height-lg": "3.25rem",

    "input-padding-x": "1rem",
    "input-padding-y": "0.625rem",
    "input-height-sm": "2.25rem",
    "input-height-md": "2.75rem",
    "input-height-lg": "3.25rem",

    "card-padding": "2rem",

    "list-item-padding-x": "1rem",
    "list-item-padding-y": "0.75rem",

    "table-cell-padding-x": "1.25rem",
    "table-cell-padding-y": "1rem",

    "icon-size-sm": "1.25rem",
    "icon-size-md": "1.5rem",
    "icon-size-lg": "1.75rem",
  },
};

// =============================================================================
// Color Mode Types
// =============================================================================

/**
 * Color mode options
 */
export type ColorMode = "light" | "dark" | "system";

/**
 * Resolved color mode (what's actually applied)
 */
export type ResolvedColorMode = "light" | "dark";

// =============================================================================
// Unified Theme Provider Types
// =============================================================================

/**
 * Theme context value - combines color mode and density
 */
export interface ThemeContextValue {
  /** Current color mode setting */
  colorMode: ColorMode;
  /** Resolved color mode (system resolved to light/dark) */
  resolvedColorMode: ResolvedColorMode;
  /** Function to change color mode */
  setColorMode: (mode: ColorMode) => void;
  /** Current density mode */
  density: DensityMode;
  /** Function to change density */
  setDensity: (density: DensityMode) => void;
}

/**
 * Storage strategy for persisting user preferences
 */
export type StorageStrategy = "localStorage" | "cookie" | "none";

/**
 * Theme provider props - the root application wrapper
 */
export interface ThemeProviderProps {
  /** Child components */
  children: React.ReactNode;

  // --- Color Mode ---
  /** Default color mode (used when no stored preference) */
  defaultColorMode?: ColorMode;
  /** Controlled color mode (overrides stored preference) */
  colorMode?: ColorMode;
  /** Callback when color mode changes */
  onColorModeChange?: (mode: ColorMode) => void;

  // --- Density ---
  /** Default density mode (used when no stored preference) */
  defaultDensity?: DensityMode;
  /** Controlled density (overrides stored preference) */
  density?: DensityMode;
  /** Callback when density changes */
  onDensityChange?: (density: DensityMode) => void;

  // --- Persistence ---
  /**
   * How to persist user preferences.
   * - "localStorage": Client-only, causes hydration flash
   * - "cookie": SSR-safe, server can read initial value
   * - "none": No persistence, use controlled mode
   * @default "localStorage"
   */
  storageStrategy?: StorageStrategy;

  /**
   * Storage key prefix for localStorage/cookie names
   * @default "ds-theme"
   */
  storageKey?: string;

  /**
   * Cookie options (when storageStrategy is "cookie")
   */
  cookieOptions?: {
    /** Cookie path @default "/" */
    path?: string;
    /** Cookie domain */
    domain?: string;
    /** Max age in seconds @default 31536000 (1 year) */
    maxAge?: number;
    /** SameSite attribute @default "lax" */
    sameSite?: "strict" | "lax" | "none";
  };

  // --- SSR ---
  /**
   * Initial values from server (e.g., parsed from cookie header).
   * Use this in Next.js/SSR to avoid hydration mismatch.
   */
  ssrValues?: {
    colorMode?: ColorMode;
    density?: DensityMode;
  };

  /**
   * Disable transition animations when theme changes.
   * Useful for initial load to prevent flash.
   * @default false
   */
  disableTransitionOnChange?: boolean;

  /**
   * CSS selector for the element to apply data attributes to.
   * @default ":root" (applies to <html>)
   */
  attribute?: {
    /** Element selector @default ":root" */
    selector?: string;
    /** Color mode attribute name @default "data-color-mode" */
    colorModeAttribute?: string;
    /** Density attribute name @default "data-density" */
    densityAttribute?: string;
  };

  // --- External Color Mode Integration (next-themes, etc.) ---
  /**
   * Disable built-in color mode management.
   * Use this when integrating with next-themes or another color mode library.
   * When true, ThemeProvider only manages density.
   * @default false
   */
  disableColorMode?: boolean;

  /**
   * Attribute name that external library uses for color mode.
   * Used to read current color mode from DOM when disableColorMode is true.
   * @default "data-theme" (next-themes default)
   */
  externalColorModeAttribute?: string;
}

// =============================================================================
// next-themes Integration
// =============================================================================

/**
 * Hook to read color mode from next-themes (or similar external library).
 * Use this when you have disableColorMode: true on ThemeProvider.
 *
 * @example
 * ```tsx
 * import { useTheme as useNextTheme } from "next-themes";
 * import { useExternalColorMode } from "@ds/react";
 *
 * // In your app setup
 * const { resolvedTheme } = useNextTheme();
 * const colorMode = useExternalColorMode(resolvedTheme);
 * // colorMode is now "light" | "dark" that DS components can use
 * ```
 */
export type ExternalColorModeResolver = (
  externalTheme: string | undefined
) => ResolvedColorMode;

/**
 * Props for integrating with next-themes
 */
export interface NextThemesIntegrationProps {
  /**
   * Wrap your app with both providers:
   *
   * @example
   * ```tsx
   * import { ThemeProvider as NextThemeProvider } from "next-themes";
   * import { ThemeProvider as DSProvider } from "@ds/react";
   *
   * function Providers({ children }) {
   *   return (
   *     <NextThemeProvider attribute="data-theme" defaultTheme="system">
   *       <DSProvider
   *         disableColorMode
   *         externalColorModeAttribute="data-theme"
   *         defaultDensity="default"
   *       >
   *         {children}
   *       </DSProvider>
   *     </NextThemeProvider>
   *   );
   * }
   * ```
   */
  example?: never;
}

// =============================================================================
// Standalone Density Provider (for density-only use cases)
// =============================================================================

/**
 * Density-only context value
 */
export interface DensityContextValue {
  /** Current density mode */
  density: DensityMode;
  /** Function to change density */
  setDensity: (density: DensityMode) => void;
}

/**
 * Density-only provider props (for nested density overrides)
 */
export interface DensityProviderProps {
  /** Child components */
  children: React.ReactNode;
  /** Density mode for this subtree */
  density: DensityMode;
}

// =============================================================================
// Server-Side Utilities
// =============================================================================

/**
 * Parse theme preferences from cookie string (for SSR)
 *
 * @example Next.js App Router
 * ```ts
 * // app/layout.tsx
 * import { cookies } from "next/headers";
 * import { parseThemeCookie } from "@ds/react";
 *
 * export default function RootLayout({ children }) {
 *   const cookieStore = cookies();
 *   const themePrefs = parseThemeCookie(cookieStore.get("ds-theme")?.value);
 *
 *   return (
 *     <html data-color-mode={themePrefs.colorMode} data-density={themePrefs.density}>
 *       <body>
 *         <ThemeProvider ssrValues={themePrefs}>
 *           {children}
 *         </ThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export interface ThemeCookieValue {
  colorMode?: ColorMode;
  density?: DensityMode;
}

/**
 * Script to inject in <head> to prevent flash of wrong theme.
 * This runs before React hydration to set initial data attributes.
 *
 * @example Next.js
 * ```tsx
 * // app/layout.tsx
 * import { getThemeScript } from "@ds/react";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <script
 *           dangerouslySetInnerHTML={{
 *             __html: getThemeScript({ storageKey: "ds-theme" }),
 *           }}
 *         />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 */
export interface ThemeScriptOptions {
  /** Storage key prefix @default "ds-theme" */
  storageKey?: string;
  /** Default color mode @default "system" */
  defaultColorMode?: ColorMode;
  /** Default density @default "default" */
  defaultDensity?: DensityMode;
  /** Color mode attribute @default "data-color-mode" */
  colorModeAttribute?: string;
  /** Density attribute @default "data-density" */
  densityAttribute?: string;
}

// =============================================================================
// CSS Custom Properties
// =============================================================================

/**
 * CSS custom property names for density tokens
 */
export const DensityCSSProperties = {
  // Spacing
  spacing: (scale: keyof DensitySpacingTokens) => `--ds-spacing-${scale}`,

  // Component-specific
  buttonPaddingX: "--ds-button-padding-x",
  buttonPaddingY: "--ds-button-padding-y",
  buttonHeightSm: "--ds-button-height-sm",
  buttonHeightMd: "--ds-button-height-md",
  buttonHeightLg: "--ds-button-height-lg",

  inputPaddingX: "--ds-input-padding-x",
  inputPaddingY: "--ds-input-padding-y",
  inputHeightSm: "--ds-input-height-sm",
  inputHeightMd: "--ds-input-height-md",
  inputHeightLg: "--ds-input-height-lg",

  cardPadding: "--ds-card-padding",

  listItemPaddingX: "--ds-list-item-padding-x",
  listItemPaddingY: "--ds-list-item-padding-y",

  tableCellPaddingX: "--ds-table-cell-padding-x",
  tableCellPaddingY: "--ds-table-cell-padding-y",

  iconSizeSm: "--ds-icon-size-sm",
  iconSizeMd: "--ds-icon-size-md",
  iconSizeLg: "--ds-icon-size-lg",
} as const;

// =============================================================================
// Usage Examples
// =============================================================================

/**
 * @example Basic app setup with ThemeProvider
 * ```tsx
 * // app/providers.tsx
 * "use client";
 *
 * import { ThemeProvider } from "@ds/react";
 *
 * export function Providers({ children }: { children: React.ReactNode }) {
 *   return (
 *     <ThemeProvider
 *       defaultColorMode="system"
 *       defaultDensity="default"
 *       storageStrategy="localStorage"
 *     >
 *       {children}
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * @example SSR-safe setup with cookies (Next.js App Router)
 * ```tsx
 * // app/layout.tsx
 * import { cookies } from "next/headers";
 * import { ThemeProvider, parseThemeCookie, getThemeScript } from "@ds/react";
 *
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   // Read preferences from cookie on server
 *   const cookieStore = cookies();
 *   const themePrefs = parseThemeCookie(cookieStore.get("ds-theme")?.value);
 *
 *   return (
 *     <html
 *       data-color-mode={themePrefs.colorMode ?? "system"}
 *       data-density={themePrefs.density ?? "default"}
 *     >
 *       <head>
 *         {/* Inline script prevents flash of wrong theme */}
 *         <script
 *           dangerouslySetInnerHTML={{
 *             __html: getThemeScript({ storageKey: "ds-theme" }),
 *           }}
 *         />
 *       </head>
 *       <body>
 *         <ThemeProvider
 *           storageStrategy="cookie"
 *           ssrValues={themePrefs}
 *         >
 *           {children}
 *         </ThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @example Theme/density toggle component
 * ```tsx
 * import { useTheme } from "@ds/react";
 *
 * function ThemeToggle() {
 *   const { colorMode, setColorMode, density, setDensity } = useTheme();
 *
 *   return (
 *     <div>
 *       {/* Color mode toggle */}
 *       <select
 *         value={colorMode}
 *         onChange={(e) => setColorMode(e.target.value as ColorMode)}
 *       >
 *         <option value="system">System</option>
 *         <option value="light">Light</option>
 *         <option value="dark">Dark</option>
 *       </select>
 *
 *       {/* Density toggle */}
 *       <select
 *         value={density}
 *         onChange={(e) => setDensity(e.target.value as DensityMode)}
 *       >
 *         <option value="compact">Compact</option>
 *         <option value="default">Default</option>
 *         <option value="spacious">Spacious</option>
 *       </select>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Nested density override
 * ```tsx
 * // Main app uses default density, but sidebar is compact
 * <ThemeProvider defaultDensity="default">
 *   <MainLayout>
 *     <DensityProvider density="compact">
 *       <Sidebar /> {/* Compact density */}
 *     </DensityProvider>
 *     <MainContent /> {/* Default density */}
 *   </MainLayout>
 * </ThemeProvider>
 * ```
 *
 * @example Controlled mode (external state management)
 * ```tsx
 * // When you need full control (e.g., storing in Redux, Zustand, etc.)
 * function App() {
 *   const [colorMode, setColorMode] = useMyStore((s) => [s.colorMode, s.setColorMode]);
 *   const [density, setDensity] = useMyStore((s) => [s.density, s.setDensity]);
 *
 *   return (
 *     <ThemeProvider
 *       colorMode={colorMode}
 *       onColorModeChange={setColorMode}
 *       density={density}
 *       onDensityChange={setDensity}
 *       storageStrategy="none" // Don't persist, we handle it
 *     >
 *       <App />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * @example CSS responds to data attributes
 * ```css
 * /* Density-aware component */
 * .my-component {
 *   padding: var(--ds-spacing-4);
 *   gap: var(--ds-spacing-2);
 * }
 *
 * /* Color mode-aware styles */
 * [data-color-mode="dark"] .my-component {
 *   background: var(--ds-color-neutral-2);
 * }
 *
 * /* Or use CSS variables that change with color mode */
 * .my-component {
 *   background: var(--ds-color-neutral-2); /* Auto-switches in dark mode */
 * }
 * ```
 *
 * @example HTML data attributes (set by ThemeProvider)
 * ```html
 * <html data-color-mode="dark" data-density="compact">
 *   <!-- All CSS variables respond to these attributes -->
 * </html>
 * ```
 *
 * @example Integration with next-themes (recommended for Next.js)
 * ```tsx
 * // app/providers.tsx
 * "use client";
 *
 * import { ThemeProvider as NextThemeProvider } from "next-themes";
 * import { ThemeProvider as DSProvider } from "@ds/react";
 *
 * export function Providers({ children }: { children: React.ReactNode }) {
 *   return (
 *     // next-themes handles color mode (light/dark/system)
 *     <NextThemeProvider
 *       attribute="data-theme"
 *       defaultTheme="system"
 *       enableSystem
 *     >
 *       {/* DS provider handles density only */}
 *       <DSProvider
 *         disableColorMode              // Don't manage color mode
 *         externalColorModeAttribute="data-theme"  // Read from next-themes
 *         defaultDensity="default"
 *         storageStrategy="localStorage"
 *       >
 *         {children}
 *       </DSProvider>
 *     </NextThemeProvider>
 *   );
 * }
 * ```
 *
 * @example Using both theme hooks together
 * ```tsx
 * import { useTheme as useNextTheme } from "next-themes";
 * import { useTheme as useDSTheme } from "@ds/react";
 *
 * function SettingsPanel() {
 *   // Color mode from next-themes
 *   const { theme, setTheme, resolvedTheme } = useNextTheme();
 *
 *   // Density from DS
 *   const { density, setDensity } = useDSTheme();
 *
 *   return (
 *     <div>
 *       <label>
 *         Color Mode
 *         <select value={theme} onChange={(e) => setTheme(e.target.value)}>
 *           <option value="system">System</option>
 *           <option value="light">Light</option>
 *           <option value="dark">Dark</option>
 *         </select>
 *       </label>
 *
 *       <label>
 *         Density
 *         <select
 *           value={density}
 *           onChange={(e) => setDensity(e.target.value as DensityMode)}
 *         >
 *           <option value="compact">Compact</option>
 *           <option value="default">Default</option>
 *           <option value="spacious">Spacious</option>
 *         </select>
 *       </label>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example CSS tokens work with next-themes attribute
 * ```css
 * /* DS color tokens respond to data-theme (next-themes) */
 * [data-theme="dark"] {
 *   --ds-color-neutral-1: oklch(0.15 0 0);
 *   --ds-color-neutral-2: oklch(0.18 0 0);
 *   /* ... all color tokens swap for dark mode */
 * }
 *
 * /* Density tokens respond to data-density (DS provider) */
 * [data-density="compact"] {
 *   --ds-spacing-4: 0.5rem;
 *   --ds-button-height-md: 1.75rem;
 *   /* ... all density tokens swap for compact */
 * }
 * ```
 */
