import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export interface LabelProps extends HTMLAttributes<HTMLElement> {
  /** For attribute linking to input */
  htmlFor?: string;
  /** Label content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-label Web Component.
 * Label for form fields with automatic ID association.
 */
export const Label = forwardRef<HTMLElement, LabelProps>((props, forwardedRef) => {
  const { htmlFor, children, className, ...rest } = props;

  const internalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  return createElement(
    "ds-label",
    {
      ref: internalRef,
      for: htmlFor,
      class: className,
      ...rest,
    },
    children
  );
});

Label.displayName = "Label";
