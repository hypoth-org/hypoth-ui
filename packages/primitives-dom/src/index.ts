// Shared types
export type { Direction, LogicalDirection } from "./types.js";

// Constants
export { FOCUSABLE_SELECTOR, DEFAULT_TYPEAHEAD_TIMEOUT } from "./constants.js";

// Focus management
export { createFocusTrap, type FocusTrap, type FocusTrapOptions } from "./focus/focus-trap.js";

// Keyboard navigation
export {
  createRovingFocus,
  type RovingFocus,
  type RovingFocusOptions,
} from "./keyboard/roving-focus.js";

// Keyboard helpers
export {
  createActivationHandler,
  type ActivationOptions,
} from "./keyboard/activation.js";

export {
  createArrowKeyHandler,
  type ArrowKeyOptions,
} from "./keyboard/arrow-keys.js";

export {
  createTypeAhead,
  type TypeAhead,
  type TypeAheadOptions,
} from "./keyboard/type-ahead.js";

// Layer utilities
export {
  createDismissableLayer,
  type DismissableLayer,
  type DismissableLayerOptions,
  type DismissReason,
} from "./layer/dismissable-layer.js";

// ARIA utilities
export {
  announce,
  clearAnnouncements,
  type LivePoliteness,
  type LiveRegionOptions,
} from "./aria/live-region.js";
