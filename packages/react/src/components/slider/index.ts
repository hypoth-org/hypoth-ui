/**
 * Slider compound component for numeric value selection.
 *
 * @example
 * ```tsx
 * // Single value slider
 * <Slider.Root min={0} max={100} onValueChange={(v) => console.log(v)}>
 *   <Slider.Track className="slider-track">
 *     <Slider.Range className="slider-range" />
 *     <Slider.Thumb className="slider-thumb" />
 *   </Slider.Track>
 * </Slider.Root>
 *
 * // Range slider
 * <Slider.Root range min={0} max={1000} onRangeChange={(r) => console.log(r)}>
 *   <Slider.Track className="slider-track">
 *     <Slider.Range className="slider-range" />
 *     <Slider.Thumb type="min" aria-label="Minimum" />
 *     <Slider.Thumb type="max" aria-label="Maximum" />
 *   </Slider.Track>
 * </Slider.Root>
 * ```
 */

export { SliderRoot, type SliderRootProps } from "./slider-root.js";
export { SliderTrack, type SliderTrackProps } from "./slider-track.js";
export { SliderRange, type SliderRangeProps } from "./slider-range.js";
export { SliderThumb, type SliderThumbProps } from "./slider-thumb.js";
export { useSliderContext, type SliderContextValue } from "./slider-context.js";

export const Slider = {
  Root: SliderRoot,
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
} as const;

import { SliderRange } from "./slider-range.js";
import { SliderRoot } from "./slider-root.js";
import { SliderThumb } from "./slider-thumb.js";
import { SliderTrack } from "./slider-track.js";
