/**
 * Combobox context for compound component pattern.
 */

import type { ComboboxBehavior, Option } from "@ds/primitives-dom";
import { createCompoundContext } from "../../utils/create-context.js";

export interface ComboboxContextValue<Multi extends boolean = false> {
  /** Combobox behavior instance */
  behavior: ComboboxBehavior<string, Multi>;
  /** Whether combobox is open */
  open: boolean;
  /** Set open state */
  setOpen: (open: boolean) => void;
  /** Current value(s) */
  value: Multi extends true ? string[] : string | null;
  /** Set value(s) */
  setValue: (value: Multi extends true ? string[] : string | null) => void;
  /** Input value */
  inputValue: string;
  /** Set input value */
  setInputValue: (value: string) => void;
  /** Highlighted value for keyboard navigation */
  highlightedValue: string | null;
  /** Set highlighted value */
  setHighlightedValue: (value: string | null) => void;
  /** Whether multi-select mode */
  multiple: Multi;
  /** Filtered options */
  filteredOptions: Option<string>[];
  /** Loading state */
  loading: boolean;
}

export const [ComboboxProvider, useComboboxContext] =
  createCompoundContext<ComboboxContextValue<boolean>>("Combobox");
