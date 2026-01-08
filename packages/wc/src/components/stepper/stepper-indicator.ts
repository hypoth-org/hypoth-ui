/**
 * StepperIndicator component - visual step number/icon.
 *
 * @element ds-stepper-indicator
 *
 * @slot - Step number or icon
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsStepperIndicator extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("aria-hidden", "true");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-stepper-indicator", DsStepperIndicator);

declare global {
  interface HTMLElementTagNameMap {
    "ds-stepper-indicator": DsStepperIndicator;
  }
}
