/**
 * StepperItem component - individual step container.
 *
 * @element ds-stepper-item
 *
 * @slot - Trigger and content
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsStepperItem extends DSElement {
  /** Step number (1-indexed) */
  @property({ type: Number, reflect: true })
  step = 1;

  /** Whether this step is completed */
  @property({ type: Boolean, reflect: true })
  completed = false;

  /** Whether this step is disabled */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "listitem");
    this.setAttribute("data-state", "pending");
  }

  override updated(_changedProperties: Map<string, unknown>): void {
    // Update aria-current when state changes
    // Per APG, aria-current="step" indicates the current step in a process
    const state = this.getAttribute("data-state");
    if (state === "active") {
      this.setAttribute("aria-current", "step");
    } else {
      this.removeAttribute("aria-current");
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-stepper-item", DsStepperItem);

declare global {
  interface HTMLElementTagNameMap {
    "ds-stepper-item": DsStepperItem;
  }
}
