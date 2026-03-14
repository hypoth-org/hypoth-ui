/**
 * Dialog Content component - the dialog panel with focus trap and portal.
 */

import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { useDialogContext } from "./dialog-context.js";

export type DialogContentSize = "sm" | "md" | "lg" | "xl" | "full";

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Dialog content */
  children?: ReactNode;
  /** Content size */
  size?: DialogContentSize;
  /** Container element for portal (defaults to document.body) */
  container?: HTMLElement | null;
  /** Force mount even when closed (for animations) */
  forceMount?: boolean;
}

/**
 * Dialog content panel with focus trap and ARIA attributes.
 * Renders in a portal by default with backdrop overlay.
 *
 * @example
 * ```tsx
 * <Dialog.Content>
 *   <Dialog.Title>Dialog Title</Dialog.Title>
 *   <p>Dialog body content</p>
 *   <Dialog.Close>Close</Dialog.Close>
 * </Dialog.Content>
 * ```
 */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, size = "md", container, forceMount = false, className, style, ...restProps }, ref) => {
    const { behavior, open, setOpen, modal, descriptionId } = useDialogContext("Dialog.Content");
    const internalRef = useRef<HTMLDivElement>(null);

    // Register content element with behavior for focus trap and dismissable layer
    useEffect(() => {
      if (open) {
        const element = internalRef.current;
        behavior.setContentElement(element);
        return () => {
          behavior.setContentElement(null);
        };
      }
    }, [behavior, open]);

    // Get content props from behavior
    const contentProps = behavior.getContentProps();

    // Merge refs
    const mergedRef = useCallback(
      (element: HTMLDivElement | null) => {
        (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
        }
      },
      [ref]
    );

    // Handle backdrop click to close dialog
    const handleBackdropClick = useCallback(
      (e: React.MouseEvent) => {
        // Only close if clicking directly on backdrop, not content
        if (e.target === e.currentTarget) {
          setOpen(false);
        }
      },
      [setOpen]
    );

    // Don't render if closed and not force mounted
    if (!open && !forceMount) {
      return null;
    }

    const contentClassName = ["ds-dialog-content", className].filter(Boolean).join(" ");

    const content = (
      <div className="ds-dialog">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop is not keyboard-interactive; Escape key handled by dialog behavior */}
        <div
          className="ds-dialog__backdrop"
          data-state={open ? "open" : "closed"}
          onClick={handleBackdropClick}
        >
          <div
            ref={mergedRef}
            className={contentClassName}
            id={contentProps.id}
            role={contentProps.role}
            aria-modal={modal ? contentProps["aria-modal"] : undefined}
            aria-labelledby={contentProps["aria-labelledby"]}
            aria-describedby={descriptionId ?? undefined}
            tabIndex={contentProps.tabIndex}
            data-state={open ? "open" : "closed"}
            data-size={size}
            style={style}
            {...restProps}
          >
            {children}
          </div>
        </div>
      </div>
    );

    // Render in portal
    const portalContainer = container ?? (typeof document !== "undefined" ? document.body : null);
    if (portalContainer) {
      return createPortal(content, portalContainer);
    }

    return content;
  }
);

DialogContent.displayName = "Dialog.Content";
