import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/number-input/index.js";

describe("DsNumberInput", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("should render number input with controls", async () => {
      render(html`<ds-number-input></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("input");
      const incrementBtn = container.querySelector(".ds-number-input__increment");
      const decrementBtn = container.querySelector(".ds-number-input__decrement");

      expect(input).toBeTruthy();
      expect(incrementBtn).toBeTruthy();
      expect(decrementBtn).toBeTruthy();
    });

    it("should have spinbutton role", async () => {
      render(html`<ds-number-input></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("[role='spinbutton']");
      expect(input).toBeTruthy();
    });

    it("should hide controls when show-buttons is false", async () => {
      render(html`<ds-number-input .showButtons=${false}></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const incrementBtn = container.querySelector(".ds-number-input__increment");
      const decrementBtn = container.querySelector(".ds-number-input__decrement");

      expect(incrementBtn).toBeFalsy();
      expect(decrementBtn).toBeFalsy();
    });
  });

  describe("value", () => {
    it("should accept initial value", async () => {
      render(html`<ds-number-input value="50"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const numberInput = container.querySelector("ds-number-input") as HTMLElement & {
        value: number;
      };
      expect(numberInput?.value).toBe(50);
    });

    it("should display value in input", async () => {
      render(html`<ds-number-input value="50"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("input") as HTMLInputElement;
      expect(input?.value).toContain("50");
    });
  });

  describe("increment/decrement", () => {
    it("should increment on button click", async () => {
      render(html`<ds-number-input value="50" step="10"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const incrementBtn = container.querySelector(".ds-number-input__increment") as HTMLElement;
      incrementBtn?.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const numberInput = container.querySelector("ds-number-input") as HTMLElement & {
        value: number;
      };
      expect(numberInput?.value).toBe(60);
    });

    it("should decrement on button click", async () => {
      render(html`<ds-number-input value="50" step="10"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const decrementBtn = container.querySelector(".ds-number-input__decrement") as HTMLElement;
      decrementBtn?.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const numberInput = container.querySelector("ds-number-input") as HTMLElement & {
        value: number;
      };
      expect(numberInput?.value).toBe(40);
    });

    it("should not decrement below min", async () => {
      render(html`<ds-number-input value="5" min="0" step="10"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const decrementBtn = container.querySelector(".ds-number-input__decrement") as HTMLElement;
      decrementBtn?.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const numberInput = container.querySelector("ds-number-input") as HTMLElement & {
        value: number;
      };
      expect(numberInput?.value).toBeGreaterThanOrEqual(0);
    });

    it("should not increment above max", async () => {
      render(html`<ds-number-input value="95" max="100" step="10"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const incrementBtn = container.querySelector(".ds-number-input__increment") as HTMLElement;
      incrementBtn?.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const numberInput = container.querySelector("ds-number-input") as HTMLElement & {
        value: number;
      };
      expect(numberInput?.value).toBeLessThanOrEqual(100);
    });
  });

  describe("keyboard navigation", () => {
    it("should increment on ArrowUp", async () => {
      render(html`<ds-number-input value="50" step="1"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("input") as HTMLInputElement;
      input?.focus();
      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const numberInput = container.querySelector("ds-number-input") as HTMLElement & {
        value: number;
      };
      expect(numberInput?.value).toBe(51);
    });

    it("should decrement on ArrowDown", async () => {
      render(html`<ds-number-input value="50" step="1"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("input") as HTMLInputElement;
      input?.focus();
      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const numberInput = container.querySelector("ds-number-input") as HTMLElement & {
        value: number;
      };
      expect(numberInput?.value).toBe(49);
    });
  });

  describe("precision", () => {
    it("should support decimal values", async () => {
      render(
        html`<ds-number-input value="1.5" step="0.1" precision="1"></ds-number-input>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const numberInput = container.querySelector("ds-number-input") as HTMLElement & {
        value: number;
      };
      expect(numberInput?.value).toBeCloseTo(1.5, 1);
    });
  });

  describe("disabled state", () => {
    it("should not respond to clicks when disabled", async () => {
      render(html`<ds-number-input value="50" disabled></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const incrementBtn = container.querySelector(".ds-number-input__increment") as HTMLElement;
      incrementBtn?.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const numberInput = container.querySelector("ds-number-input") as HTMLElement & {
        value: number;
      };
      expect(numberInput?.value).toBe(50);
    });

    it("should have disabled input", async () => {
      render(html`<ds-number-input disabled></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("input") as HTMLInputElement;
      expect(input?.disabled).toBe(true);
    });

    it("should have disabled buttons", async () => {
      render(html`<ds-number-input disabled></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const incrementBtn = container.querySelector(
        ".ds-number-input__increment"
      ) as HTMLButtonElement;
      const decrementBtn = container.querySelector(
        ".ds-number-input__decrement"
      ) as HTMLButtonElement;

      expect(incrementBtn?.disabled).toBe(true);
      expect(decrementBtn?.disabled).toBe(true);
    });
  });

  describe("ARIA attributes", () => {
    it("should have correct ARIA attributes", async () => {
      render(html`<ds-number-input min="0" max="100" value="50"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("[role='spinbutton']");

      expect(input?.getAttribute("aria-valuemin")).toBe("0");
      expect(input?.getAttribute("aria-valuemax")).toBe("100");
      expect(input?.getAttribute("aria-valuenow")).toBe("50");
    });
  });
});
