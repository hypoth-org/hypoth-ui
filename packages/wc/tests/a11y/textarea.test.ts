import { axe, toHaveNoViolations } from "jest-axe";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/textarea/textarea.js";
import "../../src/components/field/field.js";

expect.extend(toHaveNoViolations);

describe("Textarea accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should have no accessibility violations for standalone textarea with aria-label", async () => {
    render(html`<ds-textarea id="my-textarea"></ds-textarea>`, container);

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Manually set aria-label on native textarea (since label/for doesn't work with Light DOM)
    const nativeTextarea = container.querySelector("textarea");
    nativeTextarea?.setAttribute("aria-label", "Description");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with Field pattern", async () => {
    render(
      html`
        <ds-field>
          <ds-label>Comments</ds-label>
          <ds-textarea></ds-textarea>
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
          <ds-label>Bio</ds-label>
          <ds-field-description>Tell us about yourself</ds-field-description>
          <ds-textarea></ds-textarea>
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
          <ds-label>Message</ds-label>
          <ds-textarea error></ds-textarea>
          <ds-field-error>This field is required</ds-field-error>
        </ds-field>
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
        <ds-field disabled>
          <ds-label>Notes</ds-label>
          <ds-textarea></ds-textarea>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations when required", async () => {
    render(
      html`
        <ds-field required>
          <ds-label>Feedback</ds-label>
          <ds-textarea></ds-textarea>
        </ds-field>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe("ARIA attributes", () => {
    it("should have aria-invalid when error is true", async () => {
      render(html`<ds-textarea error></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const nativeTextarea = container.querySelector("textarea");
      expect(nativeTextarea?.getAttribute("aria-invalid")).toBe("true");
    });

    it("should have aria-required when required", async () => {
      render(html`<ds-textarea required></ds-textarea>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const nativeTextarea = container.querySelector("textarea");
      expect(nativeTextarea?.getAttribute("aria-required")).toBe("true");
    });

    it("should forward aria-labelledby to native textarea", async () => {
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

      const label = container.querySelector("ds-label");
      const nativeTextarea = container.querySelector("textarea");

      expect(label?.id).toBeTruthy();
      expect(nativeTextarea?.getAttribute("aria-labelledby")).toBe(label?.id);
    });

    it("should forward aria-describedby to native textarea", async () => {
      render(
        html`
          <ds-field>
            <ds-label>Description</ds-label>
            <ds-field-description>Enter a detailed description</ds-field-description>
            <ds-textarea></ds-textarea>
          </ds-field>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const description = container.querySelector("ds-field-description");
      const nativeTextarea = container.querySelector("textarea");

      expect(description?.id).toBeTruthy();
      expect(nativeTextarea?.getAttribute("aria-describedby")).toContain(description?.id);
    });
  });
});
