import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/dialog/dialog.js";

expect.extend(toHaveNoViolations);

describe("Dialog accessibility", () => {
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

  it("should have no accessibility violations for closed dialog", async () => {
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

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations for open dialog with title", async () => {
    render(
      html`
        <ds-dialog open>
          <button slot="trigger">Open Dialog</button>
          <ds-dialog-content>
            <ds-dialog-title>Confirmation Required</ds-dialog-title>
            <p>Are you sure you want to continue?</p>
            <button>Yes</button>
            <button>No</button>
          </ds-dialog-content>
        </ds-dialog>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations for dialog with title and description", async () => {
    render(
      html`
        <ds-dialog open>
          <button slot="trigger">Open Dialog</button>
          <ds-dialog-content>
            <ds-dialog-title>Delete Item</ds-dialog-title>
            <ds-dialog-description>
              This action cannot be undone. Are you sure you want to delete this item?
            </ds-dialog-description>
            <button>Delete</button>
            <button>Cancel</button>
          </ds-dialog-content>
        </ds-dialog>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations for alertdialog role", async () => {
    render(
      html`
        <ds-dialog open role="alertdialog">
          <button slot="trigger">Open Alert</button>
          <ds-dialog-content>
            <ds-dialog-title>Warning</ds-dialog-title>
            <ds-dialog-description>
              Your session is about to expire.
            </ds-dialog-description>
            <button>Extend Session</button>
          </ds-dialog-content>
        </ds-dialog>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe("ARIA attributes", () => {
    it("should have role='dialog' on content by default", async () => {
      render(
        html`
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>
              <ds-dialog-title>Title</ds-dialog-title>
              Content
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const content = container.querySelector("ds-dialog-content");
      expect(content?.getAttribute("role")).toBe("dialog");
    });

    it("should have role='alertdialog' when specified", async () => {
      render(
        html`
          <ds-dialog open role="alertdialog">
            <button slot="trigger">Open</button>
            <ds-dialog-content>
              <ds-dialog-title>Alert</ds-dialog-title>
              Content
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const content = container.querySelector("ds-dialog-content");
      expect(content?.getAttribute("role")).toBe("alertdialog");
    });

    it("should have aria-modal='true' on content", async () => {
      render(
        html`
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>
              <ds-dialog-title>Title</ds-dialog-title>
              Content
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const content = container.querySelector("ds-dialog-content");
      expect(content?.getAttribute("aria-modal")).toBe("true");
    });

    it("should connect aria-labelledby to dialog title", async () => {
      render(
        html`
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>
              <ds-dialog-title>My Dialog Title</ds-dialog-title>
              Content
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const title = container.querySelector("ds-dialog-title");
      const content = container.querySelector("ds-dialog-content");

      expect(title?.id).toBeTruthy();
      expect(content?.getAttribute("aria-labelledby")).toBe(title?.id);
    });

    it("should connect aria-describedby to dialog description", async () => {
      render(
        html`
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>
              <ds-dialog-title>Title</ds-dialog-title>
              <ds-dialog-description>Description text</ds-dialog-description>
              Content
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const description = container.querySelector("ds-dialog-description");
      const content = container.querySelector("ds-dialog-content");

      expect(description?.id).toBeTruthy();
      expect(content?.getAttribute("aria-describedby")).toBe(description?.id);
    });

    it("should connect both aria-labelledby and aria-describedby", async () => {
      render(
        html`
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>
              <ds-dialog-title>Delete Account</ds-dialog-title>
              <ds-dialog-description>
                This will permanently delete your account and all data.
              </ds-dialog-description>
              <button>Delete</button>
              <button>Cancel</button>
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const title = container.querySelector("ds-dialog-title");
      const description = container.querySelector("ds-dialog-description");
      const content = container.querySelector("ds-dialog-content");

      expect(content?.getAttribute("aria-labelledby")).toBe(title?.id);
      expect(content?.getAttribute("aria-describedby")).toBe(description?.id);
    });
  });

  describe("keyboard interaction", () => {
    it("should close on Escape key", async () => {
      render(
        html`
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>
              <ds-dialog-title>Title</ds-dialog-title>
              Content
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const dialog = container.querySelector("ds-dialog");
      expect(dialog?.hasAttribute("open")).toBe(true);

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(dialog?.hasAttribute("open")).toBe(false);
    });
  });

  describe("focus management", () => {
    it("should trap focus within dialog", async () => {
      render(
        html`
          <button id="outside">Outside</button>
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>
              <ds-dialog-title>Title</ds-dialog-title>
              <button id="inside-btn">Inside Button</button>
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Focus should be inside dialog
      const dialogContent = container.querySelector("ds-dialog-content");
      const insideBtn = container.querySelector("#inside-btn");

      // Either the button is focused or focus is within dialog content
      expect(
        document.activeElement === insideBtn || dialogContent?.contains(document.activeElement)
      ).toBe(true);
    });

    it("should return focus to trigger when closed", async () => {
      render(
        html`
          <ds-dialog>
            <button slot="trigger" id="trigger">Open</button>
            <ds-dialog-content>
              <ds-dialog-title>Title</ds-dialog-title>
              <button>Close</button>
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector("#trigger") as HTMLButtonElement;

      // Open dialog
      trigger?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Close via Escape
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Focus should return to trigger
      expect(document.activeElement).toBe(trigger);
    });
  });

  describe("multiple dialogs", () => {
    it("should handle multiple independent dialogs", async () => {
      render(
        html`
          <ds-dialog id="dialog1">
            <button slot="trigger" id="trigger1">Open Dialog 1</button>
            <ds-dialog-content>
              <ds-dialog-title>Dialog 1</ds-dialog-title>
              <p>Content 1</p>
            </ds-dialog-content>
          </ds-dialog>
          <ds-dialog id="dialog2">
            <button slot="trigger" id="trigger2">Open Dialog 2</button>
            <ds-dialog-content>
              <ds-dialog-title>Dialog 2</ds-dialog-title>
              <p>Content 2</p>
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const titles = container.querySelectorAll("ds-dialog-title");

      // Each dialog should have unique IDs
      expect(titles[0]?.id).not.toBe(titles[1]?.id);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
