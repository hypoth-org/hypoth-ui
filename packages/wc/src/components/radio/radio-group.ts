import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";
import { createRovingFocus, type RovingFocus } from "@ds/primitives-dom";
import type { DsRadio } from "./radio.js";

// Import radio component
import "./radio.js";

export type RadioOrientation = "horizontal" | "vertical";

/**
 * Container for radio button group with roving tabindex.
 *
 * @element ds-radio-group
 * @fires ds:change - Fired when selection changes with { value }
 *
 * @slot - ds-radio children
 *
 * @example
 * ```html
 * <ds-field>
 *   <ds-label>Size</ds-label>
 *   <ds-radio-group name="size">
 *     <ds-radio value="sm">Small</ds-radio>
 *     <ds-radio value="md">Medium</ds-radio>
 *     <ds-radio value="lg">Large</ds-radio>
 *   </ds-radio-group>
 * </ds-field>
 * ```
 */
export class DsRadioGroup extends DSElement {
  /** Form field name */
  @property({ type: String, reflect: true })
  name = "";

  /** Currently selected value */
  @property({ type: String })
  value = "";

  /** Layout and navigation axis */
  @property({ type: String, reflect: true })
  orientation: RadioOrientation = "vertical";

  /** Disabled state for all radios */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  private rovingFocus: RovingFocus | null = null;
  private childObserver: MutationObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // Set role on the group
    this.setAttribute("role", "radiogroup");

    // Observe child changes
    this.childObserver = new MutationObserver(() => {
      this.setupRadios();
    });
    this.childObserver.observe(this, { childList: true, subtree: true });

    // Listen for radio selection events
    this.addEventListener("ds:radio-select", this.handleRadioSelect as EventListener);

    // Setup after first render
    this.updateComplete.then(() => {
      this.setupRadios();
      this.setupRovingFocus();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.childObserver?.disconnect();
    this.childObserver = null;
    this.rovingFocus?.destroy();
    this.rovingFocus = null;
    this.removeEventListener("ds:radio-select", this.handleRadioSelect as EventListener);
  }

  /**
   * Sets up the radio items with correct checked state and disabled state.
   */
  private setupRadios(): void {
    const radios = this.getRadioItems();

    radios.forEach((radio) => {
      // Set checked state based on group value
      radio.setChecked(radio.value === this.value);

      // Propagate disabled state from group
      if (this.disabled) {
        radio.disabled = true;
      }
    });

    // Update roving focus tabindex
    this.updateTabIndices();
  }

  /**
   * Updates tabindex values for roving focus.
   */
  private updateTabIndices(): void {
    const radios = this.getRadioItems();
    const selectedIndex = radios.findIndex((r) => r.value === this.value);
    const focusIndex = selectedIndex >= 0 ? selectedIndex : 0;

    radios.forEach((radio, index) => {
      radio.setTabIndex(index === focusIndex ? 0 : -1);
    });
  }

  /**
   * Sets up roving focus for keyboard navigation.
   */
  private setupRovingFocus(): void {
    this.rovingFocus?.destroy();

    const direction = this.orientation === "horizontal" ? "horizontal" : "vertical";

    this.rovingFocus = createRovingFocus({
      container: this,
      selector: "[role='radio']",
      direction,
      loop: true,
      skipDisabled: true,
      onFocus: (element, _index) => {
        // Find the parent ds-radio and select it (selection follows focus)
        const radio = element.closest("ds-radio") as DsRadio | null;
        if (radio && !radio.disabled && !this.disabled) {
          this.selectValue(radio.value);
        }
      },
    });
  }

  /**
   * Gets all radio items in the group.
   */
  private getRadioItems(): DsRadio[] {
    return Array.from(this.querySelectorAll("ds-radio")) as DsRadio[];
  }

  /**
   * Handles radio selection from click or keyboard.
   */
  private handleRadioSelect = (event: CustomEvent<{ value: string }>): void => {
    if (this.disabled) return;

    const { value } = event.detail;
    this.selectValue(value);
  };

  /**
   * Selects a value and updates state.
   */
  private selectValue(value: string): void {
    if (value === this.value) return;

    this.value = value;
    this.setupRadios();

    emitEvent(this, StandardEvents.CHANGE, {
      detail: { value: this.value },
    });
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has("value")) {
      this.setupRadios();
    }

    if (changedProperties.has("orientation")) {
      this.setupRovingFocus();
    }

    if (changedProperties.has("disabled")) {
      this.setupRadios();
    }
  }

  override render() {
    return html`
      <div
        class="ds-radio-group"
        part="container"
        data-orientation=${this.orientation}
      >
        <slot></slot>
      </div>
    `;
  }
}

define("ds-radio-group", DsRadioGroup);

declare global {
  interface HTMLElementTagNameMap {
    "ds-radio-group": DsRadioGroup;
  }
}
