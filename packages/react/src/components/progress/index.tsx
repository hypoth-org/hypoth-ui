"use client";

import { type HTMLAttributes, createElement, forwardRef } from "react";
import "@ds/wc";
import {
  type ResponsiveProp,
  generateResponsiveDataAttr,
  isResponsiveObject,
  resolveResponsiveValue,
} from "../../primitives/responsive.js";

export type ProgressVariant = "linear" | "circular";
export type ProgressSize = "sm" | "md" | "lg";

export interface ProgressProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /**
   * Current progress value (0-100). Omit for indeterminate.
   */
  value?: number;

  /**
   * Maximum value.
   * @default 100
   */
  max?: number;

  /**
   * Visual variant.
   * @default "linear"
   */
  variant?: ProgressVariant;

  /**
   * Size variant - supports responsive object syntax.
   * @default "md"
   * @example
   * ```tsx
   * // Single value
   * <Progress value={75} size="md" />
   *
   * // Responsive
   * <Progress value={75} size={{ base: "sm", md: "lg" }} />
   * ```
   */
  size?: ResponsiveProp<ProgressSize>;

  /**
   * Accessible label.
   */
  label?: string;

  /**
   * Show value as percentage text (circular only).
   * @default false
   */
  showValue?: boolean;
}

/**
 * Progress indicator component for showing loading or completion status.
 *
 * @example
 * ```tsx
 * // Determinate linear progress
 * <Progress value={75} label="Uploading..." />
 *
 * // Indeterminate circular progress
 * <Progress variant="circular" label="Loading" />
 *
 * // Circular with percentage display
 * <Progress variant="circular" value={45} showValue />
 * ```
 */
export const Progress = forwardRef<HTMLElement, ProgressProps>(function Progress(
  {
    value,
    max = 100,
    variant = "linear",
    size = "md",
    label,
    showValue = false,
    className,
    ...props
  },
  ref
) {
  // Resolve responsive size - use base value for the WC attribute
  const resolvedSize = resolveResponsiveValue(size, "md");
  const isResponsive = isResponsiveObject(size);
  const responsiveSizeAttr = isResponsive ? generateResponsiveDataAttr(size) : undefined;

  return createElement("ds-progress", {
    ref,
    value,
    max,
    variant,
    size: resolvedSize,
    label,
    "show-value": showValue || undefined,
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
      "ds-progress": ProgressProps & {
        ref?: React.Ref<HTMLElement>;
        "show-value"?: boolean;
      };
    }
  }
}
