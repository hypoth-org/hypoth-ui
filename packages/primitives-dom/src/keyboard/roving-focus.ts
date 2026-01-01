/**
 * Roving focus utility for keyboard navigation in lists and grids.
 * Implements WAI-ARIA roving tabindex pattern.
 */

export type Direction = 'horizontal' | 'vertical' | 'both';

export interface RovingFocusOptions {
  container: HTMLElement;
  selector: string;
  direction?: Direction;
  loop?: boolean;
  onFocus?: (element: HTMLElement, index: number) => void;
}

export interface RovingFocus {
  setFocusedIndex: (index: number) => void;
  getFocusedIndex: () => number;
  destroy: () => void;
}

export function createRovingFocus(options: RovingFocusOptions): RovingFocus {
  const { container, selector, direction = 'horizontal', loop = true, onFocus } = options;
  let currentIndex = 0;

  function getElements(): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(selector));
  }

  function updateTabIndex(elements: HTMLElement[], focusIndex: number): void {
    elements.forEach((el, i) => {
      el.tabIndex = i === focusIndex ? 0 : -1;
    });
  }

  function focusElement(index: number): void {
    const elements = getElements();
    if (elements.length === 0) return;

    // Clamp or loop index
    if (loop) {
      index = ((index % elements.length) + elements.length) % elements.length;
    } else {
      index = Math.max(0, Math.min(index, elements.length - 1));
    }

    currentIndex = index;
    updateTabIndex(elements, currentIndex);
    elements[currentIndex]?.focus();
    onFocus?.(elements[currentIndex]!, currentIndex);
  }

  function handleKeyDown(event: KeyboardEvent): void {
    const elements = getElements();
    if (elements.length === 0) return;

    let nextIndex = currentIndex;
    let handled = false;

    switch (event.key) {
      case 'ArrowRight':
        if (direction === 'horizontal' || direction === 'both') {
          nextIndex = currentIndex + 1;
          handled = true;
        }
        break;
      case 'ArrowLeft':
        if (direction === 'horizontal' || direction === 'both') {
          nextIndex = currentIndex - 1;
          handled = true;
        }
        break;
      case 'ArrowDown':
        if (direction === 'vertical' || direction === 'both') {
          nextIndex = currentIndex + 1;
          handled = true;
        }
        break;
      case 'ArrowUp':
        if (direction === 'vertical' || direction === 'both') {
          nextIndex = currentIndex - 1;
          handled = true;
        }
        break;
      case 'Home':
        nextIndex = 0;
        handled = true;
        break;
      case 'End':
        nextIndex = elements.length - 1;
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();
      focusElement(nextIndex);
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
  container.addEventListener('keydown', handleKeyDown);
  container.addEventListener('focusin', handleFocus);

  return {
    setFocusedIndex: focusElement,
    getFocusedIndex: () => currentIndex,
    destroy: () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('focusin', handleFocus);
    },
  };
}
