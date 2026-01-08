import { type TemplateResult, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import { emitEvent } from "../../events/emit.js";

export type CalendarSize = "default" | "compact";

// Navigation icons
const chevronLeftIcon = html`
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" />
  </svg>
`;

const chevronRightIcon = html`
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M9 18l6-6-6-6" />
  </svg>
`;

/**
 * Calendar component for date selection.
 *
 * @element ds-calendar
 *
 * @fires ds-change - When a date is selected
 * @fires ds-month-change - When the displayed month changes
 *
 * @cssprop --ds-calendar-width - Calendar width
 * @cssprop --ds-calendar-cell-size - Day cell size
 */
export class DsCalendar extends DSElement {
  static override styles = [];

  /**
   * Selected date (ISO format: YYYY-MM-DD).
   */
  @property({ type: String })
  value = "";

  /**
   * Minimum selectable date (ISO format).
   */
  @property({ type: String })
  min = "";

  /**
   * Maximum selectable date (ISO format).
   */
  @property({ type: String })
  max = "";

  /**
   * Disabled dates (comma-separated ISO format).
   */
  @property({ type: String, attribute: "disabled-dates" })
  disabledDates = "";

  /**
   * Locale for month/day names.
   */
  @property({ type: String })
  locale = "en-US";

  /**
   * Size variant.
   */
  @property({ type: String, reflect: true })
  size: CalendarSize = "default";

  /**
   * First day of week (0 = Sunday, 1 = Monday).
   */
  @property({ type: Number, attribute: "first-day-of-week" })
  firstDayOfWeek = 0;

  @state()
  private viewDate: Date = new Date();

  private get selectedDate(): Date | null {
    return this.value ? new Date(this.value) : null;
  }

  private get minDate(): Date | null {
    return this.min ? new Date(this.min) : null;
  }

  private get maxDate(): Date | null {
    return this.max ? new Date(this.max) : null;
  }

  private get disabledDateSet(): Set<string> {
    if (!this.disabledDates) return new Set();
    return new Set(this.disabledDates.split(",").map((d) => d.trim()));
  }

  private get weekdayNames(): string[] {
    const formatter = new Intl.DateTimeFormat(this.locale, { weekday: "short" });
    const days: string[] = [];
    // Start from a known Sunday
    const baseDate = new Date(2024, 0, 7); // Jan 7, 2024 is a Sunday
    for (let i = 0; i < 7; i++) {
      const day = new Date(baseDate);
      day.setDate(baseDate.getDate() + ((i + this.firstDayOfWeek) % 7));
      days.push(formatter.format(day));
    }
    return days;
  }

  private get monthYearLabel(): string {
    const formatter = new Intl.DateTimeFormat(this.locale, {
      month: "long",
      year: "numeric",
    });
    return formatter.format(this.viewDate);
  }

  private get calendarDays(): Array<{ date: Date; isOutside: boolean }> {
    const days: Array<{ date: Date; isOutside: boolean }> = [];
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    // First day of the month
    const firstOfMonth = new Date(year, month, 1);
    // Day of week of first day (0-6)
    const startDayOfWeek = firstOfMonth.getDay();
    // How many days to show from previous month
    const daysFromPrevMonth = (startDayOfWeek - this.firstDayOfWeek + 7) % 7;

    // Add days from previous month
    for (let i = daysFromPrevMonth; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      days.push({ date, isOutside: true });
    }

    // Add days of current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isOutside: false });
    }

    // Add days from next month to complete grid (6 rows × 7 days = 42)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isOutside: true });
    }

    return days;
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  private isSelected(date: Date): boolean {
    if (!this.selectedDate) return false;
    return (
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  private isDisabled(date: Date): boolean {
    const dateStr = date.toISOString().split("T")[0] ?? "";

    // Check disabled dates
    if (dateStr && this.disabledDateSet.has(dateStr)) return true;

    // Check min/max bounds
    if (this.minDate && date < this.minDate) return true;
    if (this.maxDate && date > this.maxDate) return true;

    return false;
  }

  private formatDateISO(date: Date): string {
    return date.toISOString().split("T")[0] ?? "";
  }

  private handlePrevMonth(): void {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    this.viewDate = newDate;

    emitEvent(this, "month-change", {
      detail: {
        month: newDate.getMonth() + 1,
        year: newDate.getFullYear(),
      },
    });
  }

  private handleNextMonth(): void {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.viewDate = newDate;

    emitEvent(this, "month-change", {
      detail: {
        month: newDate.getMonth() + 1,
        year: newDate.getFullYear(),
      },
    });
  }

  private handleDateSelect(date: Date): void {
    if (this.isDisabled(date)) return;

    this.value = this.formatDateISO(date);

    emitEvent(this, "change", {
      detail: {
        value: this.value,
        date: date.toISOString(),
      },
    });
  }

  private handleKeyDown(event: KeyboardEvent, date: Date): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleDateSelect(date);
    }
  }

  override render(): TemplateResult {
    const classes = {
      "ds-calendar": true,
    };

    return html`
      <div
        class=${classMap(classes)}
        role="application"
        aria-label="Calendar"
        data-size=${this.size !== "default" ? this.size : nothing}
      >
        <div class="ds-calendar__header">
          <button
            type="button"
            class="ds-calendar__nav-button"
            aria-label="Previous month"
            @click=${this.handlePrevMonth}
          >
            ${chevronLeftIcon}
          </button>
          <span class="ds-calendar__title" aria-live="polite">
            ${this.monthYearLabel}
          </span>
          <button
            type="button"
            class="ds-calendar__nav-button"
            aria-label="Next month"
            @click=${this.handleNextMonth}
          >
            ${chevronRightIcon}
          </button>
        </div>

        <div class="ds-calendar__weekdays" role="row">
          ${this.weekdayNames.map(
            (day) => html`
              <div class="ds-calendar__weekday" role="columnheader">${day}</div>
            `
          )}
        </div>

        <div class="ds-calendar__grid" role="grid">
          ${this.calendarDays.map(({ date, isOutside }) => {
            const disabled = this.isDisabled(date);
            const selected = this.isSelected(date);
            const today = this.isToday(date);

            return html`
              <button
                type="button"
                class="ds-calendar__day"
                role="gridcell"
                tabindex=${selected ? 0 : -1}
                aria-selected=${selected ? "true" : "false"}
                aria-disabled=${disabled ? "true" : nothing}
                ?data-outside=${isOutside}
                ?data-selected=${selected}
                ?data-today=${today}
                ?data-disabled=${disabled}
                @click=${() => this.handleDateSelect(date)}
                @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, date)}
              >
                ${date.getDate()}
              </button>
            `;
          })}
        </div>
      </div>
    `;
  }
}

// Register the component
define("ds-calendar", DsCalendar);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-calendar": DsCalendar;
  }
}
