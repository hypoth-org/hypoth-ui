import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Error message component for form fields.
 *
 * Used within ds-field to display validation error messages that are
 * automatically associated with the form control via aria-describedby.
 * Error messages take precedence over descriptions in the ARIA description.
 *
 * @element ds-field-error
 *
 * @slot - Error message text content
 *
 * @example
 * ```html
 * <ds-field>
 *   <ds-label>Email</ds-label>
 *   <ds-input type="email" error></ds-input>
 *   <ds-field-error>Please enter a valid email address</ds-field-error>
 * </ds-field>
 * ```
 */
export class DsFieldError extends DSElement {
  override render() {
    return html`
      <div
        class="ds-field-error"
        part="error"
        role="alert"
        aria-live="polite"
      >
        <slot></slot>
      </div>
    `;
  }
}

define("ds-field-error", DsFieldError);

declare global {
  interface HTMLElementTagNameMap {
    "ds-field-error": DsFieldError;
  }
}
