import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Import components to register them
import "../../src/components/button/button.js";
import "../../src/components/input/input.js";
import type { DsButton } from "../../src/components/button/button.js";
import type { DsInput } from "../../src/components/input/input.js";

describe("Component Events", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("DsButton ds:click event", () => {
    it("should emit ds:click event when clicked", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await button.updateComplete;

      const handler = vi.fn();
      button.addEventListener("ds:click", handler);

      const innerButton = button.querySelector("button");
      innerButton?.click();

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should include originalEvent in detail", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await button.updateComplete;

      const handler = vi.fn();
      button.addEventListener("ds:click", handler);

      const innerButton = button.querySelector("button");
      innerButton?.click();

      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail).toHaveProperty("originalEvent");
    });

    it("should not emit ds:click when disabled", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.disabled = true;
      container.appendChild(button);
      await button.updateComplete;

      const handler = vi.fn();
      button.addEventListener("ds:click", handler);

      const innerButton = button.querySelector("button");
      innerButton?.click();

      expect(handler).not.toHaveBeenCalled();
    });

    it("should bubble to parent elements", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await button.updateComplete;

      const handler = vi.fn();
      container.addEventListener("ds:click", handler);

      const innerButton = button.querySelector("button");
      innerButton?.click();

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe("DsInput ds:change event", () => {
    it("should emit ds:change event when value changes", async () => {
      const input = document.createElement("ds-input") as DsInput;
      container.appendChild(input);
      await input.updateComplete;

      const handler = vi.fn();
      input.addEventListener("ds:change", handler);

      const innerInput = input.querySelector("input") as HTMLInputElement;
      innerInput.value = "test value";
      innerInput.dispatchEvent(new Event("change", { bubbles: true }));

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should include value in detail", async () => {
      const input = document.createElement("ds-input") as DsInput;
      container.appendChild(input);
      await input.updateComplete;

      const handler = vi.fn();
      input.addEventListener("ds:change", handler);

      const innerInput = input.querySelector("input") as HTMLInputElement;
      innerInput.value = "test value";
      innerInput.dispatchEvent(new Event("change", { bubbles: true }));

      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail).toEqual({ value: "test value" });
    });

    it("should bubble to parent elements", async () => {
      const input = document.createElement("ds-input") as DsInput;
      container.appendChild(input);
      await input.updateComplete;

      const handler = vi.fn();
      container.addEventListener("ds:change", handler);

      const innerInput = input.querySelector("input") as HTMLInputElement;
      innerInput.value = "test";
      innerInput.dispatchEvent(new Event("change", { bubbles: true }));

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe("Event composition (composed: true)", () => {
    it("ds:click should have composed: true", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await button.updateComplete;

      const handler = vi.fn();
      button.addEventListener("ds:click", handler);

      const innerButton = button.querySelector("button");
      innerButton?.click();

      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.composed).toBe(true);
    });

    it("ds:change should have composed: true", async () => {
      const input = document.createElement("ds-input") as DsInput;
      container.appendChild(input);
      await input.updateComplete;

      const handler = vi.fn();
      input.addEventListener("ds:change", handler);

      const innerInput = input.querySelector("input") as HTMLInputElement;
      innerInput.value = "test";
      innerInput.dispatchEvent(new Event("change", { bubbles: true }));

      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.composed).toBe(true);
    });
  });
});
