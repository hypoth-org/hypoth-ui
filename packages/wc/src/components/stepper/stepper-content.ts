/**
 * StepperContent component - step panel content.
 *
 * @element ds-stepper-content
 *
 * @slot - Step content
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsStepperContent extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "tabpanel");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-stepper-content", DsStepperContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-stepper-content": DsStepperContent;
  }
}
