import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type ComboboxContentState = "open" | "closed";

/**
 * Combobox content container with role="listbox".
 *
 * @element ds-combobox-content
 *
 * @slot - Combobox options (ds-combobox-option elements)
 *
 * @attr {string} data-state - Animation state ("open" or "closed")
 * @attr {string} data-placement - Current anchor position placement
 *
 * @example
 * ```html
 * <ds-combobox>
 *   <input slot="input" placeholder="Search fruits..." />
 *   <ds-combobox-content>
 *     <ds-combobox-option value="apple">Apple</ds-combobox-option>
 *     <ds-combobox-option value="banana">Banana</ds-combobox-option>
 *   </ds-combobox-content>
 * </ds-combobox>
 * ```
 */
export class DsComboboxContent extends DSElement {
  /** Unique ID for ARIA association */
  @property({ type: String, reflect: true })
  override id = "";

  /** Animation state (open or closed) - set by parent ds-combobox */
  @property({ type: String, reflect: true, attribute: "data-state" })
  dataState: ComboboxContentState = "closed";

  /** Optional label for the listbox */
  @property({ type: String })
  label = "";

  /** Whether to show loading indicator */
  @property({ type: Boolean, reflect: true })
  loading = false;

  override connectedCallback(): void {
    super.connectedCallback();

    // Generate ID if not set
    if (!this.id) {
      this.id = `combobox-content-${crypto.randomUUID().slice(0, 8)}`;
    }

    // Set ARIA role for listbox
    this.setAttribute("role", "listbox");

    // Set label if provided
    if (this.label) {
      this.setAttribute("aria-label", this.label);
    }

    // Hidden by default (parent combobox controls visibility)
    this.setAttribute("hidden", "");
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has("label")) {
      if (this.label) {
        this.setAttribute("aria-label", this.label);
      } else {
        this.removeAttribute("aria-label");
      }
    }

    if (changedProperties.has("loading")) {
      this.setAttribute("aria-busy", String(this.loading));
    }
  }

  override render() {
    return html`
      <div class="ds-combobox-content" part="container">
        <slot></slot>
      </div>
    `;
  }
}

define("ds-combobox-content", DsComboboxContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-combobox-content": DsComboboxContent;
  }
}
