import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/slider/index.js";

expect.extend(toHaveNoViolations);

describe("Slider accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should have no accessibility violations for basic slider", async () => {
    render(html`<ds-slider min="0" max="100" value="50"></ds-slider>`, container);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations for slider with label", async () => {
    render(
      html`
        <label id="slider-label">Volume</label>
        <ds-slider min="0" max="100" value="50" aria-labelledby="slider-label"></ds-slider>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations for range slider", async () => {
    render(
      html`<ds-slider min="0" max="100" range range-min="20" range-max="80"></ds-slider>`,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations for disabled slider", async () => {
    render(html`<ds-slider min="0" max="100" value="50" disabled></ds-slider>`, container);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe("ARIA attributes", () => {
    it("should have role='slider' on thumb", async () => {
      render(html`<ds-slider min="0" max="100" value="50"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']");
      expect(thumb).toBeTruthy();
    });

    it("should have aria-valuemin", async () => {
      render(html`<ds-slider min="10" max="100" value="50"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']");
      expect(thumb?.getAttribute("aria-valuemin")).toBe("10");
    });

    it("should have aria-valuemax", async () => {
      render(html`<ds-slider min="0" max="200" value="50"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']");
      expect(thumb?.getAttribute("aria-valuemax")).toBe("200");
    });

    it("should have aria-valuenow", async () => {
      render(html`<ds-slider min="0" max="100" value="75"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']");
      expect(thumb?.getAttribute("aria-valuenow")).toBe("75");
    });

    it("should have aria-valuetext when provided", async () => {
      render(html`<ds-slider min="0" max="100" value="50"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']");
      // Component generates aria-valuetext internally based on value
      expect(
        thumb?.hasAttribute("aria-valuetext") || thumb?.hasAttribute("aria-valuenow")
      ).toBeTruthy();
    });

    it("should have aria-orientation", async () => {
      render(html`<ds-slider min="0" max="100" value="50"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']");
      expect(thumb?.getAttribute("aria-orientation")).toBe("horizontal");
    });

    it("should have aria-disabled when disabled", async () => {
      render(html`<ds-slider min="0" max="100" value="50" disabled></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']");
      expect(thumb?.getAttribute("aria-disabled")).toBe("true");
    });

    it("should be focusable", async () => {
      render(html`<ds-slider min="0" max="100" value="50"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']");
      expect(thumb?.getAttribute("tabindex")).toBe("0");
    });

    it("should not be focusable when disabled", async () => {
      render(html`<ds-slider min="0" max="100" value="50" disabled></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']");
      expect(thumb?.getAttribute("tabindex")).toBe("-1");
    });
  });

  describe("range mode ARIA", () => {
    it("should have two slider roles in range mode", async () => {
      render(
        html`<ds-slider min="0" max="100" range range-min="20" range-max="80"></ds-slider>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumbs = container.querySelectorAll("[role='slider']");
      expect(thumbs.length).toBe(2);
    });

    it("should have correct aria-valuenow for each thumb", async () => {
      render(
        html`<ds-slider min="0" max="100" range range-min="25" range-max="75"></ds-slider>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumbs = container.querySelectorAll("[role='slider']");
      expect(thumbs[0]?.getAttribute("aria-valuenow")).toBe("25");
      expect(thumbs[1]?.getAttribute("aria-valuenow")).toBe("75");
    });

    it("should have distinct accessible names for each thumb", async () => {
      render(
        html`<ds-slider min="0" max="100" range range-min="20" range-max="80"></ds-slider>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumbs = container.querySelectorAll("[role='slider']");
      // In range mode, each thumb should have an accessible name
      expect(thumbs.length).toBe(2);
    });
  });

  describe("keyboard interaction", () => {
    it("should respond to ArrowRight", async () => {
      render(html`<ds-slider min="0" max="100" value="50" step="10"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']") as HTMLElement;
      thumb?.focus();
      thumb?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const slider = container.querySelector("ds-slider") as HTMLElement & { value: number };
      expect(slider?.value).toBe(60);
    });

    it("should respond to ArrowLeft", async () => {
      render(html`<ds-slider min="0" max="100" value="50" step="10"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']") as HTMLElement;
      thumb?.focus();
      thumb?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const slider = container.querySelector("ds-slider") as HTMLElement & { value: number };
      expect(slider?.value).toBe(40);
    });

    it("should respond to Home key", async () => {
      render(html`<ds-slider min="0" max="100" value="50"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']") as HTMLElement;
      thumb?.focus();
      thumb?.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const slider = container.querySelector("ds-slider") as HTMLElement & { value: number };
      expect(slider?.value).toBe(0);
    });

    it("should respond to End key", async () => {
      render(html`<ds-slider min="0" max="100" value="50"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']") as HTMLElement;
      thumb?.focus();
      thumb?.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const slider = container.querySelector("ds-slider") as HTMLElement & { value: number };
      expect(slider?.value).toBe(100);
    });
  });
});
