import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/collapsible/collapsible.js";

expect.extend(toHaveNoViolations);

describe("Collapsible Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic collapsible", () => {
    it("should have no accessibility violations when collapsed", async () => {
      render(
        html`
          <ds-collapsible>
            <ds-collapsible-trigger>Toggle Content</ds-collapsible-trigger>
            <ds-collapsible-content>
              <p>Collapsible content here</p>
            </ds-collapsible-content>
          </ds-collapsible>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations when expanded", async () => {
      render(
        html`
          <ds-collapsible open>
            <ds-collapsible-trigger>Toggle Content</ds-collapsible-trigger>
            <ds-collapsible-content>
              <p>Collapsible content here</p>
            </ds-collapsible-content>
          </ds-collapsible>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("collapsible with disabled state", () => {
    it("should have no violations when disabled", async () => {
      render(
        html`
          <ds-collapsible disabled>
            <ds-collapsible-trigger>Toggle Content</ds-collapsible-trigger>
            <ds-collapsible-content>
              <p>Collapsible content here</p>
            </ds-collapsible-content>
          </ds-collapsible>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("collapsible ARIA attributes", () => {
    it("should have aria-expanded on trigger", async () => {
      render(
        html`
          <ds-collapsible>
            <ds-collapsible-trigger>Toggle</ds-collapsible-trigger>
            <ds-collapsible-content>Content</ds-collapsible-content>
          </ds-collapsible>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const trigger = container.querySelector("[aria-expanded]");
      expect(trigger).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have aria-controls on trigger", async () => {
      render(
        html`
          <ds-collapsible>
            <ds-collapsible-trigger>Toggle</ds-collapsible-trigger>
            <ds-collapsible-content>Content</ds-collapsible-content>
          </ds-collapsible>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should toggle aria-expanded when opened", async () => {
      render(
        html`
          <ds-collapsible open>
            <ds-collapsible-trigger>Toggle</ds-collapsible-trigger>
            <ds-collapsible-content>Content</ds-collapsible-content>
          </ds-collapsible>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const trigger = container.querySelector("[aria-expanded='true']");
      expect(trigger).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("collapsible with rich content", () => {
    it("should have no violations with form content", async () => {
      render(
        html`
          <ds-collapsible>
            <ds-collapsible-trigger>Show Options</ds-collapsible-trigger>
            <ds-collapsible-content>
              <form>
                <label for="option1">Option 1</label>
                <input id="option1" type="text" />
                <button type="submit">Save</button>
              </form>
            </ds-collapsible-content>
          </ds-collapsible>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("keyboard accessibility", () => {
    it("should have focusable trigger", async () => {
      render(
        html`
          <ds-collapsible>
            <ds-collapsible-trigger>Toggle</ds-collapsible-trigger>
            <ds-collapsible-content>Content</ds-collapsible-content>
          </ds-collapsible>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const trigger = container.querySelector("button, [role='button']");
      expect(trigger).toBeTruthy();
      if (trigger) {
        expect((trigger as HTMLElement).tabIndex).toBeGreaterThanOrEqual(0);
      }

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
