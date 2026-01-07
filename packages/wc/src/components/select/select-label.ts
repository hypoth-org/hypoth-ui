import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Label for a select option group.
 *
 * @element ds-select-label
 *
 * @slot - Label text content
 *
 * @example
 * ```html
 * <ds-select-group>
 *   <ds-select-label>Fruits</ds-select-label>
 *   <ds-select-option value="apple">Apple</ds-select-option>
 * </ds-select-group>
 * ```
 */
export class DsSelectLabel extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();

    // Set ARIA role - presentation since it's not interactive
    this.setAttribute("role", "presentation");

    // Set aria-hidden since screen readers should use the group's aria-labelledby
    this.setAttribute("aria-hidden", "true");

    // Generate ID if not set (used for aria-labelledby on parent group)
    if (!this.id) {
      this.id = `select-label-${crypto.randomUUID().slice(0, 8)}`;
    }
  }

  override render() {
    return html`
      <div class="ds-select-label" part="container">
        <slot></slot>
      </div>
    `;
  }
}

define("ds-select-label", DsSelectLabel);

declare global {
  interface HTMLElementTagNameMap {
    "ds-select-label": DsSelectLabel;
  }
}
