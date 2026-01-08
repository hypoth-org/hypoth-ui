/**
 * Slider context for compound component pattern.
 */

import type { SliderBehavior } from "@ds/primitives-dom";
import { createCompoundContext } from "../../utils/create-context.js";

export interface SliderContextValue {
  /** Slider behavior instance */
  behavior: SliderBehavior;
  /** Current value (single mode) */
  value: number;
  /** Set value (single mode) */
  setValue: (value: number) => void;
  /** Range values */
  rangeValue: { min: number; max: number };
  /** Set range values */
  setRangeValue: (range: { min: number; max: number }) => void;
  /** Whether in range mode */
  range: boolean;
  /** Min constraint */
  min: number;
  /** Max constraint */
  max: number;
  /** Step increment */
  step: number;
  /** Orientation */
  orientation: "horizontal" | "vertical";
  /** Disabled state */
  disabled: boolean;
  /** Value text formatter */
  formatValueText?: (value: number) => string;
}

export const [SliderProvider, useSliderContext] =
  createCompoundContext<SliderContextValue>("Slider");
