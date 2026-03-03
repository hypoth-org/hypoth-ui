/**
 * Theme utilities for the Web Components demo
 * Provides localStorage persistence with system preference fallback
 */

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ds-demo-theme';

/**
 * Get the current theme from localStorage or system preference
 */
export function getTheme(): Theme {
  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  // Fall back to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

/**
 * Set the theme and persist to localStorage
 */
export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
  dispatchThemeChange(theme);
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): void {
  const current = getTheme();
  setTheme(current === 'light' ? 'dark' : 'light');
}

/**
 * Initialize the theme on page load
 */
export function initializeTheme(): void {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Subscribe to theme changes
 */
export function onThemeChange(callback: (theme: Theme) => void): () => void {
  const handler = (event: CustomEvent<Theme>) => callback(event.detail);
  window.addEventListener('ds:theme-change', handler as EventListener);
  return () => window.removeEventListener('ds:theme-change', handler as EventListener);
}

/**
 * Dispatch theme change event
 */
function dispatchThemeChange(theme: Theme): void {
  window.dispatchEvent(new CustomEvent('ds:theme-change', { detail: theme }));
}

/**
 * Listen for system theme changes
 */
export function listenForSystemThemeChanges(): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (event: MediaQueryListEvent) => {
    // Only update if user hasn't explicitly set a preference
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(event.matches ? 'dark' : 'light');
    }
  };

  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}
