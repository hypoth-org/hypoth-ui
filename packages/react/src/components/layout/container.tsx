/**
 * Container React Component
 *
 * Constrains content width with responsive max-widths and padding.
 */

import type React from "react";
import { createElement, forwardRef } from "react";

type ContainerSizeToken = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
type SpacingToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export interface ContainerProps {
  /** Maximum width constraint. */
  size?: ContainerSizeToken;
  /** Horizontal padding. */
  padding?: SpacingToken;
  /** Additional CSS class names. */
  className?: string;
  /** Children elements. */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-container Web Component.
 */
export const Container = forwardRef<HTMLElement, ContainerProps>((props, ref) => {
  const { size = "lg", padding = "md", className, children, ...rest } = props;

  return createElement(
    "ds-container",
    {
      ref,
      size,
      padding,
      class: className,
      ...rest,
    },
    children
  );
});

Container.displayName = "Container";
