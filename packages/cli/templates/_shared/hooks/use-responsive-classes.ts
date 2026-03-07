/**
 * React Responsive Classes Hook
 *
 * Converts React responsive object syntax to CSS classes.
 * React syntax: { base: "column", md: "row" }
 * Output: ["ds-flow--md:dir-row"]
 */

import { useMemo } from "react";

type BreakpointToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export type ResponsiveValue<T> = T | Partial<Record<"base" | BreakpointToken, T>>;

function isResponsiveObject<T>(
  value: ResponsiveValue<T>
): value is Partial<Record<"base" | BreakpointToken, T>> {
  return typeof value === "object" && value !== null;
}

/**
 * Parse a responsive value into base value and classes.
 */
export function parseResponsiveValue<T extends string>(
  component: string,
  property: string,
  value: ResponsiveValue<T>
): { baseValue: T | undefined; classes: string[] } {
  if (!isResponsiveObject(value)) {
    return { baseValue: value, classes: [] };
  }

  const classes: string[] = [];
  let baseValue: T | undefined;

  for (const [key, val] of Object.entries(value)) {
    if (val === undefined) continue;

    if (key === "base") {
      baseValue = val as T;
    } else {
      classes.push(`ds-${component}--${key}:${property}-${val}`);
    }
  }

  return { baseValue, classes };
}

/**
 * Hook to generate responsive CSS classes from React props.
 */
export function useResponsiveClasses<T extends Record<string, ResponsiveValue<string> | undefined>>(
  component: string,
  props: T,
  propertyMap: Record<keyof T, string>
): { baseValues: Partial<Record<keyof T, string>>; classes: string[] } {
  return useMemo(() => {
    const baseValues: Partial<Record<keyof T, string>> = {};
    const allClasses: string[] = [];

    for (const [propKey, propValue] of Object.entries(props)) {
      if (propValue === undefined) continue;

      const shortName = propertyMap[propKey as keyof T];
      if (!shortName) continue;

      const { baseValue, classes } = parseResponsiveValue(
        component,
        shortName,
        propValue as ResponsiveValue<string>
      );

      if (baseValue !== undefined) {
        baseValues[propKey as keyof T] = baseValue;
      }

      allClasses.push(...classes);
    }

    return { baseValues, classes: allClasses };
  }, [component, props, propertyMap]);
}

/**
 * Get the base value from a responsive value.
 */
export function getBaseValue<T>(value: ResponsiveValue<T>): T | undefined {
  if (!isResponsiveObject(value)) {
    return value;
  }
  return value.base;
}
