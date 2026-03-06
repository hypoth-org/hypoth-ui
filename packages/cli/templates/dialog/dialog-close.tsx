/**
 * Dialog Close component - button that closes the dialog.
 */

import { type ButtonHTMLAttributes, type ReactNode, forwardRef, useCallback } from "react";
import { Slot } from "../../primitives/slot.js";
import { useDialogContext } from "./dialog-context.js";

export interface DialogCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children?: ReactNode;
  /** Render as child element (polymorphic) */
  asChild?: boolean;
}

/**
 * Button that closes the dialog when activated.
 * Supports asChild for custom close elements.
 *
 * @example
 * ```tsx
 * <Dialog.Close>Close</Dialog.Close>
 *
 * <Dialog.Close asChild>
 *   <button className="custom-close">X</button>
 * </Dialog.Close>
 * ```
 */
export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ children, asChild = false, onClick, ...restProps }, ref) => {
    const { setOpen } = useDialogContext("Dialog.Close");

    // Handle click to close dialog
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(false);
        onClick?.(event);
      },
      [setOpen, onClick]
    );

    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        type={asChild ? undefined : "button"}
        onClick={handleClick}
        {...restProps}
      >
        {children}
      </Component>
    );
  }
);

DialogClose.displayName = "Dialog.Close";
