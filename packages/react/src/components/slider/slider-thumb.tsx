/**
 * Slider Thumb component - draggable handle for value selection.
 */

import type { ThumbType } from "@hypoth-ui/primitives-dom";
import {
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSliderContext } from "./slider-context.js";

export interface SliderThumbProps extends HTMLAttributes<HTMLDivElement> {
  /** Thumb type for range mode */
  type?: "single" | "min" | "max";
  /** Accessible label */
  "aria-label"?: string;
}

/**
 * Draggable thumb for selecting values.
 * In range mode, use type="min" and type="max" for the two thumbs.
 *
 * @example
 * ```tsx
 * // Single thumb
 * <Slider.Thumb />
 *
 * // Range thumbs
 * <Slider.Thumb type="min" aria-label="Minimum price" />
 * <Slider.Thumb type="max" aria-label="Maximum price" />
 * ```
 */
export const SliderThumb = forwardRef<HTMLDivElement, SliderThumbProps>(
  (
    {
      type = "single",
      className,
      style,
      "aria-label": ariaLabel,
      onPointerDown,
      onKeyDown,
      ...restProps
    },
    ref
  ) => {
    const { behavior, range, min, max, orientation, disabled, formatValueText } =
      useSliderContext("Slider.Thumb");
    const internalRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

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

    // Determine actual thumb type
    const thumbType: ThumbType = range ? (type as "min" | "max") : "single";

    // Get current value for this thumb
    const { state } = behavior;
    const value =
      thumbType === "single"
        ? state.value
        : thumbType === "min"
          ? state.rangeValue.min
          : state.rangeValue.max;

    // Calculate position
    const percent = behavior.valueToPercent(value);
    const isVertical = orientation === "vertical";
    const positionStyle: React.CSSProperties = isVertical
      ? { bottom: `${percent}%` }
      : { left: `${percent}%` };

    // Determine value constraints
    let valueMin = min;
    let valueMax = max;
    if (range) {
      if (thumbType === "min") {
        valueMax = state.rangeValue.max;
      } else if (thumbType === "max") {
        valueMin = state.rangeValue.min;
      }
    }

    // Value text for screen readers
    const valueText = formatValueText ? formatValueText(value) : String(value);

    // Pointer event handlers
    const handlePointerDown = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        if (disabled) return;

        event.preventDefault();
        (event.target as HTMLElement).setPointerCapture(event.pointerId);

        behavior.startDrag(thumbType, event.nativeEvent as PointerEvent);
        setIsDragging(true);

        onPointerDown?.(event);
      },
      [behavior, thumbType, disabled, onPointerDown]
    );

    // Global pointer move/up handlers
    useEffect(() => {
      if (!isDragging) return;

      const handlePointerMove = (event: globalThis.PointerEvent) => {
        behavior.drag(event);
      };

      const handlePointerUp = () => {
        behavior.endDrag();
        setIsDragging(false);
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);

      return () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };
    }, [behavior, isDragging]);

    // Keyboard handlers
    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;

        switch (event.key) {
          case "ArrowRight":
          case "ArrowUp":
            event.preventDefault();
            if (isVertical ? event.key === "ArrowUp" : event.key === "ArrowRight") {
              behavior.increment(thumbType);
            } else {
              behavior.decrement(thumbType);
            }
            break;
          case "ArrowLeft":
          case "ArrowDown":
            event.preventDefault();
            if (isVertical ? event.key === "ArrowDown" : event.key === "ArrowLeft") {
              behavior.decrement(thumbType);
            } else {
              behavior.increment(thumbType);
            }
            break;
          case "PageUp":
            event.preventDefault();
            behavior.increment(thumbType, true);
            break;
          case "PageDown":
            event.preventDefault();
            behavior.decrement(thumbType, true);
            break;
          case "Home":
            event.preventDefault();
            behavior.setToMin(thumbType);
            break;
          case "End":
            event.preventDefault();
            behavior.setToMax(thumbType);
            break;
        }

        onKeyDown?.(event);
      },
      [behavior, thumbType, isVertical, disabled, onKeyDown]
    );

    return (
      <div
        ref={mergedRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-valuemin={valueMin}
        aria-valuemax={valueMax}
        aria-valuenow={value}
        aria-valuetext={valueText}
        aria-orientation={orientation}
        aria-disabled={disabled || undefined}
        className={className}
        style={{ ...positionStyle, ...style }}
        data-thumb={thumbType}
        data-dragging={isDragging || undefined}
        data-disabled={disabled || undefined}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        {...restProps}
      />
    );
  }
);

SliderThumb.displayName = "Slider.Thumb";
