/**
 * Dialog compound component exports.
 *
 * @example
 * ```tsx
 * import { Dialog } from "@ds/react";
 *
 * <Dialog.Root>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Title>Dialog Title</Dialog.Title>
 *     <Dialog.Description>Dialog description</Dialog.Description>
 *     <Dialog.Close>Close</Dialog.Close>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 */

import { DialogClose, type DialogCloseProps } from "./dialog-close.js";
import {
  DialogContent,
  type DialogContentProps,
  type DialogContentSize,
} from "./dialog-content.js";
import { DialogDescription, type DialogDescriptionProps } from "./dialog-description.js";
import { DialogRoot, type DialogRootProps } from "./dialog-root.js";
import { DialogTitle, type DialogTitleProps } from "./dialog-title.js";
import { DialogTrigger, type DialogTriggerProps } from "./dialog-trigger.js";

// Compound component
export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};

// Type exports
export type {
  DialogCloseProps,
  DialogContentProps,
  DialogContentSize,
  DialogDescriptionProps,
  DialogRootProps,
  DialogTitleProps,
  DialogTriggerProps,
};

// Re-export DialogRole from primitives-dom
export type { DialogRole } from "@ds/primitives-dom";
