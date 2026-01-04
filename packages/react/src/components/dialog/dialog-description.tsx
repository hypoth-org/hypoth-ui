import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export interface DialogDescriptionProps extends HTMLAttributes<HTMLElement> {
  /** Description content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-dialog-description Web Component.
 * Accessible description for dialog.
 */
export const DialogDescription = forwardRef<HTMLElement, DialogDescriptionProps>(
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
      "ds-dialog-description",
      {
        ref: internalRef,
        class: className,
        ...rest,
      },
      children
    );
  }
);

DialogDescription.displayName = "DialogDescription";
