/**
 * Shared button keyboard tests for WC implementation.
 *
 * Uses @ds/test-utils shared test definitions to ensure consistent
 * behavior across WC and React implementations.
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
        document.body.appendChild(button);
        await button.updateComplete;
        return button;
      },
      cleanup: () => {
        document.body.innerHTML = "";
      },
    },
    it
  );
});
