/**
 * Shared button keyboard tests for React native button implementation.
 *
 * Uses @ds/test-utils shared test definitions to ensure consistent
 * behavior across WC and React implementations.
 */

import { cleanup, render } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { runButtonKeyboardTests } from "@ds/test-utils";
import { Button } from "../../src/components/button/button";

describe("React Button shared keyboard tests", () => {
  afterEach(() => {
    cleanup();
  });

  runButtonKeyboardTests(
    {
      createButton: async (props) => {
        const { container } = render(
          createElement(Button, {
            disabled: props?.disabled,
            loading: props?.loading,
            onPress: props?.onActivate,
          }, "Test")
        );
        // The native React button renders a <button> element directly
        const button = container.querySelector("button");
        if (!button) throw new Error("Button not found");
        return button;
      },
      cleanup: () => {
        cleanup();
      },
      getClickableElement: (button: HTMLElement) => {
        // Native React button is the button itself
        return button;
      },
      expect: expect,
      createMockFn: vi.fn,
      // React uses onPress callback for keyboard activation, not click events
      keyboardTriggersActivation: true,
      // The button behavior only handles Enter activation (Space is typically handled on keyup for native buttons)
      spaceKeyActivates: false,
    },
    it
  );
});
