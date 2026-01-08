"use client";

import { forwardRef, createElement, type HTMLAttributes, type ReactNode } from "react";
import "@ds/wc";
import type { AvatarSize } from "./avatar.js";

export interface AvatarGroupProps extends HTMLAttributes<HTMLElement> {
  /**
   * Maximum number of avatars to display before showing overflow.
   * @default 5
   */
  max?: number;

  /**
   * Size variant (inherited by child avatars).
   * @default "md"
   */
  size?: AvatarSize;

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
  return createElement(
    "ds-avatar-group",
    { ref, max, size, class: className, ...props },
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
