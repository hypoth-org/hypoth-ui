import type React from "react";
import { type TextareaHTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export type TextareaSize = "sm" | "md" | "lg";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "onInput"> {
  /** Textarea size */
  size?: TextareaSize;
  /** Error state */
  error?: boolean;
  /** Auto-resize to fit content */
  autoResize?: boolean;
  /** Change handler */
  onChange?: (value: string, event: Event) => void;
  /** Value change handler - fires on every keystroke */
  onValueChange?: (value: string, event: Event) => void;
}

/**
 * React wrapper for ds-textarea Web Component.
 * Multi-line text input with auto-resize support.
 */
export const Textarea = forwardRef<HTMLElement, TextareaProps>((props, forwardedRef) => {
  const {
    size = "md",
    name,
    value,
    placeholder,
    disabled = false,
    readOnly = false,
    required = false,
    error = false,
    autoResize = false,
    rows,
    minLength,
    maxLength,
    onChange,
    onValueChange,
    className,
    ...rest
  } = props;

  const internalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

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

  return createElement("ds-textarea", {
    ref: internalRef,
    size,
    name,
    value,
    placeholder,
    disabled: disabled || undefined,
    readonly: readOnly || undefined,
    required: required || undefined,
    error: error || undefined,
    "auto-resize": autoResize || undefined,
    rows,
    minlength: minLength,
    maxlength: maxLength,
    class: className,
    ...rest,
  });
});

Textarea.displayName = "Textarea";
