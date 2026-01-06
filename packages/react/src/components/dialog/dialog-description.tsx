/**
 * Dialog Description component - accessible description for the dialog.
 */

import { forwardRef, useEffect, type HTMLAttributes, type ReactNode } from "react";
import { useDialogContext } from "./dialog-context.js";

export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Description content */
  children?: ReactNode;
}

/**
 * Accessible description for the dialog.
 * Automatically linked to dialog via aria-describedby.
 *
 * @example
 * ```tsx
 * <Dialog.Content>
 *   <Dialog.Title>Confirm Delete</Dialog.Title>
 *   <Dialog.Description>
 *     This action cannot be undone. Are you sure?
 *   </Dialog.Description>
 *   ...
 * </Dialog.Content>
 * ```
 */
export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ children, ...restProps }, ref) => {
    const { behavior, setDescriptionId } = useDialogContext("Dialog.Description");
    const descriptionProps = behavior.getDescriptionProps();

    // Register description presence with both behavior and React context
    useEffect(() => {
      behavior.setHasDescription(true);
      setDescriptionId(descriptionProps.id);
      return () => {
        behavior.setHasDescription(false);
        setDescriptionId(null);
      };
    }, [behavior, descriptionProps.id, setDescriptionId]);

    return (
      <p ref={ref} id={descriptionProps.id} {...restProps}>
        {children}
      </p>
    );
  }
);

DialogDescription.displayName = "Dialog.Description";
