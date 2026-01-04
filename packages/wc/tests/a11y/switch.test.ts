import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { html, render } from "lit";
import { axe, toHaveNoViolations } from "jest-axe";
import "../../src/components/switch/switch.js";
import "../../src/components/field/field.js";

expect.extend(toHaveNoViolations);

describe("Switch Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic switch", () => {
    it("should have no accessibility violations with aria-label", async () => {
      render(
        html`<ds-switch aria-label="Enable notifications">Enable notifications</ds-switch>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations when checked", async () => {
      render(
        html`<ds-switch checked aria-label="Enable notifications">Enable notifications</ds-switch>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations when disabled", async () => {
      render(
        html`<ds-switch disabled aria-label="Enable notifications">Enable notifications</ds-switch>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("switch with Field", () => {
    it("should have no accessibility violations with Field label", async () => {
      render(
        html`
          <ds-field>
            <ds-label>Notifications</ds-label>
            <ds-switch name="notifications">Enable email notifications</ds-switch>
          </ds-field>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with description", async () => {
      render(
        html`
          <ds-field>
            <ds-label>Dark Mode</ds-label>
            <ds-switch name="darkMode">Enable dark mode</ds-switch>
            <ds-field-description>Switch between light and dark themes</ds-field-description>
          </ds-field>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with error message", async () => {
      render(
        html`
          <ds-field>
            <ds-label>Terms and Conditions</ds-label>
            <ds-switch name="terms" required aria-invalid="true">I accept the terms</ds-switch>
            <ds-field-error>You must accept the terms to continue</ds-field-error>
          </ds-field>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("switch ARIA attributes", () => {
    it("should have proper role='switch'", async () => {
      render(
        html`<ds-switch aria-label="Enable">Enable</ds-switch>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const control = container.querySelector("[role='switch']");
      expect(control).toBeTruthy();
    });

    it("should have proper aria-checked attribute", async () => {
      render(
        html`
          <ds-switch aria-label="Unchecked">Unchecked</ds-switch>
          <ds-switch checked aria-label="Checked">Checked</ds-switch>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const controls = container.querySelectorAll("[role='switch']");
      expect(controls[0]?.getAttribute("aria-checked")).toBe("false");
      expect(controls[1]?.getAttribute("aria-checked")).toBe("true");
    });

    it("should have proper aria-disabled attribute", async () => {
      render(
        html`<ds-switch disabled aria-label="Disabled switch">Disabled switch</ds-switch>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const control = container.querySelector("[role='switch']");
      expect(control?.getAttribute("aria-disabled")).toBe("true");
    });

    it("should have proper aria-required attribute", async () => {
      render(
        html`<ds-switch required aria-label="Required switch">Required switch</ds-switch>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const control = container.querySelector("[role='switch']");
      expect(control?.getAttribute("aria-required")).toBe("true");
    });
  });

  describe("keyboard accessibility", () => {
    it("should be focusable when enabled", async () => {
      render(
        html`<ds-switch aria-label="Enable">Enable</ds-switch>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const control = container.querySelector("[role='switch']") as HTMLElement;
      expect(control?.tabIndex).toBe(0);
    });

    it("should not be focusable when disabled", async () => {
      render(
        html`<ds-switch disabled aria-label="Disabled">Disabled</ds-switch>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const control = container.querySelector("[role='switch']") as HTMLElement;
      expect(control?.tabIndex).toBe(-1);
    });
  });
});
