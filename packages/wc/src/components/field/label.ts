import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Label component for form fields.
 *
 * Used within ds-field to provide an accessible label that is
 * automatically associated with the form control via aria-labelledby.
 *
 * @element ds-label
 *
 * @slot - Label text content
 *
 * @example
 * ```html
 * <ds-field>
 *   <ds-label>Email address</ds-label>
 *   <ds-input type="email"></ds-input>
 * </ds-field>
 * ```
 */
export class DsLabel extends DSElement {
  /**
   * ID of the associated form control.
   * Typically set automatically by the parent ds-field component.
   */
  @property({ type: String, attribute: "for" })
  for = "";

  override render() {
    return html`
      <label
        class="ds-label"
        part="label"
        for=${this.for || nothing}
      >
        <slot></slot>
      </label>
    `;
  }
}

// Import nothing for conditional attributes
import { nothing } from "lit";

define("ds-label", DsLabel);

declare global {
  interface HTMLElementTagNameMap {
    "ds-label": DsLabel;
  }
}
