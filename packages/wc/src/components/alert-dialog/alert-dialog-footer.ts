/**
 * AlertDialogFooter component - footer section for alert dialog actions.
 *
 * @element ds-alert-dialog-footer
 *
 * @slot - Footer content (action and cancel buttons)
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsAlertDialogFooter extends DSElement {
  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-alert-dialog-footer", DsAlertDialogFooter);

declare global {
  interface HTMLElementTagNameMap {
    "ds-alert-dialog-footer": DsAlertDialogFooter;
  }
}
