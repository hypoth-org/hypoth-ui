import { afterEach, beforeEach, describe, expect, it } from "vitest";

// Import components to register them
import "../../src/components/button/button.js";
import "../../src/components/input/input.js";
import type { DsButton } from "../../src/components/button/button.js";
import type { DsInput } from "../../src/components/input/input.js";

describe("Light DOM Rendering", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("DsButton", () => {
    it("should render in Shadow DOM for slot content projection", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await button.updateComplete;

      expect(button.shadowRoot).not.toBeNull();
    });

    it("should be queryable via shadowRoot", async () => {
      const button = document.createElement("ds-button") as DsButton;
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.shadowRoot!.querySelector("button.ds-button");
      expect(innerButton).not.toBeNull();
    });

    it("should apply CSS classes to inner elements", async () => {
      const button = document.createElement("ds-button") as DsButton;
      button.variant = "primary";
      container.appendChild(button);
      await button.updateComplete;

      const innerButton = button.shadowRoot!.querySelector("button");
      expect(innerButton?.classList.contains("ds-button--primary")).toBe(true);
    });
  });

  describe("DsInput", () => {
    it("should render in Light DOM (no shadow root)", async () => {
      const input = document.createElement("ds-input") as DsInput;
      container.appendChild(input);
      await input.updateComplete;

      expect(input.shadowRoot).toBeNull();
    });

    it("should be queryable from parent with standard DOM APIs", async () => {
      const input = document.createElement("ds-input") as DsInput;
      container.appendChild(input);
      await input.updateComplete;

      const innerInput = container.querySelector("input.ds-input__field");
      expect(innerInput).not.toBeNull();
    });

    it("should allow external CSS to style internal elements", async () => {
      // Add a style that targets the internal input
      const style = document.createElement("style");
      style.textContent = ".ds-input__field { border: 2px solid red; }";
      document.head.appendChild(style);

      const input = document.createElement("ds-input") as DsInput;
      container.appendChild(input);
      await input.updateComplete;

      const innerInput = input.querySelector("input");
      expect(innerInput).not.toBeNull();
      const computedStyle = getComputedStyle(innerInput as HTMLInputElement);

      // In Light DOM, external styles apply directly
      expect(computedStyle.borderColor).toBe("red");

      style.remove();
    });
  });

  describe("General Light DOM Benefits", () => {
    it("should support querySelector for Light DOM components", async () => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = "<ds-button>Click</ds-button><ds-input></ds-input>";
      container.appendChild(wrapper);

      // Wait for all components to render
      const button = wrapper.querySelector("ds-button") as DsButton;
      const input = wrapper.querySelector("ds-input") as DsInput;
      await Promise.all([button.updateComplete, input.updateComplete]);

      // Input uses Light DOM — queryable from parent
      const inputs = wrapper.querySelectorAll("input");
      expect(inputs.length).toBe(1);

      // Button uses Shadow DOM — queryable via shadowRoot
      const innerButton = button.shadowRoot!.querySelector("button");
      expect(innerButton).not.toBeNull();
    });
  });
});
