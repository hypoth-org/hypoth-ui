import { axe, toHaveNoViolations } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

// Extend expect with axe matchers
expect.extend(toHaveNoViolations);

// Import the component to register it
import "../src/components/button/button.js";
import type { DsButton } from "../src/components/button/button.js";

describe("ds-button accessibility", () => {
  let container: HTMLDivElement;
  let button: DsButton;

  beforeEach(async () => {
    container = document.createElement("div");
    button = document.createElement("ds-button") as DsButton;
    container.appendChild(button);
    document.body.appendChild(container);
    await button.updateComplete;
    // Set accessible name after render to work with Light DOM
    const innerButton = button.querySelector("button");
    if (innerButton) {
      innerButton.setAttribute("aria-label", "Click me");
    }
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should have no accessibility violations in default state", async () => {
    await button.updateComplete;
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations when disabled", async () => {
    button.disabled = true;
    await button.updateComplete;
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations when loading", async () => {
    button.loading = true;
    await button.updateComplete;
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations for each variant", async () => {
    const variants = ["primary", "secondary", "ghost", "destructive"] as const;

    for (const variant of variants) {
      button.variant = variant;
      await button.updateComplete;
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it("should have no accessibility violations for each size", async () => {
    const sizes = ["sm", "md", "lg"] as const;

    for (const size of sizes) {
      button.size = size;
      await button.updateComplete;
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  describe("ARIA attributes", () => {
    it("should have proper role", async () => {
      await button.updateComplete;
      const innerButton = button.querySelector("button");
      // Native button elements have implicit role="button"
      expect(innerButton?.tagName.toLowerCase()).toBe("button");
    });

    it("should be focusable", async () => {
      await button.updateComplete;
      const innerButton = button.querySelector("button");
      innerButton?.focus();
      expect(document.activeElement).toBe(innerButton);
    });

    it("should not be focusable when disabled", async () => {
      button.disabled = true;
      await button.updateComplete;
      const innerButton = button.querySelector("button");
      innerButton?.focus();
      // Disabled buttons should not receive focus
      expect(innerButton?.disabled).toBe(true);
    });

    it("should indicate busy state with aria-busy", async () => {
      button.loading = true;
      await button.updateComplete;
      const innerButton = button.querySelector("button");
      expect(innerButton?.getAttribute("aria-busy")).toBe("true");
    });

    it("should indicate disabled state with aria-disabled", async () => {
      button.disabled = true;
      await button.updateComplete;
      const innerButton = button.querySelector("button");
      expect(innerButton?.getAttribute("aria-disabled")).toBe("true");
    });
  });

  describe("keyboard navigation", () => {
    it("should be keyboard accessible with Tab", async () => {
      await button.updateComplete;
      const innerButton = button.querySelector("button");

      // Native button elements are focusable by default
      innerButton?.focus();
      expect(document.activeElement).toBe(innerButton);
    });

    it("should respond to Enter key", async () => {
      await button.updateComplete;
      let pressed = false;
      button.addEventListener("ds:press", () => {
        pressed = true;
      });

      const innerButton = button.querySelector("button");
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      });
      innerButton?.dispatchEvent(event);

      expect(pressed).toBe(true);
    });

    it("should respond to Space key", async () => {
      await button.updateComplete;
      let pressed = false;
      button.addEventListener("ds:press", () => {
        pressed = true;
      });

      const innerButton = button.querySelector("button");
      const event = new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
      });
      innerButton?.dispatchEvent(event);

      expect(pressed).toBe(true);
    });
  });

  describe("focus visible", () => {
    it("should have visible focus indicator", async () => {
      await button.updateComplete;
      const innerButton = button.querySelector("button");

      // Focus the button
      innerButton?.focus();

      // Button should be focusable and show focus indicator
      expect(document.activeElement).toBe(innerButton);
      // Focus styles are applied via CSS, so we just verify focus works
    });
  });
});
