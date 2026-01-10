/**
 * Composite Primitives
 *
 * Higher-level primitives that bundle multiple low-level primitives
 * into cohesive, reusable behaviors.
 *
 * @packageDocumentation
 */

// Modal overlay composite (focus trap + dismissable + presence)
export {
  createModalOverlay,
  type ModalOverlay,
  type ModalOverlayOptions,
  type ModalOverlayState,
} from "./modal-overlay.js";

// Popover overlay composite (anchor positioning + dismissable + presence)
export {
  createPopoverOverlay,
  type PopoverOverlay,
  type PopoverOverlayOptions,
  type PopoverOverlayState,
} from "./popover-overlay.js";

// Selectable list composite (roving focus + type-ahead + selection)
export {
  createSelectableList,
  type SelectableList,
  type SelectableListOptions,
  type SelectableListState,
  type SelectionMode,
  type ListOrientation,
} from "./selectable-list.js";
