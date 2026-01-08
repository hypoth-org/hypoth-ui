"use client";

import { type HTMLAttributes, type ReactNode, createElement, forwardRef } from "react";
import "@ds/wc";

export interface TableHeaderProps extends HTMLAttributes<HTMLElement> {
  /**
   * Table header rows.
   */
  children?: ReactNode;
}

/**
 * Table header component (thead).
 */
export const TableHeader = forwardRef<HTMLElement, TableHeaderProps>(function TableHeader(
  { children, className, ...props },
  ref
) {
  return createElement("ds-table-header", { ref, class: className, ...props }, children);
});
