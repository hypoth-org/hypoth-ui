import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { html, render } from "lit";
import "../../src/components/checkbox/checkbox.js";
import "../../src/components/field/field.js";

describe("DsCheckbox", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("should render checkbox element with role", async () => {
      render(
        html`<ds-checkbox>Accept terms</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const checkbox = container.querySelector("ds-checkbox");
      const control = checkbox?.querySelector("[role='checkbox']");
      expect(control).toBeTruthy();
    });

    it("should render label content", async () => {
      render(
        html`<ds-checkbox>Accept terms</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const checkbox = container.querySelector("ds-checkbox");
      expect(checkbox?.textContent).toContain("Accept terms");
    });

    it("should be unchecked by default", async () => {
      render(
        html`<ds-checkbox>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const checkbox = container.querySelector("ds-checkbox") as HTMLElement & { checked: boolean };
      expect(checkbox?.checked).toBe(false);
    });
  });

  describe("checked state", () => {
    it("should reflect checked attribute", async () => {
      render(
        html`<ds-checkbox checked>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const checkbox = container.querySelector("ds-checkbox") as HTMLElement & { checked: boolean };
      expect(checkbox?.checked).toBe(true);
    });

    it("should update aria-checked when checked", async () => {
      render(
        html`<ds-checkbox checked>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='checkbox']");
      expect(control?.getAttribute("aria-checked")).toBe("true");
    });

    it("should update aria-checked when unchecked", async () => {
      render(
        html`<ds-checkbox>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='checkbox']");
      expect(control?.getAttribute("aria-checked")).toBe("false");
    });

    it("should toggle checked on click", async () => {
      render(
        html`<ds-checkbox>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const checkbox = container.querySelector("ds-checkbox") as HTMLElement & { checked: boolean };
      const control = checkbox?.querySelector("[role='checkbox']") as HTMLElement;

      control?.click();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(checkbox?.checked).toBe(true);
    });

    it("should toggle checked on Space key", async () => {
      render(
        html`<ds-checkbox>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const checkbox = container.querySelector("ds-checkbox") as HTMLElement & { checked: boolean };
      const control = checkbox?.querySelector("[role='checkbox']") as HTMLElement;

      control?.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(checkbox?.checked).toBe(true);
    });
  });

  describe("indeterminate state", () => {
    it("should support indeterminate state", async () => {
      render(
        html`<ds-checkbox indeterminate>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const checkbox = container.querySelector("ds-checkbox") as HTMLElement & { indeterminate: boolean };
      expect(checkbox?.indeterminate).toBe(true);
    });

    it("should have aria-checked=mixed when indeterminate", async () => {
      render(
        html`<ds-checkbox indeterminate>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='checkbox']");
      expect(control?.getAttribute("aria-checked")).toBe("mixed");
    });

    it("should clear indeterminate when clicked", async () => {
      render(
        html`<ds-checkbox indeterminate>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const checkbox = container.querySelector("ds-checkbox") as HTMLElement & { indeterminate: boolean; checked: boolean };
      const control = checkbox?.querySelector("[role='checkbox']") as HTMLElement;

      control?.click();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(checkbox?.indeterminate).toBe(false);
      expect(checkbox?.checked).toBe(true);
    });
  });

  describe("disabled state", () => {
    it("should reflect disabled state", async () => {
      render(
        html`<ds-checkbox disabled>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const checkbox = container.querySelector("ds-checkbox") as HTMLElement & { disabled: boolean };
      expect(checkbox?.disabled).toBe(true);
    });

    it("should have aria-disabled when disabled", async () => {
      render(
        html`<ds-checkbox disabled>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='checkbox']");
      expect(control?.getAttribute("aria-disabled")).toBe("true");
    });

    it("should not toggle when disabled", async () => {
      render(
        html`<ds-checkbox disabled>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const checkbox = container.querySelector("ds-checkbox") as HTMLElement & { checked: boolean };
      const control = checkbox?.querySelector("[role='checkbox']") as HTMLElement;

      control?.click();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(checkbox?.checked).toBe(false);
    });
  });

  describe("events", () => {
    it("should emit ds:change event on toggle", async () => {
      const changeHandler = vi.fn();

      render(
        html`<ds-checkbox @ds:change=${changeHandler}>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='checkbox']") as HTMLElement;
      control?.click();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(changeHandler).toHaveBeenCalled();
      expect(changeHandler.mock.calls[0][0].detail).toEqual({
        checked: true,
        indeterminate: false,
      });
    });

    it("should include indeterminate in ds:change detail when clearing", async () => {
      const changeHandler = vi.fn();

      render(
        html`<ds-checkbox indeterminate @ds:change=${changeHandler}>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='checkbox']") as HTMLElement;
      control?.click();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(changeHandler.mock.calls[0][0].detail).toEqual({
        checked: true,
        indeterminate: false,
      });
    });
  });

  describe("value", () => {
    it("should have default value of 'on'", async () => {
      render(
        html`<ds-checkbox>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const checkbox = container.querySelector("ds-checkbox") as HTMLElement & { value: string };
      expect(checkbox?.value).toBe("on");
    });

    it("should accept custom value", async () => {
      render(
        html`<ds-checkbox value="custom">Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const checkbox = container.querySelector("ds-checkbox") as HTMLElement & { value: string };
      expect(checkbox?.value).toBe("custom");
    });
  });

  describe("required state", () => {
    it("should reflect required state", async () => {
      render(
        html`<ds-checkbox required>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const checkbox = container.querySelector("ds-checkbox") as HTMLElement & { required: boolean };
      expect(checkbox?.required).toBe(true);
    });

    it("should have aria-required when required", async () => {
      render(
        html`<ds-checkbox required>Option</ds-checkbox>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='checkbox']");
      expect(control?.getAttribute("aria-required")).toBe("true");
    });
  });
});

describe("DsCheckbox with Field", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should integrate with Field for error state", async () => {
    render(
      html`
        <ds-field>
          <ds-checkbox>Accept terms</ds-checkbox>
          <ds-field-error>You must accept the terms</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const checkbox = container.querySelector("ds-checkbox");
    expect(checkbox?.getAttribute("aria-describedby")).toBeTruthy();
  });
});
