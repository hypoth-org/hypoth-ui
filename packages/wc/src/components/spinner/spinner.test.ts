import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DsSpinner } from "./spinner.js";

// Ensure the component is defined before tests
import "./spinner.js";

describe("DsSpinner", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("renders with default props", async () => {
      const spinner = document.createElement("ds-spinner") as DsSpinner;
      container.appendChild(spinner);
      await spinner.updateComplete;

      const inner = spinner.querySelector(".ds-spinner");
      expect(inner).toBeTruthy();
      expect(inner?.classList.contains("ds-spinner--md")).toBe(true);
    });

    it("has role=status", async () => {
      const spinner = document.createElement("ds-spinner") as DsSpinner;
      container.appendChild(spinner);
      await spinner.updateComplete;

      const inner = spinner.querySelector(".ds-spinner");
      expect(inner?.getAttribute("role")).toBe("status");
    });
  });

  describe("size variants", () => {
    const sizes = ["sm", "md", "lg"] as const;

    for (const size of sizes) {
      it(`renders with size="${size}"`, async () => {
        const spinner = document.createElement("ds-spinner") as DsSpinner;
        spinner.size = size;
        container.appendChild(spinner);
        await spinner.updateComplete;

        const inner = spinner.querySelector(".ds-spinner");
        expect(inner?.classList.contains(`ds-spinner--${size}`)).toBe(true);
      });
    }
  });

  describe("label prop", () => {
    it("has default label 'Loading'", async () => {
      const spinner = document.createElement("ds-spinner") as DsSpinner;
      container.appendChild(spinner);
      await spinner.updateComplete;

      const inner = spinner.querySelector(".ds-spinner");
      expect(inner?.getAttribute("aria-label")).toBe("Loading");
    });

    it("accepts custom label", async () => {
      const spinner = document.createElement("ds-spinner") as DsSpinner;
      spinner.label = "Fetching data";
      container.appendChild(spinner);
      await spinner.updateComplete;

      const inner = spinner.querySelector(".ds-spinner");
      expect(inner?.getAttribute("aria-label")).toBe("Fetching data");
    });

    it("updates aria-label when label changes", async () => {
      const spinner = document.createElement("ds-spinner") as DsSpinner;
      spinner.label = "Initial label";
      container.appendChild(spinner);
      await spinner.updateComplete;

      spinner.label = "Updated label";
      await spinner.updateComplete;

      const inner = spinner.querySelector(".ds-spinner");
      expect(inner?.getAttribute("aria-label")).toBe("Updated label");
    });
  });

  describe("accessibility attributes", () => {
    it("has role=status for ARIA live region", async () => {
      const spinner = document.createElement("ds-spinner") as DsSpinner;
      container.appendChild(spinner);
      await spinner.updateComplete;

      const inner = spinner.querySelector(".ds-spinner");
      expect(inner?.getAttribute("role")).toBe("status");
    });

    it("has aria-label for screen reader announcement", async () => {
      const spinner = document.createElement("ds-spinner") as DsSpinner;
      container.appendChild(spinner);
      await spinner.updateComplete;

      const inner = spinner.querySelector(".ds-spinner");
      expect(inner?.hasAttribute("aria-label")).toBe(true);
    });
  });

  describe("usage in aria-busy region", () => {
    it("works within aria-busy container", async () => {
      const region = document.createElement("div");
      region.setAttribute("aria-busy", "true");

      const spinner = document.createElement("ds-spinner") as DsSpinner;
      spinner.label = "Loading content";
      region.appendChild(spinner);
      container.appendChild(region);
      await spinner.updateComplete;

      expect(region.getAttribute("aria-busy")).toBe("true");
      expect(spinner.querySelector(".ds-spinner")).toBeTruthy();
    });
  });
});
