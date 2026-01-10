import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/progress/progress.js";

expect.extend(toHaveNoViolations);

describe("Progress Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic progress", () => {
    it("should have no accessibility violations", async () => {
      render(html`<ds-progress value="50" aria-label="Upload progress"></ds-progress>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations at 0%", async () => {
      render(html`<ds-progress value="0" aria-label="Download progress"></ds-progress>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations at 100%", async () => {
      render(html`<ds-progress value="100" aria-label="Complete"></ds-progress>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("indeterminate progress", () => {
    it("should have no violations for indeterminate state", async () => {
      render(html`<ds-progress aria-label="Loading"></ds-progress>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("progress with label", () => {
    it("should have no violations with visible label", async () => {
      render(
        html`
          <div>
            <label id="progress-label">Uploading files...</label>
            <ds-progress value="75" aria-labelledby="progress-label"></ds-progress>
          </div>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with value text", async () => {
      render(
        html`
          <ds-progress value="75" aria-label="Upload progress" aria-valuetext="75 percent complete">
          </ds-progress>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("progress ARIA attributes", () => {
    it("should have role='progressbar'", async () => {
      render(html`<ds-progress value="50" aria-label="Progress"></ds-progress>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const progress = container.querySelector("[role='progressbar']");
      expect(progress).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have proper aria-valuenow", async () => {
      render(html`<ds-progress value="50" aria-label="Progress"></ds-progress>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const progress = container.querySelector("[role='progressbar']");
      expect(progress?.getAttribute("aria-valuenow")).toBe("50");
    });

    it("should have proper aria-valuemin and aria-valuemax", async () => {
      render(html`<ds-progress value="50" aria-label="Progress"></ds-progress>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const progress = container.querySelector("[role='progressbar']");
      expect(progress?.getAttribute("aria-valuemin")).toBe("0");
      expect(progress?.getAttribute("aria-valuemax")).toBe("100");
    });
  });
});
