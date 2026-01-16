"use client";

import { type HTMLAttributes, createElement, forwardRef } from "react";
import "@ds/wc";
import {
  type ResponsiveProp,
  generateResponsiveDataAttr,
  isResponsiveObject,
  resolveResponsiveValue,
} from "@/lib/primitives/responsive.js";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgePosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export interface BadgeProps extends Omit<HTMLAttributes<HTMLElement>, "content"> {
  /**
   * Badge content/count.
   */
  content?: string | number;

  /**
   * Maximum count to show. Displays "{max}+" if exceeded.
   */
  max?: number;

  /**
   * Color variant.
   * @default "primary"
   */
  variant?: BadgeVariant;

  /**
   * Size variant - supports responsive object syntax.
   * @default "md"
   * @example
   * ```tsx
   * // Single value
   * <Badge content={5} size="md" />
   *
   * // Responsive
   * <Badge content={5} size={{ base: "sm", md: "md" }} />
   * ```
   */
  size?: ResponsiveProp<BadgeSize>;

  /**
   * Use outline style.
   * @default false
   */
  outline?: boolean;

  /**
   * Show as dot (no content).
   * @default false
   */
  dot?: boolean;

  /**
   * Position when used in wrapper.
   * @default "top-right"
   */
  position?: BadgePosition;

  /**
   * Show pulse animation.
   * @default false
   */
  pulse?: boolean;
}

/**
 * Badge component for counts, notifications, and status indicators.
 *
 * @example
 * ```tsx
 * // Count badge
 * <Badge content={5} variant="error" />
 *
 * // Max count
 * <Badge content={150} max={99} />
 *
 * // Dot indicator
 * <Badge dot variant="success" />
 * ```
 */
export const Badge = forwardRef<HTMLElement, BadgeProps>(function Badge(
  {
    content,
    max,
    variant = "primary",
    size = "md",
    outline = false,
    dot = false,
    position = "top-right",
    pulse = false,
    className,
    ...props
  },
  ref
) {
  // Resolve responsive size - use base value for the WC attribute
  const resolvedSize = resolveResponsiveValue(size, "md");
  const isResponsive = isResponsiveObject(size);
  const responsiveSizeAttr = isResponsive ? generateResponsiveDataAttr(size) : undefined;

  return createElement("ds-badge", {
    ref,
    content: content?.toString() ?? "",
    max,
    variant,
    size: resolvedSize,
    outline: outline || undefined,
    dot: dot || undefined,
    position,
    pulse: pulse || undefined,
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
      "ds-badge": BadgeProps & {
        ref?: React.Ref<HTMLElement>;
      };
    }
  }
}
