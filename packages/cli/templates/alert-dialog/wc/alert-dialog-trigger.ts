/**
 * AlertDialogTrigger component - element that opens the alert dialog.
 *
 * @element ds-alert-dialog-trigger
 *
 * @slot - Trigger content (typically a button)
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { DsAlertDialog } from "./alert-dialog.js";

export class DsAlertDialogTrigger extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();

    // Set slot attribute
    this.setAttribute("slot", "trigger");

    // Add click handler
    this.addEventListener("click", this.handleClick);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
  }

  private handleClick = (): void => {
    const alertDialog = this.closest("ds-alert-dialog") as DsAlertDialog | null;
    alertDialog?.show();
  };

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-alert-dialog-trigger", DsAlertDialogTrigger);

declare global {
  interface HTMLElementTagNameMap {
    "ds-alert-dialog-trigger": DsAlertDialogTrigger;
  }
}
