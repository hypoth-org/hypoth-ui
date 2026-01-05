import { cleanup, render } from "@testing-library/react";
import { createElement, createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { VisuallyHidden } from "../../src/components/visually-hidden.js";

// Mock the Web Component
class MockDsVisuallyHidden extends HTMLElement {
  focusable = false;
}

if (!customElements.get("ds-visually-hidden")) {
  customElements.define("ds-visually-hidden", MockDsVisuallyHidden);
}

describe("VisuallyHidden React Component", () => {
  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("should render ds-visually-hidden element", () => {
      const { container } = render(createElement(VisuallyHidden, null, "Hidden content"));
      const vh = container.querySelector("ds-visually-hidden");
      expect(vh).not.toBeNull();
    });

    it("should render children content", () => {
      const { container } = render(createElement(VisuallyHidden, null, "Hidden content"));
      expect(container.textContent).toContain("Hidden content");
    });

    it("should have displayName", () => {
      expect(VisuallyHidden.displayName).toBe("VisuallyHidden");
    });
  });

  describe("props", () => {
    it("should not pass focusable attribute by default", () => {
      const { container } = render(createElement(VisuallyHidden, null, "Content"));
      const vh = container.querySelector("ds-visually-hidden");
      expect(vh?.hasAttribute("focusable")).toBe(false);
    });

    it("should pass focusable attribute when true", () => {
      const { container } = render(createElement(VisuallyHidden, { focusable: true }, "Content"));
      const vh = container.querySelector("ds-visually-hidden");
      expect(vh?.hasAttribute("focusable")).toBe(true);
    });

    it("should pass className as class", () => {
      const { container } = render(
        createElement(VisuallyHidden, { className: "custom-vh" }, "Content")
      );
      const vh = container.querySelector("ds-visually-hidden");
      expect(vh?.getAttribute("class")).toBe("custom-vh");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to ds-visually-hidden element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(VisuallyHidden, { ref }, "Content"));
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName.toLowerCase()).toBe("ds-visually-hidden");
    });
  });
});
