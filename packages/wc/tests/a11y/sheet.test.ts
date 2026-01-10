import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/sheet/sheet.js";

expect.extend(toHaveNoViolations);

describe("Sheet Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    document.querySelectorAll("ds-sheet").forEach((el) => el.remove());
  });

  describe("basic sheet", () => {
    it("should have no accessibility violations for closed sheet", async () => {
      render(
        html`
          <ds-sheet>
            <ds-sheet-trigger>Open Sheet</ds-sheet-trigger>
            <ds-sheet-content>
              <ds-sheet-header>
                <ds-sheet-title>Sheet Title</ds-sheet-title>
                <ds-sheet-description>Sheet description text.</ds-sheet-description>
              </ds-sheet-header>
              <div>Sheet content</div>
            </ds-sheet-content>
          </ds-sheet>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations when open", async () => {
      render(
        html`
          <ds-sheet open>
            <ds-sheet-trigger>Open Sheet</ds-sheet-trigger>
            <ds-sheet-content>
              <ds-sheet-header>
                <ds-sheet-title>Sheet Title</ds-sheet-title>
              </ds-sheet-header>
              <div>Sheet content</div>
            </ds-sheet-content>
          </ds-sheet>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("sheet sides", () => {
    it("should have no violations for right sheet", async () => {
      render(
        html`
          <ds-sheet open side="right">
            <ds-sheet-content>
              <ds-sheet-title>Right Sheet</ds-sheet-title>
              <div>Content</div>
            </ds-sheet-content>
          </ds-sheet>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for left sheet", async () => {
      render(
        html`
          <ds-sheet open side="left">
            <ds-sheet-content>
              <ds-sheet-title>Left Sheet</ds-sheet-title>
              <div>Content</div>
            </ds-sheet-content>
          </ds-sheet>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for top sheet", async () => {
      render(
        html`
          <ds-sheet open side="top">
            <ds-sheet-content>
              <ds-sheet-title>Top Sheet</ds-sheet-title>
              <div>Content</div>
            </ds-sheet-content>
          </ds-sheet>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for bottom sheet", async () => {
      render(
        html`
          <ds-sheet open side="bottom">
            <ds-sheet-content>
              <ds-sheet-title>Bottom Sheet</ds-sheet-title>
              <div>Content</div>
            </ds-sheet-content>
          </ds-sheet>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("sheet ARIA attributes", () => {
    it("should have role='dialog'", async () => {
      render(
        html`
          <ds-sheet open>
            <ds-sheet-content>
              <ds-sheet-title>Sheet Title</ds-sheet-title>
              <div>Content</div>
            </ds-sheet-content>
          </ds-sheet>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const dialog = container.querySelector("[role='dialog']");
      expect(dialog).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("sheet with footer", () => {
    it("should have no violations with footer actions", async () => {
      render(
        html`
          <ds-sheet open>
            <ds-sheet-content>
              <ds-sheet-header>
                <ds-sheet-title>Edit Profile</ds-sheet-title>
              </ds-sheet-header>
              <div>Form content</div>
              <ds-sheet-footer>
                <button>Cancel</button>
                <button>Save</button>
              </ds-sheet-footer>
            </ds-sheet-content>
          </ds-sheet>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
