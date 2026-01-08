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
    this.setAttribute("role", "tabpanel");
    this.updateVisibility();
  }

  /**
   * Set the active state (called by parent).
   */
  public setActive(active: boolean): void {
    this.active = active;
    this.setAttribute("data-state", active ? "active" : "inactive");
    this.updateVisibility();
    this.updateAccessibility();
  }

  private updateVisibility(): void {
    if (this.forceMount) {
      this.hidden = false;
      return;
    }
    this.hidden = !this.active;
  }

  private updateAccessibility(): void {
    // Find the associated trigger to set aria-labelledby
    const tabsRoot = this.closest("ds-tabs");
    if (tabsRoot) {
      const trigger = tabsRoot.querySelector(`ds-tabs-trigger[value="${this.value}"]`);
      if (trigger?.id) {
        this.setAttribute("aria-labelledby", trigger.id);
      }
    }

    // Set tabindex for focusability
    this.setAttribute("tabindex", this.active ? "0" : "-1");
  }

  override updated(): void {
    this.updateAccessibility();
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
