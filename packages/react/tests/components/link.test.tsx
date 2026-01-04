import { cleanup, render } from "@testing-library/react";
import { createElement, createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Link } from "../../src/components/link.js";

// Mock the Web Component
class MockDsLink extends HTMLElement {
  href = "";
  external = false;
  variant = "default";

  connectedCallback() {
    const anchor = document.createElement("a");
    anchor.href = this.href;
    anchor.className = "ds-link";
    this.appendChild(anchor);
  }
}

if (!customElements.get("ds-link")) {
  customElements.define("ds-link", MockDsLink);
}

describe("Link React Component", () => {
  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("should render ds-link element", () => {
      const { container } = render(
        createElement(Link, { href: "/about" }, "About")
      );
      const link = container.querySelector("ds-link");
      expect(link).not.toBeNull();
    });

    it("should render children content", () => {
      const { container } = render(
        createElement(Link, { href: "/about" }, "About Us")
      );
      expect(container.textContent).toContain("About Us");
    });

    it("should have displayName", () => {
      expect(Link.displayName).toBe("Link");
    });
  });

  describe("props", () => {
    it("should pass href prop", () => {
      const { container } = render(
        createElement(Link, { href: "/products" }, "Products")
      );
      const link = container.querySelector("ds-link");
      expect(link?.getAttribute("href")).toBe("/products");
    });

    it("should pass external prop when true", () => {
      const { container } = render(
        createElement(Link, { href: "https://example.com", external: true }, "External")
      );
      const link = container.querySelector("ds-link");
      expect(link?.hasAttribute("external")).toBe(true);
    });

    it("should not pass external attribute when false", () => {
      const { container } = render(
        createElement(Link, { href: "/about" }, "About")
      );
      const link = container.querySelector("ds-link");
      expect(link?.hasAttribute("external")).toBe(false);
    });

    it("should pass variant prop", () => {
      const { container } = render(
        createElement(Link, { href: "/about", variant: "muted" }, "About")
      );
      const link = container.querySelector("ds-link");
      expect(link?.getAttribute("variant")).toBe("muted");
    });

    it("should pass className as class", () => {
      const { container } = render(
        createElement(Link, { href: "/about", className: "custom-link" }, "About")
      );
      const link = container.querySelector("ds-link");
      expect(link?.getAttribute("class")).toBe("custom-link");
    });
  });

  describe("onNavigate event", () => {
    it("should call onNavigate when ds:navigate event fires", () => {
      const onNavigate = vi.fn();
      const { container } = render(
        createElement(Link, { href: "/dashboard", onNavigate }, "Dashboard")
      );
      const link = container.querySelector("ds-link");

      const event = new CustomEvent("ds:navigate", {
        detail: { href: "/dashboard", external: false, originalEvent: new MouseEvent("click") },
        bubbles: true,
      });
      link?.dispatchEvent(event);

      expect(onNavigate).toHaveBeenCalledTimes(1);
      expect(onNavigate.mock.calls[0][0].detail.href).toBe("/dashboard");
    });

    it("should receive typed event detail", () => {
      const onNavigate = vi.fn();
      const { container } = render(
        createElement(Link, { href: "/test", external: true, onNavigate }, "Test")
      );
      const link = container.querySelector("ds-link");

      const event = new CustomEvent("ds:navigate", {
        detail: {
          href: "/test",
          external: true,
          originalEvent: new MouseEvent("click"),
        },
        bubbles: true,
      });
      link?.dispatchEvent(event);

      expect(onNavigate.mock.calls[0][0].detail).toEqual({
        href: "/test",
        external: true,
        originalEvent: expect.any(MouseEvent),
      });
    });
  });

  describe("asChild pattern", () => {
    it("should render child element with asChild", () => {
      const { container } = render(
        createElement(
          Link,
          { href: "/products", asChild: true },
          createElement("a", { href: "/products" }, "Products")
        )
      );
      const anchor = container.querySelector("a");
      expect(anchor).not.toBeNull();
      expect(anchor?.tagName).toBe("A");
    });

    it("should apply link styling classes with asChild", () => {
      const { container } = render(
        createElement(
          Link,
          { href: "/about", asChild: true },
          createElement("a", { href: "/about" }, "About")
        )
      );
      const anchor = container.querySelector("a");
      expect(anchor?.className).toContain("ds-link");
      expect(anchor?.className).toContain("ds-link--default");
    });

    it("should apply variant class with asChild", () => {
      const { container } = render(
        createElement(
          Link,
          { href: "/about", variant: "underline", asChild: true },
          createElement("a", { href: "/about" }, "About")
        )
      );
      const anchor = container.querySelector("a");
      expect(anchor?.className).toContain("ds-link--underline");
    });

    it("should apply external class with asChild", () => {
      const { container } = render(
        createElement(
          Link,
          { href: "https://example.com", external: true, asChild: true },
          createElement("a", { href: "https://example.com" }, "External")
        )
      );
      const anchor = container.querySelector("a");
      expect(anchor?.className).toContain("ds-link--external");
    });

    it("should merge className with child in asChild mode", () => {
      const { container } = render(
        createElement(
          Link,
          { href: "/about", className: "nav-link", asChild: true },
          createElement("a", { href: "/about", className: "custom" }, "About")
        )
      );
      const anchor = container.querySelector("a");
      expect(anchor?.className).toContain("ds-link");
      expect(anchor?.className).toContain("nav-link");
      expect(anchor?.className).toContain("custom");
    });

    it("should preserve child attributes with asChild", () => {
      const { container } = render(
        createElement(
          Link,
          { href: "/about", asChild: true },
          createElement("a", { href: "/about", "data-testid": "link" }, "About")
        )
      );
      const anchor = container.querySelector("a");
      expect(anchor?.getAttribute("data-testid")).toBe("link");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to ds-link element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(Link, { href: "/about", ref }, "About"));
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName.toLowerCase()).toBe("ds-link");
    });

    it("should forward ref to child element with asChild", () => {
      const ref = createRef<HTMLElement>();
      render(
        createElement(
          Link,
          { href: "/about", ref, asChild: true },
          createElement("a", { href: "/about" }, "About")
        )
      );
      expect(ref.current?.tagName).toBe("A");
    });
  });
});
