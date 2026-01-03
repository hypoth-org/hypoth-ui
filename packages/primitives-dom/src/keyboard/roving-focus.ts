/**
 * Roving focus utility for keyboard navigation in lists and grids.
 * Implements WAI-ARIA roving tabindex pattern.
 */

import type { Direction } from "../types.js";

export type { Direction };

export interface RovingFocusOptions {
  container: HTMLElement;
  selector: string;
  direction?: Direction;
  loop?: boolean;
  /**
   * Whether to skip disabled items during navigation.
   * Checks for `disabled` attribute and `aria-disabled="true"`.
   */
  skipDisabled?: boolean;
  onFocus?: (element: HTMLElement, index: number) => void;
}

export interface RovingFocus {
  setFocusedIndex: (index: number) => void;
  getFocusedIndex: () => number;
  destroy: () => void;
}

/**
 * Checks if an element is disabled.
 * Checks for `disabled` attribute and `aria-disabled="true"`.
 */
function isDisabled(element: HTMLElement): boolean {
  return (
    (element as HTMLButtonElement).disabled === true ||
    element.getAttribute("aria-disabled") === "true"
  );
}

export function createRovingFocus(options: RovingFocusOptions): RovingFocus {
  const {
    container,
    selector,
    direction = "horizontal",
    loop = true,
    skipDisabled = true,
    onFocus,
  } = options;
  let currentIndex = 0;

  function getElements(): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(selector));
  }

  function updateTabIndex(elements: HTMLElement[], focusIndex: number): void {
    elements.forEach((el, i) => {
      el.tabIndex = i === focusIndex ? 0 : -1;
    });
  }

  /**
   * Finds the next valid index, skipping disabled elements if needed.
   */
  function findValidIndex(
    elements: HTMLElement[],
    targetIndex: number,
    searchDirection: 1 | -1
  ): number {
    const len = elements.length;

    // Normalize the target index first
    let normalizedTarget: number;
    if (loop) {
      normalizedTarget = ((targetIndex % len) + len) % len;
    } else {
      normalizedTarget = Math.max(0, Math.min(targetIndex, len - 1));
    }

    if (!skipDisabled) {
      return normalizedTarget;
    }

    // Search for a non-disabled element
    let checked = 0;
    let index = normalizedTarget;

    while (checked < len) {
      const element = elements[index];
      if (element && !isDisabled(element)) {
        return index;
      }

      // Move to next/previous element
      if (loop) {
        index = (((index + searchDirection) % len) + len) % len;
      } else {
        const nextIndex = index + searchDirection;
        if (nextIndex < 0 || nextIndex >= len) {
          // Can't move further, return current position
          return currentIndex;
        }
        index = nextIndex;
      }
      checked++;
    }

    // All elements are disabled, stay at current
    return currentIndex;
  }

  function focusElement(targetIndex: number, searchDirection: 1 | -1 = 1): void {
    const elements = getElements();
    if (elements.length === 0) return;

    const newIndex = findValidIndex(elements, targetIndex, searchDirection);

    currentIndex = newIndex;
    updateTabIndex(elements, currentIndex);
    const currentElement = elements[currentIndex];
    currentElement?.focus();
    if (currentElement) {
      onFocus?.(currentElement, currentIndex);
    }
  }

  function handleKeyDown(event: KeyboardEvent): void {
    const elements = getElements();
    if (elements.length === 0) return;

    let nextIndex = currentIndex;
    let handled = false;
    let searchDir: 1 | -1 = 1;

    switch (event.key) {
      case "ArrowRight":
        if (direction === "horizontal" || direction === "both") {
          nextIndex = currentIndex + 1;
          searchDir = 1;
          handled = true;
        }
        break;
      case "ArrowLeft":
        if (direction === "horizontal" || direction === "both") {
          nextIndex = currentIndex - 1;
          searchDir = -1;
          handled = true;
        }
        break;
      case "ArrowDown":
        if (direction === "vertical" || direction === "both") {
          nextIndex = currentIndex + 1;
          searchDir = 1;
          handled = true;
        }
        break;
      case "ArrowUp":
        if (direction === "vertical" || direction === "both") {
          nextIndex = currentIndex - 1;
          searchDir = -1;
          handled = true;
        }
        break;
      case "Home":
        nextIndex = 0;
        searchDir = 1;
        handled = true;
        break;
      case "End":
        nextIndex = elements.length - 1;
        searchDir = -1;
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();
      focusElement(nextIndex, searchDir);
    }
  }

  function handleFocus(event: FocusEvent): void {
    const elements = getElements();
    const target = event.target as HTMLElement;
    const index = elements.indexOf(target);
    if (index !== -1) {
      currentIndex = index;
      updateTabIndex(elements, currentIndex);
    }
  }

  // Initialize
  const elements = getElements();
  updateTabIndex(elements, currentIndex);
  container.addEventListener("keydown", handleKeyDown);
  container.addEventListener("focusin", handleFocus);

  return {
    setFocusedIndex: focusElement,
    getFocusedIndex: () => currentIndex,
    destroy: () => {
      container.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("focusin", handleFocus);
    },
  };
}
