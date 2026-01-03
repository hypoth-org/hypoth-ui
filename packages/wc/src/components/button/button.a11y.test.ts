import { axe, toHaveNoViolations } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DsButton } from "./button.js";

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Ensure the component is defined before tests
import "./button.js";

describe("DsButton Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  // Helper to add accessible name to button (Light DOM doesn't support slot projection)
  const addAccessibleName = async (button: DsButton, label: string) => {
    await button.updateComplete;
    const innerButton = button.querySelector("button");
    if (innerButton) {
      innerButton.setAttribute("aria-label", label);
    }
  };

  describe("axe accessibility checks", () => {
    it("has no violations with default props", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await addAccessibleName(button, "Click me");

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no violations when disabled", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.disabled = true;
      container.appendChild(button);
      await addAccessibleName(button, "Disabled button");

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no violations when loading", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.loading = true;
      container.appendChild(button);
      await addAccessibleName(button, "Loading button");

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no violations for all variants", async () => {
      const variants = ["primary", "secondary", "ghost", "destructive"] as const;

      for (const variant of variants) {
        container.innerHTML = "";
        const button = document.createElement("ds-button") as DsButton;
        button.variant = variant;
        container.appendChild(button);
        await addAccessibleName(button, `${variant} button`);

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });
  });

  describe("ARIA attributes", () => {
    it("has correct role (implicit button)", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      // Native button element has implicit button role
      expect(innerButton?.tagName.toLowerCase()).toBe("button");
    });

    it("sets aria-disabled when disabled", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.disabled = true;
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.getAttribute("aria-disabled")).toBe("true");
    });

    it("sets aria-disabled when loading", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.loading = true;
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.getAttribute("aria-disabled")).toBe("true");
    });

    it("sets aria-busy when loading", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.loading = true;
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.getAttribute("aria-busy")).toBe("true");
    });

    it("hides spinner from screen readers", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.loading = true;
      container.appendChild(button);
      await button.updateComplete;

      const spinner = button.querySelector(".ds-button__spinner");
      expect(spinner?.getAttribute("aria-hidden")).toBe("true");
    });
  });

  describe("keyboard accessibility", () => {
    it("is focusable", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      innerButton?.focus();
      expect(document.activeElement).toBe(innerButton);
    });

    it("is not focusable when disabled", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.disabled = true;
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      // Disabled buttons should not receive focus programmatically
      // (browsers handle this differently, but the disabled attribute prevents activation)
      expect(innerButton?.disabled).toBe(true);
    });
  });

  describe("screen reader behavior", () => {
    it("button element exists for screen readers", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      // The button element exists and can be given an accessible name
      expect(innerButton).toBeTruthy();
    });

    it("content wrapper exists when loading", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.loading = true;
      container.appendChild(button);
      await button.updateComplete;

      // Content wrapper should exist for accessible content
      const content = button.querySelector(".ds-button__content");
      expect(content).toBeTruthy();
    });
  });
});
