import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/badge/badge.js";

expect.extend(toHaveNoViolations);

describe("Badge Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic badge", () => {
    it("should have no accessibility violations", async () => {
      render(html`<ds-badge>New</ds-badge>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with numeric content", async () => {
      render(html`<ds-badge>42</ds-badge>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("badge variants", () => {
    it("should have no violations for default variant", async () => {
      render(html`<ds-badge variant="default">Default</ds-badge>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for secondary variant", async () => {
      render(html`<ds-badge variant="secondary">Secondary</ds-badge>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for destructive variant", async () => {
      render(html`<ds-badge variant="destructive">Error</ds-badge>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for outline variant", async () => {
      render(html`<ds-badge variant="outline">Outline</ds-badge>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("badge with status role", () => {
    it("should have no violations when used as status indicator", async () => {
      render(
        html`<ds-badge role="status" aria-label="3 new notifications">3</ds-badge>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
