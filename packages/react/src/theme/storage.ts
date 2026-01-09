/**
 * Theme Storage Utilities
 *
 * Persistence utilities for theme preferences using localStorage and cookies.
 * Supports both client-side storage and SSR-safe cookie parsing.
 *
 * @packageDocumentation
 */

import {
  type ColorMode,
  type Density,
  type ResolvedColorMode,
  type StorageKeys,
  type ThemeConfig,
  DEFAULT_STORAGE_KEYS,
  DEFAULT_THEME,
} from "./types.js";

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  if (!isBrowser()) return false;
  try {
    const testKey = "__ds_storage_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get a value from localStorage
 */
export function getStorageValue<T extends string>(
  key: string,
  defaultValue: T
): T {
  if (!isLocalStorageAvailable()) return defaultValue;
  try {
    const value = window.localStorage.getItem(key);
    return (value as T) ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Set a value in localStorage
 */
export function setStorageValue(key: string, value: string): void {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Silently fail (e.g., quota exceeded, private browsing)
  }
}

/**
 * Remove a value from localStorage
 */
export function removeStorageValue(key: string): void {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Silently fail
  }
}

/**
 * Get the stored color mode preference
 */
export function getStoredColorMode(
  keys: StorageKeys = DEFAULT_STORAGE_KEYS
): ColorMode {
  const value = getStorageValue<string>(keys.colorMode, "");
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return DEFAULT_THEME.colorMode;
}

/**
 * Set the color mode preference in storage
 */
export function setStoredColorMode(
  mode: ColorMode,
  keys: StorageKeys = DEFAULT_STORAGE_KEYS
): void {
  setStorageValue(keys.colorMode, mode);
}

/**
 * Get the stored density preference
 */
export function getStoredDensity(
  keys: StorageKeys = DEFAULT_STORAGE_KEYS
): Density {
  const value = getStorageValue<string>(keys.density, "");
  if (value === "compact" || value === "default" || value === "spacious") {
    return value;
  }
  return DEFAULT_THEME.density;
}

/**
 * Set the density preference in storage
 */
export function setStoredDensity(
  density: Density,
  keys: StorageKeys = DEFAULT_STORAGE_KEYS
): void {
  setStorageValue(keys.density, density);
}

/**
 * Get stored theme configuration
 */
export function getStoredTheme(
  keys: StorageKeys = DEFAULT_STORAGE_KEYS
): ThemeConfig {
  return {
    colorMode: getStoredColorMode(keys),
    density: getStoredDensity(keys),
  };
}

/**
 * Set theme configuration in storage
 */
export function setStoredTheme(
  theme: Partial<ThemeConfig>,
  keys: StorageKeys = DEFAULT_STORAGE_KEYS
): void {
  if (theme.colorMode !== undefined) {
    setStoredColorMode(theme.colorMode, keys);
  }
  if (theme.density !== undefined) {
    setStoredDensity(theme.density, keys);
  }
}

// --- Cookie Utilities for SSR ---

/**
 * Parse cookies from a cookie string
 */
export function parseCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieString) return cookies;

  for (const pair of cookieString.split(";")) {
    const [key, ...valueParts] = pair.split("=");
    const trimmedKey = key?.trim();
    if (trimmedKey) {
      cookies[trimmedKey] = decodeURIComponent(valueParts.join("=").trim());
    }
  }

  return cookies;
}

/**
 * Parse theme from cookie string (for SSR)
 *
 * @param cookieString - The cookie header string from the request
 * @param keys - Storage keys to look for
 * @returns Parsed theme configuration
 *
 * @example
 * ```ts
 * // In Next.js App Router
 * import { cookies } from 'next/headers';
 *
 * export default function Layout({ children }) {
 *   const cookieStore = cookies();
 *   const theme = parseThemeCookie(cookieStore.toString());
 *   return (
 *     <html data-theme={theme.colorMode} data-density={theme.density}>
 *       ...
 *     </html>
 *   );
 * }
 * ```
 */
export function parseThemeCookie(
  cookieString: string,
  keys: StorageKeys = DEFAULT_STORAGE_KEYS
): ThemeConfig {
  const cookies = parseCookies(cookieString);

  let colorMode: ColorMode = DEFAULT_THEME.colorMode;
  let density: Density = DEFAULT_THEME.density;

  const colorModeValue = cookies[keys.colorMode];
  if (
    colorModeValue === "light" ||
    colorModeValue === "dark" ||
    colorModeValue === "system"
  ) {
    colorMode = colorModeValue;
  }

  const densityValue = cookies[keys.density];
  if (
    densityValue === "compact" ||
    densityValue === "default" ||
    densityValue === "spacious"
  ) {
    density = densityValue;
  }

  return { colorMode, density };
}

/**
 * Set a cookie (client-side only)
 */
export function setCookie(
  name: string,
  value: string,
  days = 365
): void {
  if (!isBrowser()) return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get a cookie value (client-side only)
 */
export function getCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const cookies = parseCookies(document.cookie);
  return cookies[name] ?? null;
}

/**
 * Delete a cookie (client-side only)
 */
export function deleteCookie(name: string): void {
  if (!isBrowser()) return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

/**
 * Sync theme to both localStorage and cookies
 * This ensures SSR can read the theme from cookies while
 * client-side code can use localStorage for faster access.
 */
export function syncThemeStorage(
  theme: Partial<ThemeConfig>,
  keys: StorageKeys = DEFAULT_STORAGE_KEYS
): void {
  // Store in localStorage
  setStoredTheme(theme, keys);

  // Also store in cookies for SSR
  if (theme.colorMode !== undefined) {
    setCookie(keys.colorMode, theme.colorMode);
  }
  if (theme.density !== undefined) {
    setCookie(keys.density, theme.density);
  }
}

// --- System Color Mode Detection ---

/**
 * Get the system color mode preference
 */
export function getSystemColorMode(): ResolvedColorMode {
  if (!isBrowser()) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Subscribe to system color mode changes
 *
 * @param callback - Called when system color mode changes
 * @returns Cleanup function to unsubscribe
 */
export function subscribeToSystemColorMode(
  callback: (mode: ResolvedColorMode) => void
): () => void {
  if (!isBrowser()) return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? "dark" : "light");
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }

  // Legacy browsers
  mediaQuery.addListener(handler);
  return () => mediaQuery.removeListener(handler);
}
