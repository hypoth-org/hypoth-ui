import type { CSSProperties, SyntheticEvent } from "react";

/**
 * Composes two event handlers, calling child handler first.
 * If child handler calls preventDefault(), parent handler is skipped.
 */
export function composeEventHandlers<E extends SyntheticEvent | Event>(
  parentHandler?: (event: E) => void,
  childHandler?: (event: E) => void
): (event: E) => void {
  return (event: E) => {
    childHandler?.(event);
    if (
      !("defaultPrevented" in event) ||
      !(event as { defaultPrevented: boolean }).defaultPrevented
    ) {
      parentHandler?.(event);
    }
  };
}

/**
 * Merges two className strings, filtering out falsy values.
 */
export function mergeClassNames(...classNames: (string | undefined | null | false)[]): string {
  return classNames.filter(Boolean).join(" ");
}

/**
 * Merges two style objects, with child styles taking precedence.
 */
export function mergeStyles(
  parentStyle?: CSSProperties,
  childStyle?: CSSProperties
): CSSProperties | undefined {
  if (!parentStyle && !childStyle) return undefined;
  if (!parentStyle) return childStyle;
  if (!childStyle) return parentStyle;
  return { ...parentStyle, ...childStyle };
}

/**
 * Checks if a prop name is an event handler (starts with 'on' followed by uppercase).
 */
function isEventHandler(propName: string): boolean {
  return /^on[A-Z]/.test(propName);
}

/**
 * Merges slot props with child props.
 * - className: concatenated
 * - style: merged (child wins conflicts)
 * - event handlers: composed (both called, child first)
 * - other props: child wins
 */
export function mergeProps<T extends Record<string, unknown>>(slotProps: T, childProps: T): T {
  const result = { ...slotProps } as T;

  for (const key in childProps) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (key === "className") {
      result[key] = mergeClassNames(
        slotValue as string | undefined,
        childValue as string | undefined
      ) as T[typeof key];
    } else if (key === "style") {
      result[key] = mergeStyles(
        slotValue as CSSProperties | undefined,
        childValue as CSSProperties | undefined
      ) as T[typeof key];
    } else if (
      isEventHandler(key) &&
      typeof slotValue === "function" &&
      typeof childValue === "function"
    ) {
      result[key] = composeEventHandlers(
        slotValue as (event: Event) => void,
        childValue as (event: Event) => void
      ) as T[typeof key];
    } else if (childValue !== undefined) {
      result[key] = childValue;
    }
  }

  return result;
}
