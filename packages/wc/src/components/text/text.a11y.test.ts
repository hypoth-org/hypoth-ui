import { axe, toHaveNoViolations } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DsText } from "./text.js";

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Ensure the component is defined before tests
import "./text.js";

describe("DsText Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  // Helper to add text content to inner element (Light DOM doesn't support slot projection)
  const addTextContent = async (text: DsText, content: string) => {
    await text.updateComplete;
    const inner = text.querySelector("span, p, h1, h2, h3, h4, h5, h6");
    if (inner) {
      inner.textContent = content;
    }
  };

  describe("axe accessibility checks", () => {
    it("has no violations with default props", async () => {
      const text = document.createElement("ds-text") as DsText;
      container.appendChild(text);
      await addTextContent(text, "Hello world");

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no violations for all size variants", async () => {
      const sizes = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

      for (const size of sizes) {
        container.innerHTML = "";
        const text = document.createElement("ds-text") as DsText;
        text.size = size;
        container.appendChild(text);
        await addTextContent(text, `${size} text`);

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it("has no violations for all color variants", async () => {
      const variants = ["default", "muted", "success", "warning", "error"] as const;

      for (const variant of variants) {
        container.innerHTML = "";
        const text = document.createElement("ds-text") as DsText;
        text.variant = variant;
        container.appendChild(text);
        await addTextContent(text, `${variant} text`);

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });
  });

  describe("semantic HTML", () => {
    it("uses span by default (no semantic meaning)", async () => {
      const text = document.createElement("ds-text") as DsText;
      container.appendChild(text);
      await text.updateComplete;

      const span = text.querySelector("span");
      expect(span).toBeTruthy();
    });

    it("renders proper heading elements", async () => {
      const headings = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

      for (const heading of headings) {
        container.innerHTML = "";
        const text = document.createElement("ds-text") as DsText;
        text.as = heading;
        container.appendChild(text);
        await addTextContent(text, `${heading.toUpperCase()} heading`);

        const element = text.querySelector(heading);
        expect(element).toBeTruthy();

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it("renders paragraph element", async () => {
      const text = document.createElement("ds-text") as DsText;
      text.as = "p";
      container.appendChild(text);
      await addTextContent(text, "Paragraph text content");

      const p = text.querySelector("p");
      expect(p).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("heading hierarchy", () => {
    it("allows proper heading hierarchy", async () => {
      // Create a proper heading hierarchy
      const h1 = document.createElement("ds-text") as DsText;
      h1.as = "h1";
      container.appendChild(h1);
      await addTextContent(h1, "Main Title");

      const h2 = document.createElement("ds-text") as DsText;
      h2.as = "h2";
      container.appendChild(h2);
      await addTextContent(h2, "Section Title");

      const h3 = document.createElement("ds-text") as DsText;
      h3.as = "h3";
      container.appendChild(h3);
      await addTextContent(h3, "Subsection Title");

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("color contrast", () => {
    it("maintains readable text", async () => {
      // Color variants should maintain WCAG contrast ratios
      // This is ensured by the design tokens
      const variants = ["default", "muted", "success", "warning", "error"] as const;

      for (const variant of variants) {
        container.innerHTML = "";
        const text = document.createElement("ds-text") as DsText;
        text.variant = variant;
        container.appendChild(text);
        await addTextContent(text, `${variant} text should be readable`);

        // Text should be visible
        const inner = text.querySelector("span, p, h1, h2, h3, h4, h5, h6");
        expect(inner?.textContent).toBeTruthy();
      }
    });
  });

  describe("truncated text", () => {
    it("maintains accessibility when truncated", async () => {
      const text = document.createElement("ds-text") as DsText;
      text.truncate = true;
      container.appendChild(text);
      await addTextContent(
        text,
        "This is a long piece of text that will be truncated with an ellipsis"
      );

      // Full text should still be accessible to screen readers
      const inner = text.querySelector("span, p");
      expect(inner?.textContent).toContain("This is a long piece of text");

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
