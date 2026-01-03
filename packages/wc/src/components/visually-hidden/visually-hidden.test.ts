import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DsVisuallyHidden } from "./visually-hidden.js";

// Ensure the component is defined before tests
import "./visually-hidden.js";

describe("DsVisuallyHidden", () => {
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
      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.textContent = "Screen reader only text";
      container.appendChild(vh);
      await vh.updateComplete;

      const inner = vh.querySelector(".ds-visually-hidden");
      expect(inner).toBeTruthy();
    });

    it("renders slotted content", async () => {
      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.textContent = "Hidden content";
      container.appendChild(vh);
      await vh.updateComplete;

      expect(vh.textContent).toContain("Hidden content");
    });
  });

  describe("focusable attribute", () => {
    it("does not have focusable class by default", async () => {
      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.textContent = "Hidden content";
      container.appendChild(vh);
      await vh.updateComplete;

      const inner = vh.querySelector(".ds-visually-hidden");
      expect(inner?.classList.contains("ds-visually-hidden--focusable")).toBe(false);
    });

    it("has focusable class when focusable=true", async () => {
      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.focusable = true;
      vh.textContent = "Focusable content";
      container.appendChild(vh);
      await vh.updateComplete;

      const inner = vh.querySelector(".ds-visually-hidden");
      expect(inner?.classList.contains("ds-visually-hidden--focusable")).toBe(true);
    });

    it("can toggle focusable attribute", async () => {
      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      container.appendChild(vh);
      await vh.updateComplete;

      vh.focusable = true;
      await vh.updateComplete;

      let inner = vh.querySelector(".ds-visually-hidden");
      expect(inner?.classList.contains("ds-visually-hidden--focusable")).toBe(true);

      vh.focusable = false;
      await vh.updateComplete;

      inner = vh.querySelector(".ds-visually-hidden");
      expect(inner?.classList.contains("ds-visually-hidden--focusable")).toBe(false);
    });
  });

  describe("DOM structure", () => {
    it("wraps content in a span", async () => {
      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.textContent = "Wrapped content";
      container.appendChild(vh);
      await vh.updateComplete;

      const span = vh.querySelector("span.ds-visually-hidden");
      expect(span).toBeTruthy();
      expect(span?.tagName.toLowerCase()).toBe("span");
    });
  });

  describe("use cases", () => {
    it("works with icon-only buttons", async () => {
      const button = document.createElement("button");

      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.textContent = "Delete item";

      button.innerHTML = '<span aria-hidden="true">X</span>';
      button.appendChild(vh);
      container.appendChild(button);
      await vh.updateComplete;

      // Button should contain the visually hidden text
      expect(button.textContent).toContain("Delete item");
    });

    it("works as skip link container", async () => {
      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.focusable = true;

      const link = document.createElement("a");
      link.href = "#main-content";
      link.textContent = "Skip to main content";

      vh.appendChild(link);
      container.appendChild(vh);
      await vh.updateComplete;

      // Link should be accessible
      const innerLink = vh.querySelector("a");
      expect(innerLink).toBeTruthy();
      expect(innerLink?.textContent).toBe("Skip to main content");
    });

    it("provides additional context for links", async () => {
      const link = document.createElement("a");
      link.href = "/article";
      link.textContent = "Read more";

      const vh = document.createElement("ds-visually-hidden") as DsVisuallyHidden;
      vh.textContent = " about our latest product updates";

      link.appendChild(vh);
      container.appendChild(link);
      await vh.updateComplete;

      // Full accessible name includes hidden content
      expect(link.textContent).toContain("Read more");
      expect(link.textContent).toContain("about our latest product updates");
    });
  });
});
