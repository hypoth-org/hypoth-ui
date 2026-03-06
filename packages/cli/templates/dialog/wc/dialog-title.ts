import { html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Dialog title component.
 *
 * Renders the dialog's accessible title. The parent ds-dialog
 * automatically connects this to the dialog content via aria-labelledby.
 *
 * @element ds-dialog-title
 *
 * @csspart title - The title element
 *
 * @example
 * ```html
 * <ds-dialog-title>Confirm Deletion</ds-dialog-title>
 * ```
 */
export class DsDialogTitle extends DSElement {
  /** Preserved text content from initial children */
  @state()
  private titleText = "";

  override connectedCallback(): void {
    // Capture original text content before Lit renders
    this.titleText = this.textContent?.trim() ?? "";

    super.connectedCallback();

    // Generate ID if not provided
    if (!this.id) {
      this.id = `dialog-title-${crypto.randomUUID().slice(0, 8)}`;
    }
  }

  override render() {
    // Only render h2 if there's content (avoid empty heading a11y violation)
    if (!this.titleText) {
      return nothing;
    }

    return html`
      <h2 class="ds-dialog-title" part="title">${this.titleText}</h2>
    `;
  }
}

define("ds-dialog-title", DsDialogTitle);

declare global {
  interface HTMLElementTagNameMap {
    "ds-dialog-title": DsDialogTitle;
  }
}
