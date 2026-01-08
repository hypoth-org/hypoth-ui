/**
 * Accordion Item component - container for trigger and content.
 *
 * @element ds-accordion-item
 *
 * @slot - Accordion trigger and content
 */

import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { DsAccordionContent } from "./accordion-content.js";
import type { DsAccordionTrigger } from "./accordion-trigger.js";

export class DsAccordionItem extends DSElement {
  /** Unique value identifying this item */
  @property({ reflect: true })
  value = "";

  /** Disable this item */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Internal expanded state */
  @state()
  private expanded = false;

  /** ID for ARIA relationships */
  private contentId = "";
  private triggerId = "";

  override connectedCallback(): void {
    super.connectedCallback();

    // Generate IDs
    const id = crypto.randomUUID().slice(0, 8);
    this.contentId = `accordion-content-${this.value}-${id}`;
    this.triggerId = `accordion-trigger-${this.value}-${id}`;

    this.setAttribute("data-state", "closed");
  }

  /**
   * Set the expanded state (called by parent).
   */
  public setExpanded(expanded: boolean): void {
    this.expanded = expanded;
    this.setAttribute("data-state", expanded ? "open" : "closed");
    this.updateChildren();
  }

  /**
   * Get whether the item is expanded.
   */
  public isExpanded(): boolean {
    return this.expanded;
  }

  /**
   * Get the content ID.
   */
  public getContentId(): string {
    return this.contentId;
  }

  /**
   * Get the trigger ID.
   */
  public getTriggerId(): string {
    return this.triggerId;
  }

  private updateChildren(): void {
    const trigger = this.querySelector("ds-accordion-trigger") as DsAccordionTrigger | null;
    const content = this.querySelector("ds-accordion-content") as DsAccordionContent | null;

    if (trigger) {
      trigger.id = this.triggerId;
      trigger.setExpanded(this.expanded);
      trigger.setContentId(this.contentId);
      if (this.disabled) {
        trigger.setAttribute("aria-disabled", "true");
      } else {
        trigger.removeAttribute("aria-disabled");
      }
    }

    if (content) {
      content.id = this.contentId;
      content.setExpanded(this.expanded);
      content.setTriggerId(this.triggerId);
    }
  }

  override updated(): void {
    this.updateChildren();
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-accordion-item", DsAccordionItem);

declare global {
  interface HTMLElementTagNameMap {
    "ds-accordion-item": DsAccordionItem;
  }
}
