import { cleanup, render } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "../src/components/button";

// Mock the Web Component
class MockDsButton extends HTMLElement {
  variant = "primary";
  size = "md";
  disabled = false;
  loading = false;
  type = "button";

  connectedCallback() {
    // Simulate rendering
    const button = document.createElement("button");
    button.className = "ds-button";
    this.appendChild(button);
  }
}

// Register mock component if not already registered
if (!customElements.get("ds-button")) {
  customElements.define("ds-button", MockDsButton);
}

describe("Button React Component", () => {
  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("should render ds-button element", () => {
      const { container } = render(createElement(Button, null, "Click me"));
      const button = container.querySelector("ds-button");
      expect(button).not.toBeNull();
    });

    it("should render children content", () => {
      const { container } = render(createElement(Button, null, "Click me"));
      expect(container.textContent).toContain("Click me");
    });

    it("should have displayName", () => {
      expect(Button.displayName).toBe("Button");
    });
  });

  describe("props", () => {
    it("should pass variant prop", () => {
      const { container } = render(createElement(Button, { variant: "secondary" }, "Test"));
      const button = container.querySelector("ds-button");
      expect(button?.getAttribute("variant")).toBe("secondary");
    });

    it("should pass size prop", () => {
      const { container } = render(createElement(Button, { size: "lg" }, "Test"));
      const button = container.querySelector("ds-button");
      expect(button?.getAttribute("size")).toBe("lg");
    });

    it("should pass disabled prop", () => {
      const { container } = render(createElement(Button, { disabled: true }, "Test"));
      const button = container.querySelector("ds-button");
      expect(button?.hasAttribute("disabled")).toBe(true);
    });

    it("should not set disabled attribute when false", () => {
      const { container } = render(createElement(Button, { disabled: false }, "Test"));
      const button = container.querySelector("ds-button");
      expect(button?.hasAttribute("disabled")).toBe(false);
    });

    it("should pass loading prop", () => {
      const { container } = render(createElement(Button, { loading: true }, "Test"));
      const button = container.querySelector("ds-button");
      expect(button?.hasAttribute("loading")).toBe(true);
    });

    it("should pass type prop", () => {
      const { container } = render(createElement(Button, { type: "submit" }, "Test"));
      const button = container.querySelector("ds-button");
      expect(button?.getAttribute("type")).toBe("submit");
    });

    it("should pass className as class attribute", () => {
      const { container } = render(createElement(Button, { className: "custom-class" }, "Test"));
      const button = container.querySelector("ds-button");
      expect(button?.getAttribute("class")).toBe("custom-class");
    });
  });

  describe("default props", () => {
    it("should use default variant of primary", () => {
      const { container } = render(createElement(Button, null, "Test"));
      const button = container.querySelector("ds-button");
      expect(button?.getAttribute("variant")).toBe("primary");
    });

    it("should use default size of md", () => {
      const { container } = render(createElement(Button, null, "Test"));
      const button = container.querySelector("ds-button");
      expect(button?.getAttribute("size")).toBe("md");
    });

    it("should use default type of button", () => {
      const { container } = render(createElement(Button, null, "Test"));
      const button = container.querySelector("ds-button");
      expect(button?.getAttribute("type")).toBe("button");
    });
  });

  describe("event handling", () => {
    it("should call onClick when clicked", async () => {
      const handleClick = vi.fn();
      const { container } = render(createElement(Button, { onClick: handleClick }, "Test"));

      const button = container.querySelector("ds-button");
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when not provided", () => {
      const { container } = render(createElement(Button, null, "Test"));

      const button = container.querySelector("ds-button");
      // Should not throw
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to ds-button element", () => {
      let ref: HTMLElement | null = null;
      render(
        createElement(
          Button,
          {
            ref: (el: HTMLElement | null) => {
              ref = el;
            },
          },
          "Test"
        )
      );

      expect(ref).not.toBeNull();
      expect(ref?.tagName.toLowerCase()).toBe("ds-button");
    });
  });

  describe("variants", () => {
    const variants = ["primary", "secondary", "ghost", "destructive"] as const;

    for (const variant of variants) {
      it(`should render ${variant} variant`, () => {
        const { container } = render(createElement(Button, { variant }, "Test"));
        const button = container.querySelector("ds-button");
        expect(button?.getAttribute("variant")).toBe(variant);
      });
    }
  });

  describe("sizes", () => {
    const sizes = ["sm", "md", "lg"] as const;

    for (const size of sizes) {
      it(`should render ${size} size`, () => {
        const { container } = render(createElement(Button, { size }, "Test"));
        const button = container.querySelector("ds-button");
        expect(button?.getAttribute("size")).toBe(size);
      });
    }
  });
});
