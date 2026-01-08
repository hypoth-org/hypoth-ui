/**
 * PaginationEllipsis component - indicates more pages.
 *
 * @element ds-pagination-ellipsis
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsPaginationEllipsis extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("aria-hidden", "true");
  }

  override render() {
    return html`<span>...</span>`;
  }
}

define("ds-pagination-ellipsis", DsPaginationEllipsis);

declare global {
  interface HTMLElementTagNameMap {
    "ds-pagination-ellipsis": DsPaginationEllipsis;
  }
}
