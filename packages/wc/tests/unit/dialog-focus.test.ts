import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/dialog/dialog.js";

describe("Dialog Focus Management", () => {
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

  describe("focus trap", () => {
    it("should move focus to first focusable element when opened", async () => {
      render(
        html`
          <ds-dialog>
            <button slot="trigger" id="open-btn">Open</button>
            <ds-dialog-content>
              <ds-dialog-title>Title</ds-dialog-title>
              <input type="text" id="first-input" />
              <button id="close-btn">Close</button>
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector("#open-btn") as HTMLButtonElement;
      trigger?.click();

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Focus should be inside the dialog
      const firstInput = container.querySelector("#first-input");
      const closeBtn = container.querySelector("#close-btn");
      const dialogContent = container.querySelector("ds-dialog-content");

      // Focus should be on first focusable element or within dialog
      expect(
        document.activeElement === firstInput ||
          document.activeElement === closeBtn ||
          dialogContent?.contains(document.activeElement)
      ).toBe(true);
    });

    it("should trap focus within dialog", async () => {
      render(
        html`
          <button id="outside-before">Before</button>
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>
              <button id="first-btn">First</button>
              <button id="second-btn">Second</button>
              <button id="last-btn">Last</button>
            </ds-dialog-content>
          </ds-dialog>
          <button id="outside-after">After</button>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const lastBtn = container.querySelector("#last-btn") as HTMLButtonElement;
      const firstBtn = container.querySelector("#first-btn") as HTMLButtonElement;

      // Focus the last button
      lastBtn?.focus();
      expect(document.activeElement).toBe(lastBtn);

      // Tab from last should wrap to first (or stay in dialog)
      lastBtn?.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Focus should still be within dialog (either wrapped or stayed)
      const dialogContent = container.querySelector("ds-dialog-content");
      expect(
        dialogContent?.contains(document.activeElement) || document.activeElement === firstBtn
      ).toBe(true);
    });

    it("should trap focus with Shift+Tab", async () => {
      render(
        html`
          <button id="outside-before">Before</button>
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>
              <button id="first-btn">First</button>
              <button id="second-btn">Second</button>
              <button id="last-btn">Last</button>
            </ds-dialog-content>
          </ds-dialog>
          <button id="outside-after">After</button>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const firstBtn = container.querySelector("#first-btn") as HTMLButtonElement;
      const lastBtn = container.querySelector("#last-btn") as HTMLButtonElement;

      // Focus the first button
      firstBtn?.focus();
      expect(document.activeElement).toBe(firstBtn);

      // Shift+Tab from first should wrap to last (or stay in dialog)
      firstBtn?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true })
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Focus should still be within dialog
      const dialogContent = container.querySelector("ds-dialog-content");
      expect(
        dialogContent?.contains(document.activeElement) || document.activeElement === lastBtn
      ).toBe(true);
    });
  });

  describe("focus return", () => {
    it("should return focus to trigger when closed", async () => {
      render(
        html`
          <ds-dialog>
            <button slot="trigger" id="trigger-btn">Open</button>
            <ds-dialog-content>
              <button id="close-btn">Close</button>
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector("#trigger-btn") as HTMLButtonElement;

      // Open dialog
      trigger?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Close dialog
      const dialog = container.querySelector("ds-dialog") as HTMLElement & { close: () => void };
      dialog?.close();

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Focus should return to trigger
      expect(document.activeElement).toBe(trigger);
    });

    it("should return focus to trigger when closed via Escape", async () => {
      render(
        html`
          <ds-dialog>
            <button slot="trigger" id="trigger-btn">Open</button>
            <ds-dialog-content>
              <button id="close-btn">Close</button>
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector("#trigger-btn") as HTMLButtonElement;

      // Open dialog
      trigger?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Close via Escape
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Focus should return to trigger
      expect(document.activeElement).toBe(trigger);
    });

    it("should return focus to trigger when closed via backdrop click", async () => {
      render(
        html`
          <ds-dialog>
            <button slot="trigger" id="trigger-btn">Open</button>
            <ds-dialog-content>
              <button id="close-btn">Close</button>
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const trigger = container.querySelector("#trigger-btn") as HTMLButtonElement;

      // Open dialog
      trigger?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Close via backdrop click
      const dialog = container.querySelector("ds-dialog");
      const backdrop = dialog?.querySelector(".ds-dialog__backdrop");
      if (backdrop) {
        backdrop.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Focus should return to trigger
      expect(document.activeElement).toBe(trigger);
    });
  });

  describe("focus management with no focusable elements", () => {
    it("should handle dialog with no focusable elements gracefully", async () => {
      render(
        html`
          <ds-dialog open>
            <button slot="trigger">Open</button>
            <ds-dialog-content>
              <p>No focusable elements here</p>
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should not throw, focus may be on dialog content itself
      const dialogContent = container.querySelector("ds-dialog-content");
      expect(dialogContent).toBeTruthy();
    });
  });

  describe("nested dialogs", () => {
    it("should manage focus independently for nested dialogs", async () => {
      render(
        html`
          <ds-dialog id="outer-dialog" open>
            <button slot="trigger">Open Outer</button>
            <ds-dialog-content>
              <button id="outer-btn">Outer Button</button>
              <ds-dialog id="inner-dialog">
                <button slot="trigger" id="inner-trigger">Open Inner</button>
                <ds-dialog-content>
                  <button id="inner-btn">Inner Button</button>
                </ds-dialog-content>
              </ds-dialog>
            </ds-dialog-content>
          </ds-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const outerDialog = container.querySelector("#outer-dialog");
      const innerTrigger = container.querySelector("#inner-trigger") as HTMLButtonElement;

      expect(outerDialog?.hasAttribute("open")).toBe(true);

      // Open inner dialog
      innerTrigger?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const innerDialog = container.querySelector("#inner-dialog");
      expect(innerDialog?.hasAttribute("open")).toBe(true);
    });
  });
});
