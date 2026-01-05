import { createElement, forwardRef, useEffect, useRef } from "react";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  /** Spinner size */
  size?: SpinnerSize;
  /** Accessible label for screen readers */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * React wrapper for ds-spinner Web Component.
 * Provides type-safe props for loading indicator.
 */
export const Spinner = forwardRef<HTMLElement, SpinnerProps>((props, forwardedRef) => {
  const { size = "md", label = "Loading", className, ...rest } = props;

  const internalRef = useRef<HTMLElement>(null);

  // Merge refs
  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  return createElement("ds-spinner", {
    ref: internalRef,
    size,
    label,
    class: className,
    ...rest,
  });
});

Spinner.displayName = "Spinner";
