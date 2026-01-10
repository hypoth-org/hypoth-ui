import type React from "react";
import {
  type HTMLAttributes,
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
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

  // Store handlers in refs for stable callback references
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const onSelectRef = useRef(onSelect);
  onOpenRef.current = onOpen;
  onCloseRef.current = onClose;
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  // Stable handlers that read from refs
  const handleOpen = useCallback(() => {
    onOpenRef.current?.();
  }, []);

  const handleClose = useCallback(() => {
    onCloseRef.current?.();
  }, []);

  const handleSelect = useCallback((event: Event) => {
    const customEvent = event as CustomEvent<{ value: string }>;
    onSelectRef.current?.(customEvent.detail.value, event);
  }, []);

  // Handle events - no handler deps needed
  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    element.addEventListener("ds:open", handleOpen);
    element.addEventListener("ds:close", handleClose);
    element.addEventListener("ds:select", handleSelect);

    return () => {
      element.removeEventListener("ds:open", handleOpen);
      element.removeEventListener("ds:close", handleClose);
      element.removeEventListener("ds:select", handleSelect);
    };
  }, [handleOpen, handleClose, handleSelect]);

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
