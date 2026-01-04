import { cleanup, render } from "@testing-library/react";
import { createElement, createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Text } from "../../src/components/text.js";

describe("Text React Component", () => {
  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("should render span element by default", () => {
      const { container } = render(createElement(Text, null, "Content"));
      const span = container.querySelector("span");
      expect(span).not.toBeNull();
      expect(span?.textContent).toBe("Content");
    });

    it("should have displayName", () => {
      expect(Text.displayName).toBe("Text");
    });
  });

  describe("size prop", () => {
    it("should apply default size class", () => {
      const { container } = render(createElement(Text, null, "Content"));
      const span = container.querySelector("span");
      expect(span?.className).toContain("ds-text-md");
    });

    it("should apply custom size class", () => {
      const { container } = render(
        createElement(Text, { size: "xl" }, "Content")
      );
      const span = container.querySelector("span");
      expect(span?.className).toContain("ds-text-xl");
    });

    it("should apply 2xl size class", () => {
      const { container } = render(
        createElement(Text, { size: "2xl" }, "Content")
      );
      const span = container.querySelector("span");
      expect(span?.className).toContain("ds-text-2xl");
    });
  });

  describe("weight prop", () => {
    it("should apply default weight class", () => {
      const { container } = render(createElement(Text, null, "Content"));
      const span = container.querySelector("span");
      expect(span?.className).toContain("ds-font-normal");
    });

    it("should apply bold weight class", () => {
      const { container } = render(
        createElement(Text, { weight: "bold" }, "Content")
      );
      const span = container.querySelector("span");
      expect(span?.className).toContain("ds-font-bold");
    });

    it("should apply semibold weight class", () => {
      const { container } = render(
        createElement(Text, { weight: "semibold" }, "Content")
      );
      const span = container.querySelector("span");
      expect(span?.className).toContain("ds-font-semibold");
    });
  });

  describe("variant prop", () => {
    it("should not apply variant class for default", () => {
      const { container } = render(createElement(Text, null, "Content"));
      const span = container.querySelector("span");
      expect(span?.className).not.toContain("ds-text-default");
    });

    it("should apply muted variant class", () => {
      const { container } = render(
        createElement(Text, { variant: "muted" }, "Content")
      );
      const span = container.querySelector("span");
      expect(span?.className).toContain("ds-text-muted");
    });

    it("should apply error variant class", () => {
      const { container } = render(
        createElement(Text, { variant: "error" }, "Content")
      );
      const span = container.querySelector("span");
      expect(span?.className).toContain("ds-text-error");
    });
  });

  describe("truncate prop", () => {
    it("should not apply truncate class by default", () => {
      const { container } = render(createElement(Text, null, "Content"));
      const span = container.querySelector("span");
      expect(span?.className).not.toContain("ds-truncate");
    });

    it("should apply truncate class when true", () => {
      const { container } = render(
        createElement(Text, { truncate: true }, "Content")
      );
      const span = container.querySelector("span");
      expect(span?.className).toContain("ds-truncate");
    });
  });

  describe("className merging", () => {
    it("should merge className with generated classes", () => {
      const { container } = render(
        createElement(Text, { size: "lg", className: "custom-text" }, "Content")
      );
      const span = container.querySelector("span");
      expect(span?.className).toContain("ds-text-lg");
      expect(span?.className).toContain("custom-text");
    });
  });

  describe("asChild pattern", () => {
    it("should render h1 with asChild", () => {
      const { container } = render(
        createElement(
          Text,
          { asChild: true, size: "2xl", weight: "bold" },
          createElement("h1", null, "Page Title")
        )
      );
      const h1 = container.querySelector("h1");
      expect(h1).not.toBeNull();
      expect(h1?.className).toContain("ds-text-2xl");
      expect(h1?.className).toContain("ds-font-bold");
      expect(h1?.textContent).toBe("Page Title");
    });

    it("should render paragraph with asChild", () => {
      const { container } = render(
        createElement(
          Text,
          { asChild: true },
          createElement("p", null, "Paragraph text")
        )
      );
      const p = container.querySelector("p");
      expect(p).not.toBeNull();
      expect(p?.className).toContain("ds-text-md");
    });

    it("should merge classes with child in asChild mode", () => {
      const { container } = render(
        createElement(
          Text,
          { asChild: true, size: "lg" },
          createElement("h2", { className: "section-title" }, "Section")
        )
      );
      const h2 = container.querySelector("h2");
      expect(h2?.className).toContain("ds-text-lg");
      expect(h2?.className).toContain("section-title");
    });

    it("should render all heading levels", () => {
      for (const level of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
        const { container } = render(
          createElement(
            Text,
            { asChild: true, size: "xl" },
            createElement(level, null, `Heading ${level}`)
          )
        );
        const heading = container.querySelector(level);
        expect(heading).not.toBeNull();
        expect(heading?.className).toContain("ds-text-xl");
        cleanup();
      }
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to span element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(Text, { ref }, "Content"));
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("should forward ref to heading with asChild", () => {
      const ref = createRef<HTMLElement>();
      render(
        createElement(
          Text,
          { ref, asChild: true },
          createElement("h1", null, "Title")
        )
      );
      expect(ref.current?.tagName).toBe("H1");
    });
  });
});
