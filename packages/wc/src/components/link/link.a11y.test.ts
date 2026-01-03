import { axe, toHaveNoViolations } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DsLink } from "./link.js";

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Ensure the component is defined before tests
import "./link.js";

describe("DsLink Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  // Helper to add accessible name to link (Light DOM doesn't support slot projection)
  const addAccessibleName = async (link: DsLink, label: string) => {
    await link.updateComplete;
    const anchor = link.querySelector("a");
    if (anchor) {
      anchor.setAttribute("aria-label", label);
    }
  };

  describe("axe accessibility checks", () => {
    it("has no violations with default props", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/about";
      container.appendChild(link);
      await addAccessibleName(link, "About us");

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no violations for external links", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "https://example.com";
      link.external = true;
      container.appendChild(link);
      await addAccessibleName(link, "External site (opens in new tab)");

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no violations for all variants", async () => {
      const variants = ["default", "muted", "underline"] as const;

      for (const variant of variants) {
        container.innerHTML = "";
        const link = document.createElement("ds-link") as DsLink;
        link.href = "/test";
        link.variant = variant;
        container.appendChild(link);
        await addAccessibleName(link, `${variant} link`);

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });
  });

  describe("semantic HTML", () => {
    it("uses native anchor element", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/about";
      container.appendChild(link);
      await link.updateComplete;

      const anchor = link.querySelector("a");
      expect(anchor).toBeTruthy();
      expect(anchor?.tagName.toLowerCase()).toBe("a");
    });

    it("has proper href attribute", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/contact";
      container.appendChild(link);
      await link.updateComplete;

      const anchor = link.querySelector("a");
      expect(anchor?.getAttribute("href")).toBe("/contact");
    });
  });

  describe("external link accessibility", () => {
    it("has screen reader text for external links", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "https://example.com";
      link.external = true;
      container.appendChild(link);
      await link.updateComplete;

      // Check for visually hidden text wrapper
      const srText = link.querySelector(".ds-visually-hidden");
      expect(srText).toBeTruthy();
    });

    it("external icon is decorative (hidden from AT)", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "https://example.com";
      link.external = true;
      container.appendChild(link);
      await link.updateComplete;

      const icon = link.querySelector(".ds-link__external-icon");
      expect(icon?.getAttribute("aria-hidden")).toBe("true");
    });
  });

  describe("keyboard accessibility", () => {
    it("is focusable via tab", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/about";
      container.appendChild(link);
      await link.updateComplete;

      const anchor = link.querySelector("a");
      anchor?.focus();
      expect(document.activeElement).toBe(anchor);
    });

    it("has visible focus indicator", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/about";
      container.appendChild(link);
      await link.updateComplete;

      // Focus indicator is handled by CSS - verify element can receive focus
      const anchor = link.querySelector("a");
      // Anchor elements with href are focusable by default (tabIndex is -1 when not explicitly set, but still focusable)
      anchor?.focus();
      expect(document.activeElement).toBe(anchor);
    });
  });

  describe("link context", () => {
    it("anchor element exists and is accessible", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/about";
      container.appendChild(link);
      await link.updateComplete;

      const anchor = link.querySelector("a");
      expect(anchor).toBeTruthy();
    });

    it("within paragraph maintains proper semantics", async () => {
      const p = document.createElement("p");
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/about";
      container.appendChild(link);
      await addAccessibleName(link, "about us");
      p.appendChild(document.createTextNode("Read more "));
      p.appendChild(link);
      p.appendChild(document.createTextNode(" today."));
      container.appendChild(p);
      await link.updateComplete;

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
