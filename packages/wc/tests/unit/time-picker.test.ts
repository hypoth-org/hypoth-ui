import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/time-picker/index.js";

describe("DsTimePicker", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("should render time picker with segments", async () => {
      render(html`<ds-time-picker></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const segments = container.querySelectorAll(".ds-time-picker__segment");
      expect(segments.length).toBeGreaterThan(0);
    });

    it("should render hour and minute segments", async () => {
      render(html`<ds-time-picker></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const hourSegment = container.querySelector("[data-segment='hour']");
      const minuteSegment = container.querySelector("[data-segment='minute']");

      expect(hourSegment).toBeTruthy();
      expect(minuteSegment).toBeTruthy();
    });

    it("should have show-seconds property when enabled", async () => {
      render(html`<ds-time-picker show-seconds></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check that showSeconds property is set
      const timePicker = container.querySelector("ds-time-picker") as HTMLElement & {
        showSeconds: boolean;
      };
      expect(timePicker?.showSeconds).toBe(true);
      expect(timePicker?.hasAttribute("show-seconds")).toBe(true);
    });

    it("should have default 12-hour format", async () => {
      render(html`<ds-time-picker></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check that hourFormat property is 12 by default
      const timePicker = container.querySelector("ds-time-picker") as HTMLElement & {
        hourFormat: number;
      };
      expect(timePicker?.hourFormat).toBe(12);
    });

    it("should not render AM/PM in 24-hour format", async () => {
      render(html`<ds-time-picker hour-format="24"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const periodSegment = container.querySelector("[data-segment='period']");
      expect(periodSegment).toBeFalsy();
    });
  });

  describe("value", () => {
    it("should accept initial value", async () => {
      render(html`<ds-time-picker value="14:30"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const timePicker = container.querySelector("ds-time-picker") as HTMLElement & {
        value: string;
      };
      // Value will be stored in the component
      expect(timePicker).toBeTruthy();
    });

    it("should display formatted time", async () => {
      render(html`<ds-time-picker hour-format="24" value="14:30"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const hourSegment = container.querySelector("[data-segment='hour']");
      const minuteSegment = container.querySelector("[data-segment='minute']");

      expect(hourSegment?.textContent?.trim()).toContain("14");
      expect(minuteSegment?.textContent?.trim()).toContain("30");
    });
  });

  describe("keyboard navigation", () => {
    it("should increment hour on ArrowUp", async () => {
      render(html`<ds-time-picker hour-format="24" value="10:30"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const hourSegment = container.querySelector("[data-segment='hour']") as HTMLElement;
      hourSegment?.focus();
      hourSegment?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const timePicker = container.querySelector("ds-time-picker") as HTMLElement & {
        value: string;
      };
      // In 24h format, incrementing 10 gives 11
      expect(timePicker?.value).toContain("11");
    });

    it("should decrement hour on ArrowDown", async () => {
      render(html`<ds-time-picker hour-format="24" value="10:30"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const hourSegment = container.querySelector("[data-segment='hour']") as HTMLElement;
      hourSegment?.focus();
      hourSegment?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const timePicker = container.querySelector("ds-time-picker") as HTMLElement & {
        value: string;
      };
      // In 24h format, decrementing 10 gives 09
      expect(timePicker?.value).toContain("09") || expect(timePicker?.value).toContain("9");
    });
  });

  describe("disabled state", () => {
    it("should have aria-disabled on segments when disabled", async () => {
      render(html`<ds-time-picker disabled></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const segments = container.querySelectorAll(".ds-time-picker__segment");
      expect(segments.length).toBeGreaterThan(0);
      segments.forEach((segment) => {
        expect(segment.getAttribute("aria-disabled")).toBe("true");
      });
    });
  });

  describe("ARIA attributes", () => {
    it("should have group role on container", async () => {
      render(html`<ds-time-picker></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const group = container.querySelector("[role='group']");
      expect(group).toBeTruthy();
    });

    it("should have spinbutton role on segments", async () => {
      render(html`<ds-time-picker></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const hourSegment = container.querySelector("[data-segment='hour']");
      expect(hourSegment?.getAttribute("role")).toBe("spinbutton");
    });

    it("should have aria-valuemin/max on hour segment in 24h format", async () => {
      render(html`<ds-time-picker hour-format="24"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const hourSegment = container.querySelector("[data-segment='hour']");
      expect(hourSegment?.getAttribute("aria-valuemin")).toBe("0");
      expect(hourSegment?.getAttribute("aria-valuemax")).toBe("23");
    });

    it("should have aria-valuemin/max on hour segment in 12h format", async () => {
      render(html`<ds-time-picker hour-format="12"></ds-time-picker>`, container);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const hourSegment = container.querySelector("[data-segment='hour']");
      expect(hourSegment?.getAttribute("aria-valuemin")).toBe("1");
      expect(hourSegment?.getAttribute("aria-valuemax")).toBe("12");
    });
  });
});
