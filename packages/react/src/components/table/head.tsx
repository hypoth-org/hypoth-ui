"use client";

import { forwardRef, createElement, useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import "@ds/wc";

export type TableAlign = "left" | "center" | "right";
export type SortDirection = "asc" | "desc" | "none";

export interface TableHeadProps extends HTMLAttributes<HTMLElement> {
  /**
   * Column key for sorting.
   */
  column?: string;

  /**
   * Text alignment.
   * @default "left"
   */
  align?: TableAlign;

  /**
   * Whether this column is sortable.
   * @default false
   */
  sortable?: boolean;

  /**
   * Current sort direction.
   * @default "none"
   */
  sortDirection?: SortDirection;

  /**
   * Column width (CSS value).
   */
  width?: string;

  /**
   * Callback when sort is triggered.
   */
  onSort?: (column: string, direction: SortDirection) => void;

  /**
   * Header cell content.
   */
  children?: ReactNode;
}

/**
 * Table header cell component (th).
 */
export const TableHead = forwardRef<HTMLElement, TableHeadProps>(function TableHead(
  {
    column,
    align = "left",
    sortable = false,
    sortDirection = "none",
    width,
    onSort,
    children,
    className,
    ...props
  },
  forwardedRef
) {
  const internalRef = useRef<HTMLElement>(null);

  // Sync forwarded ref
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
      const event = e as CustomEvent<{ column: string; direction: SortDirection }>;
      onSort?.(event.detail.column, event.detail.direction);
    };

    element.addEventListener("ds:sort", handleSort);
    return () => element.removeEventListener("ds:sort", handleSort);
  }, [onSort]);

  return createElement(
    "ds-table-head",
    {
      ref: internalRef,
      column,
      align,
      sortable: sortable || undefined,
      "sort-direction": sortDirection,
      width,
      class: className,
      ...props,
    },
    children
  );
});
