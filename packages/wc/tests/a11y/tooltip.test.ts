import { axe, toHaveNoViolations } from "jest-axe";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/tooltip/tooltip.js";

expect.extend(toHaveNoViolations);

describe("Tooltip Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("closed state", () => {
    it("should have no accessibility violations when closed", async () => {
      render(
        html`
          <ds-tooltip>
            <button slot="trigger">Hover for info</button>
            <ds-tooltip-content>Additional information</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("open state", () => {
    it("should have no accessibility violations when open", async () => {
      render(
        html`
          <ds-tooltip open>
            <button slot="trigger">Hover for info</button>
            <ds-tooltip-content>Additional information</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("ARIA attributes", () => {
    it("should have aria-describedby on trigger", async () => {
      render(
        html`
          <ds-tooltip>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip content</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector('[slot="trigger"]');
      expect(trigger?.getAttribute("aria-describedby")).toBeTruthy();
    });

    it("should connect aria-describedby to tooltip content id", async () => {
      render(
        html`
          <ds-tooltip>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip content</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector('[slot="trigger"]');
      const content = container.querySelector("ds-tooltip-content");

      expect(content?.id).toBeTruthy();
      expect(trigger?.getAttribute("aria-describedby")).toBe(content?.id);
    });

    it("should have role=tooltip on content", async () => {
      render(
        html`
          <ds-tooltip open>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip content</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const content = container.querySelector("ds-tooltip-content");
      expect(content?.getAttribute("role")).toBe("tooltip");
    });
  });

  describe("keyboard accessibility", () => {
    it("should be dismissable with Escape key", async () => {
      render(
        html`
          <ds-tooltip open>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip content</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const tooltip = container.querySelector("ds-tooltip") as HTMLElement & { open: boolean };
      expect(tooltip.open).toBe(false);
    });
  });
});
