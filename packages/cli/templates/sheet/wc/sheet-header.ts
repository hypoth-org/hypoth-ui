/**
 * SheetHeader component - header section for sheet.
 *
 * @element ds-sheet-header
 *
 * @slot - Header content (title and description)
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsSheetHeader extends DSElement {
  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-sheet-header", DsSheetHeader);

declare global {
  interface HTMLElementTagNameMap {
    "ds-sheet-header": DsSheetHeader;
  }
}
