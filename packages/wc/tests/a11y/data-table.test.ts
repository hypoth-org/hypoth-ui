import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/data-table/data-table.js";

expect.extend(toHaveNoViolations);

describe("DataTable Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic data table", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-data-table aria-label="User accounts">
            <ds-table>
              <ds-table-header>
                <ds-table-row>
                  <ds-table-head>Name</ds-table-head>
                  <ds-table-head>Email</ds-table-head>
                  <ds-table-head>Role</ds-table-head>
                </ds-table-row>
              </ds-table-header>
              <ds-table-body>
                <ds-table-row>
                  <ds-table-cell>John Doe</ds-table-cell>
                  <ds-table-cell>john@example.com</ds-table-cell>
                  <ds-table-cell>Admin</ds-table-cell>
                </ds-table-row>
                <ds-table-row>
                  <ds-table-cell>Jane Smith</ds-table-cell>
                  <ds-table-cell>jane@example.com</ds-table-cell>
                  <ds-table-cell>User</ds-table-cell>
                </ds-table-row>
              </ds-table-body>
            </ds-table>
          </ds-data-table>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("data table with selection", () => {
    it("should have no violations with row selection checkboxes", async () => {
      render(
        html`
          <ds-data-table aria-label="Selectable users">
            <ds-table>
              <ds-table-header>
                <ds-table-row>
                  <ds-table-head>
                    <input type="checkbox" aria-label="Select all rows" />
                  </ds-table-head>
                  <ds-table-head>Name</ds-table-head>
                  <ds-table-head>Email</ds-table-head>
                </ds-table-row>
              </ds-table-header>
              <ds-table-body>
                <ds-table-row>
                  <ds-table-cell>
                    <input type="checkbox" aria-label="Select John Doe" />
                  </ds-table-cell>
                  <ds-table-cell>John Doe</ds-table-cell>
                  <ds-table-cell>john@example.com</ds-table-cell>
                </ds-table-row>
              </ds-table-body>
            </ds-table>
          </ds-data-table>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("data table with sorting", () => {
    it("should have no violations with sortable columns", async () => {
      render(
        html`
          <ds-data-table aria-label="Sortable data">
            <ds-table>
              <ds-table-header>
                <ds-table-row>
                  <ds-table-head aria-sort="ascending">
                    <button aria-label="Sort by name, currently ascending">
                      Name
                    </button>
                  </ds-table-head>
                  <ds-table-head aria-sort="none">
                    <button aria-label="Sort by date">Date</button>
                  </ds-table-head>
                </ds-table-row>
              </ds-table-header>
              <ds-table-body>
                <ds-table-row>
                  <ds-table-cell>Alice</ds-table-cell>
                  <ds-table-cell>2024-01-15</ds-table-cell>
                </ds-table-row>
              </ds-table-body>
            </ds-table>
          </ds-data-table>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("data table with pagination", () => {
    it("should have no violations with pagination controls", async () => {
      render(
        html`
          <ds-data-table aria-label="Paginated data">
            <ds-table>
              <ds-table-header>
                <ds-table-row>
                  <ds-table-head>Name</ds-table-head>
                </ds-table-row>
              </ds-table-header>
              <ds-table-body>
                <ds-table-row>
                  <ds-table-cell>User 1</ds-table-cell>
                </ds-table-row>
              </ds-table-body>
            </ds-table>
            <nav aria-label="Table pagination">
              <button aria-label="Go to previous page" disabled>Previous</button>
              <span aria-current="page">1</span>
              <span>2</span>
              <span>3</span>
              <button aria-label="Go to next page">Next</button>
            </nav>
          </ds-data-table>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("data table with row actions", () => {
    it("should have no violations with action buttons", async () => {
      render(
        html`
          <ds-data-table aria-label="Users with actions">
            <ds-table>
              <ds-table-header>
                <ds-table-row>
                  <ds-table-head>Name</ds-table-head>
                  <ds-table-head>Actions</ds-table-head>
                </ds-table-row>
              </ds-table-header>
              <ds-table-body>
                <ds-table-row>
                  <ds-table-cell>John Doe</ds-table-cell>
                  <ds-table-cell>
                    <button aria-label="Edit John Doe">Edit</button>
                    <button aria-label="Delete John Doe">Delete</button>
                  </ds-table-cell>
                </ds-table-row>
              </ds-table-body>
            </ds-table>
          </ds-data-table>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("data table loading state", () => {
    it("should have no violations in loading state", async () => {
      render(
        html`
          <ds-data-table aria-label="Loading data" aria-busy="true">
            <ds-table>
              <ds-table-header>
                <ds-table-row>
                  <ds-table-head>Name</ds-table-head>
                </ds-table-row>
              </ds-table-header>
              <ds-table-body>
                <ds-table-row>
                  <ds-table-cell aria-label="Loading">Loading...</ds-table-cell>
                </ds-table-row>
              </ds-table-body>
            </ds-table>
          </ds-data-table>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("data table empty state", () => {
    it("should have no violations in empty state", async () => {
      render(
        html`
          <ds-data-table aria-label="Empty table">
            <ds-table>
              <ds-table-header>
                <ds-table-row>
                  <ds-table-head>Name</ds-table-head>
                  <ds-table-head>Email</ds-table-head>
                </ds-table-row>
              </ds-table-header>
              <ds-table-body>
                <ds-table-row>
                  <ds-table-cell colspan="2">
                    <p>No results found.</p>
                  </ds-table-cell>
                </ds-table-row>
              </ds-table-body>
            </ds-table>
          </ds-data-table>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
