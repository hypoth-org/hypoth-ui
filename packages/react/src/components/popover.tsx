import type React from "react";
import {
  type HTMLAttributes,
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";

export type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export interface PopoverProps extends HTMLAttributes<HTMLElement> {
  /** Whether the popover is open */
  open?: boolean;
  /** Placement relative to trigger */
  placement?: Placement;
  /** Offset from trigger in pixels */
  offset?: number;
  /** Whether to flip placement when near viewport edge */
  flip?: boolean;
  /** Whether Escape closes the popover */
  closeOnEscape?: boolean;
  /** Whether clicking outside closes the popover */
  closeOnOutsideClick?: boolean;
  /** Handler for open event */
  onOpen?: () => void;
  /** Handler for close event */
  onClose?: () => void;
  /** Popover content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-popover Web Component.
 * Non-modal popover with anchor positioning.
 */
export const Popover = forwardRef<HTMLElement, PopoverProps>((props, forwardedRef) => {
  const {
    open = false,
    placement = "bottom",
    offset = 8,
    flip = true,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    onOpen,
    onClose,
    children,
    className,
    ...rest
  } = props;

  const internalRef = useRef<HTMLElement>(null);

  // Store handlers in refs for stable callback references
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  onOpenRef.current = onOpen;
  onCloseRef.current = onClose;

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

  // Handle events - no handler deps needed
  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    element.addEventListener("ds:open", handleOpen);
    element.addEventListener("ds:close", handleClose);

    return () => {
      element.removeEventListener("ds:open", handleOpen);
      element.removeEventListener("ds:close", handleClose);
    };
  }, [handleOpen, handleClose]);

  return createElement(
    "ds-popover",
    {
      ref: internalRef,
      open: open || undefined,
      placement,
      offset,
      flip: flip || undefined,
      "close-on-escape": closeOnEscape ? undefined : "false",
      "close-on-outside-click": closeOnOutsideClick ? undefined : "false",
      class: className,
      ...rest,
    },
    children
  );
});

Popover.displayName = "Popover";
