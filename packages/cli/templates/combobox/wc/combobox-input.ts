import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Combobox input wrapper with combobox role.
 *
 * @element ds-combobox-input
 *
 * @slot - Input element
 *
 * @example
 * ```html
 * <ds-combobox>
 *   <ds-combobox-input>
 *     <input placeholder="Search..." />
 *   </ds-combobox-input>
 *   <ds-combobox-content>...</ds-combobox-content>
 * </ds-combobox>
 * ```
 */
export class DsComboboxInput extends DSElement {
  /** Whether the parent combobox is disabled */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();

    // Setup ARIA on first slotted element after render
    this.updateComplete.then(() => {
      this.setupInputAccessibility();
    });
  }

  private setupInputAccessibility(): void {
    const input = this.querySelector("input") as HTMLInputElement | null;
    if (input) {
      input.setAttribute("role", "combobox");
      input.setAttribute("aria-autocomplete", "list");
      input.setAttribute("aria-expanded", "false");
      if (this.disabled) {
        input.setAttribute("aria-disabled", "true");
        input.setAttribute("disabled", "");
      }
    }
  }

  /**
   * Updates ARIA attributes on the input element.
   */
  public updateAria(expanded: boolean, activeDescendantId?: string, controlsId?: string): void {
    const input = this.querySelector("input") as HTMLInputElement | null;
    if (input) {
      input.setAttribute("aria-expanded", String(expanded));
      if (controlsId) {
        input.setAttribute("aria-controls", controlsId);
      }
      if (expanded && activeDescendantId) {
        input.setAttribute("aria-activedescendant", activeDescendantId);
      } else {
        input.removeAttribute("aria-activedescendant");
      }
    }
  }

  /**
   * Sets the loading state on the input.
   */
  public setLoading(loading: boolean): void {
    const input = this.querySelector("input") as HTMLInputElement | null;
    if (input) {
      if (loading) {
        input.setAttribute("aria-busy", "true");
      } else {
        input.removeAttribute("aria-busy");
      }
    }
  }

  /**
   * Gets the actual input element.
   */
  public getInputElement(): HTMLInputElement | null {
    return this.querySelector("input");
  }

  /**
   * Gets the current input value.
   */
  public getValue(): string {
    return this.getInputElement()?.value ?? "";
  }

  /**
   * Sets the input value.
   */
  public setValue(value: string): void {
    const input = this.getInputElement();
    if (input) {
      input.value = value;
    }
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has("disabled")) {
      const input = this.querySelector("input") as HTMLInputElement | null;
      if (input) {
        if (this.disabled) {
          input.setAttribute("aria-disabled", "true");
          input.setAttribute("disabled", "");
        } else {
          input.removeAttribute("aria-disabled");
          input.removeAttribute("disabled");
        }
      }
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-combobox-input", DsComboboxInput);

declare global {
  interface HTMLElementTagNameMap {
    "ds-combobox-input": DsComboboxInput;
  }
}
