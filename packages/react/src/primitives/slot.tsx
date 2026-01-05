import {
  Children,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  cloneElement,
  forwardRef,
  isValidElement,
} from "react";
import { mergeProps } from "../utils/merge-props.js";

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

/**
 * Merges two refs into a single ref callback.
 */
function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): (instance: T | null) => void {
  return (instance: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref && typeof ref === "object") {
        (ref as { current: T | null }).current = instance;
      }
    }
  };
}

/**
 * Slot renders its child element with merged props.
 * Used internally by asChild implementations.
 *
 * - Validates that children is a single React element
 * - Merges props (className concatenated, styles merged, events composed)
 * - Forwards refs to the child element
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    const childrenArray = Children.toArray(children);

    // Filter out null/undefined/boolean children
    const validChildren = childrenArray.filter(
      (child) => child !== null && child !== undefined && typeof child !== "boolean"
    );

    if (validChildren.length === 0) {
      throw new Error("Slot expects a single React element child");
    }

    if (validChildren.length > 1) {
      throw new Error("Slot expects a single React element child, received multiple children");
    }

    const child = validChildren[0];

    if (!isValidElement(child)) {
      throw new Error(`Slot expects a single React element child, received ${typeof child}`);
    }

    // Get child's ref if it exists
    const childRef = (child as { ref?: Ref<HTMLElement> }).ref;

    // Merge props and refs
    const mergedProps = mergeProps(
      slotProps as Record<string, unknown>,
      child.props as Record<string, unknown>
    );

    return cloneElement(child, {
      ...mergedProps,
      ref: mergeRefs(forwardedRef, childRef),
    } as Record<string, unknown>);
  }
);

Slot.displayName = "Slot";
