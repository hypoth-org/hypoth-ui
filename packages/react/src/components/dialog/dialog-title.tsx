import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export interface DialogTitleProps extends HTMLAttributes<HTMLElement> {
  /** Title content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-dialog-title Web Component.
 * Accessible title for dialog.
 */
export const DialogTitle = forwardRef<HTMLElement, DialogTitleProps>((props, forwardedRef) => {
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
    "ds-dialog-title",
    {
      ref: internalRef,
      class: className,
      ...rest,
    },
    children
  );
});

DialogTitle.displayName = "DialogTitle";
