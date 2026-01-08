/**
 * Collapsible Trigger component - button that toggles collapsible.
 *
 * @element ds-collapsible-trigger
 *
 * @slot - Trigger content
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsCollapsibleTrigger extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();

    // Ensure focusability
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }

    // Set button role if not already set
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "button");
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-collapsible-trigger", DsCollapsibleTrigger);

declare global {
  interface HTMLElementTagNameMap {
    "ds-collapsible-trigger": DsCollapsibleTrigger;
  }
}
