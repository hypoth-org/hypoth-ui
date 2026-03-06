/**
 * SheetClose component - closes the sheet when clicked.
 *
 * @element ds-sheet-close
 *
 * @slot - Close button content
 *
 * @fires ds:sheet-close - Fired when close is clicked
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsSheetClose extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.handleClick);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
  }

  private handleClick = (): void => {
    // Emit close event - parent will handle closing
    emitEvent(this, "ds:sheet-close", { bubbles: true });
  };

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-sheet-close", DsSheetClose);

declare global {
  interface HTMLElementTagNameMap {
    "ds-sheet-close": DsSheetClose;
  }
}
