/**
 * SheetTitle component - title for the sheet.
 *
 * @element ds-sheet-title
 *
 * @slot - Title content
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsSheetTitle extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();

    // Generate ID if not present (for aria-labelledby)
    if (!this.id) {
      this.id = `sheet-title-${crypto.randomUUID().slice(0, 8)}`;
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-sheet-title", DsSheetTitle);

declare global {
  interface HTMLElementTagNameMap {
    "ds-sheet-title": DsSheetTitle;
  }
}
