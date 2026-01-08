import { forwardRef } from "react";
import { Flow, type FlowProps } from "./flow.js";

export interface StackProps extends Omit<FlowProps, "direction"> {
  /** Gap between children. Supports responsive object syntax. */
  gap?: FlowProps["gap"];
}

/**
 * Stack is a Flow with direction="column".
 */
export const Stack = forwardRef<HTMLElement, StackProps>((props, ref) => {
  return <Flow ref={ref} direction="column" {...props} />;
});

Stack.displayName = "Stack";
