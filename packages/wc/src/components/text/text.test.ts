import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DsText } from "./text.js";

// Ensure the component is defined before tests
import "./text.js";

describe("DsText", () => {
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
      const text = document.createElement("ds-text") as DsText;
      text.textContent = "Hello world";
      container.appendChild(text);
      await text.updateComplete;

      const inner = text.querySelector("span");
      expect(inner).toBeTruthy();
      expect(inner?.classList.contains("ds-text")).toBe(true);
      expect(inner?.classList.contains("ds-text--md")).toBe(true);
      expect(inner?.classList.contains("ds-text--normal")).toBe(true);
      expect(inner?.classList.contains("ds-text--default")).toBe(true);
    });

    it("renders text content via slot", async () => {
      const text = document.createElement("ds-text") as DsText;
      text.textContent = "Hello world";
      container.appendChild(text);
      await text.updateComplete;

      expect(text.textContent).toContain("Hello world");
    });
  });

  describe("size variants", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

    for (const size of sizes) {
      it(`renders with size="${size}"`, async () => {
        const text = document.createElement("ds-text") as DsText;
        text.size = size;
        container.appendChild(text);
        await text.updateComplete;

        const inner = text.querySelector("span, p, h1, h2, h3, h4, h5, h6");
        expect(inner?.classList.contains(`ds-text--${size}`)).toBe(true);
      });
    }
  });

  describe("weight variants", () => {
    const weights = ["normal", "medium", "semibold", "bold"] as const;

    for (const weight of weights) {
      it(`renders with weight="${weight}"`, async () => {
        const text = document.createElement("ds-text") as DsText;
        text.weight = weight;
        container.appendChild(text);
        await text.updateComplete;

        const inner = text.querySelector("span, p, h1, h2, h3, h4, h5, h6");
        expect(inner?.classList.contains(`ds-text--${weight}`)).toBe(true);
      });
    }
  });

  describe("color variants", () => {
    const variants = ["default", "muted", "success", "warning", "error"] as const;

    for (const variant of variants) {
      it(`renders with variant="${variant}"`, async () => {
        const text = document.createElement("ds-text") as DsText;
        text.variant = variant;
        container.appendChild(text);
        await text.updateComplete;

        const inner = text.querySelector("span, p, h1, h2, h3, h4, h5, h6");
        expect(inner?.classList.contains(`ds-text--${variant}`)).toBe(true);
      });
    }
  });

  describe("as prop (semantic element)", () => {
    it("renders as span by default", async () => {
      const text = document.createElement("ds-text") as DsText;
      text.textContent = "Default span";
      container.appendChild(text);
      await text.updateComplete;

      const inner = text.querySelector("span.ds-text");
      expect(inner).toBeTruthy();
    });

    it("renders as paragraph when as=p", async () => {
      const text = document.createElement("ds-text") as DsText;
      text.as = "p";
      text.textContent = "Paragraph text";
      container.appendChild(text);
      await text.updateComplete;

      const inner = text.querySelector("p.ds-text");
      expect(inner).toBeTruthy();
    });

    const headings = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
    for (const heading of headings) {
      it(`renders as ${heading} when as=${heading}`, async () => {
        const text = document.createElement("ds-text") as DsText;
        text.as = heading;
        text.textContent = `${heading.toUpperCase()} heading`;
        container.appendChild(text);
        await text.updateComplete;

        const inner = text.querySelector(`${heading}.ds-text`);
        expect(inner).toBeTruthy();
      });
    }

    it("falls back to span with warning for invalid as value", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const text = document.createElement("ds-text") as DsText;
      // @ts-expect-error - Testing invalid value
      text.as = "div";
      container.appendChild(text);
      await text.updateComplete;

      const inner = text.querySelector("span.ds-text");
      expect(inner).toBeTruthy();
      expect(warnSpy).toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });

  describe("truncate", () => {
    it("adds truncate class when truncate=true", async () => {
      const text = document.createElement("ds-text") as DsText;
      text.truncate = true;
      text.textContent = "This is a long text that should be truncated";
      container.appendChild(text);
      await text.updateComplete;

      const inner = text.querySelector("span, p, h1, h2, h3, h4, h5, h6");
      expect(inner?.classList.contains("ds-text--truncate")).toBe(true);
    });

    it("does not add truncate class when truncate=false", async () => {
      const text = document.createElement("ds-text") as DsText;
      text.truncate = false;
      container.appendChild(text);
      await text.updateComplete;

      const inner = text.querySelector("span, p, h1, h2, h3, h4, h5, h6");
      expect(inner?.classList.contains("ds-text--truncate")).toBe(false);
    });
  });

  describe("combined props", () => {
    it("renders with multiple props", async () => {
      const text = document.createElement("ds-text") as DsText;
      text.size = "lg";
      text.weight = "bold";
      text.variant = "success";
      text.as = "h2";
      text.textContent = "Success heading";
      container.appendChild(text);
      await text.updateComplete;

      const inner = text.querySelector("h2");
      expect(inner).toBeTruthy();
      expect(inner?.classList.contains("ds-text--lg")).toBe(true);
      expect(inner?.classList.contains("ds-text--bold")).toBe(true);
      expect(inner?.classList.contains("ds-text--success")).toBe(true);
    });
  });
});
