import { forwardRef } from "react";
import { Flow, type FlowProps } from "./flow.js";

export interface InlineProps extends Omit<FlowProps, "direction"> {
  /** Gap between children. Supports responsive object syntax. */
  gap?: FlowProps["gap"];
}

/**
 * Inline is a Flow with direction="row".
 */
export const Inline = forwardRef<HTMLElement, InlineProps>((props, ref) => {
  return <Flow ref={ref} direction="row" {...props} />;
});

Inline.displayName = "Inline";
