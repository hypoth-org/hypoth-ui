/**
 * Accordion Trigger component - button that toggles accordion item.
 *
 * @element ds-accordion-trigger
 *
 * @slot - Trigger label content
 */

import { html } from "lit";
import { state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";
import type { DsAccordionItem } from "./accordion-item.js";

export class DsAccordionTrigger extends DSElement {
  /** Internal expanded state */
  @state()
  private expanded = false;

  /** Content panel ID */
  @state()
  private contentId = "";

  override connectedCallback(): void {
    super.connectedCallback();

    // Set ARIA role and attributes
    this.setAttribute("role", "button");
    this.setAttribute("tabindex", "0");

    // Handle click and keyboard
    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeyDown);
  }

  /**
   * Set the expanded state (called by parent).
   */
  public setExpanded(expanded: boolean): void {
    this.expanded = expanded;
    this.updateAccessibility();
  }

  /**
   * Set the content ID for aria-controls.
   */
  public setContentId(id: string): void {
    this.contentId = id;
    this.updateAccessibility();
  }

  private handleClick = (): void => {
    if (this.hasAttribute("aria-disabled")) return;
    this.toggle();
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.hasAttribute("aria-disabled")) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.toggle();
    }
  };

  private toggle(): void {
    const item = this.closest("ds-accordion-item") as DsAccordionItem | null;
    if (!item) return;

    emitEvent(this, "ds:accordion-toggle", {
      detail: { value: item.value },
      bubbles: true,
    });
  }

  private updateAccessibility(): void {
    this.setAttribute("aria-expanded", String(this.expanded));
    if (this.contentId) {
      this.setAttribute("aria-controls", this.contentId);
    }
  }

  override updated(): void {
    this.updateAccessibility();
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-accordion-trigger", DsAccordionTrigger);

declare global {
  interface HTMLElementTagNameMap {
    "ds-accordion-trigger": DsAccordionTrigger;
  }
}
