import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Combobox option with role="option".
 *
 * @element ds-combobox-option
 *
 * @slot - Option content (text, icon, etc.)
 *
 * @example
 * ```html
 * <ds-combobox-option value="apple">Apple</ds-combobox-option>
 * <ds-combobox-option value="banana" disabled>Banana</ds-combobox-option>
 * ```
 */
export class DsComboboxOption extends DSElement {
  /** Whether the option is disabled */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Value associated with this option */
  @property({ type: String, reflect: true })
  value = "";

  /** Display label (uses textContent if not specified) */
  @property({ type: String })
  label = "";

  override connectedCallback(): void {
    super.connectedCallback();

    // Set ARIA role
    this.setAttribute("role", "option");

    // Set tabIndex for roving focus (will be managed by parent)
    this.tabIndex = -1;

    // Generate ID if not set
    if (!this.id) {
      this.id = `combobox-option-${crypto.randomUUID().slice(0, 8)}`;
    }

    // Update aria-disabled
    this.updateAriaDisabled();
  }

  /**
   * Gets the display label for this option.
   */
  public getLabel(): string {
    return this.label || this.textContent?.trim() || this.value;
  }

  private updateAriaDisabled(): void {
    if (this.disabled) {
      this.setAttribute("aria-disabled", "true");
    } else {
      this.removeAttribute("aria-disabled");
    }
  }

  /**
   * Sets the selected state of this option.
   */
  public setSelected(selected: boolean): void {
    this.setAttribute("aria-selected", String(selected));
    if (selected) {
      this.setAttribute("data-selected", "");
    } else {
      this.removeAttribute("data-selected");
    }
  }

  /**
   * Sets the highlighted state of this option.
   */
  public setHighlighted(highlighted: boolean): void {
    if (highlighted) {
      this.setAttribute("data-highlighted", "");
    } else {
      this.removeAttribute("data-highlighted");
    }
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has("disabled")) {
      this.updateAriaDisabled();
    }
  }

  override render() {
    return html`
      <div class="ds-combobox-option" part="container">
        <slot></slot>
      </div>
    `;
  }
}

define("ds-combobox-option", DsComboboxOption);

declare global {
  interface HTMLElementTagNameMap {
    "ds-combobox-option": DsComboboxOption;
  }
}
