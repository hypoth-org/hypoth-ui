/**
 * Select behavior primitive.
 * Manages select open/close, value selection, typeahead filtering, and ARIA state.
 */

// =============================================================================
// Types
// =============================================================================

export interface SelectBehaviorOptions<T = string> {
  /** Initial selected value */
  defaultValue?: T | null;
  /** Called when value changes */
  onValueChange?: (value: T | null) => void;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether the select is read-only */
  readOnly?: boolean;
  /** Enable typeahead search */
  searchable?: boolean;
  /** Show clear button */
  clearable?: boolean;
  /** Virtualization threshold (default: 100) */
  virtualizationThreshold?: number;
  /** Custom ID generator */
  generateId?: () => string;
}

export interface SelectBehaviorState<T = string> {
  open: boolean;
  value: T | null;
  highlightedValue: T | null;
  searchQuery: string;
  virtualized: boolean;
}

export interface SelectTriggerProps {
  role: "combobox";
  "aria-expanded": boolean;
  "aria-haspopup": "listbox";
  "aria-controls": string;
  "aria-activedescendant": string | undefined;
  tabIndex: number;
}

export interface SelectContentProps {
  role: "listbox";
  id: string;
  "aria-label"?: string;
}

export interface SelectOptionProps {
  role: "option";
  id: string;
  "aria-selected": boolean;
  "aria-disabled"?: boolean;
}

export interface SelectBehavior<T = string> {
  /** Current state */
  readonly state: SelectBehaviorState<T>;
  /** Trigger ID */
  readonly triggerId: string;
  /** Content ID */
  readonly contentId: string;

  /** Open the dropdown */
  open(): void;

  /** Close the dropdown */
  close(): void;

  /** Toggle the dropdown */
  toggle(): void;

  /** Select a value */
  select(value: T): void;

  /** Clear the selection */
  clear(): void;

  /** Highlight an option (keyboard navigation) */
  highlight(value: T): void;

  /** Update search query */
  search(query: string): void;

  /** Move highlight to next option */
  highlightNext(): void;

  /** Move highlight to previous option */
  highlightPrev(): void;

  /** Move highlight to first option */
  highlightFirst(): void;

  /** Move highlight to last option */
  highlightLast(): void;

  /** Set items for navigation */
  setItems(items: Array<{ value: T; disabled?: boolean }>): void;

  /** Set option count for virtualization check */
  setOptionCount(count: number): void;

  /** Get ARIA props for trigger */
  getTriggerProps(): SelectTriggerProps;

  /** Get ARIA props for content/listbox */
  getContentProps(): SelectContentProps;

  /** Get ARIA props for an option */
  getOptionProps(value: T, label: string): SelectOptionProps;

  /** Cleanup */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

let idCounter = 0;

function defaultGenerateId(): string {
  return `select-${++idCounter}`;
}

/**
 * Creates a select behavior primitive.
 *
 * @example
 * ```ts
 * const select = createSelectBehavior({
 *   onValueChange: (value) => console.log('Selected:', value),
 *   onOpenChange: (open) => console.log('Open:', open),
 * });
 *
 * // Open/close
 * select.open();
 * select.close();
 *
 * // Selection
 * select.select('option-1');
 *
 * // Keyboard navigation
 * select.highlightNext();
 * select.highlightPrev();
 * ```
 */
export function createSelectBehavior<T = string>(
  options: SelectBehaviorOptions<T> = {}
): SelectBehavior<T> {
  const {
    defaultValue = null,
    onValueChange,
    onOpenChange,
    disabled = false,
    readOnly = false,
    searchable = false,
    clearable = false,
    virtualizationThreshold = 100,
    generateId = defaultGenerateId,
  } = options;

  // Generate stable IDs
  const baseId = generateId();
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;

  // Internal state
  let state: SelectBehaviorState<T> = {
    open: false,
    value: defaultValue,
    highlightedValue: defaultValue,
    searchQuery: "",
    virtualized: false,
  };

  // Item registry for navigation
  let items: Array<{ value: T; disabled?: boolean }> = [];

  // Helpers
  function getEnabledItems(): Array<{ value: T; disabled?: boolean }> {
    return items.filter((item) => !item.disabled);
  }

  function getHighlightedIndex(): number {
    if (state.highlightedValue === null) return -1;
    return getEnabledItems().findIndex((item) => item.value === state.highlightedValue);
  }

  function setOpen(open: boolean): void {
    if (state.open === open) return;
    if (disabled || (readOnly && open)) return;

    state = { ...state, open };

    if (open) {
      // Reset search and highlight current value when opening
      state = {
        ...state,
        searchQuery: "",
        highlightedValue: state.value,
      };
    }

    onOpenChange?.(open);
  }

  function setValue(value: T | null): void {
    if (state.value === value) return;
    if (disabled || readOnly) return;

    state = { ...state, value };
    onValueChange?.(value);
  }

  // Public API
  function open(): void {
    setOpen(true);
  }

  function close(): void {
    setOpen(false);
  }

  function toggle(): void {
    setOpen(!state.open);
  }

  function select(value: T): void {
    setValue(value);
    state = { ...state, highlightedValue: value };
    close();
  }

  function clear(): void {
    if (!clearable || disabled || readOnly) return;
    setValue(null);
    state = { ...state, highlightedValue: null };
  }

  function highlight(value: T): void {
    state = { ...state, highlightedValue: value };
  }

  function search(query: string): void {
    if (!searchable) return;
    state = { ...state, searchQuery: query };
  }

  function highlightNext(): void {
    const enabledItems = getEnabledItems();
    if (enabledItems.length === 0) return;

    const currentIndex = getHighlightedIndex();
    const nextIndex = currentIndex < enabledItems.length - 1 ? currentIndex + 1 : 0;
    const nextItem = enabledItems[nextIndex];
    if (nextItem) {
      state = { ...state, highlightedValue: nextItem.value };
    }
  }

  function highlightPrev(): void {
    const enabledItems = getEnabledItems();
    if (enabledItems.length === 0) return;

    const currentIndex = getHighlightedIndex();
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledItems.length - 1;
    const prevItem = enabledItems[prevIndex];
    if (prevItem) {
      state = { ...state, highlightedValue: prevItem.value };
    }
  }

  function highlightFirst(): void {
    const enabledItems = getEnabledItems();
    const firstItem = enabledItems[0];
    if (firstItem) {
      state = { ...state, highlightedValue: firstItem.value };
    }
  }

  function highlightLast(): void {
    const enabledItems = getEnabledItems();
    const lastItem = enabledItems[enabledItems.length - 1];
    if (lastItem) {
      state = { ...state, highlightedValue: lastItem.value };
    }
  }

  function setItems(newItems: Array<{ value: T; disabled?: boolean }>): void {
    items = newItems;
  }

  function setOptionCount(count: number): void {
    state = { ...state, virtualized: count > virtualizationThreshold };
  }

  function getTriggerProps(): SelectTriggerProps {
    const highlightedId =
      state.highlightedValue !== null ? `${baseId}-option-${state.highlightedValue}` : undefined;

    return {
      role: "combobox",
      "aria-expanded": state.open,
      "aria-haspopup": "listbox",
      "aria-controls": contentId,
      "aria-activedescendant": state.open ? highlightedId : undefined,
      tabIndex: disabled ? -1 : 0,
    };
  }

  function getContentProps(): SelectContentProps {
    return {
      role: "listbox",
      id: contentId,
    };
  }

  function getOptionProps(value: T, _label: string): SelectOptionProps {
    const isSelected = state.value === value;
    const item = items.find((i) => i.value === value);
    const isDisabled = item?.disabled ?? false;

    return {
      role: "option",
      id: `${baseId}-option-${value}`,
      "aria-selected": isSelected,
      "aria-disabled": isDisabled ? true : undefined,
    };
  }

  function destroy(): void {
    items = [];
  }

  return {
    get state() {
      return state;
    },
    get triggerId() {
      return triggerId;
    },
    get contentId() {
      return contentId;
    },
    open,
    close,
    toggle,
    select,
    clear,
    highlight,
    search,
    highlightNext,
    highlightPrev,
    highlightFirst,
    highlightLast,
    setItems,
    setOptionCount,
    getTriggerProps,
    getContentProps,
    getOptionProps,
    destroy,
  };
}
