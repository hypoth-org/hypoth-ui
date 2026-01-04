import { cleanup, render } from "@testing-library/react";
import { createElement, createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Box } from "../../src/primitives/box.js";

describe("Box React Component", () => {
  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("should render div element by default", () => {
      const { container } = render(createElement(Box, null, "Content"));
      const div = container.querySelector("div");
      expect(div).not.toBeNull();
      expect(div?.textContent).toBe("Content");
    });

    it("should have displayName", () => {
      expect(Box.displayName).toBe("Box");
    });
  });

  describe("spacing props", () => {
    it("should apply padding classes", () => {
      const { container } = render(createElement(Box, { p: 4 }, "Content"));
      const div = container.querySelector("div");
      expect(div?.className).toContain("ds-p-4");
    });

    it("should apply directional padding classes", () => {
      const { container } = render(
        createElement(Box, { px: 2, py: 4 }, "Content")
      );
      const div = container.querySelector("div");
      expect(div?.className).toContain("ds-px-2");
      expect(div?.className).toContain("ds-py-4");
    });

    it("should apply specific padding classes", () => {
      const { container } = render(
        createElement(Box, { pt: 1, pr: 2, pb: 3, pl: 4 }, "Content")
      );
      const div = container.querySelector("div");
      expect(div?.className).toContain("ds-pt-1");
      expect(div?.className).toContain("ds-pr-2");
      expect(div?.className).toContain("ds-pb-3");
      expect(div?.className).toContain("ds-pl-4");
    });

    it("should apply margin classes", () => {
      const { container } = render(createElement(Box, { m: 4 }, "Content"));
      const div = container.querySelector("div");
      expect(div?.className).toContain("ds-m-4");
    });

    it("should apply gap class", () => {
      const { container } = render(createElement(Box, { gap: 4 }, "Content"));
      const div = container.querySelector("div");
      expect(div?.className).toContain("ds-gap-4");
    });
  });

  describe("layout props", () => {
    it("should apply display class", () => {
      const { container } = render(
        createElement(Box, { display: "flex" }, "Content")
      );
      const div = container.querySelector("div");
      expect(div?.className).toContain("ds-d-flex");
    });

    it("should apply flex direction class", () => {
      const { container } = render(
        createElement(Box, { flexDirection: "column" }, "Content")
      );
      const div = container.querySelector("div");
      expect(div?.className).toContain("ds-flex-col");
    });

    it("should apply align items class", () => {
      const { container } = render(
        createElement(Box, { alignItems: "center" }, "Content")
      );
      const div = container.querySelector("div");
      expect(div?.className).toContain("ds-items-center");
    });

    it("should apply justify content class", () => {
      const { container } = render(
        createElement(Box, { justifyContent: "between" }, "Content")
      );
      const div = container.querySelector("div");
      expect(div?.className).toContain("ds-justify-between");
    });

    it("should apply flex wrap class", () => {
      const { container } = render(
        createElement(Box, { flexWrap: "wrap" }, "Content")
      );
      const div = container.querySelector("div");
      expect(div?.className).toContain("ds-flex-wrap");
    });

    it("should apply flex grow class", () => {
      const { container } = render(
        createElement(Box, { flexGrow: 1 }, "Content")
      );
      const div = container.querySelector("div");
      expect(div?.className).toContain("ds-grow");
    });

    it("should apply flex shrink class", () => {
      const { container } = render(
        createElement(Box, { flexShrink: 0 }, "Content")
      );
      const div = container.querySelector("div");
      expect(div?.className).toContain("ds-shrink-0");
    });
  });

  describe("className merging", () => {
    it("should merge className with generated classes", () => {
      const { container } = render(
        createElement(Box, { p: 4, className: "custom-class" }, "Content")
      );
      const div = container.querySelector("div");
      expect(div?.className).toContain("ds-p-4");
      expect(div?.className).toContain("custom-class");
    });
  });

  describe("asChild pattern", () => {
    it("should render child element with asChild", () => {
      const { container } = render(
        createElement(
          Box,
          { asChild: true, p: 4 },
          createElement("main", null, "Content")
        )
      );
      const main = container.querySelector("main");
      expect(main).not.toBeNull();
      expect(main?.className).toContain("ds-p-4");
    });

    it("should merge classes with child classes in asChild mode", () => {
      const { container } = render(
        createElement(
          Box,
          { asChild: true, p: 4 },
          createElement("section", { className: "hero" }, "Content")
        )
      );
      const section = container.querySelector("section");
      expect(section?.className).toContain("ds-p-4");
      expect(section?.className).toContain("hero");
    });

    it("should render semantic elements correctly", () => {
      const { container } = render(
        createElement(
          Box,
          { asChild: true, display: "flex", gap: 4 },
          createElement("nav", { "aria-label": "Main" }, "Links")
        )
      );
      const nav = container.querySelector("nav");
      expect(nav).not.toBeNull();
      expect(nav?.getAttribute("aria-label")).toBe("Main");
      expect(nav?.className).toContain("ds-d-flex");
      expect(nav?.className).toContain("ds-gap-4");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to div element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(Box, { ref }, "Content"));
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("should forward ref to child element with asChild", () => {
      const ref = createRef<HTMLElement>();
      render(
        createElement(
          Box,
          { ref, asChild: true },
          createElement("main", null, "Content")
        )
      );
      expect(ref.current?.tagName).toBe("MAIN");
    });
  });
});
