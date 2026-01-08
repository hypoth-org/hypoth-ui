/**
 * NavigationMenuIndicator component - visual indicator for active item.
 *
 * Shows which navigation item is currently active/hovered.
 *
 * @element ds-navigation-menu-indicator
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsNavigationMenuIndicator extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("aria-hidden", "true");
  }

  override render() {
    return html`<div class="ds-navigation-menu-indicator__arrow"></div>`;
  }
}

define("ds-navigation-menu-indicator", DsNavigationMenuIndicator);

declare global {
  interface HTMLElementTagNameMap {
    "ds-navigation-menu-indicator": DsNavigationMenuIndicator;
  }
}
