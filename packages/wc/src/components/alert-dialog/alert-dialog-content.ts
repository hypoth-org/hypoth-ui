/**
 * AlertDialogContent component - container for alert dialog content.
 *
 * @element ds-alert-dialog-content
 *
 * @slot - Alert dialog content (header, body, footer)
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type AlertDialogContentSize = "sm" | "md" | "lg" | "xl" | "full";

export class DsAlertDialogContent extends DSElement {
  /** Size of the alert dialog content */
  @property({ reflect: true })
  size: AlertDialogContentSize = "md";

  /** Data state for animations */
  @property({ attribute: "data-state", reflect: true })
  dataState: "open" | "closed" = "closed";

  override connectedCallback(): void {
    super.connectedCallback();

    // ARIA attributes are set by parent DsAlertDialog
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-alert-dialog-content", DsAlertDialogContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-alert-dialog-content": DsAlertDialogContent;
  }
}
