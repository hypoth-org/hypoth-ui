/**
 * Drawer component - mobile-optimized slide-in panel with swipe gestures.
 *
 * Drawer is a Sheet variant optimized for mobile with touch gesture support.
 * It slides in from the bottom by default and can be dismissed by swiping down.
 *
 * @element ds-drawer
 *
 * @slot trigger - Button or element that opens the drawer
 * @slot - Drawer content (ds-drawer-content)
 *
 * @fires ds:open - Fired when drawer opens
 * @fires ds:close - Fired when drawer closes
 *
 * @example
 * ```html
 * <ds-drawer>
 *   <button slot="trigger">Open Menu</button>
 *   <ds-drawer-content>
 *     <ds-drawer-header>
 *       <ds-drawer-title>Navigation</ds-drawer-title>
 *     </ds-drawer-header>
 *     <nav>Menu items...</nav>
 *   </ds-drawer-content>
 * </ds-drawer>
 * ```
 */

import {
  type DismissableLayer,
  type FocusTrap,
  type Presence,
  createDismissableLayer,
  createFocusTrap,
  createPresence,
  prefersReducedMotion,
} from "@ds/primitives-dom";
import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

// Import child components to ensure they're registered
import type { DsDrawerContent } from "./drawer-content.js";
import "./drawer-content.js";
import "./drawer-header.js";
import "./drawer-footer.js";
import "./drawer-title.js";
import "./drawer-description.js";

export type DrawerSide = "top" | "right" | "bottom" | "left";

export class DsDrawer extends DSElement {
  /** Whether the drawer is open */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Side of the screen the drawer appears from */
  @property({ reflect: true })
  side: DrawerSide = "bottom";

  /** Whether swipe-to-dismiss is enabled */
  @property({ type: Boolean, attribute: "swipe-dismiss" })
  swipeDismiss = true;

  /** Whether Escape key closes the drawer */
  @property({ type: Boolean, attribute: "close-on-escape" })
  closeOnEscape = true;

  /** Whether clicking the overlay closes the drawer */
  @property({ type: Boolean, attribute: "close-on-overlay" })
  closeOnOverlay = true;

  /** Whether to animate open/close transitions */
  @property({ type: Boolean })
  animated = true;

  /** Whether the drawer is closing (for animation) */
  @state()
  private isClosing = false;

  private focusTrap: FocusTrap | null = null;
  private dismissLayer: DismissableLayer | null = null;
  private presence: Presence | null = null;
  private triggerElement: HTMLElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // Listen for trigger clicks via event delegation
    this.addEventListener("click", this.handleTriggerClick);

    // Listen for close requests from child components
    this.addEventListener("ds:drawer-close", this.handleCloseRequest as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleTriggerClick);
    this.removeEventListener("ds:drawer-close", this.handleCloseRequest as EventListener);
    this.cleanup();
  }

  /**
   * Opens the drawer.
   */
  public show(): void {
    if (this.open) return;

    // Store trigger element for focus return
    const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;
    this.triggerElement =
      trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);

    this.open = true;
    emitEvent(this, StandardEvents.OPEN);
  }

  /**
   * Closes the drawer.
   */
  public close(): void {
    if (!this.open) return;

    const content = this.querySelector("ds-drawer-content") as DsDrawerContent | null;

    // If animated, use presence for exit animation
    if (this.animated && content && !prefersReducedMotion()) {
      this.isClosing = true;

      // Clean up focus trap and dismiss layer
      this.focusTrap?.deactivate();
      this.focusTrap = null;
      this.dismissLayer?.deactivate();
      this.dismissLayer = null;

      // Create presence for exit animation
      this.presence = createPresence({
        onExitComplete: () => {
          this.completeClose();
        },
      });
      this.presence.hide(content);
    } else {
      // No animation - close immediately
      this.cleanup();
      this.open = false;
      this.isClosing = false;
      emitEvent(this, StandardEvents.CLOSE);

      // Return focus to trigger
      this.triggerElement?.focus();
    }
  }

  /**
   * Completes the close after exit animation.
   */
  private completeClose(): void {
    this.cleanup();
    this.open = false;
    this.isClosing = false;
    emitEvent(this, StandardEvents.CLOSE);

    // Return focus to trigger
    this.triggerElement?.focus();
  }

  private handleTriggerClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"]');

    if (trigger && this.contains(trigger)) {
      // Store trigger before opening
      this.triggerElement = trigger as HTMLElement;
      this.show();
    }
  };

  private handleCloseRequest = (): void => {
    this.close();
  };

  private handleOverlayClick = (): void => {
    if (this.closeOnOverlay) {
      this.close();
    }
  };

  private handleDismiss = (reason: "escape" | "outside-click"): void => {
    if (reason === "escape" && this.closeOnEscape) {
      this.close();
    } else if (reason === "outside-click" && this.closeOnOverlay) {
      this.close();
    }
  };

  private setupFocusAndDismiss(): void {
    const content = this.querySelector("ds-drawer-content");
    if (!content) return;

    // Set up focus trap
    this.focusTrap = createFocusTrap({
      container: content as HTMLElement,
      returnFocus: false, // We handle this manually
    });
    this.focusTrap.activate();

    // Set up dismiss layer
    const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;
    this.dismissLayer = createDismissableLayer({
      container: content as HTMLElement,
      excludeElements: trigger ? [trigger] : [],
      onDismiss: this.handleDismiss,
      closeOnEscape: this.closeOnEscape,
      closeOnOutsideClick: this.closeOnOverlay,
    });
    this.dismissLayer.activate();
  }

  private cleanup(): void {
    this.focusTrap?.deactivate();
    this.focusTrap = null;
    this.dismissLayer?.deactivate();
    this.dismissLayer = null;
    this.presence?.destroy();
    this.presence = null;
  }

  override async updated(changedProperties: Map<string, unknown>): Promise<void> {
    super.updated(changedProperties);

    if (changedProperties.has("open")) {
      const content = this.querySelector("ds-drawer-content") as DsDrawerContent | null;

      if (this.open) {
        // Wait for the next microtask to ensure DOM is committed
        await this.updateComplete;

        // Set data-state to open for entry animation
        if (content) {
          content.dataState = "open";
          content.side = this.side;
        }

        // Setup focus and dismiss
        this.setupFocusAndDismiss();
        this.updateContentAccessibility();
      }
    }
  }

  /**
   * Updates accessibility attributes on drawer content.
   */
  private updateContentAccessibility(): void {
    const content = this.querySelector("ds-drawer-content");
    if (!content) return;

    // Set role on content
    content.setAttribute("role", "dialog");
    content.setAttribute("aria-modal", "true");

    // Connect title via aria-labelledby
    const title = this.querySelector("ds-drawer-title");
    if (title) {
      if (!title.id) {
        title.id = `drawer-title-${crypto.randomUUID().slice(0, 8)}`;
      }
      content.setAttribute("aria-labelledby", title.id);
    }

    // Connect description via aria-describedby
    const description = this.querySelector("ds-drawer-description");
    if (description) {
      if (!description.id) {
        description.id = `drawer-desc-${crypto.randomUUID().slice(0, 8)}`;
      }
      content.setAttribute("aria-describedby", description.id);
    }
  }

  override render() {
    return html`
      <slot name="trigger"></slot>
      <div
        class="ds-drawer__overlay"
        ?hidden=${!this.open}
        ?data-closing=${this.isClosing}
        @click=${this.handleOverlayClick}
      ></div>
      <slot ?hidden=${!this.open}></slot>
    `;
  }
}

define("ds-drawer", DsDrawer);

declare global {
  interface HTMLElementTagNameMap {
    "ds-drawer": DsDrawer;
  }
}
