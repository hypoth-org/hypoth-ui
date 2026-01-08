/**
 * StepperTrigger component - clickable step button.
 *
 * @element ds-stepper-trigger
 *
 * @slot - Indicator and title
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsStepperTrigger extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "button");
    this.setAttribute("tabindex", "0");

    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeyDown);
  }

  private getStep(): number {
    const item = this.closest("ds-stepper-item");
    return Number(item?.getAttribute("step")) || 1;
  }

  private isDisabled(): boolean {
    const item = this.closest("ds-stepper-item");
    return item?.hasAttribute("disabled") || false;
  }

  private handleClick = (): void => {
    if (this.isDisabled()) return;

    emitEvent(this, "ds:step-select", {
      detail: { step: this.getStep() },
      bubbles: true,
    });
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleClick();
    }
  };

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-stepper-trigger", DsStepperTrigger);

declare global {
  interface HTMLElementTagNameMap {
    "ds-stepper-trigger": DsStepperTrigger;
  }
}
