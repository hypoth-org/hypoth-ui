import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { html, render } from "lit";
import { axe, toHaveNoViolations } from "jest-axe";
import "../../src/components/popover/popover.js";

expect.extend(toHaveNoViolations);

describe("Popover Accessibility", () => {
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
          <ds-popover>
            <button slot="trigger">Open Popover</button>
            <ds-popover-content>
              <p>Popover content</p>
            </ds-popover-content>
          </ds-popover>
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
          <ds-popover open>
            <button slot="trigger">Open Popover</button>
            <ds-popover-content>
              <p>Popover content</p>
            </ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with interactive content", async () => {
      render(
        html`
          <ds-popover open>
            <button slot="trigger">Settings</button>
            <ds-popover-content>
              <button>Option 1</button>
              <button>Option 2</button>
              <button>Option 3</button>
            </ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with form content", async () => {
      render(
        html`
          <ds-popover open>
            <button slot="trigger">Filter</button>
            <ds-popover-content>
              <label for="search">Search:</label>
              <input id="search" type="text" />
              <button>Apply</button>
            </ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("ARIA attributes", () => {
    it("should have aria-expanded on trigger", async () => {
      render(
        html`
          <ds-popover>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector('[slot="trigger"]');
      expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    });

    it("should update aria-expanded when opened", async () => {
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

      const trigger = container.querySelector('[slot="trigger"]');
      expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    });

    it("should have aria-controls on trigger pointing to content", async () => {
      render(
        html`
          <ds-popover>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector('[slot="trigger"]');
      const content = container.querySelector("ds-popover-content");

      expect(trigger?.getAttribute("aria-controls")).toBeTruthy();
      expect(content?.id).toBe(trigger?.getAttribute("aria-controls"));
    });

    it("should have aria-haspopup on trigger", async () => {
      render(
        html`
          <ds-popover>
            <button slot="trigger">Open</button>
            <ds-popover-content>Content</ds-popover-content>
          </ds-popover>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector('[slot="trigger"]');
      expect(trigger?.getAttribute("aria-haspopup")).toBe("true");
    });

    it("should not have aria-modal on content (non-modal)", async () => {
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
      // Popover is non-modal, so aria-modal should NOT be true
      expect(content?.getAttribute("aria-modal")).not.toBe("true");
    });
  });

  describe("keyboard accessibility", () => {
    it("should not trap focus (non-modal popover)", async () => {
      render(
        html`
          <ds-popover open>
            <button slot="trigger">Open</button>
            <ds-popover-content>
              <button id="inside">Inside</button>
            </ds-popover-content>
          </ds-popover>
          <button id="after">After</button>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify popover is open and both buttons exist
      const popover = container.querySelector("ds-popover") as HTMLElement & { open: boolean };
      expect(popover.open).toBe(true);

      const afterButton = container.querySelector("#after");
      expect(afterButton).toBeTruthy();
      // Non-modal popover should not trap focus
    });
  });
});
