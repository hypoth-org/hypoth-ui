/**
 * TimePicker behavior primitive.
 * Manages time selection with segments (hours, minutes, seconds, period).
 */

// =============================================================================
// Types
// =============================================================================

export type TimeSegment = "hour" | "minute" | "second" | "period";

export interface TimeValue {
  hour: number;
  minute: number;
  second: number;
}

export interface TimePickerBehaviorOptions {
  /** Initial time value */
  defaultValue?: TimeValue;
  /** Called on value change */
  onValueChange?: (value: TimeValue) => void;
  /** 12-hour or 24-hour format */
  hourFormat?: 12 | 24;
  /** Show seconds */
  showSeconds?: boolean;
  /** Minute step */
  minuteStep?: number;
  /** Second step */
  secondStep?: number;
  /** Minimum time */
  minTime?: TimeValue;
  /** Maximum time */
  maxTime?: TimeValue;
  /** Disabled state */
  disabled?: boolean;
  /** Locale for formatting */
  locale?: string;
}

export interface TimePickerBehaviorState {
  value: TimeValue;
  focusedSegment: TimeSegment | null;
  hourFormat: 12 | 24;
  showSeconds: boolean;
  period: "AM" | "PM";
  disabled: boolean;
}

export interface TimeSegmentProps {
  role: "spinbutton";
  tabIndex: number;
  "aria-valuemin": number;
  "aria-valuemax": number;
  "aria-valuenow": number;
  "aria-valuetext": string;
  "aria-label": string;
  "aria-disabled"?: boolean;
}

export interface TimePickerBehavior {
  /** Current state */
  readonly state: TimePickerBehaviorState;

  /** Increment segment value */
  increment(segment: TimeSegment): void;

  /** Decrement segment value */
  decrement(segment: TimeSegment): void;

  /** Set segment value */
  setSegmentValue(segment: TimeSegment, value: number | string): void;

  /** Set full time value */
  setValue(value: TimeValue): void;

  /** Parse time from string */
  parseTime(input: string): TimeValue | null;

  /** Format time to string */
  formatTime(value?: TimeValue): string;

  /** Focus a segment */
  focusSegment(segment: TimeSegment): void;

  /** Focus next segment */
  focusNextSegment(): void;

  /** Focus previous segment */
  focusPreviousSegment(): void;

  /** Clear focus */
  blur(): void;

  /** Get segment props */
  getSegmentProps(segment: TimeSegment): TimeSegmentProps;

  /** Get display value for a segment */
  getSegmentDisplayValue(segment: TimeSegment): string;

  /** Handle keyboard events on segment */
  handleSegmentKeyDown(segment: TimeSegment, event: KeyboardEvent): boolean;

  /** Cleanup */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

/**
 * Convert 24h time to 12h time with period.
 */
function to12Hour(hour: number): { hour: number; period: "AM" | "PM" } {
  if (hour === 0) return { hour: 12, period: "AM" };
  if (hour < 12) return { hour, period: "AM" };
  if (hour === 12) return { hour: 12, period: "PM" };
  return { hour: hour - 12, period: "PM" };
}

/**
 * Convert 12h time to 24h time.
 */
function to24Hour(hour: number, period: "AM" | "PM"): number {
  if (period === "AM") {
    return hour === 12 ? 0 : hour;
  }
  return hour === 12 ? 12 : hour + 12;
}

/**
 * Pad a number to 2 digits.
 */
function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Creates a time picker behavior primitive.
 *
 * @example
 * ```ts
 * const timePicker = createTimePickerBehavior({
 *   hourFormat: 12,
 *   showSeconds: false,
 *   onValueChange: (value) => console.log('Time:', value),
 * });
 * ```
 */
export function createTimePickerBehavior(
  options: TimePickerBehaviorOptions = {}
): TimePickerBehavior {
  const {
    defaultValue = { hour: 0, minute: 0, second: 0 },
    onValueChange,
    hourFormat = 12,
    showSeconds = false,
    minuteStep = 1,
    secondStep = 1,
    minTime,
    maxTime,
    disabled = false,
    locale: _locale = "en-US",
  } = options;

  // Internal state
  const initialPeriod = to12Hour(defaultValue.hour).period;
  let state: TimePickerBehaviorState = {
    value: { ...defaultValue },
    focusedSegment: null,
    hourFormat,
    showSeconds,
    period: initialPeriod,
    disabled,
  };

  // Segment order for navigation
  const getSegmentOrder = (): TimeSegment[] => {
    const segments: TimeSegment[] = ["hour", "minute"];
    if (showSeconds) segments.push("second");
    if (hourFormat === 12) segments.push("period");
    return segments;
  };

  // Helpers
  function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  function roundToStep(value: number, step: number): number {
    return Math.round(value / step) * step;
  }

  function isTimeValid(value: TimeValue): boolean {
    if (minTime) {
      const minMinutes = minTime.hour * 60 + minTime.minute;
      const valueMinutes = value.hour * 60 + value.minute;
      if (valueMinutes < minMinutes) return false;
    }
    if (maxTime) {
      const maxMinutes = maxTime.hour * 60 + maxTime.minute;
      const valueMinutes = value.hour * 60 + value.minute;
      if (valueMinutes > maxMinutes) return false;
    }
    return true;
  }

  function updateValue(newValue: TimeValue): void {
    // Clamp values
    const clamped: TimeValue = {
      hour: clamp(newValue.hour, 0, 23),
      minute: roundToStep(clamp(newValue.minute, 0, 59), minuteStep),
      second: roundToStep(clamp(newValue.second, 0, 59), secondStep),
    };

    // Check if valid
    if (!isTimeValid(clamped)) return;

    // Update period if in 12h mode
    const { period } = to12Hour(clamped.hour);

    state = {
      ...state,
      value: clamped,
      period,
    };

    onValueChange?.(clamped);
  }

  // Public API
  function increment(segment: TimeSegment): void {
    if (state.disabled) return;

    const { value } = state;
    const newValue = { ...value };

    switch (segment) {
      case "hour":
        newValue.hour = (value.hour + 1) % 24;
        break;
      case "minute":
        newValue.minute = (value.minute + minuteStep) % 60;
        if (newValue.minute < value.minute) {
          // Rolled over to next hour
          newValue.hour = (value.hour + 1) % 24;
        }
        break;
      case "second":
        newValue.second = (value.second + secondStep) % 60;
        if (newValue.second < value.second) {
          // Rolled over to next minute
          newValue.minute = (value.minute + 1) % 60;
          if (newValue.minute === 0) {
            newValue.hour = (value.hour + 1) % 24;
          }
        }
        break;
      case "period":
        // Toggle AM/PM (add/subtract 12 hours)
        if (value.hour < 12) {
          newValue.hour = value.hour + 12;
        } else {
          newValue.hour = value.hour - 12;
        }
        break;
    }

    updateValue(newValue);
  }

  function decrement(segment: TimeSegment): void {
    if (state.disabled) return;

    const { value } = state;
    const newValue = { ...value };

    switch (segment) {
      case "hour":
        newValue.hour = (value.hour - 1 + 24) % 24;
        break;
      case "minute":
        newValue.minute = (value.minute - minuteStep + 60) % 60;
        if (newValue.minute > value.minute) {
          // Rolled back to previous hour
          newValue.hour = (value.hour - 1 + 24) % 24;
        }
        break;
      case "second":
        newValue.second = (value.second - secondStep + 60) % 60;
        if (newValue.second > value.second) {
          // Rolled back to previous minute
          newValue.minute = (value.minute - 1 + 60) % 60;
          if (newValue.minute === 59) {
            newValue.hour = (value.hour - 1 + 24) % 24;
          }
        }
        break;
      case "period":
        // Toggle AM/PM
        if (value.hour < 12) {
          newValue.hour = value.hour + 12;
        } else {
          newValue.hour = value.hour - 12;
        }
        break;
    }

    updateValue(newValue);
  }

  function setSegmentValue(segment: TimeSegment, value: number | string): void {
    if (state.disabled) return;

    const { value: currentValue } = state;
    const newValue = { ...currentValue };

    if (segment === "period") {
      const periodValue = String(value).toUpperCase();
      if (periodValue === "AM" || periodValue === "A") {
        if (currentValue.hour >= 12) {
          newValue.hour = currentValue.hour - 12;
        }
      } else if (periodValue === "PM" || periodValue === "P") {
        if (currentValue.hour < 12) {
          newValue.hour = currentValue.hour + 12;
        }
      }
    } else {
      const numValue = typeof value === "string" ? Number.parseInt(value, 10) : value;
      if (Number.isNaN(numValue)) return;

      switch (segment) {
        case "hour":
          if (hourFormat === 12) {
            // Convert from 12h to 24h
            const isPM = currentValue.hour >= 12;
            newValue.hour = to24Hour(clamp(numValue, 1, 12), isPM ? "PM" : "AM");
          } else {
            newValue.hour = clamp(numValue, 0, 23);
          }
          break;
        case "minute":
          newValue.minute = clamp(numValue, 0, 59);
          break;
        case "second":
          newValue.second = clamp(numValue, 0, 59);
          break;
      }
    }

    updateValue(newValue);
  }

  function setValue(value: TimeValue): void {
    if (state.disabled) return;
    updateValue(value);
  }

  function parseTime(input: string): TimeValue | null {
    // Try to parse common time formats
    const patterns = [
      // 24h: HH:MM:SS, HH:MM
      /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/,
      // 12h: HH:MM AM/PM
      /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i,
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) {
        const hourStr = match[1];
        const minuteStr = match[2];
        if (!hourStr || !minuteStr) continue;

        let hour = Number.parseInt(hourStr, 10);
        const minute = Number.parseInt(minuteStr, 10);
        const second = match[3] ? Number.parseInt(match[3], 10) : 0;
        const period = match[4]?.toUpperCase() as "AM" | "PM" | undefined;

        if (period) {
          hour = to24Hour(hour, period);
        }

        if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 && second >= 0 && second <= 59) {
          return { hour, minute, second };
        }
      }
    }

    return null;
  }

  function formatTime(value?: TimeValue): string {
    const v = value ?? state.value;

    if (hourFormat === 12) {
      const { hour, period } = to12Hour(v.hour);
      if (showSeconds) {
        return `${hour}:${pad2(v.minute)}:${pad2(v.second)} ${period}`;
      }
      return `${hour}:${pad2(v.minute)} ${period}`;
    }

    if (showSeconds) {
      return `${pad2(v.hour)}:${pad2(v.minute)}:${pad2(v.second)}`;
    }
    return `${pad2(v.hour)}:${pad2(v.minute)}`;
  }

  function focusSegment(segment: TimeSegment): void {
    state = { ...state, focusedSegment: segment };
  }

  function focusNextSegment(): void {
    const segments = getSegmentOrder();
    const currentIndex = state.focusedSegment ? segments.indexOf(state.focusedSegment) : -1;

    if (currentIndex < segments.length - 1) {
      const nextSegment = segments[currentIndex + 1];
      state = { ...state, focusedSegment: nextSegment ?? null };
    }
  }

  function focusPreviousSegment(): void {
    const segments = getSegmentOrder();
    const currentIndex = state.focusedSegment
      ? segments.indexOf(state.focusedSegment)
      : segments.length;

    if (currentIndex > 0) {
      const prevSegment = segments[currentIndex - 1];
      state = { ...state, focusedSegment: prevSegment ?? null };
    }
  }

  function blur(): void {
    state = { ...state, focusedSegment: null };
  }

  function getSegmentProps(segment: TimeSegment): TimeSegmentProps {
    const { value } = state;
    let valueNow: number;
    let valueMin: number;
    let valueMax: number;
    let valueText: string;
    let label: string;

    switch (segment) {
      case "hour":
        if (hourFormat === 12) {
          const { hour } = to12Hour(value.hour);
          valueNow = hour;
          valueMin = 1;
          valueMax = 12;
          valueText = String(hour);
          label = "Hour";
        } else {
          valueNow = value.hour;
          valueMin = 0;
          valueMax = 23;
          valueText = pad2(value.hour);
          label = "Hour";
        }
        break;
      case "minute":
        valueNow = value.minute;
        valueMin = 0;
        valueMax = 59;
        valueText = pad2(value.minute);
        label = "Minute";
        break;
      case "second":
        valueNow = value.second;
        valueMin = 0;
        valueMax = 59;
        valueText = pad2(value.second);
        label = "Second";
        break;
      case "period":
        valueNow = state.period === "AM" ? 0 : 1;
        valueMin = 0;
        valueMax = 1;
        valueText = state.period;
        label = "AM/PM";
        break;
    }

    const props: TimeSegmentProps = {
      role: "spinbutton",
      tabIndex: state.disabled ? -1 : 0,
      "aria-valuemin": valueMin,
      "aria-valuemax": valueMax,
      "aria-valuenow": valueNow,
      "aria-valuetext": valueText,
      "aria-label": label,
    };

    if (state.disabled) {
      props["aria-disabled"] = true;
    }

    return props;
  }

  function getSegmentDisplayValue(segment: TimeSegment): string {
    const { value } = state;

    switch (segment) {
      case "hour":
        if (hourFormat === 12) {
          return String(to12Hour(value.hour).hour);
        }
        return pad2(value.hour);
      case "minute":
        return pad2(value.minute);
      case "second":
        return pad2(value.second);
      case "period":
        return state.period;
    }
  }

  function handleSegmentKeyDown(segment: TimeSegment, event: KeyboardEvent): boolean {
    if (state.disabled) return false;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        increment(segment);
        return true;
      case "ArrowDown":
        event.preventDefault();
        decrement(segment);
        return true;
      case "ArrowRight":
        event.preventDefault();
        focusNextSegment();
        return true;
      case "ArrowLeft":
        event.preventDefault();
        focusPreviousSegment();
        return true;
      case "Tab":
        // Let natural tab behavior work, but track focus
        return false;
      default:
        // Handle digit input
        if (/^\d$/.test(event.key)) {
          event.preventDefault();
          setSegmentValue(segment, event.key);
          return true;
        }
        // Handle AM/PM keys
        if (segment === "period" && /^[aApP]$/i.test(event.key)) {
          event.preventDefault();
          setSegmentValue(segment, event.key);
          return true;
        }
    }

    return false;
  }

  function destroy(): void {
    // No cleanup needed
  }

  return {
    get state() {
      return state;
    },
    increment,
    decrement,
    setSegmentValue,
    setValue,
    parseTime,
    formatTime,
    focusSegment,
    focusNextSegment,
    focusPreviousSegment,
    blur,
    getSegmentProps,
    getSegmentDisplayValue,
    handleSegmentKeyDown,
    destroy,
  };
}
