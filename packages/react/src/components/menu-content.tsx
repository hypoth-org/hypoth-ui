import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export interface MenuContentProps extends HTMLAttributes<HTMLElement> {
  /** Menu items */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-menu-content Web Component.
 * Container for menu items.
 */
export const MenuContent = forwardRef<HTMLElement, MenuContentProps>((props, forwardedRef) => {
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
    "ds-menu-content",
    {
      ref: internalRef,
      class: className,
      ...rest,
    },
    children
  );
});

MenuContent.displayName = "MenuContent";
