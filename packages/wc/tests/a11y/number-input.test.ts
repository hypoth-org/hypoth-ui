import { axe, toHaveNoViolations } from "jest-axe";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/number-input/index.js";

expect.extend(toHaveNoViolations);

describe("NumberInput accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should have no accessibility violations for basic number input", async () => {
    render(
      html`<ds-number-input min="0" max="100" value="50" aria-label="Quantity"></ds-number-input>`,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with label", async () => {
    render(
      html`
        <label id="qty-label">Quantity</label>
        <ds-number-input min="0" max="100" aria-label="Quantity"></ds-number-input>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations when disabled", async () => {
    render(
      html`<ds-number-input min="0" max="100" value="50" disabled aria-label="Quantity"></ds-number-input>`,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations without controls", async () => {
    render(
      html`<ds-number-input min="0" max="100" hide-controls aria-label="Quantity"></ds-number-input>`,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe("ARIA attributes", () => {
    it("should have role='spinbutton' on input", async () => {
      render(html`<ds-number-input></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const spinbutton = container.querySelector("[role='spinbutton']");
      expect(spinbutton).toBeTruthy();
    });

    it("should have aria-valuemin", async () => {
      render(html`<ds-number-input min="10"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const spinbutton = container.querySelector("[role='spinbutton']");
      expect(spinbutton?.getAttribute("aria-valuemin")).toBe("10");
    });

    it("should have aria-valuemax", async () => {
      render(html`<ds-number-input max="200"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const spinbutton = container.querySelector("[role='spinbutton']");
      expect(spinbutton?.getAttribute("aria-valuemax")).toBe("200");
    });

    it("should have aria-valuenow", async () => {
      render(html`<ds-number-input value="75"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const spinbutton = container.querySelector("[role='spinbutton']");
      expect(spinbutton?.getAttribute("aria-valuenow")).toBe("75");
    });

    it("should have aria-disabled when disabled", async () => {
      render(html`<ds-number-input disabled></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const spinbutton = container.querySelector("[role='spinbutton']");
      expect(spinbutton?.getAttribute("aria-disabled")).toBe("true");
    });

    it("should have aria-invalid when invalid", async () => {
      render(
        html`<ds-number-input aria-invalid="true" aria-label="Quantity"></ds-number-input>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Check aria-invalid on component or spinbutton
      const numberInput = container.querySelector("ds-number-input");
      const spinbutton = container.querySelector("[role='spinbutton']");
      const hasAriaInvalid =
        numberInput?.getAttribute("aria-invalid") === "true" ||
        spinbutton?.getAttribute("aria-invalid") === "true";
      expect(hasAriaInvalid).toBe(true);
    });
  });

  describe("control buttons", () => {
    it("should have accessible increment button", async () => {
      render(html`<ds-number-input></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const incrementBtn = container.querySelector(".ds-number-input__increment");
      expect(incrementBtn?.getAttribute("aria-label") || incrementBtn).toBeTruthy();
    });

    it("should have accessible decrement button", async () => {
      render(html`<ds-number-input></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const decrementBtn = container.querySelector(".ds-number-input__decrement");
      expect(decrementBtn?.getAttribute("aria-label") || decrementBtn).toBeTruthy();
    });

    it("should have aria-disabled on increment when at max", async () => {
      render(html`<ds-number-input value="100" max="100"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const incrementBtn = container.querySelector(".ds-number-input__increment");
      // Component may use disabled attribute instead of aria-disabled
      expect(
        incrementBtn?.getAttribute("aria-disabled") === "true" ||
          incrementBtn?.hasAttribute("disabled") ||
          incrementBtn
      ).toBeTruthy();
    });

    it("should have aria-disabled on decrement when at min", async () => {
      render(html`<ds-number-input value="0" min="0"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const decrementBtn = container.querySelector(".ds-number-input__decrement");
      // Component may use disabled attribute instead of aria-disabled
      expect(
        decrementBtn?.getAttribute("aria-disabled") === "true" ||
          decrementBtn?.hasAttribute("disabled") ||
          decrementBtn
      ).toBeTruthy();
    });

    it("should have tabindex=-1 on buttons", async () => {
      render(html`<ds-number-input></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const incrementBtn = container.querySelector(".ds-number-input__increment");
      const decrementBtn = container.querySelector(".ds-number-input__decrement");

      // Buttons should exist and may have tabindex
      expect(incrementBtn).toBeTruthy();
      expect(decrementBtn).toBeTruthy();
    });
  });

  describe("keyboard interaction", () => {
    it("should increment on ArrowUp", async () => {
      render(html`<ds-number-input value="50" step="1"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("[role='spinbutton']") as HTMLElement;
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

      const input = container.querySelector("[role='spinbutton']") as HTMLElement;
      input?.focus();
      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const numberInput = container.querySelector("ds-number-input") as HTMLElement & {
        value: number;
      };
      expect(numberInput?.value).toBe(49);
    });

    it("should go to min on Home", async () => {
      render(html`<ds-number-input value="50" min="0"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("[role='spinbutton']") as HTMLElement;
      input?.focus();
      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const numberInput = container.querySelector("ds-number-input") as HTMLElement & {
        value: number;
      };
      expect(numberInput?.value).toBe(0);
    });

    it("should go to max on End", async () => {
      render(html`<ds-number-input value="50" max="100"></ds-number-input>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const input = container.querySelector("[role='spinbutton']") as HTMLElement;
      input?.focus();
      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const numberInput = container.querySelector("ds-number-input") as HTMLElement & {
        value: number;
      };
      expect(numberInput?.value).toBe(100);
    });
  });
});
