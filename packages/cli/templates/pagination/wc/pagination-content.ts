/**
 * PaginationContent component - container for pagination items.
 *
 * @element ds-pagination-content
 *
 * @slot - Pagination items
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsPaginationContent extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "list");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-pagination-content", DsPaginationContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-pagination-content": DsPaginationContent;
  }
}
