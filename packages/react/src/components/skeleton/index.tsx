"use client";

import { type HTMLAttributes, createElement, forwardRef } from "react";
import "@ds/wc";
import {
  type ResponsiveProp,
  generateResponsiveDataAttr,
  isResponsiveObject,
  resolveResponsiveValue,
} from "../../primitives/responsive.js";

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
   * Size preset for height - supports responsive object syntax.
   * @example
   * ```tsx
   * // Single value
   * <Skeleton size="md" />
   *
   * // Responsive
   * <Skeleton size={{ base: "sm", md: "lg" }} />
   * ```
   */
  size?: ResponsiveProp<SkeletonSize>;

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
  // Resolve responsive size - use base value for the WC attribute
  const resolvedSize = size ? resolveResponsiveValue(size, "md") : undefined;
  const isResponsive = size ? isResponsiveObject(size) : false;
  const responsiveSizeAttr = isResponsive ? generateResponsiveDataAttr(size!) : undefined;

  return createElement("ds-skeleton", {
    ref,
    variant,
    size: resolvedSize,
    width,
    "custom-width": customWidth,
    "custom-height": customHeight,
    animation,
    label,
    class: className,
    // Add responsive data attribute for CSS targeting
    "data-size-responsive": responsiveSizeAttr,
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
