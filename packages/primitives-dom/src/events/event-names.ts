/**
 * Event Naming Constants
 *
 * Standard event naming conventions for the Hypoth UI Design System.
 * React props use camelCase callbacks (e.g., onPress, onValueChange).
 * Web Components use ds: prefixed custom events (e.g., ds:press, ds:change).
 *
 * @packageDocumentation
 */

// =============================================================================
// Event Name Mappings
// =============================================================================

/**
 * Standard event naming conventions for the design system.
 */
export const EventNames = {
  /**
   * Activation events - used for buttons, links, menu items
   * Triggered when user clicks, taps, or presses Enter/Space
   */
  press: {
    react: "onPress",
    wc: "ds:press",
    description: "User activation (click, Enter, Space)",
  },

  /**
   * Value change events - used for inputs, selects, checkboxes, sliders
   * Triggered when the component's value changes
   */
  valueChange: {
    react: "onValueChange",
    wc: "ds:change",
    description: "Value changed by user interaction",
  },

  /**
   * Open/close state events - used for dialogs, menus, popovers, dropdowns
   * Triggered when open state changes
   */
  openChange: {
    react: "onOpenChange",
    wc: "ds:open-change",
    description: "Open state changed",
  },

  /**
   * Selection events - used for lists, trees, tables, command palettes
   * Triggered when an item is selected
   */
  select: {
    react: "onSelect",
    wc: "ds:select",
    description: "Item selected",
  },

  /**
   * Focus change events - used for focus-managed containers
   * Triggered when focus moves within the component
   */
  focusChange: {
    react: "onFocusChange",
    wc: "ds:focus-change",
    description: "Focus changed within component",
  },

  /**
   * Sort change events - used for sortable tables
   * Triggered when sort column or direction changes
   */
  sortChange: {
    react: "onSortChange",
    wc: "ds:sort-change",
    description: "Sort state changed",
  },

  /**
   * Expansion events - used for trees, accordions, collapsibles
   * Triggered when expanded state changes
   */
  expandedChange: {
    react: "onExpandedChange",
    wc: "ds:expanded-change",
    description: "Expanded state changed",
  },

  /**
   * Checked state events - used for checkboxes, switches, radio groups
   * Triggered when checked state changes
   */
  checkedChange: {
    react: "onCheckedChange",
    wc: "ds:checked-change",
    description: "Checked state changed",
  },

  /**
   * Dismiss events - used for toasts, alerts, notifications
   * Triggered when component is dismissed
   */
  dismiss: {
    react: "onDismiss",
    wc: "ds:dismiss",
    description: "Component dismissed",
  },

  /**
   * Reorder events - used for drag-and-drop sortable lists
   * Triggered when items are reordered
   */
  reorder: {
    react: "onReorder",
    wc: "ds:reorder",
    description: "Items reordered via drag-and-drop",
  },

  /**
   * Index change events - used for pagination, tabs, steppers, carousels
   * Triggered when the current index/page changes
   */
  indexChange: {
    react: "onIndexChange",
    wc: "ds:index-change",
    description: "Current page/tab/step index changed",
  },

  /**
   * Search events - used for searchable components
   * Triggered when search query changes (debounced)
   */
  search: {
    react: "onSearch",
    wc: "ds:search",
    description: "Search query changed",
  },

  /**
   * Hover change events - used for hover cards, tooltips, preview triggers
   * Triggered when hover state changes
   */
  hoverChange: {
    react: "onHoverChange",
    wc: "ds:hover-change",
    description: "Hover state changed",
  },

  /**
   * Copy events - used for copyable content, code blocks
   * Triggered when content is copied to clipboard
   */
  copy: {
    react: "onCopy",
    wc: "ds:copy",
    description: "Content copied to clipboard",
  },

  /**
   * Resize events - used for resizable panels, columns
   * Triggered when element is resized
   */
  resize: {
    react: "onResize",
    wc: "ds:resize",
    description: "Element resized",
  },
} as const;

// =============================================================================
// Event Detail Types
// =============================================================================

/**
 * Press event detail
 */
export interface PressEventDetail {
  /** The original DOM event that triggered the press */
  originalEvent: MouseEvent | KeyboardEvent;
  /** The element that was pressed */
  target: HTMLElement;
  /** Whether the press was via keyboard (Enter/Space) */
  isKeyboard: boolean;
}

/**
 * Value change event detail
 */
export interface ValueChangeEventDetail<T = unknown> {
  /** The new value */
  value: T;
  /** The previous value (if available) */
  previousValue?: T;
}

/**
 * Open change event detail
 */
export interface OpenChangeEventDetail {
  /** Whether the component is now open */
  open: boolean;
  /** The reason for the state change */
  reason?: "escape" | "outside-click" | "trigger" | "programmatic" | "blur";
}

/**
 * Select event detail
 */
export interface SelectEventDetail<T = unknown> {
  /** The selected value */
  value: T;
  /** Whether the item is now selected (for toggle selection) */
  selected: boolean;
  /** The selected item element (if applicable) */
  element?: HTMLElement;
}

/**
 * Focus change event detail
 */
export interface FocusChangeEventDetail {
  /** Whether the component now contains focus */
  focused: boolean;
  /** The element that received/lost focus */
  target?: HTMLElement;
}

/**
 * Sort change event detail
 */
export interface SortChangeEventDetail {
  /** The column being sorted */
  column: string;
  /** The sort direction */
  direction: "asc" | "desc" | null;
  /** Previous sort state (if any) */
  previousColumn?: string;
  previousDirection?: "asc" | "desc" | null;
}

/**
 * Expanded change event detail
 */
export interface ExpandedChangeEventDetail {
  /** The item that was expanded/collapsed */
  key: string;
  /** Whether the item is now expanded */
  expanded: boolean;
  /** All currently expanded keys (for multi-expand) */
  expandedKeys?: Set<string>;
}

/**
 * Checked change event detail
 */
export interface CheckedChangeEventDetail {
  /** Whether the item is now checked */
  checked: boolean | "indeterminate";
  /** The value of the checked item (for radio/checkbox groups) */
  value?: string;
}

/**
 * Dismiss event detail
 */
export interface DismissEventDetail {
  /** The reason for dismissal */
  reason: "timeout" | "user" | "programmatic";
  /** The dismissed item's ID (for toast managers) */
  id?: string;
}

/**
 * Reorder event detail
 */
export interface ReorderEventDetail<T = unknown> {
  /** The item that was moved */
  item: T;
  /** The previous index */
  fromIndex: number;
  /** The new index */
  toIndex: number;
  /** The complete reordered array */
  items: T[];
}

/**
 * Index change event detail
 */
export interface IndexChangeEventDetail {
  /** The new index */
  index: number;
  /** The previous index */
  previousIndex: number;
  /** Total count (for pagination: total pages, for tabs: total tabs) */
  total?: number;
}

/**
 * Search event detail
 */
export interface SearchEventDetail {
  /** The search query string */
  query: string;
  /** Previous query (for diff detection) */
  previousQuery?: string;
}

/**
 * Hover change event detail
 */
export interface HoverChangeEventDetail {
  /** Whether the element is now hovered */
  hovered: boolean;
  /** The element being hovered */
  target?: HTMLElement;
  /** Pointer type (mouse, touch, pen) */
  pointerType?: "mouse" | "touch" | "pen";
}

/**
 * Copy event detail
 */
export interface CopyEventDetail {
  /** The text that was copied */
  text: string;
  /** Whether the copy succeeded */
  success: boolean;
  /** The source element */
  source?: HTMLElement;
}

/**
 * Resize event detail
 */
export interface ResizeEventDetail {
  /** New width in pixels */
  width: number;
  /** New height in pixels */
  height: number;
  /** Previous width */
  previousWidth?: number;
  /** Previous height */
  previousHeight?: number;
  /** Which edge was dragged (for resizable panels) */
  edge?: "top" | "right" | "bottom" | "left";
}

// =============================================================================
// Custom Event Type
// =============================================================================

/**
 * Custom event type for Web Components
 */
export type DSCustomEvent<T> = CustomEvent<T>;

/**
 * Web Component event map for type-safe addEventListener
 */
export interface DSEventMap {
  "ds:press": DSCustomEvent<PressEventDetail>;
  "ds:change": DSCustomEvent<ValueChangeEventDetail>;
  "ds:open-change": DSCustomEvent<OpenChangeEventDetail>;
  "ds:select": DSCustomEvent<SelectEventDetail>;
  "ds:focus-change": DSCustomEvent<FocusChangeEventDetail>;
  "ds:sort-change": DSCustomEvent<SortChangeEventDetail>;
  "ds:expanded-change": DSCustomEvent<ExpandedChangeEventDetail>;
  "ds:checked-change": DSCustomEvent<CheckedChangeEventDetail>;
  "ds:dismiss": DSCustomEvent<DismissEventDetail>;
  "ds:reorder": DSCustomEvent<ReorderEventDetail>;
  "ds:index-change": DSCustomEvent<IndexChangeEventDetail>;
  "ds:search": DSCustomEvent<SearchEventDetail>;
  "ds:hover-change": DSCustomEvent<HoverChangeEventDetail>;
  "ds:copy": DSCustomEvent<CopyEventDetail>;
  "ds:resize": DSCustomEvent<ResizeEventDetail>;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Create a custom event with the ds: prefix
 */
export function createDSEvent<T extends keyof DSEventMap>(
  type: T,
  detail: DSEventMap[T]["detail"],
  options?: EventInit
): DSCustomEvent<DSEventMap[T]["detail"]> {
  return new CustomEvent(type, {
    detail,
    bubbles: true,
    composed: true,
    ...options,
  });
}

/**
 * Get the React callback prop name for a given event type
 */
export function getReactCallbackName(
  eventType: keyof typeof EventNames
): string {
  return EventNames[eventType].react;
}

/**
 * Get the Web Component event name for a given event type
 */
export function getWCEventName(eventType: keyof typeof EventNames): string {
  return EventNames[eventType].wc;
}
