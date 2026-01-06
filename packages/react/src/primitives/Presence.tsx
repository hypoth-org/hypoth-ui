"use client";

import { Children, cloneElement, isValidElement, type ReactElement } from "react";
import { usePresence } from "./use-presence.js";

export interface PresenceProps {
  /**
   * Whether the child should be present (visible)
   */
  present: boolean;

  /**
   * The child element to animate. Must be a single React element that accepts a ref.
   */
  children: ReactElement;

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
 * Presence component for managing exit animations.
 *
 * Keeps a child element mounted until its exit animation completes,
 * allowing for smooth enter/exit transitions.
 *
 * The child receives a ref and data-state attribute for animation:
 * - data-state="open" when entering
 * - data-state="closed" when exiting
 *
 * @example
 * ```tsx
 * <Presence present={isOpen} onExitComplete={() => console.log("closed")}>
 *   <Dialog.Content className="animate-fade-in data-[state=closed]:animate-fade-out">
 *     Dialog content
 *   </Dialog.Content>
 * </Presence>
 * ```
 */
export function Presence({
  present,
  children,
  forceMount = false,
  onExitComplete,
}: PresenceProps): ReactElement | null {
  const { isPresent, ref, dataState } = usePresence({
    present,
    onExitComplete,
  });

  // Force mount bypasses presence logic
  if (forceMount) {
    return children;
  }

  // Don't render if not present
  if (!isPresent) {
    return null;
  }

  // Validate single child
  const child = Children.only(children);

  if (!isValidElement(child)) {
    console.warn("Presence expects a single React element child");
    return null;
  }

  // Clone child with ref and data-state
  return cloneElement(child, {
    ref,
    "data-state": dataState,
  } as Record<string, unknown>);
}
