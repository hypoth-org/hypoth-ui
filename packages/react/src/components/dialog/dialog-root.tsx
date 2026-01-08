/**
 * Dialog Root component - provides context to all Dialog compound components.
 */

import { type DialogRole, createDialogBehavior } from "@ds/primitives-dom";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { DialogProvider } from "./dialog-context.js";

export interface DialogRootProps {
  /** Dialog content */
  children?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Dialog role */
  role?: DialogRole;
  /** Whether dialog is modal (traps focus) */
  modal?: boolean;
}

/**
 * Root component for Dialog compound pattern.
 * Provides context to Trigger, Content, Title, Description, and Close.
 *
 * @example
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>Open</Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Title>Dialog Title</Dialog.Title>
 *     <Dialog.Description>Dialog description</Dialog.Description>
 *     <Dialog.Close>Close</Dialog.Close>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 */
export function DialogRoot({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  role = "dialog",
  modal = true,
}: DialogRootProps) {
  // Support both controlled and uncontrolled modes
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  // Track description presence for aria-describedby
  const [descriptionId, setDescriptionId] = useState<string | null>(null);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  // Create behavior instance - intentionally created once with initial values
  // biome-ignore lint/correctness/useExhaustiveDependencies: behavior is created once, open state synced via setOpen callback
  const behavior = useMemo(
    () =>
      createDialogBehavior({
        defaultOpen: open,
        role,
        closeOnEscape: true,
        closeOnOutsideClick: true,
        onOpenChange: setOpen,
      }),
    []
  );

  const contextValue = useMemo(
    () => ({
      behavior,
      open,
      setOpen,
      modal,
      descriptionId,
      setDescriptionId,
    }),
    [behavior, open, setOpen, modal, descriptionId]
  );

  return <DialogProvider value={contextValue}>{children}</DialogProvider>;
}

DialogRoot.displayName = "Dialog.Root";
