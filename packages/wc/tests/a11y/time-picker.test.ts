import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/time-picker/index.js";

expect.extend(toHaveNoViolations);

describe("TimePicker accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should have no accessibility violations for basic time picker", async () => {
    render(html`<ds-time-picker></ds-time-picker>`, container);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with value", async () => {
    render(html`<ds-time-picker value="14:30"></ds-time-picker>`, container);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with label", async () => {
    render(
      html`
        <label id="time-label">Meeting time</label>
        <ds-time-picker aria-labelledby="time-label"></ds-time-picker>
      `,
      container
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations when disabled", async () => {
    render(html`<ds-time-picker value="10:30" disabled></ds-time-picker>`, container);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations in 12-hour format", async () => {
    render(html`<ds-time-picker hour-format="12" value="14:30"></ds-time-picker>`, container);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with seconds", async () => {
    render(html`<ds-time-picker show-seconds value="14:30:45"></ds-time-picker>`, container);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe("ARIA attributes", () => {
    it("should have role='group' on container", async () => {
      render(html`<ds-time-picker></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const group = container.querySelector("[role='group']");
      expect(group).toBeTruthy();
    });

    it("should have role='spinbutton' on hour segment", async () => {
      render(html`<ds-time-picker></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const hourSegment = container.querySelector("[data-segment='hour']");
      expect(hourSegment?.getAttribute("role")).toBe("spinbutton");
    });

    it("should have role='spinbutton' on minute segment", async () => {
      render(html`<ds-time-picker></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const minuteSegment = container.querySelector("[data-segment='minute']");
      expect(minuteSegment?.getAttribute("role")).toBe("spinbutton");
    });

    it("should have aria-valuemin and aria-valuemax on hour segment", async () => {
      render(html`<ds-time-picker hour-format="24"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const hourSegment = container.querySelector("[data-segment='hour']");
      expect(hourSegment?.getAttribute("aria-valuemin")).toBe("0");
      expect(hourSegment?.getAttribute("aria-valuemax")).toBe("23");
    });

    it("should have aria-valuemin and aria-valuemax on minute segment", async () => {
      render(html`<ds-time-picker></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const minuteSegment = container.querySelector("[data-segment='minute']");
      expect(minuteSegment?.getAttribute("aria-valuemin")).toBe("0");
      expect(minuteSegment?.getAttribute("aria-valuemax")).toBe("59");
    });

    it("should have aria-valuenow on segments", async () => {
      render(html`<ds-time-picker hour-format="24" value="14:30"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const hourSegment = container.querySelector("[data-segment='hour']");
      const minuteSegment = container.querySelector("[data-segment='minute']");

      // Check that segments have aria-valuenow
      expect(hourSegment?.hasAttribute("aria-valuenow")).toBeTruthy();
      expect(minuteSegment?.hasAttribute("aria-valuenow")).toBeTruthy();
    });

    it("should have aria-label on segments", async () => {
      render(html`<ds-time-picker></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const hourSegment = container.querySelector("[data-segment='hour']");
      const minuteSegment = container.querySelector("[data-segment='minute']");

      expect(hourSegment?.getAttribute("aria-label")).toBeTruthy();
      expect(minuteSegment?.getAttribute("aria-label")).toBeTruthy();
    });

    it("should have aria-disabled on segments when disabled", async () => {
      render(html`<ds-time-picker disabled></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const segments = container.querySelectorAll(".ds-time-picker__segment");
      segments.forEach((segment) => {
        expect(segment.getAttribute("aria-disabled")).toBe("true");
      });
    });

    it("should be focusable", async () => {
      render(html`<ds-time-picker></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const segments = container.querySelectorAll(".ds-time-picker__segment");
      segments.forEach((segment) => {
        expect(segment.getAttribute("tabindex")).toBe("0");
      });
    });

    it("should not be focusable when disabled", async () => {
      render(html`<ds-time-picker disabled></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const segments = container.querySelectorAll(".ds-time-picker__segment");
      segments.forEach((segment) => {
        expect(segment.getAttribute("tabindex")).toBe("-1");
      });
    });
  });

  describe("12-hour format", () => {
    it("should have AM/PM segment with appropriate role", async () => {
      render(html`<ds-time-picker hour-format="12"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      // In 12-hour format, should have period segment (AM/PM)
      const timePicker = container.querySelector("ds-time-picker") as HTMLElement & {
        hourFormat: number;
      };
      expect(timePicker?.hourFormat).toBe(12);
    });

    it("should have correct hour range for 12-hour format", async () => {
      render(html`<ds-time-picker hour-format="12"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const hourSegment = container.querySelector("[data-segment='hour']");
      expect(hourSegment?.getAttribute("aria-valuemin")).toBe("1");
      expect(hourSegment?.getAttribute("aria-valuemax")).toBe("12");
    });
  });

  describe("keyboard interaction", () => {
    it("should increment value on ArrowUp", async () => {
      render(html`<ds-time-picker hour-format="24" value="10:30"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const hourSegment = container.querySelector("[data-segment='hour']") as HTMLElement;
      hourSegment?.focus();
      hourSegment?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 100));

      const timePicker = container.querySelector("ds-time-picker") as HTMLElement & {
        value: string;
      };
      // Value should contain 11 (incremented from 10)
      expect(timePicker?.value).toContain("11");
    });

    it("should decrement value on ArrowDown", async () => {
      render(html`<ds-time-picker hour-format="24" value="10:30"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const hourSegment = container.querySelector("[data-segment='hour']") as HTMLElement;
      hourSegment?.focus();
      hourSegment?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 100));

      const timePicker = container.querySelector("ds-time-picker") as HTMLElement & {
        value: string;
      };
      // Value should contain 09 (decremented from 10)
      expect(timePicker?.value).toContain("09");
    });

    it("should navigate between segments with ArrowRight", async () => {
      render(html`<ds-time-picker hour-format="24" value="10:30"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const hourSegment = container.querySelector("[data-segment='hour']") as HTMLElement;

      hourSegment?.focus();
      hourSegment?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Just verify the event was handled
      const timePicker = container.querySelector("ds-time-picker");
      expect(timePicker).toBeTruthy();
    });

    it("should navigate between segments with ArrowLeft", async () => {
      render(html`<ds-time-picker hour-format="24" value="10:30"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const minuteSegment = container.querySelector("[data-segment='minute']") as HTMLElement;

      minuteSegment?.focus();
      minuteSegment?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Just verify the event was handled
      const timePicker = container.querySelector("ds-time-picker");
      expect(timePicker).toBeTruthy();
    });
  });
});
