import type React from "react";
import {
  type ButtonHTMLAttributes,
  type MouseEvent,
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  type ResponsiveProp,
  generateResponsiveDataAttr,
  isResponsiveObject,
  resolveResponsiveValue,
} from "../primitives/responsive.js";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /**
   * Button size - supports responsive object syntax
   * @example
   * ```tsx
   * // Single value
   * <Button size="md" />
   *
   * // Responsive
   * <Button size={{ base: "sm", md: "md", lg: "lg" }} />
   * ```
   */
  size?: ResponsiveProp<ButtonSize>;
  /** Loading state */
  loading?: boolean;
  /** Click handler */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Button content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-button Web Component.
 * Provides type-safe props and event handling.
 */
export const Button = forwardRef<HTMLElement, ButtonProps>((props, forwardedRef) => {
  const {
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    type = "button",
    onClick,
    children,
    className,
    ...rest
  } = props;

  const internalRef = useRef<HTMLElement>(null);

  // Store handlers in refs for stable callback references
  const onClickRef = useRef(onClick);
  const loadingRef = useRef(loading);
  onClickRef.current = onClick;
  loadingRef.current = loading;

  // Merge refs
  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  // Stable click handler that reads from refs
  const handleClick = useCallback((event: Event) => {
    // Prevent click when loading
    if (loadingRef.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClickRef.current?.(event as unknown as MouseEvent<HTMLElement>);
  }, []);

  // Handle click events - no handler deps needed
  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    element.addEventListener("click", handleClick);
    return () => element.removeEventListener("click", handleClick);
  }, [handleClick]);

  // Resolve responsive size - use base value for the WC attribute
  const resolvedSize = resolveResponsiveValue(size, "md");
  const isResponsive = isResponsiveObject(size);
  const responsiveSizeAttr = isResponsive ? generateResponsiveDataAttr(size) : undefined;

  // Use createElement to avoid JSX intrinsic element issues
  return createElement(
    "ds-button",
    {
      ref: internalRef,
      variant,
      size: resolvedSize,
      disabled: disabled || undefined,
      loading: loading || undefined,
      type,
      class: className,
      // Add responsive data attribute for CSS targeting
      "data-size-responsive": responsiveSizeAttr,
      ...rest,
    },
    children
  );
});

Button.displayName = "Button";
