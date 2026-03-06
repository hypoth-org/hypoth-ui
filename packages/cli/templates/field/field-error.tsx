import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export interface FieldErrorProps extends HTMLAttributes<HTMLElement> {
  /** Error message content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-field-error Web Component.
 * Error message for form fields.
 */
export const FieldError = forwardRef<HTMLElement, FieldErrorProps>((props, forwardedRef) => {
  const { children, className, ...rest } = props;

  const internalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  return createElement(
    "ds-field-error",
    {
      ref: internalRef,
      class: className,
      ...rest,
    },
    children
  );
});

FieldError.displayName = "FieldError";
