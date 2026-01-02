import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Import the component to register it
import "../src/components/input/input.js";
import type { DsInput } from "../src/components/input/input.js";

describe("ds-input", () => {
  let input: DsInput;

  beforeEach(() => {
    input = document.createElement("ds-input") as DsInput;
    document.body.appendChild(input);
  });

  afterEach(() => {
    document.body.removeChild(input);
  });

  describe("initialization", () => {
    it("should be defined as a custom element", () => {
      expect(customElements.get("ds-input")).toBeDefined();
    });

    it("should have default type of text", () => {
      expect(input.type).toBe("text");
    });

    it("should have default size of md", () => {
      expect(input.size).toBe("md");
    });

    it("should not be disabled by default", () => {
      expect(input.disabled).toBe(false);
    });

    it("should not be readonly by default", () => {
      expect(input.readonly).toBe(false);
    });

    it("should not have error state by default", () => {
      expect(input.error).toBe(false);
    });

    it("should have empty value by default", () => {
      expect(input.value).toBe("");
    });
  });

  describe("rendering", () => {
    it("should render an input element", async () => {
      await input.updateComplete;
      const innerInput = input.querySelector("input");
      expect(innerInput).not.toBeNull();
    });

    it("should render with ds-input class", async () => {
      await input.updateComplete;
      const container = input.querySelector(".ds-input");
      expect(container).not.toBeNull();
    });

    it("should apply type attribute", async () => {
      input.type = "email";
      await input.updateComplete;

      const innerInput = input.querySelector("input");
      expect(innerInput?.type).toBe("email");
    });

    it("should apply placeholder", async () => {
      input.placeholder = "Enter text...";
      await input.updateComplete;

      const innerInput = input.querySelector("input");
      expect(innerInput?.placeholder).toBe("Enter text...");
    });
  });

  describe("value handling", () => {
    it("should reflect value property to input", async () => {
      input.value = "test value";
      await input.updateComplete;

      const innerInput = input.querySelector("input");
      expect(innerInput?.value).toBe("test value");
    });

    it("should dispatch input event on input", async () => {
      await input.updateComplete;

      const inputHandler = vi.fn();
      input.addEventListener("input", inputHandler);

      const innerInput = input.querySelector("input") as HTMLInputElement;
      innerInput.value = "new value";
      innerInput.dispatchEvent(new Event("input", { bubbles: true }));

      expect(inputHandler).toHaveBeenCalled();
      expect(input.value).toBe("new value");
    });

    it("should dispatch change event on change", async () => {
      await input.updateComplete;

      const changeHandler = vi.fn();
      input.addEventListener("change", changeHandler);

      const innerInput = input.querySelector("input") as HTMLInputElement;
      innerInput.value = "committed value";
      innerInput.dispatchEvent(new Event("change", { bubbles: true }));

      expect(changeHandler).toHaveBeenCalled();
    });

    it("should include value in event detail", async () => {
      await input.updateComplete;

      let eventDetail: { value: string } | undefined;
      // Listen for CustomEvent (which has detail property)
      input.addEventListener("input", (e: Event) => {
        const customEvent = e as CustomEvent<{ value: string }>;
        if (customEvent.detail) {
          eventDetail = customEvent.detail;
        }
      });

      const innerInput = input.querySelector("input") as HTMLInputElement;
      innerInput.value = "test";
      innerInput.dispatchEvent(new Event("input", { bubbles: true }));

      // The component dispatches a CustomEvent after handling the native event
      expect(eventDetail).toBeDefined();
      expect(eventDetail?.value).toBe("test");
    });
  });

  describe("disabled state", () => {
    it("should set disabled attribute on inner input", async () => {
      input.disabled = true;
      await input.updateComplete;

      const innerInput = input.querySelector("input");
      expect(innerInput?.disabled).toBe(true);
    });

    it("should reflect disabled attribute", async () => {
      input.disabled = true;
      await input.updateComplete;

      expect(input.hasAttribute("disabled")).toBe(true);
    });
  });

  describe("readonly state", () => {
    it("should set readonly attribute on inner input", async () => {
      input.readonly = true;
      await input.updateComplete;

      const innerInput = input.querySelector("input");
      expect(innerInput?.readOnly).toBe(true);
    });
  });

  describe("required state", () => {
    it("should set required attribute on inner input", async () => {
      input.required = true;
      await input.updateComplete;

      const innerInput = input.querySelector("input");
      expect(innerInput?.required).toBe(true);
    });
  });

  describe("error state", () => {
    it("should set aria-invalid on inner input when error", async () => {
      input.error = true;
      await input.updateComplete;

      const innerInput = input.querySelector("input");
      expect(innerInput?.getAttribute("aria-invalid")).toBe("true");
    });
  });

  describe("validation attributes", () => {
    it("should apply minlength", async () => {
      input.minlength = 5;
      await input.updateComplete;

      const innerInput = input.querySelector("input");
      expect(innerInput?.minLength).toBe(5);
    });

    it("should apply maxlength", async () => {
      input.maxlength = 100;
      await input.updateComplete;

      const innerInput = input.querySelector("input");
      expect(innerInput?.maxLength).toBe(100);
    });

    it("should apply pattern", async () => {
      input.pattern = "[A-Za-z]+";
      await input.updateComplete;

      const innerInput = input.querySelector("input");
      expect(innerInput?.pattern).toBe("[A-Za-z]+");
    });
  });

  describe("input types", () => {
    const types = ["text", "email", "password", "number", "tel", "url", "search"] as const;

    for (const type of types) {
      it(`should support ${type} type`, async () => {
        input.type = type;
        await input.updateComplete;

        const innerInput = input.querySelector("input");
        expect(innerInput?.type).toBe(type);
      });
    }
  });

  describe("sizes", () => {
    const sizes = ["sm", "md", "lg"] as const;

    for (const size of sizes) {
      it(`should support ${size} size`, async () => {
        input.size = size;
        await input.updateComplete;

        const container = input.querySelector(".ds-input");
        expect(container?.getAttribute("data-size")).toBe(size);
      });
    }
  });

  describe("name attribute", () => {
    it("should set name on inner input", async () => {
      input.name = "email-field";
      await input.updateComplete;

      const innerInput = input.querySelector("input");
      expect(innerInput?.name).toBe("email-field");
    });
  });
});
