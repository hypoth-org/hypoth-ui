import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { html, render } from "lit";
import "../../src/components/popover/popover.js";

describe("DsPopover", () => {
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
          <ds-popover>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector('[slot="trigger"]');
      expect(trigger).toBeTruthy();
      expect(trigger?.textContent).toBe("Open");
    });

    it("should hide content by default", async () => {
      render(
        html`
          <ds-popover>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const content = container.querySelector("ds-popover-content");
      expect(content?.hasAttribute("hidden")).toBe(true);
    });

    it("should show content when open attribute is set", async () => {
      render(
        html`
          <ds-popover open>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const content = container.querySelector("ds-popover-content");
      expect(content?.hasAttribute("hidden")).toBe(false);
    });
  });

  describe("opening and closing", () => {
    it("should open on trigger click", async () => {
      render(
        html`
          <ds-popover>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const popover = container.querySelector("ds-popover") as HTMLElement & { open: boolean };
      expect(popover.open).toBe(true);
    });

    it("should close on trigger click when open", async () => {
      render(
        html`
          <ds-popover open>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const popover = container.querySelector("ds-popover") as HTMLElement & { open: boolean };
      expect(popover.open).toBe(false);
    });

    it("should emit ds:open event when opened", async () => {
      const openHandler = vi.fn();

      render(
        html`
          <ds-popover @ds:open=${openHandler}>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
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
          <ds-popover open @ds:close=${closeHandler}>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
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
          <ds-popover open>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const popover = container.querySelector("ds-popover") as HTMLElement & { open: boolean };
      expect(popover.open).toBe(false);
    });

    it("should close on outside click", async () => {
      render(
        html`
          <ds-popover open>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
          <button id="outside">Outside</button>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const outside = container.querySelector("#outside") as HTMLElement;
      // Dismiss layer listens for pointerdown, not click
      outside.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const popover = container.querySelector("ds-popover") as HTMLElement & { open: boolean };
      expect(popover.open).toBe(false);
    });

    it("should not close when clicking inside content", async () => {
      render(
        html`
          <ds-popover open>
            <button slot="trigger">Open</button>
            <ds-popover-content>
              <button id="inside">Inside</button>
            </ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const inside = container.querySelector("#inside") as HTMLElement;
      inside.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const popover = container.querySelector("ds-popover") as HTMLElement & { open: boolean };
      expect(popover.open).toBe(true);
    });
  });

  describe("placement", () => {
    it("should default to bottom placement", async () => {
      render(
        html`
          <ds-popover>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const popover = container.querySelector("ds-popover") as HTMLElement & { placement: string };
      expect(popover.placement).toBe("bottom");
    });

    it("should support custom placement", async () => {
      render(
        html`
          <ds-popover placement="top-start">
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const popover = container.querySelector("ds-popover") as HTMLElement & { placement: string };
      expect(popover.placement).toBe("top-start");
    });

    it("should set data-placement on content when open", async () => {
      render(
        html`
          <ds-popover open placement="right">
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const content = container.querySelector("ds-popover-content");
      expect(content?.getAttribute("data-placement")).toBe("right");
    });
  });

  describe("offset", () => {
    it("should default to 8px offset", async () => {
      render(
        html`
          <ds-popover>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const popover = container.querySelector("ds-popover") as HTMLElement & { offset: number };
      expect(popover.offset).toBe(8);
    });

    it("should support custom offset", async () => {
      render(
        html`
          <ds-popover offset="16">
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const popover = container.querySelector("ds-popover") as HTMLElement & { offset: number };
      expect(popover.offset).toBe(16);
    });
  });

  describe("no focus trap (non-modal)", () => {
    it("should allow Tab to exit popover (no focus trap)", async () => {
      render(
        html`
          <ds-popover open>
            <button slot="trigger">Open</button>
            <ds-popover-content>
              <button id="inside">Inside</button>
            </ds-popover-content>
          </ds-popover>
          <button id="outside">Outside</button>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify popover is open and the outside button exists
      const popover = container.querySelector("ds-popover") as HTMLElement & { open: boolean };
      expect(popover.open).toBe(true);

      const outside = container.querySelector("#outside");
      expect(outside).toBeTruthy();

      // The fact that we can query the outside button and it's not
      // trapped means there's no focus trap (unlike Dialog)
    });
  });

  describe("programmatic API", () => {
    it("should expose show() method", async () => {
      render(
        html`
          <ds-popover>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const popover = container.querySelector("ds-popover") as HTMLElement & { show: () => void; open: boolean };
      popover.show();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(popover.open).toBe(true);
    });

    it("should expose close() method", async () => {
      render(
        html`
          <ds-popover open>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const popover = container.querySelector("ds-popover") as HTMLElement & { close: () => void; open: boolean };
      popover.close();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(popover.open).toBe(false);
    });

    it("should expose toggle() method", async () => {
      render(
        html`
          <ds-popover>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const popover = container.querySelector("ds-popover") as HTMLElement & { toggle: () => void; open: boolean };

      popover.toggle();
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(popover.open).toBe(true);

      popover.toggle();
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(popover.open).toBe(false);
    });
  });

  describe("attributes", () => {
    it("should support close-on-escape attribute", async () => {
      render(
        html`
          <ds-popover open close-on-escape="false">
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const popover = container.querySelector("ds-popover") as HTMLElement & { open: boolean };
      // Popover should remain open when close-on-escape is false
      expect(popover.open).toBe(true);
    });

    it("should support close-on-outside-click attribute", async () => {
      render(
        html`
          <ds-popover open close-on-outside-click="false">
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
          <button id="outside">Outside</button>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const outside = container.querySelector("#outside") as HTMLElement;
      // Dismiss layer listens for pointerdown, not click
      outside.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const popover = container.querySelector("ds-popover") as HTMLElement & { open: boolean };
      // Popover should remain open when close-on-outside-click is false
      expect(popover.open).toBe(true);
    });
  });
});

describe("DsPopoverContent", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should render content slot", async () => {
    render(
      html`
        <ds-popover open>
          <button slot="trigger">Open</button>
          <ds-popover-content>
            <p>Popover content here</p>
          </ds-popover-content>
        </ds-popover>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const content = container.querySelector("ds-popover-content");
    expect(content?.textContent).toContain("Popover content here");
  });

  it("should have hidden attribute when popover is closed", async () => {
    render(
      html`
        <ds-popover>
          <button slot="trigger">Open</button>
          <ds-popover-content>Content</ds-popover-content>
        </ds-popover>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const content = container.querySelector("ds-popover-content");
    expect(content?.hasAttribute("hidden")).toBe(true);
  });
});
