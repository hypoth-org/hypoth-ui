/**
 * AlertDialogDescription component - description for the alert dialog.
 *
 * @element ds-alert-dialog-description
 *
 * @slot - Description content
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsAlertDialogDescription extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();

    // Generate ID if not present (for aria-describedby)
    if (!this.id) {
      this.id = `alert-dialog-desc-${crypto.randomUUID().slice(0, 8)}`;
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-alert-dialog-description", DsAlertDialogDescription);

declare global {
  interface HTMLElementTagNameMap {
    "ds-alert-dialog-description": DsAlertDialogDescription;
  }
}
