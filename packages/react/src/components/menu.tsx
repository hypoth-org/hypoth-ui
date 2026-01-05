import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";
import type { Placement } from "./popover.js";

export interface MenuProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Whether the menu is open */
  open?: boolean;
  /** Placement relative to trigger */
  placement?: Placement;
  /** Offset from trigger in pixels */
  offset?: number;
  /** Whether to flip placement when near viewport edge */
  flip?: boolean;
  /** Handler for open event */
  onOpen?: () => void;
  /** Handler for close event */
  onClose?: () => void;
  /** Handler for item selection */
  onSelect?: (value: string, event: Event) => void;
  /** Menu content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-menu Web Component.
 * Dropdown menu with roving focus and type-ahead.
 */
export const Menu = forwardRef<HTMLElement, MenuProps>((props, forwardedRef) => {
  const {
    open = false,
    placement = "bottom-start",
    offset = 8,
    flip = true,
    onOpen,
    onClose,
    onSelect,
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

  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    const handleOpen = () => onOpen?.();
    const handleClose = () => onClose?.();
    const handleSelect = (event: Event) => {
      const customEvent = event as CustomEvent<{ value: string }>;
      onSelect?.(customEvent.detail.value, event);
    };

    if (onOpen) {
      element.addEventListener("ds:open", handleOpen);
    }
    if (onClose) {
      element.addEventListener("ds:close", handleClose);
    }
    if (onSelect) {
      element.addEventListener("ds:select", handleSelect);
    }

    return () => {
      if (onOpen) {
        element.removeEventListener("ds:open", handleOpen);
      }
      if (onClose) {
        element.removeEventListener("ds:close", handleClose);
      }
      if (onSelect) {
        element.removeEventListener("ds:select", handleSelect);
      }
    };
  }, [onOpen, onClose, onSelect]);

  return createElement(
    "ds-menu",
    {
      ref: internalRef,
      open: open || undefined,
      placement,
      offset,
      flip: flip || undefined,
      class: className,
      ...rest,
    },
    children
  );
});

Menu.displayName = "Menu";
