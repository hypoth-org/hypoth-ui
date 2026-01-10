/**
 * Selectable List Composite
 *
 * High-level primitive that bundles roving focus, type-ahead, and selection
 * for listbox, menu, and tree patterns. Provides:
 * - Arrow key navigation (roving tabindex)
 * - Type-ahead search
 * - Single/multi selection modes
 * - Range selection (Shift+click)
 * - ARIA attributes computation
 *
 * @module composites/selectable-list
 */

// =============================================================================
// Types
// =============================================================================

export type SelectionMode = "single" | "multiple";
export type ListOrientation = "horizontal" | "vertical";

export interface SelectableListOptions {
  /**
   * Selection mode: single or multiple.
   * @default "single"
   */
  mode?: SelectionMode;

  /**
   * List orientation for arrow key navigation.
   * @default "vertical"
   */
  orientation?: ListOrientation;

  /**
   * Whether focus loops from last to first item.
   * @default true
   */
  loop?: boolean;

  /**
   * Enable type-ahead search.
   * @default true
   */
  typeAhead?: boolean;

  /**
   * Type-ahead timeout in ms before search resets.
   * @default 500
   */
  typeAheadTimeout?: number;

  /**
   * Initially selected values.
   */
  defaultSelected?: string[];

  /**
   * Controlled selected values.
   */
  selected?: string[];

  /**
   * Callback when selection changes.
   */
  onSelectionChange?: (selected: string[]) => void;

  /**
   * Callback when focused item changes.
   */
  onFocusChange?: (value: string | null) => void;

  /**
   * Custom ID generator.
   */
  generateId?: () => string;
}

export interface SelectableListState {
  /** Currently selected values */
  selected: string[];
  /** Currently focused value */
  focused: string | null;
  /** Whether list is in multi-select mode */
  mode: SelectionMode;
}

export interface ListItemOptions {
  /** Unique value for this item */
  value: string;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Text content for type-ahead matching */
  textContent?: string;
}

export interface ListItemProps {
  /** ID for the item */
  id: string;
  /** Role attribute */
  role: "option";
  /** Whether item is selected */
  "aria-selected": "true" | "false";
  /** Whether item is disabled */
  "aria-disabled"?: "true";
  /** Tabindex for roving focus */
  tabIndex: 0 | -1;
}

export interface SelectableList {
  /** Current state */
  readonly state: SelectableListState;

  /** Generated list ID */
  readonly listId: string;

  /**
   * Register an item with the list.
   * Call this for each item in the list.
   */
  registerItem(options: ListItemOptions): void;

  /**
   * Unregister an item from the list.
   * Call this when an item is removed.
   */
  unregisterItem(value: string): void;

  /**
   * Get props for the list container.
   */
  getListProps(): {
    id: string;
    role: "listbox";
    "aria-multiselectable"?: "true";
    "aria-orientation": ListOrientation;
    "aria-activedescendant": string | undefined;
  };

  /**
   * Get props for a list item.
   */
  getItemProps(value: string): ListItemProps;

  /**
   * Handle keyboard navigation.
   * Attach this to the list container's keydown event.
   */
  handleKeyDown(event: KeyboardEvent): void;

  /**
   * Handle item click/selection.
   * Attach this to each item's click event.
   */
  handleItemClick(value: string, event?: MouseEvent): void;

  /**
   * Focus a specific item.
   */
  focusItem(value: string): void;

  /**
   * Select a value programmatically.
   */
  select(value: string): void;

  /**
   * Deselect a value programmatically.
   */
  deselect(value: string): void;

  /**
   * Toggle selection of a value.
   */
  toggleSelect(value: string): void;

  /**
   * Clear all selections.
   */
  clearSelection(): void;

  /**
   * Select all items (multi-select only).
   */
  selectAll(): void;

  /**
   * Set selected values programmatically.
   */
  setSelected(values: string[]): void;

  /** Update options dynamically */
  setOptions(options: Partial<SelectableListOptions>): void;

  /** Clean up resources */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

interface ItemState {
  value: string;
  disabled: boolean;
  textContent: string;
  element?: HTMLElement;
}

let idCounter = 0;

function defaultGenerateId(): string {
  return `selectable-list-${++idCounter}`;
}

/**
 * Creates a selectable list composite that bundles:
 * - Roving focus (arrow key navigation)
 * - Type-ahead search
 * - Selection management (single/multi)
 *
 * @example
 * ```ts
 * const list = createSelectableList({
 *   mode: "multiple",
 *   onSelectionChange: (selected) => console.log("Selected:", selected),
 * });
 *
 * // Register items
 * list.registerItem({ value: "option-1", textContent: "First Option" });
 * list.registerItem({ value: "option-2", textContent: "Second Option" });
 *
 * // Apply props to elements
 * listElement.assign(list.getListProps());
 * itemElements.forEach(el => el.assign(list.getItemProps(el.dataset.value)));
 *
 * // Handle events
 * listElement.addEventListener("keydown", list.handleKeyDown);
 * ```
 */
export function createSelectableList(options: SelectableListOptions = {}): SelectableList {
  const {
    mode: initialMode = "single",
    orientation = "vertical",
    loop = true,
    typeAhead = true,
    typeAheadTimeout = 500,
    defaultSelected = [],
    selected: controlledSelected,
    onSelectionChange,
    onFocusChange,
    generateId = defaultGenerateId,
  } = options;

  const listId = generateId();

  // Internal state
  const items: Map<string, ItemState> = new Map();
  let itemOrder: string[] = [];
  let selected: string[] = controlledSelected ?? defaultSelected;
  let focused: string | null = null;
  let mode: SelectionMode = initialMode;
  let lastSelectedIndex = -1; // For range selection

  // Type-ahead state
  let typeAheadBuffer = "";
  let typeAheadTimer: ReturnType<typeof setTimeout> | null = null;

  // Mutable options
  const currentOptions = {
    orientation,
    loop,
    typeAhead,
    typeAheadTimeout,
    onSelectionChange,
    onFocusChange,
  };

  /**
   * Update selection and notify
   */
  function updateSelection(newSelected: string[]): void {
    // If controlled, don't update internal state
    if (controlledSelected === undefined) {
      selected = newSelected;
    }
    currentOptions.onSelectionChange?.(newSelected);
  }

  /**
   * Update focus and notify
   */
  function updateFocus(value: string | null): void {
    focused = value;
    currentOptions.onFocusChange?.(value);
  }

  /**
   * Get enabled items in order
   */
  function getEnabledItems(): string[] {
    return itemOrder.filter((v) => {
      const item = items.get(v);
      return item && !item.disabled;
    });
  }

  /**
   * Get next/previous item
   */
  function getAdjacentItem(direction: "next" | "prev"): string | null {
    const enabledItems = getEnabledItems();
    if (enabledItems.length === 0) return null;

    const currentIndex = focused ? enabledItems.indexOf(focused) : -1;
    let nextIndex: number;

    if (direction === "next") {
      nextIndex = currentIndex + 1;
      if (nextIndex >= enabledItems.length) {
        nextIndex = currentOptions.loop ? 0 : enabledItems.length - 1;
      }
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        nextIndex = currentOptions.loop ? enabledItems.length - 1 : 0;
      }
    }

    return enabledItems[nextIndex] ?? null;
  }

  /**
   * Handle type-ahead search
   */
  function handleTypeAhead(char: string): void {
    if (!currentOptions.typeAhead) return;

    // Clear existing timer
    if (typeAheadTimer) {
      clearTimeout(typeAheadTimer);
    }

    // Add character to buffer
    typeAheadBuffer += char.toLowerCase();

    // Set timer to clear buffer
    typeAheadTimer = setTimeout(() => {
      typeAheadBuffer = "";
      typeAheadTimer = null;
    }, currentOptions.typeAheadTimeout);

    // Find matching item
    const enabledItems = getEnabledItems();
    for (const value of enabledItems) {
      const item = items.get(value);
      if (item?.textContent.toLowerCase().startsWith(typeAheadBuffer)) {
        updateFocus(value);
        item.element?.focus();
        break;
      }
    }
  }

  /**
   * Handle range selection (Shift+click)
   */
  function handleRangeSelect(value: string): void {
    if (mode !== "multiple" || lastSelectedIndex < 0) {
      return;
    }

    const enabledItems = getEnabledItems();
    const currentIndex = enabledItems.indexOf(value);
    if (currentIndex < 0) return;

    const start = Math.min(lastSelectedIndex, currentIndex);
    const end = Math.max(lastSelectedIndex, currentIndex);

    const rangeValues = enabledItems.slice(start, end + 1);
    const newSelected = new Set(selected);

    for (const v of rangeValues) {
      newSelected.add(v);
    }

    updateSelection(Array.from(newSelected));
  }

  const selectableList: SelectableList = {
    get state(): SelectableListState {
      return {
        selected: controlledSelected ?? [...selected],
        focused,
        mode,
      };
    },

    get listId(): string {
      return listId;
    },

    registerItem(itemOptions: ListItemOptions): void {
      const { value, disabled = false, textContent = "" } = itemOptions;
      items.set(value, { value, disabled, textContent });
      if (!itemOrder.includes(value)) {
        itemOrder.push(value);
      }
    },

    unregisterItem(value: string): void {
      items.delete(value);
      itemOrder = itemOrder.filter((v) => v !== value);

      // Update focus if focused item was removed
      if (focused === value) {
        const enabledItems = getEnabledItems();
        updateFocus(enabledItems[0] ?? null);
      }

      // Update selection if selected item was removed
      if (selected.includes(value)) {
        updateSelection(selected.filter((v) => v !== value));
      }
    },

    getListProps() {
      const props: ReturnType<SelectableList["getListProps"]> = {
        id: listId,
        role: "listbox",
        "aria-orientation": currentOptions.orientation,
        "aria-activedescendant": focused ? `${listId}-item-${focused}` : undefined,
      };

      if (mode === "multiple") {
        props["aria-multiselectable"] = "true";
      }

      return props;
    },

    getItemProps(value: string): ListItemProps {
      const item = items.get(value);
      const isSelected = (controlledSelected ?? selected).includes(value);
      const isFocused = focused === value;

      const props: ListItemProps = {
        id: `${listId}-item-${value}`,
        role: "option",
        "aria-selected": isSelected ? "true" : "false",
        tabIndex: isFocused ? 0 : -1,
      };

      if (item?.disabled) {
        props["aria-disabled"] = "true";
      }

      return props;
    },

    handleKeyDown(event: KeyboardEvent): void {
      const { key, ctrlKey, metaKey } = event;

      // Get navigation keys based on orientation
      const nextKey = currentOptions.orientation === "vertical" ? "ArrowDown" : "ArrowRight";
      const prevKey = currentOptions.orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

      switch (key) {
        case nextKey: {
          event.preventDefault();
          const next = getAdjacentItem("next");
          if (next) {
            updateFocus(next);
            items.get(next)?.element?.focus();
          }
          break;
        }

        case prevKey: {
          event.preventDefault();
          const prev = getAdjacentItem("prev");
          if (prev) {
            updateFocus(prev);
            items.get(prev)?.element?.focus();
          }
          break;
        }

        case "Home": {
          event.preventDefault();
          const enabledItems = getEnabledItems();
          const first = enabledItems[0];
          if (first) {
            updateFocus(first);
            items.get(first)?.element?.focus();
          }
          break;
        }

        case "End": {
          event.preventDefault();
          const enabledItems = getEnabledItems();
          const last = enabledItems[enabledItems.length - 1];
          if (last) {
            updateFocus(last);
            items.get(last)?.element?.focus();
          }
          break;
        }

        case " ":
        case "Enter": {
          event.preventDefault();
          if (focused) {
            selectableList.handleItemClick(focused, undefined);
          }
          break;
        }

        case "a":
        case "A": {
          // Ctrl/Cmd+A for select all
          if ((ctrlKey || metaKey) && mode === "multiple") {
            event.preventDefault();
            selectableList.selectAll();
          } else {
            handleTypeAhead(key);
          }
          break;
        }

        default: {
          // Type-ahead for single character keys
          if (key.length === 1 && !ctrlKey && !metaKey) {
            handleTypeAhead(key);
          }
        }
      }
    },

    handleItemClick(value: string, event?: MouseEvent): void {
      const item = items.get(value);
      if (!item || item.disabled) return;

      const enabledItems = getEnabledItems();
      const currentIndex = enabledItems.indexOf(value);

      // Update focus
      updateFocus(value);

      // Handle selection based on mode and modifiers
      if (mode === "single") {
        updateSelection([value]);
        lastSelectedIndex = currentIndex;
      } else {
        // Multi-select mode
        if (event?.shiftKey && lastSelectedIndex >= 0) {
          // Range selection
          handleRangeSelect(value);
        } else if (event?.ctrlKey || event?.metaKey) {
          // Toggle selection
          if (selected.includes(value)) {
            updateSelection(selected.filter((v) => v !== value));
          } else {
            updateSelection([...selected, value]);
            lastSelectedIndex = currentIndex;
          }
        } else {
          // Regular click in multi-select - toggle item
          if (selected.includes(value)) {
            updateSelection(selected.filter((v) => v !== value));
          } else {
            updateSelection([...selected, value]);
            lastSelectedIndex = currentIndex;
          }
        }
      }
    },

    focusItem(value: string): void {
      const item = items.get(value);
      if (item && !item.disabled) {
        updateFocus(value);
        item.element?.focus();
      }
    },

    select(value: string): void {
      if (mode === "single") {
        updateSelection([value]);
      } else if (!selected.includes(value)) {
        updateSelection([...selected, value]);
      }
    },

    deselect(value: string): void {
      updateSelection(selected.filter((v) => v !== value));
    },

    toggleSelect(value: string): void {
      if (selected.includes(value)) {
        selectableList.deselect(value);
      } else {
        selectableList.select(value);
      }
    },

    clearSelection(): void {
      updateSelection([]);
      lastSelectedIndex = -1;
    },

    selectAll(): void {
      if (mode !== "multiple") return;
      const enabledItems = getEnabledItems();
      updateSelection(enabledItems);
    },

    setSelected(values: string[]): void {
      updateSelection(values);
    },

    setOptions(newOptions: Partial<SelectableListOptions>): void {
      if (newOptions.mode !== undefined) {
        mode = newOptions.mode;
        // Clear multi-selection when switching to single mode
        if (mode === "single" && selected.length > 1) {
          const firstSelected = selected[0];
          updateSelection(firstSelected ? [firstSelected] : []);
        }
      }
      if (newOptions.orientation !== undefined) {
        currentOptions.orientation = newOptions.orientation;
      }
      if (newOptions.loop !== undefined) {
        currentOptions.loop = newOptions.loop;
      }
      if (newOptions.typeAhead !== undefined) {
        currentOptions.typeAhead = newOptions.typeAhead;
      }
      if (newOptions.typeAheadTimeout !== undefined) {
        currentOptions.typeAheadTimeout = newOptions.typeAheadTimeout;
      }
      if (newOptions.onSelectionChange !== undefined) {
        currentOptions.onSelectionChange = newOptions.onSelectionChange;
      }
      if (newOptions.onFocusChange !== undefined) {
        currentOptions.onFocusChange = newOptions.onFocusChange;
      }
    },

    destroy(): void {
      if (typeAheadTimer) {
        clearTimeout(typeAheadTimer);
        typeAheadTimer = null;
      }
      items.clear();
      itemOrder = [];
      selected = [];
      focused = null;
    },
  };

  return selectableList;
}
