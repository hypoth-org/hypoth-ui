"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Check if the user prefers reduced motion.
 * SSR-safe: returns false if window is undefined.
 */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface UsePresenceOptions {
  /**
   * Whether the element should be present (visible)
   */
  present: boolean;

  /**
   * Called when the exit animation completes
   */
  onExitComplete?: () => void;
}

export interface UsePresenceReturn {
  /**
   * Whether the element should be rendered
   */
  isPresent: boolean;

  /**
   * Ref to attach to the animated element
   */
  ref: React.RefCallback<HTMLElement>;

  /**
   * Current animation state for data-state attribute
   */
  dataState: "open" | "closed";
}

/**
 * Hook for managing presence/exit animations.
 *
 * Keeps an element mounted until its exit animation completes,
 * allowing for smooth enter/exit transitions.
 *
 * @example
 * ```tsx
 * function AnimatedDialog({ isOpen, onClose }) {
 *   const { isPresent, ref, dataState } = usePresence({
 *     present: isOpen,
 *     onExitComplete: () => console.log("exit complete"),
 *   });
 *
 *   if (!isPresent) return null;
 *
 *   return (
 *     <div ref={ref} data-state={dataState} className="animate-fade-in">
 *       Dialog content
 *     </div>
 *   );
 * }
 * ```
 */
export function usePresence(options: UsePresenceOptions): UsePresenceReturn {
  const { present, onExitComplete } = options;
  const [isPresent, setIsPresent] = useState(present);
  const [dataState, setDataState] = useState<"open" | "closed">(present ? "open" : "closed");
  const elementRef = useRef<HTMLElement | null>(null);
  const isAnimating = useRef(false);

  // Handle animation end
  const handleAnimationEnd = useCallback(
    (event: AnimationEvent) => {
      // Only handle animations on the element itself
      if (event.target !== elementRef.current) return;

      isAnimating.current = false;

      // If we were animating out, now we can unmount
      if (!present) {
        setIsPresent(false);
        onExitComplete?.();
      }
    },
    [present, onExitComplete]
  );

  // Ref callback to attach animation listener
  const ref = useCallback(
    (element: HTMLElement | null) => {
      // Cleanup previous element
      if (elementRef.current) {
        elementRef.current.removeEventListener("animationend", handleAnimationEnd);
      }

      elementRef.current = element;

      // Setup new element
      if (element) {
        element.addEventListener("animationend", handleAnimationEnd);
      }
    },
    [handleAnimationEnd]
  );

  // Handle present changes
  useEffect(() => {
    if (present) {
      // Showing: mount immediately, set state to open
      setIsPresent(true);
      setDataState("open");
    } else if (isPresent) {
      // Hiding: set state to closed, wait for animation
      setDataState("closed");

      // If reduced motion, unmount immediately
      if (prefersReducedMotion()) {
        setIsPresent(false);
        onExitComplete?.();
      } else {
        // Wait for animation
        isAnimating.current = true;

        // Fallback timeout in case animationend doesn't fire
        const timeoutId = setTimeout(() => {
          if (isAnimating.current) {
            isAnimating.current = false;
            setIsPresent(false);
            onExitComplete?.();
          }
        }, 1000); // 1s fallback

        return () => clearTimeout(timeoutId);
      }
    }
  }, [present, isPresent, onExitComplete]);

  return {
    isPresent,
    ref,
    dataState,
  };
}
