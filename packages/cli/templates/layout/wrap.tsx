/**
 * Wrap React Component
 *
 * Wrapping row layout for tags/chips.
 */

import type React from "react";
import { createElement, forwardRef } from "react";

type SpacingToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
type FlexAlign = "start" | "center" | "end";

export interface WrapProps {
  /** Gap between items. */
  gap?: SpacingToken;
  /** Row gap override. */
  rowGap?: SpacingToken;
  /** Cross-axis alignment. */
  align?: FlexAlign;
  /** Additional CSS class names. */
  className?: string;
  /** Children elements. */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-wrap Web Component.
 */
export const Wrap = forwardRef<HTMLElement, WrapProps>((props, ref) => {
  const { gap = "sm", rowGap, align = "start", className, children, ...rest } = props;

  return createElement(
    "ds-wrap",
    {
      ref,
      gap,
      "row-gap": rowGap,
      align,
      class: className,
      ...rest,
    },
    children
  );
});

Wrap.displayName = "Wrap";
