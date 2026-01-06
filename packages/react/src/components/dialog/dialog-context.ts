/**
 * Dialog context for compound component pattern.
 */

import type { DialogBehavior } from "@ds/primitives-dom";
import { createCompoundContext } from "../../utils/create-context.js";

export interface DialogContextValue {
  /** Dialog behavior instance */
  behavior: DialogBehavior;
  /** Whether dialog is open */
  open: boolean;
  /** Set open state */
  setOpen: (open: boolean) => void;
  /** Whether dialog is modal */
  modal: boolean;
  /** Description ID when description is present */
  descriptionId: string | null;
  /** Set description ID */
  setDescriptionId: (id: string | null) => void;
}

export const [DialogProvider, useDialogContext] =
  createCompoundContext<DialogContextValue>("Dialog");
