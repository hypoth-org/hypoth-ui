/**
 * BreadcrumbItem component - individual breadcrumb item.
 *
 * @element ds-breadcrumb-item
 *
 * @slot - Link or page content
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsBreadcrumbItem extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "listitem");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-breadcrumb-item", DsBreadcrumbItem);

declare global {
  interface HTMLElementTagNameMap {
    "ds-breadcrumb-item": DsBreadcrumbItem;
  }
}
