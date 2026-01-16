import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Import the component to register it
import "../src/components/button/button.js";
import type { DsButton } from "../src/components/button/button.js";

describe("ds-button", () => {
  let button: DsButton;

  beforeEach(() => {
    button = document.createElement("ds-button") as DsButton;
    document.body.appendChild(button);
  });

  afterEach(() => {
    document.body.removeChild(button);
  });

  describe("initialization", () => {
    it("should be defined as a custom element", () => {
      expect(customElements.get("ds-button")).toBeDefined();
    });

    it("should have default variant of primary", () => {
      expect(button.variant).toBe("primary");
    });

    it("should have default size of md", () => {
      expect(button.size).toBe("md");
    });

    it("should not be disabled by default", () => {
      expect(button.disabled).toBe(false);
    });

    it("should not be loading by default", () => {
      expect(button.loading).toBe(false);
    });

    it("should have default type of button", () => {
      expect(button.type).toBe("button");
    });
  });

  describe("rendering", () => {
    it("should render a button element", async () => {
      await button.updateComplete;
      const innerButton = button.querySelector("button");
      expect(innerButton).not.toBeNull();
    });

    it("should render with ds-button class", async () => {
      await button.updateComplete;
      const innerButton = button.querySelector("button");
      expect(innerButton?.classList.contains("ds-button")).toBe(true);
    });

    it("should render content wrapper span", async () => {
      await button.updateComplete;

      // The button should contain a span for content
      const contentSpan = button.querySelector("span");
      expect(contentSpan).not.toBeNull();
    });

    it("should apply variant class", async () => {
      button.variant = "secondary";
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.classList.contains("ds-button--secondary")).toBe(true);
    });

    it("should apply size class", async () => {
      button.size = "lg";
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.classList.contains("ds-button--lg")).toBe(true);
    });
  });

  describe("disabled state", () => {
    it("should set disabled attribute on inner button", async () => {
      button.disabled = true;
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.disabled).toBe(true);
    });

    it("should have aria-disabled when disabled", async () => {
      button.disabled = true;
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.getAttribute("aria-disabled")).toBe("true");
    });

    it("should apply disabled class", async () => {
      button.disabled = true;
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.classList.contains("ds-button--disabled")).toBe(true);
    });

    it("should not dispatch click when disabled", async () => {
      button.disabled = true;
      await button.updateComplete;

      const clickHandler = vi.fn();
      button.addEventListener("click", clickHandler);

      const innerButton = button.querySelector("button");
      innerButton?.click();

      expect(clickHandler).not.toHaveBeenCalled();
    });
  });

  describe("loading state", () => {
    it("should show spinner when loading", async () => {
      button.loading = true;
      await button.updateComplete;

      const spinner = button.querySelector(".ds-button__spinner");
      expect(spinner).not.toBeNull();
    });

    it("should have aria-busy when loading", async () => {
      button.loading = true;
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.getAttribute("aria-busy")).toBe("true");
    });

    it("should apply loading class", async () => {
      button.loading = true;
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.classList.contains("ds-button--loading")).toBe(true);
    });

    it("should not dispatch click when loading", async () => {
      button.loading = true;
      await button.updateComplete;

      const clickHandler = vi.fn();
      button.addEventListener("click", clickHandler);

      const innerButton = button.querySelector("button");
      innerButton?.click();

      expect(clickHandler).not.toHaveBeenCalled();
    });
  });

  describe("keyboard interaction", () => {
    it("should trigger ds:press on Enter key", async () => {
      await button.updateComplete;

      const pressHandler = vi.fn();
      button.addEventListener("ds:press", pressHandler);

      const innerButton = button.querySelector("button");
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      });
      innerButton?.dispatchEvent(event);

      expect(pressHandler).toHaveBeenCalled();
    });

    it("should trigger ds:press on Space key", async () => {
      await button.updateComplete;

      const pressHandler = vi.fn();
      button.addEventListener("ds:press", pressHandler);

      const innerButton = button.querySelector("button");
      const event = new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
      });
      innerButton?.dispatchEvent(event);

      expect(pressHandler).toHaveBeenCalled();
    });

    it("should not trigger ds:press on Enter when disabled", async () => {
      button.disabled = true;
      await button.updateComplete;

      const pressHandler = vi.fn();
      button.addEventListener("ds:press", pressHandler);

      const innerButton = button.querySelector("button");
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      });
      innerButton?.dispatchEvent(event);

      expect(pressHandler).not.toHaveBeenCalled();
    });
  });

  describe("single event emission (regression tests)", () => {
    it("should emit exactly one ds:press event on mouse click", async () => {
      await button.updateComplete;

      let eventCount = 0;
      button.addEventListener("ds:press", () => eventCount++);

      const innerButton = button.querySelector("button");
      innerButton?.click();

      expect(eventCount).toBe(1);
    });

    it("should emit exactly one ds:press event on Enter key", async () => {
      await button.updateComplete;

      let eventCount = 0;
      button.addEventListener("ds:press", () => eventCount++);

      const innerButton = button.querySelector("button");
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      });
      innerButton?.dispatchEvent(event);

      expect(eventCount).toBe(1);
    });

    it("should emit exactly one ds:press event on Space key", async () => {
      await button.updateComplete;

      let eventCount = 0;
      button.addEventListener("ds:press", () => eventCount++);

      const innerButton = button.querySelector("button");
      const event = new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
      });
      innerButton?.dispatchEvent(event);

      expect(eventCount).toBe(1);
    });

    it("should include isKeyboard:true for keyboard activation", async () => {
      await button.updateComplete;

      let capturedDetail: { isKeyboard: boolean } | null = null;
      button.addEventListener("ds:press", ((e: CustomEvent) => {
        capturedDetail = e.detail;
      }) as EventListener);

      const innerButton = button.querySelector("button");
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      });
      innerButton?.dispatchEvent(event);

      expect(capturedDetail).not.toBeNull();
      expect(capturedDetail?.isKeyboard).toBe(true);
    });

    it("should include isKeyboard:false for mouse click", async () => {
      await button.updateComplete;

      let capturedDetail: { isKeyboard: boolean } | null = null;
      button.addEventListener("ds:press", ((e: CustomEvent) => {
        capturedDetail = e.detail;
      }) as EventListener);

      const innerButton = button.querySelector("button");
      innerButton?.click();

      expect(capturedDetail).not.toBeNull();
      expect(capturedDetail?.isKeyboard).toBe(false);
    });
  });

  describe("variants", () => {
    const variants = ["primary", "secondary", "ghost", "destructive"] as const;

    for (const variant of variants) {
      it(`should support ${variant} variant`, async () => {
        button.variant = variant;
        await button.updateComplete;

        const innerButton = button.querySelector("button");
        expect(innerButton?.classList.contains(`ds-button--${variant}`)).toBe(true);
      });
    }
  });

  describe("sizes", () => {
    const sizes = ["sm", "md", "lg"] as const;

    for (const size of sizes) {
      it(`should support ${size} size`, async () => {
        button.size = size;
        await button.updateComplete;

        const innerButton = button.querySelector("button");
        expect(innerButton?.classList.contains(`ds-button--${size}`)).toBe(true);
      });
    }
  });

  describe("type attribute", () => {
    it("should set type attribute on inner button", async () => {
      button.type = "submit";
      await button.updateComplete;

      const innerButton = button.querySelector("button");
      expect(innerButton?.type).toBe("submit");
    });
  });
});
