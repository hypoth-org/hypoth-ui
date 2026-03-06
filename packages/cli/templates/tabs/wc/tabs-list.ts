/**
 * Tabs List component - container for tab triggers.
 *
 * Implements keyboard navigation with arrow keys via behavior primitive.
 *
 * @element ds-tabs-list
 *
 * @slot - Tab triggers (ds-tabs-trigger)
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { DsTabs } from "./tabs.js";

export class DsTabsList extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();

    // Initialize after DOM is ready
    requestAnimationFrame(() => {
      this.setupBehavior();
    });
  }

  /**
   * Setup behavior connection (called by parent when options change).
   */
  public setupBehavior(): void {
    const tabsRoot = this.closest("ds-tabs") as DsTabs | null;
    const tabsBehavior = tabsRoot?.getTabsBehavior();

    if (!tabsBehavior) return;

    // Apply tablist props from behavior
    const tablistProps = tabsBehavior.getTabListProps();
    this.setAttribute("id", tablistProps.id);
    this.setAttribute("role", tablistProps.role);
    this.setAttribute("aria-orientation", tablistProps["aria-orientation"]);

    // Set tablist element to activate roving focus
    tabsBehavior.setTablistElement(this);
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-tabs-list", DsTabsList);

declare global {
  interface HTMLElementTagNameMap {
    "ds-tabs-list": DsTabsList;
  }
}
