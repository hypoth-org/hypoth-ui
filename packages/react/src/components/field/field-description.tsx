import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export interface FieldDescriptionProps extends HTMLAttributes<HTMLElement> {
  /** Description content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-field-description Web Component.
 * Help text for form fields.
 */
export const FieldDescription = forwardRef<HTMLElement, FieldDescriptionProps>(
  (props, forwardedRef) => {
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
      "ds-field-description",
      {
        ref: internalRef,
        class: className,
        ...rest,
      },
      children
    );
  }
);

FieldDescription.displayName = "FieldDescription";
