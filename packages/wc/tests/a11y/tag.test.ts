import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/tag/tag.js";

expect.extend(toHaveNoViolations);

describe("Tag Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic tag", () => {
    it("should have no accessibility violations", async () => {
      render(html`<ds-tag>JavaScript</ds-tag>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("tag variants", () => {
    it("should have no violations for default variant", async () => {
      render(html`<ds-tag variant="default">Default</ds-tag>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for secondary variant", async () => {
      render(html`<ds-tag variant="secondary">Secondary</ds-tag>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for destructive variant", async () => {
      render(html`<ds-tag variant="destructive">Error</ds-tag>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for outline variant", async () => {
      render(html`<ds-tag variant="outline">Outline</ds-tag>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("removable tag", () => {
    it("should have no violations with remove button", async () => {
      render(
        html`
          <ds-tag removable>
            React
            <button slot="remove" aria-label="Remove React tag">×</button>
          </ds-tag>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("tag group", () => {
    it("should have no violations for tag group", async () => {
      render(
        html`
          <div role="group" aria-label="Technologies">
            <ds-tag>React</ds-tag>
            <ds-tag>TypeScript</ds-tag>
            <ds-tag>Node.js</ds-tag>
          </div>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("interactive tag", () => {
    it("should have no violations when clickable", async () => {
      render(
        html`
          <ds-tag role="button" tabindex="0" aria-pressed="false">
            Filter: Active
          </ds-tag>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations when selected", async () => {
      render(
        html`
          <ds-tag role="button" tabindex="0" aria-pressed="true">
            Filter: Active
          </ds-tag>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
