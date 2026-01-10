/**
 * Modal Overlay Composite
 *
 * High-level primitive that bundles overlay behavior with presence animations
 * for modal dialogs, drawers, and sheets. Provides:
 * - Focus trapping (modal: true)
 * - Escape key dismissal
 * - Outside click dismissal
 * - Enter/exit animations with data-state
 * - Coordinated cleanup on close
 *
 * @module composites/modal-overlay
 */

import {
  type OverlayBehavior,
  type OverlayBehaviorOptions,
  createOverlayBehavior,
} from "../overlay/create-overlay-behavior.js";
import { createPresence } from "../animation/presence.js";
import type { Presence, } from "../animation/types.js";

// =============================================================================
// Types
// =============================================================================

export interface ModalOverlayOptions extends Omit<OverlayBehaviorOptions, "modal"> {
  /**
   * Whether to skip enter/exit animations.
   * Defaults to respecting user's prefers-reduced-motion setting.
   */
  skipAnimation?: boolean;

  /**
   * Callback when exit animation completes.
   * Use this to safely remove the element from DOM.
   */
  onExitComplete?: () => void;

  /**
   * Callback when the modal becomes visible (after opening).
   */
  onShow?: () => void;
}

export interface ModalOverlayState {
  /** Whether the modal is open */
  open: boolean;
  /** Current animation state */
  animationState: "idle" | "animating-in" | "animating-out" | "exited";
}

export interface ModalOverlay {
  /** Current state */
  readonly state: ModalOverlayState;

  /** Generated overlay ID */
  readonly overlayId: string;

  /** Open the modal */
  open(): void;

  /** Close the modal (starts exit animation) */
  close(): void;

  /** Toggle the modal open/closed */
  toggle(): void;

  /** Check if modal is currently open */
  isOpen(): boolean;

  /**
   * Set the trigger element (button that opens modal).
   * Focus returns here on close.
   */
  setTriggerElement(element: HTMLElement | null): void;

  /**
   * Set the content element (the modal container).
   * This activates focus trap and dismissal handling.
   */
  setContentElement(element: HTMLElement | null): void;

  /**
   * Get ARIA props for the trigger button.
   * Apply these to the element that opens the modal.
   */
  getTriggerProps(): {
    id: string;
    "aria-expanded": "true" | "false";
    "aria-controls": string;
  };

  /**
   * Get ARIA props for the content container.
   * Apply these to the modal element.
   */
  getContentProps(): {
    id: string;
    tabIndex: -1;
  };

  /** Update options dynamically */
  setOptions(options: Partial<ModalOverlayOptions>): void;

  /** Clean up all resources */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

/**
 * Creates a modal overlay composite that bundles:
 * - Overlay behavior (focus trap, dismissal, state management)
 * - Presence animations (enter/exit with data-state)
 *
 * @example
 * ```ts
 * const modal = createModalOverlay({
 *   onOpenChange: (open) => console.log("Modal open:", open),
 *   onExitComplete: () => {
 *     // Safe to remove modal element from DOM
 *     modalElement.remove();
 *   },
 * });
 *
 * // Connect to DOM elements
 * modal.setTriggerElement(triggerButton);
 * modal.setContentElement(modalElement);
 *
 * // Open modal
 * modal.open();
 *
 * // Close modal (waits for animation)
 * modal.close();
 * ```
 */
export function createModalOverlay(options: ModalOverlayOptions = {}): ModalOverlay {
  const {
    skipAnimation,
    onExitComplete,
    onShow,
    onOpenChange,
    ...overlayOptions
  } = options;

  let contentElement: HTMLElement | null = null;

  // Create presence controller for animations
  const presence: Presence = createPresence({
    skipAnimation,
    onShow,
    onExitComplete: () => {
      onExitComplete?.();
    },
  });

  // Create overlay behavior (always modal)
  const overlay: OverlayBehavior = createOverlayBehavior({
    ...overlayOptions,
    modal: true, // Modal overlays always trap focus
    onOpenChange: (open) => {
      if (open && contentElement) {
        // Show with animation
        presence.show(contentElement);
      } else if (!open && contentElement) {
        // Hide with animation
        presence.hide(contentElement);
      }
      onOpenChange?.(open);
    },
  });

  const modalOverlay: ModalOverlay = {
    get state(): ModalOverlayState {
      return {
        open: overlay.state.open,
        animationState: presence.state,
      };
    },

    get overlayId(): string {
      return overlay.context.overlayId;
    },

    open(): void {
      overlay.open();
    },

    close(): void {
      overlay.close();
    },

    toggle(): void {
      overlay.toggle();
    },

    isOpen(): boolean {
      return overlay.isOpen();
    },

    setTriggerElement(element: HTMLElement | null): void {
      overlay.setTriggerElement(element);
    },

    setContentElement(element: HTMLElement | null): void {
      contentElement = element;
      overlay.setContentElement(element);

      // If already open, show immediately
      if (element && overlay.isOpen()) {
        presence.show(element);
      }
    },

    getTriggerProps() {
      return overlay.getTriggerProps();
    },

    getContentProps() {
      return overlay.getContentProps();
    },

    setOptions(newOptions: Partial<ModalOverlayOptions>): void {
      const { skipAnimation: _skip, onExitComplete: _exit, onShow: _show, ...rest } = newOptions;
      overlay.setOptions(rest);
    },

    destroy(): void {
      if (contentElement) {
        presence.cancel(contentElement);
      }
      presence.destroy();
      overlay.destroy();
      contentElement = null;
    },
  };

  return modalOverlay;
}
