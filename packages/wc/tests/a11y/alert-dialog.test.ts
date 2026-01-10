import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/alert-dialog/alert-dialog.js";

expect.extend(toHaveNoViolations);

describe("AlertDialog Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    document.querySelectorAll("ds-alert-dialog").forEach((el) => el.remove());
  });

  describe("basic alert dialog", () => {
    it("should have no accessibility violations for closed dialog", async () => {
      render(
        html`
          <ds-alert-dialog>
            <ds-alert-dialog-trigger>Delete</ds-alert-dialog-trigger>
            <ds-alert-dialog-content>
              <ds-alert-dialog-header>
                <ds-alert-dialog-title>Are you sure?</ds-alert-dialog-title>
                <ds-alert-dialog-description>
                  This action cannot be undone.
                </ds-alert-dialog-description>
              </ds-alert-dialog-header>
              <ds-alert-dialog-footer>
                <ds-alert-dialog-cancel>Cancel</ds-alert-dialog-cancel>
                <ds-alert-dialog-action>Delete</ds-alert-dialog-action>
              </ds-alert-dialog-footer>
            </ds-alert-dialog-content>
          </ds-alert-dialog>
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
          <ds-alert-dialog open>
            <ds-alert-dialog-trigger>Delete</ds-alert-dialog-trigger>
            <ds-alert-dialog-content>
              <ds-alert-dialog-header>
                <ds-alert-dialog-title>Confirm Deletion</ds-alert-dialog-title>
                <ds-alert-dialog-description>
                  Are you sure you want to delete this item?
                </ds-alert-dialog-description>
              </ds-alert-dialog-header>
              <ds-alert-dialog-footer>
                <ds-alert-dialog-cancel>Cancel</ds-alert-dialog-cancel>
                <ds-alert-dialog-action>Delete</ds-alert-dialog-action>
              </ds-alert-dialog-footer>
            </ds-alert-dialog-content>
          </ds-alert-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("alert dialog ARIA attributes", () => {
    it("should have role='alertdialog'", async () => {
      render(
        html`
          <ds-alert-dialog open>
            <ds-alert-dialog-content>
              <ds-alert-dialog-title>Warning</ds-alert-dialog-title>
              <ds-alert-dialog-description>This is important.</ds-alert-dialog-description>
              <ds-alert-dialog-footer>
                <ds-alert-dialog-action>OK</ds-alert-dialog-action>
              </ds-alert-dialog-footer>
            </ds-alert-dialog-content>
          </ds-alert-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const alertdialog = container.querySelector("[role='alertdialog']");
      expect(alertdialog).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have aria-modal='true'", async () => {
      render(
        html`
          <ds-alert-dialog open>
            <ds-alert-dialog-content>
              <ds-alert-dialog-title>Confirm</ds-alert-dialog-title>
              <ds-alert-dialog-description>Confirm action?</ds-alert-dialog-description>
              <ds-alert-dialog-footer>
                <ds-alert-dialog-cancel>No</ds-alert-dialog-cancel>
                <ds-alert-dialog-action>Yes</ds-alert-dialog-action>
              </ds-alert-dialog-footer>
            </ds-alert-dialog-content>
          </ds-alert-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const alertdialog = container.querySelector("[aria-modal='true']");
      expect(alertdialog).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have aria-labelledby connected to title", async () => {
      render(
        html`
          <ds-alert-dialog open>
            <ds-alert-dialog-content>
              <ds-alert-dialog-title>Important Alert</ds-alert-dialog-title>
              <ds-alert-dialog-description>Details here.</ds-alert-dialog-description>
              <ds-alert-dialog-footer>
                <ds-alert-dialog-action>OK</ds-alert-dialog-action>
              </ds-alert-dialog-footer>
            </ds-alert-dialog-content>
          </ds-alert-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const title = container.querySelector("ds-alert-dialog-title");
      const content = container.querySelector("ds-alert-dialog-content");

      expect(title?.id).toBeTruthy();
      expect(content?.getAttribute("aria-labelledby")).toBe(title?.id);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("focus management", () => {
    // Skip: Focus trap doesn't work reliably in happy-dom environment
    it.skip("should trap focus within dialog", async () => {
      render(
        html`
          <button id="outside">Outside</button>
          <ds-alert-dialog open>
            <ds-alert-dialog-content>
              <ds-alert-dialog-title>Focus Test</ds-alert-dialog-title>
              <ds-alert-dialog-description>Testing focus trap.</ds-alert-dialog-description>
              <ds-alert-dialog-footer>
                <ds-alert-dialog-cancel>Cancel</ds-alert-dialog-cancel>
                <ds-alert-dialog-action>Action</ds-alert-dialog-action>
              </ds-alert-dialog-footer>
            </ds-alert-dialog-content>
          </ds-alert-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      // Focus should be within dialog
      const dialogContent = container.querySelector("ds-alert-dialog-content");
      expect(
        dialogContent?.contains(document.activeElement) ||
          document.activeElement?.closest("ds-alert-dialog-content")
      ).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("destructive alert dialog", () => {
    it("should have no violations for destructive action", async () => {
      render(
        html`
          <ds-alert-dialog open>
            <ds-alert-dialog-content>
              <ds-alert-dialog-header>
                <ds-alert-dialog-title>Delete Account</ds-alert-dialog-title>
                <ds-alert-dialog-description>
                  This will permanently delete your account and all associated data.
                </ds-alert-dialog-description>
              </ds-alert-dialog-header>
              <ds-alert-dialog-footer>
                <ds-alert-dialog-cancel>Cancel</ds-alert-dialog-cancel>
                <ds-alert-dialog-action variant="destructive">
                  Delete Account
                </ds-alert-dialog-action>
              </ds-alert-dialog-footer>
            </ds-alert-dialog-content>
          </ds-alert-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
