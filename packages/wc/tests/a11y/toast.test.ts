import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/toast/toast.js";

expect.extend(toHaveNoViolations);

describe("Toast Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    document.querySelectorAll("ds-toast, ds-toaster").forEach((el) => el.remove());
  });

  describe("basic toast", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-toast toast-title="Notification" description="This is a toast message.">
          </ds-toast>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("toast variants", () => {
    it("should have no violations for info variant", async () => {
      render(
        html`
          <ds-toast variant="info" toast-title="Info" description="Informational message.">
          </ds-toast>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for error variant", async () => {
      render(
        html`
          <ds-toast variant="error" toast-title="Error" description="Something went wrong.">
          </ds-toast>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("toast with action", () => {
    it("should have no violations with action button", async () => {
      render(
        html`
          <ds-toast toast-title="Undo Action" description="Item deleted.">
            <button slot="action">Undo</button>
          </ds-toast>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with close button", async () => {
      // ds-toast has built-in close button with proper aria-label
      render(
        html`
          <ds-toast toast-title="Notification" description="Click to dismiss">
          </ds-toast>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("toast ARIA attributes", () => {
    it("should have role='status' by default", async () => {
      render(
        html`
          <ds-toast variant="success" toast-title="Success" description="Operation completed.">
          </ds-toast>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Toast uses role="status" on its internal container
      const toast = container.querySelector("[role='status']");
      expect(toast).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have aria-live='polite' for accessibility", async () => {
      render(
        html`
          <ds-toast variant="error" toast-title="Error" description="Critical error occurred.">
          </ds-toast>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Toast uses aria-live for screen reader announcements
      const toast = container.querySelector("[aria-live]");
      expect(toast).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("multiple toasts", () => {
    it("should have no violations with multiple toasts", async () => {
      render(
        html`
          <div aria-label="Notifications" role="region">
            <ds-toast variant="info" toast-title="Toast 1" description="First notification">
            </ds-toast>
            <ds-toast variant="success" toast-title="Toast 2" description="Second notification">
            </ds-toast>
          </div>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
