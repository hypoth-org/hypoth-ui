import { describe, expect, it, vi } from "vitest";
import { createSliderBehavior } from "../../src/behavior/slider";

describe("createSliderBehavior", () => {
  describe("initialization", () => {
    it("should create slider with default values", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
      });

      expect(slider.state.value).toBe(0);
      expect(slider.state.min).toBe(0);
      expect(slider.state.max).toBe(100);

      slider.destroy();
    });

    it("should accept default value", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        defaultValue: 50,
      });

      expect(slider.state.value).toBe(50);

      slider.destroy();
    });

    it("should clamp default value to min/max", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        defaultValue: 150,
      });

      expect(slider.state.value).toBe(100);

      slider.destroy();
    });

    it("should support range mode", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        range: true,
        defaultRange: { min: 20, max: 80 },
      });

      expect(slider.state.rangeValue).toEqual({ min: 20, max: 80 });

      slider.destroy();
    });
  });

  describe("keyboard navigation", () => {
    it("should increment by step on ArrowRight/ArrowUp", () => {
      const onValueChange = vi.fn();
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        step: 10,
        defaultValue: 50,
        onValueChange,
      });

      slider.increment("single");

      expect(slider.state.value).toBe(60);
      expect(onValueChange).toHaveBeenCalledWith(60);

      slider.destroy();
    });

    it("should decrement by step on ArrowLeft/ArrowDown", () => {
      const onValueChange = vi.fn();
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        step: 10,
        defaultValue: 50,
        onValueChange,
      });

      slider.decrement("single");

      expect(slider.state.value).toBe(40);
      expect(onValueChange).toHaveBeenCalledWith(40);

      slider.destroy();
    });

    it("should jump by large step on PageUp", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
      });

      slider.increment("single", true);

      expect(slider.state.value).toBe(60); // 10% of range (largeStep default is step * 10)

      slider.destroy();
    });

    it("should jump by large step on PageDown", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
      });

      slider.decrement("single", true);

      expect(slider.state.value).toBe(40);

      slider.destroy();
    });

    it("should go to min on Home", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        defaultValue: 50,
      });

      slider.setToMin("single");

      expect(slider.state.value).toBe(0);

      slider.destroy();
    });

    it("should go to max on End", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        defaultValue: 50,
      });

      slider.setToMax("single");

      expect(slider.state.value).toBe(100);

      slider.destroy();
    });

    it("should clamp value to min", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        step: 10,
        defaultValue: 5,
      });

      slider.decrement("single");

      expect(slider.state.value).toBe(0);

      slider.destroy();
    });

    it("should clamp value to max", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        step: 10,
        defaultValue: 95,
      });

      slider.increment("single");

      expect(slider.state.value).toBe(100);

      slider.destroy();
    });
  });

  describe("range mode", () => {
    it("should increment min thumb in range mode", () => {
      const onRangeChange = vi.fn();
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        range: true,
        step: 10,
        defaultRange: { min: 20, max: 80 },
        onRangeChange,
      });

      slider.increment("min");

      expect(slider.state.rangeValue).toEqual({ min: 30, max: 80 });
      expect(onRangeChange).toHaveBeenCalledWith({ min: 30, max: 80 });

      slider.destroy();
    });

    it("should increment max thumb in range mode", () => {
      const onRangeChange = vi.fn();
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        range: true,
        step: 10,
        defaultRange: { min: 20, max: 80 },
        onRangeChange,
      });

      slider.increment("max");

      expect(slider.state.rangeValue).toEqual({ min: 20, max: 90 });
      expect(onRangeChange).toHaveBeenCalledWith({ min: 20, max: 90 });

      slider.destroy();
    });

    it("should prevent thumbs from crossing", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        range: true,
        step: 10,
        defaultRange: { min: 70, max: 80 },
      });

      // Try to increment min past max
      slider.increment("min");
      slider.increment("min");
      slider.increment("min");

      expect(slider.state.rangeValue.min).toBeLessThanOrEqual(slider.state.rangeValue.max);

      slider.destroy();
    });

    it("should decrement specific thumb", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        range: true,
        step: 10,
        defaultRange: { min: 20, max: 80 },
      });

      slider.decrement("max");

      expect(slider.state.rangeValue).toEqual({ min: 20, max: 70 });

      slider.destroy();
    });
  });

  describe("percentage calculations", () => {
    it("should calculate percentage from value", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        defaultValue: 50,
      });

      expect(slider.valueToPercent(50)).toBe(50);

      slider.destroy();
    });

    it("should handle non-zero min", () => {
      const slider = createSliderBehavior({
        min: 50,
        max: 150,
        defaultValue: 100,
      });

      expect(slider.valueToPercent(100)).toBe(50);

      slider.destroy();
    });

    it("should convert percentage to value", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
      });

      expect(slider.percentToValue(75)).toBe(75);

      slider.destroy();
    });
  });

  describe("ARIA props", () => {
    it("should return correct track props", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
      });

      const props = slider.getTrackProps();

      expect(props.role).toBe("none");

      slider.destroy();
    });

    it("should return correct thumb props", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        defaultValue: 50,
      });

      const props = slider.getThumbProps("single");

      expect(props.role).toBe("slider");
      expect(props["aria-valuemin"]).toBe(0);
      expect(props["aria-valuemax"]).toBe(100);
      expect(props["aria-valuenow"]).toBe(50);
      expect(props.tabIndex).toBe(0);

      slider.destroy();
    });

    it("should return correct thumb props for range mode", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        range: true,
        defaultRange: { min: 20, max: 80 },
      });

      const minProps = slider.getThumbProps("min");
      const maxProps = slider.getThumbProps("max");

      expect(minProps["aria-valuenow"]).toBe(20);
      expect(minProps["aria-valuemax"]).toBe(80); // constrained by max thumb
      expect(maxProps["aria-valuenow"]).toBe(80);
      expect(maxProps["aria-valuemin"]).toBe(20); // constrained by min thumb

      slider.destroy();
    });
  });

  describe("disabled state", () => {
    it("should not change value when disabled", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        defaultValue: 50,
        disabled: true,
      });

      slider.increment("single");

      expect(slider.state.value).toBe(50);

      slider.destroy();
    });

    it("should not decrement when disabled", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        defaultValue: 50,
        disabled: true,
      });

      slider.decrement("single");

      expect(slider.state.value).toBe(50);

      slider.destroy();
    });

    it("should not set to min when disabled", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        defaultValue: 50,
        disabled: true,
      });

      slider.setToMin("single");

      expect(slider.state.value).toBe(50);

      slider.destroy();
    });
  });

  describe("orientation", () => {
    it("should support horizontal orientation", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        orientation: "horizontal",
      });

      expect(slider.state.orientation).toBe("horizontal");

      slider.destroy();
    });

    it("should support vertical orientation", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        orientation: "vertical",
      });

      expect(slider.state.orientation).toBe("vertical");

      slider.destroy();
    });
  });

  describe("focus management", () => {
    it("should track focused thumb", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
      });

      slider.focus("single");

      expect(slider.state.focusedThumb).toBe("single");

      slider.destroy();
    });

    it("should clear focus on blur", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
      });

      slider.focus("single");
      slider.blur();

      expect(slider.state.focusedThumb).toBeNull();

      slider.destroy();
    });
  });
});
