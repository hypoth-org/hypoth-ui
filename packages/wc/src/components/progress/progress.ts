import { type TemplateResult, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type ProgressVariant = "linear" | "circular";
export type ProgressSize = "sm" | "md" | "lg";

/**
 * Progress indicator component.
 *
 * @element ds-progress
 *
 * @csspart track - The progress track
 * @csspart bar - The progress bar/fill
 * @csspart label - The accessible label
 *
 * @cssprop --ds-progress-track - Track background color
 * @cssprop --ds-progress-fill - Fill/indicator color
 * @cssprop --ds-progress-height - Track height (linear)
 */
export class DsProgress extends DSElement {
  static override styles = [];

  /**
   * Current progress value (0-100). Omit for indeterminate.
   */
  @property({ type: Number })
  value?: number;

  /**
   * Maximum value.
   */
  @property({ type: Number })
  max = 100;

  /**
   * Visual variant.
   */
  @property({ type: String, reflect: true })
  variant: ProgressVariant = "linear";

  /**
   * Size variant.
   */
  @property({ type: String, reflect: true })
  size: ProgressSize = "md";

  /**
   * Accessible label.
   */
  @property({ type: String })
  label = "";

  /**
   * Show value as percentage text (circular only).
   */
  @property({ type: Boolean, attribute: "show-value" })
  showValue = false;

  private get isIndeterminate(): boolean {
    return this.value === undefined || this.value === null;
  }

  private get percentage(): number {
    if (this.isIndeterminate) return 0;
    return Math.min(100, Math.max(0, ((this.value ?? 0) / this.max) * 100));
  }

  private get valueText(): string {
    if (this.isIndeterminate) {
      return this.label || "Loading...";
    }
    return `${Math.round(this.percentage)}% complete`;
  }

  private renderLinear(): TemplateResult {
    const classes = {
      "ds-progress": true,
    };

    return html`
      <div
        part="track"
        class=${classMap(classes)}
        role="progressbar"
        aria-valuenow=${this.isIndeterminate ? nothing : this.value}
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuetext=${this.valueText}
        aria-label=${this.label || nothing}
        ?aria-busy=${this.isIndeterminate}
        data-size=${this.size}
        ?data-indeterminate=${this.isIndeterminate}
      >
        <div
          part="bar"
          class="ds-progress__bar"
          style=${this.isIndeterminate ? "" : `width: ${this.percentage}%`}
        ></div>
        ${this.label
          ? html`<span part="label" class="ds-progress__label">${this.label}</span>`
          : nothing}
      </div>
    `;
  }

  private renderCircular(): TemplateResult {
    // SVG circle calculations
    const size = this.size === "sm" ? 24 : this.size === "lg" ? 64 : 40;
    const strokeWidth = this.size === "sm" ? 3 : this.size === "lg" ? 6 : 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (this.percentage / 100) * circumference;

    const classes = {
      "ds-progress-circular": true,
    };

    return html`
      <div
        class=${classMap(classes)}
        role="progressbar"
        aria-valuenow=${this.isIndeterminate ? nothing : this.value}
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuetext=${this.valueText}
        aria-label=${this.label || nothing}
        ?aria-busy=${this.isIndeterminate}
        data-size=${this.size}
        ?data-indeterminate=${this.isIndeterminate}
      >
        <svg class="ds-progress-circular__svg" viewBox="0 0 ${size} ${size}">
          <circle
            class="ds-progress-circular__track"
            cx=${size / 2}
            cy=${size / 2}
            r=${radius}
          />
          <circle
            class="ds-progress-circular__fill"
            cx=${size / 2}
            cy=${size / 2}
            r=${radius}
            stroke-dasharray=${circumference}
            stroke-dashoffset=${this.isIndeterminate ? 0 : offset}
          />
        </svg>
        ${this.showValue && !this.isIndeterminate
          ? html`<span class="ds-progress-circular__label">${Math.round(this.percentage)}%</span>`
          : nothing}
      </div>
    `;
  }

  override render(): TemplateResult {
    return this.variant === "circular"
      ? this.renderCircular()
      : this.renderLinear();
  }
}

// Register the component
define("ds-progress", DsProgress);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-progress": DsProgress;
  }
}
