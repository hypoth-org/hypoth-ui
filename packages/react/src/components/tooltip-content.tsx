import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export interface TooltipContentProps extends HTMLAttributes<HTMLElement> {
  /** Tooltip content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-tooltip-content Web Component.
 * Container for tooltip content.
 */
export const TooltipContent = forwardRef<HTMLElement, TooltipContentProps>(
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
      "ds-tooltip-content",
      {
        ref: internalRef,
        class: className,
        ...rest,
      },
      children
    );
  }
);

TooltipContent.displayName = "TooltipContent";
