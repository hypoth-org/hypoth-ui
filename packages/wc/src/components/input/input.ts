import { html } from "lit";
import { property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.js";
import { define } from "../../registry/define.js";

export type InputType = "text" | "email" | "password" | "number" | "tel" | "url" | "search";
export type InputSize = "sm" | "md" | "lg";

/**
 * A text input field component.
 *
 * @element ds-input
 * @fires input - Fired when the input value changes
 * @fires change - Fired when the input value is committed
 */
export class DsInput extends LightElement {
  /** Input type */
  @property({ type: String, reflect: true })
  type: InputType = "text";

  /** Input size */
  @property({ type: String, reflect: true })
  size: InputSize = "md";

  /** Input name */
  @property({ type: String, reflect: true })
  name = "";

  /** Input value */
  @property({ type: String })
  value = "";

  /** Placeholder text */
  @property({ type: String })
  placeholder = "";

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Read-only state */
  @property({ type: Boolean, reflect: true })
  readonly = false;

  /** Required state */
  @property({ type: Boolean, reflect: true })
  required = false;

  /** Error state */
  @property({ type: Boolean, reflect: true })
  error = false;

  /** Minimum length */
  @property({ type: Number })
  minlength?: number;

  /** Maximum length */
  @property({ type: Number })
  maxlength?: number;

  /** Pattern for validation */
  @property({ type: String })
  pattern?: string;

  private handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    return html`
      <div class="ds-input" part="container" data-size=${this.size}>
        <input
          part="input"
          class="ds-input__field"
          type=${this.type}
          name=${this.name}
          .value=${this.value}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          ?aria-invalid=${this.error}
          minlength=${this.minlength ?? ""}
          maxlength=${this.maxlength ?? ""}
          pattern=${this.pattern ?? ""}
          @input=${this.handleInput}
          @change=${this.handleChange}
        />
      </div>
    `;
  }
}

define("ds-input", DsInput);

declare global {
  interface HTMLElementTagNameMap {
    "ds-input": DsInput;
  }
}
