import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/icon/icon.js";

expect.extend(toHaveNoViolations);

describe("Icon Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("decorative icon", () => {
    it("should have no accessibility violations when decorative", async () => {
      render(
        html`<ds-icon name="star" aria-hidden="true"></ds-icon>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations alongside text", async () => {
      render(
        html`
          <button>
            <ds-icon name="star" aria-hidden="true"></ds-icon>
            Favorite
          </button>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("informative icon", () => {
    it("should have no violations with aria-label", async () => {
      render(
        html`<ds-icon name="check" aria-label="Success"></ds-icon>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with title", async () => {
      render(
        html`
          <ds-icon name="warning" role="img" aria-label="Warning: Action required">
          </ds-icon>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("icon sizes", () => {
    it("should have no violations for small icon", async () => {
      render(
        html`<ds-icon name="star" size="sm" aria-hidden="true"></ds-icon>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for large icon", async () => {
      render(
        html`<ds-icon name="star" size="lg" aria-hidden="true"></ds-icon>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("icon-only button", () => {
    it("should have no violations with accessible label", async () => {
      render(
        html`
          <button aria-label="Close dialog">
            <ds-icon name="x" aria-hidden="true"></ds-icon>
          </button>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("icon with status", () => {
    it("should have no violations for status indicator", async () => {
      render(
        html`
          <span role="status">
            <ds-icon name="check-circle" aria-hidden="true"></ds-icon>
            <span>Saved successfully</span>
          </span>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
