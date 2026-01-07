/**
 * Presence API Contract
 *
 * TypeScript interfaces for the animation presence system.
 * These types define the public API surface for @ds/primitives-dom and @ds/react.
 */

// =============================================================================
// Animation State
// =============================================================================

/**
 * Animation lifecycle states
 */
export type AnimationState = "idle" | "animating-in" | "animating-out" | "exited";

// =============================================================================
// Presence Utility (@ds/primitives-dom)
// =============================================================================

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

/**
 * Creates a presence controller
 */
export declare function createPresence(options?: PresenceOptions): Presence;

// =============================================================================
// React Presence Component (@ds/react)
// =============================================================================

/**
 * Props for the React Presence component
 */
export interface PresenceProps {
  /**
   * Whether the child should be present (visible)
   */
  present: boolean;

  /**
   * The child element to animate. Must be a single React element that accepts a ref.
   */
  children: React.ReactElement;

  /**
   * Force the child to always be mounted (useful for SSR or animation debugging)
   * @default false
   */
  forceMount?: boolean;

  /**
   * Called when the exit animation completes
   */
  onExitComplete?: () => void;
}

/**
 * React Presence component for managing exit animations
 *
 * @example
 * ```tsx
 * <Presence present={isOpen}>
 *   <Dialog.Content className="animate-fade-in data-[state=closed]:animate-fade-out">
 *     ...
 *   </Dialog.Content>
 * </Presence>
 * ```
 */
export declare function Presence(props: PresenceProps): React.ReactElement | null;

// =============================================================================
// Web Component Animation Attributes
// =============================================================================

/**
 * Animation attributes for Web Components
 *
 * These are not TypeScript types but document the HTML attribute API.
 */
export interface WCAnimationAttributes {
  /**
   * Current state of the component
   * Triggers corresponding CSS animations
   *
   * @attribute data-state
   * @values 'open' | 'closed'
   */
  "data-state": "open" | "closed";

  /**
   * Entry animation preset(s) - space separated
   *
   * @attribute data-animate-in
   * @values 'fade-in' | 'scale-in' | 'slide-up' | 'slide-down' | 'fade-in scale-in' | ...
   * @optional - uses component default if not specified
   */
  "data-animate-in"?: string;

  /**
   * Exit animation preset(s) - space separated
   *
   * @attribute data-animate-out
   * @values 'fade-out' | 'scale-out' | 'slide-up' | 'slide-down' | 'fade-out scale-out' | ...
   * @optional - uses component default if not specified
   */
  "data-animate-out"?: string;

  /**
   * Disable animations for this specific component
   *
   * @attribute data-no-animation
   * @values '' (presence indicates disabled)
   */
  "data-no-animation"?: "";
}

// =============================================================================
// Behavior Integration
// =============================================================================

/**
 * Animation-aware behavior options for overlay components
 *
 * Extends existing behavior options (e.g., DialogBehaviorOptions)
 */
export interface AnimatedBehaviorOptions {
  /**
   * Whether to animate open/close transitions
   * @default true
   */
  animated?: boolean;

  /**
   * Called before exit animation starts
   */
  onBeforeClose?: () => void;

  /**
   * Called after exit animation completes (before onOpenChange(false))
   */
  onCloseComplete?: () => void;
}

/**
 * Extended behavior state with animation tracking
 */
export interface AnimatedBehaviorState {
  /**
   * Current animation state
   */
  animationState: AnimationState;
}
