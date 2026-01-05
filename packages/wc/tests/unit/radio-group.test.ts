import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { html, render } from "lit";
import "../../src/components/radio/radio-group.js";
import "../../src/components/radio/radio.js";
import "../../src/components/field/field.js";

describe("DsRadioGroup", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("should render radio group with role", async () => {
      render(
        html`
          <ds-radio-group name="size">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
            <ds-radio value="lg">Large</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const group = container.querySelector("ds-radio-group");
      expect(group?.getAttribute("role")).toBe("radiogroup");
    });

    it("should render radio items with role", async () => {
      render(
        html`
          <ds-radio-group name="size">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const radios = container.querySelectorAll("[role='radio']");
      expect(radios.length).toBe(2);
    });

    it("should have no selection by default", async () => {
      render(
        html`
          <ds-radio-group name="size">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const group = container.querySelector("ds-radio-group") as HTMLElement & { value: string };
      expect(group?.value).toBeFalsy();
    });
  });

  describe("value selection", () => {
    it("should reflect initial value", async () => {
      render(
        html`
          <ds-radio-group name="size" value="md">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
            <ds-radio value="lg">Large</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const group = container.querySelector("ds-radio-group") as HTMLElement & { value: string };
      expect(group?.value).toBe("md");
    });

    it("should mark selected radio as checked", async () => {
      render(
        html`
          <ds-radio-group name="size" value="md">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
            <ds-radio value="lg">Large</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const radios = container.querySelectorAll("ds-radio");
      const mdRadio = Array.from(radios).find(r => r.getAttribute("value") === "md");
      expect(mdRadio?.querySelector("[role='radio']")?.getAttribute("aria-checked")).toBe("true");
    });

    it("should update value on radio click", async () => {
      render(
        html`
          <ds-radio-group name="size">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const group = container.querySelector("ds-radio-group") as HTMLElement & { value: string };
      const smRadio = container.querySelector("ds-radio[value='sm']")?.querySelector("[role='radio']") as HTMLElement;

      smRadio?.click();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(group?.value).toBe("sm");
    });

    it("should only allow one selection at a time", async () => {
      render(
        html`
          <ds-radio-group name="size" value="sm">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const mdRadio = container.querySelector("ds-radio[value='md']")?.querySelector("[role='radio']") as HTMLElement;
      mdRadio?.click();
      await new Promise((resolve) => setTimeout(resolve, 0));

      const smControl = container.querySelector("ds-radio[value='sm']")?.querySelector("[role='radio']");
      const mdControl = container.querySelector("ds-radio[value='md']")?.querySelector("[role='radio']");

      expect(smControl?.getAttribute("aria-checked")).toBe("false");
      expect(mdControl?.getAttribute("aria-checked")).toBe("true");
    });
  });

  describe("keyboard navigation", () => {
    it("should implement roving tabindex", async () => {
      render(
        html`
          <ds-radio-group name="size">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
            <ds-radio value="lg">Large</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      // Wait for Lit components to update
      await new Promise((resolve) => setTimeout(resolve, 50));

      const radios = container.querySelectorAll("[role='radio']") as NodeListOf<HTMLElement>;
      // First radio should be tabbable, others not
      expect(radios[0]?.tabIndex).toBe(0);
      expect(radios[1]?.tabIndex).toBe(-1);
      expect(radios[2]?.tabIndex).toBe(-1);
    });

    it("should move focus with Arrow keys (vertical orientation)", async () => {
      render(
        html`
          <ds-radio-group name="size" orientation="vertical">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
            <ds-radio value="lg">Large</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const group = container.querySelector("ds-radio-group") as HTMLElement;
      const firstRadio = container.querySelector("[role='radio']") as HTMLElement;
      firstRadio?.focus();

      // Arrow Down should move to next
      group?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));

      const radios = container.querySelectorAll("[role='radio']");
      expect(radios[1]?.getAttribute("tabindex")).toBe("0");
    });

    it("should select on focus (selection follows focus)", async () => {
      render(
        html`
          <ds-radio-group name="size">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const group = container.querySelector("ds-radio-group") as HTMLElement & { value: string };
      const firstRadio = container.querySelector("[role='radio']") as HTMLElement;
      firstRadio?.focus();

      group?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(group?.value).toBe("md");
    });

    it("should loop from last to first", async () => {
      render(
        html`
          <ds-radio-group name="size" value="lg">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
            <ds-radio value="lg">Large</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const group = container.querySelector("ds-radio-group") as HTMLElement & { value: string };
      const lgRadio = container.querySelector("ds-radio[value='lg']")?.querySelector("[role='radio']") as HTMLElement;
      lgRadio?.focus();

      group?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(group?.value).toBe("sm");
    });
  });

  describe("orientation", () => {
    it("should default to vertical orientation", async () => {
      render(
        html`
          <ds-radio-group name="size">
            <ds-radio value="sm">Small</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const group = container.querySelector("ds-radio-group") as HTMLElement & { orientation: string };
      expect(group?.orientation).toBe("vertical");
    });

    it("should support horizontal orientation", async () => {
      render(
        html`
          <ds-radio-group name="size" orientation="horizontal">
            <ds-radio value="sm">Small</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const group = container.querySelector("ds-radio-group") as HTMLElement & { orientation: string };
      expect(group?.orientation).toBe("horizontal");
    });

    it("should use Arrow Left/Right for horizontal orientation", async () => {
      render(
        html`
          <ds-radio-group name="size" orientation="horizontal">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const group = container.querySelector("ds-radio-group") as HTMLElement & { value: string };
      const firstRadio = container.querySelector("[role='radio']") as HTMLElement;
      firstRadio?.focus();

      group?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(group?.value).toBe("md");
    });
  });

  describe("disabled state", () => {
    it("should disable all radios when group is disabled", async () => {
      render(
        html`
          <ds-radio-group name="size" disabled>
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const radios = container.querySelectorAll("[role='radio']");
      radios.forEach((radio) => {
        expect(radio.getAttribute("aria-disabled")).toBe("true");
      });
    });

    it("should not change selection when disabled", async () => {
      render(
        html`
          <ds-radio-group name="size" disabled value="sm">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const group = container.querySelector("ds-radio-group") as HTMLElement & { value: string };
      const mdRadio = container.querySelector("ds-radio[value='md']")?.querySelector("[role='radio']") as HTMLElement;

      mdRadio?.click();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(group?.value).toBe("sm");
    });

    it("should support individual radio disabled", async () => {
      render(
        html`
          <ds-radio-group name="size">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md" disabled>Medium</ds-radio>
            <ds-radio value="lg">Large</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const mdControl = container.querySelector("ds-radio[value='md']")?.querySelector("[role='radio']");
      expect(mdControl?.getAttribute("aria-disabled")).toBe("true");
    });

    it("should skip disabled radios during keyboard navigation", async () => {
      render(
        html`
          <ds-radio-group name="size">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md" disabled>Medium</ds-radio>
            <ds-radio value="lg">Large</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const group = container.querySelector("ds-radio-group") as HTMLElement & { value: string };
      const firstRadio = container.querySelector("[role='radio']") as HTMLElement;
      firstRadio?.focus();

      group?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should skip md and select lg
      expect(group?.value).toBe("lg");
    });
  });

  describe("events", () => {
    it("should emit ds:change event on selection", async () => {
      const changeHandler = vi.fn();

      render(
        html`
          <ds-radio-group name="size" @ds:change=${changeHandler}>
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const smRadio = container.querySelector("ds-radio[value='sm']")?.querySelector("[role='radio']") as HTMLElement;
      smRadio?.click();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(changeHandler).toHaveBeenCalled();
      expect(changeHandler.mock.calls[0][0].detail).toEqual({ value: "sm" });
    });
  });
});

describe("DsRadio", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should render label content", async () => {
    render(
      html`
        <ds-radio-group name="size">
          <ds-radio value="sm">Small option</ds-radio>
        </ds-radio-group>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const radio = container.querySelector("ds-radio");
    expect(radio?.textContent).toContain("Small option");
  });

  it("should have aria-checked based on group value", async () => {
    render(
      html`
        <ds-radio-group name="size" value="sm">
          <ds-radio value="sm">Small</ds-radio>
          <ds-radio value="md">Medium</ds-radio>
        </ds-radio-group>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const smControl = container.querySelector("ds-radio[value='sm']")?.querySelector("[role='radio']");
    const mdControl = container.querySelector("ds-radio[value='md']")?.querySelector("[role='radio']");

    expect(smControl?.getAttribute("aria-checked")).toBe("true");
    expect(mdControl?.getAttribute("aria-checked")).toBe("false");
  });
});

describe("DsRadioGroup with Field", () => {
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
          <ds-label>Size</ds-label>
          <ds-radio-group name="size">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
          </ds-radio-group>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const group = container.querySelector("ds-radio-group");
    expect(group?.getAttribute("aria-labelledby")).toBeTruthy();
  });

  it("should integrate with Field for error state", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Size</ds-label>
          <ds-radio-group name="size">
            <ds-radio value="sm">Small</ds-radio>
          </ds-radio-group>
          <ds-field-error>Please select a size</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const group = container.querySelector("ds-radio-group");
    expect(group?.getAttribute("aria-describedby")).toBeTruthy();
  });
});
