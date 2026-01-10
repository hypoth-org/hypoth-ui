import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/alert/alert.js";

expect.extend(toHaveNoViolations);

describe("Alert Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic alert", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-alert>
            <ds-alert-title>Information</ds-alert-title>
            <ds-alert-description>This is an informational message.</ds-alert-description>
          </ds-alert>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("alert variants", () => {
    it("should have no violations for default variant", async () => {
      render(
        html`
          <ds-alert variant="default">
            <ds-alert-title>Default Alert</ds-alert-title>
            <ds-alert-description>Default alert message.</ds-alert-description>
          </ds-alert>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for destructive variant", async () => {
      render(
        html`
          <ds-alert variant="destructive">
            <ds-alert-title>Error</ds-alert-title>
            <ds-alert-description>Something went wrong.</ds-alert-description>
          </ds-alert>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("alert ARIA attributes", () => {
    it("should have role='alert' for important messages", async () => {
      render(
        html`
          <ds-alert role="alert">
            <ds-alert-title>Warning</ds-alert-title>
            <ds-alert-description>Action required.</ds-alert-description>
          </ds-alert>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const alert = container.querySelector("[role='alert']");
      expect(alert).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have role='status' for informational messages", async () => {
      render(
        html`
          <ds-alert role="status">
            <ds-alert-title>Info</ds-alert-title>
            <ds-alert-description>Just letting you know.</ds-alert-description>
          </ds-alert>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("dismissible alert", () => {
    it("should have accessible dismiss button", async () => {
      render(
        html`
          <ds-alert dismissible>
            <ds-alert-title>Dismissible</ds-alert-title>
            <ds-alert-description>This alert can be dismissed.</ds-alert-description>
          </ds-alert>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
