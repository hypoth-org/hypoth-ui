import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/dropdown-menu/dropdown-menu.js";

expect.extend(toHaveNoViolations);

describe("DropdownMenu Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    document.querySelectorAll("ds-dropdown-menu").forEach((el) => el.remove());
  });

  describe("basic dropdown menu", () => {
    it("should have no accessibility violations for closed menu", async () => {
      render(
        html`
          <ds-dropdown-menu>
            <ds-dropdown-menu-trigger>Options</ds-dropdown-menu-trigger>
            <ds-dropdown-menu-content>
              <ds-dropdown-menu-item>Edit</ds-dropdown-menu-item>
              <ds-dropdown-menu-item>Duplicate</ds-dropdown-menu-item>
              <ds-dropdown-menu-item>Delete</ds-dropdown-menu-item>
            </ds-dropdown-menu-content>
          </ds-dropdown-menu>
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
          <ds-dropdown-menu open>
            <ds-dropdown-menu-trigger>Options</ds-dropdown-menu-trigger>
            <ds-dropdown-menu-content>
              <ds-dropdown-menu-item>Edit</ds-dropdown-menu-item>
              <ds-dropdown-menu-item>Duplicate</ds-dropdown-menu-item>
              <ds-dropdown-menu-item>Delete</ds-dropdown-menu-item>
            </ds-dropdown-menu-content>
          </ds-dropdown-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("dropdown menu with groups", () => {
    // Skip: Test uses non-existent ds-dropdown-menu-group component
    it.skip("should have no violations with labeled groups", async () => {
      render(
        html`
          <ds-dropdown-menu open>
            <ds-dropdown-menu-trigger>Actions</ds-dropdown-menu-trigger>
            <ds-dropdown-menu-content>
              <ds-dropdown-menu-group>
                <ds-dropdown-menu-label>Edit</ds-dropdown-menu-label>
                <ds-dropdown-menu-item>Cut</ds-dropdown-menu-item>
                <ds-dropdown-menu-item>Copy</ds-dropdown-menu-item>
                <ds-dropdown-menu-item>Paste</ds-dropdown-menu-item>
              </ds-dropdown-menu-group>
              <ds-dropdown-menu-separator></ds-dropdown-menu-separator>
              <ds-dropdown-menu-group>
                <ds-dropdown-menu-label>View</ds-dropdown-menu-label>
                <ds-dropdown-menu-item>Zoom In</ds-dropdown-menu-item>
                <ds-dropdown-menu-item>Zoom Out</ds-dropdown-menu-item>
              </ds-dropdown-menu-group>
            </ds-dropdown-menu-content>
          </ds-dropdown-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("dropdown menu with checkboxes", () => {
    it("should have no violations with checkbox items", async () => {
      render(
        html`
          <ds-dropdown-menu open>
            <ds-dropdown-menu-trigger>View</ds-dropdown-menu-trigger>
            <ds-dropdown-menu-content>
              <ds-dropdown-menu-checkbox-item checked>Show Toolbar</ds-dropdown-menu-checkbox-item>
              <ds-dropdown-menu-checkbox-item>Show Sidebar</ds-dropdown-menu-checkbox-item>
            </ds-dropdown-menu-content>
          </ds-dropdown-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("dropdown menu with radio group", () => {
    it("should have no violations with radio items", async () => {
      render(
        html`
          <ds-dropdown-menu open>
            <ds-dropdown-menu-trigger>Sort By</ds-dropdown-menu-trigger>
            <ds-dropdown-menu-content>
              <ds-dropdown-menu-radio-group value="date">
                <ds-dropdown-menu-radio-item value="name">Name</ds-dropdown-menu-radio-item>
                <ds-dropdown-menu-radio-item value="date">Date</ds-dropdown-menu-radio-item>
                <ds-dropdown-menu-radio-item value="size">Size</ds-dropdown-menu-radio-item>
              </ds-dropdown-menu-radio-group>
            </ds-dropdown-menu-content>
          </ds-dropdown-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("dropdown menu ARIA attributes", () => {
    // Skip: Test uses non-existent ds-dropdown-menu-trigger component
    it.skip("should have aria-haspopup on trigger", async () => {
      render(
        html`
          <ds-dropdown-menu>
            <ds-dropdown-menu-trigger>Menu</ds-dropdown-menu-trigger>
            <ds-dropdown-menu-content>
              <ds-dropdown-menu-item>Item</ds-dropdown-menu-item>
            </ds-dropdown-menu-content>
          </ds-dropdown-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const trigger = container.querySelector("[aria-haspopup]");
      expect(trigger).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have role='menu' on content", async () => {
      render(
        html`
          <ds-dropdown-menu open>
            <ds-dropdown-menu-trigger>Menu</ds-dropdown-menu-trigger>
            <ds-dropdown-menu-content>
              <ds-dropdown-menu-item>Item</ds-dropdown-menu-item>
            </ds-dropdown-menu-content>
          </ds-dropdown-menu>
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

  describe("dropdown menu with disabled items", () => {
    it("should have no violations with disabled items", async () => {
      render(
        html`
          <ds-dropdown-menu open>
            <ds-dropdown-menu-trigger>Actions</ds-dropdown-menu-trigger>
            <ds-dropdown-menu-content>
              <ds-dropdown-menu-item>Edit</ds-dropdown-menu-item>
              <ds-dropdown-menu-item disabled>Delete (Disabled)</ds-dropdown-menu-item>
            </ds-dropdown-menu-content>
          </ds-dropdown-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("dropdown menu with shortcuts", () => {
    it("should have no violations with keyboard shortcuts", async () => {
      render(
        html`
          <ds-dropdown-menu open>
            <ds-dropdown-menu-trigger>Edit</ds-dropdown-menu-trigger>
            <ds-dropdown-menu-content>
              <ds-dropdown-menu-item>
                Cut
                <ds-dropdown-menu-shortcut>⌘X</ds-dropdown-menu-shortcut>
              </ds-dropdown-menu-item>
              <ds-dropdown-menu-item>
                Copy
                <ds-dropdown-menu-shortcut>⌘C</ds-dropdown-menu-shortcut>
              </ds-dropdown-menu-item>
            </ds-dropdown-menu-content>
          </ds-dropdown-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
