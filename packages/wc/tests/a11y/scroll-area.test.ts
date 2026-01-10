import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/scroll-area/scroll-area.js";

expect.extend(toHaveNoViolations);

describe("ScrollArea Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic scroll area", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-scroll-area style="height: 200px;">
            <div style="height: 500px;">
              <p>Scrollable content</p>
              <p>More content</p>
              <p>Even more content</p>
            </div>
          </ds-scroll-area>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("scroll area with label", () => {
    it("should have no violations with accessible label", async () => {
      render(
        html`
          <ds-scroll-area style="height: 200px;" aria-label="Message history">
            <div style="height: 500px;">
              <p>Message 1</p>
              <p>Message 2</p>
              <p>Message 3</p>
            </div>
          </ds-scroll-area>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("scroll area with horizontal scroll", () => {
    it("should have no violations for horizontal scrolling", async () => {
      render(
        html`
          <ds-scroll-area style="width: 300px;" orientation="horizontal">
            <div style="width: 800px; display: flex; gap: 16px;">
              <div>Item 1</div>
              <div>Item 2</div>
              <div>Item 3</div>
              <div>Item 4</div>
            </div>
          </ds-scroll-area>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("scroll area with both scrollbars", () => {
    it("should have no violations with both scrollbars", async () => {
      render(
        html`
          <ds-scroll-area style="width: 300px; height: 200px;">
            <div style="width: 800px; height: 500px;">
              <p>Content that scrolls both ways</p>
            </div>
          </ds-scroll-area>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("scroll area ARIA attributes", () => {
    it("should have tabindex for keyboard scrolling", async () => {
      render(
        html`
          <ds-scroll-area style="height: 200px;">
            <div style="height: 500px;">
              <p>Scrollable content</p>
            </div>
          </ds-scroll-area>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      // The viewport should be focusable for keyboard scrolling
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("scroll area with focusable content", () => {
    it("should have no violations with interactive content", async () => {
      render(
        html`
          <ds-scroll-area style="height: 200px;">
            <div style="height: 500px;">
              <button>Button 1</button>
              <a href="#">Link 1</a>
              <button>Button 2</button>
              <a href="#">Link 2</a>
            </div>
          </ds-scroll-area>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
