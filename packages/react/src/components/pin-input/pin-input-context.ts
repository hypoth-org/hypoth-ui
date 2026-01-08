/**
 * PinInput context for compound component pattern.
 */

import type { PinInputBehavior } from "@ds/primitives-dom";
import { createCompoundContext } from "../../utils/create-context.js";

export interface PinInputContextValue {
  /** PinInput behavior instance */
  behavior: PinInputBehavior;
  /** Current value */
  value: string;
  /** Number of digits */
  length: number;
  /** Focused input index */
  focusedIndex: number | null;
  /** Set focused index */
  setFocusedIndex: (index: number | null) => void;
  /** Register input ref */
  registerInput: (index: number, ref: HTMLInputElement | null) => void;
  /** Focus specific input */
  focusInput: (index: number) => void;
  /** Disabled state */
  disabled: boolean;
  /** Mask input */
  mask: boolean;
}

export const [PinInputProvider, usePinInputContext] =
  createCompoundContext<PinInputContextValue>("PinInput");
