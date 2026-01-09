/**
 * Responsive Utilities
 *
 * Provides types and utilities for breakpoint-aware component props.
 * Supports responsive object syntax for size and other props.
 *
 * @packageDocumentation
 */

/**
 * Breakpoint names matching the design token system
 */
export type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

/**
 * Breakpoint values in pixels (min-width)
 * These match the values in packages/tokens/src/responsive/breakpoints.json
 */
export const BREAKPOINTS: Record<Breakpoint, number> = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/**
 * Breakpoint media query strings
 */
export const BREAKPOINT_QUERIES: Record<Breakpoint, string> = {
  base: "",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

/**
 * Ordered list of breakpoints for cascade
 */
export const BREAKPOINT_ORDER: Breakpoint[] = [
  "base",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
];

/**
 * Responsive prop value type
 *
 * Can be either:
 * - A single value (applies to all breakpoints)
 * - An object with breakpoint keys (applies at each breakpoint)
 *
 * @example
 * ```tsx
 * // Single value
 * <Button size="md" />
 *
 * // Responsive object
 * <Button size={{ base: "sm", md: "md", lg: "lg" }} />
 * ```
 */
export type ResponsiveProp<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Check if a value is a responsive object
 */
export function isResponsiveObject<T>(
  value: ResponsiveProp<T>
): value is Partial<Record<Breakpoint, T>> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    BREAKPOINT_ORDER.some((bp) => bp in (value as object))
  );
}

/**
 * Get the value for a specific breakpoint, with cascade fallback
 *
 * @param value - The responsive prop value
 * @param breakpoint - The target breakpoint
 * @returns The value for the breakpoint, falling back to smaller breakpoints
 *
 * @example
 * ```ts
 * const size = { base: "sm", lg: "lg" };
 * getValueAtBreakpoint(size, "md"); // "sm" (falls back to base)
 * getValueAtBreakpoint(size, "xl"); // "lg" (falls back to lg)
 * ```
 */
export function getValueAtBreakpoint<T>(
  value: ResponsiveProp<T>,
  breakpoint: Breakpoint
): T | undefined {
  if (!isResponsiveObject(value)) {
    return value;
  }

  // Get the index of the target breakpoint
  const targetIndex = BREAKPOINT_ORDER.indexOf(breakpoint);

  // Walk backwards from target to find the closest defined value
  for (let i = targetIndex; i >= 0; i--) {
    const bp = BREAKPOINT_ORDER[i];
    if (bp !== undefined && bp in value) {
      return value[bp];
    }
  }

  return undefined;
}

/**
 * Get the base value from a responsive prop
 */
export function getBaseValue<T>(value: ResponsiveProp<T>): T | undefined {
  return getValueAtBreakpoint(value, "base");
}

/**
 * Resolve a responsive prop to a flat value
 * Uses the base value or first defined value
 */
export function resolveResponsiveValue<T>(
  value: ResponsiveProp<T>,
  defaultValue: T
): T {
  if (!isResponsiveObject(value)) {
    return value;
  }

  // Find the first defined value
  for (const bp of BREAKPOINT_ORDER) {
    if (bp in value && value[bp] !== undefined) {
      return value[bp] as T;
    }
  }

  return defaultValue;
}

/**
 * Generate CSS custom properties for responsive values
 *
 * @param propName - Base CSS property name (e.g., "size")
 * @param value - The responsive prop value
 * @returns CSS custom properties object
 *
 * @example
 * ```ts
 * generateResponsiveCssVars("size", { base: "sm", lg: "lg" });
 * // Returns: { "--size-base": "sm", "--size-lg": "lg" }
 * ```
 */
export function generateResponsiveCssVars<T extends string>(
  propName: string,
  value: ResponsiveProp<T>
): Record<string, string> {
  const vars: Record<string, string> = {};

  if (!isResponsiveObject(value)) {
    vars[`--${propName}`] = value;
    return vars;
  }

  for (const bp of BREAKPOINT_ORDER) {
    if (bp in value && value[bp] !== undefined) {
      if (bp === "base") {
        vars[`--${propName}`] = value[bp] as string;
      } else {
        vars[`--${propName}-${bp}`] = value[bp] as string;
      }
    }
  }

  return vars;
}

/**
 * Generate data attributes for responsive values (for CSS targeting)
 *
 * @param propName - Attribute name (e.g., "size")
 * @param value - The responsive prop value
 * @returns Data attribute value for CSS targeting
 *
 * @example
 * ```ts
 * generateResponsiveDataAttr("size", { base: "sm", lg: "lg" });
 * // Returns: "sm lg:lg"
 * ```
 */
export function generateResponsiveDataAttr<T extends string>(
  value: ResponsiveProp<T>
): string {
  if (!isResponsiveObject(value)) {
    return value;
  }

  const parts: string[] = [];

  for (const bp of BREAKPOINT_ORDER) {
    if (bp in value && value[bp] !== undefined) {
      if (bp === "base") {
        parts.push(value[bp] as string);
      } else {
        parts.push(`${bp}:${value[bp]}`);
      }
    }
  }

  return parts.join(" ");
}

/**
 * Hook to get current breakpoint (client-side only)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const breakpoint = useBreakpoint();
 *   return <div>Current: {breakpoint}</div>;
 * }
 * ```
 */
export function useBreakpoint(): Breakpoint {
  // This is a simplified version - in a real implementation,
  // you'd use matchMedia listeners to track the current breakpoint
  if (typeof window === "undefined") {
    return "base";
  }

  const width = window.innerWidth;

  if (width >= BREAKPOINTS["2xl"]) return "2xl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "base";
}

/**
 * Hook to check if a breakpoint is active
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMobile = useBreakpointValue("base", true, false);
 *   const isDesktop = useBreakpointValue("lg", false, true);
 * }
 * ```
 */
export function useBreakpointValue<T>(
  breakpoint: Breakpoint,
  below: T,
  atOrAbove: T
): T {
  const currentBreakpoint = useBreakpoint();
  const currentIndex = BREAKPOINT_ORDER.indexOf(currentBreakpoint);
  const targetIndex = BREAKPOINT_ORDER.indexOf(breakpoint);

  return currentIndex >= targetIndex ? atOrAbove : below;
}

/**
 * Get responsive value for current breakpoint
 *
 * @example
 * ```tsx
 * function MyComponent({ size }: { size: ResponsiveProp<"sm" | "md" | "lg"> }) {
 *   const resolvedSize = useResponsiveValue(size, "md");
 *   return <div data-size={resolvedSize} />;
 * }
 * ```
 */
export function useResponsiveValue<T>(
  value: ResponsiveProp<T>,
  defaultValue: T
): T {
  const breakpoint = useBreakpoint();
  const resolved = getValueAtBreakpoint(value, breakpoint);
  return resolved ?? defaultValue;
}

/**
 * Type helper for component props that support responsive values
 *
 * @example
 * ```tsx
 * interface ButtonProps {
 *   size?: ResponsiveProp<"sm" | "md" | "lg">;
 *   variant?: "primary" | "secondary"; // Not responsive
 * }
 * ```
 */
export type WithResponsive<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: ResponsiveProp<NonNullable<T[P]>>;
};

/**
 * CSS generation utilities for responsive styles
 */
export const responsiveCss = {
  /**
   * Generate media query CSS for responsive prop
   */
  generateMediaQueries<T extends string>(
    _propName: string,
    value: ResponsiveProp<T>,
    cssGenerator: (val: T) => string
  ): string {
    if (!isResponsiveObject(value)) {
      return cssGenerator(value);
    }

    const rules: string[] = [];

    for (const bp of BREAKPOINT_ORDER) {
      if (bp in value && value[bp] !== undefined) {
        const css = cssGenerator(value[bp] as T);
        if (bp === "base") {
          rules.push(css);
        } else {
          rules.push(`@media ${BREAKPOINT_QUERIES[bp]} { ${css} }`);
        }
      }
    }

    return rules.join("\n");
  },
};
