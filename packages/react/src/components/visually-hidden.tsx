import type { ReactNode } from "react";
import { createElement, forwardRef, useEffect, useRef } from "react";

export interface VisuallyHiddenProps {
  /** When true, content becomes visible on focus */
  focusable?: boolean;
  /** Hidden content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * React wrapper for ds-visually-hidden Web Component.
 * Hides content visually while keeping it accessible to screen readers.
 */
export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  (props, forwardedRef) => {
    const { focusable = false, children, className, ...rest } = props;

    const internalRef = useRef<HTMLElement>(null);

    // Merge refs
    useEffect(() => {
      if (typeof forwardedRef === "function") {
        forwardedRef(internalRef.current);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLElement | null>).current =
          internalRef.current;
      }
    }, [forwardedRef]);

    return createElement(
      "ds-visually-hidden",
      {
        ref: internalRef,
        focusable: focusable || undefined,
        class: className,
        ...rest,
      },
      children
    );
  }
);

VisuallyHidden.displayName = "VisuallyHidden";
