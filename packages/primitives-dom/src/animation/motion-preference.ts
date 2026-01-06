/**
 * Motion preference utilities.
 * SSR-safe utilities for detecting user motion preferences.
 */

/**
 * Check if the user prefers reduced motion.
 * SSR-safe: returns false if window is undefined.
 *
 * @example
 * ```ts
 * if (prefersReducedMotion()) {
 *   // Skip animation, transition instantly
 * } else {
 *   // Play full animation
 * }
 * ```
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Subscribe to changes in the user's motion preference.
 * Returns an unsubscribe function.
 *
 * @example
 * ```ts
 * const unsubscribe = onMotionPreferenceChange((prefersReduced) => {
 *   console.log('Motion preference changed:', prefersReduced);
 * });
 *
 * // Later, to clean up:
 * unsubscribe();
 * ```
 */
export function onMotionPreferenceChange(callback: (prefersReduced: boolean) => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handler = (event: MediaQueryListEvent) => {
    callback(event.matches);
  };

  mediaQuery.addEventListener("change", handler);

  return () => {
    mediaQuery.removeEventListener("change", handler);
  };
}
