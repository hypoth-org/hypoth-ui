import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../src/components/dialog/dialog.js";

describe("DsDialog", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    // Clean up any dialogs that might have been portaled to body
    document.querySelectorAll("ds-dialog").forEach((el) => el.remove());
  });

  describe("rendering", () => {
    it("should render dialog with slot content", async () => {
      render(
        html`
          <ds-dialog>
            <button slot="trigger">Open Dialog</button>
            <ds-dialog-content>
              <ds-dialog-title>Dialog Title</ds-dialog-title>
              <p>Dialog content</p>
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const dialog = container.querySelector("ds-dialog");
      expect(dialog).toBeTruthy();
    });

    it("should be closed by default", async () => {
      render(
        html`
          <ds-dialog>
            <button slot="trigger">Open</button>
            <ds-dialog-content>Content</ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const dialog = container.querySelector("ds-dialog");
      expect(dialog?.getAttribute("open")).toBeNull();
    });

    it("should respect open attribute", async () => {
      render(
        html`
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>Content</ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const dialog = container.querySelector("ds-dialog");
      expect(dialog?.hasAttribute("open")).toBe(true);
    });
  });

  describe("open/close behavior", () => {
    it("should open when trigger is clicked", async () => {
      render(
        html`
          <ds-dialog>
            <button slot="trigger">Open Dialog</button>
            <ds-dialog-content>Content</ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector('[slot="trigger"]') as HTMLButtonElement;
      trigger?.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dialog = container.querySelector("ds-dialog");
      expect(dialog?.hasAttribute("open")).toBe(true);
    });

    it("should close when close method is called", async () => {
      render(
        html`
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>Content</ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const dialog = container.querySelector("ds-dialog") as HTMLElement & { close: () => void };
      dialog?.close();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(dialog?.hasAttribute("open")).toBe(false);
    });

    it("should emit ds:open event when opened", async () => {
      const openHandler = vi.fn();

      render(
        html`
          <ds-dialog @ds:open=${openHandler}>
            <button slot="trigger">Open</button>
            <ds-dialog-content>Content</ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector('[slot="trigger"]') as HTMLButtonElement;
      trigger?.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(openHandler).toHaveBeenCalled();
    });

    it("should emit ds:close event when closed", async () => {
      const closeHandler = vi.fn();

      render(
        html`
          <ds-dialog open @ds:close=${closeHandler}>
            <button slot="trigger">Open</button>
            <ds-dialog-content>Content</ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const dialog = container.querySelector("ds-dialog") as HTMLElement & { close: () => void };
      dialog?.close();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(closeHandler).toHaveBeenCalled();
    });
  });

  describe("Escape key handling", () => {
    it("should close on Escape key by default", async () => {
      render(
        html`
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>Content</ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dialog = container.querySelector("ds-dialog");

      // Dispatch Escape key event
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(dialog?.hasAttribute("open")).toBe(false);
    });

    it("should not close on Escape when close-on-escape is false", async () => {
      render(
        html`
          <ds-dialog open .closeOnEscape=${false}>
            <button slot="trigger">Open</button>
            <ds-dialog-content>Content</ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dialog = container.querySelector("ds-dialog");

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(dialog?.hasAttribute("open")).toBe(true);
    });
  });

  describe("backdrop click handling", () => {
    it("should close on backdrop click by default", async () => {
      render(
        html`
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>Content</ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dialog = container.querySelector("ds-dialog");
      const backdrop = dialog?.querySelector(".ds-dialog__backdrop");

      if (backdrop) {
        backdrop.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(dialog?.hasAttribute("open")).toBe(false);
    });

    it("should not close on backdrop click when close-on-backdrop is false", async () => {
      render(
        html`
          <ds-dialog open .closeOnBackdrop=${false}>
            <button slot="trigger">Open</button>
            <ds-dialog-content>Content</ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dialog = container.querySelector("ds-dialog");
      const backdrop = dialog?.querySelector(".ds-dialog__backdrop");

      if (backdrop) {
        backdrop.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(dialog?.hasAttribute("open")).toBe(true);
    });
  });

  describe("role attribute", () => {
    it("should have role='dialog' by default", async () => {
      render(
        html`
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>Content</ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dialogContent = container.querySelector("ds-dialog-content");
      expect(dialogContent?.getAttribute("role")).toBe("dialog");
    });

    it("should support role='alertdialog'", async () => {
      render(
        html`
          <ds-dialog open role="alertdialog">
            <button slot="trigger">Open</button>
            <ds-dialog-content>Content</ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const dialogContent = container.querySelector("ds-dialog-content");
      expect(dialogContent?.getAttribute("role")).toBe("alertdialog");
    });
  });
});

describe("DsDialogTrigger", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should render trigger content", async () => {
    render(
      html`
        <ds-dialog>
          <button slot="trigger">Click me</button>
          <ds-dialog-content>Content</ds-dialog-content>
        </ds-dialog>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const trigger = container.querySelector('[slot="trigger"]');
    expect(trigger?.textContent).toContain("Click me");
  });
});

describe("DsDialogContent", () => {
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
        <ds-dialog open>
          <button slot="trigger">Open</button>
          <ds-dialog-content>
            <p>Hello World</p>
          </ds-dialog-content>
        </ds-dialog>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const content = container.querySelector("ds-dialog-content");
    expect(content?.textContent).toContain("Hello World");
  });

  it("should have aria-modal='true'", async () => {
    render(
      html`
        <ds-dialog open>
          <button slot="trigger">Open</button>
          <ds-dialog-content>Content</ds-dialog-content>
        </ds-dialog>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const content = container.querySelector("ds-dialog-content");
    expect(content?.getAttribute("aria-modal")).toBe("true");
  });
});

describe("DsDialogTitle", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should render title text", async () => {
    render(
      html`
        <ds-dialog open>
          <button slot="trigger">Open</button>
          <ds-dialog-content>
            <ds-dialog-title>My Title</ds-dialog-title>
          </ds-dialog-content>
        </ds-dialog>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const title = container.querySelector("ds-dialog-title");
    expect(title?.textContent).toContain("My Title");
  });

  it("should be referenced by aria-labelledby on content", async () => {
    render(
      html`
        <ds-dialog open>
          <button slot="trigger">Open</button>
          <ds-dialog-content>
            <ds-dialog-title>Title</ds-dialog-title>
          </ds-dialog-content>
        </ds-dialog>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const title = container.querySelector("ds-dialog-title");
    const content = container.querySelector("ds-dialog-content");

    expect(title?.id).toBeTruthy();
    expect(content?.getAttribute("aria-labelledby")).toBe(title?.id);
  });
});

describe("DsDialogDescription", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should render description text", async () => {
    render(
      html`
        <ds-dialog open>
          <button slot="trigger">Open</button>
          <ds-dialog-content>
            <ds-dialog-description>Description text</ds-dialog-description>
          </ds-dialog-content>
        </ds-dialog>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const description = container.querySelector("ds-dialog-description");
    expect(description?.textContent).toContain("Description text");
  });

  it("should be referenced by aria-describedby on content", async () => {
    render(
      html`
        <ds-dialog open>
          <button slot="trigger">Open</button>
          <ds-dialog-content>
            <ds-dialog-description>Description</ds-dialog-description>
          </ds-dialog-content>
        </ds-dialog>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const description = container.querySelector("ds-dialog-description");
    const content = container.querySelector("ds-dialog-content");

    expect(description?.id).toBeTruthy();
    expect(content?.getAttribute("aria-describedby")).toBe(description?.id);
  });
});
