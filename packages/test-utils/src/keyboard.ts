/**
 * Keyboard simulation helpers for cross-framework testing.
 */

export interface KeyboardEventInit {
  key: string;
  code?: string;
  keyCode?: number;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  bubbles?: boolean;
  cancelable?: boolean;
}

/**
 * Common key mappings for keyboard simulation.
 */
export const Keys = {
  Enter: { key: "Enter", code: "Enter", keyCode: 13 },
  Space: { key: " ", code: "Space", keyCode: 32 },
  Escape: { key: "Escape", code: "Escape", keyCode: 27 },
  Tab: { key: "Tab", code: "Tab", keyCode: 9 },
  ArrowUp: { key: "ArrowUp", code: "ArrowUp", keyCode: 38 },
  ArrowDown: { key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
  ArrowLeft: { key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
  ArrowRight: { key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
  Home: { key: "Home", code: "Home", keyCode: 36 },
  End: { key: "End", code: "End", keyCode: 35 },
  PageUp: { key: "PageUp", code: "PageUp", keyCode: 33 },
  PageDown: { key: "PageDown", code: "PageDown", keyCode: 34 },
  Backspace: { key: "Backspace", code: "Backspace", keyCode: 8 },
  Delete: { key: "Delete", code: "Delete", keyCode: 46 },
} as const;

/**
 * Creates a KeyboardEvent with proper initialization.
 */
export function createKeyboardEvent(
  type: "keydown" | "keyup" | "keypress",
  init: KeyboardEventInit
): KeyboardEvent {
  return new KeyboardEvent(type, {
    key: init.key,
    code: init.code ?? init.key,
    keyCode: init.keyCode,
    shiftKey: init.shiftKey ?? false,
    ctrlKey: init.ctrlKey ?? false,
    altKey: init.altKey ?? false,
    metaKey: init.metaKey ?? false,
    bubbles: init.bubbles ?? true,
    cancelable: init.cancelable ?? true,
  });
}

/**
 * Simulates a key press (keydown + keyup) on an element.
 */
export function pressKey(element: Element, keyOrInit: keyof typeof Keys | KeyboardEventInit): void {
  const init = typeof keyOrInit === "string" ? Keys[keyOrInit] : keyOrInit;

  const keydownEvent = createKeyboardEvent("keydown", init);
  element.dispatchEvent(keydownEvent);

  const keyupEvent = createKeyboardEvent("keyup", init);
  element.dispatchEvent(keyupEvent);
}

/**
 * Simulates a keydown event on an element.
 */
export function keyDown(element: Element, keyOrInit: keyof typeof Keys | KeyboardEventInit): void {
  const init = typeof keyOrInit === "string" ? Keys[keyOrInit] : keyOrInit;
  const event = createKeyboardEvent("keydown", init);
  element.dispatchEvent(event);
}

/**
 * Simulates a keyup event on an element.
 */
export function keyUp(element: Element, keyOrInit: keyof typeof Keys | KeyboardEventInit): void {
  const init = typeof keyOrInit === "string" ? Keys[keyOrInit] : keyOrInit;
  const event = createKeyboardEvent("keyup", init);
  element.dispatchEvent(event);
}

/**
 * Simulates typing text character by character.
 */
export function typeText(element: Element, text: string): void {
  for (const char of text) {
    const init: KeyboardEventInit = {
      key: char,
      code: `Key${char.toUpperCase()}`,
      keyCode: char.charCodeAt(0),
    };
    pressKey(element, init);
  }
}

/**
 * Simulates pressing Tab to move focus.
 */
export function tab(options: { shiftKey?: boolean } = {}): void {
  const activeElement = document.activeElement;
  if (activeElement) {
    pressKey(activeElement, { ...Keys.Tab, shiftKey: options.shiftKey ?? false });
  }
}

/**
 * Simulates pressing Enter key.
 */
export function enter(element: Element): void {
  pressKey(element, "Enter");
}

/**
 * Simulates pressing Space key.
 */
export function space(element: Element): void {
  pressKey(element, "Space");
}

/**
 * Simulates pressing Escape key.
 */
export function pressEscape(element: Element): void {
  pressKey(element, "Escape");
}

/**
 * Simulates arrow key navigation.
 */
export function arrowUp(element: Element): void {
  pressKey(element, "ArrowUp");
}

export function arrowDown(element: Element): void {
  pressKey(element, "ArrowDown");
}

export function arrowLeft(element: Element): void {
  pressKey(element, "ArrowLeft");
}

export function arrowRight(element: Element): void {
  pressKey(element, "ArrowRight");
}
