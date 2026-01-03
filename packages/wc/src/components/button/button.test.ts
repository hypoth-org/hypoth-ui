import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DsButton } from "./button.js";

// Ensure the component is defined before tests
import "./button.js";

describe("DsButton", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("renders with default props", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.textContent = "Click me";
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton).toBeTruthy();
      expect(innerButton?.classList.contains("ds-button")).toBe(true);
      expect(innerButton?.classList.contains("ds-button--primary")).toBe(true);
      expect(innerButton?.classList.contains("ds-button--md")).toBe(true);
    });

    it("renders with variant attribute", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.variant = "destructive";
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.classList.contains("ds-button--destructive")).toBe(true);
    });

    it("renders with size attribute", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.size = "lg";
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.classList.contains("ds-button--lg")).toBe(true);
    });
  });

  describe("disabled state", () => {
    it("sets disabled attribute on inner button", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.disabled = true;
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.disabled).toBe(true);
      expect(innerButton?.getAttribute("aria-disabled")).toBe("true");
    });

    it("prevents click events when disabled", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.disabled = true;
      container.appendChild(button);
      await button.updateComplete;

      const clickHandler = vi.fn();
      button.addEventListener("ds:click", clickHandler);

      const innerButton = button.querySelector("button");
      innerButton?.click();

      expect(clickHandler).not.toHaveBeenCalled();
    });
  });

  describe("loading state", () => {
    it("shows spinner when loading", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.loading = true;
      container.appendChild(button);
      await button.updateComplete;

      const spinner = button.querySelector(".ds-button__spinner");
      expect(spinner).toBeTruthy();
    });

    it("sets aria-busy when loading", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.loading = true;
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.getAttribute("aria-busy")).toBe("true");
    });

    it("prevents click events when loading", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.loading = true;
      container.appendChild(button);
      await button.updateComplete;

      const clickHandler = vi.fn();
      button.addEventListener("ds:click", clickHandler);

      const innerButton = button.querySelector("button");
      innerButton?.click();

      expect(clickHandler).not.toHaveBeenCalled();
    });
  });

  describe("events", () => {
    it("emits ds:click event on click", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await button.updateComplete;

      const clickHandler = vi.fn();
      button.addEventListener("ds:click", clickHandler);

      const innerButton = button.querySelector("button");
      innerButton?.click();

      expect(clickHandler).toHaveBeenCalled();
    });

    it("includes original event in ds:click detail", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await button.updateComplete;

      let eventDetail: unknown;
      button.addEventListener("ds:click", ((e: CustomEvent) => {
        eventDetail = e.detail;
      }) as EventListener);

      const innerButton = button.querySelector("button");
      innerButton?.click();

      expect(eventDetail).toHaveProperty("originalEvent");
    });
  });

  describe("keyboard interaction", () => {
    it("activates on Enter key", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await button.updateComplete;

      const clickHandler = vi.fn();
      button.addEventListener("click", clickHandler);

      const innerButton = button.querySelector("button");
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      innerButton?.dispatchEvent(event);

      expect(clickHandler).toHaveBeenCalled();
    });

    it("activates on Space key", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await button.updateComplete;

      const clickHandler = vi.fn();
      button.addEventListener("click", clickHandler);

      const innerButton = button.querySelector("button");
      const event = new KeyboardEvent("keydown", { key: " " });
      innerButton?.dispatchEvent(event);

      expect(clickHandler).toHaveBeenCalled();
    });

    it("does not activate on Enter when disabled", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.disabled = true;
      container.appendChild(button);
      await button.updateComplete;

      const clickHandler = vi.fn();
      button.addEventListener("click", clickHandler);

      const innerButton = button.querySelector("button");
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      innerButton?.dispatchEvent(event);

      expect(clickHandler).not.toHaveBeenCalled();
    });
  });

  describe("type attribute", () => {
    it("defaults to button type", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.type).toBe("button");
    });

    it("can be set to submit", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.type = "submit";
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.type).toBe("submit");
    });
  });
});
