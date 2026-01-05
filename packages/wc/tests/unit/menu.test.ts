import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../src/components/menu/menu.js";

describe("DsMenu", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("should render trigger slot", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector('[slot="trigger"]');
      expect(trigger).toBeTruthy();
      expect(trigger?.textContent).toBe("Open Menu");
    });

    it("should hide content by default", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const content = container.querySelector("ds-menu-content");
      expect(content?.hasAttribute("hidden")).toBe(true);
    });

    it("should show content when open attribute is set", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const content = container.querySelector("ds-menu-content");
      expect(content?.hasAttribute("hidden")).toBe(false);
    });
  });

  describe("opening and closing", () => {
    it("should open on trigger click", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const menu = container.querySelector("ds-menu") as HTMLElement & { open: boolean };
      expect(menu.open).toBe(true);
    });

    it("should focus first menu item when opened", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Open Menu</button>
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

    it("should close on trigger click when open", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const menu = container.querySelector("ds-menu") as HTMLElement & { open: boolean };
      expect(menu.open).toBe(false);
    });

    it("should emit ds:open event when opened", async () => {
      const openHandler = vi.fn();

      render(
        html`
          <ds-menu @ds:open=${openHandler}>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(openHandler).toHaveBeenCalled();
    });

    it("should emit ds:close event when closed", async () => {
      const closeHandler = vi.fn();

      render(
        html`
          <ds-menu open @ds:close=${closeHandler}>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(closeHandler).toHaveBeenCalled();
    });

    it("should close on Escape key", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
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

    it("should return focus to trigger when closed via Escape", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
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

    it("should close on outside click", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
          <button id="outside">Outside</button>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const outside = container.querySelector("#outside") as HTMLElement;
      outside.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const menu = container.querySelector("ds-menu") as HTMLElement & { open: boolean };
      expect(menu.open).toBe(false);
    });

    it("should not close when clicking inside content", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const content = container.querySelector("ds-menu-content") as HTMLElement;
      content.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const menu = container.querySelector("ds-menu") as HTMLElement & { open: boolean };
      expect(menu.open).toBe(true);
    });
  });

  describe("keyboard navigation - roving focus", () => {
    it("should move focus to next item on ArrowDown", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
              <ds-menu-item>Item 2</ds-menu-item>
              <ds-menu-item>Item 3</ds-menu-item>
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

    it("should move focus to previous item on ArrowUp", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
              <ds-menu-item>Item 2</ds-menu-item>
              <ds-menu-item>Item 3</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Focus second item first
      const items = container.querySelectorAll("ds-menu-item");
      (items[1] as HTMLElement).focus();

      const content = container.querySelector("ds-menu-content") as HTMLElement;
      content.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(document.activeElement).toBe(items[0]);
    });

    it("should wrap around when pressing ArrowDown on last item", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
              <ds-menu-item>Item 2</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Focus last item
      const items = container.querySelectorAll("ds-menu-item");
      (items[1] as HTMLElement).focus();

      const content = container.querySelector("ds-menu-content") as HTMLElement;
      content.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(document.activeElement).toBe(items[0]);
    });

    it("should wrap around when pressing ArrowUp on first item", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
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
      content.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const items = container.querySelectorAll("ds-menu-item");
      expect(document.activeElement).toBe(items[1]);
    });

    it("should move focus to first item on Home key", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
              <ds-menu-item>Item 2</ds-menu-item>
              <ds-menu-item>Item 3</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Focus last item first
      const items = container.querySelectorAll("ds-menu-item");
      (items[2] as HTMLElement).focus();

      const content = container.querySelector("ds-menu-content") as HTMLElement;
      content.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(document.activeElement).toBe(items[0]);
    });

    it("should move focus to last item on End key", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
              <ds-menu-item>Item 2</ds-menu-item>
              <ds-menu-item>Item 3</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const content = container.querySelector("ds-menu-content") as HTMLElement;
      content.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const items = container.querySelectorAll("ds-menu-item");
      expect(document.activeElement).toBe(items[2]);
    });

    it("should skip disabled items during navigation", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
              <ds-menu-item disabled>Item 2</ds-menu-item>
              <ds-menu-item>Item 3</ds-menu-item>
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
      // Should skip item 2 (disabled) and focus item 3
      expect(document.activeElement).toBe(items[2]);
    });
  });

  describe("item selection", () => {
    it("should close menu and emit ds:select on Enter key", async () => {
      const selectHandler = vi.fn();

      render(
        html`
          <ds-menu open @ds:select=${selectHandler}>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item value="action1">Item 1</ds-menu-item>
              <ds-menu-item value="action2">Item 2</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const firstItem = container.querySelector("ds-menu-item") as HTMLElement;
      firstItem.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(selectHandler).toHaveBeenCalled();
      expect(selectHandler.mock.calls[0][0].detail.value).toBe("action1");

      const menu = container.querySelector("ds-menu") as HTMLElement & { open: boolean };
      expect(menu.open).toBe(false);
    });

    it("should close menu and emit ds:select on Space key", async () => {
      const selectHandler = vi.fn();

      render(
        html`
          <ds-menu open @ds:select=${selectHandler}>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item value="action1">Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const firstItem = container.querySelector("ds-menu-item") as HTMLElement;
      firstItem.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(selectHandler).toHaveBeenCalled();

      const menu = container.querySelector("ds-menu") as HTMLElement & { open: boolean };
      expect(menu.open).toBe(false);
    });

    it("should close menu and emit ds:select on click", async () => {
      const selectHandler = vi.fn();

      render(
        html`
          <ds-menu open @ds:select=${selectHandler}>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item value="action1">Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const firstItem = container.querySelector("ds-menu-item") as HTMLElement;
      firstItem.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(selectHandler).toHaveBeenCalled();

      const menu = container.querySelector("ds-menu") as HTMLElement & { open: boolean };
      expect(menu.open).toBe(false);
    });

    it("should not select disabled items", async () => {
      const selectHandler = vi.fn();

      render(
        html`
          <ds-menu open @ds:select=${selectHandler}>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item value="action1" disabled>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const firstItem = container.querySelector("ds-menu-item") as HTMLElement;
      firstItem.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(selectHandler).not.toHaveBeenCalled();

      const menu = container.querySelector("ds-menu") as HTMLElement & { open: boolean };
      expect(menu.open).toBe(true);
    });

    it("should return focus to trigger after selection", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item value="action1">Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const firstItem = container.querySelector("ds-menu-item") as HTMLElement;
      firstItem.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector('[slot="trigger"]');
      expect(document.activeElement).toBe(trigger);
    });
  });

  describe("type-ahead search", () => {
    it("should focus matching item when typing", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Apple</ds-menu-item>
              <ds-menu-item>Banana</ds-menu-item>
              <ds-menu-item>Cherry</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const content = container.querySelector("ds-menu-content") as HTMLElement;
      content.dispatchEvent(new KeyboardEvent("keydown", { key: "b", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const items = container.querySelectorAll("ds-menu-item");
      expect(document.activeElement).toBe(items[1]); // Banana
    });

    it("should accumulate characters for multi-char search", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Save</ds-menu-item>
              <ds-menu-item>Settings</ds-menu-item>
              <ds-menu-item>Share</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const content = container.querySelector("ds-menu-content") as HTMLElement;
      content.dispatchEvent(new KeyboardEvent("keydown", { key: "s", bubbles: true }));
      content.dispatchEvent(new KeyboardEvent("keydown", { key: "h", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const items = container.querySelectorAll("ds-menu-item");
      expect(document.activeElement).toBe(items[2]); // Share
    });

    it("should be case-insensitive", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Apple</ds-menu-item>
              <ds-menu-item>Banana</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const content = container.querySelector("ds-menu-content") as HTMLElement;
      content.dispatchEvent(new KeyboardEvent("keydown", { key: "B", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const items = container.querySelectorAll("ds-menu-item");
      expect(document.activeElement).toBe(items[1]); // Banana
    });
  });

  describe("placement", () => {
    it("should default to bottom-start placement", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const menu = container.querySelector("ds-menu") as HTMLElement & { placement: string };
      expect(menu.placement).toBe("bottom-start");
    });

    it("should support custom placement", async () => {
      render(
        html`
          <ds-menu placement="top-end">
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const menu = container.querySelector("ds-menu") as HTMLElement & { placement: string };
      expect(menu.placement).toBe("top-end");
    });

    it("should set data-placement on content when open", async () => {
      render(
        html`
          <ds-menu open placement="right-start">
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const content = container.querySelector("ds-menu-content");
      expect(content?.getAttribute("data-placement")).toBe("right-start");
    });
  });

  describe("programmatic API", () => {
    it("should expose show() method", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const menu = container.querySelector("ds-menu") as HTMLElement & {
        show: () => void;
        open: boolean;
      };
      menu.show();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(menu.open).toBe(true);
    });

    it("should expose close() method", async () => {
      render(
        html`
          <ds-menu open>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const menu = container.querySelector("ds-menu") as HTMLElement & {
        close: () => void;
        open: boolean;
      };
      menu.close();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(menu.open).toBe(false);
    });

    it("should expose toggle() method", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const menu = container.querySelector("ds-menu") as HTMLElement & {
        toggle: () => void;
        open: boolean;
      };

      menu.toggle();
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(menu.open).toBe(true);

      menu.toggle();
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(menu.open).toBe(false);
    });
  });

  describe("trigger keyboard interactions", () => {
    it("should open menu on Enter key on trigger", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const menu = container.querySelector("ds-menu") as HTMLElement & { open: boolean };
      expect(menu.open).toBe(true);
    });

    it("should open menu on Space key on trigger", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Open Menu</button>
            <ds-menu-content>
              <ds-menu-item>Item 1</ds-menu-item>
            </ds-menu-content>
          </ds-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const menu = container.querySelector("ds-menu") as HTMLElement & { open: boolean };
      expect(menu.open).toBe(true);
    });

    it("should open menu and focus first item on ArrowDown on trigger", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Open Menu</button>
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
      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const menu = container.querySelector("ds-menu") as HTMLElement & { open: boolean };
      expect(menu.open).toBe(true);

      const firstItem = container.querySelector("ds-menu-item");
      expect(document.activeElement).toBe(firstItem);
    });

    it("should open menu and focus last item on ArrowUp on trigger", async () => {
      render(
        html`
          <ds-menu>
            <button slot="trigger">Open Menu</button>
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
      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const menu = container.querySelector("ds-menu") as HTMLElement & { open: boolean };
      expect(menu.open).toBe(true);

      const items = container.querySelectorAll("ds-menu-item");
      expect(document.activeElement).toBe(items[items.length - 1]);
    });
  });
});

describe("DsMenuContent", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should have role=menu", async () => {
    render(
      html`
        <ds-menu open>
          <button slot="trigger">Open Menu</button>
          <ds-menu-content>
            <ds-menu-item>Item 1</ds-menu-item>
          </ds-menu-content>
        </ds-menu>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const content = container.querySelector("ds-menu-content");
    expect(content?.getAttribute("role")).toBe("menu");
  });

  it("should have hidden attribute when menu is closed", async () => {
    render(
      html`
        <ds-menu>
          <button slot="trigger">Open Menu</button>
          <ds-menu-content>
            <ds-menu-item>Item 1</ds-menu-item>
          </ds-menu-content>
        </ds-menu>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const content = container.querySelector("ds-menu-content");
    expect(content?.hasAttribute("hidden")).toBe(true);
  });
});

describe("DsMenuItem", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should have role=menuitem", async () => {
    render(
      html`
        <ds-menu open>
          <button slot="trigger">Open Menu</button>
          <ds-menu-content>
            <ds-menu-item>Item 1</ds-menu-item>
          </ds-menu-content>
        </ds-menu>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const item = container.querySelector("ds-menu-item");
    expect(item?.getAttribute("role")).toBe("menuitem");
  });

  it("should support disabled attribute", async () => {
    render(
      html`
        <ds-menu open>
          <button slot="trigger">Open Menu</button>
          <ds-menu-content>
            <ds-menu-item disabled>Item 1</ds-menu-item>
          </ds-menu-content>
        </ds-menu>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const item = container.querySelector("ds-menu-item");
    expect(item?.hasAttribute("disabled")).toBe(true);
    expect(item?.getAttribute("aria-disabled")).toBe("true");
  });

  it("should support value attribute", async () => {
    render(
      html`
        <ds-menu open>
          <button slot="trigger">Open Menu</button>
          <ds-menu-content>
            <ds-menu-item value="custom-value">Item 1</ds-menu-item>
          </ds-menu-content>
        </ds-menu>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const item = container.querySelector("ds-menu-item") as HTMLElement & { value: string };
    expect(item.value).toBe("custom-value");
  });

  it("should have tabIndex managed by roving focus", async () => {
    render(
      html`
        <ds-menu open>
          <button slot="trigger">Open Menu</button>
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
    // First item should have tabIndex 0 (focused), others -1
    expect((items[0] as HTMLElement).tabIndex).toBe(0);
    expect((items[1] as HTMLElement).tabIndex).toBe(-1);
  });
});
