import { createElement, forwardRef } from "react";

type SpacingToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
type SpacerAxis = "horizontal" | "vertical";

export interface SpacerProps {
  /** Size of the space. */
  size?: SpacingToken;
  /** Axis direction. */
  axis?: SpacerAxis;
  /** Additional CSS class names. */
  className?: string;
}

/**
 * React wrapper for ds-spacer Web Component.
 */
export const Spacer = forwardRef<HTMLElement, SpacerProps>((props, ref) => {
  const { size = "md", axis = "vertical", className, ...rest } = props;

  return createElement("ds-spacer", {
    ref,
    size,
    axis,
    class: className,
    ...rest,
  });
});

Spacer.displayName = "Spacer";
