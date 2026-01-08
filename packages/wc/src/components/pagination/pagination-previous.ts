/**
 * PaginationPrevious component - go to previous page button.
 *
 * @element ds-pagination-previous
 *
 * @slot - Button content (defaults to "Previous")
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsPaginationPrevious extends DSElement {
  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "button");
    this.setAttribute("tabindex", "0");
    this.setAttribute("aria-label", "Go to previous page");

    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeyDown);
  }

  private handleClick = (): void => {
    if (this.disabled) return;

    const pagination = this.closest("ds-pagination") as HTMLElement & { previousPage: () => void } | null;
    pagination?.previousPage();
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleClick();
    }
  };

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("disabled")) {
      this.setAttribute("aria-disabled", String(this.disabled));
      this.setAttribute("tabindex", this.disabled ? "-1" : "0");
    }
  }

  override render() {
    return html`<slot>Previous</slot>`;
  }
}

define("ds-pagination-previous", DsPaginationPrevious);

declare global {
  interface HTMLElementTagNameMap {
    "ds-pagination-previous": DsPaginationPrevious;
  }
}
