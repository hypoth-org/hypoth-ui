import { axe, toHaveNoViolations } from "jest-axe";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/menu/menu.js";

expect.extend(toHaveNoViolations);

describe("Menu Accessibility", () => {
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
          <ds-menu>
            <button slot="trigger">Actions</button>
            <ds-menu-content>
              <ds-menu-item>Edit</ds-menu-item>
              <ds-menu-item>Delete</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
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
          <ds-menu open>
            <button slot="trigger">Actions</button>
            <ds-menu-content>
              <ds-menu-item>Edit</ds-menu-item>
              <ds-menu-item>Delete</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with many menu items", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">File</button>
            <ds-menu-content>
              <ds-menu-item>New</ds-menu-item>
              <ds-menu-item>Open</ds-menu-item>
              <ds-menu-item>Save</ds-menu-item>
              <ds-menu-item>Save As...</ds-menu-item>
              <ds-menu-item>Export</ds-menu-item>
              <ds-menu-item>Print</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with disabled items", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Edit</button>
            <ds-menu-content>
              <ds-menu-item>Undo</ds-menu-item>
              <ds-menu-item disabled>Redo</ds-menu-item>
              <ds-menu-item>Cut</ds-menu-item>
              <ds-menu-item>Copy</ds-menu-item>
              <ds-menu-item disabled>Paste</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("ARIA roles", () => {
    it("should have role=menu on content", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Actions</button>
            <ds-menu-content>
              <ds-menu-item>Item</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const content = container.querySelector("ds-menu-content");
      expect(content?.getAttribute("role")).toBe("menu");
    });

    it("should have role=menuitem on each item", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Actions</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
              <ds-menu-item>Item 2</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const items = container.querySelectorAll("ds-menu-item");
      items.forEach((item) => {
        expect(item.getAttribute("role")).toBe("menuitem");
      });
    });
  });

  describe("ARIA attributes on trigger", () => {
    it("should have aria-haspopup=menu on trigger", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Actions</button>
            <ds-menu-content>
              <ds-menu-item>Item</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector('[slot="trigger"]');
      expect(trigger?.getAttribute("aria-haspopup")).toBe("menu");
    });

    it("should have aria-expanded=false when closed", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Actions</button>
            <ds-menu-content>
              <ds-menu-item>Item</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector('[slot="trigger"]');
      expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    });

    it("should have aria-expanded=true when open", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Actions</button>
            <ds-menu-content>
              <ds-menu-item>Item</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector('[slot="trigger"]');
      expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    });

    it("should have aria-controls pointing to menu content id", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Actions</button>
            <ds-menu-content>
              <ds-menu-item>Item</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector('[slot="trigger"]');
      const content = container.querySelector("ds-menu-content");

      expect(trigger?.getAttribute("aria-controls")).toBeTruthy();
      expect(content?.id).toBe(trigger?.getAttribute("aria-controls"));
    });
  });

  describe("ARIA attributes on items", () => {
    it("should have aria-disabled=true on disabled items", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Actions</button>
            <ds-menu-content>
              <ds-menu-item disabled>Disabled Item</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const item = container.querySelector("ds-menu-item[disabled]");
      expect(item?.getAttribute("aria-disabled")).toBe("true");
    });
  });

  describe("keyboard accessibility", () => {
    it("should be dismissable with Escape key", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Actions</button>
            <ds-menu-content>
              <ds-menu-item>Item</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const menu = container.querySelector("ds-menu") as HTMLElement & { open: boolean };
      expect(menu.open).toBe(false);
    });

    it("should support arrow key navigation", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Actions</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
              <ds-menu-item>Item 2</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const content = container.querySelector("ds-menu-content") as HTMLElement;
      content.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const items = container.querySelectorAll("ds-menu-item");
      expect(document.activeElement).toBe(items[1]);
    });
  });

  describe("focus management", () => {
    it("should focus first item when menu opens", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Actions</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
              <ds-menu-item>Item 2</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const firstItem = container.querySelector("ds-menu-item");
      expect(document.activeElement).toBe(firstItem);
    });

    it("should return focus to trigger when menu closes", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Actions</button>
            <ds-menu-content>
              <ds-menu-item>Item</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector('[slot="trigger"]');
      expect(document.activeElement).toBe(trigger);
    });
  });
});
