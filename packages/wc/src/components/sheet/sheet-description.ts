/**
 * SheetDescription component - description for the sheet.
 *
 * @element ds-sheet-description
 *
 * @slot - Description content
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsSheetDescription extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();

    // Generate ID if not present (for aria-describedby)
    if (!this.id) {
      this.id = `sheet-desc-${crypto.randomUUID().slice(0, 8)}`;
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-sheet-description", DsSheetDescription);

declare global {
  interface HTMLElementTagNameMap {
    "ds-sheet-description": DsSheetDescription;
  }
}
