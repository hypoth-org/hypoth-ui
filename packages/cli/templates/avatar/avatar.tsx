"use client";

import { type HTMLAttributes, createElement, forwardRef } from "react";
import "@ds/wc";
import {
  type ResponsiveProp,
  generateResponsiveDataAttr,
  isResponsiveObject,
  resolveResponsiveValue,
} from "@/lib/primitives/responsive.js";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarShape = "circle" | "square";
export type AvatarStatus = "online" | "offline" | "away" | "busy";

export interface AvatarProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /**
   * Image source URL.
   */
  src?: string;

  /**
   * Alt text for image.
   */
  alt?: string;

  /**
   * User's name (used for initials fallback).
   */
  name?: string;

  /**
   * Size variant - supports responsive object syntax.
   * @default "md"
   * @example
   * ```tsx
   * // Single value
   * <Avatar name="John Doe" size="md" />
   *
   * // Responsive
   * <Avatar name="John Doe" size={{ base: "sm", md: "lg" }} />
   * ```
   */
  size?: ResponsiveProp<AvatarSize>;

  /**
   * Shape variant.
   * @default "circle"
   */
  shape?: AvatarShape;

  /**
   * Status indicator.
   */
  status?: AvatarStatus;

  /**
   * Whether to show status indicator.
   * @default false
   */
  showStatus?: boolean;
}

/**
 * Avatar component for user representation with image, initials fallback, and status indicators.
 *
 * @example
 * ```tsx
 * // With image
 * <Avatar src="/user.jpg" alt="John Doe" name="John Doe" />
 *
 * // With initials fallback
 * <Avatar name="John Doe" />
 *
 * // With status indicator
 * <Avatar name="John" status="online" showStatus />
 * ```
 */
export const Avatar = forwardRef<HTMLElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    name,
    size = "md",
    shape = "circle",
    status,
    showStatus = false,
    className,
    ...props
  },
  ref
) {
  // Resolve responsive size - use base value for the WC attribute
  const resolvedSize = resolveResponsiveValue(size, "md");
  const isResponsive = isResponsiveObject(size);
  const responsiveSizeAttr = isResponsive ? generateResponsiveDataAttr(size) : undefined;

  return createElement("ds-avatar", {
    ref,
    src,
    alt,
    name,
    size: resolvedSize,
    shape,
    status,
    "show-status": showStatus || undefined,
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
      "ds-avatar": AvatarProps & {
        ref?: React.Ref<HTMLElement>;
        "show-status"?: boolean;
      };
    }
  }
}
