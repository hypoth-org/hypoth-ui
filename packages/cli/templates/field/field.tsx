import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export interface FieldProps extends HTMLAttributes<HTMLElement> {
  /** Whether the field has an error */
  error?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Field content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-field Web Component.
 * Container for form field with label, input, description, and error message.
 */
export const Field = forwardRef<HTMLElement, FieldProps>((props, forwardedRef) => {
  const { error = false, disabled = false, required = false, children, className, ...rest } = props;

  const internalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  return createElement(
    "ds-field",
    {
      ref: internalRef,
      error: error || undefined,
      disabled: disabled || undefined,
      required: required || undefined,
      class: className,
      ...rest,
    },
    children
  );
});

Field.displayName = "Field";
