import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export type DialogRole = "dialog" | "alertdialog";

export interface DialogProps extends HTMLAttributes<HTMLElement> {
  /** Whether the dialog is open */
  open?: boolean;
  /** Dialog role (dialog or alertdialog) */
  role?: DialogRole;
  /** Whether clicking backdrop closes the dialog */
  closeOnBackdropClick?: boolean;
  /** Whether pressing Escape closes the dialog */
  closeOnEscape?: boolean;
  /** Handler for open event */
  onOpen?: () => void;
  /** Handler for close event */
  onClose?: () => void;
  /** Dialog content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-dialog Web Component.
 * Modal dialog with focus trap and backdrop.
 */
export const Dialog = forwardRef<HTMLElement, DialogProps>((props, forwardedRef) => {
  const {
    open = false,
    role = "dialog",
    closeOnBackdropClick = true,
    closeOnEscape = true,
    onOpen,
    onClose,
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

  // Handle events
  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    const handleOpen = () => onOpen?.();
    const handleClose = () => onClose?.();

    if (onOpen) {
      element.addEventListener("ds:open", handleOpen);
    }
    if (onClose) {
      element.addEventListener("ds:close", handleClose);
    }

    return () => {
      if (onOpen) {
        element.removeEventListener("ds:open", handleOpen);
      }
      if (onClose) {
        element.removeEventListener("ds:close", handleClose);
      }
    };
  }, [onOpen, onClose]);

  return createElement(
    "ds-dialog",
    {
      ref: internalRef,
      open: open || undefined,
      role,
      "close-on-backdrop-click": closeOnBackdropClick ? undefined : "false",
      "close-on-escape": closeOnEscape ? undefined : "false",
      class: className,
      ...rest,
    },
    children
  );
});

Dialog.displayName = "Dialog";
