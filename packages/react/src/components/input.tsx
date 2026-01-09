import type React from "react";
import { type InputHTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";
import {
  type ResponsiveProp,
  generateResponsiveDataAttr,
  isResponsiveObject,
  resolveResponsiveValue,
} from "../primitives/responsive.js";

export type InputType = "text" | "email" | "password" | "number" | "tel" | "url" | "search";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange" | "onInput"> {
  /** Input type */
  type?: InputType;
  /**
   * Input size - supports responsive object syntax
   * @example
   * ```tsx
   * // Single value
   * <Input size="md" />
   *
   * // Responsive
   * <Input size={{ base: "sm", md: "md", lg: "lg" }} />
   * ```
   */
  size?: ResponsiveProp<InputSize>;
  /** Error state */
  error?: boolean;
  /** Change handler - fires when input loses focus with changed value */
  onChange?: (value: string, event: Event) => void;
  /** Value change handler - fires on every keystroke */
  onValueChange?: (value: string, event: Event) => void;
}

/**
 * React wrapper for ds-input Web Component.
 * Provides type-safe props and event handling.
 */
export const Input = forwardRef<HTMLElement, InputProps>((props, forwardedRef) => {
  const {
    type = "text",
    size = "md",
    name,
    value,
    placeholder,
    disabled = false,
    readOnly = false,
    required = false,
    error = false,
    minLength,
    maxLength,
    pattern,
    onChange,
    onValueChange,
    className,
    ...rest
  } = props;

  const internalRef = useRef<HTMLElement>(null);

  // Merge refs
  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  // Handle input events
  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    const handleInputEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ value: string }>;
      onValueChange?.(customEvent.detail.value, event);
    };

    const handleChangeEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ value: string }>;
      onChange?.(customEvent.detail.value, event);
    };

    if (onValueChange) {
      element.addEventListener("input", handleInputEvent);
    }
    if (onChange) {
      element.addEventListener("change", handleChangeEvent);
    }

    return () => {
      if (onValueChange) {
        element.removeEventListener("input", handleInputEvent);
      }
      if (onChange) {
        element.removeEventListener("change", handleChangeEvent);
      }
    };
  }, [onValueChange, onChange]);

  // Resolve responsive size - use base value for the WC attribute
  const resolvedSize = resolveResponsiveValue(size, "md");
  const isResponsive = isResponsiveObject(size);
  const responsiveSizeAttr = isResponsive ? generateResponsiveDataAttr(size) : undefined;

  return createElement("ds-input", {
    ref: internalRef,
    type,
    size: resolvedSize,
    name,
    value,
    placeholder,
    disabled: disabled || undefined,
    readonly: readOnly || undefined,
    required: required || undefined,
    error: error || undefined,
    minlength: minLength,
    maxlength: maxLength,
    pattern,
    class: className,
    // Add responsive data attribute for CSS targeting
    "data-size-responsive": responsiveSizeAttr,
    ...rest,
  });
});

Input.displayName = "Input";
