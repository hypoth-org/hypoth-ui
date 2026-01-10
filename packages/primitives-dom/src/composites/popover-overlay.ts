/**
 * Popover Overlay Composite
 *
 * High-level primitive that bundles overlay behavior with presence animations
 * and anchor positioning for popovers, tooltips, dropdowns, and menus. Provides:
 * - Anchor positioning (relative to trigger)
 * - Escape key dismissal
 * - Outside click dismissal
 * - Enter/exit animations with data-state
 * - Auto-update on scroll/resize
 * - Flip logic when near viewport edges
 *
 * @module composites/popover-overlay
 */

import {
  type OverlayBehavior,
  type OverlayBehaviorOptions,
  createOverlayBehavior,
} from "../overlay/create-overlay-behavior.js";
import { createPresence } from "../animation/presence.js";
import type { Presence } from "../animation/types.js";
import {
  type AnchorPosition,
  type ComputedPosition,
  type Placement,
  createAnchorPosition,
} from "../positioning/anchor-position.js";

// =============================================================================
// Types
// =============================================================================

export interface PopoverOverlayOptions extends OverlayBehaviorOptions {
  /**
   * Preferred placement relative to anchor.
   * @default "bottom"
   */
  placement?: Placement;

  /**
   * Offset distance from anchor in pixels.
   * @default 8
   */
  offset?: number;

  /**
   * Whether to flip placement when near viewport edge.
   * @default true
   */
  flip?: boolean;

  /**
   * Whether to automatically update position on scroll/resize.
   * @default true
   */
  autoUpdate?: boolean;

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
   * Callback when the popover becomes visible.
   */
  onShow?: () => void;

  /**
   * Callback when position changes (e.g., after flip).
   */
  onPositionChange?: (position: ComputedPosition) => void;
}

export interface PopoverOverlayState {
  /** Whether the popover is open */
  open: boolean;
  /** Whether the popover is modal (traps focus) */
  modal: boolean;
  /** Current animation state */
  animationState: "idle" | "animating-in" | "animating-out" | "exited";
  /** Current computed position */
  position: ComputedPosition | null;
}

export interface PopoverOverlay {
  /** Current state */
  readonly state: PopoverOverlayState;

  /** Generated overlay ID */
  readonly overlayId: string;

  /** Open the popover */
  open(): void;

  /** Close the popover (starts exit animation) */
  close(): void;

  /** Toggle the popover open/closed */
  toggle(): void;

  /** Check if popover is currently open */
  isOpen(): boolean;

  /**
   * Set the trigger element (anchor for positioning).
   * This is the element the popover positions relative to.
   */
  setTriggerElement(element: HTMLElement | null): void;

  /**
   * Set the content element (the popover container).
   * This activates positioning and dismissal handling.
   */
  setContentElement(element: HTMLElement | null): void;

  /**
   * Manually update position.
   * Call this if content size changes.
   */
  updatePosition(): ComputedPosition | null;

  /**
   * Get ARIA props for the trigger button.
   * Apply these to the element that opens the popover.
   */
  getTriggerProps(): {
    id: string;
    "aria-expanded": "true" | "false";
    "aria-controls": string;
  };

  /**
   * Get ARIA props for the content container.
   * Apply these to the popover element.
   */
  getContentProps(): {
    id: string;
    tabIndex: -1;
  };

  /** Update options dynamically */
  setOptions(options: Partial<PopoverOverlayOptions>): void;

  /** Clean up all resources */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

/**
 * Creates a popover overlay composite that bundles:
 * - Overlay behavior (dismissal, optional focus trap, state management)
 * - Presence animations (enter/exit with data-state)
 * - Anchor positioning (relative to trigger, with flip logic)
 *
 * @example
 * ```ts
 * const popover = createPopoverOverlay({
 *   placement: "bottom-start",
 *   offset: 8,
 *   onOpenChange: (open) => console.log("Popover open:", open),
 *   onExitComplete: () => {
 *     popoverElement.remove();
 *   },
 * });
 *
 * // Connect to DOM elements
 * popover.setTriggerElement(triggerButton);
 * popover.setContentElement(popoverElement);
 *
 * // Open popover (positions relative to trigger)
 * popover.open();
 * ```
 */
export function createPopoverOverlay(options: PopoverOverlayOptions = {}): PopoverOverlay {
  const {
    placement = "bottom",
    offset = 8,
    flip = true,
    autoUpdate = true,
    skipAnimation,
    onExitComplete,
    onShow,
    onOpenChange,
    onPositionChange,
    ...overlayOptions
  } = options;

  let triggerElement: HTMLElement | null = null;
  let contentElement: HTMLElement | null = null;
  let anchorPosition: AnchorPosition | null = null;
  let currentPosition: ComputedPosition | null = null;
  let scrollResizeCleanup: (() => void) | null = null;

  // Mutable positioning options
  const positioningOptions = { placement, offset, flip };

  // Create presence controller for animations
  const presence: Presence = createPresence({
    skipAnimation,
    onShow,
    onExitComplete: () => {
      cleanupPositioning();
      onExitComplete?.();
    },
  });

  // Create overlay behavior (non-modal by default for popovers)
  const overlay: OverlayBehavior = createOverlayBehavior({
    ...overlayOptions,
    onOpenChange: (open) => {
      if (open && contentElement) {
        setupPositioning();
        presence.show(contentElement);
      } else if (!open && contentElement) {
        presence.hide(contentElement);
      }
      onOpenChange?.(open);
    },
  });

  /**
   * Set up anchor positioning and auto-update listeners
   */
  function setupPositioning(): void {
    if (!triggerElement || !contentElement) return;

    anchorPosition = createAnchorPosition({
      anchor: triggerElement,
      floating: contentElement,
      placement: positioningOptions.placement,
      offset: positioningOptions.offset,
      flip: positioningOptions.flip,
      onPositionChange: (pos) => {
        currentPosition = pos;
        onPositionChange?.(pos);
      },
    });

    // Initial position update
    currentPosition = anchorPosition.update();

    // Set up scroll/resize listeners if autoUpdate enabled
    if (autoUpdate) {
      const handleUpdate = () => {
        if (anchorPosition && overlay.isOpen()) {
          currentPosition = anchorPosition.update();
        }
      };

      window.addEventListener("scroll", handleUpdate, { passive: true, capture: true });
      window.addEventListener("resize", handleUpdate, { passive: true });

      scrollResizeCleanup = () => {
        window.removeEventListener("scroll", handleUpdate, { capture: true });
        window.removeEventListener("resize", handleUpdate);
      };
    }
  }

  /**
   * Clean up positioning resources
   */
  function cleanupPositioning(): void {
    if (scrollResizeCleanup) {
      scrollResizeCleanup();
      scrollResizeCleanup = null;
    }
    if (anchorPosition) {
      anchorPosition.destroy();
      anchorPosition = null;
    }
    currentPosition = null;
  }

  const popoverOverlay: PopoverOverlay = {
    get state(): PopoverOverlayState {
      return {
        open: overlay.state.open,
        modal: overlay.state.modal,
        animationState: presence.state,
        position: currentPosition ? { ...currentPosition } : null,
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
      triggerElement = element;
      overlay.setTriggerElement(element);

      // Re-setup positioning if already open
      if (element && contentElement && overlay.isOpen()) {
        cleanupPositioning();
        setupPositioning();
      }
    },

    setContentElement(element: HTMLElement | null): void {
      contentElement = element;
      overlay.setContentElement(element);

      // Set up positioning if already open
      if (element && triggerElement && overlay.isOpen()) {
        setupPositioning();
        presence.show(element);
      }
    },

    updatePosition(): ComputedPosition | null {
      if (anchorPosition) {
        currentPosition = anchorPosition.update();
        return currentPosition;
      }
      return null;
    },

    getTriggerProps() {
      return overlay.getTriggerProps();
    },

    getContentProps() {
      return overlay.getContentProps();
    },

    setOptions(newOptions: Partial<PopoverOverlayOptions>): void {
      const {
        placement: newPlacement,
        offset: newOffset,
        flip: newFlip,
        skipAnimation: _skip,
        onExitComplete: _exit,
        onShow: _show,
        onPositionChange: _pos,
        ...rest
      } = newOptions;

      // Update positioning options
      if (newPlacement !== undefined) positioningOptions.placement = newPlacement;
      if (newOffset !== undefined) positioningOptions.offset = newOffset;
      if (newFlip !== undefined) positioningOptions.flip = newFlip;

      // Update overlay options
      overlay.setOptions(rest);

      // Re-setup positioning if open
      if (overlay.isOpen() && contentElement && triggerElement) {
        cleanupPositioning();
        setupPositioning();
      }
    },

    destroy(): void {
      cleanupPositioning();
      if (contentElement) {
        presence.cancel(contentElement);
      }
      presence.destroy();
      overlay.destroy();
      triggerElement = null;
      contentElement = null;
    },
  };

  return popoverOverlay;
}
