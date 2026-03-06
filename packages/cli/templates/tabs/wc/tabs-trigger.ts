/**
 * Tabs Trigger component - button that activates a tab panel.
 *
 * @element ds-tabs-trigger
 *
 * @slot - Trigger label content
 */

import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { DsTabs } from "./tabs.js";

export class DsTabsTrigger extends DSElement {
  /** Unique value identifying this tab */
  @property({ reflect: true })
  value = "";

  /** Disable this tab */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Internal selected state */
  @state()
  private selected = false;

  override connectedCallback(): void {
    super.connectedCallback();

    // Handle interactions
    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeyDown);
    this.addEventListener("focus", this.handleFocus);

    // Register with behavior after DOM is ready
    requestAnimationFrame(() => {
      this.registerWithBehavior();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeyDown);
    this.removeEventListener("focus", this.handleFocus);

    // Unregister from behavior
    const tabsRoot = this.closest("ds-tabs") as DsTabs | null;
    tabsRoot?.getTabsBehavior()?.unregisterTab(this.value);
  }

  private registerWithBehavior(): void {
    const tabsRoot = this.closest("ds-tabs") as DsTabs | null;
    const tabsBehavior = tabsRoot?.getTabsBehavior();

    if (!tabsBehavior) return;

    // Register this tab
    tabsBehavior.registerTab(this.value, { disabled: this.disabled });

    // Apply trigger props from behavior
    this.applyBehaviorProps();
  }

  private applyBehaviorProps(): void {
    const tabsRoot = this.closest("ds-tabs") as DsTabs | null;
    const tabsBehavior = tabsRoot?.getTabsBehavior();

    if (!tabsBehavior) return;

    const triggerProps = tabsBehavior.getTriggerProps(this.value, { disabled: this.disabled });
    this.id = triggerProps.id;
    this.setAttribute("role", triggerProps.role);
    this.setAttribute("tabindex", String(triggerProps.tabIndex));
    this.setAttribute("aria-selected", triggerProps["aria-selected"]);
    this.setAttribute("aria-controls", triggerProps["aria-controls"]);

    if (triggerProps["aria-disabled"]) {
      this.setAttribute("aria-disabled", triggerProps["aria-disabled"]);
    } else {
      this.removeAttribute("aria-disabled");
    }
  }

  /**
   * Update from behavior (called by parent).
   */
  public updateFromBehavior(selected: boolean): void {
    this.selected = selected;
    this.applyBehaviorProps();
  }

  private handleClick = (): void => {
    const tabsRoot = this.closest("ds-tabs") as DsTabs | null;
    const tabsBehavior = tabsRoot?.getTabsBehavior();
    tabsBehavior?.handleTriggerClick(this.value);
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    const tabsRoot = this.closest("ds-tabs") as DsTabs | null;
    const tabsBehavior = tabsRoot?.getTabsBehavior();
    tabsBehavior?.handleTriggerKeyDown(event, this.value);
  };

  private handleFocus = (): void => {
    const tabsRoot = this.closest("ds-tabs") as DsTabs | null;
    const tabsBehavior = tabsRoot?.getTabsBehavior();
    tabsBehavior?.handleTriggerFocus(this.value);
  };

  override updated(changedProperties: Map<string, unknown>): void {
    // Re-register if disabled state changes
    if (changedProperties.has("disabled")) {
      const tabsRoot = this.closest("ds-tabs") as DsTabs | null;
      const tabsBehavior = tabsRoot?.getTabsBehavior();
      if (tabsBehavior) {
        tabsBehavior.unregisterTab(this.value);
        tabsBehavior.registerTab(this.value, { disabled: this.disabled });
        this.applyBehaviorProps();
      }
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-tabs-trigger", DsTabsTrigger);

declare global {
  interface HTMLElementTagNameMap {
    "ds-tabs-trigger": DsTabsTrigger;
  }
}
