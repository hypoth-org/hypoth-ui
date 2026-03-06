/**
 * NavigationMenuItem component - wrapper for trigger and content.
 *
 * @element ds-navigation-menu-item
 *
 * @slot - Trigger and content
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsNavigationMenuItem extends DSElement {
  /** Unique value for this item */
  @property({ type: String, reflect: true })
  value = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "none");
    this.setAttribute("data-state", "closed");

    this.addEventListener("mouseenter", this.handleMouseEnter);
    this.addEventListener("mouseleave", this.handleMouseLeave);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("mouseenter", this.handleMouseEnter);
    this.removeEventListener("mouseleave", this.handleMouseLeave);
  }

  private handleMouseEnter = (): void => {
    emitEvent(this, "ds:navigation-item-enter", {
      detail: { value: this.value },
      bubbles: true,
    });
  };

  private handleMouseLeave = (): void => {
    emitEvent(this, "ds:navigation-item-leave", {
      detail: { value: this.value },
      bubbles: true,
    });
  };

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-navigation-menu-item", DsNavigationMenuItem);

declare global {
  interface HTMLElementTagNameMap {
    "ds-navigation-menu-item": DsNavigationMenuItem;
  }
}
