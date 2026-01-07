import {
  type AnchorPosition,
  type DismissableLayer,
  type Placement,
  type Presence,
  createAnchorPosition,
  createDismissableLayer,
  createPresence,
  prefersReducedMotion,
} from "@ds/primitives-dom";
import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

// Import child components
import type { DsDatePickerCalendar } from "./date-picker-calendar.js";
import "./date-picker-calendar.js";
import {
  type DateParseResult,
  formatTypedDate,
  getDateFormatPlaceholder,
  parseTypedDate,
  validateTypedDate,
} from "./date-utils.js";

export type DatePickerMode = "single" | "range";

/**
 * DatePicker component with calendar dropdown.
 *
 * Implements WAI-ARIA DatePicker pattern with:
 * - Arrow key navigation within calendar grid
 * - Page Up/Down for month navigation
 * - Enter/Space to select date
 * - Escape to close
 *
 * @element ds-date-picker
 *
 * @slot trigger - Trigger element (button or input)
 * @slot - Calendar content (ds-date-picker-calendar)
 *
 * @fires ds:open - Fired when calendar opens
 * @fires ds:close - Fired when calendar closes
 * @fires ds:change - Fired when date changes (detail: { date } or { start, end })
 *
 * @example
 * ```html
 * <ds-date-picker value="2026-01-15">
 *   <button slot="trigger">Select date</button>
 *   <ds-date-picker-calendar></ds-date-picker-calendar>
 * </ds-date-picker>
 * ```
 */
export class DsDatePicker extends DSElement {
  /** Whether the calendar is open */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Selection mode: single date or date range */
  @property({ type: String, reflect: true })
  mode: DatePickerMode = "single";

  /** Selected date in ISO format (YYYY-MM-DD) */
  @property({ type: String, reflect: true })
  value = "";

  /** Range start date in ISO format */
  @property({ type: String, attribute: "range-start" })
  rangeStart = "";

  /** Range end date in ISO format */
  @property({ type: String, attribute: "range-end" })
  rangeEnd = "";

  /** Minimum selectable date in ISO format */
  @property({ type: String, attribute: "min-date" })
  minDate = "";

  /** Maximum selectable date in ISO format */
  @property({ type: String, attribute: "max-date" })
  maxDate = "";

  /** Locale for date formatting */
  @property({ type: String })
  locale = "en-US";

  /** First day of week (0=Sunday, 1=Monday) */
  @property({ type: Number, attribute: "first-day-of-week" })
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;

  /** Placement relative to trigger */
  @property({ type: String, reflect: true })
  placement: Placement = "bottom-start";

  /** Offset distance from trigger in pixels */
  @property({ type: Number })
  offset = 4;

  /** Whether to flip placement when near viewport edge */
  @property({ type: Boolean })
  flip = true;

  /** Whether to animate open/close transitions */
  @property({ type: Boolean })
  animated = true;

  /** Whether the date picker is disabled */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Whether the date picker is read-only */
  @property({ type: Boolean, reflect: true })
  readonly = false;

  /** Whether to allow typed date input (when using input trigger) */
  @property({ type: Boolean, attribute: "typed-input" })
  typedInput = false;

  /** Current text value of the input (for typed input mode) */
  @state()
  inputValue = "";

  /** Current validation error message */
  @state()
  inputError: string | null = null;

  private anchorPosition: AnchorPosition | null = null;
  private dismissLayer: DismissableLayer | null = null;
  private presence: Presence | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private scrollHandler: (() => void) | null = null;
  private isSelectingRange = false;

  override connectedCallback(): void {
    super.connectedCallback();

    // Listen for trigger interactions
    this.addEventListener("click", this.handleTriggerClick);
    this.addEventListener("keydown", this.handleTriggerKeyDown);

    // Listen for date selection from calendar
    this.addEventListener("ds:date-select", this.handleDateSelect);

    // Listen for input events (typed input mode)
    this.addEventListener("input", this.handleTypedInput);
    this.addEventListener("blur", this.handleInputBlur, true);

    // Initialize input value from date value
    if (this.value) {
      this.inputValue = formatTypedDate(this.value, this.locale);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleTriggerClick);
    this.removeEventListener("keydown", this.handleTriggerKeyDown);
    this.removeEventListener("ds:date-select", this.handleDateSelect);
    this.removeEventListener("input", this.handleTypedInput);
    this.removeEventListener("blur", this.handleInputBlur, true);
    this.cleanup();
  }

  /**
   * Opens the calendar.
   */
  public show(): void {
    if (this.open || this.disabled) return;
    this.open = true;
    emitEvent(this, StandardEvents.OPEN);
  }

  /**
   * Closes the calendar.
   */
  public close(): void {
    if (!this.open) return;

    const calendar = this.querySelector("ds-date-picker-calendar") as DsDatePickerCalendar | null;

    if (this.animated && calendar && !prefersReducedMotion()) {
      this.dismissLayer?.deactivate();
      this.dismissLayer = null;

      this.presence = createPresence({
        onExitComplete: () => {
          this.completeClose();
        },
      });
      this.presence.hide(calendar);
    } else {
      this.cleanup();
      this.open = false;
      emitEvent(this, StandardEvents.CLOSE);
      this.getTriggerElement()?.focus();
    }
  }

  private completeClose(): void {
    this.cleanup();
    this.open = false;
    emitEvent(this, StandardEvents.CLOSE);
    this.getTriggerElement()?.focus();
  }

  /**
   * Toggles the calendar.
   */
  public toggle(): void {
    if (this.open) {
      this.close();
    } else {
      this.show();
    }
  }

  /**
   * Sets the selected date programmatically.
   */
  public setDate(date: string): void {
    if (this.disabled || this.readonly) return;
    this.value = date;
    emitEvent(this, StandardEvents.CHANGE, { detail: { date } });
  }

  /**
   * Sets the date range programmatically.
   */
  public setRange(start: string, end: string): void {
    if (this.disabled || this.readonly || this.mode !== "range") return;
    this.rangeStart = start;
    this.rangeEnd = end;
    emitEvent(this, StandardEvents.CHANGE, { detail: { start, end } });
  }

  /**
   * Clears the selected date(s).
   */
  public clear(): void {
    if (this.disabled || this.readonly) return;
    this.value = "";
    this.rangeStart = "";
    this.rangeEnd = "";
    this.isSelectingRange = false;
    emitEvent(this, StandardEvents.CHANGE, {
      detail: this.mode === "range" ? { start: "", end: "" } : { date: "" },
    });
  }

  private getTriggerElement(): HTMLElement | null {
    const triggerSlot = this.querySelector('[slot="trigger"]');
    return triggerSlot as HTMLElement | null;
  }

  private handleTriggerClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"]');

    if (trigger && this.contains(trigger)) {
      event.preventDefault();
      if (!this.disabled) {
        this.toggle();
      }
    }
  };

  private handleTriggerKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"]');

    if (!trigger || !this.contains(trigger)) return;
    if (this.disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        this.toggle();
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!this.open) this.show();
        break;
    }
  };

  private handleDateSelect = (event: Event): void => {
    const customEvent = event as CustomEvent<{ date: string }>;
    const selectedDate = customEvent.detail.date;

    if (this.mode === "single") {
      this.value = selectedDate;
      emitEvent(this, StandardEvents.CHANGE, { detail: { date: selectedDate } });
      this.close();
    } else {
      // Range mode
      if (!this.isSelectingRange || !this.rangeStart) {
        // Start new range
        this.rangeStart = selectedDate;
        this.rangeEnd = "";
        this.isSelectingRange = true;
      } else {
        // Complete range
        if (selectedDate < this.rangeStart) {
          this.rangeEnd = this.rangeStart;
          this.rangeStart = selectedDate;
        } else {
          this.rangeEnd = selectedDate;
        }
        this.isSelectingRange = false;
        emitEvent(this, StandardEvents.CHANGE, {
          detail: { start: this.rangeStart, end: this.rangeEnd },
        });
        this.close();
      }
    }
  };

  private handleDismiss = (): void => {
    this.close();
  };

  /**
   * Handles typed input events.
   */
  private handleTypedInput = (event: Event): void => {
    if (!this.typedInput) return;

    const target = event.target as HTMLInputElement;
    if (target.tagName !== "INPUT") return;
    if (!this.contains(target)) return;

    this.inputValue = target.value;
    this.inputError = null;

    // Parse on each keystroke for real-time feedback
    const result = parseTypedDate(target.value, this.locale);
    if (result.valid && result.date) {
      // Validate against min/max
      const validation = validateTypedDate(result.date, this.minDate, this.maxDate, this.locale);
      if (validation.valid) {
        this.inputError = null;
      } else {
        this.inputError = validation.error;
      }
    }
  };

  /**
   * Handles input blur to finalize typed input.
   */
  private handleInputBlur = (event: Event): void => {
    if (!this.typedInput) return;

    const target = event.target as HTMLInputElement;
    if (target.tagName !== "INPUT") return;
    if (!this.contains(target)) return;

    this.commitTypedInput();
  };

  /**
   * Commits the typed input value as the selected date.
   */
  private commitTypedInput(): void {
    if (!this.inputValue) {
      // Clear the date if input is empty
      if (this.value) {
        this.value = "";
        this.inputError = null;
        emitEvent(this, StandardEvents.CHANGE, { detail: { date: "" } });
      }
      return;
    }

    const result = parseTypedDate(this.inputValue, this.locale);
    if (!result.valid || !result.date) {
      this.inputError = result.error;
      return;
    }

    // Validate against min/max
    const validation = validateTypedDate(result.date, this.minDate, this.maxDate, this.locale);
    if (!validation.valid) {
      this.inputError = validation.error;
      return;
    }

    // Commit the value
    this.inputError = null;
    this.value = result.date;
    this.inputValue = formatTypedDate(result.date, this.locale);
    emitEvent(this, StandardEvents.CHANGE, { detail: { date: result.date } });
  }

  /**
   * Gets the expected input format placeholder.
   */
  public getFormatPlaceholder(): string {
    return getDateFormatPlaceholder(this.locale);
  }

  /**
   * Gets the current validation error.
   */
  public getValidationError(): string | null {
    return this.inputError;
  }

  /**
   * Parses a typed date string and returns the validation result.
   */
  public parseInput(input: string): DateParseResult {
    const result = parseTypedDate(input, this.locale);
    if (result.valid && result.date) {
      return validateTypedDate(result.date, this.minDate, this.maxDate, this.locale);
    }
    return result;
  }

  private setupPositioning(): void {
    const trigger = this.getTriggerElement();
    const calendar = this.querySelector("ds-date-picker-calendar") as HTMLElement | null;

    if (!trigger || !calendar) return;

    this.anchorPosition = createAnchorPosition({
      anchor: trigger,
      floating: calendar,
      placement: this.placement,
      offset: this.offset,
      flip: this.flip,
      onPositionChange: (pos) => {
        calendar.setAttribute("data-placement", pos.placement);
      },
    });

    this.resizeObserver = new ResizeObserver(() => {
      this.anchorPosition?.update();
    });
    this.resizeObserver.observe(trigger);
    this.resizeObserver.observe(calendar);

    this.scrollHandler = () => {
      this.anchorPosition?.update();
    };
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
    window.addEventListener("resize", this.scrollHandler, { passive: true });
  }

  private setupDismissLayer(): void {
    const calendar = this.querySelector("ds-date-picker-calendar") as HTMLElement | null;
    const trigger = this.getTriggerElement();

    if (!calendar) return;

    this.dismissLayer = createDismissableLayer({
      container: calendar,
      excludeElements: trigger ? [trigger] : [],
      onDismiss: this.handleDismiss,
      closeOnEscape: true,
      closeOnOutsideClick: true,
    });
    this.dismissLayer.activate();
  }

  private cleanup(): void {
    this.anchorPosition?.destroy();
    this.anchorPosition = null;

    this.dismissLayer?.deactivate();
    this.dismissLayer = null;

    this.presence?.destroy();
    this.presence = null;

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
      window.removeEventListener("resize", this.scrollHandler);
      this.scrollHandler = null;
    }
  }

  override async updated(changedProperties: Map<string, unknown>): Promise<void> {
    super.updated(changedProperties);

    if (changedProperties.has("open")) {
      const calendar = this.querySelector("ds-date-picker-calendar") as DsDatePickerCalendar | null;

      if (this.open) {
        // Update calendar props
        if (calendar) {
          calendar.removeAttribute("hidden");
          calendar.dataState = "open";
          calendar.range = this.mode === "range";
          calendar.locale = this.locale;
          calendar.firstDayOfWeek = this.firstDayOfWeek;
          calendar.minDate = this.minDate;
          calendar.maxDate = this.maxDate;
          calendar.selectedDate = this.value;
          calendar.rangeStart = this.rangeStart;
          calendar.rangeEnd = this.rangeEnd;

          // Set initial viewing month
          const initialDate =
            this.value || this.rangeStart || new Date().toISOString().split("T")[0];
          if (initialDate) {
            const date = new Date(initialDate);
            calendar.viewingMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          }
        }

        await this.updateComplete;

        this.setupPositioning();
        this.setupDismissLayer();

        // Focus the calendar
        calendar?.focus();
      } else {
        if (calendar) {
          calendar.dataState = "closed";
          calendar.setAttribute("hidden", "");
        }
      }
    }

    // Sync typed input value when value changes externally
    if (changedProperties.has("value") && this.typedInput) {
      // Only update inputValue if it wasn't set from typed input
      const expectedInput = formatTypedDate(this.value, this.locale);
      if (this.inputValue !== expectedInput) {
        this.inputValue = expectedInput;
        this.inputError = null;
      }
    }

    // Sync props to calendar when open
    if (this.open) {
      const calendar = this.querySelector("ds-date-picker-calendar") as DsDatePickerCalendar | null;
      if (calendar) {
        if (changedProperties.has("value")) {
          calendar.selectedDate = this.value;
        }
        if (changedProperties.has("rangeStart")) {
          calendar.rangeStart = this.rangeStart;
        }
        if (changedProperties.has("rangeEnd")) {
          calendar.rangeEnd = this.rangeEnd;
        }
        if (changedProperties.has("locale")) {
          calendar.locale = this.locale;
        }
        if (changedProperties.has("firstDayOfWeek")) {
          calendar.firstDayOfWeek = this.firstDayOfWeek;
        }
        if (changedProperties.has("minDate")) {
          calendar.minDate = this.minDate;
        }
        if (changedProperties.has("maxDate")) {
          calendar.maxDate = this.maxDate;
        }
      }
    }

    if (this.open && (changedProperties.has("placement") || changedProperties.has("offset"))) {
      this.cleanup();
      this.setupPositioning();
      this.setupDismissLayer();
    }
  }

  override render() {
    return html`
      <slot name="trigger"></slot>
      <slot></slot>
    `;
  }
}

define("ds-date-picker", DsDatePicker);

declare global {
  interface HTMLElementTagNameMap {
    "ds-date-picker": DsDatePicker;
  }
}
