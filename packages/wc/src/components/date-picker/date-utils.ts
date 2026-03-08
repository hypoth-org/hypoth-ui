/**
 * Date utility functions for DatePicker component.
 * Uses date-fns for reliable date manipulation across timezones.
 * Lazily loaded so consumers who don't use DatePicker don't need date-fns installed.
 */

type DateFnsModule = typeof import("date-fns");

let _dateFns: DateFnsModule | null = null;
let _loadPromise: Promise<DateFnsModule | null> | null = null;
let _loadFailed = false;

/**
 * Lazily load the date-fns module. Throws if date-fns is not installed
 * (since DatePicker cannot function without it).
 */
async function loadDateFns(): Promise<DateFnsModule> {
  if (_dateFns) return _dateFns;

  if (_loadFailed) {
    throw new Error(
      '[ds-date-picker] "date-fns" is required for the DatePicker component.\n  npm install date-fns'
    );
  }

  if (!_loadPromise) {
    _loadPromise = import("date-fns")
      .then((mod) => {
        _dateFns = mod;
        return mod;
      })
      .catch(() => {
        _loadFailed = true;
        throw new Error(
          '[ds-date-picker] "date-fns" is not installed. Install it to use the DatePicker component:\n  npm install date-fns'
        );
      });
  }

  const mod = await _loadPromise;
  if (!mod) {
    throw new Error(
      '[ds-date-picker] "date-fns" is not installed. Install it to use the DatePicker component:\n  npm install date-fns'
    );
  }
  return mod;
}

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Returns today's date in ISO format (YYYY-MM-DD).
 */
export async function getTodayIso(): Promise<string> {
  const { format } = await loadDateFns();
  return format(new Date(), "yyyy-MM-dd");
}

/**
 * Parses a date string to a Date object.
 * Returns null if the string is empty or invalid.
 */
export async function parseDate(dateStr: string): Promise<Date | null> {
  if (!dateStr) return null;
  const { parseISO, isValid } = await loadDateFns();
  const parsed = parseISO(dateStr);
  return isValid(parsed) ? parsed : null;
}

/**
 * Formats a Date object to ISO format (YYYY-MM-DD).
 */
export async function formatIso(date: Date): Promise<string> {
  const { format } = await loadDateFns();
  return format(date, "yyyy-MM-dd");
}

/**
 * Formats a Date object to a viewing month string (YYYY-MM).
 */
export async function formatViewingMonth(date: Date): Promise<string> {
  const { format } = await loadDateFns();
  return format(date, "yyyy-MM");
}

/**
 * Parses a viewing month string (YYYY-MM) to a Date object (first day of month).
 */
export async function parseViewingMonth(viewingMonth: string): Promise<Date> {
  const { parse, isValid, startOfMonth } = await loadDateFns();
  if (!viewingMonth) {
    return startOfMonth(new Date());
  }
  const parsed = parse(viewingMonth, "yyyy-MM", new Date());
  return isValid(parsed) ? parsed : startOfMonth(new Date());
}

/**
 * Gets the weekday names for a locale, starting from the specified day.
 */
export function getWeekdayNames(
  locale: string,
  weekStartsOn: WeekStartsOn = 0,
  formatStyle: "short" | "narrow" | "long" = "short"
): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: formatStyle });
  const baseDate = new Date(2024, 0, weekStartsOn);
  const names: string[] = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(baseDate);
    day.setDate(day.getDate() + i);
    names.push(formatter.format(day));
  }

  return names;
}

/**
 * Gets all days to display in a calendar month grid.
 * Includes padding days from previous and next months.
 */
export async function getMonthDays(viewingMonth: string, weekStartsOn: WeekStartsOn = 0): Promise<Date[]> {
  const { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } = await loadDateFns();
  const monthDate = await parseViewingMonth(viewingMonth);
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);

  const calendarStart = startOfWeek(monthStart, { weekStartsOn });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

/**
 * Gets the formatted month label (e.g., "January 2026").
 */
export async function getMonthLabel(
  viewingMonth: string,
  locale: string,
  options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" }
): Promise<string> {
  const date = await parseViewingMonth(viewingMonth);
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Navigates to the previous or next month.
 */
export async function navigateMonth(viewingMonth: string, delta: number): Promise<string> {
  const { addMonths } = await loadDateFns();
  const date = await parseViewingMonth(viewingMonth);
  return formatViewingMonth(addMonths(date, delta));
}

/**
 * Navigates to the previous or next year.
 */
export async function navigateYear(viewingMonth: string, delta: number): Promise<string> {
  const { addYears } = await loadDateFns();
  const date = await parseViewingMonth(viewingMonth);
  return formatViewingMonth(addYears(date, delta));
}

/**
 * Checks if a date is disabled (outside min/max range).
 */
export async function isDateDisabled(
  date: Date,
  minDate: string | undefined,
  maxDate: string | undefined
): Promise<boolean> {
  const { isBefore, isAfter, isSameDay } = await loadDateFns();
  if (minDate) {
    const min = await parseDate(minDate);
    if (min && isBefore(date, min) && !isSameDay(date, min)) {
      return true;
    }
  }
  if (maxDate) {
    const max = await parseDate(maxDate);
    if (max && isAfter(date, max) && !isSameDay(date, max)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a date is selected (single mode or range endpoints).
 */
export async function isDateSelected(
  date: Date,
  selectedDate: string | undefined,
  rangeStart: string | undefined,
  rangeEnd: string | undefined,
  isRangeMode: boolean
): Promise<boolean> {
  const { isSameDay } = await loadDateFns();
  if (isRangeMode) {
    if (rangeStart) {
      const start = await parseDate(rangeStart);
      if (start && isSameDay(date, start)) return true;
    }
    if (rangeEnd) {
      const end = await parseDate(rangeEnd);
      if (end && isSameDay(date, end)) return true;
    }
    return false;
  }

  if (selectedDate) {
    const selected = await parseDate(selectedDate);
    return selected ? isSameDay(date, selected) : false;
  }

  return false;
}

/**
 * Checks if a date is within a selected range (exclusive of endpoints).
 */
export async function isDateInRange(
  date: Date,
  rangeStart: string | undefined,
  rangeEnd: string | undefined
): Promise<boolean> {
  if (!rangeStart || !rangeEnd) return false;
  const { isAfter, isBefore } = await loadDateFns();

  const start = await parseDate(rangeStart);
  const end = await parseDate(rangeEnd);

  if (!start || !end) return false;

  return isAfter(date, start) && isBefore(date, end);
}

/**
 * Checks if a date is today.
 */
export async function isToday(date: Date): Promise<boolean> {
  const { isToday: dateFnsIsToday } = await loadDateFns();
  return dateFnsIsToday(date);
}

/**
 * Checks if a date is in the currently viewed month.
 */
export async function isDateInCurrentMonth(date: Date, viewingMonth: string): Promise<boolean> {
  const { isSameMonth } = await loadDateFns();
  const monthDate = await parseViewingMonth(viewingMonth);
  return isSameMonth(date, monthDate);
}

/**
 * Formats a date for display in the input field.
 */
export function formatDisplayDate(
  date: Date | null,
  locale: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }
): string {
  if (!date) return "";
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Formats a date range for display.
 */
export async function formatDisplayRange(
  start: string | undefined,
  end: string | undefined,
  locale: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }
): Promise<string> {
  const startDate = start ? await parseDate(start) : null;
  const endDate = end ? await parseDate(end) : null;
  const formatter = new Intl.DateTimeFormat(locale, options);

  if (startDate && endDate) {
    return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
  }
  if (startDate) {
    return formatter.format(startDate);
  }
  return "";
}

/**
 * Validates a date string format (YYYY-MM-DD).
 */
export async function isValidDateString(dateStr: string): Promise<boolean> {
  if (!dateStr) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const { parseISO, isValid } = await loadDateFns();
  const parsed = parseISO(dateStr);
  return isValid(parsed);
}

/**
 * Clamps a date to within min/max bounds.
 */
export async function clampDate(
  date: Date,
  minDate: string | undefined,
  maxDate: string | undefined
): Promise<Date> {
  const { isBefore, isAfter } = await loadDateFns();
  let result = date;

  if (minDate) {
    const min = await parseDate(minDate);
    if (min && isBefore(result, min)) {
      result = min;
    }
  }

  if (maxDate) {
    const max = await parseDate(maxDate);
    if (max && isAfter(result, max)) {
      result = max;
    }
  }

  return result;
}

/**
 * Date format patterns for common locales.
 */
const LOCALE_DATE_FORMATS: Record<string, string> = {
  "en-US": "MM/dd/yyyy",
  "en-GB": "dd/MM/yyyy",
  "en-CA": "yyyy-MM-dd",
  "en-AU": "dd/MM/yyyy",
  "de-DE": "dd.MM.yyyy",
  "fr-FR": "dd/MM/yyyy",
  "es-ES": "dd/MM/yyyy",
  "it-IT": "dd/MM/yyyy",
  "pt-BR": "dd/MM/yyyy",
  "ja-JP": "yyyy/MM/dd",
  "ko-KR": "yyyy.MM.dd",
  "zh-CN": "yyyy/MM/dd",
  "zh-TW": "yyyy/MM/dd",
  "ru-RU": "dd.MM.yyyy",
  "pl-PL": "dd.MM.yyyy",
  "nl-NL": "dd-MM-yyyy",
  "sv-SE": "yyyy-MM-dd",
  "da-DK": "dd-MM-yyyy",
  "fi-FI": "dd.MM.yyyy",
  "nb-NO": "dd.MM.yyyy",
  "cs-CZ": "dd.MM.yyyy",
  "hu-HU": "yyyy.MM.dd",
  "tr-TR": "dd.MM.yyyy",
  "ar-SA": "dd/MM/yyyy",
  "he-IL": "dd/MM/yyyy",
  "th-TH": "dd/MM/yyyy",
};

/**
 * Gets the date format pattern for a locale.
 */
export function getDateFormat(locale: string): string {
  if (LOCALE_DATE_FORMATS[locale]) {
    return LOCALE_DATE_FORMATS[locale];
  }

  const lang = locale.split("-")[0];
  for (const [key, fmt] of Object.entries(LOCALE_DATE_FORMATS)) {
    if (key.startsWith(`${lang}-`)) {
      return fmt;
    }
  }

  return "MM/dd/yyyy";
}

/**
 * Gets a human-readable date format placeholder for a locale.
 */
export function getDateFormatPlaceholder(locale: string): string {
  const fmt = getDateFormat(locale);
  return fmt.replace(/yyyy/g, "YYYY").replace(/MM/g, "MM").replace(/dd/g, "DD");
}

/**
 * Result of parsing a typed date input.
 */
export interface DateParseResult {
  valid: boolean;
  date: string | null;
  error: string | null;
}

/**
 * Parses a user-typed date string based on locale format.
 */
export async function parseTypedDate(input: string, locale: string): Promise<DateParseResult> {
  if (!input || !input.trim()) {
    return { valid: false, date: null, error: null };
  }

  const { parse, isValid, parseISO } = await loadDateFns();
  const trimmed = input.trim();
  const fmt = getDateFormat(locale);

  const parsed = parse(trimmed, fmt, new Date());
  if (isValid(parsed)) {
    const iso = await formatIso(parsed);
    return { valid: true, date: iso, error: null };
  }

  const separators = ["/", "-", "."];
  for (const sep of separators) {
    const normalizedInput = trimmed.replace(/[\/\-\.]/g, sep);
    const normalizedFormat = fmt.replace(/[\/\-\.]/g, sep);
    const attempt = parse(normalizedInput, normalizedFormat, new Date());
    if (isValid(attempt)) {
      const iso = await formatIso(attempt);
      return { valid: true, date: iso, error: null };
    }
  }

  const isoAttempt = parseISO(trimmed);
  if (isValid(isoAttempt)) {
    const iso = await formatIso(isoAttempt);
    return { valid: true, date: iso, error: null };
  }

  return {
    valid: false,
    date: null,
    error: `Invalid date format. Expected: ${getDateFormatPlaceholder(locale)}`,
  };
}

/**
 * Formats a date for display in a typed input field.
 */
export async function formatTypedDate(dateIso: string, locale: string): Promise<string> {
  if (!dateIso) return "";
  const date = await parseDate(dateIso);
  if (!date) return "";
  const { format } = await loadDateFns();
  return format(date, getDateFormat(locale));
}

/**
 * Validates a typed date against min/max constraints.
 */
export async function validateTypedDate(
  dateIso: string,
  minDate: string | undefined,
  maxDate: string | undefined,
  locale: string
): Promise<DateParseResult> {
  if (!dateIso) {
    return { valid: false, date: null, error: null };
  }

  const { isBefore, isAfter, isSameDay } = await loadDateFns();
  const date = await parseDate(dateIso);
  if (!date) {
    return { valid: false, date: null, error: "Invalid date" };
  }

  if (minDate) {
    const min = await parseDate(minDate);
    if (min && isBefore(date, min) && !isSameDay(date, min)) {
      const minFormatted = await formatTypedDate(minDate, locale);
      return {
        valid: false,
        date: dateIso,
        error: `Date must be on or after ${minFormatted}`,
      };
    }
  }

  if (maxDate) {
    const max = await parseDate(maxDate);
    if (max && isAfter(date, max) && !isSameDay(date, max)) {
      const maxFormatted = await formatTypedDate(maxDate, locale);
      return {
        valid: false,
        date: dateIso,
        error: `Date must be on or before ${maxFormatted}`,
      };
    }
  }

  return { valid: true, date: dateIso, error: null };
}
