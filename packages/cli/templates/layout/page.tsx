/**
 * Page React Component
 *
 * Page wrapper with min-height and background.
 */

import type React from "react";
import { createElement, forwardRef } from "react";

type SurfaceToken = "background" | "surface" | "surface-raised" | "surface-sunken" | "muted";
type MinHeightValue = "viewport" | "full";

export interface PageProps {
  /** Background color token. */
  bg?: SurfaceToken;
  /** Minimum height. */
  minHeight?: MinHeightValue;
  /** Additional CSS class names. */
  className?: string;
  /** Children elements. */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-page Web Component.
 */
export const Page = forwardRef<HTMLElement, PageProps>((props, ref) => {
  const { bg = "background", minHeight = "viewport", className, children, ...rest } = props;

  return createElement(
    "ds-page",
    {
      ref,
      bg,
      "min-height": minHeight,
      class: className,
      ...rest,
    },
    children
  );
});

Page.displayName = "Page";
