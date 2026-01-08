/**
 * NavigationMenuContent component - dropdown content panel.
 *
 * @element ds-navigation-menu-content
 *
 * @slot - Content (links, cards, etc.)
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsNavigationMenuContent extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "menu");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-navigation-menu-content", DsNavigationMenuContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-navigation-menu-content": DsNavigationMenuContent;
  }
}
