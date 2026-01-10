import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/table/table.js";

expect.extend(toHaveNoViolations);

describe("Table Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic table", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-table>
            <ds-table-header>
              <ds-table-row>
                <ds-table-head>Name</ds-table-head>
                <ds-table-head>Email</ds-table-head>
                <ds-table-head>Status</ds-table-head>
              </ds-table-row>
            </ds-table-header>
            <ds-table-body>
              <ds-table-row>
                <ds-table-cell>John Doe</ds-table-cell>
                <ds-table-cell>john@example.com</ds-table-cell>
                <ds-table-cell>Active</ds-table-cell>
              </ds-table-row>
              <ds-table-row>
                <ds-table-cell>Jane Smith</ds-table-cell>
                <ds-table-cell>jane@example.com</ds-table-cell>
                <ds-table-cell>Inactive</ds-table-cell>
              </ds-table-row>
            </ds-table-body>
          </ds-table>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("table with caption", () => {
    it("should have no violations with caption", async () => {
      render(
        html`
          <ds-table>
            <ds-table-caption>List of team members</ds-table-caption>
            <ds-table-header>
              <ds-table-row>
                <ds-table-head>Name</ds-table-head>
                <ds-table-head>Role</ds-table-head>
              </ds-table-row>
            </ds-table-header>
            <ds-table-body>
              <ds-table-row>
                <ds-table-cell>Alice</ds-table-cell>
                <ds-table-cell>Developer</ds-table-cell>
              </ds-table-row>
            </ds-table-body>
          </ds-table>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("table with footer", () => {
    it("should have no violations with footer", async () => {
      render(
        html`
          <ds-table>
            <ds-table-header>
              <ds-table-row>
                <ds-table-head>Item</ds-table-head>
                <ds-table-head>Price</ds-table-head>
              </ds-table-row>
            </ds-table-header>
            <ds-table-body>
              <ds-table-row>
                <ds-table-cell>Product A</ds-table-cell>
                <ds-table-cell>$10.00</ds-table-cell>
              </ds-table-row>
              <ds-table-row>
                <ds-table-cell>Product B</ds-table-cell>
                <ds-table-cell>$20.00</ds-table-cell>
              </ds-table-row>
            </ds-table-body>
            <ds-table-footer>
              <ds-table-row>
                <ds-table-cell>Total</ds-table-cell>
                <ds-table-cell>$30.00</ds-table-cell>
              </ds-table-row>
            </ds-table-footer>
          </ds-table>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("table with scope", () => {
    it("should have no violations with proper scope attributes", async () => {
      render(
        html`
          <ds-table>
            <ds-table-header>
              <ds-table-row>
                <ds-table-head scope="col">Name</ds-table-head>
                <ds-table-head scope="col">Q1</ds-table-head>
                <ds-table-head scope="col">Q2</ds-table-head>
              </ds-table-row>
            </ds-table-header>
            <ds-table-body>
              <ds-table-row>
                <ds-table-head scope="row">Sales</ds-table-head>
                <ds-table-cell>$100</ds-table-cell>
                <ds-table-cell>$150</ds-table-cell>
              </ds-table-row>
            </ds-table-body>
          </ds-table>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("table with sortable columns", () => {
    it("should have no violations with sortable headers", async () => {
      render(
        html`
          <ds-table>
            <ds-table-header>
              <ds-table-row>
                <ds-table-head aria-sort="ascending">
                  <button>Name ↑</button>
                </ds-table-head>
                <ds-table-head aria-sort="none">
                  <button>Date</button>
                </ds-table-head>
              </ds-table-row>
            </ds-table-header>
            <ds-table-body>
              <ds-table-row>
                <ds-table-cell>Alice</ds-table-cell>
                <ds-table-cell>2024-01-01</ds-table-cell>
              </ds-table-row>
            </ds-table-body>
          </ds-table>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("table ARIA attributes", () => {
    it("should have proper table structure", async () => {
      render(
        html`
          <ds-table aria-label="User data">
            <ds-table-header>
              <ds-table-row>
                <ds-table-head>Name</ds-table-head>
              </ds-table-row>
            </ds-table-header>
            <ds-table-body>
              <ds-table-row>
                <ds-table-cell>John</ds-table-cell>
              </ds-table-row>
            </ds-table-body>
          </ds-table>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const table = container.querySelector("table, [role='table']");
      expect(table).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
