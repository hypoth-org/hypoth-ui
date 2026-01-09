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

import {
  type TabsBehavior,
  type TabsOrientation as BehaviorTabsOrientation,
  type TabsActivationMode as BehaviorTabsActivationMode,
  createTabsBehavior,
} from "@ds/primitives-dom";
import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

// Import child components
import type { DsTabsContent } from "./tabs-content.js";
import type { DsTabsList } from "./tabs-list.js";
import type { DsTabsTrigger } from "./tabs-trigger.js";
import "./tabs-list.js";
import "./tabs-trigger.js";
import "./tabs-content.js";

export type TabsOrientation = BehaviorTabsOrientation;
export type TabsActivationMode = BehaviorTabsActivationMode;

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

  /** Loop keyboard navigation at ends */
  @property({ type: Boolean })
  loop = true;

  /** Internal tracked value */
  @state()
  private internalValue: string | undefined;

  /** Behavior primitive instance */
  private tabsBehavior: TabsBehavior | null = null;

  /** Whether we're in controlled mode */
  private get isControlled(): boolean {
    return this.value !== undefined;
  }

  /** Current active value */
  get activeValue(): string | undefined {
    return this.isControlled ? this.value : this.internalValue;
  }

  /** Get the tabs behavior (for child components) */
  getTabsBehavior(): TabsBehavior | null {
    return this.tabsBehavior;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // Initialize internal value from default
    if (!this.isControlled && this.defaultValue) {
      this.internalValue = this.defaultValue;
    }

    // Initialize behavior
    this.initTabsBehavior();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.tabsBehavior?.destroy();
    this.tabsBehavior = null;
  }

  private initTabsBehavior(): void {
    this.tabsBehavior = createTabsBehavior({
      defaultValue: this.activeValue ?? this.defaultValue ?? "",
      orientation: this.orientation,
      activationMode: this.activationMode,
      loop: this.loop,
      onValueChange: (newValue) => {
        if (!this.isControlled) {
          this.internalValue = newValue;
        }
        emitEvent(this, "ds:change", { detail: { value: newValue } });
        this.updateTabsState();
      },
    });
  }

  /**
   * Select a tab by value.
   */
  public selectTab(value: string): void {
    if (this.activeValue === value) return;
    this.tabsBehavior?.select(value);
  }

  override updated(changedProperties: Map<string, unknown>): void {
    // Handle controlled value changes
    if (changedProperties.has("value") && this.isControlled && this.value) {
      this.tabsBehavior?.select(this.value);
      this.updateTabsState();
    }

    // Handle internal value changes
    if (changedProperties.has("internalValue")) {
      this.updateTabsState();
    }

    // Initial update when defaultValue is set
    if (changedProperties.has("defaultValue") && !this.isControlled && !this.internalValue) {
      this.internalValue = this.defaultValue;
      this.tabsBehavior?.select(this.defaultValue ?? "");
      this.updateTabsState();
    }

    // Re-create behavior if orientation/activationMode/loop change
    if (
      changedProperties.has("orientation") ||
      changedProperties.has("activationMode") ||
      changedProperties.has("loop")
    ) {
      const currentValue = this.activeValue;
      this.tabsBehavior?.destroy();
      this.initTabsBehavior();
      if (currentValue) {
        this.tabsBehavior?.select(currentValue);
      }
      // Re-setup tablist element
      const tabsList = this.querySelector("ds-tabs-list") as DsTabsList | null;
      tabsList?.setupBehavior();
      this.updateTabsState();
    }
  }

  private updateTabsState(): void {
    const activeValue = this.activeValue;

    // Update triggers
    const triggers = this.querySelectorAll("ds-tabs-trigger") as NodeListOf<DsTabsTrigger>;
    for (const trigger of triggers) {
      trigger.updateFromBehavior(trigger.value === activeValue);
    }

    // Update content panels
    const contents = this.querySelectorAll("ds-tabs-content") as NodeListOf<DsTabsContent>;
    for (const content of contents) {
      content.updateFromBehavior(content.value === activeValue);
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
