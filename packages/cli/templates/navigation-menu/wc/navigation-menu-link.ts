/**
 * NavigationMenuLink component - navigation link.
 *
 * @element ds-navigation-menu-link
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

export class DsNavigationMenuLink extends DSElement {
  /** URL to navigate to */
  @property({ type: String, reflect: true })
  href = "";

  /** Whether this link is currently active */
  @property({ type: Boolean, reflect: true })
  active = false;

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("role", "menuitem");
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
    if (this.disabled) return;

    // Emit navigate event for SPA handling
    const navigateEvent = emitEvent(this, "ds:navigate", {
      detail: { href: this.href },
      bubbles: true,
      cancelable: true,
    });

    // If not canceled and has href, do native navigation
    if (!navigateEvent.defaultPrevented && this.href) {
      // Allow Ctrl/Cmd+click for new tab
      if (event.ctrlKey || event.metaKey) {
        window.open(this.href, "_blank");
      } else {
        window.location.href = this.href;
      }
    }
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleClick(new MouseEvent("click"));
    }
  };

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("active")) {
      this.setAttribute("aria-current", this.active ? "page" : "false");
    }
    if (changedProperties.has("disabled")) {
      this.setAttribute("aria-disabled", String(this.disabled));
      this.setAttribute("tabindex", this.disabled ? "-1" : "0");
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-navigation-menu-link", DsNavigationMenuLink);

declare global {
  interface HTMLElementTagNameMap {
    "ds-navigation-menu-link": DsNavigationMenuLink;
  }
}
