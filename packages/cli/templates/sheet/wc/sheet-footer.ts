/**
 * SheetFooter component - footer section for sheet actions.
 *
 * @element ds-sheet-footer
 *
 * @slot - Footer content (action buttons)
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsSheetFooter extends DSElement {
  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-sheet-footer", DsSheetFooter);

declare global {
  interface HTMLElementTagNameMap {
    "ds-sheet-footer": DsSheetFooter;
  }
}
