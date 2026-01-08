/**
 * Box React Component
 *
 * Token-only styling escape hatch for padding, background, and radius.
 */

import type React from "react";
import { createElement, forwardRef } from "react";

type SpacingToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
type SurfaceToken = "background" | "surface" | "surface-raised" | "surface-sunken" | "muted";
type RadiusToken = "none" | "sm" | "md" | "lg" | "xl" | "full";

export interface BoxProps {
  /** Padding (all sides). */
  p?: SpacingToken;
  /** Horizontal padding. */
  px?: SpacingToken;
  /** Vertical padding. */
  py?: SpacingToken;
  /** Background color token. */
  bg?: SurfaceToken;
  /** Border radius token. */
  radius?: RadiusToken;
  /** Additional CSS class names. */
  className?: string;
  /** Children elements. */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-box Web Component.
 */
export const Box = forwardRef<HTMLElement, BoxProps>((props, ref) => {
  const { p, px, py, bg, radius, className, children, ...rest } = props;

  return createElement(
    "ds-box",
    {
      ref,
      p,
      px,
      py,
      bg,
      radius,
      class: className,
      ...rest,
    },
    children
  );
});

Box.displayName = "Box";
