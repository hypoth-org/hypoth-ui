/**
 * PaginationItem component - wrapper for pagination link.
 *
 * @element ds-pagination-item
 *
 * @slot - Pagination link
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsPaginationItem extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "listitem");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-pagination-item", DsPaginationItem);

declare global {
  interface HTMLElementTagNameMap {
    "ds-pagination-item": DsPaginationItem;
  }
}
