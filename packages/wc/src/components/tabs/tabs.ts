/**
 * Tabs component - tabbed interface for organizing content.
 *
 * Implements WAI-ARIA Tabs pattern with keyboard navigation.
 *
 * @element ds-tabs
 *
 * @slot - Tabs content (ds-tabs-list, ds-tabs-content)
 *
 * @fires ds:change - Fired when selected tab changes
 *
 * @example
 * ```html
 * <ds-tabs default-value="tab1">
 *   <ds-tabs-list>
 *     <ds-tabs-trigger value="tab1">Tab 1</ds-tabs-trigger>
 *     <ds-tabs-trigger value="tab2">Tab 2</ds-tabs-trigger>
 *   </ds-tabs-list>
 *   <ds-tabs-content value="tab1">Content 1</ds-tabs-content>
 *   <ds-tabs-content value="tab2">Content 2</ds-tabs-content>
 * </ds-tabs>
 * ```
 */

import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

// Import child components
import type { DsTabsContent } from "./tabs-content.js";
import type { DsTabsTrigger } from "./tabs-trigger.js";
import "./tabs-list.js";
import "./tabs-trigger.js";
import "./tabs-content.js";

export type TabsOrientation = "horizontal" | "vertical";
export type TabsActivationMode = "automatic" | "manual";

export class DsTabs extends DSElement {
  /** Controlled value */
  @property()
  value: string | undefined;

  /** Default value (uncontrolled) */
  @property({ attribute: "default-value" })
  defaultValue: string | undefined;

  /** Keyboard navigation orientation */
  @property({ reflect: true })
  orientation: TabsOrientation = "horizontal";

  /**
   * Activation mode:
   * - automatic: selection follows focus
   * - manual: selection requires Enter/Space
   */
  @property({ attribute: "activation-mode" })
  activationMode: TabsActivationMode = "automatic";

  /** Internal tracked value */
  @state()
  private internalValue: string | undefined;

  /** Whether we're in controlled mode */
  private get isControlled(): boolean {
    return this.value !== undefined;
  }

  /** Current active value */
  get activeValue(): string | undefined {
    return this.isControlled ? this.value : this.internalValue;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // Initialize internal value from default
    if (!this.isControlled && this.defaultValue) {
      this.internalValue = this.defaultValue;
    }

    // Listen for trigger activations
    this.addEventListener("ds:tab-activate", this.handleTabActivate as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("ds:tab-activate", this.handleTabActivate as EventListener);
  }

  /**
   * Select a tab by value.
   */
  public selectTab(value: string): void {
    if (this.activeValue === value) return;

    // Check if trigger exists and is not disabled
    const trigger = this.querySelector(`ds-tabs-trigger[value="${value}"]`) as DsTabsTrigger | null;
    if (!trigger || trigger.disabled) return;

    if (!this.isControlled) {
      this.internalValue = value;
    }

    emitEvent(this, "ds:change", { detail: { value } });
    this.updateTabs();
  }

  private handleTabActivate = (event: CustomEvent<{ value: string }>): void => {
    this.selectTab(event.detail.value);
  };

  override updated(changedProperties: Map<string, unknown>): void {
    // Handle controlled value changes
    if (changedProperties.has("value") || changedProperties.has("internalValue")) {
      this.updateTabs();
    }

    // Initial update when defaultValue is set
    if (changedProperties.has("defaultValue") && !this.isControlled && !this.internalValue) {
      this.internalValue = this.defaultValue;
      this.updateTabs();
    }
  }

  private updateTabs(): void {
    const activeValue = this.activeValue;

    // Update triggers
    const triggers = this.querySelectorAll("ds-tabs-trigger") as NodeListOf<DsTabsTrigger>;
    for (const trigger of triggers) {
      trigger.setSelected(trigger.value === activeValue);
    }

    // Update content panels
    const contents = this.querySelectorAll("ds-tabs-content") as NodeListOf<DsTabsContent>;
    for (const content of contents) {
      content.setActive(content.value === activeValue);
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-tabs", DsTabs);

declare global {
  interface HTMLElementTagNameMap {
    "ds-tabs": DsTabs;
  }
}
