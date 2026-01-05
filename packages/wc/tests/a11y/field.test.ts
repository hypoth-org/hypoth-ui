import { axe, toHaveNoViolations } from "jest-axe";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/field/field.js";
import "../../src/components/input/input.js";

expect.extend(toHaveNoViolations);

describe("Field accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should have no accessibility violations for basic field", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Email address</ds-label>
          <ds-input type="email" name="email"></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with description", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Password</ds-label>
          <ds-input type="password" name="password"></ds-input>
          <ds-field-description>
            Must be at least 8 characters
          </ds-field-description>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with error", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Email</ds-label>
          <ds-input type="email" name="email" error></ds-input>
          <ds-field-error>Please enter a valid email address</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with required field", async () => {
    render(
      html`
        <ds-field required>
          <ds-label>Name</ds-label>
          <ds-input type="text" name="name"></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with disabled field", async () => {
    render(
      html`
        <ds-field disabled>
          <ds-label>Read only</ds-label>
          <ds-input type="text" name="readonly"></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should properly associate label with input via aria-labelledby", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Full Name</ds-label>
          <ds-input type="text" name="fullname"></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const label = container.querySelector("ds-label");
    const input = container.querySelector("ds-input");

    expect(label?.id).toBeTruthy();
    expect(input?.getAttribute("aria-labelledby")).toBe(label?.id);
  });

  it("should properly associate description with input via aria-describedby", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Username</ds-label>
          <ds-input type="text" name="username"></ds-input>
          <ds-field-description>
            Choose a unique username
          </ds-field-description>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const description = container.querySelector("ds-field-description");
    const input = container.querySelector("ds-input");

    expect(description?.id).toBeTruthy();
    expect(input?.getAttribute("aria-describedby")).toContain(description?.id);
  });

  it("should properly associate error with input via aria-describedby", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Email</ds-label>
          <ds-input type="email" name="email"></ds-input>
          <ds-field-error>Invalid email format</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const error = container.querySelector("ds-field-error");
    const input = container.querySelector("ds-input");

    expect(error?.id).toBeTruthy();
    expect(input?.getAttribute("aria-describedby")).toContain(error?.id);
    expect(input?.getAttribute("aria-invalid")).toBe("true");
  });

  it("should announce error via role=alert", async () => {
    render(
      html`
        <ds-field-error>Error message</ds-field-error>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const errorDiv = container.querySelector("ds-field-error div");
    expect(errorDiv?.getAttribute("role")).toBe("alert");
    expect(errorDiv?.getAttribute("aria-live")).toBe("polite");
  });

  it("should handle multiple fields independently", async () => {
    render(
      html`
        <ds-field>
          <ds-label>First Name</ds-label>
          <ds-input type="text" name="firstName"></ds-input>
        </ds-field>
        <ds-field>
          <ds-label>Last Name</ds-label>
          <ds-input type="text" name="lastName"></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const labels = container.querySelectorAll("ds-label");
    const inputs = container.querySelectorAll("ds-input");

    // Each should have unique IDs
    expect(labels[0]?.id).not.toBe(labels[1]?.id);

    // Each input should reference its own label
    expect(inputs[0]?.getAttribute("aria-labelledby")).toBe(labels[0]?.id);
    expect(inputs[1]?.getAttribute("aria-labelledby")).toBe(labels[1]?.id);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
