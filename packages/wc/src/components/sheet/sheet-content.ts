/**
 * SheetContent component - container for sheet content.
 *
 * @element ds-sheet-content
 *
 * @slot - Sheet content (header, body, footer)
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type SheetSide = "top" | "right" | "bottom" | "left";
export type SheetContentSize = "sm" | "md" | "lg" | "xl" | "full";

export class DsSheetContent extends DSElement {
  /** Side of the screen the sheet appears from */
  @property({ reflect: true })
  side: SheetSide = "right";

  /** Size of the sheet content */
  @property({ reflect: true })
  size: SheetContentSize = "md";

  /** Data state for animations */
  @property({ attribute: "data-state", reflect: true })
  dataState: "open" | "closed" = "closed";

  override connectedCallback(): void {
    super.connectedCallback();

    // ARIA attributes are set by parent DsSheet
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-sheet-content", DsSheetContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-sheet-content": DsSheetContent;
  }
}
