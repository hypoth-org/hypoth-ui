/**
 * Accordion component - collapsible sections for organizing content.
 *
 * Implements WAI-ARIA Accordion pattern with keyboard navigation.
 *
 * @element ds-accordion
 *
 * @slot - Accordion items (ds-accordion-item)
 *
 * @fires ds:change - Fired when expanded items change
 *
 * @example
 * ```html
 * <ds-accordion type="single" default-value="item-1" collapsible>
 *   <ds-accordion-item value="item-1">
 *     <ds-accordion-trigger>Section 1</ds-accordion-trigger>
 *     <ds-accordion-content>Content 1</ds-accordion-content>
 *   </ds-accordion-item>
 *   <ds-accordion-item value="item-2">
 *     <ds-accordion-trigger>Section 2</ds-accordion-trigger>
 *     <ds-accordion-content>Content 2</ds-accordion-content>
 *   </ds-accordion-item>
 * </ds-accordion>
 * ```
 */

import { createRovingFocus, type RovingFocus } from "@ds/primitives-dom";
import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

// Import child components
import type { DsAccordionItem } from "./accordion-item.js";
import "./accordion-item.js";
import "./accordion-trigger.js";
import "./accordion-content.js";

export type AccordionType = "single" | "multiple";
export type AccordionOrientation = "horizontal" | "vertical";

export class DsAccordion extends DSElement {
  /** Type: single (one open) or multiple (many open) */
  @property({ reflect: true })
  type: AccordionType = "single";

  /** Controlled value (string for single, JSON array for multiple) */
  @property()
  value: string | undefined;

  /** Default value (string for single, JSON array for multiple) */
  @property({ attribute: "default-value" })
  defaultValue: string | undefined;

  /** Allow collapsing all items in single mode */
  @property({ type: Boolean, reflect: true })
  collapsible = false;

  /** Keyboard navigation orientation */
  @property({ reflect: true })
  orientation: AccordionOrientation = "vertical";

  /** Internal tracked value(s) */
  @state()
  private internalValue: Set<string> = new Set();

  private rovingFocus: RovingFocus | null = null;

  /** Whether we're in controlled mode */
  private get isControlled(): boolean {
    return this.value !== undefined;
  }

  /** Current expanded values */
  get expandedValues(): Set<string> {
    if (this.isControlled) {
      return this.parseValue(this.value);
    }
    return this.internalValue;
  }

  private parseValue(value: string | undefined): Set<string> {
    if (!value) return new Set();

    // Try parsing as JSON array
    if (value.startsWith("[")) {
      try {
        const arr = JSON.parse(value);
        return new Set(Array.isArray(arr) ? arr : []);
      } catch {
        return new Set();
      }
    }

    // Single value
    return new Set([value]);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // Initialize internal value from default
    if (!this.isControlled && this.defaultValue) {
      this.internalValue = this.parseValue(this.defaultValue);
    }

    // Listen for item toggle events
    this.addEventListener("ds:accordion-toggle", this.handleItemToggle as EventListener);

    // Setup roving focus after DOM is ready
    requestAnimationFrame(() => {
      this.setupRovingFocus();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("ds:accordion-toggle", this.handleItemToggle as EventListener);
    this.rovingFocus?.destroy();
    this.rovingFocus = null;
  }

  private setupRovingFocus(): void {
    this.rovingFocus = createRovingFocus({
      container: this,
      selector: "ds-accordion-trigger:not([aria-disabled='true'])",
      direction: this.orientation,
      loop: true,
    });
  }

  /**
   * Toggle an item's expanded state.
   */
  public toggleItem(value: string): void {
    const items = this.querySelectorAll("ds-accordion-item") as NodeListOf<DsAccordionItem>;
    const item = Array.from(items).find((i) => i.value === value);
    if (!item || item.disabled) return;

    const currentExpanded = this.expandedValues;
    const isExpanded = currentExpanded.has(value);

    let newValue: Set<string>;

    if (this.type === "single") {
      if (isExpanded) {
        // Collapse if collapsible is true
        newValue = this.collapsible ? new Set() : currentExpanded;
      } else {
        // Expand this item (collapse others)
        newValue = new Set([value]);
      }
    } else {
      // Multiple mode
      newValue = new Set(currentExpanded);
      if (isExpanded) {
        newValue.delete(value);
      } else {
        newValue.add(value);
      }
    }

    // Update state
    if (!this.isControlled) {
      this.internalValue = newValue;
    }

    // Emit change event
    const eventValue =
      this.type === "single"
        ? Array.from(newValue)[0] ?? ""
        : JSON.stringify(Array.from(newValue));

    emitEvent(this, "ds:change", { detail: { value: eventValue } });
    this.updateItems();
  }

  private handleItemToggle = (event: CustomEvent<{ value: string }>): void => {
    this.toggleItem(event.detail.value);
  };

  override updated(changedProperties: Map<string, unknown>): void {
    if (
      changedProperties.has("value") ||
      changedProperties.has("internalValue") ||
      changedProperties.has("defaultValue")
    ) {
      this.updateItems();
    }
  }

  private updateItems(): void {
    const expanded = this.expandedValues;

    const items = this.querySelectorAll("ds-accordion-item") as NodeListOf<DsAccordionItem>;
    for (const item of items) {
      item.setExpanded(expanded.has(item.value));
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-accordion", DsAccordion);

declare global {
  interface HTMLElementTagNameMap {
    "ds-accordion": DsAccordion;
  }
}
