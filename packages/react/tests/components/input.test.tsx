import { cleanup, render } from "@testing-library/react";
import { createElement, createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Input } from "../../src/components/input.js";

// Mock the Web Component
class MockDsInput extends HTMLElement {
  type = "text";
  size = "md";
  value = "";

  connectedCallback() {
    const input = document.createElement("input");
    input.className = "ds-input";
    this.appendChild(input);
  }
}

if (!customElements.get("ds-input")) {
  customElements.define("ds-input", MockDsInput);
}

describe("Input React Component", () => {
  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("should render ds-input element", () => {
      const { container } = render(createElement(Input));
      const input = container.querySelector("ds-input");
      expect(input).not.toBeNull();
    });

    it("should have displayName", () => {
      expect(Input.displayName).toBe("Input");
    });
  });

  describe("props", () => {
    it("should pass type prop", () => {
      const { container } = render(createElement(Input, { type: "email" }));
      const input = container.querySelector("ds-input");
      expect(input?.getAttribute("type")).toBe("email");
    });

    it("should pass size prop", () => {
      const { container } = render(createElement(Input, { size: "lg" }));
      const input = container.querySelector("ds-input");
      expect(input?.getAttribute("size")).toBe("lg");
    });

    it("should pass name prop", () => {
      const { container } = render(createElement(Input, { name: "username" }));
      const input = container.querySelector("ds-input");
      expect(input?.getAttribute("name")).toBe("username");
    });

    it("should pass value prop", () => {
      const { container } = render(createElement(Input, { value: "test value" }));
      const input = container.querySelector("ds-input");
      expect(input?.getAttribute("value")).toBe("test value");
    });

    it("should pass placeholder prop", () => {
      const { container } = render(createElement(Input, { placeholder: "Enter text" }));
      const input = container.querySelector("ds-input");
      expect(input?.getAttribute("placeholder")).toBe("Enter text");
    });

    it("should pass disabled prop when true", () => {
      const { container } = render(createElement(Input, { disabled: true }));
      const input = container.querySelector("ds-input");
      expect(input?.hasAttribute("disabled")).toBe(true);
    });

    it("should not pass disabled attribute when false", () => {
      const { container } = render(createElement(Input, { disabled: false }));
      const input = container.querySelector("ds-input");
      expect(input?.hasAttribute("disabled")).toBe(false);
    });

    it("should pass readOnly prop when true", () => {
      const { container } = render(createElement(Input, { readOnly: true }));
      const input = container.querySelector("ds-input");
      expect(input?.hasAttribute("readonly")).toBe(true);
    });

    it("should pass required prop when true", () => {
      const { container } = render(createElement(Input, { required: true }));
      const input = container.querySelector("ds-input");
      expect(input?.hasAttribute("required")).toBe(true);
    });

    it("should pass error prop when true", () => {
      const { container } = render(createElement(Input, { error: true }));
      const input = container.querySelector("ds-input");
      expect(input?.hasAttribute("error")).toBe(true);
    });

    it("should pass minLength prop", () => {
      const { container } = render(createElement(Input, { minLength: 3 }));
      const input = container.querySelector("ds-input");
      expect(input?.getAttribute("minlength")).toBe("3");
    });

    it("should pass maxLength prop", () => {
      const { container } = render(createElement(Input, { maxLength: 100 }));
      const input = container.querySelector("ds-input");
      expect(input?.getAttribute("maxlength")).toBe("100");
    });

    it("should pass pattern prop", () => {
      const { container } = render(createElement(Input, { pattern: "[A-Za-z]+" }));
      const input = container.querySelector("ds-input");
      expect(input?.getAttribute("pattern")).toBe("[A-Za-z]+");
    });

    it("should pass className as class", () => {
      const { container } = render(createElement(Input, { className: "custom-input" }));
      const input = container.querySelector("ds-input");
      expect(input?.getAttribute("class")).toBe("custom-input");
    });
  });

  describe("default props", () => {
    it("should use default type of text", () => {
      const { container } = render(createElement(Input));
      const input = container.querySelector("ds-input");
      expect(input?.getAttribute("type")).toBe("text");
    });

    it("should use default size of md", () => {
      const { container } = render(createElement(Input));
      const input = container.querySelector("ds-input");
      expect(input?.getAttribute("size")).toBe("md");
    });
  });

  describe("onChange event", () => {
    it("should call onChange when change event fires", () => {
      const handleChange = vi.fn();
      const { container } = render(createElement(Input, { onChange: handleChange }));
      const input = container.querySelector("ds-input");

      const event = new CustomEvent("change", {
        detail: { value: "new value" },
        bubbles: true,
      });
      input?.dispatchEvent(event);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange.mock.calls[0][0]).toBe("new value");
      expect(handleChange.mock.calls[0][1]).toBe(event);
    });

    it("should not fail when onChange is not provided", () => {
      const { container } = render(createElement(Input));
      const input = container.querySelector("ds-input");

      const event = new CustomEvent("change", {
        detail: { value: "new value" },
        bubbles: true,
      });
      // Should not throw
      input?.dispatchEvent(event);
    });
  });

  describe("onValueChange event", () => {
    it("should call onValueChange on input event", () => {
      const handleValueChange = vi.fn();
      const { container } = render(createElement(Input, { onValueChange: handleValueChange }));
      const input = container.querySelector("ds-input");

      const event = new CustomEvent("input", {
        detail: { value: "typing..." },
        bubbles: true,
      });
      input?.dispatchEvent(event);

      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(handleValueChange.mock.calls[0][0]).toBe("typing...");
      expect(handleValueChange.mock.calls[0][1]).toBe(event);
    });

    it("should fire onValueChange on every keystroke", () => {
      const handleValueChange = vi.fn();
      const { container } = render(createElement(Input, { onValueChange: handleValueChange }));
      const input = container.querySelector("ds-input");

      for (const char of ["h", "he", "hel", "hell", "hello"]) {
        const event = new CustomEvent("input", {
          detail: { value: char },
          bubbles: true,
        });
        input?.dispatchEvent(event);
      }

      expect(handleValueChange).toHaveBeenCalledTimes(5);
    });

    it("should not fail when onValueChange is not provided", () => {
      const { container } = render(createElement(Input));
      const input = container.querySelector("ds-input");

      const event = new CustomEvent("input", {
        detail: { value: "typing" },
        bubbles: true,
      });
      // Should not throw
      input?.dispatchEvent(event);
    });
  });

  describe("both onChange and onValueChange", () => {
    it("should support both handlers simultaneously", () => {
      const handleChange = vi.fn();
      const handleValueChange = vi.fn();
      const { container } = render(
        createElement(Input, { onChange: handleChange, onValueChange: handleValueChange })
      );
      const input = container.querySelector("ds-input");

      // Simulate typing
      const inputEvent = new CustomEvent("input", {
        detail: { value: "test" },
        bubbles: true,
      });
      input?.dispatchEvent(inputEvent);

      // Simulate blur/change
      const changeEvent = new CustomEvent("change", {
        detail: { value: "test" },
        bubbles: true,
      });
      input?.dispatchEvent(changeEvent);

      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to ds-input element", () => {
      const ref = createRef<HTMLElement>();
      render(createElement(Input, { ref }));
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName.toLowerCase()).toBe("ds-input");
    });

    it("should forward callback ref to ds-input element", () => {
      let ref: HTMLElement | null = null;
      render(createElement(Input, { ref: (el) => { ref = el; } }));
      expect(ref).not.toBeNull();
      expect(ref?.tagName.toLowerCase()).toBe("ds-input");
    });
  });

  describe("input types", () => {
    const types = ["text", "email", "password", "number", "tel", "url", "search"] as const;

    for (const type of types) {
      it(`should render ${type} input type`, () => {
        const { container } = render(createElement(Input, { type }));
        const input = container.querySelector("ds-input");
        expect(input?.getAttribute("type")).toBe(type);
      });
    }
  });

  describe("input sizes", () => {
    const sizes = ["sm", "md", "lg"] as const;

    for (const size of sizes) {
      it(`should render ${size} size`, () => {
        const { container } = render(createElement(Input, { size }));
        const input = container.querySelector("ds-input");
        expect(input?.getAttribute("size")).toBe(size);
      });
    }
  });
});
