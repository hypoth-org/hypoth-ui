import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/visually-hidden/visually-hidden.js";

expect.extend(toHaveNoViolations);

describe("VisuallyHidden Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic visually hidden", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <button>
            <span aria-hidden="true">×</span>
            <ds-visually-hidden>Close dialog</ds-visually-hidden>
          </button>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("visually hidden for icon buttons", () => {
    it("should have no violations with icon-only button", async () => {
      render(
        html`
          <button>
            <span aria-hidden="true">🔍</span>
            <ds-visually-hidden>Search</ds-visually-hidden>
          </button>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with SVG icon button", async () => {
      render(
        html`
          <button>
            <svg aria-hidden="true" width="20" height="20">
              <circle cx="10" cy="10" r="5" />
            </svg>
            <ds-visually-hidden>Settings</ds-visually-hidden>
          </button>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("visually hidden for links", () => {
    it("should have no violations with skip link", async () => {
      render(
        html`
          <a href="#main-content">
            <ds-visually-hidden>Skip to main content</ds-visually-hidden>
          </a>
          <main id="main-content">
            <h1>Main Content</h1>
          </main>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("visually hidden for labels", () => {
    it("should have no violations as form label", async () => {
      render(
        html`
          <div>
            <ds-visually-hidden>
              <label for="search-input">Search</label>
            </ds-visually-hidden>
            <input id="search-input" type="search" placeholder="Search..." />
          </div>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("visually hidden for status messages", () => {
    it("should have no violations with live region", async () => {
      render(
        html`
          <ds-visually-hidden role="status" aria-live="polite">
            Form submitted successfully
          </ds-visually-hidden>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("visually hidden styling", () => {
    it("should be visually hidden but accessible", async () => {
      render(
        html`
          <ds-visually-hidden>This text is only for screen readers</ds-visually-hidden>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const hidden = container.querySelector("ds-visually-hidden");
      expect(hidden).toBeTruthy();

      // Should be in the accessibility tree
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
