/**
 * StepperTitle component - step title text.
 *
 * @element ds-stepper-title
 *
 * @slot - Title text
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsStepperTitle extends DSElement {
  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-stepper-title", DsStepperTitle);

declare global {
  interface HTMLElementTagNameMap {
    "ds-stepper-title": DsStepperTitle;
  }
}
