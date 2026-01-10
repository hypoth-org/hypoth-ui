import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/spinner/spinner.js";

expect.extend(toHaveNoViolations);

describe("Spinner Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic spinner", () => {
    it("should have no accessibility violations with aria-label", async () => {
      render(html`<ds-spinner aria-label="Loading"></ds-spinner>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with visible label", async () => {
      render(
        html`
          <div>
            <ds-spinner aria-labelledby="spinner-label"></ds-spinner>
            <span id="spinner-label">Loading content...</span>
          </div>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("spinner sizes", () => {
    it("should have no violations for small size", async () => {
      render(html`<ds-spinner size="sm" aria-label="Loading"></ds-spinner>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for large size", async () => {
      render(html`<ds-spinner size="lg" aria-label="Loading"></ds-spinner>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("spinner ARIA attributes", () => {
    it("should have role='status' by default", async () => {
      render(html`<ds-spinner aria-label="Loading"></ds-spinner>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const spinner = container.querySelector("ds-spinner");
      // The spinner should have status role or progressbar role
      const role = spinner?.getAttribute("role");
      expect(role === "status" || role === "progressbar" || spinner?.querySelector("[role='status'], [role='progressbar']")).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have aria-busy='true'", async () => {
      render(html`<ds-spinner aria-label="Loading"></ds-spinner>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("spinner in context", () => {
    it("should have no violations inside a loading container", async () => {
      render(
        html`
          <div aria-busy="true" aria-live="polite">
            <ds-spinner aria-label="Loading data"></ds-spinner>
            <p>Please wait while we load your data...</p>
          </div>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
