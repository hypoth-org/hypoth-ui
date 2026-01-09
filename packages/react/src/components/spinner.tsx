import { createElement, forwardRef, useEffect, useRef } from "react";
import {
  type ResponsiveProp,
  generateResponsiveDataAttr,
  isResponsiveObject,
  resolveResponsiveValue,
} from "../primitives/responsive.js";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  /**
   * Spinner size - supports responsive object syntax
   * @example
   * ```tsx
   * // Single value
   * <Spinner size="md" />
   *
   * // Responsive
   * <Spinner size={{ base: "sm", md: "md" }} />
   * ```
   */
  size?: ResponsiveProp<SpinnerSize>;
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

  // Resolve responsive size - use base value for the WC attribute
  const resolvedSize = resolveResponsiveValue(size, "md");
  const isResponsive = isResponsiveObject(size);
  const responsiveSizeAttr = isResponsive ? generateResponsiveDataAttr(size) : undefined;

  return createElement("ds-spinner", {
    ref: internalRef,
    size: resolvedSize,
    label,
    class: className,
    // Add responsive data attribute for CSS targeting
    "data-size-responsive": responsiveSizeAttr,
    ...rest,
  });
});

Spinner.displayName = "Spinner";
