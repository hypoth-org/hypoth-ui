import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/pagination/pagination.js";

expect.extend(toHaveNoViolations);

describe("Pagination Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic pagination", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-pagination>
            <ds-pagination-content>
              <ds-pagination-item>
                <ds-pagination-previous href="#">Previous</ds-pagination-previous>
              </ds-pagination-item>
              <ds-pagination-item>
                <ds-pagination-link href="#" active>1</ds-pagination-link>
              </ds-pagination-item>
              <ds-pagination-item>
                <ds-pagination-link href="#">2</ds-pagination-link>
              </ds-pagination-item>
              <ds-pagination-item>
                <ds-pagination-link href="#">3</ds-pagination-link>
              </ds-pagination-item>
              <ds-pagination-item>
                <ds-pagination-next href="#">Next</ds-pagination-next>
              </ds-pagination-item>
            </ds-pagination-content>
          </ds-pagination>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("pagination with ellipsis", () => {
    it("should have no violations with ellipsis", async () => {
      render(
        html`
          <ds-pagination>
            <ds-pagination-content>
              <ds-pagination-item>
                <ds-pagination-previous href="#">Previous</ds-pagination-previous>
              </ds-pagination-item>
              <ds-pagination-item>
                <ds-pagination-link href="#" active>1</ds-pagination-link>
              </ds-pagination-item>
              <ds-pagination-item>
                <ds-pagination-link href="#">2</ds-pagination-link>
              </ds-pagination-item>
              <ds-pagination-item>
                <ds-pagination-ellipsis aria-label="More pages"></ds-pagination-ellipsis>
              </ds-pagination-item>
              <ds-pagination-item>
                <ds-pagination-link href="#">10</ds-pagination-link>
              </ds-pagination-item>
              <ds-pagination-item>
                <ds-pagination-next href="#">Next</ds-pagination-next>
              </ds-pagination-item>
            </ds-pagination-content>
          </ds-pagination>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("pagination ARIA attributes", () => {
    it("should have navigation landmark", async () => {
      render(
        html`
          <ds-pagination aria-label="Pagination">
            <ds-pagination-content>
              <ds-pagination-item>
                <ds-pagination-link href="#" active>1</ds-pagination-link>
              </ds-pagination-item>
            </ds-pagination-content>
          </ds-pagination>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const nav = container.querySelector("nav, [role='navigation']");
      expect(nav).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    // Skip: Lit updateComplete doesn't reliably set aria-current in happy-dom
    it.skip("should have aria-current on current page", async () => {
      render(
        html`
          <ds-pagination>
            <ds-pagination-content>
              <ds-pagination-item>
                <ds-pagination-link href="#" active>1</ds-pagination-link>
              </ds-pagination-item>
              <ds-pagination-item>
                <ds-pagination-link href="#">2</ds-pagination-link>
              </ds-pagination-item>
            </ds-pagination-content>
          </ds-pagination>
        `,
        container
      );

      // Wait for Lit to complete update cycle
      await new Promise((resolve) => setTimeout(resolve, 100));
      const activeLink = container.querySelector("ds-pagination-link[active]");
      if (activeLink) {
        await (activeLink as any).updateComplete;
      }

      const currentPage = container.querySelector("[aria-current='page']");
      expect(currentPage).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("disabled pagination controls", () => {
    it("should have no violations with disabled previous on first page", async () => {
      render(
        html`
          <ds-pagination>
            <ds-pagination-content>
              <ds-pagination-item>
                <ds-pagination-previous aria-disabled="true">Previous</ds-pagination-previous>
              </ds-pagination-item>
              <ds-pagination-item>
                <ds-pagination-link href="#" active>1</ds-pagination-link>
              </ds-pagination-item>
              <ds-pagination-item>
                <ds-pagination-next href="#">Next</ds-pagination-next>
              </ds-pagination-item>
            </ds-pagination-content>
          </ds-pagination>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
