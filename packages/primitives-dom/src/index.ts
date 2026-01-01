// Focus management
export { createFocusTrap, type FocusTrap, type FocusTrapOptions } from "./focus/focus-trap.js";

// Keyboard navigation
export {
  createRovingFocus,
  type RovingFocus,
  type RovingFocusOptions,
  type Direction,
} from "./keyboard/roving-focus.js";

// ARIA utilities
export {
  announce,
  clearAnnouncements,
  type LivePoliteness,
  type LiveRegionOptions,
} from "./aria/live-region.js";
