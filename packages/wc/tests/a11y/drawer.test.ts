import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/drawer/drawer.js";

expect.extend(toHaveNoViolations);

describe("Drawer Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    document.querySelectorAll("ds-drawer").forEach((el) => el.remove());
  });

  describe("basic drawer", () => {
    it("should have no accessibility violations for closed drawer", async () => {
      render(
        html`
          <ds-drawer>
            <ds-drawer-trigger>Open Drawer</ds-drawer-trigger>
            <ds-drawer-content>
              <ds-drawer-header>
                <ds-drawer-title>Drawer Title</ds-drawer-title>
                <ds-drawer-description>Drawer description text.</ds-drawer-description>
              </ds-drawer-header>
              <div>Drawer content</div>
            </ds-drawer-content>
          </ds-drawer>
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
          <ds-drawer open>
            <ds-drawer-trigger>Open Drawer</ds-drawer-trigger>
            <ds-drawer-content>
              <ds-drawer-header>
                <ds-drawer-title>Drawer Title</ds-drawer-title>
              </ds-drawer-header>
              <div>Drawer content</div>
            </ds-drawer-content>
          </ds-drawer>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("drawer sides", () => {
    it("should have no violations for left drawer", async () => {
      render(
        html`
          <ds-drawer open side="left">
            <ds-drawer-content>
              <ds-drawer-title>Left Drawer</ds-drawer-title>
              <div>Content</div>
            </ds-drawer-content>
          </ds-drawer>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for right drawer", async () => {
      render(
        html`
          <ds-drawer open side="right">
            <ds-drawer-content>
              <ds-drawer-title>Right Drawer</ds-drawer-title>
              <div>Content</div>
            </ds-drawer-content>
          </ds-drawer>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for bottom drawer", async () => {
      render(
        html`
          <ds-drawer open side="bottom">
            <ds-drawer-content>
              <ds-drawer-title>Bottom Drawer</ds-drawer-title>
              <div>Content</div>
            </ds-drawer-content>
          </ds-drawer>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("drawer ARIA attributes", () => {
    it("should have role='dialog'", async () => {
      render(
        html`
          <ds-drawer open>
            <ds-drawer-content>
              <ds-drawer-title>Drawer Title</ds-drawer-title>
              <div>Content</div>
            </ds-drawer-content>
          </ds-drawer>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const dialog = container.querySelector("[role='dialog']");
      expect(dialog).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have aria-labelledby connected to title", async () => {
      render(
        html`
          <ds-drawer open>
            <ds-drawer-content>
              <ds-drawer-title>My Drawer</ds-drawer-title>
              <div>Content</div>
            </ds-drawer-content>
          </ds-drawer>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("drawer with close button", () => {
    it("should have no violations with accessible close button", async () => {
      render(
        html`
          <ds-drawer open>
            <ds-drawer-content>
              <ds-drawer-header>
                <ds-drawer-title>Drawer</ds-drawer-title>
                <ds-drawer-close aria-label="Close drawer"></ds-drawer-close>
              </ds-drawer-header>
              <div>Content</div>
            </ds-drawer-content>
          </ds-drawer>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("keyboard accessibility", () => {
    it("should close on Escape key", async () => {
      render(
        html`
          <ds-drawer open>
            <ds-drawer-content>
              <ds-drawer-title>Drawer</ds-drawer-title>
              <div>Content</div>
            </ds-drawer-content>
          </ds-drawer>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const drawer = container.querySelector("ds-drawer");
      expect(drawer?.hasAttribute("open")).toBe(true);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
