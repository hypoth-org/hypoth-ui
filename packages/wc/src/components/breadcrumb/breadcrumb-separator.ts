/**
 * BreadcrumbSeparator component - visual separator between items.
 *
 * @element ds-breadcrumb-separator
 *
 * @slot - Separator content (defaults to /)
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsBreadcrumbSeparator extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "presentation");
    this.setAttribute("aria-hidden", "true");
  }

  override render() {
    return html`<slot>/</slot>`;
  }
}

define("ds-breadcrumb-separator", DsBreadcrumbSeparator);

declare global {
  interface HTMLElementTagNameMap {
    "ds-breadcrumb-separator": DsBreadcrumbSeparator;
  }
}
