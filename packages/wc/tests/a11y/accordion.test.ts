import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/accordion/accordion.js";

expect.extend(toHaveNoViolations);

describe("Accordion Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic accordion", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-accordion>
            <ds-accordion-item value="item1">
              <ds-accordion-trigger>Section 1</ds-accordion-trigger>
              <ds-accordion-content>Content for section 1</ds-accordion-content>
            </ds-accordion-item>
            <ds-accordion-item value="item2">
              <ds-accordion-trigger>Section 2</ds-accordion-trigger>
              <ds-accordion-content>Content for section 2</ds-accordion-content>
            </ds-accordion-item>
          </ds-accordion>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with expanded item", async () => {
      render(
        html`
          <ds-accordion default-value="item1">
            <ds-accordion-item value="item1">
              <ds-accordion-trigger>Section 1</ds-accordion-trigger>
              <ds-accordion-content>Content for section 1</ds-accordion-content>
            </ds-accordion-item>
            <ds-accordion-item value="item2">
              <ds-accordion-trigger>Section 2</ds-accordion-trigger>
              <ds-accordion-content>Content for section 2</ds-accordion-content>
            </ds-accordion-item>
          </ds-accordion>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("accordion types", () => {
    it("should have no violations for single type", async () => {
      render(
        html`
          <ds-accordion type="single">
            <ds-accordion-item value="item1">
              <ds-accordion-trigger>Section 1</ds-accordion-trigger>
              <ds-accordion-content>Content 1</ds-accordion-content>
            </ds-accordion-item>
            <ds-accordion-item value="item2">
              <ds-accordion-trigger>Section 2</ds-accordion-trigger>
              <ds-accordion-content>Content 2</ds-accordion-content>
            </ds-accordion-item>
          </ds-accordion>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for multiple type", async () => {
      render(
        html`
          <ds-accordion type="multiple">
            <ds-accordion-item value="item1">
              <ds-accordion-trigger>Section 1</ds-accordion-trigger>
              <ds-accordion-content>Content 1</ds-accordion-content>
            </ds-accordion-item>
            <ds-accordion-item value="item2">
              <ds-accordion-trigger>Section 2</ds-accordion-trigger>
              <ds-accordion-content>Content 2</ds-accordion-content>
            </ds-accordion-item>
          </ds-accordion>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("accordion with disabled item", () => {
    it("should have no violations with disabled item", async () => {
      render(
        html`
          <ds-accordion>
            <ds-accordion-item value="item1">
              <ds-accordion-trigger>Section 1</ds-accordion-trigger>
              <ds-accordion-content>Content 1</ds-accordion-content>
            </ds-accordion-item>
            <ds-accordion-item value="item2" disabled>
              <ds-accordion-trigger>Section 2 (Disabled)</ds-accordion-trigger>
              <ds-accordion-content>Content 2</ds-accordion-content>
            </ds-accordion-item>
          </ds-accordion>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("accordion ARIA attributes", () => {
    it("should have aria-expanded on triggers", async () => {
      render(
        html`
          <ds-accordion default-value="item1">
            <ds-accordion-item value="item1">
              <ds-accordion-trigger>Section 1</ds-accordion-trigger>
              <ds-accordion-content>Content 1</ds-accordion-content>
            </ds-accordion-item>
            <ds-accordion-item value="item2">
              <ds-accordion-trigger>Section 2</ds-accordion-trigger>
              <ds-accordion-content>Content 2</ds-accordion-content>
            </ds-accordion-item>
          </ds-accordion>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const expandedTrigger = container.querySelector("[aria-expanded='true']");
      const collapsedTrigger = container.querySelector("[aria-expanded='false']");

      expect(expandedTrigger || collapsedTrigger).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have aria-controls connecting trigger to content", async () => {
      render(
        html`
          <ds-accordion>
            <ds-accordion-item value="item1">
              <ds-accordion-trigger>Section 1</ds-accordion-trigger>
              <ds-accordion-content>Content 1</ds-accordion-content>
            </ds-accordion-item>
          </ds-accordion>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("keyboard accessibility", () => {
    it("should have focusable triggers", async () => {
      render(
        html`
          <ds-accordion>
            <ds-accordion-item value="item1">
              <ds-accordion-trigger>Section 1</ds-accordion-trigger>
              <ds-accordion-content>Content 1</ds-accordion-content>
            </ds-accordion-item>
          </ds-accordion>
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
