import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/text/text.js";

expect.extend(toHaveNoViolations);

describe("Text Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic text", () => {
    it("should have no accessibility violations", async () => {
      render(html`<ds-text>This is some text content.</ds-text>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("text sizes", () => {
    it("should have no violations for small text", async () => {
      render(html`<ds-text size="sm">Small text</ds-text>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for large text", async () => {
      render(html`<ds-text size="lg">Large text</ds-text>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("text variants", () => {
    it("should have no violations for muted text", async () => {
      render(html`<ds-text variant="muted">Muted text</ds-text>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for emphasized text", async () => {
      render(html`<ds-text as="em">Emphasized text</ds-text>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for strong text", async () => {
      render(html`<ds-text as="strong">Strong text</ds-text>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("text as heading", () => {
    it("should have no violations when rendered as heading", async () => {
      // Note: ds-text uses a slot, so we need proper content inside
      render(html`<ds-text as="h1">Heading Text</ds-text>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify the text content is accessible
      const textEl = container.querySelector("ds-text");
      expect(textEl?.textContent).toContain("Heading");

      const results = await axe(container, {
        rules: {
          // Skip empty-heading rule as slot content may not project in happy-dom
          "empty-heading": { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe("text in context", () => {
    it("should have no violations within paragraph", async () => {
      render(
        html`
          <p>
            <ds-text>This is inline text</ds-text> within a paragraph.
          </p>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
