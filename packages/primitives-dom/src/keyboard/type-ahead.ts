/**
 * Type-ahead search utility for lists and menus.
 * Accumulates typed characters to find matching items.
 */

import { DEFAULT_TYPEAHEAD_TIMEOUT } from "../constants.js";

/**
 * Options for creating a type-ahead handler.
 */
export interface TypeAheadOptions {
  /**
   * Function returning current list of items.
   * Called on each keypress to support dynamic lists.
   */
  items: () => HTMLElement[];

  /**
   * Function to extract text content from an item.
   * Used for matching against the typed buffer.
   */
  getText: (item: HTMLElement) => string;

  /**
   * Callback invoked when a matching item is found.
   */
  onMatch: (item: HTMLElement, index: number) => void;

  /**
   * Time in milliseconds before buffer clears.
   * @default 500
   */
  timeout?: number;
}

/**
 * Return interface for type-ahead handler.
 */
export interface TypeAhead {
  /**
   * Event handler for keydown events.
   * Handles printable characters only.
   */
  handleKeyDown: (event: KeyboardEvent) => void;

  /**
   * Clears the character buffer immediately.
   */
  reset: () => void;
}

/**
 * Creates a type-ahead search handler.
 */
export function createTypeAhead(options: TypeAheadOptions): TypeAhead {
  const { items, getText, onMatch, timeout = DEFAULT_TYPEAHEAD_TIMEOUT } = options;

  let buffer = "";
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  function clearBuffer(): void {
    buffer = "";
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  }

  function scheduleBufferClear(): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(clearBuffer, timeout);
  }

  function handleKeyDown(event: KeyboardEvent): void {
    // Ignore modifier keys
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    // Only handle single printable characters
    if (event.key.length !== 1) {
      return;
    }

    // Add to buffer
    buffer += event.key.toLowerCase();
    scheduleBufferClear();

    // Find matching item
    const currentItems = items();
    for (let i = 0; i < currentItems.length; i++) {
      const item = currentItems[i];
      if (!item) continue;

      const text = getText(item).toLowerCase();

      if (text.startsWith(buffer)) {
        onMatch(item, i);
        return;
      }
    }
  }

  function reset(): void {
    clearBuffer();
  }

  return { handleKeyDown, reset };
}
