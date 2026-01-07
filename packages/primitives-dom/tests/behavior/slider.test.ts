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
        defaultValue: [20, 80],
      });

      expect(slider.state.values).toEqual([20, 80]);

      slider.destroy();
    });
  });

  describe("value changes", () => {
    it("should update value", () => {
      const onValueChange = vi.fn();
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        onValueChange,
      });

      slider.setValue(50);

      expect(slider.state.value).toBe(50);
      expect(onValueChange).toHaveBeenCalledWith(50);

      slider.destroy();
    });

    it("should clamp value to min", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
      });

      slider.setValue(-10);

      expect(slider.state.value).toBe(0);

      slider.destroy();
    });

    it("should clamp value to max", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
      });

      slider.setValue(150);

      expect(slider.state.value).toBe(100);

      slider.destroy();
    });

    it("should snap to step", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        step: 10,
      });

      slider.setValue(23);

      expect(slider.state.value).toBe(20);

      slider.destroy();
    });

    it("should round to nearest step", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        step: 10,
      });

      slider.setValue(27);

      expect(slider.state.value).toBe(30);

      slider.destroy();
    });
  });

  describe("keyboard navigation", () => {
    it("should increment by step on ArrowRight/ArrowUp", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        step: 10,
        defaultValue: 50,
      });

      slider.increment();

      expect(slider.state.value).toBe(60);

      slider.destroy();
    });

    it("should decrement by step on ArrowLeft/ArrowDown", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        step: 10,
        defaultValue: 50,
      });

      slider.decrement();

      expect(slider.state.value).toBe(40);

      slider.destroy();
    });

    it("should jump by large step on PageUp", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
      });

      slider.incrementLarge();

      expect(slider.state.value).toBe(60); // 10% of range

      slider.destroy();
    });

    it("should jump by large step on PageDown", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
      });

      slider.decrementLarge();

      expect(slider.state.value).toBe(40);

      slider.destroy();
    });

    it("should go to min on Home", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        defaultValue: 50,
      });

      slider.setToMin();

      expect(slider.state.value).toBe(0);

      slider.destroy();
    });

    it("should go to max on End", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        defaultValue: 50,
      });

      slider.setToMax();

      expect(slider.state.value).toBe(100);

      slider.destroy();
    });
  });

  describe("range mode", () => {
    it("should update specific thumb in range mode", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        range: true,
        defaultValue: [20, 80],
      });

      slider.setValueAtIndex(0, 30);

      expect(slider.state.values).toEqual([30, 80]);

      slider.destroy();
    });

    it("should prevent thumbs from crossing", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        range: true,
        defaultValue: [20, 80],
      });

      slider.setValueAtIndex(0, 90);

      expect(slider.state.values?.[0]).toBeLessThanOrEqual(slider.state.values?.[1] ?? 0);

      slider.destroy();
    });

    it("should increment specific thumb", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        range: true,
        step: 10,
        defaultValue: [20, 80],
      });

      slider.incrementAtIndex(0);

      expect(slider.state.values).toEqual([30, 80]);

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

      expect(slider.getPercentage()).toBe(50);

      slider.destroy();
    });

    it("should handle non-zero min", () => {
      const slider = createSliderBehavior({
        min: 50,
        max: 150,
        defaultValue: 100,
      });

      expect(slider.getPercentage()).toBe(50);

      slider.destroy();
    });

    it("should set value from percentage", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
      });

      slider.setFromPercentage(75);

      expect(slider.state.value).toBe(75);

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

      expect(props.role).toBe("presentation");

      slider.destroy();
    });

    it("should return correct thumb props", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        defaultValue: 50,
      });

      const props = slider.getThumbProps();

      expect(props.role).toBe("slider");
      expect(props["aria-valuemin"]).toBe(0);
      expect(props["aria-valuemax"]).toBe(100);
      expect(props["aria-valuenow"]).toBe(50);
      expect(props.tabIndex).toBe(0);

      slider.destroy();
    });

    it("should format value text", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        defaultValue: 50,
        formatValue: (v) => `$${v}`,
      });

      const props = slider.getThumbProps();

      expect(props["aria-valuetext"]).toBe("$50");

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

      slider.setValue(75);

      expect(slider.state.value).toBe(50);

      slider.destroy();
    });

    it("should not increment when disabled", () => {
      const slider = createSliderBehavior({
        min: 0,
        max: 100,
        defaultValue: 50,
        disabled: true,
      });

      slider.increment();

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
});
