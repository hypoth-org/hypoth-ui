import { type RovingFocus, createRovingFocus } from "@ds/primitives-dom";
import { html } from "lit";
import type { PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { FormAssociatedMixin } from "../../base/form-associated.js";
import type { ValidationFlags } from "../../base/form-associated.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";
import type { DsRadio } from "./radio.js";

// Import radio component
import "./radio.js";

export type RadioOrientation = "horizontal" | "vertical";

/**
 * Container for radio button group with roving tabindex and native form participation.
 *
 * Uses ElementInternals for form association - the selected value is submitted with the form
 * and the group participates in constraint validation.
 *
 * @element ds-radio-group
 * @fires ds:change - Fired when selection changes with { value }
 * @fires ds:invalid - Fired when customValidation is true and validation fails
 *
 * @slot - ds-radio children
 *
 * @example
 * ```html
 * <form>
 *   <ds-field>
 *     <ds-label>Size</ds-label>
 *     <ds-radio-group name="size" required>
 *       <ds-radio value="sm">Small</ds-radio>
 *       <ds-radio value="md">Medium</ds-radio>
 *       <ds-radio value="lg">Large</ds-radio>
 *     </ds-radio-group>
 *     <ds-field-error></ds-field-error>
 *   </ds-field>
 *   <button type="submit">Submit</button>
 * </form>
 * ```
 */
export class DsRadioGroup extends FormAssociatedMixin(DSElement) {
  /** Layout and navigation axis */
  @property({ type: String, reflect: true })
  orientation: RadioOrientation = "vertical";

  /** Default value for form reset */
  private _defaultValue = "";

  private rovingFocus: RovingFocus | null = null;
  private childObserver: MutationObserver | null = null;

  override connectedCallback(): void {
    // Store default value for form reset
    this._defaultValue = this.value;

    super.connectedCallback();

    // Set role on the group
    this.setAttribute("role", "radiogroup");

    // Observe child changes
    this.childObserver = new MutationObserver(() => {
      this.setupRadios();
    });
    this.childObserver.observe(this, { childList: true, subtree: true });

    // Listen for radio selection events
    this.addEventListener("ds:radio-select", this.handleRadioSelect as EventListener);

    // Setup after first render
    this.updateComplete.then(() => {
      this.setupRadios();
      this.setupRovingFocus();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.childObserver?.disconnect();
    this.childObserver = null;
    this.rovingFocus?.destroy();
    this.rovingFocus = null;
    this.removeEventListener("ds:radio-select", this.handleRadioSelect as EventListener);
  }

  /**
   * Sets up the radio items with correct checked state and disabled state.
   */
  private setupRadios(): void {
    const radios = this.getRadioItems();

    radios.forEach((radio) => {
      // Set checked state based on group value
      radio.setChecked(radio.value === this.value);

      // Propagate disabled state from group
      if (this.disabled) {
        radio.disabled = true;
      }
    });

    // Update roving focus tabindex
    this.updateTabIndices();
  }

  /**
   * Updates tabindex values for roving focus.
   */
  private updateTabIndices(): void {
    const radios = this.getRadioItems();
    const selectedIndex = radios.findIndex((r) => r.value === this.value);
    const focusIndex = selectedIndex >= 0 ? selectedIndex : 0;

    radios.forEach((radio, index) => {
      radio.setTabIndex(index === focusIndex ? 0 : -1);
    });
  }

  /**
   * Sets up roving focus for keyboard navigation.
   */
  private setupRovingFocus(): void {
    this.rovingFocus?.destroy();

    const direction = this.orientation === "horizontal" ? "horizontal" : "vertical";

    this.rovingFocus = createRovingFocus({
      container: this,
      selector: "[role='radio']",
      direction,
      loop: true,
      skipDisabled: true,
      onFocus: (element, _index) => {
        // Find the parent ds-radio and select it (selection follows focus)
        const radio = element.closest("ds-radio") as DsRadio | null;
        if (radio && !radio.disabled && !this.disabled) {
          this.selectValue(radio.value);
        }
      },
    });
  }

  /**
   * Gets all radio items in the group.
   */
  private getRadioItems(): DsRadio[] {
    return Array.from(this.querySelectorAll("ds-radio")) as DsRadio[];
  }

  /**
   * Handles radio selection from click or keyboard.
   */
  private handleRadioSelect = (event: CustomEvent<{ value: string }>): void => {
    if (this.disabled) return;

    const { value } = event.detail;
    this.selectValue(value);
  };

  /**
   * Selects a value and updates state.
   */
  private selectValue(value: string): void {
    if (value === this.value) return;

    this.value = value;
    this.setupRadios();

    emitEvent(this, StandardEvents.CHANGE, {
      detail: { value: this.value },
    });
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has("value")) {
      this.setupRadios();
    }

    if (changedProperties.has("orientation")) {
      this.setupRovingFocus();
    }

    if (changedProperties.has("disabled")) {
      this.setupRadios();
    }
  }

  // Form association implementation

  protected getFormValue(): string | null {
    return this.value || null;
  }

  protected getValidationAnchor(): HTMLElement | undefined {
    // Use the first radio control as validation anchor
    return this.querySelector("ds-radio [role='radio']") as HTMLElement | undefined;
  }

  protected getValidationFlags(): ValidationFlags {
    if (this.required && !this.value) {
      return { valueMissing: true };
    }
    return {};
  }

  protected getValidationMessage(flags: ValidationFlags): string {
    if (flags.valueMissing) {
      return "Please select an option";
    }
    return "";
  }

  protected shouldUpdateFormValue(changedProperties: PropertyValues): boolean {
    return changedProperties.has("value");
  }

  protected shouldUpdateValidity(changedProperties: PropertyValues): boolean {
    return changedProperties.has("value");
  }

  protected onFormReset(): void {
    this.value = this._defaultValue;
    this.setupRadios();
  }

  protected onFormStateRestore(
    state: string | File | FormData | null,
    _mode: "restore" | "autocomplete"
  ): void {
    if (typeof state === "string") {
      this.value = state;
      this.setupRadios();
    }
  }

  override render() {
    return html`
      <div
        class="ds-radio-group"
        part="container"
        data-orientation=${this.orientation}
      >
        <slot></slot>
      </div>
    `;
  }
}

define("ds-radio-group", DsRadioGroup);

declare global {
  interface HTMLElementTagNameMap {
    "ds-radio-group": DsRadioGroup;
  }
}
