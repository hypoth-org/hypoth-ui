import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export type DialogContentSize = "sm" | "md" | "lg" | "xl" | "full";

export interface DialogContentProps extends HTMLAttributes<HTMLElement> {
  /** Content size */
  size?: DialogContentSize;
  /** Content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-dialog-content Web Component.
 * Container for dialog content with size variants.
 */
export const DialogContent = forwardRef<HTMLElement, DialogContentProps>((props, forwardedRef) => {
  const { size = "md", children, className, ...rest } = props;

  const internalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  return createElement(
    "ds-dialog-content",
    {
      ref: internalRef,
      size,
      class: className,
      ...rest,
    },
    children
  );
});

DialogContent.displayName = "DialogContent";
