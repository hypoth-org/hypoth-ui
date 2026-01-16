/**
 * Separator component React wrapper.
 *
 * @example
 * ```tsx
 * import { Separator } from "@ds/react";
 *
 * <Separator />
 * <Separator orientation="vertical" />
 * <Separator decorative />
 * ```
 */

import { type HTMLAttributes, createElement, forwardRef } from "react";

// ============================================================================
// Types
// ============================================================================

export type SeparatorOrientation = "horizontal" | "vertical";

export interface SeparatorProps extends HTMLAttributes<HTMLElement> {
  /** Visual orientation of the separator */
  orientation?: SeparatorOrientation;
  /** Whether the separator is purely decorative (no semantic meaning) */
  decorative?: boolean;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Separator component - visual divider between content sections.
 */
export const Separator = forwardRef<HTMLElement, SeparatorProps>(function Separator(
  { className, orientation = "horizontal", decorative = false, ...props },
  ref
) {
  return createElement("ds-separator", {
    ref,
    class: className,
    orientation,
    decorative: decorative || undefined,
    ...props,
  });
});

Separator.displayName = "Separator";
