/**
 * Slider Track component - the track along which thumbs move.
 */

import {
  type HTMLAttributes,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useSliderContext } from "./slider-context.js";

export interface SliderTrackProps extends HTMLAttributes<HTMLDivElement> {
  /** Track content (Range, Thumb components) */
  children?: ReactNode;
}

/**
 * Track component that contains the range and thumb elements.
 * Handles click-to-position functionality.
 *
 * @example
 * ```tsx
 * <Slider.Track>
 *   <Slider.Range />
 *   <Slider.Thumb />
 * </Slider.Track>
 * ```
 */
export const SliderTrack = forwardRef<HTMLDivElement, SliderTrackProps>(
  ({ children, className, onClick, ...restProps }, ref) => {
    const { behavior, range, orientation, disabled } = useSliderContext("Slider.Track");
    const internalRef = useRef<HTMLDivElement>(null);

    // Merge refs
    const mergedRef = useCallback(
      (element: HTMLDivElement | null) => {
        (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
        }
      },
      [ref]
    );

    // Set track element on behavior
    useEffect(() => {
      if (internalRef.current) {
        behavior.trackElement = internalRef.current;
      }
      return () => {
        behavior.trackElement = null;
      };
    }, [behavior]);

    const handleClick = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        if (disabled) return;

        const track = internalRef.current;
        if (!track) return;

        // Determine click position as percentage
        const rect = track.getBoundingClientRect();
        let percent: number;

        if (orientation === "horizontal") {
          percent = ((event.clientX - rect.left) / rect.width) * 100;
        } else {
          percent = 100 - ((event.clientY - rect.top) / rect.height) * 100;
        }

        // Determine which thumb to move
        const clickValue = behavior.percentToValue(percent);
        let thumb: "single" | "min" | "max" = "single";

        if (range) {
          const { rangeValue } = behavior.state;
          const minDist = Math.abs(clickValue - rangeValue.min);
          const maxDist = Math.abs(clickValue - rangeValue.max);
          thumb = minDist <= maxDist ? "min" : "max";
        }

        // Move thumb to click position
        behavior.startDrag(thumb, event.nativeEvent as PointerEvent);
        behavior.endDrag();

        onClick?.(event);
      },
      [behavior, range, orientation, disabled, onClick]
    );

    return (
      <div
        ref={mergedRef}
        className={className}
        data-orientation={orientation}
        data-disabled={disabled || undefined}
        onClick={handleClick}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

SliderTrack.displayName = "Slider.Track";
