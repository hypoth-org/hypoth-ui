/**
 * BreadcrumbList component - ordered list container.
 *
 * @element ds-breadcrumb-list
 *
 * @slot - Breadcrumb items and separators
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsBreadcrumbList extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "list");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-breadcrumb-list", DsBreadcrumbList);

declare global {
  interface HTMLElementTagNameMap {
    "ds-breadcrumb-list": DsBreadcrumbList;
  }
}
