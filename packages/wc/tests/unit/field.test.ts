import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { html, render } from "lit";
import "../../src/components/field/field.js";
import "../../src/components/input/input.js";

describe("DsField", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should render field with slot content", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Test Label</ds-label>
          <ds-input></ds-input>
        </ds-field>
      `,
      container
    );

    const field = container.querySelector("ds-field");
    expect(field).toBeTruthy();

    const label = container.querySelector("ds-label");
    expect(label).toBeTruthy();
    expect(label?.textContent).toContain("Test Label");
  });

  it("should generate unique IDs for ARIA associations", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Email</ds-label>
          <ds-input type="email"></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const label = container.querySelector("ds-label");
    const input = container.querySelector("ds-input");

    expect(label?.id).toMatch(/^field-[a-z0-9]+-label$/);
    expect(input?.getAttribute("aria-labelledby")).toBe(label?.id);
  });

  it("should set aria-describedby for description", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Password</ds-label>
          <ds-input type="password"></ds-input>
          <ds-field-description>Must be 8+ characters</ds-field-description>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const description = container.querySelector("ds-field-description");
    const input = container.querySelector("ds-input");

    expect(description?.id).toMatch(/^field-[a-z0-9]+-desc$/);
    expect(input?.getAttribute("aria-describedby")).toContain(description?.id);
  });

  it("should set aria-describedby for error with error first", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Email</ds-label>
          <ds-input type="email"></ds-input>
          <ds-field-description>Help text</ds-field-description>
          <ds-field-error>Invalid email</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const error = container.querySelector("ds-field-error");
    const description = container.querySelector("ds-field-description");
    const input = container.querySelector("ds-input");

    const describedBy = input?.getAttribute("aria-describedby");
    expect(describedBy).toContain(error?.id);
    expect(describedBy).toContain(description?.id);
    // Error should come first
    expect(describedBy?.indexOf(error?.id ?? "")).toBeLessThan(
      describedBy?.indexOf(description?.id ?? "") ?? -1
    );
  });

  it("should set aria-invalid when error is present", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Email</ds-label>
          <ds-input type="email"></ds-input>
          <ds-field-error>Invalid email</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const input = container.querySelector("ds-input");
    expect(input?.getAttribute("aria-invalid")).toBe("true");
  });

  it("should set aria-required when field has required attribute", async () => {
    render(
      html`
        <ds-field required>
          <ds-label>Email</ds-label>
          <ds-input type="email"></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const input = container.querySelector("ds-input");
    expect(input?.getAttribute("aria-required")).toBe("true");
  });

  it("should add data-required to label when field is required", async () => {
    render(
      html`
        <ds-field required>
          <ds-label>Required Field</ds-label>
          <ds-input></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const label = container.querySelector("ds-label");
    expect(label?.hasAttribute("data-required")).toBe(true);
  });

  it("should set data-error on field when error is present", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Email</ds-label>
          <ds-input></ds-input>
          <ds-field-error>Error message</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const field = container.querySelector("ds-field");
    expect(field?.hasAttribute("data-error")).toBe(true);
  });

  it("should propagate disabled state to form control", async () => {
    render(
      html`
        <ds-field disabled>
          <ds-label>Disabled Field</ds-label>
          <ds-input></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const input = container.querySelector("ds-input");
    expect(input?.getAttribute("aria-disabled")).toBe("true");
  });

  it("should not include empty error in aria-describedby", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Email</ds-label>
          <ds-input></ds-input>
          <ds-field-description>Help text</ds-field-description>
          <ds-field-error></ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const input = container.querySelector("ds-input");
    const error = container.querySelector("ds-field-error");
    const describedBy = input?.getAttribute("aria-describedby");

    // Should not include empty error ID
    expect(describedBy).not.toContain(error?.id);
  });

  it("should update ARIA attributes when children change", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Email</ds-label>
          <ds-input></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    // Initially no error
    const input = container.querySelector("ds-input");
    expect(input?.getAttribute("aria-invalid")).toBe("false");

    // Add error dynamically
    const field = container.querySelector("ds-field");
    const error = document.createElement("ds-field-error");
    error.textContent = "New error";
    field?.appendChild(error);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(input?.getAttribute("aria-invalid")).toBe("true");
    expect(input?.getAttribute("aria-describedby")).toContain(error.id);
  });
});

describe("DsLabel", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should render label with slot content", () => {
    render(html`<ds-label>Test Label</ds-label>`, container);

    const label = container.querySelector("ds-label");
    expect(label?.textContent).toContain("Test Label");
  });

  it("should render label element with for attribute", async () => {
    render(html`<ds-label for="test-input">Label</ds-label>`, container);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const labelElement = container.querySelector("ds-label label");
    expect(labelElement?.getAttribute("for")).toBe("test-input");
  });
});

describe("DsFieldDescription", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should render description with slot content", () => {
    render(
      html`<ds-field-description>Help text here</ds-field-description>`,
      container
    );

    const description = container.querySelector("ds-field-description");
    expect(description?.textContent).toContain("Help text here");
  });
});

describe("DsFieldError", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should render error with slot content", () => {
    render(
      html`<ds-field-error>Error message</ds-field-error>`,
      container
    );

    const error = container.querySelector("ds-field-error");
    expect(error?.textContent).toContain("Error message");
  });

  it("should have role=alert for screen reader announcement", async () => {
    render(
      html`<ds-field-error>Error message</ds-field-error>`,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const errorDiv = container.querySelector("ds-field-error div");
    expect(errorDiv?.getAttribute("role")).toBe("alert");
  });

  it("should have aria-live=polite for dynamic updates", async () => {
    render(
      html`<ds-field-error>Error message</ds-field-error>`,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const errorDiv = container.querySelector("ds-field-error div");
    expect(errorDiv?.getAttribute("aria-live")).toBe("polite");
  });
});
