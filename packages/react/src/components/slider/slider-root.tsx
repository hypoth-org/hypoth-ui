/**
 * Slider Root component - provides context to all Slider compound components.
 */

import { createSliderBehavior } from "@ds/primitives-dom";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { SliderProvider } from "./slider-context.js";

export interface SliderRootProps {
  /** Slider content */
  children?: ReactNode;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Controlled value (single mode) */
  value?: number;
  /** Default value (single mode, uncontrolled) */
  defaultValue?: number;
  /** Called when value changes */
  onValueChange?: (value: number) => void;
  /** Range mode (two thumbs) */
  range?: boolean;
  /** Controlled range values */
  rangeValue?: { min: number; max: number };
  /** Default range values */
  defaultRangeValue?: { min: number; max: number };
  /** Called when range changes */
  onRangeChange?: (range: { min: number; max: number }) => void;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Disabled state */
  disabled?: boolean;
  /** Value text formatter for screen readers */
  formatValueText?: (value: number) => string;
}

/**
 * Root component for Slider compound pattern.
 * Provides context to Track, Thumb, and Range components.
 *
 * @example
 * ```tsx
 * // Single value slider
 * <Slider.Root onValueChange={(value) => console.log(value)}>
 *   <Slider.Track>
 *     <Slider.Range />
 *     <Slider.Thumb />
 *   </Slider.Track>
 * </Slider.Root>
 *
 * // Range slider
 * <Slider.Root range onRangeChange={(range) => console.log(range)}>
 *   <Slider.Track>
 *     <Slider.Range />
 *     <Slider.Thumb type="min" />
 *     <Slider.Thumb type="max" />
 *   </Slider.Track>
 * </Slider.Root>
 * ```
 */
export function SliderRoot({
  children,
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  range = false,
  rangeValue: controlledRangeValue,
  defaultRangeValue,
  onRangeChange,
  orientation = "horizontal",
  disabled = false,
  formatValueText,
}: SliderRootProps) {
  // Compute default range if not provided
  const defaultRange = defaultRangeValue ?? { min, max: Math.min(max, min + (max - min) / 2) };

  // Support controlled and uncontrolled modes for value
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isValueControlled = controlledValue !== undefined;
  const value = isValueControlled ? controlledValue : internalValue;

  // Support controlled and uncontrolled modes for range
  const [internalRangeValue, setInternalRangeValue] = useState(defaultRange);
  const isRangeControlled = controlledRangeValue !== undefined;
  const rangeValue = isRangeControlled ? controlledRangeValue : internalRangeValue;

  const setValue = useCallback(
    (nextValue: number) => {
      if (!isValueControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isValueControlled, onValueChange]
  );

  const setRangeValue = useCallback(
    (nextRange: { min: number; max: number }) => {
      if (!isRangeControlled) {
        setInternalRangeValue(nextRange);
      }
      onRangeChange?.(nextRange);
    },
    [isRangeControlled, onRangeChange]
  );

  // Create behavior instance
  // biome-ignore lint/correctness/useExhaustiveDependencies: behavior is created once
  const behavior = useMemo(
    () =>
      createSliderBehavior({
        min,
        max,
        step,
        defaultValue: value,
        defaultRange: rangeValue,
        range,
        orientation,
        disabled,
        onValueChange: setValue,
        onRangeChange: setRangeValue,
      }),
    []
  );

  const contextValue = useMemo(
    () => ({
      behavior,
      value,
      setValue,
      rangeValue,
      setRangeValue,
      range,
      min,
      max,
      step,
      orientation,
      disabled,
      formatValueText,
    }),
    [
      behavior,
      value,
      setValue,
      rangeValue,
      setRangeValue,
      range,
      min,
      max,
      step,
      orientation,
      disabled,
      formatValueText,
    ]
  );

  return <SliderProvider value={contextValue}>{children}</SliderProvider>;
}

SliderRoot.displayName = "Slider.Root";
