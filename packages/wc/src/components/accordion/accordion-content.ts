/**
 * Accordion Content component - expandable content section.
 *
 * @element ds-accordion-content
 *
 * @slot - Accordion content
 */

import { type Presence, createPresence, prefersReducedMotion } from "@ds/primitives-dom";
import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsAccordionContent extends DSElement {
  /** Keep mounted when collapsed (for animations) */
  @property({ type: Boolean, attribute: "force-mount" })
  forceMount = false;

  /** Internal expanded state */
  @state()
  private expanded = false;

  /** Trigger ID for aria-labelledby */
  @state()
  private triggerId = "";

  /** Whether we're animating out */
  @state()
  private isAnimatingOut = false;

  private presence: Presence | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "region");
    this.updateVisibility();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.presence?.destroy();
    this.presence = null;
  }

  /**
   * Set the expanded state (called by parent).
   */
  public setExpanded(expanded: boolean): void {
    const wasExpanded = this.expanded;
    this.expanded = expanded;
    this.setAttribute("data-state", expanded ? "open" : "closed");

    if (wasExpanded && !expanded) {
      // Collapsing - animate out
      this.handleCollapse();
    } else {
      this.isAnimatingOut = false;
      this.updateVisibility();
    }
  }

  /**
   * Set the trigger ID for aria-labelledby.
   */
  public setTriggerId(id: string): void {
    this.triggerId = id;
    this.setAttribute("aria-labelledby", id);
  }

  private handleCollapse(): void {
    if (!this.forceMount && !prefersReducedMotion()) {
      this.isAnimatingOut = true;

      this.presence?.destroy();
      this.presence = createPresence({
        onExitComplete: () => {
          this.isAnimatingOut = false;
          this.updateVisibility();
        },
      });
      this.presence.hide(this);
    } else {
      this.updateVisibility();
    }
  }

  private updateVisibility(): void {
    if (this.forceMount) {
      this.hidden = false;
      return;
    }

    if (this.isAnimatingOut) {
      this.hidden = false;
      return;
    }

    this.hidden = !this.expanded;
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-accordion-content", DsAccordionContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-accordion-content": DsAccordionContent;
  }
}
