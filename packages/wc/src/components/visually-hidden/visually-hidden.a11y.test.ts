import { axe, toHaveNoViolations } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DsVisuallyHidden } from "./visually-hidden.js";

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Ensure the component is defined before tests
import "./visually-hidden.js";

describe("DsVisuallyHidden Accessibility", () => {
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
      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.textContent = "Additional context for screen readers";
      container.appendChild(vh);
      await vh.updateComplete;

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no violations with focusable attribute", async () => {
      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.focusable = true;

      const link = document.createElement("a");
      link.href = "#main";
      link.textContent = "Skip to main content";
      vh.appendChild(link);

      container.appendChild(vh);
      await vh.updateComplete;

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("screen reader accessibility", () => {
    it("content is present in the DOM", async () => {
      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.textContent = "Important screen reader content";
      container.appendChild(vh);
      await vh.updateComplete;

      // Content should exist in DOM for screen readers
      expect(vh.textContent).toContain("Important screen reader content");
    });

    it("is not hidden from accessibility tree", async () => {
      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.textContent = "Accessible content";
      container.appendChild(vh);
      await vh.updateComplete;

      const inner = vh.querySelector(".ds-visually-hidden");
      // Should NOT have aria-hidden
      expect(inner?.getAttribute("aria-hidden")).toBeNull();
    });
  });

  describe("icon-only button pattern", () => {
    it("provides accessible name for icon-only buttons", async () => {
      const button = document.createElement("button");

      // Decorative icon
      const iconSpan = document.createElement("span");
      iconSpan.setAttribute("aria-hidden", "true");
      iconSpan.textContent = "X";

      // Accessible name
      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.textContent = "Close dialog";

      button.appendChild(iconSpan);
      button.appendChild(vh);
      container.appendChild(button);
      await vh.updateComplete;

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("skip link pattern", () => {
    it("skip link is accessible", async () => {
      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.focusable = true;

      const link = document.createElement("a");
      link.href = "#main-content";
      link.textContent = "Skip to main content";

      vh.appendChild(link);
      container.appendChild(vh);

      // Add the target
      const main = document.createElement("main");
      main.id = "main-content";
      main.textContent = "Main content area";
      container.appendChild(main);

      await vh.updateComplete;

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("focusable content can receive focus", async () => {
      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.focusable = true;

      const link = document.createElement("a");
      link.href = "#main";
      link.textContent = "Skip link";

      vh.appendChild(link);
      container.appendChild(vh);
      await vh.updateComplete;

      // Link should be focusable
      link.focus();
      expect(document.activeElement).toBe(link);
    });
  });

  describe("read more link pattern", () => {
    it("expands accessible name of links", async () => {
      const link = document.createElement("a");
      link.href = "/article/123";

      const visibleText = document.createTextNode("Read more");
      link.appendChild(visibleText);

      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.textContent = " about JavaScript best practices";
      link.appendChild(vh);

      container.appendChild(link);
      await vh.updateComplete;

      // Full accessible name includes both visible and hidden text
      expect(link.textContent).toContain("Read more");
      expect(link.textContent).toContain("about JavaScript best practices");

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("table header pattern", () => {
    it("provides context for abbreviated headers", async () => {
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");

      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = "Qty";

      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.textContent = "uantity";
      th.appendChild(vh);

      tr.appendChild(th);
      thead.appendChild(tr);
      table.appendChild(thead);

      // Add a body for valid table
      const tbody = document.createElement("tbody");
      const bodyTr = document.createElement("tr");
      const td = document.createElement("td");
      td.textContent = "5";
      bodyTr.appendChild(td);
      tbody.appendChild(bodyTr);
      table.appendChild(tbody);

      container.appendChild(table);
      await vh.updateComplete;

      // Header includes both visible and hidden text
      expect(th.textContent).toContain("Qty");
      expect(th.textContent).toContain("uantity");

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
