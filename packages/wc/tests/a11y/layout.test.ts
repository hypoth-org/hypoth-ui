import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/layout/index.js";

expect.extend(toHaveNoViolations);

describe("Layout Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic layout", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-layout>
            <header>Header</header>
            <main>Main Content</main>
            <footer>Footer</footer>
          </ds-layout>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("layout with sidebar", () => {
    it("should have no violations with sidebar layout", async () => {
      render(
        html`
          <ds-layout>
            <header>Header</header>
            <nav aria-label="Main navigation">Sidebar Navigation</nav>
            <main>Main Content</main>
            <footer>Footer</footer>
          </ds-layout>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("layout with landmarks", () => {
    it("should have no violations with proper landmarks", async () => {
      render(
        html`
          <ds-layout>
            <header role="banner">
              <h1>Site Title</h1>
            </header>
            <nav role="navigation" aria-label="Main">
              <a href="/">Home</a>
              <a href="/about">About</a>
            </nav>
            <main role="main">
              <h2>Page Content</h2>
              <p>Main content area.</p>
            </main>
            <aside role="complementary" aria-label="Related content">
              Sidebar content
            </aside>
            <footer role="contentinfo">
              <p>Copyright 2024</p>
            </footer>
          </ds-layout>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("layout with skip link", () => {
    it("should have no violations with skip link", async () => {
      render(
        html`
          <ds-layout>
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <header>Header</header>
            <main id="main-content" tabindex="-1">
              Main Content
            </main>
          </ds-layout>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("layout variants", () => {
    it("should have no violations for centered layout", async () => {
      render(
        html`
          <ds-layout variant="centered">
            <main>Centered content</main>
          </ds-layout>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for full-width layout", async () => {
      render(
        html`
          <ds-layout variant="full-width">
            <main>Full width content</main>
          </ds-layout>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("nested layout", () => {
    it("should have no violations with nested content", async () => {
      render(
        html`
          <ds-layout>
            <header>
              <nav aria-label="Primary">Primary navigation</nav>
            </header>
            <main>
              <section aria-labelledby="section-title">
                <h2 id="section-title">Section Title</h2>
                <p>Section content.</p>
              </section>
            </main>
          </ds-layout>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
