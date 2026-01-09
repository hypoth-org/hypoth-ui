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
  type DialogBehavior,
  type Presence,
  createDialogBehavior,
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

  private dialogBehavior: DialogBehavior | null = null;
  private presence: Presence | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // Listen for trigger clicks via event delegation
    this.addEventListener("click", this.handleTriggerClick);

    // Listen for close requests from child components
    this.addEventListener("ds:sheet-close", this.handleCloseRequest as EventListener);

    // Initialize dialog behavior
    this.initDialogBehavior();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleTriggerClick);
    this.removeEventListener("ds:sheet-close", this.handleCloseRequest as EventListener);
    this.cleanup();
  }

  /**
   * Initializes the dialog behavior primitive.
   */
  private initDialogBehavior(): void {
    this.dialogBehavior = createDialogBehavior({
      defaultOpen: this.open,
      role: "dialog",
      closeOnEscape: this.closeOnEscape,
      closeOnOutsideClick: this.closeOnOverlay,
      onOpenChange: (open) => {
        // Sync state when behavior changes (e.g., from escape or outside click)
        if (!open && this.open) {
          this.handleBehaviorClose();
        }
      },
    });

    // Set trigger element if one exists
    const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;
    if (trigger) {
      this.dialogBehavior.setTriggerElement(trigger);
    }
  }

  /**
   * Handles close triggered by the behavior (escape/outside click).
   */
  private handleBehaviorClose(): void {
    const content = this.querySelector("ds-sheet-content") as DsSheetContent | null;

    // If animated, use presence for exit animation
    if (this.animated && content && !prefersReducedMotion()) {
      this.isClosing = true;

      // Create presence for exit animation
      this.presence = createPresence({
        onExitComplete: () => {
          this.completeClose();
        },
      });
      this.presence.hide(content);
    } else {
      // No animation - close immediately
      this.open = false;
      this.isClosing = false;
      emitEvent(this, StandardEvents.CLOSE);
    }
  }

  /**
   * Opens the sheet.
   */
  public show(): void {
    if (this.open) return;

    // Store trigger element for focus return
    const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;
    if (trigger) {
      this.dialogBehavior?.setTriggerElement(trigger);
    } else if (document.activeElement instanceof HTMLElement) {
      this.dialogBehavior?.setTriggerElement(document.activeElement);
    }

    this.open = true;
    this.dialogBehavior?.open();
    emitEvent(this, StandardEvents.OPEN);
  }

  /**
   * Closes the sheet.
   */
  public close(): void {
    if (!this.open) return;

    const content = this.querySelector("ds-sheet-content") as DsSheetContent | null;

    // Close the behavior (deactivates focus trap and dismiss layer)
    this.dialogBehavior?.close();

    // If animated, use presence for exit animation
    if (this.animated && content && !prefersReducedMotion()) {
      this.isClosing = true;

      // Create presence for exit animation
      this.presence = createPresence({
        onExitComplete: () => {
          this.completeClose();
        },
      });
      this.presence.hide(content);
    } else {
      // No animation - close immediately
      this.open = false;
      this.isClosing = false;
      emitEvent(this, StandardEvents.CLOSE);
    }
  }

  /**
   * Completes the close after exit animation.
   */
  private completeClose(): void {
    this.presence?.destroy();
    this.presence = null;
    this.open = false;
    this.isClosing = false;
    emitEvent(this, StandardEvents.CLOSE);
  }

  private handleTriggerClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"]');

    if (trigger && this.contains(trigger)) {
      // Store trigger before opening
      this.dialogBehavior?.setTriggerElement(trigger as HTMLElement);
      this.show();
    }
  };

  private handleCloseRequest = (): void => {
    this.close();
  };

  private cleanup(): void {
    this.dialogBehavior?.destroy();
    this.dialogBehavior = null;
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

        // Set content element on behavior (activates focus trap and dismiss layer)
        this.dialogBehavior?.setContentElement(content);
        this.updateContentAccessibility();
      } else {
        // Clear content element on behavior
        this.dialogBehavior?.setContentElement(null);
      }
    }

    // Sync behavior options when they change
    if (changedProperties.has("closeOnEscape") || changedProperties.has("closeOnOverlay")) {
      // Re-create behavior with new options
      const wasOpen = this.dialogBehavior?.state.open;
      this.dialogBehavior?.destroy();
      this.initDialogBehavior();
      if (wasOpen) {
        this.dialogBehavior?.open();
        const content = this.querySelector("ds-sheet-content") as HTMLElement | null;
        this.dialogBehavior?.setContentElement(content);
      }
    }
  }

  /**
   * Updates accessibility attributes on sheet content.
   */
  private updateContentAccessibility(): void {
    const content = this.querySelector("ds-sheet-content");
    if (!content || !this.dialogBehavior) return;

    // Get props from behavior
    const contentProps = this.dialogBehavior.getContentProps();

    // Set role on content
    content.setAttribute("role", "dialog");
    content.setAttribute("aria-modal", contentProps["aria-modal"]);

    // Connect title via aria-labelledby
    const title = this.querySelector("ds-sheet-title");
    if (title) {
      const titleProps = this.dialogBehavior.getTitleProps();
      if (!title.id) {
        title.id = titleProps.id;
      }
      content.setAttribute("aria-labelledby", title.id);
    }

    // Connect description via aria-describedby
    const description = this.querySelector("ds-sheet-description");
    if (description) {
      const descProps = this.dialogBehavior.getDescriptionProps();
      if (!description.id) {
        description.id = descProps.id;
      }
      content.setAttribute("aria-describedby", description.id);
      this.dialogBehavior.setHasDescription(true);
    } else {
      this.dialogBehavior.setHasDescription(false);
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
