/**
 * AlertDialogAction component - confirms the action and closes the dialog.
 *
 * @element ds-alert-dialog-action
 *
 * @slot - Action button content
 *
 * @fires ds:alert-dialog-action - Fired when action is clicked
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsAlertDialogAction extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.handleClick);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
  }

  private handleClick = (): void => {
    // Emit action event - parent will handle closing
    emitEvent(this, "ds:alert-dialog-action", { bubbles: true });
  };

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-alert-dialog-action", DsAlertDialogAction);

declare global {
  interface HTMLElementTagNameMap {
    "ds-alert-dialog-action": DsAlertDialogAction;
  }
}
