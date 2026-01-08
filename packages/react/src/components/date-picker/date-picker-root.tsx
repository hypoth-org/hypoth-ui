/**
 * DatePicker Root component - provides context to all DatePicker compound components.
 */

import { type DateRange, type Placement, createDatePickerBehavior } from "@ds/primitives-dom";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { type DatePickerMode, DatePickerProvider } from "./date-picker-context.js";

export interface DatePickerRootProps {
  /** DatePicker content */
  children?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Selection mode: single date or date range */
  mode?: DatePickerMode;
  /** Controlled value (single mode) */
  value?: Date | null;
  /** Default value (single mode, uncontrolled) */
  defaultValue?: Date | null;
  /** Called when date changes (single mode) */
  onValueChange?: (value: Date | null) => void;
  /** Controlled range (range mode) */
  range?: DateRange;
  /** Default range (range mode, uncontrolled) */
  defaultRange?: DateRange;
  /** Called when range changes */
  onRangeChange?: (range: DateRange) => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Locale for date formatting */
  locale?: string;
  /** First day of week (0=Sunday, 1=Monday) */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Placement relative to trigger */
  placement?: Placement;
  /** Offset from trigger in pixels */
  offset?: number;
  /** Whether to flip placement on viewport edge */
  flip?: boolean;
  /** Whether picker is disabled */
  disabled?: boolean;
}

/**
 * Root component for DatePicker compound pattern.
 * Provides context to Trigger, Calendar, and related components.
 *
 * @example
 * ```tsx
 * <DatePicker.Root onValueChange={(date) => console.log(date)}>
 *   <DatePicker.Trigger>Select date</DatePicker.Trigger>
 *   <DatePicker.Content>
 *     <DatePicker.Calendar />
 *   </DatePicker.Content>
 * </DatePicker.Root>
 * ```
 */
export function DatePickerRoot({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  mode = "single",
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  range: controlledRange,
  defaultRange = { start: null, end: null },
  onRangeChange,
  minDate,
  maxDate,
  locale = "en-US",
  firstDayOfWeek = 0,
  placement: _placement = "bottom-start",
  offset: _offset = 4,
  flip: _flip = true,
  disabled = false,
}: DatePickerRootProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Support controlled and uncontrolled modes for open
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;

  // Support controlled and uncontrolled modes for value
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const isValueControlled = controlledValue !== undefined;
  const value = isValueControlled ? controlledValue : internalValue;

  // Support controlled and uncontrolled modes for range
  const [internalRange, setInternalRange] = useState<DateRange>(defaultRange);
  const isRangeControlled = controlledRange !== undefined;
  const range = isRangeControlled ? controlledRange : internalRange;

  // Calendar navigation state
  const [focusedDate, setFocusedDate] = useState<Date>(value ?? today);
  const [viewingMonth, setViewingMonth] = useState<Date>(value ?? today);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, onOpenChange]
  );

  const setValue = useCallback(
    (nextValue: Date | null) => {
      if (!isValueControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isValueControlled, onValueChange]
  );

  const setRange = useCallback(
    (nextRange: DateRange) => {
      if (!isRangeControlled) {
        setInternalRange(nextRange);
      }
      onRangeChange?.(nextRange);
    },
    [isRangeControlled, onRangeChange]
  );

  // Create behavior instance
  // biome-ignore lint/correctness/useExhaustiveDependencies: behavior is created once
  const behavior = useMemo(
    () =>
      createDatePickerBehavior({
        mode,
        defaultValue: value,
        defaultRange: range,
        minDate,
        maxDate,
        locale,
        firstDayOfWeek,
        disabled,
        onDateChange: setValue,
        onRangeChange: setRange,
        onOpenChange: setOpen,
        onFocusedDateChange: setFocusedDate,
      }),
    []
  );

  const contextValue = useMemo(
    () => ({
      behavior,
      open,
      setOpen,
      mode,
      value,
      setValue,
      range,
      setRange,
      focusedDate,
      setFocusedDate,
      viewingMonth,
      setViewingMonth,
      locale,
      firstDayOfWeek,
      minDate,
      maxDate,
    }),
    [
      behavior,
      open,
      setOpen,
      mode,
      value,
      setValue,
      range,
      setRange,
      focusedDate,
      viewingMonth,
      locale,
      firstDayOfWeek,
      minDate,
      maxDate,
    ]
  );

  return <DatePickerProvider value={contextValue}>{children}</DatePickerProvider>;
}

DatePickerRoot.displayName = "DatePicker.Root";
