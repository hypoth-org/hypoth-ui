/**
 * Collapsible Content component - content section that expands/collapses.
 *
 * @element ds-collapsible-content
 *
 * @slot - Content to show/hide
 */

import { type Presence, createPresence, prefersReducedMotion } from "@ds/primitives-dom";
import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsCollapsibleContent extends DSElement {
  /** Keep mounted when collapsed (for animations) */
  @property({ type: Boolean, attribute: "force-mount" })
  forceMount = false;

  /** Current state for animations */
  @state()
  dataState: "open" | "closed" = "closed";

  /** Whether we're currently animating out */
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

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("dataState")) {
      this.handleStateChange();
    }
  }

  private handleStateChange(): void {
    this.setAttribute("data-state", this.dataState);

    if (this.dataState === "open") {
      this.isAnimatingOut = false;
      this.updateVisibility();
    } else if (!this.forceMount && !prefersReducedMotion()) {
      // Animate out before hiding
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

    // Stay visible during exit animation
    if (this.isAnimatingOut) {
      this.hidden = false;
      return;
    }

    this.hidden = this.dataState === "closed";
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-collapsible-content", DsCollapsibleContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-collapsible-content": DsCollapsibleContent;
  }
}
