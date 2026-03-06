/**
 * BreadcrumbPage component - current page (non-navigable).
 *
 * @element ds-breadcrumb-page
 *
 * @slot - Page content
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsBreadcrumbPage extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "link");
    this.setAttribute("aria-current", "page");
    this.setAttribute("aria-disabled", "true");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-breadcrumb-page", DsBreadcrumbPage);

declare global {
  interface HTMLElementTagNameMap {
    "ds-breadcrumb-page": DsBreadcrumbPage;
  }
}
