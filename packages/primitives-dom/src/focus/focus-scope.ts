/**
 * FocusScope Primitive
 *
 * Enhanced focus management with focus trapping, focus restoration,
 * and automatic focus on mount. Builds on focus-trap.ts with additional
 * scope semantics for modal dialogs and overlays.
 */

import { FOCUSABLE_SELECTOR } from "../constants.js";

export interface FocusScopeOptions {
  /** Whether to trap focus within the scope */
  trap?: boolean;
  /** Whether to restore focus to the previously focused element on unmount */
  restoreFocus?: boolean;
  /** Whether to auto-focus the first focusable element on mount */
  autoFocus?: boolean;
  /** Element to focus on mount (overrides autoFocus behavior) */
  initialFocus?: HTMLElement | null;
  /** Element to restore focus to on unmount (overrides restoreFocus behavior) */
  returnFocus?: HTMLElement | null;
  /** Callback when focus leaves the scope (only when trap is false) */
  onFocusOutside?: (event: FocusEvent) => void;
}

export interface FocusScope {
  /** Activate the focus scope */
  activate(): void;
  /** Deactivate the focus scope and restore focus */
  deactivate(): void;
  /** Check if the scope is currently active */
  isActive(): boolean;
  /** Update options dynamically */
  setOptions(options: Partial<FocusScopeOptions>): void;
  /** Get all focusable elements within the scope */
  getFocusableElements(): HTMLElement[];
  /** Focus the first focusable element */
  focusFirst(): void;
  /** Focus the last focusable element */
  focusLast(): void;
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

  return elements.filter((el) => {
    // Filter out hidden or disabled elements
    if (el.hasAttribute("disabled")) return false;
    if (el.getAttribute("aria-disabled") === "true") return false;
    if (el.getAttribute("tabindex") === "-1") return false;

    // Check visibility
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;

    return true;
  });
}

/**
 * Create a focus scope for managing focus within a container.
 *
 * @example
 * ```typescript
 * const scope = createFocusScope(dialogElement, {
 *   trap: true,
 *   restoreFocus: true,
 *   autoFocus: true,
 * });
 *
 * // Activate when dialog opens
 * scope.activate();
 *
 * // Deactivate when dialog closes
 * scope.deactivate();
 * ```
 */
export function createFocusScope(
  container: HTMLElement,
  options: FocusScopeOptions = {}
): FocusScope {
  let currentOptions: FocusScopeOptions = {
    trap: true,
    restoreFocus: true,
    autoFocus: true,
    ...options,
  };

  let isActive = false;
  let previouslyFocused: HTMLElement | null = null;

  // Handle Tab key for focus trapping
  function handleKeyDown(event: KeyboardEvent) {
    if (!currentOptions.trap || event.key !== "Tab") return;

    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift+Tab: if on first element, wrap to last
      if (activeElement === firstElement || !container.contains(activeElement)) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab: if on last element, wrap to first
      if (activeElement === lastElement || !container.contains(activeElement)) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }

  // Handle focus leaving the scope
  function handleFocusOut(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement | null;

    // If focus is moving outside the container
    if (relatedTarget && !container.contains(relatedTarget)) {
      if (currentOptions.trap) {
        // Trap focus back into the container
        event.preventDefault();
        const focusableElements = getFocusableElements(container);
        if (focusableElements.length > 0) {
          focusableElements[0]?.focus();
        }
      } else if (currentOptions.onFocusOutside) {
        currentOptions.onFocusOutside(event);
      }
    }
  }

  // MutationObserver to handle dynamic content
  let observer: MutationObserver | null = null;

  function setupObserver() {
    if (typeof MutationObserver === "undefined") return;

    observer = new MutationObserver(() => {
      // Re-evaluate focusable elements when DOM changes
      const focusableElements = getFocusableElements(container);

      // If active element is no longer in container, refocus
      if (isActive && currentOptions.trap) {
        const activeElement = document.activeElement;
        if (!container.contains(activeElement) && focusableElements.length > 0) {
          focusableElements[0]?.focus();
        }
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "tabindex", "aria-disabled"],
    });
  }

  return {
    activate() {
      if (isActive) return;
      isActive = true;

      // Store currently focused element for restoration
      if (currentOptions.restoreFocus) {
        previouslyFocused =
          currentOptions.returnFocus ?? (document.activeElement as HTMLElement | null);
      }

      // Set up event listeners
      container.addEventListener("keydown", handleKeyDown);
      container.addEventListener("focusout", handleFocusOut);

      // Set up mutation observer
      setupObserver();

      // Handle initial focus
      if (currentOptions.autoFocus) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          if (!isActive) return;

          if (currentOptions.initialFocus) {
            currentOptions.initialFocus.focus();
          } else {
            const focusableElements = getFocusableElements(container);
            if (focusableElements.length > 0) {
              focusableElements[0]?.focus();
            } else {
              // If no focusable elements, focus the container itself
              container.setAttribute("tabindex", "-1");
              container.focus();
            }
          }
        });
      }
    },

    deactivate() {
      if (!isActive) return;
      isActive = false;

      // Clean up event listeners
      container.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("focusout", handleFocusOut);

      // Clean up observer
      observer?.disconnect();
      observer = null;

      // Restore focus
      if (currentOptions.restoreFocus && previouslyFocused) {
        // Use requestAnimationFrame to ensure clean deactivation
        requestAnimationFrame(() => {
          if (previouslyFocused && document.body.contains(previouslyFocused)) {
            previouslyFocused.focus();
          }
          previouslyFocused = null;
        });
      }
    },

    isActive() {
      return isActive;
    },

    setOptions(newOptions: Partial<FocusScopeOptions>) {
      currentOptions = { ...currentOptions, ...newOptions };
    },

    getFocusableElements() {
      return getFocusableElements(container);
    },

    focusFirst() {
      const elements = getFocusableElements(container);
      elements[0]?.focus();
    },

    focusLast() {
      const elements = getFocusableElements(container);
      elements[elements.length - 1]?.focus();
    },
  };
}
