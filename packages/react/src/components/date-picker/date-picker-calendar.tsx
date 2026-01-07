/**
 * DatePicker Calendar component - the actual calendar grid.
 */

import { type HTMLAttributes, type ReactNode, forwardRef, useCallback, useMemo } from "react";
import { useDatePickerContext } from "./date-picker-context.js";

export interface DatePickerCalendarProps extends HTMLAttributes<HTMLDivElement> {
  /** Custom header renderer */
  renderHeader?: (props: {
    month: string;
    year: number;
    onPrevMonth: () => void;
    onNextMonth: () => void;
  }) => ReactNode;
}

/**
 * Calendar grid component for date selection.
 *
 * @example
 * ```tsx
 * <DatePicker.Calendar />
 * ```
 */
export const DatePickerCalendar = forwardRef<HTMLDivElement, DatePickerCalendarProps>(
  ({ className, renderHeader, onKeyDown, ...restProps }, ref) => {
    const {
      behavior,
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
      setOpen,
    } = useDatePickerContext("DatePicker.Calendar");

    // Formatters
    const monthFormatter = useMemo(
      () => new Intl.DateTimeFormat(locale, { month: "long" }),
      [locale]
    );
    const weekdayFormatter = useMemo(
      () => new Intl.DateTimeFormat(locale, { weekday: "short" }),
      [locale]
    );

    // Get weekday names
    const weekdayNames = useMemo(() => {
      const names: string[] = [];
      const date = new Date(2024, 0, firstDayOfWeek);
      for (let i = 0; i < 7; i++) {
        const d = new Date(date);
        d.setDate(d.getDate() + i);
        names.push(weekdayFormatter.format(d));
      }
      return names;
    }, [weekdayFormatter, firstDayOfWeek]);

    // Get days for current month
    const days = useMemo(() => {
      const result: Date[] = [];
      const monthStart = new Date(viewingMonth.getFullYear(), viewingMonth.getMonth(), 1);
      const monthEnd = new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() + 1, 0);

      // Get calendar start
      const calendarStart = new Date(monthStart);
      const dayOffset = (calendarStart.getDay() - firstDayOfWeek + 7) % 7;
      calendarStart.setDate(calendarStart.getDate() - dayOffset);

      // Get calendar end
      const calendarEnd = new Date(monthEnd);
      const endOffset = 6 - ((calendarEnd.getDay() - firstDayOfWeek + 7) % 7);
      calendarEnd.setDate(calendarEnd.getDate() + endOffset);

      // Generate days
      const current = new Date(calendarStart);
      while (current <= calendarEnd) {
        result.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      return result;
    }, [viewingMonth, firstDayOfWeek]);

    // Navigation handlers
    const prevMonth = useCallback(() => {
      const newMonth = new Date(viewingMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      setViewingMonth(newMonth);
    }, [viewingMonth, setViewingMonth]);

    const nextMonth = useCallback(() => {
      const newMonth = new Date(viewingMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      setViewingMonth(newMonth);
    }, [viewingMonth, setViewingMonth]);

    // Date selection
    const selectDate = useCallback(
      (date: Date) => {
        if (mode === "single") {
          setValue(date);
          setOpen(false);
        } else {
          // Range mode
          if (!range.start || (range.start && range.end)) {
            // Start new range
            setRange({ start: date, end: null });
          } else {
            // Complete range
            const start = range.start;
            if (date < start) {
              setRange({ start: date, end: start });
            } else {
              setRange({ start, end: date });
            }
            setOpen(false);
          }
        }
      },
      [mode, range, setValue, setRange, setOpen]
    );

    // Keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        let newFocused: Date | null = null;

        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault();
            newFocused = new Date(focusedDate);
            newFocused.setDate(newFocused.getDate() - 1);
            break;
          case "ArrowRight":
            event.preventDefault();
            newFocused = new Date(focusedDate);
            newFocused.setDate(newFocused.getDate() + 1);
            break;
          case "ArrowUp":
            event.preventDefault();
            newFocused = new Date(focusedDate);
            newFocused.setDate(newFocused.getDate() - 7);
            break;
          case "ArrowDown":
            event.preventDefault();
            newFocused = new Date(focusedDate);
            newFocused.setDate(newFocused.getDate() + 7);
            break;
          case "Home":
            event.preventDefault();
            newFocused = new Date(focusedDate);
            newFocused.setDate(newFocused.getDate() - newFocused.getDay() + firstDayOfWeek);
            break;
          case "End":
            event.preventDefault();
            newFocused = new Date(focusedDate);
            newFocused.setDate(newFocused.getDate() + (6 - newFocused.getDay() + firstDayOfWeek));
            break;
          case "PageUp":
            event.preventDefault();
            if (event.shiftKey) {
              const newMonth = new Date(viewingMonth);
              newMonth.setFullYear(newMonth.getFullYear() - 1);
              setViewingMonth(newMonth);
            } else {
              prevMonth();
            }
            return;
          case "PageDown":
            event.preventDefault();
            if (event.shiftKey) {
              const newMonth = new Date(viewingMonth);
              newMonth.setFullYear(newMonth.getFullYear() + 1);
              setViewingMonth(newMonth);
            } else {
              nextMonth();
            }
            return;
          case "Enter":
          case " ":
            event.preventDefault();
            selectDate(focusedDate);
            return;
          case "Escape":
            event.preventDefault();
            setOpen(false);
            return;
        }

        if (newFocused) {
          setFocusedDate(newFocused);
          // Update viewing month if needed
          if (
            newFocused.getMonth() !== viewingMonth.getMonth() ||
            newFocused.getFullYear() !== viewingMonth.getFullYear()
          ) {
            setViewingMonth(new Date(newFocused.getFullYear(), newFocused.getMonth(), 1));
          }
        }

        onKeyDown?.(event);
      },
      [
        focusedDate,
        firstDayOfWeek,
        viewingMonth,
        setFocusedDate,
        setViewingMonth,
        prevMonth,
        nextMonth,
        selectDate,
        setOpen,
        onKeyDown,
      ]
    );

    // Check helpers
    const isDateDisabled = useCallback(
      (date: Date) => {
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
      },
      [minDate, maxDate]
    );

    const isSameDay = (d1: Date, d2: Date | null) => {
      if (!d2) return false;
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    };

    const isInRange = (date: Date) => {
      if (mode !== "range" || !range.start || !range.end) return false;
      return date >= range.start && date <= range.end;
    };

    const isToday = (date: Date) => {
      const today = new Date();
      return isSameDay(date, today);
    };

    const isCurrentMonth = (date: Date) => {
      return (
        date.getMonth() === viewingMonth.getMonth() &&
        date.getFullYear() === viewingMonth.getFullYear()
      );
    };

    const monthLabel = monthFormatter.format(viewingMonth);
    const year = viewingMonth.getFullYear();

    // Render weeks
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div ref={ref} className={className} onKeyDown={handleKeyDown} tabIndex={-1} {...restProps}>
        {/* Header */}
        {renderHeader ? (
          renderHeader({ month: monthLabel, year, onPrevMonth: prevMonth, onNextMonth: nextMonth })
        ) : (
          <div className="ds-date-picker-header">
            <button type="button" aria-label="Previous month" onClick={prevMonth}>
              ‹
            </button>
            <span>
              {monthLabel} {year}
            </span>
            <button type="button" aria-label="Next month" onClick={nextMonth}>
              ›
            </button>
          </div>
        )}

        {/* Calendar grid */}
        <table role="grid" aria-label={`${monthLabel} ${year}`}>
          <thead>
            <tr>
              {weekdayNames.map((day, i) => (
                <th key={i} scope="col" abbr={day}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((date, dayIndex) => {
                  const disabled = isDateDisabled(date);
                  const selected =
                    mode === "single"
                      ? isSameDay(date, value)
                      : isSameDay(date, range.start) || isSameDay(date, range.end);
                  const inRange = isInRange(date);
                  const today = isToday(date);
                  const currentMonth = isCurrentMonth(date);
                  const focused = isSameDay(date, focusedDate);

                  return (
                    <td
                      key={dayIndex}
                      role="gridcell"
                      aria-selected={selected}
                      aria-disabled={disabled || undefined}
                      tabIndex={focused ? 0 : -1}
                      data-date={date.toISOString().split("T")[0]}
                      data-selected={selected || undefined}
                      data-in-range={inRange || undefined}
                      data-today={today || undefined}
                      data-current-month={currentMonth || undefined}
                      data-focused={focused || undefined}
                      onClick={() => !disabled && selectDate(date)}
                    >
                      {date.getDate()}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

DatePickerCalendar.displayName = "DatePicker.Calendar";
