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
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";
import type { DsTabs, TabsActivationMode } from "./tabs.js";

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

  /** ID for the associated content panel */
  private contentId = "";

  override connectedCallback(): void {
    super.connectedCallback();

    // Set ARIA role and attributes
    this.setAttribute("role", "tab");
    this.setAttribute("tabindex", "-1");

    // Generate IDs for ARIA relationships
    const id = `tab-${this.value}-${crypto.randomUUID().slice(0, 8)}`;
    this.id = id;
    this.contentId = `panel-${this.value}-${crypto.randomUUID().slice(0, 8)}`;

    // Handle click
    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeyDown);
    this.addEventListener("focus", this.handleFocus);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeyDown);
    this.removeEventListener("focus", this.handleFocus);
  }

  /**
   * Set the selected state (called by parent).
   */
  public setSelected(selected: boolean): void {
    this.selected = selected;
    this.updateAccessibility();
  }

  /**
   * Get the content panel ID.
   */
  public getContentId(): string {
    return this.contentId;
  }

  private handleClick = (): void => {
    if (this.disabled) return;
    this.activate();
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.activate();
    }
  };

  private handleFocus = (): void => {
    if (this.disabled) return;

    const tabsRoot = this.closest("ds-tabs") as DsTabs | null;
    const activationMode: TabsActivationMode = tabsRoot?.activationMode ?? "automatic";

    // In automatic mode, focus activates the tab
    if (activationMode === "automatic") {
      this.activate();
    }
  };

  private activate(): void {
    emitEvent(this, "ds:tab-activate", {
      detail: { value: this.value },
      bubbles: true,
    });
  }

  private updateAccessibility(): void {
    this.setAttribute("aria-selected", String(this.selected));
    this.setAttribute("tabindex", this.selected ? "0" : "-1");
    this.setAttribute("aria-controls", this.contentId);

    if (this.disabled) {
      this.setAttribute("aria-disabled", "true");
    } else {
      this.removeAttribute("aria-disabled");
    }
  }

  override updated(): void {
    this.updateAccessibility();
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
