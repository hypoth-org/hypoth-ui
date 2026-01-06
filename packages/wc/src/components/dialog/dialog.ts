import {
  type FocusTrap,
  createFocusTrap,
  type DismissableLayer,
  createDismissableLayer,
  type Presence,
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
 * @fires ds:open - Fired when dialog opens
 * @fires ds:close - Fired when dialog closes
 * @fires ds:before-close - Fired before dialog closes (cancelable)
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

  private focusTrap: FocusTrap | null = null;
  private dismissLayer: DismissableLayer | null = null;
  private presence: Presence | null = null;
  private triggerElement: HTMLElement | null = null;
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
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleTriggerClick);
    this.attributeObserver?.disconnect();
    this.attributeObserver = null;
    this.cleanup();
  }

  /**
   * Opens the dialog.
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
   * Closes the dialog.
   */
  public close(): void {
    if (!this.open) return;

    // Emit before-close event (cancelable)
    const beforeCloseEvent = emitEvent(this, StandardEvents.BEFORE_CLOSE, {
      cancelable: true,
    });

    if (beforeCloseEvent.defaultPrevented) {
      return;
    }

    const content = this.querySelector("ds-dialog-content") as DsDialogContent | null;

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
      this.close();
    }
  };

  private handleDismiss = (reason: "escape" | "outside-click"): void => {
    if (reason === "escape" && this.closeOnEscape) {
      this.close();
    } else if (reason === "outside-click" && this.closeOnBackdrop) {
      this.close();
    }
  };

  private setupFocusAndDismiss(): void {
    const content = this.querySelector("ds-dialog-content");
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
      closeOnOutsideClick: this.closeOnBackdrop,
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
      const content = this.querySelector("ds-dialog-content") as DsDialogContent | null;

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

        // Attach backdrop click handler
        this.backdropElement = this.querySelector(".ds-dialog__backdrop");
        this.backdropElement?.addEventListener("click", this.handleBackdropClick);
      } else {
        // Clean up backdrop listener
        this.backdropElement?.removeEventListener("click", this.handleBackdropClick);
        this.backdropElement = null;
      }
    }

    // Update role on content when dialogRole changes
    if (changedProperties.has("dialogRole") && this.open) {
      this.updateContentAccessibility();
    }
  }

  /**
   * Updates accessibility attributes on dialog content.
   */
  private updateContentAccessibility(): void {
    const content = this.querySelector("ds-dialog-content");
    if (!content) return;

    // Set role on content
    content.setAttribute("role", this.dialogRole);
    content.setAttribute("aria-modal", "true");

    // Connect title via aria-labelledby
    const title = this.querySelector("ds-dialog-title");
    if (title) {
      if (!title.id) {
        title.id = `dialog-title-${crypto.randomUUID().slice(0, 8)}`;
      }
      content.setAttribute("aria-labelledby", title.id);
    }

    // Connect description via aria-describedby
    const description = this.querySelector("ds-dialog-description");
    if (description) {
      if (!description.id) {
        description.id = `dialog-desc-${crypto.randomUUID().slice(0, 8)}`;
      }
      content.setAttribute("aria-describedby", description.id);
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
