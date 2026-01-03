import { axe, toHaveNoViolations } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DsSpinner } from "./spinner.js";

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Ensure the component is defined before tests
import "./spinner.js";

describe("DsSpinner Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("axe accessibility checks", () => {
    it("has no violations with default props", async () => {
      const spinner = document.createElement("ds-spinner") as DsSpinner;
      container.appendChild(spinner);
      await spinner.updateComplete;

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no violations with custom label", async () => {
      const spinner = document.createElement("ds-spinner") as DsSpinner;
      spinner.label = "Loading your dashboard";
      container.appendChild(spinner);
      await spinner.updateComplete;

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no violations for all sizes", async () => {
      const sizes = ["sm", "md", "lg"] as const;

      for (const size of sizes) {
        container.innerHTML = "";
        const spinner = document.createElement("ds-spinner") as DsSpinner;
        spinner.size = size;
        container.appendChild(spinner);
        await spinner.updateComplete;

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });
  });

  describe("screen reader behavior", () => {
    it("has role=status for live region announcements", async () => {
      const spinner = document.createElement("ds-spinner") as DsSpinner;
      container.appendChild(spinner);
      await spinner.updateComplete;

      const inner = spinner.querySelector(".ds-spinner");
      expect(inner?.getAttribute("role")).toBe("status");
    });

    it("has aria-label for screen reader announcement", async () => {
      const spinner = document.createElement("ds-spinner") as DsSpinner;
      spinner.label = "Processing your request";
      container.appendChild(spinner);
      await spinner.updateComplete;

      const inner = spinner.querySelector(".ds-spinner");
      expect(inner?.getAttribute("aria-label")).toBe("Processing your request");
    });

    it("announces loading state by default", async () => {
      const spinner = document.createElement("ds-spinner") as DsSpinner;
      container.appendChild(spinner);
      await spinner.updateComplete;

      const inner = spinner.querySelector(".ds-spinner");
      expect(inner?.getAttribute("aria-label")).toBe("Loading");
    });
  });

  describe("aria-busy region pattern", () => {
    it("works correctly within aria-busy region", async () => {
      const region = document.createElement("section");
      region.setAttribute("aria-busy", "true");
      region.setAttribute("aria-label", "Content area");

      const spinner = document.createElement("ds-spinner") as DsSpinner;
      spinner.label = "Loading content";
      region.appendChild(spinner);
      container.appendChild(region);
      await spinner.updateComplete;

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("spinner in button context", async () => {
      const button = document.createElement("button");
      button.setAttribute("aria-disabled", "true");

      const spinner = document.createElement("ds-spinner") as DsSpinner;
      spinner.size = "sm";
      spinner.label = "Saving";

      button.appendChild(spinner);
      button.appendChild(document.createTextNode(" Saving..."));
      container.appendChild(button);
      await spinner.updateComplete;

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("reduced motion support", () => {
    it("component renders regardless of motion preferences", async () => {
      // CSS handles reduced motion, component always renders
      const spinner = document.createElement("ds-spinner") as DsSpinner;
      container.appendChild(spinner);
      await spinner.updateComplete;

      // Spinner should still render and have proper attributes
      const inner = spinner.querySelector(".ds-spinner");
      expect(inner).toBeTruthy();
      expect(inner?.getAttribute("role")).toBe("status");
    });
  });
});
