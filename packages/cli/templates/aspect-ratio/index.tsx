/**
 * AspectRatio component React wrapper.
 *
 * @example
 * ```tsx
 * import { AspectRatio } from "@ds/react";
 *
 * <AspectRatio ratio="16/9">
 *   <img src="image.jpg" alt="..." />
 * </AspectRatio>
 * ```
 */

import { type HTMLAttributes, type ReactNode, createElement, forwardRef } from "react";

// ============================================================================
// Types
// ============================================================================

export interface AspectRatioProps extends HTMLAttributes<HTMLElement> {
  /** Content to maintain aspect ratio */
  children?: ReactNode;
  /**
   * Aspect ratio as width/height (e.g., "16/9", "4/3", "1/1").
   * Can also be a number (e.g., 1.777 for 16:9).
   */
  ratio?: string | number;
}

// ============================================================================
// Component
// ============================================================================

/**
 * AspectRatio component - maintains consistent width-to-height ratio.
 */
export const AspectRatio = forwardRef<HTMLElement, AspectRatioProps>(function AspectRatio(
  { children, className, ratio = "1/1", ...props },
  ref
) {
  const ratioString = typeof ratio === "number" ? String(ratio) : ratio;

  return createElement(
    "ds-aspect-ratio",
    { ref, class: className, ratio: ratioString, ...props },
    children
  );
});

AspectRatio.displayName = "AspectRatio";
