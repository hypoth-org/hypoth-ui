/**
 * Overlay behavior primitive.
 *
 * Provides common functionality for overlay components like Dialog, Popover, Menu, Tooltip.
 * Handles open/close state, focus management, dismissal, and element coordination.
 *
 * @example
 * ```ts
 * const overlay = createOverlayBehavior({
 *   defaultOpen: false,
 *   modal: true,
 *   closeOnEscape: true,
 *   closeOnOutsideClick: true,
 *   onOpenChange: (open) => console.log("Overlay open:", open),
 * });
 *
 * // Open overlay
 * overlay.open();
 *
 * // Set trigger element
 * overlay.setTriggerElement(document.getElementById("trigger"));
 *
 * // Set content element (activates focus trap if modal)
 * overlay.setContentElement(document.getElementById("content"));
 * ```
 */

import { type FocusTrap, createFocusTrap } from "../focus/focus-trap.js";
import {
  type DismissReason,
  type DismissableLayer,
  createDismissableLayer,
} from "../layer/dismissable-layer.js";

// =============================================================================
// Types
// =============================================================================

export interface OverlayBehaviorOptions {
  /** Initial open state */
  defaultOpen?: boolean;
  /** Whether overlay is modal (traps focus) */
  modal?: boolean;
  /** Whether Escape key closes overlay */
  closeOnEscape?: boolean;
  /** Whether clicking outside closes overlay */
  closeOnOutsideClick?: boolean;
  /** Whether to return focus to trigger on close */
  returnFocusOnClose?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Callback when dismissed via escape or outside click */
  onDismiss?: (reason: DismissReason) => void;
  /** Custom ID generator */
  generateId?: () => string;
}

export interface OverlayBehaviorState {
  /** Whether overlay is open */
  open: boolean;
  /** Whether overlay is modal */
  modal: boolean;
}

export interface OverlayBehaviorContext {
  /** Generated ID for the overlay */
  overlayId: string;
  /** Trigger element reference */
  triggerElement: HTMLElement | null;
  /** Content element reference */
  contentElement: HTMLElement | null;
}

export type OverlayEvent =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "DISMISS"; reason: DismissReason };

export interface OverlayTriggerProps {
  /** Unique ID for trigger */
  id: string;
  /** ARIA expanded state */
  "aria-expanded": "true" | "false";
  /** ARIA controls reference */
  "aria-controls": string;
}

export interface OverlayContentProps {
  /** Unique ID for content */
  id: string;
  /** Tabindex for focus */
  tabIndex: -1;
}

export interface OverlayBehavior {
  /** Current state */
  readonly state: OverlayBehaviorState;
  /** Internal context (IDs, refs) */
  readonly context: OverlayBehaviorContext;
  /** Send event to state machine */
  send(event: OverlayEvent): void;
  /** Open overlay */
  open(): void;
  /** Close overlay */
  close(): void;
  /** Toggle overlay */
  toggle(): void;
  /** Check if currently open */
  isOpen(): boolean;
  /** Get props for trigger element */
  getTriggerProps(): OverlayTriggerProps;
  /** Get props for content element */
  getContentProps(): OverlayContentProps;
  /** Set trigger element reference */
  setTriggerElement(element: HTMLElement | null): void;
  /** Set content element and activate focus management */
  setContentElement(element: HTMLElement | null): void;
  /** Update options dynamically */
  setOptions(options: Partial<OverlayBehaviorOptions>): void;
  /** Cleanup resources */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

let idCounter = 0;

function defaultGenerateId(): string {
  return `overlay-${++idCounter}`;
}

/**
 * Creates an overlay behavior instance.
 *
 * Provides common functionality for overlay components:
 * - Open/close state management
 * - Focus trapping (for modal overlays)
 * - Dismissal handling (escape key, outside click)
 * - Trigger/content element coordination
 * - ARIA attribute computation
 */
export function createOverlayBehavior(
  options: OverlayBehaviorOptions = {}
): OverlayBehavior {
  const {
    defaultOpen = false,
    modal = false,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    returnFocusOnClose = true,
    onOpenChange,
    onDismiss,
    generateId = defaultGenerateId,
  } = options;

  // Generate stable ID
  const overlayId = generateId();

  // Internal state
  let state: OverlayBehaviorState = {
    open: defaultOpen,
    modal,
  };

  let context: OverlayBehaviorContext = {
    overlayId,
    triggerElement: null,
    contentElement: null,
  };

  // Focus trap for modal overlays
  let focusTrap: FocusTrap | null = null;

  // Dismissable layer for escape/outside click
  let dismissLayer: DismissableLayer | null = null;

  // Mutable options for dynamic updates
  let currentOptions = {
    closeOnEscape,
    closeOnOutsideClick,
    returnFocusOnClose,
    modal,
    onOpenChange,
    onDismiss,
  };

  /**
   * Handle state transitions
   */
  function transition(event: OverlayEvent): void {
    switch (event.type) {
      case "OPEN":
        if (!state.open) {
          state = { ...state, open: true };
          currentOptions.onOpenChange?.(true);
        }
        break;

      case "CLOSE":
        if (state.open) {
          cleanup();
          state = { ...state, open: false };
          currentOptions.onOpenChange?.(false);
          maybeReturnFocus();
        }
        break;

      case "TOGGLE":
        if (state.open) {
          transition({ type: "CLOSE" });
        } else {
          transition({ type: "OPEN" });
        }
        break;

      case "DISMISS":
        if (state.open) {
          currentOptions.onDismiss?.(event.reason);
          cleanup();
          state = { ...state, open: false };
          currentOptions.onOpenChange?.(false);
          maybeReturnFocus();
        }
        break;
    }
  }

  /**
   * Clean up focus trap and dismiss layer
   */
  function cleanup(): void {
    if (focusTrap) {
      focusTrap.deactivate();
      focusTrap = null;
    }
    if (dismissLayer) {
      dismissLayer.deactivate();
      dismissLayer = null;
    }
  }

  /**
   * Return focus to trigger element
   */
  function maybeReturnFocus(): void {
    if (currentOptions.returnFocusOnClose && context.triggerElement) {
      requestAnimationFrame(() => {
        context.triggerElement?.focus();
      });
    }
  }

  /**
   * Activate focus management and dismiss layer when content is set
   */
  function activateOverlay(): void {
    if (!state.open || !context.contentElement) return;

    // Set up dismissable layer
    dismissLayer = createDismissableLayer({
      container: context.contentElement,
      closeOnEscape: currentOptions.closeOnEscape,
      closeOnOutsideClick: currentOptions.closeOnOutsideClick,
      excludeElements: context.triggerElement ? [context.triggerElement] : [],
      onDismiss: (reason) => {
        transition({ type: "DISMISS", reason });
      },
    });
    dismissLayer.activate();

    // Set up focus trap for modal overlays
    if (currentOptions.modal) {
      focusTrap = createFocusTrap({
        container: context.contentElement,
        returnFocus: false, // We handle this ourselves
      });
      focusTrap.activate();
    }
  }

  // Create behavior object
  const behavior: OverlayBehavior = {
    get state() {
      return { ...state };
    },

    get context() {
      return { ...context };
    },

    send(event: OverlayEvent) {
      transition(event);
    },

    open() {
      transition({ type: "OPEN" });
    },

    close() {
      transition({ type: "CLOSE" });
    },

    toggle() {
      transition({ type: "TOGGLE" });
    },

    isOpen() {
      return state.open;
    },

    getTriggerProps(): OverlayTriggerProps {
      return {
        id: `${overlayId}-trigger`,
        "aria-expanded": state.open ? "true" : "false",
        "aria-controls": `${overlayId}-content`,
      };
    },

    getContentProps(): OverlayContentProps {
      return {
        id: `${overlayId}-content`,
        tabIndex: -1,
      };
    },

    setTriggerElement(element: HTMLElement | null) {
      context = { ...context, triggerElement: element };
    },

    setContentElement(element: HTMLElement | null) {
      // Clean up existing overlay setup
      cleanup();

      context = { ...context, contentElement: element };

      // Activate if open and element is set
      if (element && state.open) {
        activateOverlay();
      }
    },

    setOptions(newOptions: Partial<OverlayBehaviorOptions>) {
      currentOptions = { ...currentOptions, ...newOptions };

      // Update modal state if changed
      if (newOptions.modal !== undefined) {
        state = { ...state, modal: newOptions.modal };
      }

      // Re-activate if open (to apply new options)
      if (state.open && context.contentElement) {
        cleanup();
        activateOverlay();
      }
    },

    destroy() {
      cleanup();
      context = {
        overlayId,
        triggerElement: null,
        contentElement: null,
      };
    },
  };

  return behavior;
}
