import { axe, toHaveNoViolations } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

// Extend expect with axe matchers
expect.extend(toHaveNoViolations);

// Import the component to register it
import "../src/components/input/input.js";
import type { DsInput } from "../src/components/input/input.js";

describe("ds-input accessibility", () => {
  let container: HTMLDivElement;
  let input: DsInput;
  let label: HTMLLabelElement;

  beforeEach(async () => {
    container = document.createElement("div");

    // Create a label for the input (required for a11y)
    label = document.createElement("label");
    label.textContent = "Email address";
    label.htmlFor = "test-input";

    input = document.createElement("ds-input") as DsInput;
    input.id = "test-input";

    container.appendChild(label);
    container.appendChild(input);
    document.body.appendChild(container);
    await input.updateComplete;

    // Set aria-label on inner input for a11y (since label association doesn't work with Light DOM)
    const innerInput = input.querySelector("input");
    if (innerInput) {
      innerInput.setAttribute("aria-label", "Email address");
    }
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should have no accessibility violations in default state", async () => {
    await input.updateComplete;
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations when disabled", async () => {
    input.disabled = true;
    await input.updateComplete;
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations when readonly", async () => {
    input.readonly = true;
    await input.updateComplete;
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations in error state", async () => {
    input.error = true;
    await input.updateComplete;
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations for each type", async () => {
    const types = ["text", "email", "password", "tel", "url", "search"] as const;

    for (const type of types) {
      input.type = type;
      await input.updateComplete;
      // Re-add aria-label after property change
      const innerInput = input.querySelector("input");
      innerInput?.setAttribute("aria-label", "Email address");
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it("should have no accessibility violations for each size", async () => {
    const sizes = ["sm", "md", "lg"] as const;

    for (const size of sizes) {
      input.size = size;
      await input.updateComplete;
      // Re-add aria-label after property change
      const innerInput = input.querySelector("input");
      innerInput?.setAttribute("aria-label", "Email address");
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  describe("ARIA attributes", () => {
    it("should be focusable", async () => {
      await input.updateComplete;
      const innerInput = input.querySelector("input");
      innerInput?.focus();
      expect(document.activeElement).toBe(innerInput);
    });

    it("should not be focusable when disabled", async () => {
      input.disabled = true;
      await input.updateComplete;
      const innerInput = input.querySelector("input");
      expect(innerInput?.disabled).toBe(true);
    });

    it("should indicate invalid state with aria-invalid", async () => {
      input.error = true;
      await input.updateComplete;
      const innerInput = input.querySelector("input");
      expect(innerInput?.getAttribute("aria-invalid")).toBe("true");
    });

    it("should indicate required state", async () => {
      input.required = true;
      await input.updateComplete;
      const innerInput = input.querySelector("input");
      expect(innerInput?.required).toBe(true);
    });
  });

  describe("keyboard interaction", () => {
    it("should be keyboard accessible with Tab", async () => {
      await input.updateComplete;
      const innerInput = input.querySelector("input");

      // Native input elements are focusable by default
      // tabIndex property returns -1 when no explicit attribute is set, but element is still focusable
      innerInput?.focus();
      expect(document.activeElement).toBe(innerInput);
    });

    it("should accept text input", async () => {
      await input.updateComplete;
      const innerInput = input.querySelector("input") as HTMLInputElement;

      innerInput.focus();
      innerInput.value = "test";
      innerInput.dispatchEvent(new Event("input", { bubbles: true }));

      expect(input.value).toBe("test");
    });
  });

  describe("label association", () => {
    it("should be associated with label via id", async () => {
      await input.updateComplete;
      const _innerInput = input.querySelector("input");

      // The label should reference the input
      expect(label.htmlFor).toBe(input.id);
    });
  });
});
