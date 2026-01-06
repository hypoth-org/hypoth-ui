/**
 * Animation types for the presence system.
 */

/**
 * Animation lifecycle states
 */
export type AnimationState = "idle" | "animating-in" | "animating-out" | "exited";

/**
 * Options for creating a presence controller
 */
export interface PresenceOptions {
  /**
   * Called when the element should be shown (before animation starts)
   */
  onShow?: () => void;

  /**
   * Called when the exit animation completes and element can be unmounted
   */
  onExitComplete?: () => void;

  /**
   * Whether to skip animations (respects prefers-reduced-motion by default)
   */
  skipAnimation?: boolean;
}

/**
 * Presence controller for managing enter/exit animations
 */
export interface Presence {
  /**
   * Current animation state
   */
  readonly state: AnimationState;

  /**
   * Show the element (triggers entry animation)
   * @param element - The element to animate
   */
  show(element: HTMLElement): void;

  /**
   * Hide the element (triggers exit animation, calls onExitComplete when done)
   * @param element - The element to animate
   */
  hide(element: HTMLElement): void;

  /**
   * Cancel any in-progress animation
   * @param element - The element to stop animating
   */
  cancel(element: HTMLElement): void;

  /**
   * Check if the user prefers reduced motion
   */
  prefersReducedMotion(): boolean;

  /**
   * Clean up any listeners
   */
  destroy(): void;
}
