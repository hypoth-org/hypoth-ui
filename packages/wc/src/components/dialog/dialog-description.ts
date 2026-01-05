import { html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Dialog description component.
 *
 * Renders the dialog's accessible description. The parent ds-dialog
 * automatically connects this to the dialog content via aria-describedby.
 *
 * @element ds-dialog-description
 *
 * @csspart description - The description element
 *
 * @example
 * ```html
 * <ds-dialog-description>
 *   This action cannot be undone.
 * </ds-dialog-description>
 * ```
 */
export class DsDialogDescription extends DSElement {
  /** Preserved text content from initial children */
  @state()
  private descriptionText = "";

  override connectedCallback(): void {
    // Capture original text content before Lit renders
    this.descriptionText = this.textContent?.trim() ?? "";

    super.connectedCallback();

    // Generate ID if not provided
    if (!this.id) {
      this.id = `dialog-desc-${crypto.randomUUID().slice(0, 8)}`;
    }
  }

  override render() {
    // Only render p if there's content
    if (!this.descriptionText) {
      return nothing;
    }

    return html`
      <p class="ds-dialog-description" part="description">${this.descriptionText}</p>
    `;
  }
}

define("ds-dialog-description", DsDialogDescription);

declare global {
  interface HTMLElementTagNameMap {
    "ds-dialog-description": DsDialogDescription;
  }
}
