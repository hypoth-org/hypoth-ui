import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export type InputType = "text" | "email" | "password" | "number" | "tel" | "url" | "search";
export type InputSize = "sm" | "md" | "lg";

/**
 * A text input field component.
 *
 * @element ds-input
 * @fires input - Fired when the input value changes
 * @fires change - Fired when the input value is committed
 *
 * @example
 * ```html
 * <ds-field>
 *   <ds-label>Email</ds-label>
 *   <ds-input type="email" name="email"></ds-input>
 * </ds-field>
 * ```
 */
export class DsInput extends DSElement {
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

  /** ARIA labelledby - ID of element that labels this input */
  @state()
  private ariaLabelledBy?: string;

  /** ARIA describedby - IDs of elements that describe this input */
  @state()
  private ariaDescribedBy?: string;

  private attributeObserver: MutationObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // Observe ARIA attribute changes on the host element
    this.attributeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          this.syncAriaAttributes();
        }
      }
    });

    this.attributeObserver.observe(this, {
      attributes: true,
      attributeFilter: [
        "aria-labelledby",
        "aria-describedby",
        "aria-invalid",
        "aria-required",
        "aria-disabled",
      ],
    });

    // Initial sync
    this.syncAriaAttributes();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.attributeObserver?.disconnect();
    this.attributeObserver = null;
  }

  /**
   * Syncs ARIA attributes from the host element to internal state.
   * The render method will apply these to the native input.
   */
  private syncAriaAttributes(): void {
    this.ariaLabelledBy = this.getAttribute("aria-labelledby") ?? undefined;
    this.ariaDescribedBy = this.getAttribute("aria-describedby") ?? undefined;

    // Sync error state from aria-invalid
    const ariaInvalid = this.getAttribute("aria-invalid");
    if (ariaInvalid === "true") {
      this.error = true;
    } else if (ariaInvalid === "false") {
      this.error = false;
    }

    // Sync required state from aria-required
    const ariaRequired = this.getAttribute("aria-required");
    if (ariaRequired === "true") {
      this.required = true;
    }

    // Sync disabled state from aria-disabled
    const ariaDisabled = this.getAttribute("aria-disabled");
    if (ariaDisabled === "true") {
      this.disabled = true;
    }
  }

  private handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    // Also emit native input event for compatibility
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
    // Emit ds:change event using standard convention
    emitEvent(this, StandardEvents.CHANGE, {
      detail: { value: this.value },
    });
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
          aria-invalid=${this.error ? "true" : "false"}
          aria-labelledby=${ifDefined(this.ariaLabelledBy)}
          aria-describedby=${ifDefined(this.ariaDescribedBy)}
          aria-required=${this.required ? "true" : "false"}
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
