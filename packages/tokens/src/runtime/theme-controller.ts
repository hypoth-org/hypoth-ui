/**
 * Theme Controller
 * Runtime utilities for mode and brand switching
 */

/** Theme mode values */
export type ThemeMode = 'light' | 'dark' | 'high-contrast' | 'reduced-motion';

/** localStorage keys */
const MODE_STORAGE_KEY = 'ds-mode';
const BRAND_STORAGE_KEY = 'ds-brand';

/**
 * Get the current theme mode
 */
export function getMode(): ThemeMode | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.documentElement.dataset.mode as ThemeMode | undefined;
}

/**
 * Set the theme mode
 * Updates DOM and persists to localStorage
 */
export function setMode(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;

  document.documentElement.dataset.mode = mode;

  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // localStorage not available
  }
}

/**
 * Toggle between light and dark mode
 */
export function toggleMode(): ThemeMode {
  const current = getMode();
  const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
  setMode(next);
  return next;
}

/**
 * Clear mode preference (use system default)
 */
export function clearMode(): void {
  if (typeof document === 'undefined') return;

  delete document.documentElement.dataset.mode;

  try {
    localStorage.removeItem(MODE_STORAGE_KEY);
  } catch {
    // localStorage not available
  }
}

/**
 * Get the current brand
 */
export function getBrand(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.documentElement.dataset.brand;
}

/**
 * Set the brand
 * Updates DOM and persists to localStorage
 */
export function setBrand(brand: string): void {
  if (typeof document === 'undefined') return;

  document.documentElement.dataset.brand = brand;

  try {
    localStorage.setItem(BRAND_STORAGE_KEY, brand);
  } catch {
    // localStorage not available
  }
}

/**
 * Clear brand preference (use default brand)
 */
export function clearBrand(): void {
  if (typeof document === 'undefined') return;

  delete document.documentElement.dataset.brand;

  try {
    localStorage.removeItem(BRAND_STORAGE_KEY);
  } catch {
    // localStorage not available
  }
}

/**
 * Check if system prefers dark mode
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Check if system prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if system prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: more)').matches;
}

/**
 * Subscribe to system color scheme changes
 */
export function onColorSchemeChange(callback: (isDark: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => callback(e.matches);

  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}

/**
 * Subscribe to mode changes
 */
export function onModeChange(callback: (mode: ThemeMode | undefined) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'data-mode') {
        callback(getMode());
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-mode'],
  });

  return () => observer.disconnect();
}

/**
 * Subscribe to brand changes
 */
export function onBrandChange(callback: (brand: string | undefined) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'data-brand') {
        callback(getBrand());
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-brand'],
  });

  return () => observer.disconnect();
}
