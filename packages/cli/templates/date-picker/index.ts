/**
 * DatePicker compound component for date selection.
 *
 * @example
 * ```tsx
 * // Single date selection
 * <DatePicker.Root onValueChange={(date) => console.log(date)}>
 *   <DatePicker.Trigger>Select date</DatePicker.Trigger>
 *   <DatePicker.Content>
 *     <DatePicker.Calendar />
 *   </DatePicker.Content>
 * </DatePicker.Root>
 *
 * // Range selection
 * <DatePicker.Root mode="range" onRangeChange={(range) => console.log(range)}>
 *   <DatePicker.Trigger>Select dates</DatePicker.Trigger>
 *   <DatePicker.Content>
 *     <DatePicker.Calendar />
 *   </DatePicker.Content>
 * </DatePicker.Root>
 * ```
 */

export { DatePickerRoot, type DatePickerRootProps } from "./date-picker-root.js";
export { DatePickerTrigger, type DatePickerTriggerProps } from "./date-picker-trigger.js";
export { DatePickerContent, type DatePickerContentProps } from "./date-picker-content.js";
export { DatePickerCalendar, type DatePickerCalendarProps } from "./date-picker-calendar.js";
export {
  useDatePickerContext,
  type DatePickerContextValue,
  type DatePickerMode,
} from "./date-picker-context.js";

export const DatePicker = {
  Root: DatePickerRoot,
  Trigger: DatePickerTrigger,
  Content: DatePickerContent,
  Calendar: DatePickerCalendar,
} as const;

import { DatePickerCalendar } from "./date-picker-calendar.js";
import { DatePickerContent } from "./date-picker-content.js";
import { DatePickerRoot } from "./date-picker-root.js";
import { DatePickerTrigger } from "./date-picker-trigger.js";
