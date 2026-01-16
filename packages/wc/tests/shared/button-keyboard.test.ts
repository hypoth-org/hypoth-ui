/**
 * Shared button keyboard tests for WC implementation.
 *
 * Uses @ds/test-utils shared test definitions to ensure consistent
 * behavior across WC and React implementations.
 *
 * Note: WC buttons emit ds:press events, not native click events, on keyboard activation.
 * The keyboardTriggersActivation flag indicates that onActivate handlers are called
 * directly via ds:press events rather than through synthetic click events.
 */

import { describe, expect, it, vi } from "vitest";
import { runButtonKeyboardTests, createWCButtonTestContext } from "@ds/test-utils";

// Import the component to register it
import "../../src/components/button/button.js";
import type { DsButton } from "../../src/components/button/button.js";

describe("ds-button shared keyboard tests", () => {
  const baseContext = createWCButtonTestContext(expect, vi.fn);

  runButtonKeyboardTests(
    {
      ...baseContext,
      createButton: async (props) => {
        const button = document.createElement("ds-button") as DsButton;
        if (props?.disabled) button.disabled = true;
        if (props?.loading) button.loading = true;
        // Wire up ds:press to onActivate callback if provided
        if (props?.onActivate) {
          button.addEventListener("ds:press", props.onActivate);
        }
        document.body.appendChild(button);
        await button.updateComplete;
        return button;
      },
      cleanup: () => {
        document.body.innerHTML = "";
      },
      // WC buttons use ds:press events for keyboard activation, not click events
      keyboardTriggersActivation: true,
    },
    it
  );
});
