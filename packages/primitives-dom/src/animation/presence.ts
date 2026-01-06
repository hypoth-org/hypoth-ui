/**
 * Presence utility for managing enter/exit animations.
 * Coordinates animation timing for overlay components.
 */

import { prefersReducedMotion } from "./motion-preference.js";
import type { AnimationState, Presence, PresenceOptions } from "./types.js";

/**
 * Creates a presence controller for managing enter/exit animations.
 *
 * The presence utility coordinates animation timing by:
 * - Setting data-state="open" on show (triggers CSS animation-in)
 * - Setting data-state="closed" on hide (triggers CSS animation-out)
 * - Listening for animationend before calling onExitComplete
 *
 * @example
 * ```ts
 * const presence = createPresence({
 *   onExitComplete: () => {
 *     // Safe to unmount element now
 *     element.remove();
 *   }
 * });
 *
 * // Show element
 * presence.show(element); // Sets data-state="open"
 *
 * // Hide element (waits for animation)
 * presence.hide(element); // Sets data-state="closed", then calls onExitComplete
 * ```
 */
export function createPresence(options: PresenceOptions = {}): Presence {
  const { onShow, onExitComplete, skipAnimation: forceSkipAnimation } = options;

  let state: AnimationState = "idle";
  let currentElement: HTMLElement | null = null;
  let animationEndHandler: ((event: AnimationEvent) => void) | null = null;

  function cleanup(): void {
    if (currentElement && animationEndHandler) {
      currentElement.removeEventListener("animationend", animationEndHandler);
      animationEndHandler = null;
    }
  }

  function shouldSkipAnimation(): boolean {
    return forceSkipAnimation === true || prefersReducedMotion();
  }

  function show(element: HTMLElement): void {
    cleanup();
    currentElement = element;

    // Cancel any pending exit animation
    if (state === "animating-out" && typeof element.getAnimations === "function") {
      element.getAnimations().forEach((animation) => animation.cancel());
    }

    onShow?.();

    if (shouldSkipAnimation()) {
      // Skip animation - go directly to idle
      element.setAttribute("data-state", "open");
      state = "idle";
      return;
    }

    state = "animating-in";
    element.setAttribute("data-state", "open");

    // Listen for animation end
    animationEndHandler = (event: AnimationEvent) => {
      // Only respond to animations on the element itself
      if (event.target !== element) return;

      cleanup();
      state = "idle";
    };

    element.addEventListener("animationend", animationEndHandler);
  }

  function hide(element: HTMLElement): void {
    cleanup();
    currentElement = element;

    // Cancel any pending entry animation
    if (state === "animating-in" && typeof element.getAnimations === "function") {
      element.getAnimations().forEach((animation) => animation.cancel());
    }

    if (shouldSkipAnimation()) {
      // Skip animation - call exit complete immediately
      element.setAttribute("data-state", "closed");
      state = "exited";
      onExitComplete?.();
      return;
    }

    state = "animating-out";
    element.setAttribute("data-state", "closed");

    // Check if any animations are running
    // In test environments or when CSS is not loaded, there may be no animations
    // getAnimations() may not exist in some test environments (happy-dom)
    const animations =
      typeof element.getAnimations === "function" ? element.getAnimations() : [];
    if (animations.length === 0) {
      // No animations running - complete immediately
      state = "exited";
      onExitComplete?.();
      return;
    }

    // Listen for animation end
    animationEndHandler = (event: AnimationEvent) => {
      // Only respond to animations on the element itself
      if (event.target !== element) return;

      cleanup();
      state = "exited";
      onExitComplete?.();
    };

    element.addEventListener("animationend", animationEndHandler);
  }

  function cancel(element: HTMLElement): void {
    cleanup();
    if (typeof element.getAnimations === "function") {
      element.getAnimations().forEach((animation) => animation.cancel());
    }
    state = "idle";
  }

  function destroy(): void {
    cleanup();
    currentElement = null;
    state = "idle";
  }

  return {
    get state() {
      return state;
    },
    show,
    hide,
    cancel,
    prefersReducedMotion,
    destroy,
  };
}
