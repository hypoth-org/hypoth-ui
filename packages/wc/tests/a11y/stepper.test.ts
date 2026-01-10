import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/stepper/stepper.js";

expect.extend(toHaveNoViolations);

describe("Stepper Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic stepper", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-stepper>
            <ds-stepper-item value="1" completed>
              <ds-stepper-trigger>Step 1</ds-stepper-trigger>
              <ds-stepper-content>Step 1 content</ds-stepper-content>
            </ds-stepper-item>
            <ds-stepper-item value="2" active>
              <ds-stepper-trigger>Step 2</ds-stepper-trigger>
              <ds-stepper-content>Step 2 content</ds-stepper-content>
            </ds-stepper-item>
            <ds-stepper-item value="3">
              <ds-stepper-trigger>Step 3</ds-stepper-trigger>
              <ds-stepper-content>Step 3 content</ds-stepper-content>
            </ds-stepper-item>
          </ds-stepper>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("stepper with descriptions", () => {
    it("should have no violations with step descriptions", async () => {
      render(
        html`
          <ds-stepper>
            <ds-stepper-item value="1" completed>
              <ds-stepper-trigger>
                <ds-stepper-title>Account</ds-stepper-title>
                <ds-stepper-description>Create your account</ds-stepper-description>
              </ds-stepper-trigger>
            </ds-stepper-item>
            <ds-stepper-item value="2" active>
              <ds-stepper-trigger>
                <ds-stepper-title>Profile</ds-stepper-title>
                <ds-stepper-description>Set up your profile</ds-stepper-description>
              </ds-stepper-trigger>
            </ds-stepper-item>
          </ds-stepper>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("stepper orientation", () => {
    it("should have no violations for horizontal stepper", async () => {
      render(
        html`
          <ds-stepper orientation="horizontal">
            <ds-stepper-item value="1">
              <ds-stepper-trigger>Step 1</ds-stepper-trigger>
            </ds-stepper-item>
            <ds-stepper-item value="2">
              <ds-stepper-trigger>Step 2</ds-stepper-trigger>
            </ds-stepper-item>
          </ds-stepper>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for vertical stepper", async () => {
      render(
        html`
          <ds-stepper orientation="vertical">
            <ds-stepper-item value="1">
              <ds-stepper-trigger>Step 1</ds-stepper-trigger>
              <ds-stepper-content>Content 1</ds-stepper-content>
            </ds-stepper-item>
            <ds-stepper-item value="2">
              <ds-stepper-trigger>Step 2</ds-stepper-trigger>
              <ds-stepper-content>Content 2</ds-stepper-content>
            </ds-stepper-item>
          </ds-stepper>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("stepper ARIA attributes", () => {
    it("should have proper list structure", async () => {
      render(
        html`
          <ds-stepper aria-label="Registration progress">
            <ds-stepper-item value="1">
              <ds-stepper-trigger>Step 1</ds-stepper-trigger>
            </ds-stepper-item>
          </ds-stepper>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should indicate current step", async () => {
      render(
        html`
          <ds-stepper>
            <ds-stepper-item value="1" completed>
              <ds-stepper-trigger>Step 1</ds-stepper-trigger>
            </ds-stepper-item>
            <ds-stepper-item value="2" active aria-current="step">
              <ds-stepper-trigger>Step 2</ds-stepper-trigger>
            </ds-stepper-item>
          </ds-stepper>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("stepper with errors", () => {
    it("should have no violations with error state", async () => {
      render(
        html`
          <ds-stepper>
            <ds-stepper-item value="1" completed>
              <ds-stepper-trigger>Step 1</ds-stepper-trigger>
            </ds-stepper-item>
            <ds-stepper-item value="2" error aria-invalid="true">
              <ds-stepper-trigger>Step 2 (Error)</ds-stepper-trigger>
            </ds-stepper-item>
          </ds-stepper>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
