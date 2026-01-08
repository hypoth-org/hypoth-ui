"use client";

import { forwardRef, createElement, type HTMLAttributes } from "react";
import "@ds/wc";

export type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";
export type SkeletonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SkeletonWidth = "full" | "3/4" | "1/2" | "1/4";
export type SkeletonAnimation = "wave" | "pulse" | "none";

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /**
   * Shape variant.
   * @default "text"
   */
  variant?: SkeletonVariant;

  /**
   * Size preset for height.
   */
  size?: SkeletonSize;

  /**
   * Width preset.
   */
  width?: SkeletonWidth;

  /**
   * Custom width (CSS value).
   */
  customWidth?: string;

  /**
   * Custom height (CSS value).
   */
  customHeight?: string;

  /**
   * Animation type.
   * @default "wave"
   */
  animation?: SkeletonAnimation;

  /**
   * Accessible label for screen readers.
   * @default "Loading..."
   */
  label?: string;
}

/**
 * Skeleton loading placeholder component for content that is loading.
 *
 * @example
 * ```tsx
 * // Text skeleton
 * <Skeleton variant="text" width="3/4" />
 *
 * // Circular avatar skeleton
 * <Skeleton variant="circular" customWidth="40px" customHeight="40px" />
 *
 * // Card skeleton layout
 * <div className="space-y-2">
 *   <Skeleton variant="rectangular" customHeight="200px" />
 *   <Skeleton variant="text" width="1/2" />
 *   <Skeleton variant="text" />
 *   <Skeleton variant="text" width="3/4" />
 * </div>
 * ```
 */
export const Skeleton = forwardRef<HTMLElement, SkeletonProps>(function Skeleton(
  {
    variant = "text",
    size,
    width,
    customWidth,
    customHeight,
    animation = "wave",
    label = "Loading...",
    className,
    ...props
  },
  ref
) {
  return createElement("ds-skeleton", {
    ref,
    variant,
    size,
    width,
    "custom-width": customWidth,
    "custom-height": customHeight,
    animation,
    label,
    class: className,
    ...props,
  });
});

// TypeScript declaration for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ds-skeleton": SkeletonProps & {
        ref?: React.Ref<HTMLElement>;
        "custom-width"?: string;
        "custom-height"?: string;
      };
    }
  }
}
