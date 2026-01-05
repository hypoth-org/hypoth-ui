import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../src/components/textarea/textarea.js";
import "../../src/components/field/field.js";

describe("DsTextarea", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("should render textarea element", async () => {
      render(html`<ds-textarea></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const textarea = container.querySelector("ds-textarea");
      const nativeTextarea = textarea?.querySelector("textarea");
      expect(nativeTextarea).toBeTruthy();
    });

    it("should render with placeholder", async () => {
      render(html`<ds-textarea placeholder="Enter text..."></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeTextarea = container.querySelector("textarea");
      expect(nativeTextarea?.getAttribute("placeholder")).toBe("Enter text...");
    });

    it("should render with initial value", async () => {
      render(html`<ds-textarea value="Hello World"></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeTextarea = container.querySelector("textarea");
      expect(nativeTextarea?.value).toBe("Hello World");
    });

    it("should reflect disabled state", async () => {
      render(html`<ds-textarea disabled></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeTextarea = container.querySelector("textarea");
      expect(nativeTextarea?.disabled).toBe(true);
    });

    it("should reflect readonly state", async () => {
      render(html`<ds-textarea readonly></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeTextarea = container.querySelector("textarea");
      expect(nativeTextarea?.readOnly).toBe(true);
    });

    it("should reflect required state", async () => {
      render(html`<ds-textarea required></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeTextarea = container.querySelector("textarea");
      expect(nativeTextarea?.required).toBe(true);
    });
  });

  describe("size variants", () => {
    it("should have default size of md", async () => {
      render(html`<ds-textarea></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const wrapper = container.querySelector(".ds-textarea");
      expect(wrapper?.getAttribute("data-size")).toBe("md");
    });

    it("should apply sm size", async () => {
      render(html`<ds-textarea size="sm"></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const wrapper = container.querySelector(".ds-textarea");
      expect(wrapper?.getAttribute("data-size")).toBe("sm");
    });

    it("should apply lg size", async () => {
      render(html`<ds-textarea size="lg"></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const wrapper = container.querySelector(".ds-textarea");
      expect(wrapper?.getAttribute("data-size")).toBe("lg");
    });
  });

  describe("value handling", () => {
    it("should update value on input", async () => {
      render(html`<ds-textarea></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const textarea = container.querySelector("ds-textarea") as HTMLElement & { value: string };
      const nativeTextarea = container.querySelector("textarea") as HTMLTextAreaElement;

      nativeTextarea.value = "New value";
      nativeTextarea.dispatchEvent(new Event("input", { bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(textarea?.value).toBe("New value");
    });

    it("should emit input event on input", async () => {
      const inputHandler = vi.fn();

      render(html`<ds-textarea @input=${inputHandler}></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeTextarea = container.querySelector("textarea") as HTMLTextAreaElement;
      nativeTextarea.value = "Test";
      nativeTextarea.dispatchEvent(new Event("input", { bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(inputHandler).toHaveBeenCalled();
    });

    it("should emit ds:change event on change", async () => {
      const changeHandler = vi.fn();

      render(html`<ds-textarea @ds:change=${changeHandler}></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeTextarea = container.querySelector("textarea") as HTMLTextAreaElement;
      nativeTextarea.value = "Test";
      nativeTextarea.dispatchEvent(new Event("change", { bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(changeHandler).toHaveBeenCalled();
    });
  });

  describe("rows configuration", () => {
    it("should have default rows of 3", async () => {
      render(html`<ds-textarea></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeTextarea = container.querySelector("textarea");
      // Use Number() as happy-dom may return string for rows property
      expect(Number(nativeTextarea?.rows)).toBe(3);
    });

    it("should respect minRows property", async () => {
      render(html`<ds-textarea .minRows=${5}></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeTextarea = container.querySelector("textarea");
      // Use Number() as happy-dom may return string for rows property
      expect(Number(nativeTextarea?.rows)).toBeGreaterThanOrEqual(5);
    });

    it("should respect rows attribute", async () => {
      render(html`<ds-textarea rows="6"></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeTextarea = container.querySelector("textarea");
      // Use Number() as happy-dom may return string for rows property
      expect(Number(nativeTextarea?.rows)).toBe(6);
    });
  });

  describe("auto-resize", () => {
    it("should have auto-resize enabled by default", async () => {
      render(html`<ds-textarea></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const textarea = container.querySelector("ds-textarea") as HTMLElement & {
        autoResize: boolean;
      };
      expect(textarea?.autoResize).toBe(true);
    });

    it("should allow disabling auto-resize", async () => {
      render(html`<ds-textarea .autoResize=${false}></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const textarea = container.querySelector("ds-textarea") as HTMLElement & {
        autoResize: boolean;
      };
      expect(textarea?.autoResize).toBe(false);
    });

    it("should respect maxRows when auto-resizing", async () => {
      render(html`<ds-textarea .maxRows=${5}></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const textarea = container.querySelector("ds-textarea") as HTMLElement & { maxRows: number };
      expect(textarea?.maxRows).toBe(5);
    });
  });

  describe("maxlength and minlength", () => {
    it("should set maxlength attribute", async () => {
      render(html`<ds-textarea .maxlength=${100}></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeTextarea = container.querySelector("textarea");
      expect(nativeTextarea?.getAttribute("maxlength")).toBe("100");
    });

    it("should set minlength attribute", async () => {
      render(html`<ds-textarea .minlength=${10}></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeTextarea = container.querySelector("textarea");
      expect(nativeTextarea?.getAttribute("minlength")).toBe("10");
    });
  });

  describe("error state", () => {
    it("should reflect error state to native textarea", async () => {
      render(html`<ds-textarea error></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeTextarea = container.querySelector("textarea");
      expect(nativeTextarea?.getAttribute("aria-invalid")).toBe("true");
    });

    it("should not have aria-invalid when no error", async () => {
      render(html`<ds-textarea></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeTextarea = container.querySelector("textarea");
      expect(nativeTextarea?.getAttribute("aria-invalid")).toBe("false");
    });
  });
});

describe("DsTextarea with Field", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should receive aria-labelledby from Field", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Description</ds-label>
          <ds-textarea></ds-textarea>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const textarea = container.querySelector("ds-textarea");
    const nativeTextarea = textarea?.querySelector("textarea");

    expect(textarea?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(nativeTextarea?.getAttribute("aria-labelledby")).toBeTruthy();
  });

  it("should receive aria-describedby from Field with error", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Description</ds-label>
          <ds-textarea></ds-textarea>
          <ds-field-error>This field is required</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const textarea = container.querySelector("ds-textarea");
    const nativeTextarea = textarea?.querySelector("textarea");

    expect(textarea?.getAttribute("aria-describedby")).toBeTruthy();
    expect(nativeTextarea?.getAttribute("aria-describedby")).toBeTruthy();
  });
});
