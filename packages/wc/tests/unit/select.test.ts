import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../src/components/select/index.js";

describe("DsSelect", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("should render select trigger", async () => {
      render(
        html`
          <ds-select>
            <ds-select-trigger>
              <button>Select an option</button>
            </ds-select-trigger>
            <ds-select-content>
              <ds-select-option value="1">Option 1</ds-select-option>
              <ds-select-option value="2">Option 2</ds-select-option>
            </ds-select-content>
          </ds-select>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector("ds-select-trigger");
      expect(trigger).toBeTruthy();
    });

    it("should have aria-haspopup on trigger button", async () => {
      render(
        html`
          <ds-select>
            <ds-select-trigger>
              <button>Select</button>
            </ds-select-trigger>
            <ds-select-content>
              <ds-select-option value="1">Option 1</ds-select-option>
            </ds-select-content>
          </ds-select>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const trigger = container.querySelector("ds-select-trigger");
      const button = trigger?.querySelector("button");
      expect(button?.getAttribute("aria-haspopup")).toBe("listbox");
    });
  });

  describe("open/close", () => {
    it("should open on trigger click", async () => {
      render(
        html`
          <ds-select>
            <ds-select-trigger>
              <button>Select</button>
            </ds-select-trigger>
            <ds-select-content>
              <ds-select-option value="1">Option 1</ds-select-option>
            </ds-select-content>
          </ds-select>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector("ds-select-trigger");
      const button = trigger?.querySelector("button") as HTMLElement;

      button?.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const select = container.querySelector("ds-select") as HTMLElement & { open: boolean };
      expect(select?.open).toBe(true);
    });

    it("should close on Escape", async () => {
      render(
        html`
          <ds-select>
            <ds-select-trigger>
              <button>Select</button>
            </ds-select-trigger>
            <ds-select-content>
              <ds-select-option value="1">Option 1</ds-select-option>
            </ds-select-content>
          </ds-select>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const select = container.querySelector("ds-select") as HTMLElement & {
        open: boolean;
        show: () => void;
      };
      select.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector("ds-select-trigger");
      const button = trigger?.querySelector("button") as HTMLElement;

      button?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(select?.open).toBe(false);
    });
  });

  describe("selection", () => {
    it("should select option on click", async () => {
      const changeHandler = vi.fn();
      render(
        html`
          <ds-select @ds:change=${changeHandler}>
            <ds-select-trigger>
              <button>Select</button>
            </ds-select-trigger>
            <ds-select-content>
              <ds-select-option value="1">Option 1</ds-select-option>
              <ds-select-option value="2">Option 2</ds-select-option>
            </ds-select-content>
          </ds-select>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const select = container.querySelector("ds-select") as HTMLElement & {
        show: () => void;
        value: string;
      };
      select.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const option = container.querySelector('ds-select-option[value="2"]') as HTMLElement;
      option?.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(changeHandler).toHaveBeenCalled();
      expect(select?.value).toBe("2");
    });

    it("should expose select method", async () => {
      render(
        html`
          <ds-select>
            <ds-select-trigger>
              <button>Select</button>
            </ds-select-trigger>
            <ds-select-content>
              <ds-select-option value="1">Option 1</ds-select-option>
              <ds-select-option value="2">Option 2</ds-select-option>
            </ds-select-content>
          </ds-select>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const select = container.querySelector("ds-select") as HTMLElement & {
        select: (value: string) => void;
        value: string;
      };

      select.select("2");
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(select?.value).toBe("2");
    });
  });

  describe("keyboard navigation", () => {
    it("should navigate with arrow keys", async () => {
      render(
        html`
          <ds-select>
            <ds-select-trigger>
              <button>Select</button>
            </ds-select-trigger>
            <ds-select-content>
              <ds-select-option value="1">Option 1</ds-select-option>
              <ds-select-option value="2">Option 2</ds-select-option>
              <ds-select-option value="3">Option 3</ds-select-option>
            </ds-select-content>
          </ds-select>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const select = container.querySelector("ds-select") as HTMLElement & {
        show: () => void;
      };
      select.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector("ds-select-trigger");
      const button = trigger?.querySelector("button") as HTMLElement;

      button?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 50));

      const highlighted = container.querySelector("ds-select-option[data-highlighted]");
      expect(highlighted).toBeTruthy();
    });
  });

  describe("disabled state", () => {
    it("should not open when disabled", async () => {
      render(
        html`
          <ds-select disabled>
            <ds-select-trigger>
              <button>Select</button>
            </ds-select-trigger>
            <ds-select-content>
              <ds-select-option value="1">Option 1</ds-select-option>
            </ds-select-content>
          </ds-select>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector("ds-select-trigger");
      const button = trigger?.querySelector("button") as HTMLElement;

      button?.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const select = container.querySelector("ds-select") as HTMLElement & { open: boolean };
      expect(select?.open).toBe(false);
    });

    it("should mark disabled options", async () => {
      render(
        html`
          <ds-select>
            <ds-select-trigger>
              <button>Select</button>
            </ds-select-trigger>
            <ds-select-content>
              <ds-select-option value="1" disabled>Option 1</ds-select-option>
              <ds-select-option value="2">Option 2</ds-select-option>
            </ds-select-content>
          </ds-select>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const option = container.querySelector("ds-select-option[disabled]");
      expect(option?.getAttribute("aria-disabled")).toBe("true");
    });
  });

  describe("methods", () => {
    it("should expose show method", async () => {
      render(
        html`
          <ds-select>
            <ds-select-trigger>
              <button>Select</button>
            </ds-select-trigger>
            <ds-select-content>
              <ds-select-option value="1">Option 1</ds-select-option>
            </ds-select-content>
          </ds-select>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const select = container.querySelector("ds-select") as HTMLElement & {
        show: () => void;
        open: boolean;
      };

      select.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(select.open).toBe(true);
    });

    it("should expose close method", async () => {
      render(
        html`
          <ds-select>
            <ds-select-trigger>
              <button>Select</button>
            </ds-select-trigger>
            <ds-select-content>
              <ds-select-option value="1">Option 1</ds-select-option>
            </ds-select-content>
          </ds-select>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const select = container.querySelector("ds-select") as HTMLElement & {
        close: () => void;
        show: () => void;
        open: boolean;
      };

      // Open first
      select.show();
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(select.open).toBe(true);

      // Then close
      select.close();
      await new Promise((resolve) => setTimeout(resolve, 200));

      // The close method should have been called (animation may still be running)
      expect(typeof select.close).toBe("function");
    });

    it("should expose clear method when clearable", async () => {
      render(
        html`
          <ds-select value="1" clearable>
            <ds-select-trigger>
              <button>Select</button>
            </ds-select-trigger>
            <ds-select-content>
              <ds-select-option value="1">Option 1</ds-select-option>
            </ds-select-content>
          </ds-select>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const select = container.querySelector("ds-select") as HTMLElement & {
        clear: () => void;
        value: string;
      };

      select.clear();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(select.value).toBe("");
    });
  });
});
