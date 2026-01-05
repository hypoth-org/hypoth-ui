import { cleanup, render } from "@testing-library/react";
import { createElement, createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Icon } from "../../src/components/icon.js";

// Mock the Web Component
class MockDsIcon extends HTMLElement {
  name = "";
  size = "md";
  label = "";
  color = "";
}

if (!customElements.get("ds-icon")) {
  customElements.define("ds-icon", MockDsIcon);
}

describe("Icon React Component", () => {
  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("should render ds-icon element", () => {
      const { container } = render(createElement(Icon, { name: "search" }));
      const icon = container.querySelector("ds-icon");
      expect(icon).not.toBeNull();
    });

    it("should have displayName", () => {
      expect(Icon.displayName).toBe("Icon");
    });
  });

  describe("props", () => {
    it("should pass name prop", () => {
      const { container } = render(createElement(Icon, { name: "heart" }));
      const icon = container.querySelector("ds-icon");
      expect(icon?.getAttribute("name")).toBe("heart");
    });

    it("should pass size prop with default", () => {
      const { container } = render(createElement(Icon, { name: "star" }));
      const icon = container.querySelector("ds-icon");
      expect(icon?.getAttribute("size")).toBe("md");
    });

    it("should pass custom size prop", () => {
      const { container } = render(createElement(Icon, { name: "star", size: "lg" }));
      const icon = container.querySelector("ds-icon");
      expect(icon?.getAttribute("size")).toBe("lg");
    });

    it("should pass label prop when provided", () => {
      const { container } = render(createElement(Icon, { name: "alert", label: "Warning" }));
      const icon = container.querySelector("ds-icon");
      expect(icon?.getAttribute("label")).toBe("Warning");
    });

    it("should not pass label attribute when not provided", () => {
      const { container } = render(createElement(Icon, { name: "search" }));
      const icon = container.querySelector("ds-icon");
      expect(icon?.hasAttribute("label")).toBe(false);
    });

    it("should pass color prop when provided", () => {
      const { container } = render(createElement(Icon, { name: "heart", color: "red" }));
      const icon = container.querySelector("ds-icon");
      expect(icon?.getAttribute("color")).toBe("red");
    });

    it("should pass className as class", () => {
      const { container } = render(createElement(Icon, { name: "star", className: "custom-icon" }));
      const icon = container.querySelector("ds-icon");
      expect(icon?.getAttribute("class")).toBe("custom-icon");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to ds-icon element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(Icon, { name: "search", ref }));
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName.toLowerCase()).toBe("ds-icon");
    });
  });
});
