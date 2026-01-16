/**
 * Tests for ARIA describedby utility
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  addAriaDescriber,
  connectAriaDescribedBy,
  connectSingleDescriber,
} from "../src/aria/describedby.js";

describe("connectAriaDescribedBy", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should connect element to single describer", () => {
    const input = document.createElement("input");
    const helpText = document.createElement("span");
    helpText.textContent = "Help text";
    container.appendChild(input);
    container.appendChild(helpText);

    const cleanup = connectAriaDescribedBy(input, [helpText]);

    // ID should be generated and connected
    expect(helpText.id).toMatch(/^desc-[a-f0-9]{8}$/);
    expect(input.getAttribute("aria-describedby")).toBe(helpText.id);

    cleanup();

    expect(input.hasAttribute("aria-describedby")).toBe(false);
    expect(helpText.hasAttribute("id")).toBe(false);
  });

  it("should connect element to multiple describers", () => {
    const input = document.createElement("input");
    const helpText = document.createElement("span");
    const errorMsg = document.createElement("span");
    container.appendChild(input);
    container.appendChild(helpText);
    container.appendChild(errorMsg);

    const cleanup = connectAriaDescribedBy(input, [helpText, errorMsg]);

    // Both should have IDs
    expect(helpText.id).toMatch(/^desc-[a-f0-9]{8}$/);
    expect(errorMsg.id).toMatch(/^desc-[a-f0-9]{8}$/);
    expect(helpText.id).not.toBe(errorMsg.id);

    // aria-describedby should reference both
    expect(input.getAttribute("aria-describedby")).toBe(
      `${helpText.id} ${errorMsg.id}`
    );

    cleanup();

    expect(input.hasAttribute("aria-describedby")).toBe(false);
  });

  it("should preserve existing IDs on describers", () => {
    const input = document.createElement("input");
    const helpText = document.createElement("span");
    helpText.id = "existing-help-id";
    container.appendChild(input);
    container.appendChild(helpText);

    const cleanup = connectAriaDescribedBy(input, [helpText]);

    expect(input.getAttribute("aria-describedby")).toBe("existing-help-id");
    expect(helpText.id).toBe("existing-help-id");

    cleanup();

    // Should preserve user-provided ID
    expect(helpText.id).toBe("existing-help-id");
  });

  it("should append to existing aria-describedby", () => {
    const input = document.createElement("input");
    input.setAttribute("aria-describedby", "original-id");
    const helpText = document.createElement("span");
    container.appendChild(input);
    container.appendChild(helpText);

    const cleanup = connectAriaDescribedBy(input, [helpText]);

    expect(input.getAttribute("aria-describedby")).toMatch(
      /^original-id desc-[a-f0-9]{8}$/
    );

    cleanup();

    expect(input.getAttribute("aria-describedby")).toBe("original-id");
  });

  it("should handle empty describers array", () => {
    const input = document.createElement("input");
    container.appendChild(input);

    const cleanup = connectAriaDescribedBy(input, []);

    expect(input.hasAttribute("aria-describedby")).toBe(false);
    cleanup(); // Should not throw
  });
});

describe("connectSingleDescriber", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should connect single describer", () => {
    const button = document.createElement("button");
    const tooltip = document.createElement("div");
    container.appendChild(button);
    container.appendChild(tooltip);

    const cleanup = connectSingleDescriber(button, tooltip);

    expect(tooltip.id).toMatch(/^desc-[a-f0-9]{8}$/);
    expect(button.getAttribute("aria-describedby")).toBe(tooltip.id);

    cleanup();

    expect(button.hasAttribute("aria-describedby")).toBe(false);
  });
});

describe("addAriaDescriber", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should add describer to element without existing describedby", () => {
    const input = document.createElement("input");
    const helpText = document.createElement("span");
    container.appendChild(input);
    container.appendChild(helpText);

    const cleanup = addAriaDescriber(input, helpText);

    expect(helpText.id).toMatch(/^desc-[a-f0-9]{8}$/);
    expect(input.getAttribute("aria-describedby")).toBe(helpText.id);

    cleanup();

    expect(input.hasAttribute("aria-describedby")).toBe(false);
  });

  it("should add describer to existing describedby list", () => {
    const input = document.createElement("input");
    input.setAttribute("aria-describedby", "existing-id");
    const helpText = document.createElement("span");
    container.appendChild(input);
    container.appendChild(helpText);

    const cleanup = addAriaDescriber(input, helpText);

    expect(input.getAttribute("aria-describedby")).toMatch(
      /^existing-id desc-[a-f0-9]{8}$/
    );

    cleanup();

    expect(input.getAttribute("aria-describedby")).toBe("existing-id");
  });

  it("should not add duplicate IDs", () => {
    const input = document.createElement("input");
    const helpText = document.createElement("span");
    helpText.id = "help-id";
    input.setAttribute("aria-describedby", "help-id");
    container.appendChild(input);
    container.appendChild(helpText);

    const cleanup = addAriaDescriber(input, helpText);

    expect(input.getAttribute("aria-describedby")).toBe("help-id");

    cleanup(); // Should not throw or change anything
    expect(input.getAttribute("aria-describedby")).toBe("help-id");
  });

  it("should support multiple independent describers", () => {
    const input = document.createElement("input");
    const helpText = document.createElement("span");
    const errorMsg = document.createElement("span");
    container.appendChild(input);
    container.appendChild(helpText);
    container.appendChild(errorMsg);

    const cleanup1 = addAriaDescriber(input, helpText);
    const cleanup2 = addAriaDescriber(input, errorMsg);

    // Both IDs should be in describedby
    const describedBy = input.getAttribute("aria-describedby") ?? "";
    expect(describedBy).toContain(helpText.id);
    expect(describedBy).toContain(errorMsg.id);

    // Remove only the second describer
    cleanup2();
    expect(input.getAttribute("aria-describedby")).toBe(helpText.id);

    // Remove the first describer
    cleanup1();
    expect(input.hasAttribute("aria-describedby")).toBe(false);
  });
});
