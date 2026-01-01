/**
 * Focus trap utility for modal dialogs and similar components.
 * Keeps focus within a container element.
 */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export interface FocusTrapOptions {
  container: HTMLElement;
  initialFocus?: HTMLElement | null;
  returnFocus?: boolean;
}

export interface FocusTrap {
  activate: () => void;
  deactivate: () => void;
}

export function createFocusTrap(options: FocusTrapOptions): FocusTrap {
  const { container, initialFocus, returnFocus = true } = options;
  let previouslyFocused: Element | null = null;
  let isActive = false;

  function getFocusableElements(): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => el.offsetParent !== null // visible
    );
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (!isActive || event.key !== 'Tab') return;

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

    document.addEventListener('keydown', handleKeyDown);

    // Focus initial element or first focusable
    const target = initialFocus ?? getFocusableElements()[0];
    target?.focus();
  }

  function deactivate(): void {
    if (!isActive) return;

    isActive = false;
    document.removeEventListener('keydown', handleKeyDown);

    // Return focus to previously focused element
    if (returnFocus && previouslyFocused instanceof HTMLElement) {
      previouslyFocused.focus();
    }
    previouslyFocused = null;
  }

  return { activate, deactivate };
}
