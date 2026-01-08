/**
 * AlertDialogHeader component - header section for alert dialog.
 *
 * @element ds-alert-dialog-header
 *
 * @slot - Header content (title and description)
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsAlertDialogHeader extends DSElement {
  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-alert-dialog-header", DsAlertDialogHeader);

declare global {
  interface HTMLElementTagNameMap {
    "ds-alert-dialog-header": DsAlertDialogHeader;
  }
}
