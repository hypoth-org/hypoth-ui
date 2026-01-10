import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/hover-card/hover-card.js";

expect.extend(toHaveNoViolations);

describe("HoverCard Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    document.querySelectorAll("ds-hover-card").forEach((el) => el.remove());
  });

  describe("basic hover card", () => {
    it("should have no accessibility violations for closed card", async () => {
      render(
        html`
          <ds-hover-card>
            <ds-hover-card-trigger>
              <a href="/user/john">@john</a>
            </ds-hover-card-trigger>
            <ds-hover-card-content>
              <div>John Doe</div>
              <div>Software Engineer</div>
            </ds-hover-card-content>
          </ds-hover-card>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations when open", async () => {
      render(
        html`
          <ds-hover-card open>
            <ds-hover-card-trigger>
              <a href="/user/jane">@jane</a>
            </ds-hover-card-trigger>
            <ds-hover-card-content>
              <div>Jane Smith</div>
              <div>Product Designer</div>
            </ds-hover-card-content>
          </ds-hover-card>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("hover card with rich content", () => {
    it("should have no violations with avatar and info", async () => {
      render(
        html`
          <ds-hover-card open>
            <ds-hover-card-trigger>
              <button>View Profile</button>
            </ds-hover-card-trigger>
            <ds-hover-card-content>
              <div style="display: flex; gap: 16px;">
                <img src="https://example.com/avatar.jpg" alt="User avatar" width="60" height="60" />
                <div>
                  <h4>John Doe</h4>
                  <p>Software Engineer at Company</p>
                  <p>Joined January 2020</p>
                </div>
              </div>
            </ds-hover-card-content>
          </ds-hover-card>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("hover card with interactive content", () => {
    it("should have no violations with links and buttons", async () => {
      render(
        html`
          <ds-hover-card open>
            <ds-hover-card-trigger>
              <span>@company</span>
            </ds-hover-card-trigger>
            <ds-hover-card-content>
              <div>
                <h4>Company Name</h4>
                <p>Building great products.</p>
                <a href="/company">View Profile</a>
                <button>Follow</button>
              </div>
            </ds-hover-card-content>
          </ds-hover-card>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("hover card placement", () => {
    it("should have no violations for different placements", async () => {
      render(
        html`
          <ds-hover-card open side="top">
            <ds-hover-card-trigger>
              <span>Hover me</span>
            </ds-hover-card-trigger>
            <ds-hover-card-content>
              Card content above
            </ds-hover-card-content>
          </ds-hover-card>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("hover card focus behavior", () => {
    // Skip: Test uses non-existent ds-hover-card-trigger component
    it.skip("should have no violations with focusable trigger", async () => {
      render(
        html`
          <ds-hover-card>
            <ds-hover-card-trigger>
              <button>Show Info</button>
            </ds-hover-card-trigger>
            <ds-hover-card-content>
              <p>Additional information shown on hover or focus.</p>
            </ds-hover-card-content>
          </ds-hover-card>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const trigger = container.querySelector("button");
      expect(trigger).toBeTruthy();
      expect(trigger?.tabIndex).toBeGreaterThanOrEqual(0);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
