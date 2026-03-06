import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Description/help text component for form fields.
 *
 * Used within ds-field to provide supplementary help text that is
 * automatically associated with the form control via aria-describedby.
 *
 * @element ds-field-description
 *
 * @slot - Description text content
 *
 * @example
 * ```html
 * <ds-field>
 *   <ds-label>Password</ds-label>
 *   <ds-input type="password"></ds-input>
 *   <ds-field-description>
 *     Must be at least 8 characters with one number
 *   </ds-field-description>
 * </ds-field>
 * ```
 */
export class DsFieldDescription extends DSElement {
  override render() {
    return html`
      <div class="ds-field-description" part="description">
        <slot></slot>
      </div>
    `;
  }
}

define("ds-field-description", DsFieldDescription);

declare global {
  interface HTMLElementTagNameMap {
    "ds-field-description": DsFieldDescription;
  }
}
