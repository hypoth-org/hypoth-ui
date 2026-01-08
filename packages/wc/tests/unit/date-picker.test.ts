import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../src/components/date-picker/index.js";
import {
  formatTypedDate,
  getDateFormat,
  getDateFormatPlaceholder,
  parseTypedDate,
  validateTypedDate,
} from "../../src/components/date-picker/date-utils.js";

describe("DsDatePicker", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("should render date picker with trigger slot", async () => {
      render(
        html`
          <ds-date-picker>
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector("[slot='trigger']");
      expect(trigger).toBeTruthy();
    });

    it("should render calendar when provided", async () => {
      render(
        html`
          <ds-date-picker>
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const calendar = container.querySelector("ds-date-picker-calendar");
      expect(calendar).toBeTruthy();
    });

    it("should have open property defaulting to false", async () => {
      render(
        html`
          <ds-date-picker>
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        open: boolean;
      };
      expect(datePicker?.open).toBe(false);
    });
  });

  describe("opening and closing", () => {
    it("should open on trigger click", async () => {
      render(
        html`
          <ds-date-picker>
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector("[slot='trigger']") as HTMLElement;
      trigger?.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        open: boolean;
      };
      expect(datePicker?.open).toBe(true);
    });

    it("should expose show method", async () => {
      render(
        html`
          <ds-date-picker>
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        show: () => void;
        open: boolean;
      };

      datePicker.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(datePicker.open).toBe(true);
    });

    it("should expose close method", async () => {
      render(
        html`
          <ds-date-picker open>
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        close: () => void;
        open: boolean;
      };

      datePicker.close();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(datePicker.open).toBe(false);
    });

    it("should expose toggle method", async () => {
      render(
        html`
          <ds-date-picker>
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        toggle: () => void;
        open: boolean;
      };

      expect(datePicker.open).toBe(false);
      datePicker.toggle();
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(datePicker.open).toBe(true);
    });
  });

  describe("value", () => {
    it("should accept initial value", async () => {
      render(
        html`
          <ds-date-picker value="2024-06-15">
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        value: string;
      };
      expect(datePicker?.value).toBe("2024-06-15");
    });

    it("should expose setDate method", async () => {
      render(
        html`
          <ds-date-picker>
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        setDate: (date: string) => void;
        value: string;
      };

      datePicker.setDate("2024-07-20");
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(datePicker.value).toBe("2024-07-20");
    });

    it("should expose clear method", async () => {
      render(
        html`
          <ds-date-picker value="2024-06-15">
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        clear: () => void;
        value: string;
      };

      datePicker.clear();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(datePicker.value).toBe("");
    });
  });

  describe("range mode", () => {
    it("should support range mode", async () => {
      render(
        html`
          <ds-date-picker mode="range">
            <button slot="trigger">Select range</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        mode: string;
      };
      expect(datePicker?.mode).toBe("range");
    });

    it("should expose setRange method", async () => {
      render(
        html`
          <ds-date-picker mode="range">
            <button slot="trigger">Select range</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        setRange: (start: string, end: string) => void;
        rangeStart: string;
        rangeEnd: string;
      };

      datePicker.setRange("2024-06-01", "2024-06-15");
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(datePicker.rangeStart).toBe("2024-06-01");
      expect(datePicker.rangeEnd).toBe("2024-06-15");
    });
  });

  describe("disabled state", () => {
    it("should not open when disabled", async () => {
      render(
        html`
          <ds-date-picker disabled>
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector("[slot='trigger']") as HTMLElement;
      trigger?.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        open: boolean;
      };
      expect(datePicker?.open).toBe(false);
    });

    it("should have disabled attribute reflected", async () => {
      render(
        html`
          <ds-date-picker disabled>
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker");
      expect(datePicker?.hasAttribute("disabled")).toBe(true);
    });
  });

  describe("min/max constraints", () => {
    it("should accept min-date attribute", async () => {
      render(
        html`
          <ds-date-picker min-date="2024-01-01">
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        minDate: string;
      };
      expect(datePicker?.minDate).toBe("2024-01-01");
    });

    it("should accept max-date attribute", async () => {
      render(
        html`
          <ds-date-picker max-date="2024-12-31">
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        maxDate: string;
      };
      expect(datePicker?.maxDate).toBe("2024-12-31");
    });
  });

  describe("events", () => {
    it("should emit ds:open event when opened", async () => {
      const openHandler = vi.fn();
      render(
        html`
          <ds-date-picker @ds:open=${openHandler}>
            <button slot="trigger">Select date</button>
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const trigger = container.querySelector("[slot='trigger']") as HTMLElement;
      trigger?.click();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(openHandler).toHaveBeenCalled();
    });
  });

  describe("typed input", () => {
    it("should support typed-input attribute", async () => {
      render(
        html`
          <ds-date-picker typed-input locale="en-US">
            <input slot="trigger" type="text" />
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        typedInput: boolean;
      };
      expect(datePicker?.typedInput).toBe(true);
    });

    it("should expose getFormatPlaceholder method", async () => {
      render(
        html`
          <ds-date-picker typed-input locale="en-US">
            <input slot="trigger" type="text" />
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        getFormatPlaceholder: () => string;
      };
      expect(datePicker?.getFormatPlaceholder()).toBe("MM/DD/YYYY");
    });

    it("should expose parseInput method", async () => {
      render(
        html`
          <ds-date-picker typed-input locale="en-US">
            <input slot="trigger" type="text" />
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        parseInput: (input: string) => { valid: boolean; date: string | null };
      };

      const result = datePicker?.parseInput("01/15/2024");
      expect(result?.valid).toBe(true);
      expect(result?.date).toBe("2024-01-15");
    });

    it("should return error for invalid input", async () => {
      render(
        html`
          <ds-date-picker typed-input locale="en-US">
            <input slot="trigger" type="text" />
            <ds-date-picker-calendar></ds-date-picker-calendar>
          </ds-date-picker>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const datePicker = container.querySelector("ds-date-picker") as HTMLElement & {
        parseInput: (input: string) => { valid: boolean; error: string | null };
      };

      const result = datePicker?.parseInput("invalid-date");
      expect(result?.valid).toBe(false);
      expect(result?.error).toContain("Invalid");
    });
  });
});

describe("Date Format Utilities - Locale Support", () => {
  describe("getDateFormat", () => {
    it("should return MM/dd/yyyy for en-US", () => {
      expect(getDateFormat("en-US")).toBe("MM/dd/yyyy");
    });

    it("should return dd/MM/yyyy for en-GB", () => {
      expect(getDateFormat("en-GB")).toBe("dd/MM/yyyy");
    });

    it("should return dd.MM.yyyy for de-DE", () => {
      expect(getDateFormat("de-DE")).toBe("dd.MM.yyyy");
    });

    it("should return dd/MM/yyyy for fr-FR", () => {
      expect(getDateFormat("fr-FR")).toBe("dd/MM/yyyy");
    });

    it("should return dd/MM/yyyy for es-ES", () => {
      expect(getDateFormat("es-ES")).toBe("dd/MM/yyyy");
    });

    it("should return yyyy/MM/dd for ja-JP", () => {
      expect(getDateFormat("ja-JP")).toBe("yyyy/MM/dd");
    });

    it("should return default for unknown locale", () => {
      expect(getDateFormat("xx-XX")).toBe("MM/dd/yyyy");
    });
  });

  describe("getDateFormatPlaceholder", () => {
    it("should return MM/DD/YYYY for en-US", () => {
      expect(getDateFormatPlaceholder("en-US")).toBe("MM/DD/YYYY");
    });

    it("should return DD/MM/YYYY for en-GB", () => {
      expect(getDateFormatPlaceholder("en-GB")).toBe("DD/MM/YYYY");
    });

    it("should return DD.MM.YYYY for de-DE", () => {
      expect(getDateFormatPlaceholder("de-DE")).toBe("DD.MM.YYYY");
    });

    it("should return YYYY/MM/DD for ja-JP", () => {
      expect(getDateFormatPlaceholder("ja-JP")).toBe("YYYY/MM/DD");
    });
  });

  describe("parseTypedDate - en-US format (MM/dd/yyyy)", () => {
    const locale = "en-US";

    it("should parse valid date", () => {
      const result = parseTypedDate("01/15/2024", locale);
      expect(result.valid).toBe(true);
      expect(result.date).toBe("2024-01-15");
    });

    it("should parse date with different separators", () => {
      const result1 = parseTypedDate("01-15-2024", locale);
      expect(result1.valid).toBe(true);
      expect(result1.date).toBe("2024-01-15");

      const result2 = parseTypedDate("01.15.2024", locale);
      expect(result2.valid).toBe(true);
      expect(result2.date).toBe("2024-01-15");
    });

    it("should parse ISO format as fallback", () => {
      const result = parseTypedDate("2024-01-15", locale);
      expect(result.valid).toBe(true);
      expect(result.date).toBe("2024-01-15");
    });

    it("should return error for invalid date", () => {
      const result = parseTypedDate("invalid", locale);
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it("should handle empty input", () => {
      const result = parseTypedDate("", locale);
      expect(result.valid).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe("parseTypedDate - de-DE format (dd.MM.yyyy)", () => {
    const locale = "de-DE";

    it("should parse valid date", () => {
      const result = parseTypedDate("15.01.2024", locale);
      expect(result.valid).toBe(true);
      expect(result.date).toBe("2024-01-15");
    });

    it("should parse date with different separators", () => {
      const result = parseTypedDate("15/01/2024", locale);
      expect(result.valid).toBe(true);
      expect(result.date).toBe("2024-01-15");
    });
  });

  describe("parseTypedDate - fr-FR format (dd/MM/yyyy)", () => {
    const locale = "fr-FR";

    it("should parse valid date", () => {
      const result = parseTypedDate("15/01/2024", locale);
      expect(result.valid).toBe(true);
      expect(result.date).toBe("2024-01-15");
    });
  });

  describe("parseTypedDate - es-ES format (dd/MM/yyyy)", () => {
    const locale = "es-ES";

    it("should parse valid date", () => {
      const result = parseTypedDate("15/01/2024", locale);
      expect(result.valid).toBe(true);
      expect(result.date).toBe("2024-01-15");
    });
  });

  describe("parseTypedDate - ja-JP format (yyyy/MM/dd)", () => {
    const locale = "ja-JP";

    it("should parse valid date", () => {
      const result = parseTypedDate("2024/01/15", locale);
      expect(result.valid).toBe(true);
      expect(result.date).toBe("2024-01-15");
    });

    it("should parse date with different separators", () => {
      const result = parseTypedDate("2024-01-15", locale);
      expect(result.valid).toBe(true);
      expect(result.date).toBe("2024-01-15");
    });
  });

  describe("formatTypedDate", () => {
    it("should format date for en-US", () => {
      expect(formatTypedDate("2024-01-15", "en-US")).toBe("01/15/2024");
    });

    it("should format date for de-DE", () => {
      expect(formatTypedDate("2024-01-15", "de-DE")).toBe("15.01.2024");
    });

    it("should format date for fr-FR", () => {
      expect(formatTypedDate("2024-01-15", "fr-FR")).toBe("15/01/2024");
    });

    it("should format date for es-ES", () => {
      expect(formatTypedDate("2024-01-15", "es-ES")).toBe("15/01/2024");
    });

    it("should format date for ja-JP", () => {
      expect(formatTypedDate("2024-01-15", "ja-JP")).toBe("2024/01/15");
    });

    it("should return empty string for empty input", () => {
      expect(formatTypedDate("", "en-US")).toBe("");
    });

    it("should return empty string for invalid date", () => {
      expect(formatTypedDate("invalid", "en-US")).toBe("");
    });
  });

  describe("validateTypedDate", () => {
    const locale = "en-US";

    it("should pass validation for valid date in range", () => {
      const result = validateTypedDate("2024-06-15", "2024-01-01", "2024-12-31", locale);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should fail validation for date before min", () => {
      const result = validateTypedDate("2023-12-15", "2024-01-01", "2024-12-31", locale);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("on or after");
    });

    it("should fail validation for date after max", () => {
      const result = validateTypedDate("2025-01-15", "2024-01-01", "2024-12-31", locale);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("on or before");
    });

    it("should pass validation for date on min boundary", () => {
      const result = validateTypedDate("2024-01-01", "2024-01-01", "2024-12-31", locale);
      expect(result.valid).toBe(true);
    });

    it("should pass validation for date on max boundary", () => {
      const result = validateTypedDate("2024-12-31", "2024-01-01", "2024-12-31", locale);
      expect(result.valid).toBe(true);
    });

    it("should pass validation when no constraints", () => {
      const result = validateTypedDate("2024-06-15", undefined, undefined, locale);
      expect(result.valid).toBe(true);
    });
  });
});
