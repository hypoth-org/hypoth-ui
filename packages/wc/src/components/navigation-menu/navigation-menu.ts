/**
 * NavigationMenu component - mega-menu style navigation.
 *
 * Provides a horizontal navigation bar with dropdown content panels
 * that transition smoothly between items.
 *
 * @element ds-navigation-menu
 *
 * @slot - Navigation menu content (ds-navigation-menu-list)
 *
 * @fires ds:value-change - Fired when active menu item changes
 *
 * @example
 * ```html
 * <ds-navigation-menu>
 *   <ds-navigation-menu-list>
 *     <ds-navigation-menu-item>
 *       <ds-navigation-menu-trigger>Products</ds-navigation-menu-trigger>
 *       <ds-navigation-menu-content>
 *         <ds-navigation-menu-link href="/products/a">Product A</ds-navigation-menu-link>
 *       </ds-navigation-menu-content>
 *     </ds-navigation-menu-item>
 *   </ds-navigation-menu-list>
 *   <ds-navigation-menu-viewport></ds-navigation-menu-viewport>
 * </ds-navigation-menu>
 * ```
 */

import {
  type DismissableLayer,
  type RovingFocus,
  createDismissableLayer,
  createRovingFocus,
} from "@ds/primitives-dom";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

// Import child components to ensure they're registered
import "./navigation-menu-list.js";
import "./navigation-menu-item.js";
import "./navigation-menu-trigger.js";
import "./navigation-menu-content.js";
import "./navigation-menu-link.js";
import "./navigation-menu-indicator.js";
import "./navigation-menu-viewport.js";

export class DsNavigationMenu extends DSElement {
  /** Currently active item value */
  @property({ type: String, reflect: true })
  value = "";

  /** Delay in ms before opening on hover */
  @property({ type: Number, attribute: "delay-duration" })
  delayDuration = 200;

  /** Delay in ms before closing when pointer leaves */
  @property({ type: Number, attribute: "skip-delay-duration" })
  skipDelayDuration = 300;

  /** Orientation (horizontal or vertical) */
  @property({ type: String, reflect: true })
  orientation: "horizontal" | "vertical" = "horizontal";

  private rovingFocus: RovingFocus | null = null;
  private dismissLayer: DismissableLayer | null = null;
  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private previousValue = "";

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("role", "navigation");
    this.setAttribute("aria-label", "Main");

    // Listen for trigger interactions
    this.addEventListener("ds:navigation-trigger", this.handleTriggerInteraction as EventListener);
    this.addEventListener("ds:navigation-item-enter", this.handleItemEnter as EventListener);
    this.addEventListener("ds:navigation-item-leave", this.handleItemLeave as EventListener);

    this.updateComplete.then(() => {
      this.setupRovingFocus();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener(
      "ds:navigation-trigger",
      this.handleTriggerInteraction as EventListener
    );
    this.removeEventListener("ds:navigation-item-enter", this.handleItemEnter as EventListener);
    this.removeEventListener("ds:navigation-item-leave", this.handleItemLeave as EventListener);
    this.cleanup();
  }

  /**
   * Opens a navigation item by value.
   */
  public open(itemValue: string): void {
    if (this.value === itemValue) return;

    this.clearTimers();
    this.previousValue = this.value;
    this.value = itemValue;
    this.updateActiveItem();
    this.setupDismissLayer();

    emitEvent(this, "ds:value-change", {
      detail: { value: this.value },
      bubbles: true,
    });
  }

  /**
   * Closes the navigation menu.
   */
  public close(): void {
    if (!this.value) return;

    this.clearTimers();
    this.previousValue = this.value;
    this.value = "";
    this.updateActiveItem();
    this.dismissLayer?.deactivate();
    this.dismissLayer = null;

    emitEvent(this, "ds:value-change", {
      detail: { value: "" },
      bubbles: true,
    });
  }

  private clearTimers(): void {
    if (this.openTimer) {
      clearTimeout(this.openTimer);
      this.openTimer = null;
    }
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  private handleTriggerInteraction = (
    event: CustomEvent<{ value: string; type: "click" | "focus" }>
  ): void => {
    const { value } = event.detail;

    if (this.value === value) {
      // Toggle off if clicking same item
      this.close();
    } else {
      this.open(value);
    }
  };

  private handleItemEnter = (event: CustomEvent<{ value: string }>): void => {
    const { value } = event.detail;
    this.clearTimers();

    // Use skip delay if switching between items
    const delay = this.value ? 0 : this.delayDuration;

    this.openTimer = setTimeout(() => {
      this.open(value);
    }, delay);
  };

  private handleItemLeave = (): void => {
    this.clearTimers();

    this.closeTimer = setTimeout(() => {
      this.close();
    }, this.skipDelayDuration);
  };

  private handleDismiss = (): void => {
    this.close();
  };

  private setupRovingFocus(): void {
    const list = this.querySelector("ds-navigation-menu-list");
    if (!list) return;

    this.rovingFocus = createRovingFocus({
      container: list as HTMLElement,
      selector: "ds-navigation-menu-trigger, ds-navigation-menu-link:not([disabled])",
      direction: this.orientation === "horizontal" ? "horizontal" : "vertical",
      loop: true,
      skipDisabled: true,
    });
  }

  private setupDismissLayer(): void {
    if (this.dismissLayer) {
      this.dismissLayer.deactivate();
    }

    const viewport = this.querySelector("ds-navigation-menu-viewport");
    if (!viewport) return;

    this.dismissLayer = createDismissableLayer({
      container: viewport as HTMLElement,
      excludeElements: [this],
      onDismiss: this.handleDismiss,
      closeOnEscape: true,
      closeOnOutsideClick: true,
    });
    this.dismissLayer.activate();
  }

  private updateActiveItem(): void {
    const items = this.querySelectorAll("ds-navigation-menu-item");
    for (const item of items) {
      const itemValue = item.getAttribute("value") || "";
      const isActive = itemValue === this.value;

      if (isActive) {
        item.setAttribute("data-state", "open");
      } else {
        item.setAttribute("data-state", "closed");
      }
    }

    // Update viewport
    const viewport = this.querySelector("ds-navigation-menu-viewport") as HTMLElement | null;
    if (viewport) {
      if (this.value) {
        viewport.removeAttribute("hidden");
        viewport.setAttribute("data-state", "open");
      } else {
        viewport.setAttribute("data-state", "closed");
        // Wait for animation before hiding
        setTimeout(() => {
          if (!this.value) {
            viewport.setAttribute("hidden", "");
          }
        }, 200);
      }
    }
  }

  private cleanup(): void {
    this.clearTimers();
    this.rovingFocus?.destroy();
    this.rovingFocus = null;
    this.dismissLayer?.deactivate();
    this.dismissLayer = null;
  }

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("value")) {
      this.updateActiveItem();
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-navigation-menu", DsNavigationMenu);

declare global {
  interface HTMLElementTagNameMap {
    "ds-navigation-menu": DsNavigationMenu;
  }
}
