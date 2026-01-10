import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/link/link.js";

expect.extend(toHaveNoViolations);

describe("Link Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic link", () => {
    it("should have no accessibility violations", async () => {
      render(html`<ds-link href="/page">Go to page</ds-link>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with descriptive text", async () => {
      render(
        html`<ds-link href="/about">Learn more about our company</ds-link>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("external link", () => {
    it("should have no violations for external link", async () => {
      render(
        html`
          <ds-link href="https://example.com" target="_blank" rel="noopener noreferrer">
            External site (opens in new tab)
          </ds-link>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with aria-label for icon-only external link", async () => {
      render(
        html`
          <ds-link
            href="https://example.com"
            target="_blank"
            aria-label="Visit Example.com (opens in new tab)"
          >
            <span aria-hidden="true">↗</span>
          </ds-link>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("link variants", () => {
    it("should have no violations for default variant", async () => {
      render(html`<ds-link href="/page">Default link</ds-link>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for muted variant", async () => {
      render(html`<ds-link href="/page" variant="muted">Muted link</ds-link>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("link in context", () => {
    it("should have no violations within paragraph", async () => {
      render(
        html`
          <p>
            For more information, please visit our
            <ds-link href="/help">help center</ds-link>.
          </p>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations in navigation", async () => {
      render(
        html`
          <nav aria-label="Main navigation">
            <ds-link href="/">Home</ds-link>
            <ds-link href="/about">About</ds-link>
            <ds-link href="/contact">Contact</ds-link>
          </nav>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("link ARIA attributes", () => {
    it("should have proper link semantics", async () => {
      render(html`<ds-link href="/page">Link</ds-link>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const link = container.querySelector("a, [role='link']");
      expect(link).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should support aria-current for current page", async () => {
      render(
        html`<ds-link href="/current" aria-current="page">Current Page</ds-link>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("disabled link", () => {
    it("should have no violations when disabled", async () => {
      render(
        html`<ds-link href="/page" disabled aria-disabled="true">Disabled link</ds-link>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
