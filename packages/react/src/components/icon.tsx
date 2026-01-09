import { createElement, forwardRef, useEffect, useRef } from "react";
import {
  type ResponsiveProp,
  generateResponsiveDataAttr,
  isResponsiveObject,
  resolveResponsiveValue,
} from "../primitives/responsive.js";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Icon name from Lucide library (kebab-case format).
 * This is a nominal type alias to document the expected format.
 */
export type IconName = string;

export interface IconProps {
  /** Icon name from Lucide library (kebab-case) */
  name: string;
  /**
   * Icon size - supports responsive object syntax
   * @example
   * ```tsx
   * // Single value
   * <Icon name="check" size="md" />
   *
   * // Responsive
   * <Icon name="check" size={{ base: "sm", md: "md", lg: "lg" }} />
   * ```
   */
  size?: ResponsiveProp<IconSize>;
  /** Accessible label. When omitted, icon is decorative. */
  label?: string;
  /** Custom color (CSS value) */
  color?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * React wrapper for ds-icon Web Component.
 * Provides type-safe props for icon display.
 */
export const Icon = forwardRef<HTMLElement, IconProps>((props, forwardedRef) => {
  const { name, size = "md", label, color, className, ...rest } = props;

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

  return createElement("ds-icon", {
    ref: internalRef,
    name,
    size: resolvedSize,
    label: label || undefined,
    color: color || undefined,
    class: className,
    // Add responsive data attribute for CSS targeting
    "data-size-responsive": responsiveSizeAttr,
    ...rest,
  });
});

Icon.displayName = "Icon";
