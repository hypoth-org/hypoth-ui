/**
 * AlertDialogTitle component - title for the alert dialog.
 *
 * @element ds-alert-dialog-title
 *
 * @slot - Title content
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsAlertDialogTitle extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();

    // Generate ID if not present (for aria-labelledby)
    if (!this.id) {
      this.id = `alert-dialog-title-${crypto.randomUUID().slice(0, 8)}`;
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-alert-dialog-title", DsAlertDialogTitle);

declare global {
  interface HTMLElementTagNameMap {
    "ds-alert-dialog-title": DsAlertDialogTitle;
  }
}
