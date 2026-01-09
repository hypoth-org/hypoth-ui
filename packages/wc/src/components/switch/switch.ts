import { html } from "lit";
import type { PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { DSElement } from "../../base/ds-element.js";
import { FormAssociatedMixin } from "../../base/form-associated.js";
import type { ValidationFlags } from "../../base/form-associated.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

/**
 * Toggle switch for boolean settings with role="switch" semantics and native form participation.
 *
 * Uses ElementInternals for form association - values are submitted with the form
 * and the switch participates in constraint validation.
 *
 * @element ds-switch
 * @fires ds:change - Fired on state change with { checked }
 * @fires ds:invalid - Fired when customValidation is true and validation fails
 *
 * @slot - Switch label
 *
 * @example
 * ```html
 * <form>
 *   <ds-switch name="notifications">Enable notifications</ds-switch>
 *   <button type="submit">Submit</button>
 * </form>
 *
 * <ds-field>
 *   <ds-label>Dark Mode</ds-label>
 *   <ds-switch name="darkMode" custom-validation>Enable dark mode</ds-switch>
 *   <ds-field-description>Switch between light and dark themes</ds-field-description>
 *   <ds-field-error></ds-field-error>
 * </ds-field>
 * ```
 */
export class DsSwitch extends FormAssociatedMixin(DSElement) {
  /** Checked (on) state */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /** ARIA describedby - IDs of elements that describe this switch */
  @state()
  private ariaDescribedBy?: string;

  /** Label text captured from slot */
  @state()
  private labelText = "";

  /** Unique ID for label association */
  @state()
  private labelId = "";

  /** Default checked state for form reset */
  private _defaultChecked = false;

  private attributeObserver: MutationObserver | null = null;

  override connectedCallback(): void {
    // Capture label text before Lit renders
    this.labelText = this.textContent?.trim() ?? "";
    // Generate unique ID for label
    this.labelId = `switch-label-${crypto.randomUUID().slice(0, 8)}`;
    // Store default checked state
    this._defaultChecked = this.checked;

    super.connectedCallback();

    // Set default value for form association
    if (!this.value) {
      this.value = "on";
    }

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
   * Toggles the switch state.
   */
  private toggle(): void {
    if (this.disabled) return;

    this.checked = !this.checked;

    emitEvent(this, StandardEvents.CHANGE, {
      detail: {
        checked: this.checked,
      },
    });
  }

  private handleClick = (event: Event): void => {
    event.preventDefault();
    this.toggle();
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    // Both Space and Enter keys toggle the switch (distinct from checkbox)
    if ((event.key === " " || event.key === "Enter") && !this.disabled) {
      event.preventDefault();
      this.toggle();
    }
  };

  // Form association implementation

  protected getFormValue(): string | null {
    return this.checked ? this.value : null;
  }

  protected getValidationAnchor(): HTMLElement | undefined {
    return this.querySelector(".ds-switch__control") as HTMLElement | undefined;
  }

  protected getValidationFlags(): ValidationFlags {
    if (this.required && !this.checked) {
      return { valueMissing: true };
    }
    return {};
  }

  protected getValidationMessage(flags: ValidationFlags): string {
    if (flags.valueMissing) {
      return "Please turn this switch on to proceed";
    }
    return "";
  }

  protected shouldUpdateFormValue(changedProperties: PropertyValues): boolean {
    return changedProperties.has("checked");
  }

  protected shouldUpdateValidity(changedProperties: PropertyValues): boolean {
    return changedProperties.has("checked");
  }

  protected onFormReset(): void {
    this.checked = this._defaultChecked;
  }

  protected onFormStateRestore(
    state: string | File | FormData | null,
    _mode: "restore" | "autocomplete"
  ): void {
    if (typeof state === "string") {
      this.checked = state === this.value;
    }
  }

  override render() {
    return html`
      <div
        class="ds-switch"
        part="container"
        @click=${this.handleClick}
      >
        <div
          role="switch"
          part="control"
          class="ds-switch__control"
          tabindex=${this.disabled ? -1 : 0}
          aria-checked=${this.checked ? "true" : "false"}
          aria-disabled=${this.disabled ? "true" : "false"}
          aria-required=${this.required ? "true" : "false"}
          aria-labelledby=${this.labelId}
          aria-describedby=${ifDefined(this.ariaDescribedBy)}
          @keydown=${this.handleKeyDown}
        >
          <span class="ds-switch__track" part="track">
            <span class="ds-switch__thumb" part="thumb"></span>
          </span>
        </div>
        <span id=${this.labelId} class="ds-switch__label" part="label">
          ${this.labelText}
        </span>
      </div>
    `;
  }
}

define("ds-switch", DsSwitch);

declare global {
  interface HTMLElementTagNameMap {
    "ds-switch": DsSwitch;
  }
}
