import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/skeleton/skeleton.js";

expect.extend(toHaveNoViolations);

describe("Skeleton Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic skeleton", () => {
    it("should have no accessibility violations", async () => {
      render(html`<ds-skeleton></ds-skeleton>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with custom dimensions", async () => {
      render(
        html`<ds-skeleton style="width: 200px; height: 20px;"></ds-skeleton>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("skeleton variants", () => {
    it("should have no violations for text skeleton", async () => {
      render(html`<ds-skeleton variant="text"></ds-skeleton>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for circular skeleton", async () => {
      render(html`<ds-skeleton variant="circular"></ds-skeleton>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for rectangular skeleton", async () => {
      render(html`<ds-skeleton variant="rectangular"></ds-skeleton>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("skeleton in loading context", () => {
    it("should have no violations when representing loading content", async () => {
      render(
        html`
          <div aria-busy="true" aria-live="polite">
            <ds-skeleton aria-label="Loading user name"></ds-skeleton>
            <ds-skeleton aria-label="Loading user email"></ds-skeleton>
          </div>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("skeleton group", () => {
    it("should have no violations for multiple skeletons", async () => {
      render(
        html`
          <div role="group" aria-label="Loading content">
            <ds-skeleton style="width: 100%; height: 24px;"></ds-skeleton>
            <ds-skeleton style="width: 80%; height: 16px;"></ds-skeleton>
            <ds-skeleton style="width: 60%; height: 16px;"></ds-skeleton>
          </div>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
