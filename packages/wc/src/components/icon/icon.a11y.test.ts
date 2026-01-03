import { axe, toHaveNoViolations } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DsIcon } from "./icon.js";

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Ensure the component is defined before tests
import "./icon.js";

describe("DsIcon Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("axe accessibility checks", () => {
    it("has no violations for decorative icon", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      container.appendChild(icon);
      await icon.updateComplete;

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no violations for meaningful icon with label", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      icon.label = "Search";
      container.appendChild(icon);
      await icon.updateComplete;

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no violations for all size variants", async () => {
      const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

      for (const size of sizes) {
        container.innerHTML = "";
        const icon = document.createElement("ds-icon") as DsIcon;
        icon.name = "search";
        icon.size = size;
        container.appendChild(icon);
        await icon.updateComplete;

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });
  });

  describe("decorative icons (no label)", () => {
    it("is hidden from assistive technology", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "star";
      container.appendChild(icon);
      await icon.updateComplete;

      const wrapper = icon.querySelector(".ds-icon");
      expect(wrapper?.getAttribute("aria-hidden")).toBe("true");
    });

    it("does not have role attribute", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "star";
      container.appendChild(icon);
      await icon.updateComplete;

      const wrapper = icon.querySelector(".ds-icon");
      expect(wrapper?.hasAttribute("role")).toBe(false);
    });
  });

  describe("meaningful icons (with label)", () => {
    it("has role=img", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "alert-triangle";
      icon.label = "Warning";
      container.appendChild(icon);
      await icon.updateComplete;

      const wrapper = icon.querySelector(".ds-icon");
      expect(wrapper?.getAttribute("role")).toBe("img");
    });

    it("has accessible name via aria-label", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "alert-triangle";
      icon.label = "Warning";
      container.appendChild(icon);
      await icon.updateComplete;

      const wrapper = icon.querySelector(".ds-icon");
      expect(wrapper?.getAttribute("aria-label")).toBe("Warning");
    });

    it("is not hidden from assistive technology", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "alert-triangle";
      icon.label = "Warning";
      container.appendChild(icon);
      await icon.updateComplete;

      const wrapper = icon.querySelector(".ds-icon");
      expect(wrapper?.hasAttribute("aria-hidden")).toBe(false);
    });
  });

  describe("icon within interactive element", () => {
    it("decorative icon in button is accessible", async () => {
      const button = document.createElement("button");
      button.textContent = "Search";

      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      // No label - decorative, button provides the label

      button.prepend(icon);
      container.appendChild(button);
      await icon.updateComplete;

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("icon-only button needs accessible name", async () => {
      // This test documents the pattern - icon with label in a button
      const button = document.createElement("button");
      button.setAttribute("aria-label", "Search");

      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      // Icon is decorative because button has aria-label

      button.appendChild(icon);
      container.appendChild(button);
      await icon.updateComplete;

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("SVG accessibility", () => {
    it("SVG is not directly accessible (wrapped)", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      container.appendChild(icon);
      await icon.updateComplete;

      const svg = icon.querySelector("svg");
      // SVG should be inside the wrapper which handles accessibility
      expect(svg?.parentElement?.classList.contains("ds-icon")).toBe(true);
    });
  });
});
