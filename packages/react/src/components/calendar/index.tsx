"use client";

import { forwardRef, createElement, useEffect, useRef, type HTMLAttributes } from "react";
import "@ds/wc";

export type CalendarSize = "default" | "compact";

export interface CalendarProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /**
   * Selected date (ISO format: YYYY-MM-DD).
   */
  value?: string;

  /**
   * Minimum selectable date (ISO format).
   */
  min?: string;

  /**
   * Maximum selectable date (ISO format).
   */
  max?: string;

  /**
   * Disabled dates (array of ISO format strings).
   */
  disabledDates?: string[];

  /**
   * Locale for month/day names.
   * @default "en-US"
   */
  locale?: string;

  /**
   * Size variant.
   * @default "default"
   */
  size?: CalendarSize;

  /**
   * First day of week (0 = Sunday, 1 = Monday).
   * @default 0
   */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Callback when a date is selected.
   */
  onChange?: (value: string, date: Date) => void;

  /**
   * Callback when the displayed month changes.
   */
  onMonthChange?: (month: number, year: number) => void;
}

/**
 * Calendar component for date selection.
 *
 * @example
 * ```tsx
 * <Calendar
 *   value="2024-01-15"
 *   min="2024-01-01"
 *   max="2024-12-31"
 *   onChange={(value, date) => console.log(value, date)}
 * />
 * ```
 */
export const Calendar = forwardRef<HTMLElement, CalendarProps>(function Calendar(
  {
    value,
    min,
    max,
    disabledDates = [],
    locale = "en-US",
    size = "default",
    firstDayOfWeek = 0,
    onChange,
    onMonthChange,
    className,
    ...props
  },
  forwardedRef
) {
  const internalRef = useRef<HTMLElement>(null);

  // Sync forwarded ref
  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  // Set up event listeners
  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    const handleChange = (e: Event) => {
      const event = e as CustomEvent<{ value: string; date: string }>;
      onChange?.(event.detail.value, new Date(event.detail.date));
    };

    const handleMonthChange = (e: Event) => {
      const event = e as CustomEvent<{ month: number; year: number }>;
      onMonthChange?.(event.detail.month, event.detail.year);
    };

    element.addEventListener("ds:change", handleChange);
    element.addEventListener("ds:month-change", handleMonthChange);

    return () => {
      element.removeEventListener("ds:change", handleChange);
      element.removeEventListener("ds:month-change", handleMonthChange);
    };
  }, [onChange, onMonthChange]);

  return createElement("ds-calendar", {
    ref: internalRef,
    value,
    min,
    max,
    "disabled-dates": disabledDates.join(","),
    locale,
    size,
    "first-day-of-week": firstDayOfWeek,
    class: className,
    ...props,
  });
});

// TypeScript declaration for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ds-calendar": CalendarProps & {
        ref?: React.Ref<HTMLElement>;
        "disabled-dates"?: string;
        "first-day-of-week"?: number;
        "onDs-change"?: (event: CustomEvent) => void;
        "onDs-month-change"?: (event: CustomEvent) => void;
      };
    }
  }
}
