/**
 * TimePicker compound component for time selection.
 *
 * @example
 * ```tsx
 * // Basic 12-hour format
 * <TimePicker.Root hourFormat={12} onValueChange={(time) => console.log(time)}>
 *   <TimePicker.Segment segment="hour" />
 *   <span>:</span>
 *   <TimePicker.Segment segment="minute" />
 *   <span> </span>
 *   <TimePicker.Segment segment="period" />
 * </TimePicker.Root>
 *
 * // 24-hour format with seconds
 * <TimePicker.Root hourFormat={24} showSeconds>
 *   <TimePicker.Segment segment="hour" />
 *   <span>:</span>
 *   <TimePicker.Segment segment="minute" />
 *   <span>:</span>
 *   <TimePicker.Segment segment="second" />
 * </TimePicker.Root>
 * ```
 */

export { TimePickerRoot, type TimePickerRootProps } from "./time-picker-root.js";
export { TimePickerSegment, type TimePickerSegmentProps } from "./time-picker-segment.js";
export {
  useTimePickerContext,
  type TimePickerContextValue,
} from "./time-picker-context.js";

// Re-export types from primitives
export type { TimeValue, TimeSegment } from "@ds/primitives-dom";

export const TimePicker = {
  Root: TimePickerRoot,
  Segment: TimePickerSegment,
} as const;

import { TimePickerRoot } from "./time-picker-root.js";
import { TimePickerSegment } from "./time-picker-segment.js";
