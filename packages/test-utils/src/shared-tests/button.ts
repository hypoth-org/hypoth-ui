/**
 * Shared button keyboard activation tests.
 *
 * These tests can run against both Web Component and React implementations
 * to ensure consistent behavior across frameworks.
 */

import { pressKey } from "../keyboard.js";
import { hasRole, isDisabled } from "../aria.js";

export interface ButtonTestContext {
  /** Creates a button element and returns it */
  createButton: (props?: {
    disabled?: boolean;
    loading?: boolean;
    /** Callback for activation (click for WC, onPress for React) */
    onActivate?: () => void;
  }) => Promise<HTMLElement>;
  /** Cleans up the button element */
  cleanup: () => void;
  /** Gets the clickable element within the button (may be the button itself or an inner element) */
  getClickableElement: (button: HTMLElement) => HTMLElement;
  /** Test assertion functions (from test framework) */
  expect: (value: unknown) => {
    toBe: (expected: unknown) => void;
    toHaveBeenCalled: () => void;
    toHaveBeenCalledTimes: (times: number) => void;
    not: {
      toHaveBeenCalled: () => void;
    };
  };
  /** Creates a mock function */
  createMockFn: () => { (): void; mock: { calls: unknown[][] } };
  /**
   * Whether keyboard events trigger the activation callback directly
   * (true for React with onPress) or trigger click events (false for WC)
   */
  keyboardTriggersActivation?: boolean;
  /**
   * Whether Space key activates the button (native buttons activate on Space keyup).
   * Some behavior implementations may not handle Space activation.
   * Default: true (tests Space key activation)
   */
  spaceKeyActivates?: boolean;
}

/**
 * Runs shared button keyboard activation tests.
 *
 * @example
 * ```ts
 * // In WC test file
 * import { runButtonKeyboardTests } from '@ds/test-utils/shared-tests/button';
 *
 * describe('ds-button keyboard', () => {
 *   runButtonKeyboardTests({
 *     createButton: async (props) => {
 *       const button = document.createElement('ds-button');
 *       if (props?.disabled) button.disabled = true;
 *       document.body.appendChild(button);
 *       await button.updateComplete;
 *       return button;
 *     },
 *     cleanup: () => document.body.innerHTML = '',
 *     getClickableElement: (button) => button.querySelector('button')!,
 *     expect: expect,
 *     createMockFn: vi.fn,
 *   });
 * });
 * ```
 */
export function runButtonKeyboardTests(
  context: ButtonTestContext,
  testFn: (name: string, fn: () => void | Promise<void>) => void
): void {
  const {
    createButton,
    cleanup,
    getClickableElement,
    expect,
    createMockFn,
    keyboardTriggersActivation,
    spaceKeyActivates = true,
  } = context;

  testFn("should trigger activation on Enter key", async () => {
    const activationHandler = createMockFn();
    const button = await createButton(
      keyboardTriggersActivation ? { onActivate: activationHandler } : undefined
    );
    const clickable = getClickableElement(button);

    if (!keyboardTriggersActivation) {
      button.addEventListener("click", activationHandler);
    }

    pressKey(clickable, "Enter");

    expect(activationHandler).toHaveBeenCalled();
    cleanup();
  });

  if (spaceKeyActivates) {
    testFn("should trigger activation on Space key", async () => {
      const activationHandler = createMockFn();
      const button = await createButton(
        keyboardTriggersActivation ? { onActivate: activationHandler } : undefined
      );
      const clickable = getClickableElement(button);

      if (!keyboardTriggersActivation) {
        button.addEventListener("click", activationHandler);
      }

      pressKey(clickable, "Space");

      expect(activationHandler).toHaveBeenCalled();
      cleanup();
    });
  }

  testFn("should not trigger activation on Enter when disabled", async () => {
    const activationHandler = createMockFn();
    const button = await createButton(
      keyboardTriggersActivation
        ? { disabled: true, onActivate: activationHandler }
        : { disabled: true }
    );
    const clickable = getClickableElement(button);

    if (!keyboardTriggersActivation) {
      button.addEventListener("click", activationHandler);
    }

    pressKey(clickable, "Enter");

    expect(activationHandler).not.toHaveBeenCalled();
    cleanup();
  });

  if (spaceKeyActivates) {
    testFn("should not trigger activation on Space when disabled", async () => {
      const activationHandler = createMockFn();
      const button = await createButton(
        keyboardTriggersActivation
          ? { disabled: true, onActivate: activationHandler }
          : { disabled: true }
      );
      const clickable = getClickableElement(button);

      if (!keyboardTriggersActivation) {
        button.addEventListener("click", activationHandler);
      }

      pressKey(clickable, "Space");

      expect(activationHandler).not.toHaveBeenCalled();
      cleanup();
    });
  }

  testFn("should have button role", async () => {
    const button = await createButton();
    const clickable = getClickableElement(button);

    expect(hasRole(clickable, "button")).toBe(true);
    cleanup();
  });

  testFn("should indicate disabled state via aria-disabled", async () => {
    const button = await createButton({ disabled: true });
    const clickable = getClickableElement(button);

    expect(isDisabled(clickable)).toBe(true);
    cleanup();
  });
}

/**
 * Creates test context for Web Component button testing.
 */
export function createWCButtonTestContext(
  // biome-ignore lint/suspicious/noExplicitAny: Test framework types vary
  expectFn: any,
  // biome-ignore lint/suspicious/noExplicitAny: Test framework types vary
  mockFn: any
): Omit<ButtonTestContext, "createButton" | "cleanup"> {
  return {
    getClickableElement: (button: HTMLElement) => {
      // WC buttons typically have an inner button element
      return button.querySelector("button") ?? button;
    },
    expect: expectFn,
    createMockFn: mockFn,
  };
}
