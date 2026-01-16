"use client";

import { type HTMLAttributes, type ReactNode, createElement, forwardRef } from "react";
import "@ds/wc";
import {
  type ResponsiveProp,
  generateResponsiveDataAttr,
  isResponsiveObject,
  resolveResponsiveValue,
} from "@/lib/primitives/responsive.js";
import type { AvatarSize } from "./avatar.js";

export interface AvatarGroupProps extends HTMLAttributes<HTMLElement> {
  /**
   * Maximum number of avatars to display before showing overflow.
   * @default 5
   */
  max?: number;

  /**
   * Size variant (inherited by child avatars) - supports responsive object syntax.
   * @default "md"
   * @example
   * ```tsx
   * // Single value
   * <AvatarGroup size="md">...</AvatarGroup>
   *
   * // Responsive
   * <AvatarGroup size={{ base: "sm", md: "lg" }}>...</AvatarGroup>
   * ```
   */
  size?: ResponsiveProp<AvatarSize>;

  /**
   * Avatar children.
   */
  children?: ReactNode;
}

/**
 * Avatar group component for displaying multiple avatars with overflow indicator.
 *
 * @example
 * ```tsx
 * <AvatarGroup max={3}>
 *   <Avatar name="Alice" />
 *   <Avatar name="Bob" />
 *   <Avatar name="Charlie" />
 *   <Avatar name="Diana" />
 *   <Avatar name="Eve" />
 * </AvatarGroup>
 * // Shows 3 avatars + "+2" overflow indicator
 * ```
 */
export const AvatarGroup = forwardRef<HTMLElement, AvatarGroupProps>(function AvatarGroup(
  { max = 5, size = "md", children, className, ...props },
  ref
) {
  // Resolve responsive size - use base value for the WC attribute
  const resolvedSize = resolveResponsiveValue(size, "md");
  const isResponsive = isResponsiveObject(size);
  const responsiveSizeAttr = isResponsive ? generateResponsiveDataAttr(size) : undefined;

  return createElement(
    "ds-avatar-group",
    {
      ref,
      max,
      size: resolvedSize,
      class: className,
      // Add responsive data attribute for CSS targeting
      "data-size-responsive": responsiveSizeAttr,
      ...props,
    },
    children
  );
});

// TypeScript declaration for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ds-avatar-group": AvatarGroupProps & {
        ref?: React.Ref<HTMLElement>;
      };
    }
  }
}
