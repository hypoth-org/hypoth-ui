/**
 * Tests for ARIA describedby utility
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  addAriaDescriber,
  connectAriaDescribedBy,
  connectSingleDescriber,
} from "../src/aria/describedby.js";
import { resetAriaIdCounter } from "../src/aria/id-generator.js";

describe("connectAriaDescribedBy", () => {
  let container: HTMLElement;

  beforeEach(() => {
    resetAriaIdCounter();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    resetAriaIdCounter();
  });

  it("should connect element to single describer", () => {
    const input = document.createElement("input");
    const helpText = document.createElement("span");
    helpText.textContent = "Help text";
    container.appendChild(input);
    container.appendChild(helpText);

    const cleanup = connectAriaDescribedBy(input, [helpText]);

    expect(input.getAttribute("aria-describedby")).toBe("desc-1");
    expect(helpText.id).toBe("desc-1");

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

    expect(input.getAttribute("aria-describedby")).toBe("desc-1 desc-2");
    expect(helpText.id).toBe("desc-1");
    expect(errorMsg.id).toBe("desc-2");

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

    expect(input.getAttribute("aria-describedby")).toBe("original-id desc-1");

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
    resetAriaIdCounter();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    resetAriaIdCounter();
  });

  it("should connect single describer", () => {
    const button = document.createElement("button");
    const tooltip = document.createElement("div");
    container.appendChild(button);
    container.appendChild(tooltip);

    const cleanup = connectSingleDescriber(button, tooltip);

    expect(button.getAttribute("aria-describedby")).toBe("desc-1");
    expect(tooltip.id).toBe("desc-1");

    cleanup();

    expect(button.hasAttribute("aria-describedby")).toBe(false);
  });
});

describe("addAriaDescriber", () => {
  let container: HTMLElement;

  beforeEach(() => {
    resetAriaIdCounter();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    resetAriaIdCounter();
  });

  it("should add describer to element without existing describedby", () => {
    const input = document.createElement("input");
    const helpText = document.createElement("span");
    container.appendChild(input);
    container.appendChild(helpText);

    const cleanup = addAriaDescriber(input, helpText);

    expect(input.getAttribute("aria-describedby")).toBe("desc-1");

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

    expect(input.getAttribute("aria-describedby")).toBe("existing-id desc-1");

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

    expect(input.getAttribute("aria-describedby")).toBe("desc-1 desc-2");

    // Remove only the second describer
    cleanup2();
    expect(input.getAttribute("aria-describedby")).toBe("desc-1");

    // Remove the first describer
    cleanup1();
    expect(input.hasAttribute("aria-describedby")).toBe(false);
  });
});
