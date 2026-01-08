/**
 * DatePicker behavior primitive.
 * Manages date selection, calendar navigation, and ARIA state.
 */

// =============================================================================
// Types
// =============================================================================

export type DatePickerMode = "single" | "range";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DatePickerBehaviorOptions {
  /** Selection mode: single date or date range */
  mode?: DatePickerMode;
  /** Initial selected date (single mode) */
  defaultValue?: Date | null;
  /** Initial date range (range mode) */
  defaultRange?: DateRange;
  /** Called when date changes */
  onDateChange?: (date: Date | null) => void;
  /** Called when range changes */
  onRangeChange?: (range: DateRange) => void;
  /** Called when focused date changes */
  onFocusedDateChange?: (date: Date) => void;
  /** Called when calendar open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Locale for date formatting (e.g., "en-US", "de-DE") */
  locale?: string;
  /** First day of week (0 = Sunday, 1 = Monday) */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Whether picker is disabled */
  disabled?: boolean;
  /** Whether picker is read-only */
  readOnly?: boolean;
  /** Custom ID generator */
  generateId?: () => string;
}

export interface DatePickerBehaviorState {
  open: boolean;
  mode: DatePickerMode;
  selectedDate: Date | null;
  selectedRange: DateRange;
  focusedDate: Date;
  viewingMonth: Date;
  isSelectingRange: boolean;
  disabled: boolean;
}

export interface CalendarGridProps {
  role: "grid";
  "aria-label": string;
}

export interface CalendarCellProps {
  role: "gridcell";
  "aria-selected": boolean;
  "aria-disabled"?: boolean;
  tabIndex: number;
}

export interface DatePickerBehavior {
  /** Current state */
  readonly state: DatePickerBehaviorState;
  /** Grid ID */
  readonly gridId: string;

  /** Open the calendar */
  open(): void;

  /** Close the calendar */
  close(): void;

  /** Toggle the calendar */
  toggle(): void;

  /** Select a date */
  selectDate(date: Date): void;

  /** Focus a date (keyboard navigation) */
  focusDate(date: Date): void;

  /** Navigate to previous month */
  previousMonth(): void;

  /** Navigate to next month */
  nextMonth(): void;

  /** Navigate to previous year */
  previousYear(): void;

  /** Navigate to next year */
  nextYear(): void;

  /** Go to specific month/year */
  goToMonth(month: number, year: number): void;

  /** Go to today */
  goToToday(): void;

  /** Focus previous day */
  focusPreviousDay(): void;

  /** Focus next day */
  focusNextDay(): void;

  /** Focus previous week */
  focusPreviousWeek(): void;

  /** Focus next week */
  focusNextWeek(): void;

  /** Focus start of week */
  focusStartOfWeek(): void;

  /** Focus end of week */
  focusEndOfWeek(): void;

  /** Check if a date is selectable */
  isDateSelectable(date: Date): boolean;

  /** Check if a date is in the selected range */
  isInRange(date: Date): boolean;

  /** Check if a date is the range start */
  isRangeStart(date: Date): boolean;

  /** Check if a date is the range end */
  isRangeEnd(date: Date): boolean;

  /** Get days for current month grid */
  getMonthDays(): Date[];

  /** Get weekday names for current locale */
  getWeekdayNames(): string[];

  /** Get month names for current locale */
  getMonthNames(): string[];

  /** Format a date for display */
  formatDate(date: Date, format?: string): string;

  /** Parse a date string */
  parseDate(dateString: string): Date | null;

  /** Get ARIA props for grid */
  getGridProps(): CalendarGridProps;

  /** Get ARIA props for cell */
  getCellProps(date: Date): CalendarCellProps;

  /** Cleanup */
  destroy(): void;
}

// =============================================================================
// Helpers
// =============================================================================

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isSameMonth(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

function startOfWeek(date: Date, firstDayOfWeek: number): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day - firstDayOfWeek + 7) % 7;
  result.setDate(result.getDate() - diff);
  return result;
}

function endOfWeek(date: Date, firstDayOfWeek: number): Date {
  const result = startOfWeek(date, firstDayOfWeek);
  result.setDate(result.getDate() + 6);
  return result;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function isDateBefore(date: Date, compareDate: Date): boolean {
  return (
    date.getTime() <
    new Date(compareDate.getFullYear(), compareDate.getMonth(), compareDate.getDate()).getTime()
  );
}

function isDateAfter(date: Date, compareDate: Date): boolean {
  return (
    date.getTime() >
    new Date(
      compareDate.getFullYear(),
      compareDate.getMonth(),
      compareDate.getDate(),
      23,
      59,
      59,
      999
    ).getTime()
  );
}

function getMonthDays(date: Date, firstDayOfWeek: number): Date[] {
  const days: Date[] = [];
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, firstDayOfWeek);
  const calendarEnd = endOfWeek(monthEnd, firstDayOfWeek);

  let current = calendarStart;
  while (current <= calendarEnd) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }

  return days;
}

// =============================================================================
// Implementation
// =============================================================================

let idCounter = 0;

function defaultGenerateId(): string {
  return `date-picker-${++idCounter}`;
}

/**
 * Creates a date picker behavior primitive.
 *
 * @example
 * ```ts
 * const picker = createDatePickerBehavior({
 *   mode: 'single',
 *   onDateChange: (date) => console.log('Selected:', date),
 *   minDate: new Date(),
 * });
 *
 * // Navigate calendar
 * picker.nextMonth();
 * picker.previousYear();
 *
 * // Select a date
 * picker.selectDate(new Date(2026, 5, 15));
 * ```
 */
export function createDatePickerBehavior(
  options: DatePickerBehaviorOptions = {}
): DatePickerBehavior {
  const {
    mode = "single",
    defaultValue = null,
    defaultRange = { start: null, end: null },
    onDateChange,
    onRangeChange,
    onFocusedDateChange,
    onOpenChange,
    minDate,
    maxDate,
    locale = "en-US",
    firstDayOfWeek = 0,
    disabled = false,
    readOnly = false,
    generateId = defaultGenerateId,
  } = options;

  // Generate stable IDs
  const baseId = generateId();
  const gridId = `${baseId}-grid`;

  // Get today as starting point
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Internal state
  let state: DatePickerBehaviorState = {
    open: false,
    mode,
    selectedDate: defaultValue,
    selectedRange: defaultRange,
    focusedDate: defaultValue ?? today,
    viewingMonth: defaultValue ?? today,
    isSelectingRange: false,
    disabled,
  };

  // Locale-based formatters
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: "long" });
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Helpers
  function isDateSelectable(date: Date): boolean {
    if (disabled || readOnly) return false;
    if (minDate && isDateBefore(date, minDate)) return false;
    if (maxDate && isDateAfter(date, maxDate)) return false;
    return true;
  }

  function isInRange(date: Date): boolean {
    if (mode !== "range") return false;
    const { start, end } = state.selectedRange;
    if (!start || !end) return false;
    return date >= start && date <= end;
  }

  function isRangeStart(date: Date): boolean {
    if (mode !== "range" || !state.selectedRange.start) return false;
    return isSameDay(date, state.selectedRange.start);
  }

  function isRangeEnd(date: Date): boolean {
    if (mode !== "range" || !state.selectedRange.end) return false;
    return isSameDay(date, state.selectedRange.end);
  }

  function setOpen(open: boolean): void {
    if (state.open === open) return;
    if (disabled && open) return;

    state = { ...state, open };
    onOpenChange?.(open);

    if (open) {
      // Reset focused date to selected date or today when opening
      const focusDate = state.selectedDate ?? today;
      state = {
        ...state,
        focusedDate: focusDate,
        viewingMonth: focusDate,
      };
    }
  }

  // Public API
  function open(): void {
    setOpen(true);
  }

  function close(): void {
    setOpen(false);
  }

  function toggle(): void {
    setOpen(!state.open);
  }

  function selectDate(date: Date): void {
    if (!isDateSelectable(date)) return;

    if (mode === "single") {
      state = { ...state, selectedDate: date };
      onDateChange?.(date);
      close();
    } else {
      // Range mode
      if (!state.isSelectingRange || !state.selectedRange.start) {
        // Start new range
        state = {
          ...state,
          selectedRange: { start: date, end: null },
          isSelectingRange: true,
        };
      } else {
        // Complete range
        const start = state.selectedRange.start;
        const range: DateRange = date < start ? { start: date, end: start } : { start, end: date };
        state = {
          ...state,
          selectedRange: range,
          isSelectingRange: false,
        };
        onRangeChange?.(range);
        close();
      }
    }
  }

  function focusDate(date: Date): void {
    state = { ...state, focusedDate: date };
    onFocusedDateChange?.(date);

    // Update viewing month if focused date is in different month
    if (!isSameMonth(date, state.viewingMonth)) {
      state = { ...state, viewingMonth: date };
    }
  }

  function previousMonth(): void {
    state = { ...state, viewingMonth: addMonths(state.viewingMonth, -1) };
  }

  function nextMonth(): void {
    state = { ...state, viewingMonth: addMonths(state.viewingMonth, 1) };
  }

  function previousYear(): void {
    state = { ...state, viewingMonth: addYears(state.viewingMonth, -1) };
  }

  function nextYear(): void {
    state = { ...state, viewingMonth: addYears(state.viewingMonth, 1) };
  }

  function goToMonth(month: number, year: number): void {
    state = { ...state, viewingMonth: new Date(year, month, 1) };
  }

  function goToToday(): void {
    focusDate(today);
    selectDate(today);
  }

  function focusPreviousDay(): void {
    focusDate(addDays(state.focusedDate, -1));
  }

  function focusNextDay(): void {
    focusDate(addDays(state.focusedDate, 1));
  }

  function focusPreviousWeek(): void {
    focusDate(addDays(state.focusedDate, -7));
  }

  function focusNextWeek(): void {
    focusDate(addDays(state.focusedDate, 7));
  }

  function focusStartOfWeek(): void {
    focusDate(startOfWeek(state.focusedDate, firstDayOfWeek));
  }

  function focusEndOfWeek(): void {
    focusDate(endOfWeek(state.focusedDate, firstDayOfWeek));
  }

  function getMonthDaysForView(): Date[] {
    return getMonthDays(state.viewingMonth, firstDayOfWeek);
  }

  function getWeekdayNames(): string[] {
    const names: string[] = [];
    const date = new Date(2024, 0, firstDayOfWeek); // A Sunday in 2024 if firstDayOfWeek = 0
    for (let i = 0; i < 7; i++) {
      names.push(weekdayFormatter.format(addDays(date, i)));
    }
    return names;
  }

  function getMonthNames(): string[] {
    const names: string[] = [];
    for (let i = 0; i < 12; i++) {
      names.push(monthFormatter.format(new Date(2024, i, 1)));
    }
    return names;
  }

  function formatDate(date: Date, _format?: string): string {
    return dateFormatter.format(date);
  }

  function parseDate(dateString: string): Date | null {
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  }

  function getGridProps(): CalendarGridProps {
    const monthName = monthFormatter.format(state.viewingMonth);
    const year = state.viewingMonth.getFullYear();
    return {
      role: "grid",
      "aria-label": `${monthName} ${year}`,
    };
  }

  function getCellProps(date: Date): CalendarCellProps {
    const isSelected =
      mode === "single"
        ? state.selectedDate !== null && isSameDay(date, state.selectedDate)
        : isRangeStart(date) || isRangeEnd(date);
    const isDisabled = !isDateSelectable(date);
    const isFocused = isSameDay(date, state.focusedDate);

    return {
      role: "gridcell",
      "aria-selected": isSelected,
      "aria-disabled": isDisabled ? true : undefined,
      tabIndex: isFocused ? 0 : -1,
    };
  }

  function destroy(): void {
    // Cleanup if needed
  }

  return {
    get state() {
      return state;
    },
    get gridId() {
      return gridId;
    },
    open,
    close,
    toggle,
    selectDate,
    focusDate,
    previousMonth,
    nextMonth,
    previousYear,
    nextYear,
    goToMonth,
    goToToday,
    focusPreviousDay,
    focusNextDay,
    focusPreviousWeek,
    focusNextWeek,
    focusStartOfWeek,
    focusEndOfWeek,
    isDateSelectable,
    isInRange,
    isRangeStart,
    isRangeEnd,
    getMonthDays: getMonthDaysForView,
    getWeekdayNames,
    getMonthNames,
    formatDate,
    parseDate,
    getGridProps,
    getCellProps,
    destroy,
  };
}
