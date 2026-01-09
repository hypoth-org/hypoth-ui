/**
 * Select context for compound component pattern.
 */

import type { SelectBehavior } from "@ds/primitives-dom";
import { createCompoundContext } from "../../utils/create-context.js";

export interface SelectContextValue {
  /** Select behavior instance */
  behavior: SelectBehavior<string>;
  /** Whether select is open */
  open: boolean;
  /** Set open state */
  setOpen: (open: boolean) => void;
  /** Current value */
  value: string | null;
  /** Set value */
  setValue: (value: string | null) => void;
  /** Highlighted value for keyboard navigation */
  highlightedValue: string | null;
  /** Set highlighted value */
  setHighlightedValue: (value: string | null) => void;
  /** Whether the select is in a loading state */
  loading: boolean;
  /** Text to display during loading */
  loadingText: string;
}

export const [SelectProvider, useSelectContext] =
  createCompoundContext<SelectContextValue>("Select");
