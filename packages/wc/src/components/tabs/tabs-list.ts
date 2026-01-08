/**
 * Tabs List component - container for tab triggers.
 *
 * Implements keyboard navigation with arrow keys.
 *
 * @element ds-tabs-list
 *
 * @slot - Tab triggers (ds-tabs-trigger)
 */

import { type RovingFocus, createRovingFocus } from "@ds/primitives-dom";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { DsTabs, TabsOrientation } from "./tabs.js";

export class DsTabsList extends DSElement {
  /** Loop focus at ends */
  @property({ type: Boolean })
  loop = true;

  private rovingFocus: RovingFocus | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // Set ARIA role
    this.setAttribute("role", "tablist");

    // Initialize roving focus after DOM is ready
    requestAnimationFrame(() => {
      this.setupRovingFocus();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.rovingFocus?.destroy();
    this.rovingFocus = null;
  }

  private setupRovingFocus(): void {
    const tabsRoot = this.closest("ds-tabs") as DsTabs | null;
    const orientation: TabsOrientation = tabsRoot?.orientation ?? "horizontal";

    // Update aria-orientation
    this.setAttribute("aria-orientation", orientation);

    this.rovingFocus = createRovingFocus({
      container: this,
      selector: "ds-tabs-trigger:not([disabled])",
      direction: orientation,
      loop: this.loop,
    });
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
