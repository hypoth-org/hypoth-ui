"use client";

import { type HTMLAttributes, type ReactNode, createElement, forwardRef } from "react";
import "@ds/wc";

export interface TableRowProps extends HTMLAttributes<HTMLElement> {
  /**
   * Row ID for selection tracking.
   */
  rowId?: string;

  /**
   * Whether this row is selected.
   * @default false
   */
  selected?: boolean;

  /**
   * Row cells.
   */
  children?: ReactNode;
}

/**
 * Table row component (tr).
 */
export const TableRow = forwardRef<HTMLElement, TableRowProps>(function TableRow(
  { rowId, selected = false, children, className, ...props },
  ref
) {
  return createElement(
    "ds-table-row",
    { ref, "row-id": rowId, selected: selected || undefined, class: className, ...props },
    children
  );
});
