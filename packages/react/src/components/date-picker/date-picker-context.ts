/**
 * DatePicker context for compound component pattern.
 */

import type { DatePickerBehavior, DateRange } from "@ds/primitives-dom";
import { createCompoundContext } from "../../utils/create-context.js";

export type DatePickerMode = "single" | "range";

export interface DatePickerContextValue {
  /** DatePicker behavior instance */
  behavior: DatePickerBehavior;
  /** Whether calendar is open */
  open: boolean;
  /** Set open state */
  setOpen: (open: boolean) => void;
  /** Selection mode */
  mode: DatePickerMode;
  /** Selected date (single mode) */
  value: Date | null;
  /** Set value (single mode) */
  setValue: (value: Date | null) => void;
  /** Selected range (range mode) */
  range: DateRange;
  /** Set range (range mode) */
  setRange: (range: DateRange) => void;
  /** Focused date in calendar */
  focusedDate: Date;
  /** Set focused date */
  setFocusedDate: (date: Date) => void;
  /** Viewing month */
  viewingMonth: Date;
  /** Set viewing month */
  setViewingMonth: (date: Date) => void;
  /** Locale for formatting */
  locale: string;
  /** First day of week */
  firstDayOfWeek: number;
  /** Min selectable date */
  minDate: Date | undefined;
  /** Max selectable date */
  maxDate: Date | undefined;
}

export const [DatePickerProvider, useDatePickerContext] =
  createCompoundContext<DatePickerContextValue>("DatePicker");
