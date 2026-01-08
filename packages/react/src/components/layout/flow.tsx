/**
 * Flow React Component
 *
 * Primary 1D layout primitive with responsive direction switching.
 */

import type React from "react";
import { createElement, forwardRef, useMemo } from "react";
import { type ResponsiveValue, parseResponsiveValue } from "../../hooks/use-responsive-classes.js";

type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
type SpacingToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export interface FlowProps {
  /** Flex direction. Supports responsive object syntax. */
  direction?: ResponsiveValue<FlexDirection>;
  /** Gap between children. Supports responsive object syntax. */
  gap?: ResponsiveValue<SpacingToken>;
  /** Cross-axis alignment. */
  align?: FlexAlign;
  /** Main-axis alignment. */
  justify?: FlexJustify;
  /** Flex wrap behavior. */
  wrap?: FlexWrap;
  /** Use inline-flex instead of flex. */
  inline?: boolean;
  /** Additional CSS class names. */
  className?: string;
  /** Children elements. */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-flow Web Component.
 */
export const Flow = forwardRef<HTMLElement, FlowProps>((props, ref) => {
  const {
    direction = "row",
    gap = "none",
    align = "stretch",
    justify = "start",
    wrap = "nowrap",
    inline = false,
    className,
    children,
    ...rest
  } = props;

  // Parse responsive values
  const directionResult = useMemo(
    () => parseResponsiveValue("flow", "dir", direction),
    [direction]
  );
  const gapResult = useMemo(() => parseResponsiveValue("flow", "gap", gap), [gap]);

  // Combine all classes
  const allClasses = useMemo(() => {
    const classes = [...directionResult.classes, ...gapResult.classes];
    if (className) classes.push(className);
    return classes.join(" ") || undefined;
  }, [directionResult.classes, gapResult.classes, className]);

  return createElement(
    "ds-flow",
    {
      ref,
      direction: directionResult.baseValue,
      gap: gapResult.baseValue,
      align,
      justify,
      wrap,
      inline: inline || undefined,
      class: allClasses,
      ...rest,
    },
    children
  );
});

Flow.displayName = "Flow";
