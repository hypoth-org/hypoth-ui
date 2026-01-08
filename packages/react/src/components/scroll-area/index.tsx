/**
 * ScrollArea compound component exports.
 *
 * ScrollArea provides custom styled scrollbars for content containers.
 *
 * @example
 * ```tsx
 * import { ScrollArea } from "@ds/react";
 *
 * <ScrollArea.Root style={{ height: "200px" }}>
 *   <ScrollArea.Viewport>
 *     <!-- Long content here -->
 *   </ScrollArea.Viewport>
 *   <ScrollArea.Scrollbar orientation="vertical">
 *     <ScrollArea.Thumb />
 *   </ScrollArea.Scrollbar>
 * </ScrollArea.Root>
 * ```
 */

import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  createElement,
  forwardRef,
} from "react";

// ============================================================================
// Types
// ============================================================================

export type ScrollAreaType = "auto" | "always" | "scroll" | "hover";

export interface ScrollAreaRootProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** When scrollbars are visible */
  type?: ScrollAreaType;
  /** Scroll hide delay in ms (for hover type) */
  scrollHideDelay?: number;
  /** Orientation for which to show scrollbar */
  orientation?: "vertical" | "horizontal" | "both";
  /** Custom styles */
  style?: CSSProperties;
}

export interface ScrollAreaViewportProps extends HTMLAttributes<HTMLElement> {
  /** Scrollable content */
  children?: ReactNode;
}

export interface ScrollAreaScrollbarProps extends HTMLAttributes<HTMLElement> {
  /** Scrollbar content (typically a thumb) */
  children?: ReactNode;
  /** Scrollbar orientation */
  orientation?: "vertical" | "horizontal";
}

export interface ScrollAreaThumbProps extends HTMLAttributes<HTMLElement> {}

// ============================================================================
// Components
// ============================================================================

/**
 * ScrollArea root component.
 */
const ScrollAreaRoot = forwardRef<HTMLElement, ScrollAreaRootProps>(
  function ScrollAreaRoot(
    {
      children,
      className,
      type = "hover",
      scrollHideDelay = 600,
      orientation = "vertical",
      style,
      ...props
    },
    ref
  ) {
    return createElement(
      "ds-scroll-area",
      {
        ref,
        class: className,
        type,
        "scroll-hide-delay": scrollHideDelay,
        orientation,
        style,
        ...props,
      },
      children
    );
  }
);
ScrollAreaRoot.displayName = "ScrollArea.Root";

/**
 * ScrollArea viewport component.
 */
const ScrollAreaViewport = forwardRef<HTMLElement, ScrollAreaViewportProps>(
  function ScrollAreaViewport({ children, className, ...props }, ref) {
    return createElement(
      "ds-scroll-area-viewport",
      { ref, class: className, ...props },
      children
    );
  }
);
ScrollAreaViewport.displayName = "ScrollArea.Viewport";

/**
 * ScrollArea scrollbar component.
 */
const ScrollAreaScrollbar = forwardRef<HTMLElement, ScrollAreaScrollbarProps>(
  function ScrollAreaScrollbar(
    { children, className, orientation = "vertical", ...props },
    ref
  ) {
    return createElement(
      "ds-scroll-area-scrollbar",
      { ref, class: className, orientation, ...props },
      children
    );
  }
);
ScrollAreaScrollbar.displayName = "ScrollArea.Scrollbar";

/**
 * ScrollArea thumb component.
 */
const ScrollAreaThumb = forwardRef<HTMLElement, ScrollAreaThumbProps>(
  function ScrollAreaThumb({ className, ...props }, ref) {
    return createElement(
      "ds-scroll-area-thumb",
      { ref, class: className, ...props }
    );
  }
);
ScrollAreaThumb.displayName = "ScrollArea.Thumb";

// ============================================================================
// Compound Component
// ============================================================================

export const ScrollArea = {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
};

// Also export individual components
export {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
};
