import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DsIcon } from "./icon.js";

// Ensure the component is defined before tests
import "./icon.js";

describe("DsIcon", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("renders with required name prop", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      container.appendChild(icon);
      await icon.updateComplete;

      const wrapper = icon.querySelector(".ds-icon");
      expect(wrapper).toBeTruthy();
    });

    it("renders SVG from Lucide", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      container.appendChild(icon);
      await icon.updateComplete;

      const svg = icon.querySelector("svg");
      expect(svg).toBeTruthy();
    });

    it("shows fallback for invalid icon name", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "invalid-icon-name-xyz";
      container.appendChild(icon);
      await icon.updateComplete;

      // Should show fallback placeholder
      const fallback = icon.querySelector(".ds-icon--fallback");
      expect(fallback).toBeTruthy();

      warnSpy.mockRestore();
    });
  });

  describe("size variants", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

    for (const size of sizes) {
      it(`renders with size="${size}"`, async () => {
        const icon = document.createElement("ds-icon") as DsIcon;
        icon.name = "search";
        icon.size = size;
        container.appendChild(icon);
        await icon.updateComplete;

        const wrapper = icon.querySelector(".ds-icon");
        expect(wrapper?.classList.contains(`ds-icon--${size}`)).toBe(true);
      });
    }
  });

  describe("accessibility - decorative icons", () => {
    it("is hidden from screen readers when no label", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      container.appendChild(icon);
      await icon.updateComplete;

      const wrapper = icon.querySelector(".ds-icon");
      expect(wrapper?.getAttribute("aria-hidden")).toBe("true");
    });

    it("does not have role=img when no label", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      container.appendChild(icon);
      await icon.updateComplete;

      const wrapper = icon.querySelector(".ds-icon");
      expect(wrapper?.getAttribute("role")).toBeNull();
    });
  });

  describe("accessibility - meaningful icons", () => {
    it("has role=img when label is provided", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      icon.label = "Search";
      container.appendChild(icon);
      await icon.updateComplete;

      const wrapper = icon.querySelector(".ds-icon");
      expect(wrapper?.getAttribute("role")).toBe("img");
    });

    it("has aria-label when label is provided", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      icon.label = "Search";
      container.appendChild(icon);
      await icon.updateComplete;

      const wrapper = icon.querySelector(".ds-icon");
      expect(wrapper?.getAttribute("aria-label")).toBe("Search");
    });

    it("is not aria-hidden when label is provided", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      icon.label = "Search";
      container.appendChild(icon);
      await icon.updateComplete;

      const wrapper = icon.querySelector(".ds-icon");
      expect(wrapper?.getAttribute("aria-hidden")).toBeNull();
    });
  });

  describe("color prop", () => {
    it("applies custom color via style", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      icon.color = "red";
      container.appendChild(icon);
      await icon.updateComplete;

      const wrapper = icon.querySelector(".ds-icon") as HTMLElement;
      expect(wrapper?.style.color).toBe("red");
    });

    it("uses currentColor by default", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      container.appendChild(icon);
      await icon.updateComplete;

      // No explicit color set means it inherits from CSS
      const wrapper = icon.querySelector(".ds-icon") as HTMLElement;
      expect(wrapper?.style.color).toBe("");
    });
  });

  describe("icon updates", () => {
    it("updates icon when name changes", async () => {
      const icon = document.createElement("ds-icon") as DsIcon;
      icon.name = "search";
      container.appendChild(icon);
      await icon.updateComplete;

      // Verify initial icon rendered
      expect(icon.querySelector("svg")).toBeTruthy();

      // Change the icon
      icon.name = "home";
      await icon.updateComplete;

      // Should still have an SVG (different icon)
      expect(icon.querySelector("svg")).toBeTruthy();
    });
  });
});
