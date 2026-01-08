"use client";

import { type HTMLAttributes, createElement, forwardRef } from "react";
import "@ds/wc";

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
   * Size variant.
   * @default "md"
   */
  size?: AvatarSize;

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
  return createElement("ds-avatar", {
    ref,
    src,
    alt,
    name,
    size,
    shape,
    status,
    "show-status": showStatus || undefined,
    class: className,
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
