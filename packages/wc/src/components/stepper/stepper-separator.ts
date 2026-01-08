/**
 * StepperSeparator component - line between steps.
 *
 * @element ds-stepper-separator
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsStepperSeparator extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "separator");
    this.setAttribute("aria-hidden", "true");
  }

  override render() {
    return html``;
  }
}

define("ds-stepper-separator", DsStepperSeparator);

declare global {
  interface HTMLElementTagNameMap {
    "ds-stepper-separator": DsStepperSeparator;
  }
}
