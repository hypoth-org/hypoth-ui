/**
 * Tabs Content component - panel content for a tab.
 *
 * @element ds-tabs-content
 *
 * @slot - Tab panel content
 */

import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { DsTabs } from "./tabs.js";

export class DsTabsContent extends DSElement {
  /** Value of associated tab */
  @property({ reflect: true })
  value = "";

  /** Keep mounted when inactive (for animations) */
  @property({ type: Boolean, attribute: "force-mount" })
  forceMount = false;

  /** Internal active state */
  @state()
  private active = false;

  override connectedCallback(): void {
    super.connectedCallback();

    // Apply panel props after DOM is ready
    requestAnimationFrame(() => {
      this.applyBehaviorProps();
    });
  }

  private applyBehaviorProps(): void {
    const tabsRoot = this.closest("ds-tabs") as DsTabs | null;
    const tabsBehavior = tabsRoot?.getTabsBehavior();

    if (!tabsBehavior) {
      // Fallback for standalone usage
      this.setAttribute("role", "tabpanel");
      return;
    }

    const panelProps = tabsBehavior.getPanelProps(this.value);
    this.id = panelProps.id;
    this.setAttribute("role", panelProps.role);
    this.setAttribute("aria-labelledby", panelProps["aria-labelledby"]);
    this.setAttribute("tabindex", String(panelProps.tabIndex));

    // Handle visibility (respecting forceMount)
    if (this.forceMount) {
      this.hidden = false;
    } else {
      this.hidden = panelProps.hidden;
    }

    this.setAttribute("data-state", panelProps.hidden ? "inactive" : "active");
  }

  /**
   * Update from behavior (called by parent).
   */
  public updateFromBehavior(active: boolean): void {
    this.active = active;
    this.applyBehaviorProps();
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-tabs-content", DsTabsContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-tabs-content": DsTabsContent;
  }
}
