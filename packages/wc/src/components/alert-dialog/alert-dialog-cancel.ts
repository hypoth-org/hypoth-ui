/**
 * AlertDialogCancel component - cancels the action and closes the dialog.
 *
 * @element ds-alert-dialog-cancel
 *
 * @slot - Cancel button content
 *
 * @fires ds:alert-dialog-cancel - Fired when cancel is clicked
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsAlertDialogCancel extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.handleClick);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
  }

  private handleClick = (): void => {
    // Emit cancel event - parent will handle closing
    emitEvent(this, "ds:alert-dialog-cancel", { bubbles: true });
  };

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-alert-dialog-cancel", DsAlertDialogCancel);

declare global {
  interface HTMLElementTagNameMap {
    "ds-alert-dialog-cancel": DsAlertDialogCancel;
  }
}
