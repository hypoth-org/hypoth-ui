import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type SelectContentState = "open" | "closed";

/**
 * Select content container with role="listbox".
 *
 * @element ds-select-content
 *
 * @slot - Select options (ds-select-option elements)
 *
 * @attr {string} data-state - Animation state ("open" or "closed")
 * @attr {string} data-placement - Current anchor position placement
 *
 * @example
 * ```html
 * <ds-select>
 *   <button slot="trigger">Select fruit</button>
 *   <ds-select-content>
 *     <ds-select-option value="apple">Apple</ds-select-option>
 *     <ds-select-option value="banana">Banana</ds-select-option>
 *   </ds-select-content>
 * </ds-select>
 * ```
 */
export class DsSelectContent extends DSElement {
  /** Unique ID for ARIA association */
  @property({ type: String, reflect: true })
  override id = "";

  /** Animation state (open or closed) - set by parent ds-select */
  @property({ type: String, reflect: true, attribute: "data-state" })
  dataState: SelectContentState = "closed";

  /** Optional label for the listbox */
  @property({ type: String })
  label = "";

  override connectedCallback(): void {
    super.connectedCallback();

    // Generate ID if not set
    if (!this.id) {
      this.id = `select-content-${crypto.randomUUID().slice(0, 8)}`;
    }

    // Set ARIA role for listbox
    this.setAttribute("role", "listbox");

    // Set label if provided
    if (this.label) {
      this.setAttribute("aria-label", this.label);
    }

    // Hidden by default (parent select controls visibility)
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
  }

  override render() {
    return html`
      <div class="ds-select-content" part="container">
        <slot></slot>
      </div>
    `;
  }
}

define("ds-select-content", DsSelectContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-select-content": DsSelectContent;
  }
}
