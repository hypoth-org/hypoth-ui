import { cleanup, render } from "@testing-library/react";
import { createElement, createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "../src/components/button.js";
import { Icon } from "../src/components/icon.js";
import { Input } from "../src/components/input.js";
import { Link } from "../src/components/link.js";
import { Spinner } from "../src/components/spinner.js";
import { VisuallyHidden } from "../src/components/visually-hidden.js";
import { Text } from "../src/components/text.js";
import { Box } from "../src/primitives/box.js";
import { Slot } from "../src/primitives/slot.js";

// Mock Web Components
if (!customElements.get("ds-button")) {
  customElements.define("ds-button", class extends HTMLElement {});
}
if (!customElements.get("ds-input")) {
  customElements.define("ds-input", class extends HTMLElement {});
}
if (!customElements.get("ds-link")) {
  customElements.define("ds-link", class extends HTMLElement {});
}
if (!customElements.get("ds-icon")) {
  customElements.define("ds-icon", class extends HTMLElement {});
}
if (!customElements.get("ds-spinner")) {
  customElements.define("ds-spinner", class extends HTMLElement {});
}
if (!customElements.get("ds-visually-hidden")) {
  customElements.define("ds-visually-hidden", class extends HTMLElement {});
}

describe("Ref Forwarding", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Object refs (createRef)", () => {
    it("Button should forward ref to ds-button element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(Button, { ref }, "Click me"));

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName.toLowerCase()).toBe("ds-button");
    });

    it("Input should forward ref to ds-input element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(Input, { ref }));

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName.toLowerCase()).toBe("ds-input");
    });

    it("Link should forward ref to ds-link element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(Link, { ref, href: "/test" }, "Test"));

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName.toLowerCase()).toBe("ds-link");
    });

    it("Icon should forward ref to ds-icon element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(Icon, { ref, name: "check" }));

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName.toLowerCase()).toBe("ds-icon");
    });

    it("Spinner should forward ref to ds-spinner element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(Spinner, { ref }));

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName.toLowerCase()).toBe("ds-spinner");
    });

    it("VisuallyHidden should forward ref to ds-visually-hidden element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(VisuallyHidden, { ref }, "Hidden text"));

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName.toLowerCase()).toBe("ds-visually-hidden");
    });

    it("Text should forward ref to span element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(Text, { ref }, "Content"));

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName.toLowerCase()).toBe("span");
    });

    it("Box should forward ref to div element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(Box, { ref }, "Content"));

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName.toLowerCase()).toBe("div");
    });
  });

  describe("Callback refs", () => {
    it("Button should forward callback ref", () => {
      const refCallback = vi.fn();
      render(createElement(Button, { ref: refCallback }, "Click me"));

      expect(refCallback).toHaveBeenCalled();
      expect(refCallback.mock.calls[0][0]?.tagName.toLowerCase()).toBe("ds-button");
    });

    it("Input should forward callback ref", () => {
      const refCallback = vi.fn();
      render(createElement(Input, { ref: refCallback }));

      expect(refCallback).toHaveBeenCalled();
      expect(refCallback.mock.calls[0][0]?.tagName.toLowerCase()).toBe("ds-input");
    });

    it("Link should forward callback ref", () => {
      const refCallback = vi.fn();
      render(createElement(Link, { ref: refCallback, href: "/test" }, "Test"));

      expect(refCallback).toHaveBeenCalled();
      expect(refCallback.mock.calls[0][0]?.tagName.toLowerCase()).toBe("ds-link");
    });

    it("Icon should forward callback ref", () => {
      const refCallback = vi.fn();
      render(createElement(Icon, { ref: refCallback, name: "check" }));

      expect(refCallback).toHaveBeenCalled();
      expect(refCallback.mock.calls[0][0]?.tagName.toLowerCase()).toBe("ds-icon");
    });

    it("Spinner should forward callback ref", () => {
      const refCallback = vi.fn();
      render(createElement(Spinner, { ref: refCallback }));

      expect(refCallback).toHaveBeenCalled();
      expect(refCallback.mock.calls[0][0]?.tagName.toLowerCase()).toBe("ds-spinner");
    });

    it("VisuallyHidden should forward callback ref", () => {
      const refCallback = vi.fn();
      render(createElement(VisuallyHidden, { ref: refCallback }, "Hidden"));

      expect(refCallback).toHaveBeenCalled();
      expect(refCallback.mock.calls[0][0]?.tagName.toLowerCase()).toBe("ds-visually-hidden");
    });

    it("Text should forward callback ref", () => {
      const refCallback = vi.fn();
      render(createElement(Text, { ref: refCallback }, "Content"));

      expect(refCallback).toHaveBeenCalled();
      expect(refCallback.mock.calls[0][0]?.tagName.toLowerCase()).toBe("span");
    });

    it("Box should forward callback ref", () => {
      const refCallback = vi.fn();
      render(createElement(Box, { ref: refCallback }, "Content"));

      expect(refCallback).toHaveBeenCalled();
      expect(refCallback.mock.calls[0][0]?.tagName.toLowerCase()).toBe("div");
    });
  });

  describe("asChild ref forwarding", () => {
    it("Text with asChild should forward ref to child element", () => {
      const ref = createRef<HTMLElement>();
      render(
        createElement(
          Text,
          { ref, asChild: true },
          createElement("h1", null, "Title")
        )
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe("H1");
    });

    it("Box with asChild should forward ref to child element", () => {
      const ref = createRef<HTMLElement>();
      render(
        createElement(
          Box,
          { ref, asChild: true, p: 4 },
          createElement("main", null, "Content")
        )
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe("MAIN");
    });

    it("Link with asChild should forward ref to child element", () => {
      const ref = createRef<HTMLElement>();
      render(
        createElement(
          Link,
          { ref, href: "/about", asChild: true },
          createElement("a", { href: "/about" }, "About")
        )
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe("A");
    });

    it("Slot should forward ref to child element", () => {
      const ref = createRef<HTMLElement>();
      render(
        createElement(
          Slot,
          { ref },
          createElement("article", null, "Content")
        )
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe("ARTICLE");
    });
  });

  describe("Ref merging with asChild", () => {
    it("Slot should merge parent ref with child ref", () => {
      const parentRef = createRef<HTMLElement>();
      const childRef = createRef<HTMLDivElement>();

      render(
        createElement(
          Slot,
          { ref: parentRef },
          createElement("div", { ref: childRef }, "Content")
        )
      );

      // Both refs should point to the same element
      expect(parentRef.current).toBe(childRef.current);
      expect(parentRef.current?.tagName).toBe("DIV");
    });

    it("Box with asChild should merge refs correctly", () => {
      const parentRef = createRef<HTMLElement>();
      const childRef = createRef<HTMLElement>();

      render(
        createElement(
          Box,
          { ref: parentRef, asChild: true, p: 4 },
          createElement("section", { ref: childRef }, "Content")
        )
      );

      // Both refs should point to the same element
      expect(parentRef.current).toBe(childRef.current);
      expect(parentRef.current?.tagName).toBe("SECTION");
    });

    it("should handle callback ref merging in Slot", () => {
      const parentCallback = vi.fn();
      const childCallback = vi.fn();

      render(
        createElement(
          Slot,
          { ref: parentCallback },
          createElement("span", { ref: childCallback }, "Content")
        )
      );

      // Both callbacks should be called with the same element
      expect(parentCallback).toHaveBeenCalled();
      expect(childCallback).toHaveBeenCalled();
      expect(parentCallback.mock.calls[0][0]).toBe(childCallback.mock.calls[0][0]);
    });
  });

});
