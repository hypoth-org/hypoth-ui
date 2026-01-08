/**
 * Table behavior utilities for sorting and selection.
 *
 * Provides state management for table sorting, row selection,
 * and keyboard navigation.
 */

export type SortDirection = "asc" | "desc" | "none";

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

export interface SelectionState {
  selectedRows: Set<string>;
  mode: "single" | "multiple" | "none";
}

export interface TableBehaviorOptions {
  /**
   * Initial sort state.
   */
  initialSort?: SortState;

  /**
   * Selection mode.
   * @default "none"
   */
  selectionMode?: "single" | "multiple" | "none";

  /**
   * Callback when sort changes.
   */
  onSortChange?: (state: SortState) => void;

  /**
   * Callback when selection changes.
   */
  onSelectionChange?: (selectedRows: Set<string>) => void;
}

export interface TableBehavior {
  /**
   * Current sort state.
   */
  sortState: SortState;

  /**
   * Current selection state.
   */
  selectionState: SelectionState;

  /**
   * Toggle sort on a column.
   */
  toggleSort(column: string): void;

  /**
   * Set sort explicitly.
   */
  setSort(column: string, direction: SortDirection): void;

  /**
   * Clear sorting.
   */
  clearSort(): void;

  /**
   * Toggle row selection.
   */
  toggleRowSelection(rowId: string): void;

  /**
   * Select a row.
   */
  selectRow(rowId: string): void;

  /**
   * Deselect a row.
   */
  deselectRow(rowId: string): void;

  /**
   * Select all rows.
   */
  selectAll(rowIds: string[]): void;

  /**
   * Deselect all rows.
   */
  deselectAll(): void;

  /**
   * Check if a row is selected.
   */
  isRowSelected(rowId: string): boolean;

  /**
   * Get selection status for header checkbox.
   */
  getSelectionStatus(totalRows: number): "all" | "some" | "none";

  /**
   * Clean up resources.
   */
  destroy(): void;
}

/**
 * Create table behavior for sorting and selection.
 *
 * @example
 * ```ts
 * const table = createTableBehavior({
 *   selectionMode: "multiple",
 *   onSortChange: (state) => {
 *     console.log("Sort:", state.column, state.direction);
 *   },
 *   onSelectionChange: (selected) => {
 *     console.log("Selected:", [...selected]);
 *   },
 * });
 *
 * // Toggle sort on name column
 * table.toggleSort("name");
 *
 * // Toggle row selection
 * table.toggleRowSelection("row-1");
 * ```
 */
export function createTableBehavior(options: TableBehaviorOptions = {}): TableBehavior {
  const {
    initialSort = { column: null, direction: "none" },
    selectionMode = "none",
    onSortChange,
    onSelectionChange,
  } = options;

  // State
  let sortState: SortState = { ...initialSort };
  const selectionState: SelectionState = {
    selectedRows: new Set(),
    mode: selectionMode,
  };

  function notifySortChange(): void {
    onSortChange?.(sortState);
  }

  function notifySelectionChange(): void {
    onSelectionChange?.(selectionState.selectedRows);
  }

  function toggleSort(column: string): void {
    if (sortState.column === column) {
      // Cycle through: asc -> desc -> none
      if (sortState.direction === "asc") {
        sortState = { column, direction: "desc" };
      } else if (sortState.direction === "desc") {
        sortState = { column: null, direction: "none" };
      } else {
        sortState = { column, direction: "asc" };
      }
    } else {
      // New column, start with asc
      sortState = { column, direction: "asc" };
    }
    notifySortChange();
  }

  function setSort(column: string, direction: SortDirection): void {
    sortState = { column, direction };
    notifySortChange();
  }

  function clearSort(): void {
    sortState = { column: null, direction: "none" };
    notifySortChange();
  }

  function toggleRowSelection(rowId: string): void {
    if (selectionState.mode === "none") return;

    if (selectionState.selectedRows.has(rowId)) {
      selectionState.selectedRows.delete(rowId);
    } else {
      if (selectionState.mode === "single") {
        selectionState.selectedRows.clear();
      }
      selectionState.selectedRows.add(rowId);
    }
    notifySelectionChange();
  }

  function selectRow(rowId: string): void {
    if (selectionState.mode === "none") return;

    if (selectionState.mode === "single") {
      selectionState.selectedRows.clear();
    }
    selectionState.selectedRows.add(rowId);
    notifySelectionChange();
  }

  function deselectRow(rowId: string): void {
    if (selectionState.mode === "none") return;

    selectionState.selectedRows.delete(rowId);
    notifySelectionChange();
  }

  function selectAll(rowIds: string[]): void {
    if (selectionState.mode !== "multiple") return;

    for (const id of rowIds) {
      selectionState.selectedRows.add(id);
    }
    notifySelectionChange();
  }

  function deselectAll(): void {
    selectionState.selectedRows.clear();
    notifySelectionChange();
  }

  function isRowSelected(rowId: string): boolean {
    return selectionState.selectedRows.has(rowId);
  }

  function getSelectionStatus(totalRows: number): "all" | "some" | "none" {
    const selectedCount = selectionState.selectedRows.size;
    if (selectedCount === 0) return "none";
    if (selectedCount === totalRows) return "all";
    return "some";
  }

  function destroy(): void {
    selectionState.selectedRows.clear();
  }

  return {
    get sortState() {
      return sortState;
    },
    get selectionState() {
      return selectionState;
    },
    toggleSort,
    setSort,
    clearSort,
    toggleRowSelection,
    selectRow,
    deselectRow,
    selectAll,
    deselectAll,
    isRowSelected,
    getSelectionStatus,
    destroy,
  };
}

/**
 * Sort data by a column.
 *
 * @example
 * ```ts
 * const sorted = sortData(users, "name", "asc", (user) => user.name);
 * ```
 */
export function sortData<T>(
  data: T[],
  column: string | null,
  direction: SortDirection,
  getValue: (item: T) => string | number | Date | null | undefined
): T[] {
  if (!column || direction === "none") {
    return data;
  }

  const sorted = [...data].sort((a, b) => {
    const valueA = getValue(a);
    const valueB = getValue(b);

    // Handle null/undefined
    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return direction === "asc" ? 1 : -1;
    if (valueB == null) return direction === "asc" ? -1 : 1;

    // Compare values
    let comparison = 0;
    if (typeof valueA === "string" && typeof valueB === "string") {
      comparison = valueA.localeCompare(valueB);
    } else if (valueA instanceof Date && valueB instanceof Date) {
      comparison = valueA.getTime() - valueB.getTime();
    } else {
      comparison = (valueA as number) - (valueB as number);
    }

    return direction === "asc" ? comparison : -comparison;
  });

  return sorted;
}
