/**
 * Tree behavior utilities for hierarchical navigation.
 *
 * Provides keyboard navigation, expand/collapse, and selection
 * following the WAI-ARIA TreeView pattern.
 */

export type TreeSelectionMode = "single" | "multiple" | "none";

export interface TreeItem {
  id: string;
  parentId?: string;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export interface TreeBehaviorOptions {
  /**
   * Selection mode.
   * @default "single"
   */
  selectionMode?: TreeSelectionMode;

  /**
   * Callback when an item is expanded or collapsed.
   */
  onExpandChange?: (id: string, expanded: boolean) => void;

  /**
   * Callback when selection changes.
   */
  onSelectionChange?: (selectedIds: Set<string>) => void;

  /**
   * Callback when an item is activated (Enter key or double-click).
   */
  onActivate?: (id: string) => void;
}

export interface TreeBehavior {
  /**
   * Currently selected item IDs.
   */
  selectedIds: Set<string>;

  /**
   * Currently expanded item IDs.
   */
  expandedIds: Set<string>;

  /**
   * Currently focused item ID.
   */
  focusedId: string | null;

  /**
   * Handle keyboard navigation.
   */
  handleKeyDown(
    event: KeyboardEvent,
    items: TreeItem[],
    getItemElement: (id: string) => HTMLElement | null
  ): void;

  /**
   * Toggle item expansion.
   */
  toggleExpand(id: string): void;

  /**
   * Expand an item.
   */
  expand(id: string): void;

  /**
   * Collapse an item.
   */
  collapse(id: string): void;

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
   * Select all visible items.
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
   * Clean up resources.
   */
  destroy(): void;
}

/**
 * Create tree behavior for hierarchical navigation.
 *
 * @example
 * ```ts
 * const tree = createTreeBehavior({
 *   selectionMode: "single",
 *   onExpandChange: (id, expanded) => console.log(id, expanded),
 *   onSelectionChange: (selected) => console.log([...selected]),
 * });
 * ```
 */
export function createTreeBehavior(options: TreeBehaviorOptions = {}): TreeBehavior {
  const { selectionMode = "single", onExpandChange, onSelectionChange, onActivate } = options;

  // State
  const selectedIds = new Set<string>();
  const expandedIds = new Set<string>();
  let focusedId: string | null = null;

  function getVisibleItems(items: TreeItem[]): TreeItem[] {
    const result: TreeItem[] = [];
    const itemMap = new Map(items.map((item) => [item.id, item]));

    function isVisible(item: TreeItem): boolean {
      if (!item.parentId) return true;
      const parent = itemMap.get(item.parentId);
      if (!parent) return true;
      return expandedIds.has(parent.id) && isVisible(parent);
    }

    for (const item of items) {
      if (isVisible(item)) {
        result.push(item);
      }
    }

    return result;
  }

  function handleKeyDown(
    event: KeyboardEvent,
    items: TreeItem[],
    getItemElement: (id: string) => HTMLElement | null
  ): void {
    if (!focusedId) return;

    const visibleItems = getVisibleItems(items);
    const currentIndex = visibleItems.findIndex((item) => item.id === focusedId);
    if (currentIndex === -1) return;

    const currentItem = visibleItems[currentIndex];
    if (!currentItem) return;

    const hasChildren = items.some((item) => item.parentId === focusedId);

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const nextIndex = currentIndex + 1;
        const nextItem = visibleItems[nextIndex];
        if (nextItem) {
          focus(nextItem.id);
          getItemElement(nextItem.id)?.focus();
        }
        break;
      }

      case "ArrowUp": {
        event.preventDefault();
        const prevIndex = currentIndex - 1;
        const prevItem = visibleItems[prevIndex];
        if (prevItem) {
          focus(prevItem.id);
          getItemElement(prevItem.id)?.focus();
        }
        break;
      }

      case "ArrowRight": {
        event.preventDefault();
        if (hasChildren) {
          if (!expandedIds.has(focusedId)) {
            expand(focusedId);
          } else {
            // Move to first child
            const firstChild = visibleItems.find((item) => item.parentId === focusedId);
            if (firstChild) {
              focus(firstChild.id);
              getItemElement(firstChild.id)?.focus();
            }
          }
        }
        break;
      }

      case "ArrowLeft": {
        event.preventDefault();
        if (hasChildren && expandedIds.has(focusedId)) {
          collapse(focusedId);
        } else if (currentItem.parentId) {
          // Move to parent
          focus(currentItem.parentId);
          getItemElement(currentItem.parentId)?.focus();
        }
        break;
      }

      case "Home": {
        event.preventDefault();
        const firstItem = visibleItems[0];
        if (firstItem) {
          focus(firstItem.id);
          getItemElement(firstItem.id)?.focus();
        }
        break;
      }

      case "End": {
        event.preventDefault();
        const lastItem = visibleItems[visibleItems.length - 1];
        if (lastItem) {
          focus(lastItem.id);
          getItemElement(lastItem.id)?.focus();
        }
        break;
      }

      case "Enter": {
        event.preventDefault();
        if (!currentItem.disabled) {
          onActivate?.(focusedId);
        }
        break;
      }

      case " ": {
        event.preventDefault();
        if (!currentItem.disabled) {
          toggleSelection(focusedId);
        }
        break;
      }

      case "*": {
        event.preventDefault();
        // Expand all siblings
        const siblings = visibleItems.filter((item) => item.parentId === currentItem.parentId);
        for (const sibling of siblings) {
          expand(sibling.id);
        }
        break;
      }
    }
  }

  function toggleExpand(id: string): void {
    if (expandedIds.has(id)) {
      collapse(id);
    } else {
      expand(id);
    }
  }

  function expand(id: string): void {
    if (!expandedIds.has(id)) {
      expandedIds.add(id);
      onExpandChange?.(id, true);
    }
  }

  function collapse(id: string): void {
    if (expandedIds.has(id)) {
      expandedIds.delete(id);
      onExpandChange?.(id, false);
    }
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
  }

  function destroy(): void {
    selectedIds.clear();
    expandedIds.clear();
    focusedId = null;
  }

  return {
    get selectedIds() {
      return selectedIds;
    },
    get expandedIds() {
      return expandedIds;
    },
    get focusedId() {
      return focusedId;
    },
    handleKeyDown,
    toggleExpand,
    expand,
    collapse,
    toggleSelection,
    select,
    deselect,
    selectAll,
    clearSelection,
    focus,
    destroy,
  };
}
