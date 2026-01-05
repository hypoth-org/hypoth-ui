import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";
import type { Placement } from "./popover.js";

export interface TooltipProps extends HTMLAttributes<HTMLElement> {
  /** Whether the tooltip is open */
  open?: boolean;
  /** Placement relative to trigger */
  placement?: Placement;
  /** Offset from trigger in pixels */
  offset?: number;
  /** Delay before showing tooltip (ms) */
  showDelay?: number;
  /** Delay before hiding tooltip (ms) */
  hideDelay?: number;
  /** Tooltip content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-tooltip Web Component.
 * Informational tooltip shown on hover/focus.
 */
export const Tooltip = forwardRef<HTMLElement, TooltipProps>((props, forwardedRef) => {
  const {
    open = false,
    placement = "top",
    offset = 8,
    showDelay = 400,
    hideDelay = 100,
    children,
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

  return createElement(
    "ds-tooltip",
    {
      ref: internalRef,
      open: open || undefined,
      placement,
      offset,
      "show-delay": showDelay,
      "hide-delay": hideDelay,
      class: className,
      ...rest,
    },
    children
  );
});

Tooltip.displayName = "Tooltip";
