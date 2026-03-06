/**
 * Date utility functions for DatePicker component.
 * Uses date-fns for reliable date manipulation across timezones.
 */

import {
  addMonths,
  addYears,
  isToday as dateFnsIsToday,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isValid,
  parse,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Returns today's date in ISO format (YYYY-MM-DD).
 */
export function getTodayIso(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/**
 * Parses a date string to a Date object.
 * Returns null if the string is empty or invalid.
 */
export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parsed = parseISO(dateStr);
  return isValid(parsed) ? parsed : null;
}

/**
 * Formats a Date object to ISO format (YYYY-MM-DD).
 */
export function formatIso(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Formats a Date object to a viewing month string (YYYY-MM).
 */
export function formatViewingMonth(date: Date): string {
  return format(date, "yyyy-MM");
}

/**
 * Parses a viewing month string (YYYY-MM) to a Date object (first day of month).
 */
export function parseViewingMonth(viewingMonth: string): Date {
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

  // Start from January 2024, which starts on Monday (day 1)
  // We adjust based on weekStartsOn
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
export function getMonthDays(viewingMonth: string, weekStartsOn: WeekStartsOn = 0): Date[] {
  const monthDate = parseViewingMonth(viewingMonth);
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);

  // Get calendar bounds (including days from adjacent months)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

/**
 * Gets the formatted month label (e.g., "January 2026").
 */
export function getMonthLabel(
  viewingMonth: string,
  locale: string,
  options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" }
): string {
  const date = parseViewingMonth(viewingMonth);
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Navigates to the previous or next month.
 */
export function navigateMonth(viewingMonth: string, delta: number): string {
  const date = parseViewingMonth(viewingMonth);
  return formatViewingMonth(addMonths(date, delta));
}

/**
 * Navigates to the previous or next year.
 */
export function navigateYear(viewingMonth: string, delta: number): string {
  const date = parseViewingMonth(viewingMonth);
  return formatViewingMonth(addYears(date, delta));
}

/**
 * Checks if a date is disabled (outside min/max range).
 */
export function isDateDisabled(
  date: Date,
  minDate: string | undefined,
  maxDate: string | undefined
): boolean {
  if (minDate) {
    const min = parseDate(minDate);
    if (min && isBefore(date, min) && !isSameDay(date, min)) {
      return true;
    }
  }
  if (maxDate) {
    const max = parseDate(maxDate);
    if (max && isAfter(date, max) && !isSameDay(date, max)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a date is selected (single mode or range endpoints).
 */
export function isDateSelected(
  date: Date,
  selectedDate: string | undefined,
  rangeStart: string | undefined,
  rangeEnd: string | undefined,
  isRangeMode: boolean
): boolean {
  if (isRangeMode) {
    if (rangeStart) {
      const start = parseDate(rangeStart);
      if (start && isSameDay(date, start)) return true;
    }
    if (rangeEnd) {
      const end = parseDate(rangeEnd);
      if (end && isSameDay(date, end)) return true;
    }
    return false;
  }

  if (selectedDate) {
    const selected = parseDate(selectedDate);
    return selected ? isSameDay(date, selected) : false;
  }

  return false;
}

/**
 * Checks if a date is within a selected range (exclusive of endpoints).
 */
export function isDateInRange(
  date: Date,
  rangeStart: string | undefined,
  rangeEnd: string | undefined
): boolean {
  if (!rangeStart || !rangeEnd) return false;

  const start = parseDate(rangeStart);
  const end = parseDate(rangeEnd);

  if (!start || !end) return false;

  return isAfter(date, start) && isBefore(date, end);
}

/**
 * Checks if a date is today.
 */
export function isToday(date: Date): boolean {
  return dateFnsIsToday(date);
}

/**
 * Checks if a date is in the currently viewed month.
 */
export function isDateInCurrentMonth(date: Date, viewingMonth: string): boolean {
  const monthDate = parseViewingMonth(viewingMonth);
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
export function formatDisplayRange(
  start: string | undefined,
  end: string | undefined,
  locale: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }
): string {
  const startDate = start ? parseDate(start) : null;
  const endDate = end ? parseDate(end) : null;
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
export function isValidDateString(dateStr: string): boolean {
  if (!dateStr) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const parsed = parseISO(dateStr);
  return isValid(parsed);
}

/**
 * Clamps a date to within min/max bounds.
 */
export function clampDate(
  date: Date,
  minDate: string | undefined,
  maxDate: string | undefined
): Date {
  let result = date;

  if (minDate) {
    const min = parseDate(minDate);
    if (min && isBefore(result, min)) {
      result = min;
    }
  }

  if (maxDate) {
    const max = parseDate(maxDate);
    if (max && isAfter(result, max)) {
      result = max;
    }
  }

  return result;
}

/**
 * Date format patterns for common locales.
 * Maps locale codes to their date-fns format patterns.
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
 * Returns MM/dd/yyyy as default for unknown locales.
 */
export function getDateFormat(locale: string): string {
  // Try exact match
  if (LOCALE_DATE_FORMATS[locale]) {
    return LOCALE_DATE_FORMATS[locale];
  }

  // Try language only (e.g., "en" from "en-XX")
  const lang = locale.split("-")[0];
  for (const [key, fmt] of Object.entries(LOCALE_DATE_FORMATS)) {
    if (key.startsWith(`${lang}-`)) {
      return fmt;
    }
  }

  // Default to MM/dd/yyyy
  return "MM/dd/yyyy";
}

/**
 * Gets a human-readable date format placeholder for a locale.
 * E.g., "MM/DD/YYYY" for en-US, "DD/MM/YYYY" for en-GB
 */
export function getDateFormatPlaceholder(locale: string): string {
  const fmt = getDateFormat(locale);
  return fmt.replace(/yyyy/g, "YYYY").replace(/MM/g, "MM").replace(/dd/g, "DD");
}

/**
 * Result of parsing a typed date input.
 */
export interface DateParseResult {
  /** Whether the input was successfully parsed */
  valid: boolean;
  /** The parsed date in ISO format (YYYY-MM-DD), if valid */
  date: string | null;
  /** Error message if invalid */
  error: string | null;
}

/**
 * Parses a user-typed date string based on locale format.
 * Supports flexible separator matching (/, -, .).
 */
export function parseTypedDate(input: string, locale: string): DateParseResult {
  if (!input || !input.trim()) {
    return { valid: false, date: null, error: null };
  }

  const trimmed = input.trim();
  const fmt = getDateFormat(locale);

  // Try parsing with the locale format
  const parsed = parse(trimmed, fmt, new Date());
  if (isValid(parsed)) {
    return { valid: true, date: formatIso(parsed), error: null };
  }

  // Try common separator variations
  const separators = ["/", "-", "."];
  for (const sep of separators) {
    const normalizedInput = trimmed.replace(/[\/\-\.]/g, sep);
    const normalizedFormat = fmt.replace(/[\/\-\.]/g, sep);
    const attempt = parse(normalizedInput, normalizedFormat, new Date());
    if (isValid(attempt)) {
      return { valid: true, date: formatIso(attempt), error: null };
    }
  }

  // Try ISO format as fallback
  const isoAttempt = parseISO(trimmed);
  if (isValid(isoAttempt)) {
    return { valid: true, date: formatIso(isoAttempt), error: null };
  }

  return {
    valid: false,
    date: null,
    error: `Invalid date format. Expected: ${getDateFormatPlaceholder(locale)}`,
  };
}

/**
 * Formats a date for display in a typed input field.
 * Uses the locale-specific format pattern.
 */
export function formatTypedDate(dateIso: string, locale: string): string {
  if (!dateIso) return "";
  const date = parseDate(dateIso);
  if (!date) return "";
  return format(date, getDateFormat(locale));
}

/**
 * Validates a typed date against min/max constraints.
 */
export function validateTypedDate(
  dateIso: string,
  minDate: string | undefined,
  maxDate: string | undefined,
  locale: string
): DateParseResult {
  if (!dateIso) {
    return { valid: false, date: null, error: null };
  }

  const date = parseDate(dateIso);
  if (!date) {
    return { valid: false, date: null, error: "Invalid date" };
  }

  if (minDate) {
    const min = parseDate(minDate);
    if (min && isBefore(date, min) && !isSameDay(date, min)) {
      const minFormatted = formatTypedDate(minDate, locale);
      return {
        valid: false,
        date: dateIso,
        error: `Date must be on or after ${minFormatted}`,
      };
    }
  }

  if (maxDate) {
    const max = parseDate(maxDate);
    if (max && isAfter(date, max) && !isSameDay(date, max)) {
      const maxFormatted = formatTypedDate(maxDate, locale);
      return {
        valid: false,
        date: dateIso,
        error: `Date must be on or before ${maxFormatted}`,
      };
    }
  }

  return { valid: true, date: dateIso, error: null };
}
