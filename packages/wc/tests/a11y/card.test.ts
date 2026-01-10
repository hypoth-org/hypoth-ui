import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/card/card.js";

expect.extend(toHaveNoViolations);

describe("Card Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic card", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-card>
            <ds-card-header>
              <ds-card-title>Card Title</ds-card-title>
              <ds-card-description>Card description text.</ds-card-description>
            </ds-card-header>
            <ds-card-content>
              <p>Card content goes here.</p>
            </ds-card-content>
          </ds-card>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("card with footer", () => {
    it("should have no violations with footer actions", async () => {
      render(
        html`
          <ds-card>
            <ds-card-header>
              <ds-card-title>Card Title</ds-card-title>
            </ds-card-header>
            <ds-card-content>
              <p>Card content</p>
            </ds-card-content>
            <ds-card-footer>
              <button>Cancel</button>
              <button>Save</button>
            </ds-card-footer>
          </ds-card>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("card as article", () => {
    it("should have no violations when used as article", async () => {
      render(
        html`
          <ds-card role="article">
            <ds-card-header>
              <ds-card-title>Article Title</ds-card-title>
              <ds-card-description>Published on January 1, 2026</ds-card-description>
            </ds-card-header>
            <ds-card-content>
              <p>Article content goes here...</p>
            </ds-card-content>
          </ds-card>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("card with image", () => {
    it("should have no violations with image header", async () => {
      render(
        html`
          <ds-card>
            <img src="https://example.com/image.jpg" alt="Card cover image" />
            <ds-card-header>
              <ds-card-title>Image Card</ds-card-title>
            </ds-card-header>
            <ds-card-content>
              <p>Card with image content.</p>
            </ds-card-content>
          </ds-card>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("interactive card", () => {
    it("should have no violations when clickable", async () => {
      render(
        html`
          <ds-card tabindex="0" role="button" aria-label="View project details">
            <ds-card-header>
              <ds-card-title>Project Name</ds-card-title>
            </ds-card-header>
            <ds-card-content>
              <p>Click to view details</p>
            </ds-card-content>
          </ds-card>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("card list", () => {
    it("should have no violations in a list context", async () => {
      render(
        html`
          <ul role="list" aria-label="Projects">
            <li>
              <ds-card>
                <ds-card-header>
                  <ds-card-title>Project 1</ds-card-title>
                </ds-card-header>
              </ds-card>
            </li>
            <li>
              <ds-card>
                <ds-card-header>
                  <ds-card-title>Project 2</ds-card-title>
                </ds-card-header>
              </ds-card>
            </li>
          </ul>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
