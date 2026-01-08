/**
 * Sheet component - slide-in overlay panel from screen edge.
 *
 * Provides a modal overlay that slides in from any edge of the screen.
 * Follows WAI-ARIA Dialog (Modal) pattern.
 *
 * @element ds-sheet
 *
 * @slot trigger - Button or element that opens the sheet
 * @slot - Sheet content (ds-sheet-content)
 *
 * @fires ds:open - Fired when sheet opens
 * @fires ds:close - Fired when sheet closes
 *
 * @example
 * ```html
 * <ds-sheet>
 *   <button slot="trigger">Open Settings</button>
 *   <ds-sheet-content side="right">
 *     <ds-sheet-header>
 *       <ds-sheet-title>Settings</ds-sheet-title>
 *       <ds-sheet-description>Adjust your preferences</ds-sheet-description>
 *     </ds-sheet-header>
 *     <div>Settings content...</div>
 *     <ds-sheet-footer>
 *       <ds-sheet-close>Close</ds-sheet-close>
 *     </ds-sheet-footer>
 *   </ds-sheet-content>
 * </ds-sheet>
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
import type { DsSheetContent } from "./sheet-content.js";
import "./sheet-content.js";
import "./sheet-overlay.js";
import "./sheet-header.js";
import "./sheet-footer.js";
import "./sheet-title.js";
import "./sheet-description.js";
import "./sheet-close.js";

export class DsSheet extends DSElement {
  /** Whether the sheet is open */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Whether Escape key closes the sheet */
  @property({ type: Boolean, attribute: "close-on-escape" })
  closeOnEscape = true;

  /** Whether clicking the overlay closes the sheet */
  @property({ type: Boolean, attribute: "close-on-overlay" })
  closeOnOverlay = true;

  /** Whether to animate open/close transitions */
  @property({ type: Boolean })
  animated = true;

  /** Whether the sheet is closing (for animation) */
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
    this.addEventListener("ds:sheet-close", this.handleCloseRequest as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleTriggerClick);
    this.removeEventListener("ds:sheet-close", this.handleCloseRequest as EventListener);
    this.cleanup();
  }

  /**
   * Opens the sheet.
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
   * Closes the sheet.
   */
  public close(): void {
    if (!this.open) return;

    const content = this.querySelector("ds-sheet-content") as DsSheetContent | null;

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

  private handleDismiss = (reason: "escape" | "outside-click"): void => {
    if (reason === "escape" && this.closeOnEscape) {
      this.close();
    } else if (reason === "outside-click" && this.closeOnOverlay) {
      this.close();
    }
  };

  private setupFocusAndDismiss(): void {
    const content = this.querySelector("ds-sheet-content");
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
      const content = this.querySelector("ds-sheet-content") as DsSheetContent | null;

      if (this.open) {
        // Wait for the next microtask to ensure DOM is committed
        await this.updateComplete;

        // Set data-state to open for entry animation
        if (content) {
          content.dataState = "open";
        }

        // Setup focus and dismiss
        this.setupFocusAndDismiss();
        this.updateContentAccessibility();
      }
    }
  }

  /**
   * Updates accessibility attributes on sheet content.
   */
  private updateContentAccessibility(): void {
    const content = this.querySelector("ds-sheet-content");
    if (!content) return;

    // Set role on content
    content.setAttribute("role", "dialog");
    content.setAttribute("aria-modal", "true");

    // Connect title via aria-labelledby
    const title = this.querySelector("ds-sheet-title");
    if (title) {
      if (!title.id) {
        title.id = `sheet-title-${crypto.randomUUID().slice(0, 8)}`;
      }
      content.setAttribute("aria-labelledby", title.id);
    }

    // Connect description via aria-describedby
    const description = this.querySelector("ds-sheet-description");
    if (description) {
      if (!description.id) {
        description.id = `sheet-desc-${crypto.randomUUID().slice(0, 8)}`;
      }
      content.setAttribute("aria-describedby", description.id);
    }
  }

  override render() {
    return html`
      <slot name="trigger"></slot>
      <ds-sheet-overlay
        ?hidden=${!this.open}
        ?data-closing=${this.isClosing}
        @click=${this.closeOnOverlay ? this.handleCloseRequest : undefined}
      ></ds-sheet-overlay>
      <slot ?hidden=${!this.open}></slot>
    `;
  }
}

define("ds-sheet", DsSheet);

declare global {
  interface HTMLElementTagNameMap {
    "ds-sheet": DsSheet;
  }
}
