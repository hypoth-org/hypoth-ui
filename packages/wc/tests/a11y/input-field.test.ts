import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { html, render } from "lit";
import { axe, toHaveNoViolations } from "jest-axe";
import "../../src/components/field/field.js";
import "../../src/components/input/input.js";

expect.extend(toHaveNoViolations);

describe("Input + Field accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should have no accessibility violations for input in field", async () => {
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
            Must be at least 8 characters with one uppercase letter
          </ds-field-description>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with error state", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Email</ds-label>
          <ds-input type="email" name="email"></ds-input>
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
          <ds-label>Full name</ds-label>
          <ds-input type="text" name="fullname"></ds-input>
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
          <ds-label>Locked field</ds-label>
          <ds-input type="text" name="locked"></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with all field components", async () => {
    render(
      html`
        <ds-field required>
          <ds-label>Username</ds-label>
          <ds-input type="text" name="username"></ds-input>
          <ds-field-description>Choose a unique username</ds-field-description>
          <ds-field-error>Username is already taken</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have correct label association via aria-labelledby", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Search term</ds-label>
          <ds-input type="search" name="search"></ds-input>
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

  it("should have correct description association via aria-describedby", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Phone number</ds-label>
          <ds-input type="tel" name="phone"></ds-input>
          <ds-field-description>Include country code</ds-field-description>
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

  it("should set aria-invalid when error is present", async () => {
    render(
      html`
        <ds-field>
          <ds-label>URL</ds-label>
          <ds-input type="url" name="website"></ds-input>
          <ds-field-error>Invalid URL format</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const input = container.querySelector("ds-input");
    expect(input?.getAttribute("aria-invalid")).toBe("true");
  });

  it("should set aria-required when field is required", async () => {
    render(
      html`
        <ds-field required>
          <ds-label>Company name</ds-label>
          <ds-input type="text" name="company"></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const input = container.querySelector("ds-input");
    expect(input?.getAttribute("aria-required")).toBe("true");
  });

  it("should handle multiple independent fields correctly", async () => {
    render(
      html`
        <ds-field required>
          <ds-label>First name</ds-label>
          <ds-input type="text" name="firstName"></ds-input>
        </ds-field>
        <ds-field required>
          <ds-label>Last name</ds-label>
          <ds-input type="text" name="lastName"></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const labels = container.querySelectorAll("ds-label");
    const inputs = container.querySelectorAll("ds-input");

    // Each field should have unique IDs
    expect(labels[0]?.id).not.toBe(labels[1]?.id);

    // Each input should reference its own label
    expect(inputs[0]?.getAttribute("aria-labelledby")).toBe(labels[0]?.id);
    expect(inputs[1]?.getAttribute("aria-labelledby")).toBe(labels[1]?.id);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
