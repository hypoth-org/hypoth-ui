import { cleanup, render } from "@testing-library/react";
import { createElement, createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Spinner } from "../../src/components/spinner.js";

// Mock the Web Component
class MockDsSpinner extends HTMLElement {
  size = "md";
  label = "Loading";
}

if (!customElements.get("ds-spinner")) {
  customElements.define("ds-spinner", MockDsSpinner);
}

describe("Spinner React Component", () => {
  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("should render ds-spinner element", () => {
      const { container } = render(createElement(Spinner));
      const spinner = container.querySelector("ds-spinner");
      expect(spinner).not.toBeNull();
    });

    it("should have displayName", () => {
      expect(Spinner.displayName).toBe("Spinner");
    });
  });

  describe("props", () => {
    it("should pass default size prop", () => {
      const { container } = render(createElement(Spinner));
      const spinner = container.querySelector("ds-spinner");
      expect(spinner?.getAttribute("size")).toBe("md");
    });

    it("should pass custom size prop", () => {
      const { container } = render(createElement(Spinner, { size: "lg" }));
      const spinner = container.querySelector("ds-spinner");
      expect(spinner?.getAttribute("size")).toBe("lg");
    });

    it("should pass default label prop", () => {
      const { container } = render(createElement(Spinner));
      const spinner = container.querySelector("ds-spinner");
      expect(spinner?.getAttribute("label")).toBe("Loading");
    });

    it("should pass custom label prop", () => {
      const { container } = render(createElement(Spinner, { label: "Fetching data..." }));
      const spinner = container.querySelector("ds-spinner");
      expect(spinner?.getAttribute("label")).toBe("Fetching data...");
    });

    it("should pass className as class", () => {
      const { container } = render(createElement(Spinner, { className: "custom-spinner" }));
      const spinner = container.querySelector("ds-spinner");
      expect(spinner?.getAttribute("class")).toBe("custom-spinner");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to ds-spinner element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(Spinner, { ref }));
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName.toLowerCase()).toBe("ds-spinner");
    });
  });
});
