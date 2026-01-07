/**
 * Slider behavior primitive.
 * Manages slider thumb dragging, keyboard control, range constraints, and ARIA state.
 */

// =============================================================================
// Types
// =============================================================================

export type ThumbType = "min" | "max" | "single";

export interface SliderBehaviorOptions {
  /** Initial value (single mode) */
  defaultValue?: number;
  /** Initial range (range mode) */
  defaultRange?: { min: number; max: number };
  /** Called on value change */
  onValueChange?: (value: number) => void;
  /** Called on range change */
  onRangeChange?: (range: { min: number; max: number }) => void;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Large step (Page Up/Down) */
  largeStep?: number;
  /** Range mode (two thumbs) */
  range?: boolean;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Disabled state */
  disabled?: boolean;
  /** Custom ID generator */
  generateId?: () => string;
}

export interface SliderBehaviorState {
  value: number;
  rangeValue: { min: number; max: number };
  min: number;
  max: number;
  step: number;
  draggingThumb: ThumbType | null;
  focusedThumb: ThumbType | null;
  range: boolean;
  orientation: "horizontal" | "vertical";
  disabled: boolean;
}

export interface SliderThumbProps {
  role: "slider";
  tabIndex: number;
  "aria-valuemin": number;
  "aria-valuemax": number;
  "aria-valuenow": number;
  "aria-valuetext"?: string;
  "aria-orientation": "horizontal" | "vertical";
  "aria-disabled"?: boolean;
  "aria-controls"?: string;
}

export interface SliderTrackProps {
  role: "none";
}

export interface SliderBehavior {
  /** Current state */
  readonly state: SliderBehaviorState;
  /** Min thumb ID */
  readonly minThumbId: string;
  /** Max thumb ID */
  readonly maxThumbId: string;
  /** Track element reference (for drag calculations) */
  trackElement: HTMLElement | null;

  /** Start drag on thumb */
  startDrag(thumb: ThumbType, event: PointerEvent): void;

  /** Update during drag */
  drag(event: PointerEvent): void;

  /** End drag */
  endDrag(): void;

  /** Increment value by step */
  increment(thumb: ThumbType, large?: boolean): void;

  /** Decrement value by step */
  decrement(thumb: ThumbType, large?: boolean): void;

  /** Set to minimum */
  setToMin(thumb: ThumbType): void;

  /** Set to maximum */
  setToMax(thumb: ThumbType): void;

  /** Set focus on thumb */
  focus(thumb: ThumbType): void;

  /** Clear focus */
  blur(): void;

  /** Get ARIA props for thumb */
  getThumbProps(thumb: ThumbType): SliderThumbProps;

  /** Get ARIA props for track */
  getTrackProps(): SliderTrackProps;

  /** Convert value to percentage (0-100) */
  valueToPercent(value: number): number;

  /** Convert percentage to value */
  percentToValue(percent: number): number;

  /** Cleanup */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

let idCounter = 0;

function defaultGenerateId(): string {
  return `slider-${++idCounter}`;
}

/**
 * Clamps a value between min and max.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a value to the nearest step.
 */
function roundToStep(value: number, step: number, min: number): number {
  const steps = Math.round((value - min) / step);
  return min + steps * step;
}

/**
 * Creates a slider behavior primitive.
 *
 * @example
 * ```ts
 * // Single value slider
 * const slider = createSliderBehavior({
 *   min: 0,
 *   max: 100,
 *   step: 1,
 *   onValueChange: (value) => console.log('Value:', value),
 * });
 *
 * // Range slider
 * const rangeSlider = createSliderBehavior({
 *   range: true,
 *   min: 0,
 *   max: 1000,
 *   step: 10,
 *   onRangeChange: ({ min, max }) => console.log(`${min} - ${max}`),
 * });
 * ```
 */
export function createSliderBehavior(options: SliderBehaviorOptions = {}): SliderBehavior {
  const {
    defaultValue = 0,
    defaultRange = { min: 0, max: 100 },
    onValueChange,
    onRangeChange,
    min = 0,
    max = 100,
    step = 1,
    largeStep = step * 10,
    range = false,
    orientation = "horizontal",
    disabled = false,
    generateId = defaultGenerateId,
  } = options;

  // Generate stable IDs
  const baseId = generateId();
  const minThumbId = `${baseId}-min-thumb`;
  const maxThumbId = `${baseId}-max-thumb`;

  // Internal state
  let state: SliderBehaviorState = {
    value: clamp(roundToStep(defaultValue, step, min), min, max),
    rangeValue: {
      min: clamp(roundToStep(defaultRange.min, step, min), min, max),
      max: clamp(roundToStep(defaultRange.max, step, min), min, max),
    },
    min,
    max,
    step,
    draggingThumb: null,
    focusedThumb: null,
    range,
    orientation,
    disabled,
  };

  // Track element reference for drag calculations
  let trackElement: HTMLElement | null = null;

  // Helpers
  function valueToPercent(value: number): number {
    if (state.max === state.min) return 0;
    return ((value - state.min) / (state.max - state.min)) * 100;
  }

  function percentToValue(percent: number): number {
    const raw = (percent / 100) * (state.max - state.min) + state.min;
    return roundToStep(clamp(raw, state.min, state.max), state.step, state.min);
  }

  function getThumbValue(thumb: ThumbType): number {
    if (thumb === "single") return state.value;
    return state.rangeValue[thumb];
  }

  function setThumbValue(thumb: ThumbType, value: number): void {
    const clampedValue = clamp(roundToStep(value, state.step, state.min), state.min, state.max);

    if (thumb === "single") {
      if (state.value === clampedValue) return;
      state = { ...state, value: clampedValue };
      onValueChange?.(clampedValue);
    } else {
      // Range mode - prevent thumbs from crossing
      const newRange = { ...state.rangeValue };

      if (thumb === "min") {
        newRange.min = Math.min(clampedValue, state.rangeValue.max);
      } else {
        newRange.max = Math.max(clampedValue, state.rangeValue.min);
      }

      if (newRange.min === state.rangeValue.min && newRange.max === state.rangeValue.max) return;

      state = { ...state, rangeValue: newRange };
      onRangeChange?.(newRange);
    }
  }

  function getPointerPercent(event: PointerEvent): number {
    if (!trackElement) return 0;

    const rect = trackElement.getBoundingClientRect();

    if (state.orientation === "horizontal") {
      const x = event.clientX - rect.left;
      return clamp((x / rect.width) * 100, 0, 100);
    }

    // Vertical: top is max, bottom is min (inverted)
    const y = event.clientY - rect.top;
    return clamp(100 - (y / rect.height) * 100, 0, 100);
  }

  // Public API
  function startDrag(thumb: ThumbType, event: PointerEvent): void {
    if (state.disabled) return;
    event.preventDefault();

    state = { ...state, draggingThumb: thumb };

    // Set value based on pointer position
    const percent = getPointerPercent(event);
    const value = percentToValue(percent);
    setThumbValue(thumb, value);
  }

  function drag(event: PointerEvent): void {
    if (!state.draggingThumb || state.disabled) return;

    const percent = getPointerPercent(event);
    const value = percentToValue(percent);
    setThumbValue(state.draggingThumb, value);
  }

  function endDrag(): void {
    state = { ...state, draggingThumb: null };
  }

  function increment(thumb: ThumbType, large = false): void {
    if (state.disabled) return;
    const currentValue = getThumbValue(thumb);
    const stepSize = large ? largeStep : state.step;
    setThumbValue(thumb, currentValue + stepSize);
  }

  function decrement(thumb: ThumbType, large = false): void {
    if (state.disabled) return;
    const currentValue = getThumbValue(thumb);
    const stepSize = large ? largeStep : state.step;
    setThumbValue(thumb, currentValue - stepSize);
  }

  function setToMin(thumb: ThumbType): void {
    if (state.disabled) return;
    setThumbValue(thumb, state.min);
  }

  function setToMax(thumb: ThumbType): void {
    if (state.disabled) return;
    setThumbValue(thumb, state.max);
  }

  function focus(thumb: ThumbType): void {
    state = { ...state, focusedThumb: thumb };
  }

  function blur(): void {
    state = { ...state, focusedThumb: null };
  }

  function getThumbProps(thumb: ThumbType): SliderThumbProps {
    const value = getThumbValue(thumb);
    const isRange = state.range;

    // Determine value constraints for range mode
    let valueMin = state.min;
    let valueMax = state.max;

    if (isRange) {
      if (thumb === "min") {
        valueMax = state.rangeValue.max;
      } else if (thumb === "max") {
        valueMin = state.rangeValue.min;
      }
    }

    // Build props
    const props: SliderThumbProps = {
      role: "slider",
      tabIndex: state.disabled ? -1 : 0,
      "aria-valuemin": valueMin,
      "aria-valuemax": valueMax,
      "aria-valuenow": value,
      "aria-orientation": state.orientation,
    };

    if (state.disabled) {
      props["aria-disabled"] = true;
    }

    // Link thumbs in range mode
    if (isRange) {
      props["aria-controls"] = thumb === "min" ? maxThumbId : minThumbId;
    }

    return props;
  }

  function getTrackProps(): SliderTrackProps {
    return {
      role: "none",
    };
  }

  function destroy(): void {
    trackElement = null;
  }

  return {
    get state() {
      return state;
    },
    get minThumbId() {
      return minThumbId;
    },
    get maxThumbId() {
      return maxThumbId;
    },
    get trackElement() {
      return trackElement;
    },
    set trackElement(element: HTMLElement | null) {
      trackElement = element;
    },
    startDrag,
    drag,
    endDrag,
    increment,
    decrement,
    setToMin,
    setToMax,
    focus,
    blur,
    getThumbProps,
    getTrackProps,
    valueToPercent,
    percentToValue,
    destroy,
  };
}
