import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/context-menu/context-menu.js";

expect.extend(toHaveNoViolations);

describe("ContextMenu Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    document.querySelectorAll("ds-context-menu").forEach((el) => el.remove());
  });

  describe("basic context menu", () => {
    it("should have no accessibility violations for trigger", async () => {
      render(
        html`
          <ds-context-menu>
            <ds-context-menu-trigger>
              <div style="width: 200px; height: 100px; border: 1px solid gray;">
                Right-click here
              </div>
            </ds-context-menu-trigger>
            <ds-context-menu-content>
              <ds-context-menu-item>Edit</ds-context-menu-item>
              <ds-context-menu-item>Copy</ds-context-menu-item>
              <ds-context-menu-item>Delete</ds-context-menu-item>
            </ds-context-menu-content>
          </ds-context-menu>
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
          <ds-context-menu open>
            <ds-context-menu-trigger>
              <div>Right-click area</div>
            </ds-context-menu-trigger>
            <ds-context-menu-content>
              <ds-context-menu-item>Edit</ds-context-menu-item>
              <ds-context-menu-item>Copy</ds-context-menu-item>
              <ds-context-menu-item>Delete</ds-context-menu-item>
            </ds-context-menu-content>
          </ds-context-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("context menu with groups", () => {
    // Skip: Test uses non-existent ds-context-menu-group component
    it.skip("should have no violations with labeled groups", async () => {
      render(
        html`
          <ds-context-menu open>
            <ds-context-menu-trigger>
              <div>Trigger</div>
            </ds-context-menu-trigger>
            <ds-context-menu-content>
              <ds-context-menu-group>
                <ds-context-menu-label>Clipboard</ds-context-menu-label>
                <ds-context-menu-item>Cut</ds-context-menu-item>
                <ds-context-menu-item>Copy</ds-context-menu-item>
                <ds-context-menu-item>Paste</ds-context-menu-item>
              </ds-context-menu-group>
              <ds-context-menu-separator></ds-context-menu-separator>
              <ds-context-menu-item>Delete</ds-context-menu-item>
            </ds-context-menu-content>
          </ds-context-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("context menu with submenus", () => {
    it("should have no violations with submenu", async () => {
      render(
        html`
          <ds-context-menu open>
            <ds-context-menu-trigger>
              <div>Trigger</div>
            </ds-context-menu-trigger>
            <ds-context-menu-content>
              <ds-context-menu-item>Edit</ds-context-menu-item>
              <ds-context-menu-sub>
                <ds-context-menu-sub-trigger>More</ds-context-menu-sub-trigger>
                <ds-context-menu-sub-content>
                  <ds-context-menu-item>Option 1</ds-context-menu-item>
                  <ds-context-menu-item>Option 2</ds-context-menu-item>
                </ds-context-menu-sub-content>
              </ds-context-menu-sub>
            </ds-context-menu-content>
          </ds-context-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("context menu ARIA attributes", () => {
    it("should have role='menu' on content", async () => {
      render(
        html`
          <ds-context-menu open>
            <ds-context-menu-trigger>
              <div>Trigger</div>
            </ds-context-menu-trigger>
            <ds-context-menu-content>
              <ds-context-menu-item>Item</ds-context-menu-item>
            </ds-context-menu-content>
          </ds-context-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const menu = container.querySelector("[role='menu']");
      expect(menu).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("context menu with disabled items", () => {
    it("should have no violations with disabled items", async () => {
      render(
        html`
          <ds-context-menu open>
            <ds-context-menu-trigger>
              <div>Trigger</div>
            </ds-context-menu-trigger>
            <ds-context-menu-content>
              <ds-context-menu-item>Edit</ds-context-menu-item>
              <ds-context-menu-item disabled>Paste (Disabled)</ds-context-menu-item>
              <ds-context-menu-item>Delete</ds-context-menu-item>
            </ds-context-menu-content>
          </ds-context-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
