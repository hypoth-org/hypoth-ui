/**
 * TimePicker Segment component - individual time segment (hour, minute, second, period).
 */

import type { TimeSegment } from "@hypoth-ui/primitives-dom";
import {
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  forwardRef,
  useCallback,
} from "react";
import { useTimePickerContext } from "./time-picker-context.js";

export interface TimePickerSegmentProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Which segment this represents */
  segment: TimeSegment;
}

/**
 * Individual segment for time input (hour, minute, second, or period).
 *
 * @example
 * ```tsx
 * <TimePicker.Segment segment="hour" />
 * <span>:</span>
 * <TimePicker.Segment segment="minute" />
 * ```
 */
export const TimePickerSegment = forwardRef<HTMLSpanElement, TimePickerSegmentProps>(
  ({ segment, className, onFocus, onBlur, onKeyDown, ...restProps }, ref) => {
    const { behavior, focusedSegment, setFocusedSegment, disabled } =
      useTimePickerContext("TimePicker.Segment");

    const props = behavior.getSegmentProps(segment);
    const displayValue = behavior.getSegmentDisplayValue(segment);
    const isFocused = focusedSegment === segment;

    const handleFocus = useCallback(
      (event: FocusEvent<HTMLSpanElement>) => {
        setFocusedSegment(segment);
        behavior.focusSegment(segment);
        onFocus?.(event);
      },
      [behavior, segment, setFocusedSegment, onFocus]
    );

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLSpanElement>) => {
        setFocusedSegment(null);
        behavior.blur();
        onBlur?.(event);
      },
      [behavior, setFocusedSegment, onBlur]
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLSpanElement>) => {
        behavior.handleSegmentKeyDown(segment, event.nativeEvent);
        onKeyDown?.(event);
      },
      [behavior, segment, onKeyDown]
    );

    return (
      <span
        ref={ref}
        role={props.role}
        tabIndex={props.tabIndex}
        aria-valuemin={props["aria-valuemin"]}
        aria-valuemax={props["aria-valuemax"]}
        aria-valuenow={props["aria-valuenow"]}
        aria-valuetext={props["aria-valuetext"]}
        aria-label={props["aria-label"]}
        aria-disabled={props["aria-disabled"]}
        className={className}
        data-segment={segment}
        data-focused={isFocused || undefined}
        data-disabled={disabled || undefined}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...restProps}
      >
        {displayValue}
      </span>
    );
  }
);

TimePickerSegment.displayName = "TimePicker.Segment";
