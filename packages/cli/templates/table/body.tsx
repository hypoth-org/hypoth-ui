"use client";

import { type HTMLAttributes, type ReactNode, createElement, forwardRef } from "react";
import "@ds/wc";

export interface TableBodyProps extends HTMLAttributes<HTMLElement> {
  /**
   * Table body rows.
   */
  children?: ReactNode;
}

/**
 * Table body component (tbody).
 */
export const TableBody = forwardRef<HTMLElement, TableBodyProps>(function TableBody(
  { children, className, ...props },
  ref
) {
  return createElement("ds-table-body", { ref, class: className, ...props }, children);
});
