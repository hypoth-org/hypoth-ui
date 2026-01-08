/**
 * Collapsible component - toggleable content visibility.
 *
 * Provides an expandable/collapsible content section with animation support.
 *
 * @element ds-collapsible
 *
 * @slot trigger - Button or element that toggles the collapsible
 * @slot - Collapsible content (ds-collapsible-content)
 *
 * @fires ds:open - Fired when collapsible opens
 * @fires ds:close - Fired when collapsible closes
 *
 * @example
 * ```html
 * <ds-collapsible>
 *   <button slot="trigger">Toggle Content</button>
 *   <ds-collapsible-content>
 *     <p>Collapsible content here.</p>
 *   </ds-collapsible-content>
 * </ds-collapsible>
 * ```
 */

import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

// Import child components
import type { DsCollapsibleContent } from "./collapsible-content.js";
import "./collapsible-content.js";
import "./collapsible-trigger.js";

export class DsCollapsible extends DSElement {
  /** Whether the collapsible is open */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Disable the collapsible */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Internal ID for ARIA relationships */
  @state()
  private contentId = `collapsible-${crypto.randomUUID().slice(0, 8)}`;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.handleTriggerClick);
    this.addEventListener("keydown", this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleTriggerClick);
    this.removeEventListener("keydown", this.handleKeyDown);
  }

  /**
   * Toggle the open state.
   */
  public toggle(): void {
    if (this.disabled) return;
    this.setOpen(!this.open);
  }

  /**
   * Set the open state.
   */
  public setOpen(open: boolean): void {
    if (this.disabled || this.open === open) return;

    this.open = open;
    emitEvent(this, open ? StandardEvents.OPEN : StandardEvents.CLOSE);
    this.updateContent();
  }

  private handleTriggerClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"], ds-collapsible-trigger');

    if (trigger && this.contains(trigger)) {
      this.toggle();
    }
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"], ds-collapsible-trigger');

    if (trigger && this.contains(trigger)) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.toggle();
      }
    }
  };

  override updated(): void {
    this.updateContent();
    this.updateTrigger();
  }

  private updateContent(): void {
    const content = this.querySelector("ds-collapsible-content") as DsCollapsibleContent | null;
    if (content) {
      content.id = this.contentId;
      content.dataState = this.open ? "open" : "closed";
    }
  }

  private updateTrigger(): void {
    const trigger =
      this.querySelector('[slot="trigger"]') || this.querySelector("ds-collapsible-trigger");

    if (trigger) {
      trigger.setAttribute("aria-expanded", String(this.open));
      trigger.setAttribute("aria-controls", this.contentId);
      if (this.disabled) {
        trigger.setAttribute("aria-disabled", "true");
      } else {
        trigger.removeAttribute("aria-disabled");
      }
    }
  }

  override render() {
    return html`
      <slot name="trigger"></slot>
      <slot></slot>
    `;
  }
}

define("ds-collapsible", DsCollapsible);

declare global {
  interface HTMLElementTagNameMap {
    "ds-collapsible": DsCollapsible;
  }
}
