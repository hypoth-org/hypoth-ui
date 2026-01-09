/**
 * NavigationMenuTrigger component - button that opens content panel.
 *
 * @element ds-navigation-menu-trigger
 *
 * @slot - Trigger content
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsNavigationMenuTrigger extends DSElement {
  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  private observer: MutationObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("role", "menuitem");
    this.setAttribute("tabindex", "0");
    this.setAttribute("aria-haspopup", "menu");
    this.updateAriaExpanded();

    // Observe parent item's data-state changes to update aria-expanded
    const item = this.closest("ds-navigation-menu-item");
    if (item) {
      this.observer = new MutationObserver(() => {
        this.updateAriaExpanded();
      });
      this.observer.observe(item, { attributes: true, attributeFilter: ["data-state"] });
    }

    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeyDown);
    this.observer?.disconnect();
    this.observer = null;
  }

  /**
   * Update aria-expanded based on parent item's state.
   * Per APG, menuitem with submenu should have aria-expanded.
   */
  private updateAriaExpanded(): void {
    const item = this.closest("ds-navigation-menu-item");
    const isOpen = item?.getAttribute("data-state") === "open";
    this.setAttribute("aria-expanded", String(isOpen));
  }

  private getItemValue(): string {
    const item = this.closest("ds-navigation-menu-item");
    return item?.getAttribute("value") || "";
  }

  private handleClick = (): void => {
    if (this.disabled) return;

    const value = this.getItemValue();
    emitEvent(this, "ds:navigation-trigger", {
      detail: { value, type: "click" },
      bubbles: true,
    });
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleClick();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const value = this.getItemValue();
      emitEvent(this, "ds:navigation-trigger", {
        detail: { value, type: "focus" },
        bubbles: true,
      });
    }
  };

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("disabled")) {
      this.setAttribute("aria-disabled", String(this.disabled));
      this.setAttribute("tabindex", this.disabled ? "-1" : "0");
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-navigation-menu-trigger", DsNavigationMenuTrigger);

declare global {
  interface HTMLElementTagNameMap {
    "ds-navigation-menu-trigger": DsNavigationMenuTrigger;
  }
}
