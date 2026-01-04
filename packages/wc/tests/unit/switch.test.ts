import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { html, render } from "lit";
import "../../src/components/switch/switch.js";
import "../../src/components/field/field.js";

describe("DsSwitch", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("should render with role='switch'", async () => {
      render(html`<ds-switch>Enable notifications</ds-switch>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='switch']");
      expect(control).toBeTruthy();
    });

    it("should render label content", async () => {
      render(html`<ds-switch>Enable notifications</ds-switch>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const switchEl = container.querySelector("ds-switch");
      expect(switchEl?.textContent).toContain("Enable notifications");
    });

    it("should have aria-checked='false' by default", async () => {
      render(html`<ds-switch>Toggle me</ds-switch>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='switch']");
      expect(control?.getAttribute("aria-checked")).toBe("false");
    });

    it("should have aria-checked='true' when checked", async () => {
      render(html`<ds-switch checked>Toggle me</ds-switch>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='switch']");
      expect(control?.getAttribute("aria-checked")).toBe("true");
    });

    it("should be focusable via tabindex", async () => {
      render(html`<ds-switch>Toggle me</ds-switch>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='switch']") as HTMLElement;
      expect(control?.tabIndex).toBe(0);
    });
  });

  describe("toggling", () => {
    it("should toggle checked state on click", async () => {
      render(html`<ds-switch>Toggle me</ds-switch>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const switchEl = container.querySelector("ds-switch") as HTMLElement & { checked: boolean };
      const control = container.querySelector("[role='switch']") as HTMLElement;

      expect(switchEl.checked).toBe(false);

      control.click();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(switchEl.checked).toBe(true);

      control.click();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(switchEl.checked).toBe(false);
    });

    it("should toggle on Space key press", async () => {
      render(html`<ds-switch>Toggle me</ds-switch>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const switchEl = container.querySelector("ds-switch") as HTMLElement & { checked: boolean };
      const control = container.querySelector("[role='switch']") as HTMLElement;

      control.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(switchEl.checked).toBe(true);
    });

    it("should toggle on Enter key press", async () => {
      render(html`<ds-switch>Toggle me</ds-switch>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const switchEl = container.querySelector("ds-switch") as HTMLElement & { checked: boolean };
      const control = container.querySelector("[role='switch']") as HTMLElement;

      control.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(switchEl.checked).toBe(true);
    });

    it("should emit ds:change event on toggle", async () => {
      const changeHandler = vi.fn();

      render(
        html`<ds-switch @ds:change=${changeHandler}>Toggle me</ds-switch>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='switch']") as HTMLElement;
      control.click();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(changeHandler).toHaveBeenCalled();
      expect(changeHandler.mock.calls[0][0].detail).toEqual({ checked: true });
    });
  });

  describe("disabled state", () => {
    it("should have aria-disabled='true' when disabled", async () => {
      render(html`<ds-switch disabled>Toggle me</ds-switch>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='switch']");
      expect(control?.getAttribute("aria-disabled")).toBe("true");
    });

    it("should not be focusable when disabled", async () => {
      render(html`<ds-switch disabled>Toggle me</ds-switch>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='switch']") as HTMLElement;
      expect(control?.tabIndex).toBe(-1);
    });

    it("should not toggle when disabled via click", async () => {
      render(html`<ds-switch disabled>Toggle me</ds-switch>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const switchEl = container.querySelector("ds-switch") as HTMLElement & { checked: boolean };
      const control = container.querySelector("[role='switch']") as HTMLElement;

      control.click();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(switchEl.checked).toBe(false);
    });

    it("should not toggle when disabled via keyboard", async () => {
      render(html`<ds-switch disabled>Toggle me</ds-switch>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const switchEl = container.querySelector("ds-switch") as HTMLElement & { checked: boolean };
      const control = container.querySelector("[role='switch']") as HTMLElement;

      control.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(switchEl.checked).toBe(false);
    });
  });

  describe("required state", () => {
    it("should have aria-required='true' when required", async () => {
      render(html`<ds-switch required>Toggle me</ds-switch>`, container);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const control = container.querySelector("[role='switch']");
      expect(control?.getAttribute("aria-required")).toBe("true");
    });
  });

  describe("form integration", () => {
    it("should have name attribute", async () => {
      render(
        html`<ds-switch name="notifications">Enable</ds-switch>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const switchEl = container.querySelector("ds-switch") as HTMLElement & { name: string };
      expect(switchEl.name).toBe("notifications");
    });

    it("should have value attribute", async () => {
      render(
        html`<ds-switch name="notifications" value="on">Enable</ds-switch>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const switchEl = container.querySelector("ds-switch") as HTMLElement & { value: string };
      expect(switchEl.value).toBe("on");
    });
  });
});

describe("DsSwitch with Field", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should integrate with Field for labeling", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Notifications</ds-label>
          <ds-switch name="notifications">Enable</ds-switch>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const switchEl = container.querySelector("ds-switch");
    expect(switchEl?.getAttribute("aria-labelledby")).toBeTruthy();
  });

  it("should integrate with Field for error state", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Terms</ds-label>
          <ds-switch name="terms" required>Accept terms</ds-switch>
          <ds-field-error>You must accept the terms</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const switchEl = container.querySelector("ds-switch");
    expect(switchEl?.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("should inherit disabled from Field", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Feature</ds-label>
          <ds-switch name="feature" aria-disabled="true">Enable feature</ds-switch>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const control = container.querySelector("[role='switch']");
    expect(control?.getAttribute("aria-disabled")).toBe("true");
  });
});
