/**
 * Dialog Title component - accessible title for the dialog.
 */

import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { useDialogContext } from "./dialog-context.js";

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Title content */
  children?: ReactNode;
}

/**
 * Accessible title for the dialog.
 * Automatically linked to dialog via aria-labelledby.
 *
 * @example
 * ```tsx
 * <Dialog.Content>
 *   <Dialog.Title>Confirm Action</Dialog.Title>
 *   ...
 * </Dialog.Content>
 * ```
 */
export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ children, ...restProps }, ref) => {
    const { behavior } = useDialogContext("Dialog.Title");
    const titleProps = behavior.getTitleProps();

    return (
      <h2 ref={ref} id={titleProps.id} {...restProps}>
        {children}
      </h2>
    );
  }
);

DialogTitle.displayName = "Dialog.Title";
