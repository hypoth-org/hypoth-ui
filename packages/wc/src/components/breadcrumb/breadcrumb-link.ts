/**
 * BreadcrumbLink component - navigable breadcrumb link.
 *
 * @element ds-breadcrumb-link
 *
 * @slot - Link content
 *
 * @fires ds:navigate - Fired when link is clicked (for SPA navigation)
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsBreadcrumbLink extends DSElement {
  /** URL to navigate to */
  @property({ type: String, reflect: true })
  href = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("tabindex", "0");

    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeyDown);
  }

  private handleClick = (event: MouseEvent): void => {
    const navigateEvent = emitEvent(this, "ds:navigate", {
      detail: { href: this.href },
      bubbles: true,
      cancelable: true,
    });

    if (!navigateEvent.defaultPrevented && this.href) {
      if (event.ctrlKey || event.metaKey) {
        window.open(this.href, "_blank");
      } else {
        window.location.href = this.href;
      }
    }
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      this.handleClick(new MouseEvent("click"));
    }
  };

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-breadcrumb-link", DsBreadcrumbLink);

declare global {
  interface HTMLElementTagNameMap {
    "ds-breadcrumb-link": DsBreadcrumbLink;
  }
}
