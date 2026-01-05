import { axe, toHaveNoViolations } from "jest-axe";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/checkbox/checkbox.js";
import "../../src/components/radio/radio-group.js";
import "../../src/components/radio/radio.js";
import "../../src/components/field/field.js";

expect.extend(toHaveNoViolations);

describe("Checkbox accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should have no accessibility violations for basic checkbox", async () => {
    render(html`<ds-checkbox>Accept terms and conditions</ds-checkbox>`, container);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations when checked", async () => {
    render(html`<ds-checkbox checked>Enable notifications</ds-checkbox>`, container);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations when indeterminate", async () => {
    render(html`<ds-checkbox indeterminate>Select all</ds-checkbox>`, container);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations when disabled", async () => {
    render(html`<ds-checkbox disabled>Unavailable option</ds-checkbox>`, container);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with Field pattern", async () => {
    render(
      html`
        <ds-field>
          <ds-checkbox>I agree to the terms</ds-checkbox>
          <ds-field-description>Please review our terms of service</ds-field-description>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with Field error", async () => {
    render(
      html`
        <ds-field>
          <ds-checkbox>Accept terms</ds-checkbox>
          <ds-field-error>You must accept the terms to continue</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe("ARIA attributes", () => {
    it("should have correct role", async () => {
      render(html`<ds-checkbox>Option</ds-checkbox>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const control = container.querySelector("[role='checkbox']");
      expect(control).toBeTruthy();
    });

    it("should have aria-checked=false when unchecked", async () => {
      render(html`<ds-checkbox>Option</ds-checkbox>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const control = container.querySelector("[role='checkbox']");
      expect(control?.getAttribute("aria-checked")).toBe("false");
    });

    it("should have aria-checked=true when checked", async () => {
      render(html`<ds-checkbox checked>Option</ds-checkbox>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const control = container.querySelector("[role='checkbox']");
      expect(control?.getAttribute("aria-checked")).toBe("true");
    });

    it("should have aria-checked=mixed when indeterminate", async () => {
      render(html`<ds-checkbox indeterminate>Option</ds-checkbox>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const control = container.querySelector("[role='checkbox']");
      expect(control?.getAttribute("aria-checked")).toBe("mixed");
    });
  });
});

describe("RadioGroup accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should have no accessibility violations for basic radio group", async () => {
    render(
      html`
        <ds-radio-group name="size" aria-label="Select size">
          <ds-radio value="sm">Small</ds-radio>
          <ds-radio value="md">Medium</ds-radio>
          <ds-radio value="lg">Large</ds-radio>
        </ds-radio-group>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with selection", async () => {
    render(
      html`
        <ds-radio-group name="size" value="md" aria-label="Select size">
          <ds-radio value="sm">Small</ds-radio>
          <ds-radio value="md">Medium</ds-radio>
          <ds-radio value="lg">Large</ds-radio>
        </ds-radio-group>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations when disabled", async () => {
    render(
      html`
        <ds-radio-group name="size" disabled aria-label="Select size">
          <ds-radio value="sm">Small</ds-radio>
          <ds-radio value="md">Medium</ds-radio>
        </ds-radio-group>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with Field pattern", async () => {
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

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with Field error", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Size</ds-label>
          <ds-radio-group name="size">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
          </ds-radio-group>
          <ds-field-error>Please select a size</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe("ARIA attributes", () => {
    it("should have correct role on group", async () => {
      render(
        html`
          <ds-radio-group name="size" aria-label="Size">
            <ds-radio value="sm">Small</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const group = container.querySelector("ds-radio-group");
      expect(group?.getAttribute("role")).toBe("radiogroup");
    });

    it("should have correct role on radio items", async () => {
      render(
        html`
          <ds-radio-group name="size" aria-label="Size">
            <ds-radio value="sm">Small</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const radio = container.querySelector("[role='radio']");
      expect(radio).toBeTruthy();
    });

    it("should have aria-checked on selected radio", async () => {
      render(
        html`
          <ds-radio-group name="size" value="sm" aria-label="Size">
            <ds-radio value="sm">Small</ds-radio>
            <ds-radio value="md">Medium</ds-radio>
          </ds-radio-group>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const smRadio = container
        .querySelector("ds-radio[value='sm']")
        ?.querySelector("[role='radio']");
      const mdRadio = container
        .querySelector("ds-radio[value='md']")
        ?.querySelector("[role='radio']");

      expect(smRadio?.getAttribute("aria-checked")).toBe("true");
      expect(mdRadio?.getAttribute("aria-checked")).toBe("false");
    });
  });
});
