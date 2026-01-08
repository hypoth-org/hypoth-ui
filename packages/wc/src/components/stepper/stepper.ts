/**
 * Stepper component - step-by-step progress indicator.
 *
 * @element ds-stepper
 *
 * @slot - Stepper items
 *
 * @fires ds:step-change - Fired when active step changes
 *
 * @example
 * ```html
 * <ds-stepper value="2">
 *   <ds-stepper-item step="1" completed>
 *     <ds-stepper-trigger>
 *       <ds-stepper-indicator>1</ds-stepper-indicator>
 *       <ds-stepper-title>Account</ds-stepper-title>
 *     </ds-stepper-trigger>
 *   </ds-stepper-item>
 *   <ds-stepper-separator></ds-stepper-separator>
 *   <ds-stepper-item step="2">
 *     <ds-stepper-trigger>
 *       <ds-stepper-indicator>2</ds-stepper-indicator>
 *       <ds-stepper-title>Profile</ds-stepper-title>
 *     </ds-stepper-trigger>
 *   </ds-stepper-item>
 * </ds-stepper>
 * ```
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

// Import child components
import "./stepper-item.js";
import "./stepper-trigger.js";
import "./stepper-indicator.js";
import "./stepper-title.js";
import "./stepper-description.js";
import "./stepper-separator.js";
import "./stepper-content.js";

export type StepperOrientation = "horizontal" | "vertical";

export class DsStepper extends DSElement {
  /** Current step value */
  @property({ type: Number, reflect: true })
  value = 1;

  /** Orientation */
  @property({ type: String, reflect: true })
  orientation: StepperOrientation = "horizontal";

  /** Whether steps are linear (must complete in order) */
  @property({ type: Boolean })
  linear = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "list");
    this.setAttribute("aria-label", "Progress");

    this.addEventListener("ds:step-select", this.handleStepSelect as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("ds:step-select", this.handleStepSelect as EventListener);
  }

  /**
   * Go to a specific step.
   */
  public goToStep(step: number): void {
    if (this.linear) {
      // In linear mode, can only go to completed steps or next step
      const items = this.querySelectorAll("ds-stepper-item");
      let maxAllowed = 1;

      for (const item of items) {
        const itemStep = Number(item.getAttribute("step"));
        if (item.hasAttribute("completed") || itemStep === this.value) {
          maxAllowed = Math.max(maxAllowed, itemStep + 1);
        }
      }

      if (step > maxAllowed) return;
    }

    if (step !== this.value) {
      this.value = step;
      this.updateActiveState();

      emitEvent(this, "ds:step-change", {
        detail: { step: this.value },
        bubbles: true,
      });
    }
  }

  /**
   * Go to next step.
   */
  public nextStep(): void {
    this.goToStep(this.value + 1);
  }

  /**
   * Go to previous step.
   */
  public previousStep(): void {
    this.goToStep(this.value - 1);
  }

  private handleStepSelect = (event: CustomEvent<{ step: number }>): void => {
    event.stopPropagation();
    this.goToStep(event.detail.step);
  };

  private updateActiveState(): void {
    const items = this.querySelectorAll("ds-stepper-item");

    for (const item of items) {
      const step = Number(item.getAttribute("step"));

      if (step === this.value) {
        item.setAttribute("data-state", "active");
      } else if (step < this.value || item.hasAttribute("completed")) {
        item.setAttribute("data-state", "completed");
      } else {
        item.setAttribute("data-state", "pending");
      }
    }
  }

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("value")) {
      this.updateActiveState();
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-stepper", DsStepper);

declare global {
  interface HTMLElementTagNameMap {
    "ds-stepper": DsStepper;
  }
}
