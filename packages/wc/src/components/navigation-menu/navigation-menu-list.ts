/**
 * NavigationMenuList component - container for navigation items.
 *
 * @element ds-navigation-menu-list
 *
 * @slot - Navigation menu items
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsNavigationMenuList extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "menubar");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-navigation-menu-list", DsNavigationMenuList);

declare global {
  interface HTMLElementTagNameMap {
    "ds-navigation-menu-list": DsNavigationMenuList;
  }
}
