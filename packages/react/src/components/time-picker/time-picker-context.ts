/**
 * TimePicker context for compound component pattern.
 */

import type { TimePickerBehavior, TimeSegment, TimeValue } from "@ds/primitives-dom";
import { createCompoundContext } from "../../utils/create-context.js";

export interface TimePickerContextValue {
  /** TimePicker behavior instance */
  behavior: TimePickerBehavior;
  /** Current time value */
  value: TimeValue;
  /** Set value */
  setValue: (value: TimeValue) => void;
  /** Hour format */
  hourFormat: 12 | 24;
  /** Show seconds */
  showSeconds: boolean;
  /** Focused segment */
  focusedSegment: TimeSegment | null;
  /** Set focused segment */
  setFocusedSegment: (segment: TimeSegment | null) => void;
  /** Disabled state */
  disabled: boolean;
}

export const [TimePickerProvider, useTimePickerContext] =
  createCompoundContext<TimePickerContextValue>("TimePicker");
