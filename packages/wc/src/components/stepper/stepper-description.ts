/**
 * StepperDescription component - optional step description.
 *
 * @element ds-stepper-description
 *
 * @slot - Description text
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsStepperDescription extends DSElement {
  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-stepper-description", DsStepperDescription);

declare global {
  interface HTMLElementTagNameMap {
    "ds-stepper-description": DsStepperDescription;
  }
}
