/**
 * Center React Component
 *
 * Centers content horizontally/vertically with optional max-width.
 */

import type React from "react";
import { createElement, forwardRef } from "react";

type ContainerSizeToken = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface CenterProps {
  /** Maximum width constraint. */
  maxWidth?: ContainerSizeToken;
  /** Enable vertical centering. */
  vertical?: boolean;
  /** Additional CSS class names. */
  className?: string;
  /** Children elements. */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-center Web Component.
 */
export const Center = forwardRef<HTMLElement, CenterProps>((props, ref) => {
  const { maxWidth, vertical = false, className, children, ...rest } = props;

  return createElement(
    "ds-center",
    {
      ref,
      "max-width": maxWidth,
      vertical: vertical || undefined,
      class: className,
      ...rest,
    },
    children
  );
});

Center.displayName = "Center";
