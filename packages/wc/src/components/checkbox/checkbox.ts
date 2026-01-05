import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

/**
 * Checkbox input with tri-state support.
 *
 * @element ds-checkbox
 * @fires ds:change - Fired on state change with { checked, indeterminate }
 *
 * @slot - Checkbox label
 *
 * @example
 * ```html
 * <ds-checkbox>Accept terms and conditions</ds-checkbox>
 *
 * <ds-field>
 *   <ds-checkbox required>I agree to the terms</ds-checkbox>
 *   <ds-field-error>You must accept the terms</ds-field-error>
 * </ds-field>
 * ```
 */
export class DsCheckbox extends DSElement {
  /** Form field name */
  @property({ type: String, reflect: true })
  name = "";

  /** Value when checked */
  @property({ type: String })
  value = "on";

  /** Checked state */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /** Indeterminate (mixed) state */
  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Required state */
  @property({ type: Boolean, reflect: true })
  required = false;

  /** ARIA describedby - IDs of elements that describe this checkbox */
  @state()
  private ariaDescribedBy?: string;

  /** Label text captured from slot */
  @state()
  private labelText = "";

  /** Unique ID for label association */
  @state()
  private labelId = "";

  private attributeObserver: MutationObserver | null = null;

  override connectedCallback(): void {
    // Capture label text before Lit renders
    this.labelText = this.textContent?.trim() ?? "";
    // Generate unique ID for label
    this.labelId = `checkbox-label-${crypto.randomUUID().slice(0, 8)}`;

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
      attributeFilter: ["aria-describedby", "aria-invalid", "aria-required", "aria-disabled"],
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
   */
  private syncAriaAttributes(): void {
    this.ariaDescribedBy = this.getAttribute("aria-describedby") ?? undefined;

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

  /**
   * Returns the aria-checked value based on state.
   */
  private getAriaChecked(): "true" | "false" | "mixed" {
    if (this.indeterminate) return "mixed";
    return this.checked ? "true" : "false";
  }

  /**
   * Toggles the checkbox state.
   */
  private toggle(): void {
    if (this.disabled) return;

    // Clear indeterminate on any interaction
    this.indeterminate = false;
    this.checked = !this.checked;

    emitEvent(this, StandardEvents.CHANGE, {
      detail: {
        checked: this.checked,
        indeterminate: this.indeterminate,
      },
    });
  }

  private handleClick = (event: Event): void => {
    event.preventDefault();
    this.toggle();
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === " ") {
      event.preventDefault();
      this.toggle();
    }
  };

  override render() {
    return html`
      <div
        class="ds-checkbox"
        part="container"
        @click=${this.handleClick}
      >
        <div
          role="checkbox"
          part="control"
          class="ds-checkbox__control"
          tabindex=${this.disabled ? -1 : 0}
          aria-checked=${this.getAriaChecked()}
          aria-disabled=${this.disabled ? "true" : "false"}
          aria-required=${this.required ? "true" : "false"}
          aria-labelledby=${this.labelId}
          aria-describedby=${ifDefined(this.ariaDescribedBy)}
          @keydown=${this.handleKeyDown}
        >
          <span class="ds-checkbox__indicator" part="indicator">
            ${
              this.indeterminate
                ? html`<span class="ds-checkbox__indeterminate-icon">−</span>`
                : this.checked
                  ? html`<span class="ds-checkbox__check-icon">✓</span>`
                  : null
            }
          </span>
        </div>
        <span id=${this.labelId} class="ds-checkbox__label" part="label">
          ${this.labelText}
        </span>
      </div>
    `;
  }
}

define("ds-checkbox", DsCheckbox);

declare global {
  interface HTMLElementTagNameMap {
    "ds-checkbox": DsCheckbox;
  }
}
