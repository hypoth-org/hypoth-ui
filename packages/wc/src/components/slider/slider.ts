/**
 * Slider component for numeric value selection via draggable thumb(s).
 *
 * @element ds-slider
 * @fires ds:change - Fired on value change with { value } or { min, max } for range mode
 *
 * @example
 * ```html
 * <!-- Single value slider -->
 * <ds-slider min="0" max="100" value="50"></ds-slider>
 *
 * <!-- Range slider -->
 * <ds-slider range min="0" max="1000" range-min="200" range-max="800"></ds-slider>
 *
 * <!-- Vertical slider -->
 * <ds-slider orientation="vertical" min="0" max="100"></ds-slider>
 * ```
 */

import { type SliderBehavior, type ThumbType, createSliderBehavior } from "@ds/primitives-dom";
import { html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsSlider extends DSElement {
  /** Minimum allowed value */
  @property({ type: Number, reflect: true })
  min = 0;

  /** Maximum allowed value */
  @property({ type: Number, reflect: true })
  max = 100;

  /** Step increment */
  @property({ type: Number, reflect: true })
  step = 1;

  /** Current value (single mode) */
  @property({ type: Number, reflect: true })
  value = 0;

  /** Range mode (two thumbs) */
  @property({ type: Boolean, reflect: true })
  range = false;

  /** Minimum value in range mode */
  @property({ type: Number, reflect: true, attribute: "range-min" })
  rangeMin = 0;

  /** Maximum value in range mode */
  @property({ type: Number, reflect: true, attribute: "range-max" })
  rangeMax = 100;

  /** Orientation */
  @property({ type: String, reflect: true })
  orientation: "horizontal" | "vertical" = "horizontal";

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Optional label */
  @property({ type: String })
  label = "";

  /** ARIA label */
  @property({ type: String, attribute: "aria-label" })
  override ariaLabel: string | null = null;

  /** Value text formatter for screen readers */
  @property({ attribute: false })
  formatValueText?: (value: number) => string;

  /** Show tick marks */
  @property({ type: Boolean, reflect: true, attribute: "show-ticks" })
  showTicks = false;

  /** Show value tooltip on focus/drag */
  @property({ type: Boolean, reflect: true, attribute: "show-tooltip" })
  showTooltip = false;

  /** Number of tick marks (defaults to (max-min)/step if step > 1) */
  @property({ type: Number, attribute: "tick-count" })
  tickCount?: number;

  @state()
  private behavior: SliderBehavior | null = null;

  @state()
  private focusedThumb: ThumbType | null = null;

  @state()
  private dragging = false;

  private trackRef: HTMLElement | null = null;
  private boundHandlePointerMove: ((e: PointerEvent) => void) | null = null;
  private boundHandlePointerUp: (() => void) | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.initBehavior();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.behavior?.destroy();
    this.behavior = null;
    this.removeGlobalListeners();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    // Re-init behavior if key props change
    if (
      changedProperties.has("min") ||
      changedProperties.has("max") ||
      changedProperties.has("step") ||
      changedProperties.has("range") ||
      changedProperties.has("orientation") ||
      changedProperties.has("disabled")
    ) {
      this.initBehavior();
    }
  }

  private initBehavior(): void {
    this.behavior?.destroy();

    this.behavior = createSliderBehavior({
      min: this.min,
      max: this.max,
      step: this.step,
      defaultValue: this.value,
      defaultRange: { min: this.rangeMin, max: this.rangeMax },
      range: this.range,
      orientation: this.orientation,
      disabled: this.disabled,
      onValueChange: (value) => {
        this.value = value;
        emitEvent(this, StandardEvents.CHANGE, { detail: { value } });
      },
      onRangeChange: (range) => {
        this.rangeMin = range.min;
        this.rangeMax = range.max;
        emitEvent(this, StandardEvents.CHANGE, { detail: range });
      },
    });

    // Set track reference after render
    this.updateComplete.then(() => {
      const track = this.querySelector<HTMLElement>(".ds-slider__track");
      if (track && this.behavior) {
        this.trackRef = track;
        this.behavior.trackElement = track;
      }
    });
  }

  private handleThumbPointerDown(thumb: ThumbType, event: PointerEvent): void {
    if (this.disabled || !this.behavior) return;

    event.preventDefault();
    (event.target as HTMLElement).setPointerCapture(event.pointerId);

    this.behavior.startDrag(thumb, event);
    this.dragging = true;
    this.addGlobalListeners();
  }

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.dragging || !this.behavior) return;
    this.behavior.drag(event);
    this.requestUpdate();
  };

  private handlePointerUp = (): void => {
    if (!this.behavior) return;
    this.behavior.endDrag();
    this.dragging = false;
    this.removeGlobalListeners();
    this.requestUpdate();
  };

  private handleTrackClick(event: PointerEvent): void {
    if (this.disabled || !this.behavior) return;

    // Determine which thumb to move (closest in range mode)
    const thumb = this.getClosestThumb(event);
    this.behavior.startDrag(thumb, event);
    this.behavior.endDrag();
    this.requestUpdate();
  }

  private getClosestThumb(event: PointerEvent): ThumbType {
    if (!this.range || !this.behavior) return "single";

    const { rangeValue, min, max, orientation } = this.behavior.state;
    const track = this.trackRef;
    if (!track) return "min";

    const rect = track.getBoundingClientRect();
    let percent: number;

    if (orientation === "horizontal") {
      percent = ((event.clientX - rect.left) / rect.width) * 100;
    } else {
      percent = 100 - ((event.clientY - rect.top) / rect.height) * 100;
    }

    const clickValue = (percent / 100) * (max - min) + min;
    const minDist = Math.abs(clickValue - rangeValue.min);
    const maxDist = Math.abs(clickValue - rangeValue.max);

    return minDist <= maxDist ? "min" : "max";
  }

  private handleThumbKeyDown(thumb: ThumbType, event: KeyboardEvent): void {
    if (this.disabled || !this.behavior) return;

    const isVertical = this.orientation === "vertical";

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();
        if (isVertical ? event.key === "ArrowUp" : event.key === "ArrowRight") {
          this.behavior.increment(thumb);
        } else {
          this.behavior.decrement(thumb);
        }
        break;
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();
        if (isVertical ? event.key === "ArrowDown" : event.key === "ArrowLeft") {
          this.behavior.decrement(thumb);
        } else {
          this.behavior.increment(thumb);
        }
        break;
      case "PageUp":
        event.preventDefault();
        this.behavior.increment(thumb, true);
        break;
      case "PageDown":
        event.preventDefault();
        this.behavior.decrement(thumb, true);
        break;
      case "Home":
        event.preventDefault();
        this.behavior.setToMin(thumb);
        break;
      case "End":
        event.preventDefault();
        this.behavior.setToMax(thumb);
        break;
    }

    this.requestUpdate();
  }

  private addGlobalListeners(): void {
    this.boundHandlePointerMove = this.handlePointerMove;
    this.boundHandlePointerUp = this.handlePointerUp;
    document.addEventListener("pointermove", this.boundHandlePointerMove);
    document.addEventListener("pointerup", this.boundHandlePointerUp);
  }

  private removeGlobalListeners(): void {
    if (this.boundHandlePointerMove) {
      document.removeEventListener("pointermove", this.boundHandlePointerMove);
    }
    if (this.boundHandlePointerUp) {
      document.removeEventListener("pointerup", this.boundHandlePointerUp);
    }
    this.boundHandlePointerMove = null;
    this.boundHandlePointerUp = null;
  }

  private getValueText(value: number): string {
    if (this.formatValueText) {
      return this.formatValueText(value);
    }
    return String(value);
  }

  private handleThumbFocus(thumb: ThumbType): void {
    this.focusedThumb = thumb;
  }

  private handleThumbBlur(): void {
    this.focusedThumb = null;
  }

  private getTickPositions(): number[] {
    const count = this.tickCount ?? Math.floor((this.max - this.min) / this.step) + 1;
    // Limit to reasonable number of ticks
    const effectiveCount = Math.min(count, 21);
    const positions: number[] = [];

    for (let i = 0; i < effectiveCount; i++) {
      positions.push((i / (effectiveCount - 1)) * 100);
    }
    return positions;
  }

  private renderTicks() {
    if (!this.showTicks) return nothing;

    const positions = this.getTickPositions();
    const isVertical = this.orientation === "vertical";

    return html`
      <div class="ds-slider__ticks">
        ${positions.map(
          (pos) => html`
            <div
              class="ds-slider__tick"
              style=${isVertical ? `bottom: ${pos}%` : `left: ${pos}%`}
            ></div>
          `
        )}
      </div>
    `;
  }

  private renderTooltip(value: number, percent: number, isVisible: boolean) {
    if (!this.showTooltip) return nothing;

    const isVertical = this.orientation === "vertical";
    const style = isVertical ? `bottom: ${percent}%` : `left: ${percent}%`;

    return html`
      <div
        class="ds-slider__tooltip"
        style=${style}
        data-visible=${isVisible || nothing}
      >
        ${this.getValueText(value)}
      </div>
    `;
  }

  override render() {
    if (!this.behavior) return nothing;

    const { state } = this.behavior;
    const singlePercent = this.behavior.valueToPercent(state.value);
    const minPercent = this.behavior.valueToPercent(state.rangeValue.min);
    const maxPercent = this.behavior.valueToPercent(state.rangeValue.max);

    const isVertical = this.orientation === "vertical";
    const thumbStyle = (percent: number) =>
      isVertical ? `bottom: ${percent}%` : `left: ${percent}%`;

    const rangeStyle = this.range
      ? isVertical
        ? `bottom: ${minPercent}%; height: ${maxPercent - minPercent}%`
        : `left: ${minPercent}%; width: ${maxPercent - minPercent}%`
      : isVertical
        ? `height: ${singlePercent}%`
        : `width: ${singlePercent}%`;

    return html`
      <div
        class="ds-slider"
        data-orientation=${this.orientation}
        data-disabled=${this.disabled || nothing}
        data-dragging=${this.dragging || nothing}
      >
        <div
          class="ds-slider__track"
          @pointerdown=${(e: PointerEvent) => this.handleTrackClick(e)}
        >
          <div class="ds-slider__range" style=${rangeStyle}></div>

          ${this.renderTicks()}

          ${
            this.range
              ? html`
                <!-- Min thumb -->
                <div
                  class="ds-slider__thumb"
                  role="slider"
                  tabindex=${this.disabled ? -1 : 0}
                  aria-label=${this.ariaLabel || this.label || "Minimum value"}
                  aria-valuemin=${this.min}
                  aria-valuemax=${state.rangeValue.max}
                  aria-valuenow=${state.rangeValue.min}
                  aria-valuetext=${this.getValueText(state.rangeValue.min)}
                  aria-orientation=${this.orientation}
                  aria-disabled=${this.disabled}
                  data-thumb="min"
                  style=${thumbStyle(minPercent)}
                  @pointerdown=${(e: PointerEvent) => this.handleThumbPointerDown("min", e)}
                  @keydown=${(e: KeyboardEvent) => this.handleThumbKeyDown("min", e)}
                  @focus=${() => this.handleThumbFocus("min")}
                  @blur=${() => this.handleThumbBlur()}
                >
                  ${this.renderTooltip(state.rangeValue.min, minPercent, this.focusedThumb === "min" || this.dragging)}
                </div>

                <!-- Max thumb -->
                <div
                  class="ds-slider__thumb"
                  role="slider"
                  tabindex=${this.disabled ? -1 : 0}
                  aria-label=${this.ariaLabel || this.label || "Maximum value"}
                  aria-valuemin=${state.rangeValue.min}
                  aria-valuemax=${this.max}
                  aria-valuenow=${state.rangeValue.max}
                  aria-valuetext=${this.getValueText(state.rangeValue.max)}
                  aria-orientation=${this.orientation}
                  aria-disabled=${this.disabled}
                  data-thumb="max"
                  style=${thumbStyle(maxPercent)}
                  @pointerdown=${(e: PointerEvent) => this.handleThumbPointerDown("max", e)}
                  @keydown=${(e: KeyboardEvent) => this.handleThumbKeyDown("max", e)}
                  @focus=${() => this.handleThumbFocus("max")}
                  @blur=${() => this.handleThumbBlur()}
                >
                  ${this.renderTooltip(state.rangeValue.max, maxPercent, this.focusedThumb === "max" || this.dragging)}
                </div>
              `
              : html`
                <!-- Single thumb -->
                <div
                  class="ds-slider__thumb"
                  role="slider"
                  tabindex=${this.disabled ? -1 : 0}
                  aria-label=${this.ariaLabel || this.label || "Value"}
                  aria-valuemin=${this.min}
                  aria-valuemax=${this.max}
                  aria-valuenow=${state.value}
                  aria-valuetext=${this.getValueText(state.value)}
                  aria-orientation=${this.orientation}
                  aria-disabled=${this.disabled}
                  data-thumb="single"
                  style=${thumbStyle(singlePercent)}
                  @pointerdown=${(e: PointerEvent) => this.handleThumbPointerDown("single", e)}
                  @keydown=${(e: KeyboardEvent) => this.handleThumbKeyDown("single", e)}
                  @focus=${() => this.handleThumbFocus("single")}
                  @blur=${() => this.handleThumbBlur()}
                >
                  ${this.renderTooltip(state.value, singlePercent, this.focusedThumb === "single" || this.dragging)}
                </div>
              `
          }
        </div>
      </div>
    `;
  }
}

define("ds-slider", DsSlider);

declare global {
  interface HTMLElementTagNameMap {
    "ds-slider": DsSlider;
  }
}
