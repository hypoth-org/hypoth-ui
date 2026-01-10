import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/separator/separator.js";

expect.extend(toHaveNoViolations);

describe("Separator Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic separator", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <p>Content above</p>
          <ds-separator></ds-separator>
          <p>Content below</p>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("separator orientation", () => {
    it("should have no violations for horizontal separator", async () => {
      render(
        html`
          <p>Top content</p>
          <ds-separator orientation="horizontal"></ds-separator>
          <p>Bottom content</p>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for vertical separator", async () => {
      render(
        html`
          <div style="display: flex; align-items: center;">
            <span>Left content</span>
            <ds-separator orientation="vertical" style="height: 20px;"></ds-separator>
            <span>Right content</span>
          </div>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("separator ARIA attributes", () => {
    it("should have role='separator'", async () => {
      render(html`<ds-separator></ds-separator>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const separator = container.querySelector("[role='separator'], hr");
      expect(separator).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have aria-orientation for vertical", async () => {
      render(html`<ds-separator orientation="vertical"></ds-separator>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const separator = container.querySelector("[role='separator']");
      if (separator) {
        expect(separator.getAttribute("aria-orientation")).toBe("vertical");
      }

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("decorative separator", () => {
    it("should have no violations when purely decorative", async () => {
      render(
        html`<ds-separator decorative aria-hidden="true"></ds-separator>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("separator in menu", () => {
    it("should have no violations when used in menu", async () => {
      render(
        html`
          <div role="menu" aria-label="File menu">
            <button role="menuitem">New</button>
            <button role="menuitem">Open</button>
            <ds-separator></ds-separator>
            <button role="menuitem">Save</button>
            <button role="menuitem">Exit</button>
          </div>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
