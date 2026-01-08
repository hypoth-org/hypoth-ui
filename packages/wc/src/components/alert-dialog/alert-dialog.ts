/**
 * AlertDialog component - modal dialog requiring explicit user action.
 *
 * AlertDialog is used for important decisions that require confirmation.
 * Unlike Dialog, it cannot be dismissed by clicking outside or pressing Escape.
 *
 * Implements WAI-ARIA AlertDialog pattern.
 *
 * @element ds-alert-dialog
 *
 * @slot trigger - Button or element that opens the alert dialog
 * @slot - AlertDialog content (ds-alert-dialog-content)
 *
 * @fires ds:open - Fired when alert dialog opens
 * @fires ds:close - Fired when alert dialog closes
 *
 * @example
 * ```html
 * <ds-alert-dialog>
 *   <button slot="trigger">Delete Account</button>
 *   <ds-alert-dialog-content>
 *     <ds-alert-dialog-header>
 *       <ds-alert-dialog-title>Are you absolutely sure?</ds-alert-dialog-title>
 *       <ds-alert-dialog-description>
 *         This action cannot be undone.
 *       </ds-alert-dialog-description>
 *     </ds-alert-dialog-header>
 *     <ds-alert-dialog-footer>
 *       <ds-alert-dialog-cancel>Cancel</ds-alert-dialog-cancel>
 *       <ds-alert-dialog-action>Delete</ds-alert-dialog-action>
 *     </ds-alert-dialog-footer>
 *   </ds-alert-dialog-content>
 * </ds-alert-dialog>
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
import type { DsAlertDialogContent } from "./alert-dialog-content.js";
import "./alert-dialog-content.js";
import "./alert-dialog-header.js";
import "./alert-dialog-footer.js";
import "./alert-dialog-title.js";
import "./alert-dialog-description.js";
import "./alert-dialog-action.js";
import "./alert-dialog-cancel.js";

export class DsAlertDialog extends DSElement {
  /** Whether the alert dialog is open */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Whether to animate open/close transitions */
  @property({ type: Boolean })
  animated = true;

  /** Whether the alert dialog is closing (for animation) */
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

    // Listen for action/cancel clicks
    this.addEventListener("ds:alert-dialog-action", this.handleAction as EventListener);
    this.addEventListener("ds:alert-dialog-cancel", this.handleCancel as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleTriggerClick);
    this.removeEventListener("ds:alert-dialog-action", this.handleAction as EventListener);
    this.removeEventListener("ds:alert-dialog-cancel", this.handleCancel as EventListener);
    this.cleanup();
  }

  /**
   * Opens the alert dialog.
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
   * Closes the alert dialog.
   */
  public close(): void {
    if (!this.open) return;

    const content = this.querySelector("ds-alert-dialog-content") as DsAlertDialogContent | null;

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

  private handleAction = (): void => {
    // Action clicked - close the dialog
    this.close();
  };

  private handleCancel = (): void => {
    // Cancel clicked - close the dialog
    this.close();
  };

  private setupFocusAndDismiss(): void {
    const content = this.querySelector("ds-alert-dialog-content");
    if (!content) return;

    // Set up focus trap
    this.focusTrap = createFocusTrap({
      container: content as HTMLElement,
      returnFocus: false, // We handle this manually
    });
    this.focusTrap.activate();

    // Set up dismiss layer - AlertDialog does NOT close on escape or outside click
    const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;
    this.dismissLayer = createDismissableLayer({
      container: content as HTMLElement,
      excludeElements: trigger ? [trigger] : [],
      onDismiss: () => {
        // AlertDialog does not dismiss on escape or outside click
        // User must click Action or Cancel
      },
      closeOnEscape: false,
      closeOnOutsideClick: false,
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
      const content = this.querySelector("ds-alert-dialog-content") as DsAlertDialogContent | null;

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
   * Updates accessibility attributes on alert dialog content.
   */
  private updateContentAccessibility(): void {
    const content = this.querySelector("ds-alert-dialog-content");
    if (!content) return;

    // Set role on content - always alertdialog
    content.setAttribute("role", "alertdialog");
    content.setAttribute("aria-modal", "true");

    // Connect title via aria-labelledby
    const title = this.querySelector("ds-alert-dialog-title");
    if (title) {
      if (!title.id) {
        title.id = `alert-dialog-title-${crypto.randomUUID().slice(0, 8)}`;
      }
      content.setAttribute("aria-labelledby", title.id);
    }

    // Connect description via aria-describedby
    const description = this.querySelector("ds-alert-dialog-description");
    if (description) {
      if (!description.id) {
        description.id = `alert-dialog-desc-${crypto.randomUUID().slice(0, 8)}`;
      }
      content.setAttribute("aria-describedby", description.id);
    }
  }

  override render() {
    return html`
      <slot name="trigger"></slot>
      <div
        class="ds-alert-dialog__backdrop"
        ?hidden=${!this.open}
        ?data-closing=${this.isClosing}
      >
        <slot></slot>
      </div>
    `;
  }
}

define("ds-alert-dialog", DsAlertDialog);

declare global {
  interface HTMLElementTagNameMap {
    "ds-alert-dialog": DsAlertDialog;
  }
}
