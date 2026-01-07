/**
 * NumberInput component for numeric value input with increment/decrement controls.
 *
 * @element ds-number-input
 * @fires ds:change - Fired on value change with { value }
 *
 * @example
 * ```html
 * <!-- Basic number input -->
 * <ds-number-input min="0" max="100" value="50"></ds-number-input>
 *
 * <!-- With step and precision -->
 * <ds-number-input step="0.01" precision="2" value="9.99"></ds-number-input>
 *
 * <!-- Currency format -->
 * <ds-number-input format="currency" currency="USD" precision="2"></ds-number-input>
 * ```
 */

import { type NumberInputBehavior, createNumberInputBehavior } from "@ds/primitives-dom";
import { html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export type NumberInputFormat = "decimal" | "currency" | "percent";

export class DsNumberInput extends DSElement {
  /** Minimum allowed value */
  @property({ type: Number, reflect: true })
  min: number | undefined = undefined;

  /** Maximum allowed value */
  @property({ type: Number, reflect: true })
  max: number | undefined = undefined;

  /** Step increment */
  @property({ type: Number, reflect: true })
  step = 1;

  /** Current value */
  @property({ type: Number, reflect: true })
  value: number | undefined = undefined;

  /** Decimal precision */
  @property({ type: Number, reflect: true })
  precision = 0;

  /** Format type */
  @property({ type: String, reflect: true })
  format: NumberInputFormat = "decimal";

  /** Currency code (for currency format) */
  @property({ type: String, reflect: true })
  currency = "USD";

  /** Locale for formatting */
  @property({ type: String, reflect: true })
  locale = "en-US";

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Placeholder text */
  @property({ type: String })
  placeholder = "";

  /** Form field name */
  @property({ type: String, reflect: true })
  name = "";

  /** ARIA label */
  @property({ type: String, attribute: "aria-label" })
  override ariaLabel: string | null = null;

  /** Allow empty input */
  @property({ type: Boolean, attribute: "allow-empty" })
  allowEmpty = false;

  /** Show increment/decrement buttons */
  @property({ type: Boolean, attribute: "show-buttons" })
  showButtons = true;

  /** Prefix text (displayed before input) */
  @property({ type: String })
  prefix = "";

  /** Suffix text (displayed after input) */
  @property({ type: String })
  suffix = "";

  @state()
  private behavior: NumberInputBehavior | null = null;

  @state()
  private inputValue = "";

  @state()
  private isFocused = false;

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

    // Re-init behavior if key props change
    if (
      changedProperties.has("min") ||
      changedProperties.has("max") ||
      changedProperties.has("step") ||
      changedProperties.has("precision") ||
      changedProperties.has("format") ||
      changedProperties.has("currency") ||
      changedProperties.has("locale") ||
      changedProperties.has("allowEmpty") ||
      changedProperties.has("disabled")
    ) {
      this.initBehavior();
    }
  }

  private initBehavior(): void {
    this.behavior?.destroy();

    this.behavior = createNumberInputBehavior({
      min: this.min,
      max: this.max,
      step: this.step,
      precision: this.precision,
      defaultValue: this.value,
      format: this.format,
      currency: this.currency,
      locale: this.locale,
      allowEmpty: this.allowEmpty,
      disabled: this.disabled,
      onValueChange: (value) => {
        this.value = value;
        emitEvent(this, StandardEvents.CHANGE, { detail: { value } });
      },
    });

    this.inputValue = this.behavior.state.inputValue;
  }

  private handleInput(event: Event): void {
    if (!this.behavior) return;
    const input = event.target as HTMLInputElement;
    this.inputValue = input.value;
    this.behavior.handleInput(input.value);
  }

  private handleBlur(): void {
    if (!this.behavior) return;
    this.isFocused = false;
    this.behavior.commit();
    this.inputValue = this.behavior.state.inputValue;
  }

  private handleFocus(): void {
    this.isFocused = true;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.behavior) return;
    this.behavior.handleKeyDown(event);
    this.inputValue = this.behavior.state.inputValue;
  }

  private handleIncrement(): void {
    if (!this.behavior || this.disabled) return;
    this.behavior.increment();
    this.inputValue = this.behavior.state.inputValue;
  }

  private handleDecrement(): void {
    if (!this.behavior || this.disabled) return;
    this.behavior.decrement();
    this.inputValue = this.behavior.state.inputValue;
  }

  override render() {
    if (!this.behavior) return nothing;

    const inputProps = this.behavior.getInputProps();
    const isAtMin = this.min !== undefined && this.value !== undefined && this.value <= this.min;
    const isAtMax = this.max !== undefined && this.value !== undefined && this.value >= this.max;

    return html`
      <div
        class="ds-number-input"
        data-disabled=${this.disabled || nothing}
        data-focused=${this.isFocused || nothing}
        data-invalid=${!this.behavior.state.isValid || nothing}
      >
        ${
          this.showButtons
            ? html`
              <button
                type="button"
                class="ds-number-input__decrement"
                aria-label="Decrement"
                tabindex="-1"
                ?disabled=${this.disabled || isAtMin}
                @click=${this.handleDecrement}
              >
                <span aria-hidden="true">−</span>
              </button>
            `
            : nothing
        }

        ${
          this.prefix
            ? html`<span class="ds-number-input__prefix" aria-hidden="true">${this.prefix}</span>`
            : nothing
        }

        <input
          type=${inputProps.type}
          inputmode=${inputProps.inputMode}
          role=${inputProps.role}
          class="ds-number-input__field"
          .value=${this.inputValue}
          placeholder=${this.placeholder || nothing}
          name=${this.name || nothing}
          aria-label=${this.ariaLabel || nothing}
          aria-valuemin=${inputProps["aria-valuemin"] ?? nothing}
          aria-valuemax=${inputProps["aria-valuemax"] ?? nothing}
          aria-valuenow=${inputProps["aria-valuenow"] ?? nothing}
          aria-disabled=${inputProps["aria-disabled"] ?? nothing}
          aria-invalid=${inputProps["aria-invalid"] ?? nothing}
          ?disabled=${this.disabled}
          @input=${this.handleInput}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @keydown=${this.handleKeyDown}
        />

        ${
          this.suffix
            ? html`<span class="ds-number-input__suffix" aria-hidden="true">${this.suffix}</span>`
            : nothing
        }

        ${
          this.showButtons
            ? html`
              <button
                type="button"
                class="ds-number-input__increment"
                aria-label="Increment"
                tabindex="-1"
                ?disabled=${this.disabled || isAtMax}
                @click=${this.handleIncrement}
              >
                <span aria-hidden="true">+</span>
              </button>
            `
            : nothing
        }
      </div>
    `;
  }
}

define("ds-number-input", DsNumberInput);

declare global {
  interface HTMLElementTagNameMap {
    "ds-number-input": DsNumberInput;
  }
}
