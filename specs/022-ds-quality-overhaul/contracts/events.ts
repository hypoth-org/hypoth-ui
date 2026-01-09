/**
 * Event Naming Conventions
 *
 * Feature: 022-ds-quality-overhaul
 * This contract defines the standardized event naming conventions.
 */

// =============================================================================
// Event Name Mappings
// =============================================================================

/**
 * Standard event naming conventions for the design system.
 *
 * React props use camelCase callbacks (e.g., onPress, onValueChange).
 * Web Components use ds: prefixed custom events (e.g., ds:press, ds:change).
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
// React Callback Types
// =============================================================================

/**
 * React callback prop types for each event
 */
export type OnPress = (event: PressEventDetail) => void;
export type OnValueChange<T = unknown> = (value: T, detail: ValueChangeEventDetail<T>) => void;
export type OnOpenChange = (open: boolean, detail: OpenChangeEventDetail) => void;
export type OnSelect<T = unknown> = (detail: SelectEventDetail<T>) => void;
export type OnFocusChange = (detail: FocusChangeEventDetail) => void;
export type OnSortChange = (detail: SortChangeEventDetail) => void;
export type OnExpandedChange = (detail: ExpandedChangeEventDetail) => void;
export type OnCheckedChange = (checked: boolean | "indeterminate", detail?: CheckedChangeEventDetail) => void;
export type OnDismiss = (detail: DismissEventDetail) => void;
export type OnReorder<T = unknown> = (detail: ReorderEventDetail<T>) => void;
export type OnIndexChange = (index: number, detail: IndexChangeEventDetail) => void;
export type OnSearch = (query: string, detail: SearchEventDetail) => void;
export type OnHoverChange = (hovered: boolean, detail: HoverChangeEventDetail) => void;
export type OnCopy = (detail: CopyEventDetail) => void;
export type OnResize = (detail: ResizeEventDetail) => void;

// =============================================================================
// Web Component Event Types
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
// Usage Examples
// =============================================================================

/**
 * @example React component usage - Core events
 * ```tsx
 * <Button onPress={(e) => console.log('Pressed!', e.isKeyboard)} />
 * <Select onValueChange={(value) => setSelected(value)} />
 * <Dialog onOpenChange={(open, { reason }) => {
 *   if (reason === 'escape') analytics.track('dialog_escaped');
 * }} />
 * ```
 *
 * @example React component usage - New events
 * ```tsx
 * // Sortable list
 * <SortableList
 *   items={items}
 *   onReorder={({ items, fromIndex, toIndex }) => {
 *     setItems(items);
 *     console.log(`Moved from ${fromIndex} to ${toIndex}`);
 *   }}
 * />
 *
 * // Pagination
 * <Pagination
 *   page={page}
 *   total={10}
 *   onIndexChange={(index) => setPage(index)}
 * />
 *
 * // Searchable command palette
 * <Command onSearch={(query) => fetchResults(query)} />
 *
 * // Hover card
 * <HoverCard onHoverChange={(hovered) => {
 *   if (hovered) prefetchData();
 * }}>
 *   <HoverCardTrigger>Hover me</HoverCardTrigger>
 * </HoverCard>
 *
 * // Code block with copy
 * <CodeBlock onCopy={({ success }) => {
 *   if (success) toast('Copied!');
 * }}>
 *   {code}
 * </CodeBlock>
 *
 * // Resizable panel
 * <ResizablePanel onResize={({ width }) => {
 *   setSidebarWidth(width);
 * }} />
 * ```
 *
 * @example Web Component usage
 * ```ts
 * button.addEventListener('ds:press', (e) => {
 *   console.log('Pressed!', e.detail.isKeyboard);
 * });
 *
 * select.addEventListener('ds:change', (e) => {
 *   console.log('New value:', e.detail.value);
 * });
 *
 * sortableList.addEventListener('ds:reorder', (e) => {
 *   console.log('Reordered:', e.detail.items);
 * });
 *
 * pagination.addEventListener('ds:index-change', (e) => {
 *   console.log('Page:', e.detail.index);
 * });
 * ```
 *
 * @example Event naming quick reference
 * ```
 * | Pattern              | React Prop       | WC Event          |
 * |----------------------|------------------|-------------------|
 * | Button click         | onPress          | ds:press          |
 * | Value change         | onValueChange    | ds:change         |
 * | Open/close           | onOpenChange     | ds:open-change    |
 * | Item selection       | onSelect         | ds:select         |
 * | Focus change         | onFocusChange    | ds:focus-change   |
 * | Sort change          | onSortChange     | ds:sort-change    |
 * | Expand/collapse      | onExpandedChange | ds:expanded-change|
 * | Check/uncheck        | onCheckedChange  | ds:checked-change |
 * | Dismiss              | onDismiss        | ds:dismiss        |
 * | Drag reorder         | onReorder        | ds:reorder        |
 * | Page/tab change      | onIndexChange    | ds:index-change   |
 * | Search query         | onSearch         | ds:search         |
 * | Hover state          | onHoverChange    | ds:hover-change   |
 * | Copy to clipboard    | onCopy           | ds:copy           |
 * | Resize               | onResize         | ds:resize         |
 * ```
 */
