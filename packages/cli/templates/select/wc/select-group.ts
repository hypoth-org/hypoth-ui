import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Select option group for organizing options into labeled sections.
 *
 * @element ds-select-group
 *
 * @slot - Group content (ds-select-label and ds-select-option children)
 *
 * @example
 * ```html
 * <ds-select-group>
 *   <ds-select-label>Fruits</ds-select-label>
 *   <ds-select-option value="apple">Apple</ds-select-option>
 *   <ds-select-option value="banana">Banana</ds-select-option>
 * </ds-select-group>
 * ```
 */
export class DsSelectGroup extends DSElement {
  /** Optional label for the group (alternative to ds-select-label slot) */
  @property({ type: String })
  label = "";

  override connectedCallback(): void {
    super.connectedCallback();

    // Set ARIA role
    this.setAttribute("role", "group");

    // Generate ID if not set
    if (!this.id) {
      this.id = `select-group-${crypto.randomUUID().slice(0, 8)}`;
    }

    // Setup aria-labelledby after first render
    this.updateComplete.then(() => {
      this.setupAriaLabelledBy();
    });
  }

  private setupAriaLabelledBy(): void {
    // Find the label element inside the group
    const labelElement = this.querySelector("ds-select-label");
    if (labelElement) {
      // Ensure label has an ID
      if (!labelElement.id) {
        labelElement.id = `${this.id}-label`;
      }
      this.setAttribute("aria-labelledby", labelElement.id);
    } else if (this.label) {
      // Use the label property if no ds-select-label element
      this.setAttribute("aria-label", this.label);
    }
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has("label")) {
      if (this.label && !this.querySelector("ds-select-label")) {
        this.setAttribute("aria-label", this.label);
      }
    }
  }

  override render() {
    // Render slot directly without wrapper to avoid aria-required-children violation
    // The host element already has role="group" set in connectedCallback
    return html`<slot></slot>`;
  }
}

define("ds-select-group", DsSelectGroup);

declare global {
  interface HTMLElementTagNameMap {
    "ds-select-group": DsSelectGroup;
  }
}
