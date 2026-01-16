"use client";

import { type HTMLAttributes, type ReactNode, createElement, forwardRef } from "react";
import "@ds/wc";

export type TableSize = "compact" | "default" | "spacious";

export interface TableRootProps extends HTMLAttributes<HTMLElement> {
  /**
   * Size variant.
   * @default "default"
   */
  size?: TableSize;

  /**
   * Whether to show striped rows.
   * @default false
   */
  striped?: boolean;

  /**
   * Whether to remove borders.
   * @default false
   */
  borderless?: boolean;

  /**
   * Whether to use fixed layout.
   * @default false
   */
  fixed?: boolean;

  /**
   * Whether header is sticky.
   * @default false
   */
  stickyHeader?: boolean;

  /**
   * Accessible caption for screen readers.
   */
  caption?: string;

  /**
   * Table content.
   */
  children?: ReactNode;
}

/**
 * Table root component.
 */
export const TableRoot = forwardRef<HTMLElement, TableRootProps>(function TableRoot(
  {
    size = "default",
    striped = false,
    borderless = false,
    fixed = false,
    stickyHeader = false,
    caption,
    children,
    className,
    ...props
  },
  ref
) {
  return createElement(
    "ds-table",
    {
      ref,
      size,
      striped: striped || undefined,
      borderless: borderless || undefined,
      fixed: fixed || undefined,
      "sticky-header": stickyHeader || undefined,
      caption,
      class: className,
      ...props,
    },
    children
  );
});
