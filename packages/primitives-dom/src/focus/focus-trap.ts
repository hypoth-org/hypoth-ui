/**
 * Focus trap utility for modal dialogs and similar components.
 * Keeps focus within a container element.
 */

import { FOCUSABLE_SELECTOR } from "../constants.js";

export interface FocusTrapOptions {
  container: HTMLElement;
  initialFocus?: HTMLElement | null;
  /**
   * Where to return focus when trap deactivates.
   * - `true`: Return to previously focused element
   * - `false`: Don't manage return focus
   * - `HTMLElement`: Focus specific element
   */
  returnFocus?: boolean | HTMLElement;
  /**
   * Element to focus if container has no focusable elements.
   * Container should be focusable (tabindex="-1") for this to work.
   */
  fallbackFocus?: HTMLElement;
}

export interface FocusTrap {
  activate: () => void;
  deactivate: () => void;
}

export function createFocusTrap(options: FocusTrapOptions): FocusTrap {
  const { container, initialFocus, returnFocus = true, fallbackFocus } = options;
  let previouslyFocused: Element | null = null;
  let isActive = false;

  function getFocusableElements(): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => el.offsetParent !== null // visible
    );
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (!isActive || event.key !== "Tab") return;

    const focusable = getFocusableElements();
    if (focusable.length === 0) return;

    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    }
  }

  function activate(): void {
    if (isActive) return;

    previouslyFocused = document.activeElement;
    isActive = true;

    document.addEventListener("keydown", handleKeyDown);

    // Focus initial element, first focusable, or fallback
    const focusables = getFocusableElements();
    const target = initialFocus ?? focusables[0] ?? fallbackFocus;
    target?.focus();
  }

  function deactivate(): void {
    if (!isActive) return;

    isActive = false;
    document.removeEventListener("keydown", handleKeyDown);

    // Return focus based on returnFocus option
    if (returnFocus instanceof HTMLElement) {
      // Focus specific element
      returnFocus.focus();
    } else if (returnFocus && previouslyFocused instanceof HTMLElement) {
      // Return to previously focused element
      previouslyFocused.focus();
    }
    previouslyFocused = null;
  }

  return { activate, deactivate };
}
