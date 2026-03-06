/**
 * SheetOverlay component - backdrop overlay behind the sheet.
 *
 * @element ds-sheet-overlay
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsSheetOverlay extends DSElement {
  override render() {
    return html``;
  }
}

define("ds-sheet-overlay", DsSheetOverlay);

declare global {
  interface HTMLElementTagNameMap {
    "ds-sheet-overlay": DsSheetOverlay;
  }
}
