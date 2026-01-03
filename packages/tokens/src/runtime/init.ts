/**
 * Theme Initialization Script
 * Blocking script to prevent theme flash on page load
 * Should be included in <head> before stylesheets
 */

/** Default mode when no preference is set */
const DEFAULT_MODE = "light";

/** localStorage key for persisted mode */
const MODE_STORAGE_KEY = "ds-mode";

/** localStorage key for persisted brand */
const BRAND_STORAGE_KEY = "ds-brand";

/**
 * Initialize theme on page load
 * This function should run as early as possible (blocking)
 */
export function initTheme(): void {
  // Skip if not in browser
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const root = document.documentElement;

  // Initialize mode
  const mode = getInitialMode();
  root.dataset.mode = mode;

  // Initialize brand (if persisted)
  const brand = getPersistedBrand();
  if (brand) {
    root.dataset.brand = brand;
  }
}

/**
 * Get the initial mode based on user preference
 * Priority: persisted > system preference > default
 */
function getInitialMode(): string {
  // Check for persisted preference
  const persisted = getPersistedMode();
  if (persisted) {
    return persisted;
  }

  // Check system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  // Check high contrast preference
  if (window.matchMedia("(prefers-contrast: more)").matches) {
    return "high-contrast";
  }

  return DEFAULT_MODE;
}

/**
 * Get persisted mode from localStorage
 */
function getPersistedMode(): string | null {
  try {
    return localStorage.getItem(MODE_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Get persisted brand from localStorage
 */
function getPersistedBrand(): string | null {
  try {
    return localStorage.getItem(BRAND_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Generate inline script for blocking theme initialization
 * Use this in your HTML <head>
 */
export function getInitScript(): string {
  return `(function(){
  var root = document.documentElement;
  var mode = (function() {
    try {
      var stored = localStorage.getItem('${MODE_STORAGE_KEY}');
      if (stored) return stored;
    } catch(e) {}
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    if (window.matchMedia('(prefers-contrast: more)').matches) return 'high-contrast';
    return '${DEFAULT_MODE}';
  })();
  root.dataset.mode = mode;
  try {
    var brand = localStorage.getItem('${BRAND_STORAGE_KEY}');
    if (brand) root.dataset.brand = brand;
  } catch(e) {}
})();`;
}
