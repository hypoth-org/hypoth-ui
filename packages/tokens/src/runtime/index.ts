/**
 * Runtime token utilities
 * Re-exports all runtime APIs
 */

export { initTheme, getInitScript } from './init.js';
export {
  getMode,
  setMode,
  toggleMode,
  clearMode,
  getBrand,
  setBrand,
  clearBrand,
  prefersDarkMode,
  prefersReducedMotion,
  prefersHighContrast,
  onColorSchemeChange,
  onModeChange,
  onBrandChange,
  type ThemeMode,
} from './theme-controller.js';
