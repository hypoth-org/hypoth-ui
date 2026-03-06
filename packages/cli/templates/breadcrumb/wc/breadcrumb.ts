/**
 * Breadcrumb component - navigation trail.
 *
 * Shows the current page location within a navigational hierarchy.
 *
 * @element ds-breadcrumb
 *
 * @slot - Breadcrumb list
 *
 * @example
 * ```html
 * <ds-breadcrumb>
 *   <ds-breadcrumb-list>
 *     <ds-breadcrumb-item>
 *       <ds-breadcrumb-link href="/">Home</ds-breadcrumb-link>
 *     </ds-breadcrumb-item>
 *     <ds-breadcrumb-separator>/</ds-breadcrumb-separator>
 *     <ds-breadcrumb-item>
 *       <ds-breadcrumb-page>Current</ds-breadcrumb-page>
 *     </ds-breadcrumb-item>
 *   </ds-breadcrumb-list>
 * </ds-breadcrumb>
 * ```
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

// Import child components
import "./breadcrumb-list.js";
import "./breadcrumb-item.js";
import "./breadcrumb-link.js";
import "./breadcrumb-page.js";
import "./breadcrumb-separator.js";

export class DsBreadcrumb extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "navigation");
    this.setAttribute("aria-label", "Breadcrumb");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-breadcrumb", DsBreadcrumb);

declare global {
  interface HTMLElementTagNameMap {
    "ds-breadcrumb": DsBreadcrumb;
  }
}
