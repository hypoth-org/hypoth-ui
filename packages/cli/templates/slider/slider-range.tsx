/**
 * Slider Range component - visual indicator of the selected range.
 */

import { type HTMLAttributes, forwardRef } from "react";
import { useSliderContext } from "./slider-context.js";

export interface SliderRangeProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Visual range indicator within the slider track.
 * Automatically positions based on current value or range.
 *
 * @example
 * ```tsx
 * <Slider.Track>
 *   <Slider.Range />
 *   <Slider.Thumb />
 * </Slider.Track>
 * ```
 */
export const SliderRange = forwardRef<HTMLDivElement, SliderRangeProps>(
  ({ className, style, ...restProps }, ref) => {
    const { behavior, range, orientation } = useSliderContext("Slider.Range");
    const { state } = behavior;

    // Calculate percentage positions
    const singlePercent = behavior.valueToPercent(state.value);
    const minPercent = behavior.valueToPercent(state.rangeValue.min);
    const maxPercent = behavior.valueToPercent(state.rangeValue.max);

    const isVertical = orientation === "vertical";

    // Build inline style for positioning
    let positionStyle: React.CSSProperties;

    if (range) {
      positionStyle = isVertical
        ? { bottom: `${minPercent}%`, height: `${maxPercent - minPercent}%` }
        : { left: `${minPercent}%`, width: `${maxPercent - minPercent}%` };
    } else {
      positionStyle = isVertical
        ? { bottom: "0%", height: `${singlePercent}%` }
        : { left: "0%", width: `${singlePercent}%` };
    }

    return (
      <div
        ref={ref}
        className={className}
        style={{ ...positionStyle, ...style }}
        data-orientation={orientation}
        {...restProps}
      />
    );
  }
);

SliderRange.displayName = "Slider.Range";
