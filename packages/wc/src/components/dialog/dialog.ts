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
import type { DsDialogContent } from "./dialog-content.js";
import "./dialog-content.js";
import "./dialog-title.js";
import "./dialog-description.js";

export type DialogRole = "dialog" | "alertdialog";

/**
 * Modal dialog component with accessibility and focus management.
 *
 * Provides a modal overlay with backdrop, focus trap, and dismissal handling.
 * Follows WAI-ARIA Dialog (Modal) pattern.
 *
 * @element ds-dialog
 *
 * @slot trigger - Button or element that opens the dialog
 * @slot - Dialog content (ds-dialog-content)
 *
 * @fires ds:open-change - Fired when open state changes (detail: { open, reason })
 *
 * @example
 * ```html
 * <ds-dialog>
 *   <button slot="trigger">Open Dialog</button>
 *   <ds-dialog-content>
 *     <ds-dialog-title>Confirm Action</ds-dialog-title>
 *     <ds-dialog-description>Are you sure?</ds-dialog-description>
 *     <button>Yes</button>
 *     <button>No</button>
 *   </ds-dialog-content>
 * </ds-dialog>
 * ```
 */
export class DsDialog extends DSElement {
  /** Whether the dialog is open */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Whether Escape key closes the dialog */
  @property({ type: Boolean, attribute: "close-on-escape" })
  closeOnEscape = true;

  /** Whether clicking the backdrop closes the dialog */
  @property({ type: Boolean, attribute: "close-on-backdrop" })
  closeOnBackdrop = true;

  /** Whether to animate open/close transitions */
  @property({ type: Boolean })
  animated = true;

  /** Dialog role - stored internally, read from attribute */
  @state()
  private dialogRole: DialogRole = "dialog";

  /** Whether the dialog is closing (for animation) */
  @state()
  private isClosing = false;

  private dialogBehavior: DialogBehavior | null = null;
  private presence: Presence | null = null;
  private attributeObserver: MutationObserver | null = null;
  private backdropElement: HTMLElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // Listen for trigger clicks via event delegation
    this.addEventListener("click", this.handleTriggerClick);

    // Watch for role attribute changes (don't reflect back, just read)
    this.attributeObserver = new MutationObserver(() => {
      const roleAttr = this.getAttribute("role");
      if (roleAttr === "alertdialog" || roleAttr === "dialog") {
        this.dialogRole = roleAttr;
      }
      // Remove the role from ds-dialog itself (it shouldn't have it)
      if (roleAttr) {
        this.removeAttribute("role");
      }
    });
    this.attributeObserver.observe(this, {
      attributes: true,
      attributeFilter: ["role"],
    });

    // Read initial role attribute
    const initialRole = this.getAttribute("role");
    if (initialRole === "alertdialog" || initialRole === "dialog") {
      this.dialogRole = initialRole;
      this.removeAttribute("role");
    }

    // Initialize dialog behavior
    this.initDialogBehavior();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleTriggerClick);
    this.attributeObserver?.disconnect();
    this.attributeObserver = null;
    this.cleanup();
  }

  /**
   * Initializes the dialog behavior primitive.
   */
  private initDialogBehavior(): void {
    this.dialogBehavior = createDialogBehavior({
      defaultOpen: this.open,
      role: this.dialogRole,
      closeOnEscape: this.closeOnEscape,
      closeOnOutsideClick: this.closeOnBackdrop,
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
  private handleBehaviorClose(reason: "escape" | "outside-click" = "escape"): void {
    // Emit cancelable open-change event before closing
    const openChangeEvent = emitEvent(this, StandardEvents.OPEN_CHANGE, {
      detail: { open: false, reason },
      cancelable: true,
    });

    if (openChangeEvent.defaultPrevented) {
      // Re-open the behavior since we're preventing close
      this.dialogBehavior?.open();
      return;
    }

    const content = this.querySelector("ds-dialog-content") as DsDialogContent | null;

    // If animated, use presence for exit animation
    if (this.animated && content && !prefersReducedMotion()) {
      this.isClosing = true;
      this._closeReason = reason;

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
    }
  }

  /** Tracks the reason for closing (for animation completion) */
  private _closeReason: "escape" | "outside-click" | "trigger" | "programmatic" = "programmatic";

  /**
   * Opens the dialog.
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
    emitEvent(this, StandardEvents.OPEN_CHANGE, {
      detail: { open: true, reason: "trigger" },
    });
  }

  /**
   * Closes the dialog.
   * @param reason - The reason for closing (default: "programmatic")
   */
  public close(reason: "escape" | "outside-click" | "trigger" | "programmatic" = "programmatic"): void {
    if (!this.open) return;

    // Emit cancelable open-change event before closing
    const openChangeEvent = emitEvent(this, StandardEvents.OPEN_CHANGE, {
      detail: { open: false, reason },
      cancelable: true,
    });

    if (openChangeEvent.defaultPrevented) {
      return;
    }

    const content = this.querySelector("ds-dialog-content") as DsDialogContent | null;

    // Close the behavior (this deactivates focus trap and dismiss layer)
    this.dialogBehavior?.close();

    // If animated, use presence for exit animation
    if (this.animated && content && !prefersReducedMotion()) {
      this.isClosing = true;
      this._closeReason = reason;

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
    }
  }

  /**
   * Completes the close after exit animation.
   * Note: The open-change event was already emitted before animation started.
   */
  private completeClose(): void {
    this.presence?.destroy();
    this.presence = null;
    this.open = false;
    this.isClosing = false;
    // Event was already emitted before animation started
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

  private handleBackdropClick = (event: MouseEvent): void => {
    // Only close if clicking directly on backdrop, not on dialog content
    const content = this.querySelector("ds-dialog-content");
    const target = event.target as Node;

    // If click is inside content, don't close
    if (content?.contains(target)) {
      return;
    }

    // Click was on backdrop (outside content)
    if (this.closeOnBackdrop) {
      this.close("outside-click");
    }
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
      const content = this.querySelector("ds-dialog-content") as DsDialogContent | null;

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

        // Attach backdrop click handler
        this.backdropElement = this.querySelector(".ds-dialog__backdrop");
        this.backdropElement?.addEventListener("click", this.handleBackdropClick);
      } else {
        // Clean up backdrop listener
        this.backdropElement?.removeEventListener("click", this.handleBackdropClick);
        this.backdropElement = null;

        // Clear content element on behavior
        this.dialogBehavior?.setContentElement(null);
      }
    }

    // Update role on content when dialogRole changes
    if (changedProperties.has("dialogRole") && this.open) {
      this.updateContentAccessibility();
    }

    // Sync behavior options when they change
    if (changedProperties.has("closeOnEscape") || changedProperties.has("closeOnBackdrop")) {
      // Re-create behavior with new options
      const wasOpen = this.dialogBehavior?.state.open;
      this.dialogBehavior?.destroy();
      this.initDialogBehavior();
      if (wasOpen) {
        this.dialogBehavior?.open();
        const content = this.querySelector("ds-dialog-content") as HTMLElement | null;
        this.dialogBehavior?.setContentElement(content);
      }
    }
  }

  /**
   * Updates accessibility attributes on dialog content.
   */
  private updateContentAccessibility(): void {
    const content = this.querySelector("ds-dialog-content");
    if (!content || !this.dialogBehavior) return;

    // Get props from behavior
    const contentProps = this.dialogBehavior.getContentProps();

    // Apply content props
    content.setAttribute("role", this.dialogRole);
    content.setAttribute("aria-modal", contentProps["aria-modal"]);

    // Connect title via aria-labelledby
    const title = this.querySelector("ds-dialog-title");
    if (title) {
      const titleProps = this.dialogBehavior.getTitleProps();
      if (!title.id) {
        title.id = titleProps.id;
      }
      content.setAttribute("aria-labelledby", title.id);
    }

    // Connect description via aria-describedby
    const description = this.querySelector("ds-dialog-description");
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
    // Always render backdrop, hide when not open
    return html`
      <slot name="trigger"></slot>
      <div
        class="ds-dialog__backdrop"
        ?hidden=${!this.open}
        ?data-closing=${this.isClosing}
      >
        <slot></slot>
      </div>
    `;
  }
}

define("ds-dialog", DsDialog);

declare global {
  interface HTMLElementTagNameMap {
    "ds-dialog": DsDialog;
  }
}
