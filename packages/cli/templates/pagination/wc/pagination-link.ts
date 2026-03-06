/**
 * PaginationLink component - page number link.
 *
 * @element ds-pagination-link
 *
 * @slot - Page number content
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsPaginationLink extends DSElement {
  /** Page number */
  @property({ type: Number, reflect: true })
  page = 1;

  /** Whether this is the current page */
  @property({ type: Boolean, reflect: true })
  active = false;

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

  private handleClick = (): void => {
    if (this.active) return;

    emitEvent(this, "ds:page-select", {
      detail: { page: this.page },
      bubbles: true,
    });
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleClick();
    }
  };

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("active")) {
      if (this.active) {
        this.setAttribute("aria-current", "page");
      } else {
        this.removeAttribute("aria-current");
      }
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-pagination-link", DsPaginationLink);

declare global {
  interface HTMLElementTagNameMap {
    "ds-pagination-link": DsPaginationLink;
  }
}
