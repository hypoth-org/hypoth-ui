/**
 * NavigationMenuViewport component - container for content panels.
 *
 * Renders the active content panel with smooth transitions.
 *
 * @element ds-navigation-menu-viewport
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsNavigationMenuViewport extends DSElement {
  private contentObserver: MutationObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("hidden", "");
    this.setAttribute("data-state", "closed");

    // Observe parent for content changes
    this.setupContentObserver();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.contentObserver?.disconnect();
    this.contentObserver = null;
  }

  private setupContentObserver(): void {
    const menu = this.closest("ds-navigation-menu");
    if (!menu) return;

    // Update viewport content when menu value changes
    this.contentObserver = new MutationObserver(() => {
      this.updateContent();
    });

    this.contentObserver.observe(menu, {
      attributes: true,
      attributeFilter: ["value"],
    });

    // Initial update
    this.updateContent();
  }

  private updateContent(): void {
    const menu = this.closest("ds-navigation-menu");
    if (!menu) return;

    const value = menu.getAttribute("value");

    // Move active content into viewport
    const items = menu.querySelectorAll("ds-navigation-menu-item");

    // Clear viewport
    this.innerHTML = "";

    for (const item of items) {
      const itemValue = item.getAttribute("value");
      const content = item.querySelector("ds-navigation-menu-content");

      if (itemValue === value && content) {
        // Clone content to viewport
        const clone = content.cloneNode(true) as HTMLElement;
        clone.setAttribute("data-value", itemValue || "");
        this.appendChild(clone);
      }
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-navigation-menu-viewport", DsNavigationMenuViewport);

declare global {
  interface HTMLElementTagNameMap {
    "ds-navigation-menu-viewport": DsNavigationMenuViewport;
  }
}
