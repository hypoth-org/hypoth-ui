/**
 * NumberInput context for compound component pattern.
 */

import type { NumberInputBehavior } from "@ds/primitives-dom";
import { createCompoundContext } from "../../utils/create-context.js";

export type NumberInputFormat = "decimal" | "currency" | "percent";

export interface NumberInputContextValue {
  /** NumberInput behavior instance */
  behavior: NumberInputBehavior;
  /** Current value */
  value: number | null;
  /** Set value */
  setValue: (value: number | null) => void;
  /** Min constraint */
  min: number | undefined;
  /** Max constraint */
  max: number | undefined;
  /** Step */
  step: number;
  /** Precision */
  precision: number;
  /** Disabled state */
  disabled: boolean;
  /** Input value string */
  inputValue: string;
  /** Set input value */
  setInputValue: (value: string) => void;
  /** Is input focused */
  isFocused: boolean;
  /** Set focus state */
  setIsFocused: (focused: boolean) => void;
}

export const [NumberInputProvider, useNumberInputContext] =
  createCompoundContext<NumberInputContextValue>("NumberInput");
