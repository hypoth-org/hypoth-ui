/**
 * Theme Script Utilities
 *
 * Generates inline scripts to prevent flash of unstyled content (FOUC)
 * when using theme preferences stored in localStorage/cookies.
 *
 * @packageDocumentation
 */

import {
  type StorageKeys,
  DEFAULT_STORAGE_KEYS,
  THEME_ATTRIBUTES,
} from "./types.js";

/**
 * Options for the theme script
 */
export interface ThemeScriptOptions {
  /** Storage keys for theme values */
  storageKeys?: StorageKeys;
  /** Default color mode if none stored */
  defaultColorMode?: "light" | "dark" | "system";
  /** Default density if none stored */
  defaultDensity?: "compact" | "default" | "spacious";
  /** Attribute names for theme */
  attributes?: {
    colorMode?: string;
    density?: string;
  };
  /** Enable cookie fallback for SSR */
  useCookies?: boolean;
}

/**
 * Generate the theme initialization script content
 *
 * This script runs synchronously before React hydrates, preventing FOUC.
 * It reads from localStorage (and optionally cookies) and sets data attributes.
 */
export function getThemeScriptContent(options: ThemeScriptOptions = {}): string {
  const {
    storageKeys = DEFAULT_STORAGE_KEYS,
    defaultColorMode = "system",
    defaultDensity = "default",
    attributes = THEME_ATTRIBUTES,
    useCookies = true,
  } = options;

  const colorModeAttr = attributes.colorMode ?? THEME_ATTRIBUTES.colorMode;
  const densityAttr = attributes.density ?? THEME_ATTRIBUTES.density;

  // Minified inline script
  return `(function(){try{var d=document.documentElement,s=localStorage,c=document.cookie;var cm=s.getItem("${storageKeys.colorMode}")||${useCookies ? `(c.match(/${storageKeys.colorMode}=([^;]+)/)||[])[1]` : '""'}||"${defaultColorMode}";var dn=s.getItem("${storageKeys.density}")||${useCookies ? `(c.match(/${storageKeys.density}=([^;]+)/)||[])[1]` : '""'}||"${defaultDensity}";if(cm==="system"){cm=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"}d.setAttribute("${colorModeAttr}",cm);d.setAttribute("${densityAttr}",dn)}catch(e){}})()`;
}

/**
 * Generate a script element string for inclusion in HTML head
 *
 * @example
 * ```tsx
 * // In Next.js App Router layout.tsx
 * import { getThemeScriptTag } from '@ds/react/theme';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <script dangerouslySetInnerHTML={{ __html: getThemeScriptTag() }} />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 */
export function getThemeScriptTag(options: ThemeScriptOptions = {}): string {
  return getThemeScriptContent(options);
}

/**
 * React component props for ThemeScript
 */
export interface ThemeScriptProps extends ThemeScriptOptions {
  /** Nonce for CSP (Content Security Policy) */
  nonce?: string;
}

/**
 * Get props for a script element
 *
 * @example
 * ```tsx
 * import { getThemeScriptProps } from '@ds/react/theme';
 *
 * function Head() {
 *   const scriptProps = getThemeScriptProps({ nonce: 'abc123' });
 *   return <script {...scriptProps} />;
 * }
 * ```
 */
export function getThemeScriptProps(
  options: ThemeScriptProps = {}
): { dangerouslySetInnerHTML: { __html: string }; nonce?: string } {
  const { nonce, ...scriptOptions } = options;
  return {
    dangerouslySetInnerHTML: { __html: getThemeScriptContent(scriptOptions) },
    ...(nonce ? { nonce } : {}),
  };
}

/**
 * Readable/expanded version of the theme script for debugging
 */
export function getThemeScriptContentReadable(
  options: ThemeScriptOptions = {}
): string {
  const {
    storageKeys = DEFAULT_STORAGE_KEYS,
    defaultColorMode = "system",
    defaultDensity = "default",
    attributes = THEME_ATTRIBUTES,
    useCookies = true,
  } = options;

  const colorModeAttr = attributes.colorMode ?? THEME_ATTRIBUTES.colorMode;
  const densityAttr = attributes.density ?? THEME_ATTRIBUTES.density;

  return `
(function() {
  try {
    var doc = document.documentElement;
    var storage = localStorage;
    var cookies = document.cookie;

    // Get color mode from localStorage or cookies
    var colorMode = storage.getItem("${storageKeys.colorMode}")
      ${useCookies ? `|| (cookies.match(/${storageKeys.colorMode}=([^;]+)/) || [])[1]` : ""}
      || "${defaultColorMode}";

    // Get density from localStorage or cookies
    var density = storage.getItem("${storageKeys.density}")
      ${useCookies ? `|| (cookies.match(/${storageKeys.density}=([^;]+)/) || [])[1]` : ""}
      || "${defaultDensity}";

    // Resolve "system" to actual color mode
    if (colorMode === "system") {
      colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    // Set attributes on document element
    doc.setAttribute("${colorModeAttr}", colorMode);
    doc.setAttribute("${densityAttr}", density);
  } catch (e) {
    // Silently fail if localStorage is not available
  }
})();
`.trim();
}
