"use client";

import { type HTMLAttributes, type ReactNode, createElement, forwardRef } from "react";
import "@ds/wc";
import type { TableAlign } from "./head.js";

export interface TableCellProps extends HTMLAttributes<HTMLElement> {
  /**
   * Text alignment.
   * @default "left"
   */
  align?: TableAlign;

  /**
   * Column span.
   * @default 1
   */
  colSpan?: number;

  /**
   * Row span.
   * @default 1
   */
  rowSpan?: number;

  /**
   * Cell content.
   */
  children?: ReactNode;
}

/**
 * Table cell component (td).
 */
export const TableCell = forwardRef<HTMLElement, TableCellProps>(function TableCell(
  { align = "left", colSpan = 1, rowSpan = 1, children, className, ...props },
  ref
) {
  return createElement(
    "ds-table-cell",
    { ref, align, colspan: colSpan, rowspan: rowSpan, class: className, ...props },
    children
  );
});
