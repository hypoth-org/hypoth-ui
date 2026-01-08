/**
 * Section React Component
 *
 * Semantic section wrapper with consistent vertical spacing.
 */

import type React from "react";
import { createElement, forwardRef } from "react";

type SpacingToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export interface SectionProps {
  /** Vertical padding. */
  spacing?: SpacingToken;
  /** Additional CSS class names. */
  className?: string;
  /** Children elements. */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-section Web Component.
 */
export const Section = forwardRef<HTMLElement, SectionProps>((props, ref) => {
  const { spacing = "lg", className, children, ...rest } = props;

  return createElement(
    "ds-section",
    {
      ref,
      spacing,
      class: className,
      ...rest,
    },
    children
  );
});

Section.displayName = "Section";
