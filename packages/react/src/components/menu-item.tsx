import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export interface MenuItemProps extends HTMLAttributes<HTMLElement> {
  /** Item value */
  value?: string;
  /** Whether disabled */
  disabled?: boolean;
  /** Item content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-menu-item Web Component.
 * Individual menu item.
 */
export const MenuItem = forwardRef<HTMLElement, MenuItemProps>((props, forwardedRef) => {
  const { value, disabled = false, children, className, ...rest } = props;

  const internalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  return createElement(
    "ds-menu-item",
    {
      ref: internalRef,
      value,
      disabled: disabled || undefined,
      class: className,
      ...rest,
    },
    children
  );
});

MenuItem.displayName = "MenuItem";
