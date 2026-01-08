/**
 * List behavior utilities for listbox navigation.
 *
 * Provides keyboard navigation, selection, and typeahead
 * following the WAI-ARIA Listbox pattern.
 */

export type ListSelectionMode = "single" | "multiple" | "none";
export type ListOrientation = "vertical" | "horizontal";

export interface ListBehaviorOptions {
  /**
   * Selection mode.
   * @default "single"
   */
  selectionMode?: ListSelectionMode;

  /**
   * List orientation.
   * @default "vertical"
   */
  orientation?: ListOrientation;

  /**
   * Enable typeahead navigation.
   * @default true
   */
  typeahead?: boolean;

  /**
   * Typeahead timeout in ms.
   * @default 500
   */
  typeaheadTimeout?: number;

  /**
   * Callback when selection changes.
   */
  onSelectionChange?: (selectedIds: Set<string>) => void;

  /**
   * Callback when focused item changes.
   */
  onFocusChange?: (focusedId: string | null) => void;
}

export interface ListBehavior {
  /**
   * Currently selected item IDs.
   */
  selectedIds: Set<string>;

  /**
   * Currently focused item ID.
   */
  focusedId: string | null;

  /**
   * Handle keyboard navigation.
   */
  handleKeyDown(
    event: KeyboardEvent,
    itemIds: string[],
    getItemElement: (id: string) => HTMLElement | null
  ): void;

  /**
   * Toggle item selection.
   */
  toggleSelection(id: string): void;

  /**
   * Select an item.
   */
  select(id: string): void;

  /**
   * Deselect an item.
   */
  deselect(id: string): void;

  /**
   * Select all items.
   */
  selectAll(ids: string[]): void;

  /**
   * Clear selection.
   */
  clearSelection(): void;

  /**
   * Focus an item.
   */
  focus(id: string): void;

  /**
   * Focus first item.
   */
  focusFirst(itemIds: string[], getItemElement: (id: string) => HTMLElement | null): void;

  /**
   * Focus last item.
   */
  focusLast(itemIds: string[], getItemElement: (id: string) => HTMLElement | null): void;

  /**
   * Clean up resources.
   */
  destroy(): void;
}

/**
 * Create list behavior for listbox navigation.
 *
 * @example
 * ```ts
 * const list = createListBehavior({
 *   selectionMode: "single",
 *   onSelectionChange: (selected) => console.log([...selected]),
 * });
 * ```
 */
export function createListBehavior(options: ListBehaviorOptions = {}): ListBehavior {
  const {
    selectionMode = "single",
    orientation = "vertical",
    typeahead = true,
    typeaheadTimeout = 500,
    onSelectionChange,
    onFocusChange,
  } = options;

  // State
  const selectedIds = new Set<string>();
  let focusedId: string | null = null;
  let typeaheadString = "";
  let typeaheadTimer: ReturnType<typeof setTimeout> | null = null;

  function clearTypeahead(): void {
    typeaheadString = "";
    if (typeaheadTimer) {
      clearTimeout(typeaheadTimer);
      typeaheadTimer = null;
    }
  }

  function handleKeyDown(
    event: KeyboardEvent,
    itemIds: string[],
    getItemElement: (id: string) => HTMLElement | null
  ): void {
    const currentIndex = focusedId ? itemIds.indexOf(focusedId) : -1;

    // Arrow key navigation
    const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
    const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";

    switch (event.key) {
      case prevKey: {
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : itemIds.length - 1;
        const prevId = itemIds[prevIndex];
        if (prevId) {
          focus(prevId);
          getItemElement(prevId)?.focus();
        }
        break;
      }

      case nextKey: {
        event.preventDefault();
        const nextIndex = currentIndex < itemIds.length - 1 ? currentIndex + 1 : 0;
        const nextId = itemIds[nextIndex];
        if (nextId) {
          focus(nextId);
          getItemElement(nextId)?.focus();
        }
        break;
      }

      case "Home": {
        event.preventDefault();
        const firstId = itemIds[0];
        if (firstId) {
          focus(firstId);
          getItemElement(firstId)?.focus();
        }
        break;
      }

      case "End": {
        event.preventDefault();
        const lastId = itemIds[itemIds.length - 1];
        if (lastId) {
          focus(lastId);
          getItemElement(lastId)?.focus();
        }
        break;
      }

      case " ":
      case "Enter": {
        event.preventDefault();
        if (focusedId) {
          toggleSelection(focusedId);
        }
        break;
      }

      case "a":
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          if (selectionMode === "multiple") {
            selectAll(itemIds);
          }
        } else if (typeahead) {
          handleTypeahead(event.key, itemIds, getItemElement);
        }
        break;

      default:
        // Typeahead
        if (typeahead && event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          handleTypeahead(event.key, itemIds, getItemElement);
        }
    }
  }

  function handleTypeahead(
    char: string,
    itemIds: string[],
    getItemElement: (id: string) => HTMLElement | null
  ): void {
    // Clear previous timer
    if (typeaheadTimer) {
      clearTimeout(typeaheadTimer);
    }

    typeaheadString += char.toLowerCase();

    // Find matching item
    const startIndex = focusedId ? itemIds.indexOf(focusedId) + 1 : 0;
    const searchOrder = [...itemIds.slice(startIndex), ...itemIds.slice(0, startIndex)];

    for (const id of searchOrder) {
      const element = getItemElement(id);
      const text = element?.textContent?.toLowerCase() ?? "";
      if (text.startsWith(typeaheadString)) {
        focus(id);
        element?.focus();
        break;
      }
    }

    // Reset typeahead after timeout
    typeaheadTimer = setTimeout(clearTypeahead, typeaheadTimeout);
  }

  function toggleSelection(id: string): void {
    if (selectionMode === "none") return;

    if (selectedIds.has(id)) {
      deselect(id);
    } else {
      select(id);
    }
  }

  function select(id: string): void {
    if (selectionMode === "none") return;

    if (selectionMode === "single") {
      selectedIds.clear();
    }
    selectedIds.add(id);
    onSelectionChange?.(selectedIds);
  }

  function deselect(id: string): void {
    if (selectionMode === "none") return;

    selectedIds.delete(id);
    onSelectionChange?.(selectedIds);
  }

  function selectAll(ids: string[]): void {
    if (selectionMode !== "multiple") return;

    for (const id of ids) {
      selectedIds.add(id);
    }
    onSelectionChange?.(selectedIds);
  }

  function clearSelection(): void {
    selectedIds.clear();
    onSelectionChange?.(selectedIds);
  }

  function focus(id: string): void {
    focusedId = id;
    onFocusChange?.(id);
  }

  function focusFirst(itemIds: string[], getItemElement: (id: string) => HTMLElement | null): void {
    const firstId = itemIds[0];
    if (firstId) {
      focus(firstId);
      getItemElement(firstId)?.focus();
    }
  }

  function focusLast(itemIds: string[], getItemElement: (id: string) => HTMLElement | null): void {
    const lastId = itemIds[itemIds.length - 1];
    if (lastId) {
      focus(lastId);
      getItemElement(lastId)?.focus();
    }
  }

  function destroy(): void {
    selectedIds.clear();
    focusedId = null;
    clearTypeahead();
  }

  return {
    get selectedIds() {
      return selectedIds;
    },
    get focusedId() {
      return focusedId;
    },
    handleKeyDown,
    toggleSelection,
    select,
    deselect,
    selectAll,
    clearSelection,
    focus,
    focusFirst,
    focusLast,
    destroy,
  };
}
