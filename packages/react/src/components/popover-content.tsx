import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export interface PopoverContentProps extends HTMLAttributes<HTMLElement> {
  /** Popover content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-popover-content Web Component.
 * Container for popover content.
 */
export const PopoverContent = forwardRef<HTMLElement, PopoverContentProps>(
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
      "ds-popover-content",
      {
        ref: internalRef,
        class: className,
        ...rest,
      },
      children
    );
  }
);

PopoverContent.displayName = "PopoverContent";
