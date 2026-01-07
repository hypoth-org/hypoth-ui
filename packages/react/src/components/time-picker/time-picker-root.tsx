/**
 * TimePicker Root component - provides context to all TimePicker compound components.
 */

import { type TimeSegment, type TimeValue, createTimePickerBehavior } from "@ds/primitives-dom";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { TimePickerProvider } from "./time-picker-context.js";

export interface TimePickerRootProps {
  /** TimePicker content */
  children?: ReactNode;
  /** 12-hour or 24-hour format */
  hourFormat?: 12 | 24;
  /** Show seconds segment */
  showSeconds?: boolean;
  /** Controlled time value */
  value?: TimeValue;
  /** Default time value (uncontrolled) */
  defaultValue?: TimeValue;
  /** Called when time changes */
  onValueChange?: (value: TimeValue) => void;
  /** Minute step */
  minuteStep?: number;
  /** Second step */
  secondStep?: number;
  /** Minimum time */
  minTime?: TimeValue;
  /** Maximum time */
  maxTime?: TimeValue;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Root component for TimePicker compound pattern.
 * Provides context to Segment components.
 *
 * @example
 * ```tsx
 * <TimePicker.Root hourFormat={12} onValueChange={(time) => console.log(time)}>
 *   <TimePicker.Segment segment="hour" />
 *   <span>:</span>
 *   <TimePicker.Segment segment="minute" />
 *   <TimePicker.Segment segment="period" />
 * </TimePicker.Root>
 * ```
 */
export function TimePickerRoot({
  children,
  hourFormat = 12,
  showSeconds = false,
  value: controlledValue,
  defaultValue = { hour: 0, minute: 0, second: 0 },
  onValueChange,
  minuteStep = 1,
  secondStep = 1,
  minTime,
  maxTime,
  disabled = false,
}: TimePickerRootProps) {
  // Support controlled and uncontrolled modes
  const [internalValue, setInternalValue] = useState<TimeValue>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const [focusedSegment, setFocusedSegment] = useState<TimeSegment | null>(null);

  const setValue = useCallback(
    (nextValue: TimeValue) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange]
  );

  // Create behavior instance
  // biome-ignore lint/correctness/useExhaustiveDependencies: behavior is created once
  const behavior = useMemo(
    () =>
      createTimePickerBehavior({
        defaultValue: value,
        hourFormat,
        showSeconds,
        minuteStep,
        secondStep,
        minTime,
        maxTime,
        disabled,
        onValueChange: setValue,
      }),
    []
  );

  const contextValue = useMemo(
    () => ({
      behavior,
      value,
      setValue,
      hourFormat,
      showSeconds,
      focusedSegment,
      setFocusedSegment,
      disabled,
    }),
    [behavior, value, setValue, hourFormat, showSeconds, focusedSegment, disabled]
  );

  return <TimePickerProvider value={contextValue}>{children}</TimePickerProvider>;
}

TimePickerRoot.displayName = "TimePicker.Root";
