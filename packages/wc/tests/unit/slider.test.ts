import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/slider/index.js";

describe("DsSlider", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("should render slider with track and thumb", async () => {
      render(html`<ds-slider min="0" max="100"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const slider = container.querySelector("ds-slider");
      const track = slider?.querySelector(".ds-slider__track");
      const thumb = slider?.querySelector("[role='slider']");

      expect(track).toBeTruthy();
      expect(thumb).toBeTruthy();
    });

    it("should have correct ARIA attributes", async () => {
      render(html`<ds-slider min="0" max="100" value="50"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']");

      expect(thumb?.getAttribute("aria-valuemin")).toBe("0");
      expect(thumb?.getAttribute("aria-valuemax")).toBe("100");
      expect(thumb?.getAttribute("aria-valuenow")).toBe("50");
    });
  });

  describe("value", () => {
    it("should accept initial value", async () => {
      render(html`<ds-slider min="0" max="100" value="25"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const slider = container.querySelector("ds-slider") as HTMLElement & { value: number };
      expect(slider?.value).toBe(25);
    });

    it("should reflect value in ARIA attributes", async () => {
      render(html`<ds-slider min="0" max="100" value="75"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']");
      expect(thumb?.getAttribute("aria-valuenow")).toBe("75");
    });
  });

  describe("keyboard navigation", () => {
    it("should increment on ArrowRight", async () => {
      render(html`<ds-slider min="0" max="100" step="10" value="50"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']") as HTMLElement;
      thumb?.focus();
      thumb?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const slider = container.querySelector("ds-slider") as HTMLElement & { value: number };
      expect(slider?.value).toBe(60);
    });

    it("should decrement on ArrowLeft", async () => {
      render(html`<ds-slider min="0" max="100" step="10" value="50"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']") as HTMLElement;
      thumb?.focus();
      thumb?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const slider = container.querySelector("ds-slider") as HTMLElement & { value: number };
      expect(slider?.value).toBe(40);
    });

    it("should go to min on Home", async () => {
      render(html`<ds-slider min="0" max="100" value="50"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']") as HTMLElement;
      thumb?.focus();
      thumb?.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const slider = container.querySelector("ds-slider") as HTMLElement & { value: number };
      expect(slider?.value).toBe(0);
    });

    it("should go to max on End", async () => {
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

  describe("range mode", () => {
    it("should render two thumbs in range mode", async () => {
      render(html`<ds-slider min="0" max="100" range></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumbs = container.querySelectorAll("[role='slider']");
      expect(thumbs.length).toBe(2);
    });

    it("should accept range values via rangeMin and rangeMax", async () => {
      render(
        html`<ds-slider min="0" max="100" range range-min="20" range-max="80"></ds-slider>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const slider = container.querySelector("ds-slider") as HTMLElement & {
        rangeMin: number;
        rangeMax: number;
      };
      expect(slider?.rangeMin).toBe(20);
      expect(slider?.rangeMax).toBe(80);
    });

    it("should have min thumb with correct ARIA attributes", async () => {
      render(
        html`<ds-slider min="0" max="100" range range-min="20" range-max="80"></ds-slider>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const minThumb = container.querySelector("[data-thumb='min']");
      expect(minThumb?.getAttribute("aria-valuenow")).toBe("20");
    });

    it("should have max thumb with correct ARIA attributes", async () => {
      render(
        html`<ds-slider min="0" max="100" range range-min="20" range-max="80"></ds-slider>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const maxThumb = container.querySelector("[data-thumb='max']");
      expect(maxThumb?.getAttribute("aria-valuenow")).toBe("80");
    });
  });

  describe("orientation", () => {
    it("should default to horizontal", async () => {
      render(html`<ds-slider min="0" max="100"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const slider = container.querySelector("ds-slider") as HTMLElement & {
        orientation: string;
      };
      expect(slider?.orientation).toBe("horizontal");
    });

    it("should support vertical orientation", async () => {
      render(html`<ds-slider min="0" max="100" orientation="vertical"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']");
      expect(thumb?.getAttribute("aria-orientation")).toBe("vertical");
    });
  });

  describe("disabled state", () => {
    it("should not respond to keyboard when disabled", async () => {
      render(html`<ds-slider min="0" max="100" value="50" disabled></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']") as HTMLElement;
      thumb?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const slider = container.querySelector("ds-slider") as HTMLElement & { value: number };
      expect(slider?.value).toBe(50);
    });

    it("should have aria-disabled when disabled", async () => {
      render(html`<ds-slider min="0" max="100" disabled></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']");
      expect(thumb?.getAttribute("aria-disabled")).toBe("true");
    });

    it("should have negative tabindex when disabled", async () => {
      render(html`<ds-slider min="0" max="100" disabled></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']");
      expect(thumb?.getAttribute("tabindex")).toBe("-1");
    });
  });

  describe("step", () => {
    it("should respect step on keyboard navigation", async () => {
      render(html`<ds-slider min="0" max="100" step="5" value="50"></ds-slider>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const thumb = container.querySelector("[role='slider']") as HTMLElement;
      thumb?.focus();
      thumb?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const slider = container.querySelector("ds-slider") as HTMLElement & { value: number };
      expect(slider?.value).toBe(55);
    });
  });
});
