import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type DialogContentSize = "sm" | "md" | "lg" | "xl" | "full";

/**
 * Dialog content container component.
 *
 * Contains the dialog's content including title, description, and actions.
 * Receives accessibility attributes from parent ds-dialog.
 *
 * @element ds-dialog-content
 *
 * @slot - Dialog content (title, description, body, actions)
 *
 * @csspart container - The content container element
 *
 * @example
 * ```html
 * <ds-dialog-content size="lg">
 *   <ds-dialog-title>Large Dialog</ds-dialog-title>
 *   <p>Dialog body content here.</p>
 *   <div class="ds-dialog__footer">
 *     <button>Cancel</button>
 *     <button>Confirm</button>
 *   </div>
 * </ds-dialog-content>
 * ```
 */
export class DsDialogContent extends DSElement {
  /** Size variant of the dialog */
  @property({ type: String, reflect: true })
  size: DialogContentSize = "md";

  override render() {
    return html`
      <div class="ds-dialog-content" part="container" data-size=${this.size}>
        <slot></slot>
      </div>
    `;
  }
}

define("ds-dialog-content", DsDialogContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-dialog-content": DsDialogContent;
  }
}
