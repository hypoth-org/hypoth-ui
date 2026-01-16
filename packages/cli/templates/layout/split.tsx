/**
 * Split React Component
 *
 * Two-region layout with collapse breakpoint.
 */

import type React from "react";
import { createElement, forwardRef } from "react";

type BreakpointToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
type SpacingToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
type SplitRatio = "equal" | "1:2" | "2:1" | "1:3" | "3:1";

export interface SplitProps {
  /** Breakpoint at which to collapse to single column. */
  collapseAt?: BreakpointToken;
  /** Gap between regions. */
  gap?: SpacingToken;
  /** Width ratio between regions. */
  ratio?: SplitRatio;
  /** Additional CSS class names. */
  className?: string;
  /** Children elements (should be exactly 2). */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-split Web Component.
 */
export const Split = forwardRef<HTMLElement, SplitProps>((props, ref) => {
  const { collapseAt = "md", gap = "md", ratio = "equal", className, children, ...rest } = props;

  return createElement(
    "ds-split",
    {
      ref,
      "collapse-at": collapseAt,
      gap,
      ratio,
      class: className,
      ...rest,
    },
    children
  );
});

Split.displayName = "Split";
