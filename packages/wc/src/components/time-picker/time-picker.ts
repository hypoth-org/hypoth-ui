/**
 * TimePicker component for time selection with segmented input.
 *
 * @element ds-time-picker
 * @fires ds:change - Fired on time change with { value }
 *
 * @example
 * ```html
 * <!-- Basic time picker (12h format) -->
 * <ds-time-picker hour-format="12"></ds-time-picker>
 *
 * <!-- 24h format with seconds -->
 * <ds-time-picker hour-format="24" show-seconds></ds-time-picker>
 *
 * <!-- With initial value -->
 * <ds-time-picker value="14:30"></ds-time-picker>
 * ```
 */

import {
  type TimePickerBehavior,
  type TimeSegment,
  type TimeValue,
  createTimePickerBehavior,
} from "@ds/primitives-dom";
import { html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsTimePicker extends DSElement {
  /** 12-hour or 24-hour format */
  @property({ type: Number, reflect: true, attribute: "hour-format" })
  hourFormat: 12 | 24 = 12;

  /** Show seconds segment */
  @property({ type: Boolean, reflect: true, attribute: "show-seconds" })
  showSeconds = false;

  /** Time value as HH:MM or HH:MM:SS string */
  @property({ type: String, reflect: true })
  value = "";

  /** Minute step */
  @property({ type: Number, attribute: "minute-step" })
  minuteStep = 1;

  /** Second step */
  @property({ type: Number, attribute: "second-step" })
  secondStep = 1;

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** ARIA label */
  @property({ type: String, attribute: "aria-label" })
  override ariaLabel: string | null = null;

  @state()
  private behavior: TimePickerBehavior | null = null;

  @state()
  private focusedSegment: TimeSegment | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.initBehavior();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.behavior?.destroy();
    this.behavior = null;
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (
      changedProperties.has("hourFormat") ||
      changedProperties.has("showSeconds") ||
      changedProperties.has("minuteStep") ||
      changedProperties.has("secondStep") ||
      changedProperties.has("disabled")
    ) {
      this.initBehavior();
    }
  }

  private initBehavior(): void {
    this.behavior?.destroy();

    // Parse initial value
    let defaultValue: TimeValue = { hour: 0, minute: 0, second: 0 };
    if (this.value) {
      const parsed = this.parseTimeString(this.value);
      if (parsed) defaultValue = parsed;
    }

    this.behavior = createTimePickerBehavior({
      defaultValue,
      hourFormat: this.hourFormat,
      showSeconds: this.showSeconds,
      minuteStep: this.minuteStep,
      secondStep: this.secondStep,
      disabled: this.disabled,
      onValueChange: (value) => {
        this.value = this.behavior?.formatTime(value) ?? "";
        emitEvent(this, StandardEvents.CHANGE, { detail: { value } });
      },
    });
  }

  private parseTimeString(str: string): TimeValue | null {
    const match = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(AM|PM))?$/i);
    if (!match) return null;

    const hourStr = match[1];
    const minuteStr = match[2];
    if (!hourStr || !minuteStr) return null;

    let hour = Number.parseInt(hourStr, 10);
    const minute = Number.parseInt(minuteStr, 10);
    const second = match[3] ? Number.parseInt(match[3], 10) : 0;
    const period = match[4]?.toUpperCase() as "AM" | "PM" | undefined;

    if (period) {
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
    }

    return { hour, minute, second };
  }

  private handleSegmentFocus(segment: TimeSegment): void {
    this.focusedSegment = segment;
    this.behavior?.focusSegment(segment);
  }

  private handleSegmentBlur(): void {
    this.focusedSegment = null;
    this.behavior?.blur();
  }

  private handleSegmentKeyDown(segment: TimeSegment, event: KeyboardEvent): void {
    this.behavior?.handleSegmentKeyDown(segment, event);
    this.requestUpdate();
  }

  private renderSegment(segment: TimeSegment, _label: string) {
    if (!this.behavior) return nothing;

    const props = this.behavior.getSegmentProps(segment);
    const displayValue = this.behavior.getSegmentDisplayValue(segment);
    const isFocused = this.focusedSegment === segment;

    return html`
      <span
        class="ds-time-picker__segment"
        role=${props.role}
        tabindex=${props.tabIndex}
        aria-valuemin=${props["aria-valuemin"]}
        aria-valuemax=${props["aria-valuemax"]}
        aria-valuenow=${props["aria-valuenow"]}
        aria-valuetext=${props["aria-valuetext"]}
        aria-label=${props["aria-label"]}
        aria-disabled=${props["aria-disabled"] ?? nothing}
        data-segment=${segment}
        data-focused=${isFocused || nothing}
        @focus=${() => this.handleSegmentFocus(segment)}
        @blur=${this.handleSegmentBlur}
        @keydown=${(e: KeyboardEvent) => this.handleSegmentKeyDown(segment, e)}
      >
        ${displayValue}
      </span>
    `;
  }

  override render() {
    if (!this.behavior) return nothing;

    return html`
      <div
        class="ds-time-picker"
        role="group"
        aria-label=${this.ariaLabel || "Time picker"}
        data-disabled=${this.disabled || nothing}
      >
        ${this.renderSegment("hour", "Hour")}
        <span class="ds-time-picker__separator" aria-hidden="true">:</span>
        ${this.renderSegment("minute", "Minute")}
        ${
          this.showSeconds
            ? html`
              <span class="ds-time-picker__separator" aria-hidden="true">:</span>
              ${this.renderSegment("second", "Second")}
            `
            : nothing
        }
        ${
          this.hourFormat === 12
            ? html`
              <span class="ds-time-picker__separator" aria-hidden="true">&nbsp;</span>
              ${this.renderSegment("period", "AM/PM")}
            `
            : nothing
        }
      </div>
    `;
  }
}

define("ds-time-picker", DsTimePicker);

declare global {
  interface HTMLElementTagNameMap {
    "ds-time-picker": DsTimePicker;
  }
}
