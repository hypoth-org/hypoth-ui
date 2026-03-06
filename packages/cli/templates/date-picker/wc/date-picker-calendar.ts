import { html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type CalendarState = "open" | "closed";

/**
 * DatePicker calendar grid with navigation.
 *
 * @element ds-date-picker-calendar
 *
 * @slot header - Custom header content
 *
 * @fires ds:date-select - Fired when a date is selected
 * @fires ds:navigate - Fired when month/year navigation occurs
 *
 * @example
 * ```html
 * <ds-date-picker-calendar
 *   viewing-month="2026-01"
 *   selected-date="2026-01-15"
 *   min-date="2026-01-01"
 * ></ds-date-picker-calendar>
 * ```
 */
export class DsDatePickerCalendar extends DSElement {
  /** Current viewing month (YYYY-MM format) */
  @property({ type: String, attribute: "viewing-month" })
  viewingMonth = "";

  /** Selected date (ISO format) */
  @property({ type: String, attribute: "selected-date" })
  selectedDate = "";

  /** Selected range start (ISO format) */
  @property({ type: String, attribute: "range-start" })
  rangeStart = "";

  /** Selected range end (ISO format) */
  @property({ type: String, attribute: "range-end" })
  rangeEnd = "";

  /** Minimum selectable date (ISO format) */
  @property({ type: String, attribute: "min-date" })
  minDate = "";

  /** Maximum selectable date (ISO format) */
  @property({ type: String, attribute: "max-date" })
  maxDate = "";

  /** Locale for formatting */
  @property({ type: String })
  locale = "en-US";

  /** First day of week (0=Sunday, 1=Monday, etc.) */
  @property({ type: Number, attribute: "first-day-of-week" })
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;

  /** Animation state */
  @property({ type: String, reflect: true, attribute: "data-state" })
  dataState: CalendarState = "closed";

  /** Whether in range selection mode */
  @property({ type: Boolean, reflect: true })
  range = false;

  @state()
  private focusedDate = "";

  private monthFormatter: Intl.DateTimeFormat | null = null;
  private weekdayFormatter: Intl.DateTimeFormat | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("role", "application");

    // Generate ID if not set
    if (!this.id) {
      this.id = `date-picker-calendar-${crypto.randomUUID().slice(0, 8)}`;
    }

    // Initialize viewing month to current if not set
    if (!this.viewingMonth) {
      const now = new Date();
      this.viewingMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    }

    // Initialize focused date
    this.focusedDate = this.selectedDate || this.getTodayIso();

    // Initialize formatters
    this.updateFormatters();

    // Listen for keyboard navigation
    this.addEventListener("keydown", this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this.handleKeyDown);
  }

  private updateFormatters(): void {
    this.monthFormatter = new Intl.DateTimeFormat(this.locale, {
      month: "long",
      year: "numeric",
    });
    this.weekdayFormatter = new Intl.DateTimeFormat(this.locale, {
      weekday: "short",
    });
  }

  private getTodayIso(): string {
    return new Date().toISOString().split("T")[0] ?? "";
  }

  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const parsed = new Date(dateStr);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  }

  private formatIso(date: Date): string {
    return date.toISOString().split("T")[0] ?? "";
  }

  private getViewingDate(): Date {
    const [year, month] = this.viewingMonth.split("-").map(Number);
    return new Date(year ?? 2026, (month ?? 1) - 1, 1);
  }

  private getWeekdayNames(): string[] {
    if (!this.weekdayFormatter) return [];
    const names: string[] = [];
    const date = new Date(2024, 0, this.firstDayOfWeek);
    for (let i = 0; i < 7; i++) {
      const d = new Date(date);
      d.setDate(d.getDate() + i);
      names.push(this.weekdayFormatter.format(d));
    }
    return names;
  }

  private getMonthDays(): Date[] {
    const viewDate = this.getViewingDate();
    const days: Date[] = [];

    // Get first day of month
    const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const monthEnd = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);

    // Get calendar start (may include days from previous month)
    const calendarStart = new Date(monthStart);
    const dayOffset = (calendarStart.getDay() - this.firstDayOfWeek + 7) % 7;
    calendarStart.setDate(calendarStart.getDate() - dayOffset);

    // Get calendar end (may include days from next month)
    const calendarEnd = new Date(monthEnd);
    const endOffset = 6 - ((calendarEnd.getDay() - this.firstDayOfWeek + 7) % 7);
    calendarEnd.setDate(calendarEnd.getDate() + endOffset);

    // Generate all days
    const current = new Date(calendarStart);
    while (current <= calendarEnd) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  private isDateDisabled(date: Date): boolean {
    const isoDate = this.formatIso(date);
    if (this.minDate && isoDate < this.minDate) return true;
    if (this.maxDate && isoDate > this.maxDate) return true;
    return false;
  }

  private isDateSelected(date: Date): boolean {
    const isoDate = this.formatIso(date);
    if (this.range) {
      return isoDate === this.rangeStart || isoDate === this.rangeEnd;
    }
    return isoDate === this.selectedDate;
  }

  private isDateInRange(date: Date): boolean {
    if (!this.range || !this.rangeStart || !this.rangeEnd) return false;
    const isoDate = this.formatIso(date);
    return isoDate >= this.rangeStart && isoDate <= this.rangeEnd;
  }

  private isDateToday(date: Date): boolean {
    return this.formatIso(date) === this.getTodayIso();
  }

  private isDateInCurrentMonth(date: Date): boolean {
    const viewDate = this.getViewingDate();
    return date.getMonth() === viewDate.getMonth() && date.getFullYear() === viewDate.getFullYear();
  }

  private handleDateClick(date: Date): void {
    if (this.isDateDisabled(date)) return;

    const isoDate = this.formatIso(date);
    this.focusedDate = isoDate;

    this.dispatchEvent(
      new CustomEvent("ds:date-select", {
        bubbles: true,
        composed: true,
        detail: { date: isoDate },
      })
    );
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    const focused = this.parseDate(this.focusedDate);
    if (!focused) return;

    let newFocused: Date | null = null;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        newFocused = new Date(focused);
        newFocused.setDate(newFocused.getDate() - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        newFocused = new Date(focused);
        newFocused.setDate(newFocused.getDate() + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        newFocused = new Date(focused);
        newFocused.setDate(newFocused.getDate() - 7);
        break;
      case "ArrowDown":
        event.preventDefault();
        newFocused = new Date(focused);
        newFocused.setDate(newFocused.getDate() + 7);
        break;
      case "Home":
        event.preventDefault();
        newFocused = new Date(focused);
        newFocused.setDate(newFocused.getDate() - newFocused.getDay() + this.firstDayOfWeek);
        break;
      case "End":
        event.preventDefault();
        newFocused = new Date(focused);
        newFocused.setDate(newFocused.getDate() + (6 - newFocused.getDay() + this.firstDayOfWeek));
        break;
      case "PageUp":
        event.preventDefault();
        if (event.shiftKey) {
          this.navigateYear(-1);
        } else {
          this.navigateMonth(-1);
        }
        return;
      case "PageDown":
        event.preventDefault();
        if (event.shiftKey) {
          this.navigateYear(1);
        } else {
          this.navigateMonth(1);
        }
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        this.handleDateClick(focused);
        return;
    }

    if (newFocused) {
      this.focusedDate = this.formatIso(newFocused);
      // Update viewing month if needed
      const newMonth = `${newFocused.getFullYear()}-${String(newFocused.getMonth() + 1).padStart(2, "0")}`;
      if (newMonth !== this.viewingMonth) {
        this.viewingMonth = newMonth;
      }
      this.requestUpdate();
    }
  };

  /**
   * Navigate to previous/next month.
   */
  public navigateMonth(delta: number): void {
    const current = this.getViewingDate();
    current.setMonth(current.getMonth() + delta);
    this.viewingMonth = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
    this.dispatchEvent(
      new CustomEvent("ds:navigate", {
        bubbles: true,
        composed: true,
        detail: { viewingMonth: this.viewingMonth },
      })
    );
  }

  /**
   * Navigate to previous/next year.
   */
  public navigateYear(delta: number): void {
    const current = this.getViewingDate();
    current.setFullYear(current.getFullYear() + delta);
    this.viewingMonth = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
    this.dispatchEvent(
      new CustomEvent("ds:navigate", {
        bubbles: true,
        composed: true,
        detail: { viewingMonth: this.viewingMonth },
      })
    );
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has("locale")) {
      this.updateFormatters();
    }

    if (changedProperties.has("selectedDate") && this.selectedDate) {
      this.focusedDate = this.selectedDate;
    }
  }

  override render() {
    const viewDate = this.getViewingDate();
    const monthLabel = this.monthFormatter?.format(viewDate) ?? "";
    const weekdays = this.getWeekdayNames();
    const days = this.getMonthDays();

    return html`
      <div class="ds-date-picker-calendar" part="container">
        <!-- Header with navigation -->
        <div class="ds-date-picker-calendar-header" part="header">
          <button
            type="button"
            class="ds-date-picker-nav-button"
            part="prev-year"
            aria-label="Previous year"
            @click=${() => this.navigateYear(-1)}
          >
            <slot name="prev-year-icon">«</slot>
          </button>
          <button
            type="button"
            class="ds-date-picker-nav-button"
            part="prev-month"
            aria-label="Previous month"
            @click=${() => this.navigateMonth(-1)}
          >
            <slot name="prev-month-icon">‹</slot>
          </button>
          <span class="ds-date-picker-month-label" part="month-label">${monthLabel}</span>
          <button
            type="button"
            class="ds-date-picker-nav-button"
            part="next-month"
            aria-label="Next month"
            @click=${() => this.navigateMonth(1)}
          >
            <slot name="next-month-icon">›</slot>
          </button>
          <button
            type="button"
            class="ds-date-picker-nav-button"
            part="next-year"
            aria-label="Next year"
            @click=${() => this.navigateYear(1)}
          >
            <slot name="next-year-icon">»</slot>
          </button>
        </div>

        <!-- Calendar grid -->
        <table class="ds-date-picker-grid" part="grid" role="grid" aria-label="${monthLabel}">
          <thead>
            <tr class="ds-date-picker-weekdays" part="weekdays">
              ${weekdays.map(
                (day) => html`
                  <th scope="col" class="ds-date-picker-weekday" part="weekday" abbr="${day}">
                    ${day}
                  </th>
                `
              )}
            </tr>
          </thead>
          <tbody>
            ${this.renderWeeks(days)}
          </tbody>
        </table>
      </div>
    `;
  }

  private renderWeeks(days: Date[]) {
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks.map(
      (week) => html`
        <tr class="ds-date-picker-week" part="week">
          ${week.map((day) => this.renderDay(day))}
        </tr>
      `
    );
  }

  private renderDay(date: Date) {
    const isoDate = this.formatIso(date);
    const isDisabled = this.isDateDisabled(date);
    const isSelected = this.isDateSelected(date);
    const isInRange = this.isDateInRange(date);
    const isToday = this.isDateToday(date);
    const isCurrentMonth = this.isDateInCurrentMonth(date);
    const isFocused = isoDate === this.focusedDate;

    return html`
      <td
        class="ds-date-picker-day"
        part="day"
        role="gridcell"
        aria-selected="${isSelected}"
        aria-disabled="${isDisabled || nothing}"
        data-date="${isoDate}"
        data-selected="${isSelected || nothing}"
        data-in-range="${isInRange || nothing}"
        data-today="${isToday || nothing}"
        data-current-month="${isCurrentMonth || nothing}"
        data-focused="${isFocused || nothing}"
        tabindex="${isFocused ? 0 : -1}"
        @click=${() => this.handleDateClick(date)}
      >
        <span class="ds-date-picker-day-number" part="day-number">${date.getDate()}</span>
      </td>
    `;
  }
}

define("ds-date-picker-calendar", DsDatePickerCalendar);

declare global {
  interface HTMLElementTagNameMap {
    "ds-date-picker-calendar": DsDatePickerCalendar;
  }
}
