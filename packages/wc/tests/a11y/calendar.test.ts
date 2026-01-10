import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/calendar/calendar.js";

expect.extend(toHaveNoViolations);

describe("Calendar Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic calendar", () => {
    it("should have no accessibility violations", async () => {
      render(html`<ds-calendar aria-label="Select a date"></ds-calendar>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("calendar with selected date", () => {
    it("should have no violations with selected date", async () => {
      render(
        html`<ds-calendar value="2024-01-15" aria-label="Date selection"></ds-calendar>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("calendar ARIA attributes", () => {
    it("should have role='grid' for calendar grid", async () => {
      render(html`<ds-calendar aria-label="Calendar"></ds-calendar>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const grid = container.querySelector("[role='grid']");
      expect(grid).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have aria-label on navigation buttons", async () => {
      render(html`<ds-calendar aria-label="Calendar"></ds-calendar>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("calendar with disabled dates", () => {
    it("should have no violations with disabled dates", async () => {
      render(
        html`<ds-calendar
          aria-label="Calendar"
          .disabled-dates=${["2024-01-10", "2024-01-11"]}
        ></ds-calendar>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("calendar with range selection", () => {
    it("should have no violations in range mode", async () => {
      render(
        html`<ds-calendar mode="range" aria-label="Select date range"></ds-calendar>`,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("calendar keyboard navigation", () => {
    it("should have focusable date cells", async () => {
      render(html`<ds-calendar aria-label="Calendar"></ds-calendar>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      // There should be focusable cells
      const focusableCells = container.querySelectorAll(
        "[role='gridcell'] button, [tabindex='0']"
      );
      expect(focusableCells.length).toBeGreaterThan(0);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
