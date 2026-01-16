"use client";

import { type ReactNode, createElement, forwardRef, useEffect, useRef } from "react";

// Define types locally (mirroring WC types)
export type DataTableSortDirection = "asc" | "desc" | "none";

export interface DataTableColumn {
  id: string;
  header: string;
  accessor?: string;
  sortable?: boolean;
  resizable?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableSort {
  column: string;
  direction: DataTableSortDirection;
}

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface DataTableProps {
  /**
   * Enable virtualization for large datasets.
   * @default false
   */
  virtualized?: boolean;

  /**
   * Row height for virtualization (in pixels).
   * @default 48
   */
  rowHeight?: number;

  /**
   * Number of overscan rows for virtualization.
   * @default 5
   */
  overscan?: number;

  /**
   * Total number of rows (for server-side pagination).
   * @default 0
   */
  totalRows?: number;

  /**
   * Current page (1-indexed).
   * @default 1
   */
  page?: number;

  /**
   * Page size.
   * @default 10
   */
  pageSize?: number;

  /**
   * Available page sizes as comma-separated string.
   * @default "10,25,50,100"
   */
  pageSizes?: string;

  /**
   * Enable row selection.
   * @default false
   */
  selectable?: boolean;

  /**
   * Selection mode.
   * @default "multiple"
   */
  selectionMode?: "single" | "multiple";

  /**
   * Show loading state.
   * @default false
   */
  loading?: boolean;

  /**
   * Sort column ID.
   */
  sortColumn?: string;

  /**
   * Sort direction.
   * @default "none"
   */
  sortDirection?: "asc" | "desc" | "none";

  /**
   * Filter/search query.
   */
  filter?: string;

  /**
   * Empty state message.
   * @default "No data available"
   */
  emptyMessage?: string;

  /**
   * Callback when sort changes.
   */
  onSort?: (detail: { column: string; direction: "asc" | "desc" | "none" }) => void;

  /**
   * Callback when page changes.
   */
  onPageChange?: (detail: { page: number }) => void;

  /**
   * Callback when page size changes.
   */
  onPageSizeChange?: (detail: { pageSize: number }) => void;

  /**
   * Callback when row selection changes.
   */
  onSelectionChange?: (detail: { selectedRows: string[] }) => void;

  /**
   * Table content (use Table sub-components).
   */
  children?: ReactNode;

  /**
   * Additional class name.
   */
  className?: string;
}

/**
 * DataTable component for displaying large datasets with virtualization,
 * pagination, sorting, and selection support.
 *
 * @example
 * ```tsx
 * <DataTable
 *   totalRows={100}
 *   page={1}
 *   pageSize={10}
 *   selectable
 *   onPageChange={(detail) => console.log(detail.page)}
 * >
 *   <Table>
 *     <TableHeader>...</TableHeader>
 *     <TableBody>...</TableBody>
 *   </Table>
 * </DataTable>
 * ```
 */
export const DataTable = forwardRef<HTMLElement, DataTableProps>(function DataTable(
  {
    virtualized = false,
    rowHeight = 48,
    overscan = 5,
    totalRows = 0,
    page = 1,
    pageSize = 10,
    pageSizes = "10,25,50,100",
    selectable = false,
    selectionMode = "multiple",
    loading = false,
    sortColumn,
    sortDirection = "none",
    filter,
    emptyMessage = "No data available",
    onSort,
    onPageChange,
    onPageSizeChange,
    onSelectionChange,
    children,
    className,
  },
  forwardedRef
) {
  const internalRef = useRef<HTMLElement>(null);

  // Sync forwarded ref with internal ref
  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  // Set up event listeners
  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    const handleSort = (e: Event) => {
      const event = e as CustomEvent;
      onSort?.(event.detail);
    };

    const handlePageChange = (e: Event) => {
      const event = e as CustomEvent;
      onPageChange?.(event.detail);
    };

    const handlePageSizeChange = (e: Event) => {
      const event = e as CustomEvent;
      onPageSizeChange?.(event.detail);
    };

    const handleSelectionChange = (e: Event) => {
      const event = e as CustomEvent;
      onSelectionChange?.(event.detail);
    };

    element.addEventListener("ds:sort", handleSort);
    element.addEventListener("ds:page-change", handlePageChange);
    element.addEventListener("ds:page-size-change", handlePageSizeChange);
    element.addEventListener("ds:selection-change", handleSelectionChange);

    return () => {
      element.removeEventListener("ds:sort", handleSort);
      element.removeEventListener("ds:page-change", handlePageChange);
      element.removeEventListener("ds:page-size-change", handlePageSizeChange);
      element.removeEventListener("ds:selection-change", handleSelectionChange);
    };
  }, [onSort, onPageChange, onPageSizeChange, onSelectionChange]);

  return createElement(
    "ds-data-table",
    {
      ref: internalRef,
      virtualized: virtualized || undefined,
      "row-height": rowHeight,
      overscan,
      "total-rows": totalRows,
      page,
      "page-size": pageSize,
      "page-sizes": pageSizes,
      selectable: selectable || undefined,
      "selection-mode": selectionMode,
      loading: loading || undefined,
      "sort-column": sortColumn,
      "sort-direction": sortDirection,
      filter,
      "empty-message": emptyMessage,
      class: className,
    },
    children
  );
});

DataTable.displayName = "DataTable";
