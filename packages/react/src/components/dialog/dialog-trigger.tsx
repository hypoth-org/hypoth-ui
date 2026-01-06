/**
 * Dialog Trigger component - opens the dialog when activated.
 */

import { forwardRef, useCallback, useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot } from "../../primitives/slot.js";
import { useDialogContext } from "./dialog-context.js";

export interface DialogTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Trigger content */
  children?: ReactNode;
  /** Render as child element (polymorphic) */
  asChild?: boolean;
}

/**
 * Trigger button that opens the dialog.
 * Supports asChild for custom trigger elements.
 *
 * @example
 * ```tsx
 * <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *
 * <Dialog.Trigger asChild>
 *   <button className="custom-button">Custom Trigger</button>
 * </Dialog.Trigger>
 * ```
 */
export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ children, asChild = false, onClick, ...restProps }, ref) => {
    const { behavior, open, setOpen } = useDialogContext("Dialog.Trigger");
    const internalRef = useRef<HTMLButtonElement>(null);

    // Register trigger element with behavior
    useEffect(() => {
      const element = internalRef.current;
      behavior.setTriggerElement(element);
      return () => {
        behavior.setTriggerElement(null);
      };
    }, [behavior]);

    // Handle click to open dialog
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(true);
        onClick?.(event);
      },
      [setOpen, onClick]
    );

    // Get trigger props from behavior
    const triggerProps = behavior.getTriggerProps();

    const Component = asChild ? Slot : "button";

    // Merge refs
    const mergedRef = useCallback(
      (element: HTMLButtonElement | null) => {
        (internalRef as React.MutableRefObject<HTMLButtonElement | null>).current = element;
        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current = element;
        }
      },
      [ref]
    );

    return (
      <Component
        ref={mergedRef}
        type={asChild ? undefined : "button"}
        id={triggerProps.id}
        aria-haspopup={triggerProps["aria-haspopup"]}
        aria-expanded={open ? "true" : "false"}
        aria-controls={triggerProps["aria-controls"]}
        onClick={handleClick}
        {...restProps}
      >
        {children}
      </Component>
    );
  }
);

DialogTrigger.displayName = "Dialog.Trigger";
