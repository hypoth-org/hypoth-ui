import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Select trigger button with combobox role.
 *
 * @element ds-select-trigger
 *
 * @slot - Trigger content (button, etc.)
 *
 * @example
 * ```html
 * <ds-select>
 *   <ds-select-trigger>
 *     <button>Select fruit</button>
 *   </ds-select-trigger>
 *   <ds-select-content>...</ds-select-content>
 * </ds-select>
 * ```
 */
export class DsSelectTrigger extends DSElement {
  /** Whether the parent select is disabled */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();

    // Setup ARIA on first slotted element after render
    this.updateComplete.then(() => {
      this.setupTriggerAccessibility();
    });
  }

  private setupTriggerAccessibility(): void {
    const trigger = this.querySelector("button, [role='button']") as HTMLElement | null;
    if (trigger) {
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");
      if (this.disabled) {
        trigger.setAttribute("aria-disabled", "true");
      }
    }
  }

  /**
   * Updates ARIA attributes on the trigger element.
   */
  public updateAria(expanded: boolean, activeDescendantId?: string, controlsId?: string): void {
    const trigger = this.querySelector("button, [role='button']") as HTMLElement | null;
    if (trigger) {
      trigger.setAttribute("aria-expanded", String(expanded));
      if (controlsId) {
        trigger.setAttribute("aria-controls", controlsId);
      }
      if (expanded && activeDescendantId) {
        trigger.setAttribute("aria-activedescendant", activeDescendantId);
      } else {
        trigger.removeAttribute("aria-activedescendant");
      }
    }
  }

  /**
   * Gets the actual trigger button element.
   */
  public getTriggerElement(): HTMLElement | null {
    return this.querySelector("button, [role='button']");
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has("disabled")) {
      const trigger = this.querySelector("button, [role='button']") as HTMLElement | null;
      if (trigger) {
        if (this.disabled) {
          trigger.setAttribute("aria-disabled", "true");
          trigger.setAttribute("disabled", "");
        } else {
          trigger.removeAttribute("aria-disabled");
          trigger.removeAttribute("disabled");
        }
      }
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-select-trigger", DsSelectTrigger);

declare global {
  interface HTMLElementTagNameMap {
    "ds-select-trigger": DsSelectTrigger;
  }
}
