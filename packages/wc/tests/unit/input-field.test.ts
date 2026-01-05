import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/field/field.js";
import "../../src/components/input/input.js";

describe("Input + Field Integration", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should set aria-labelledby on input when inside field", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Email address</ds-label>
          <ds-input type="email"></ds-input>
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

  it("should set aria-describedby on input when field has description", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Password</ds-label>
          <ds-input type="password"></ds-input>
          <ds-field-description>
            Must include at least 8 characters
          </ds-field-description>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const description = container.querySelector("ds-field-description");
    const input = container.querySelector("ds-input");

    expect(description?.id).toBeTruthy();
    expect(input?.getAttribute("aria-describedby")).toBe(description?.id);
  });

  it("should set aria-invalid on input when field has error", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Email</ds-label>
          <ds-input type="email"></ds-input>
          <ds-field-error>Please enter a valid email</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const input = container.querySelector("ds-input");
    expect(input?.getAttribute("aria-invalid")).toBe("true");
  });

  it("should set error property on input when field has error", async () => {
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

    await new Promise((resolve) => setTimeout(resolve, 50));

    const input = container.querySelector("ds-input") as HTMLElement & { error: boolean };
    expect(input?.error).toBe(true);
  });

  it("should set required property on input when field is required", async () => {
    render(
      html`
        <ds-field required>
          <ds-label>Name</ds-label>
          <ds-input type="text"></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const input = container.querySelector("ds-input") as HTMLElement & { required: boolean };
    expect(input?.required).toBe(true);
    expect(input?.getAttribute("aria-required")).toBe("true");
  });

  it("should combine error and description in aria-describedby with error first", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Username</ds-label>
          <ds-input type="text"></ds-input>
          <ds-field-description>Choose a unique username</ds-field-description>
          <ds-field-error>Username already taken</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const error = container.querySelector("ds-field-error");
    const description = container.querySelector("ds-field-description");
    const input = container.querySelector("ds-input");

    const describedBy = input?.getAttribute("aria-describedby") ?? "";

    // Both should be present
    expect(describedBy).toContain(error?.id);
    expect(describedBy).toContain(description?.id);

    // Error should come first
    const errorIndex = describedBy.indexOf(error?.id ?? "");
    const descIndex = describedBy.indexOf(description?.id ?? "");
    expect(errorIndex).toBeLessThan(descIndex);
  });

  it("should work with native input element", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Name</ds-label>
          <input type="text" />
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const label = container.querySelector("ds-label");
    const input = container.querySelector("input");

    expect(input?.getAttribute("aria-labelledby")).toBe(label?.id);
  });

  it("should update input styling when error state changes", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Email</ds-label>
          <ds-input type="email"></ds-input>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const field = container.querySelector("ds-field");
    const input = container.querySelector("ds-input") as HTMLElement & { error: boolean };

    // Initially no error
    expect(input?.error).toBeFalsy();
    expect(input?.getAttribute("aria-invalid")).toBe("false");

    // Add error
    const error = document.createElement("ds-field-error");
    error.textContent = "Invalid email";
    field?.appendChild(error);

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Should now have error state
    expect(input?.error).toBe(true);
    expect(input?.getAttribute("aria-invalid")).toBe("true");
  });

  it("should remove error state when error element is removed", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Email</ds-label>
          <ds-input type="email"></ds-input>
          <ds-field-error>Invalid</ds-field-error>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const input = container.querySelector("ds-input") as HTMLElement & { error: boolean };
    expect(input?.error).toBe(true);

    // Remove error
    const error = container.querySelector("ds-field-error");
    error?.remove();

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(input?.error).toBe(false);
    expect(input?.getAttribute("aria-invalid")).toBe("false");
  });
});
