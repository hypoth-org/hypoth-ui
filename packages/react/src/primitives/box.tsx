import type { CSSProperties, ReactNode } from "react";
import { createElement, forwardRef } from "react";
import type {
  AlignValue,
  AsChildProps,
  DisplayValue,
  FlexDirection,
  JustifyValue,
  SpacingValue,
} from "../types/polymorphic.js";
import { mergeClassNames } from "../utils/merge-props.js";
import { Slot } from "./slot.js";

export interface BoxProps extends AsChildProps {
  // Spacing - padding
  p?: SpacingValue;
  px?: SpacingValue;
  py?: SpacingValue;
  pt?: SpacingValue;
  pr?: SpacingValue;
  pb?: SpacingValue;
  pl?: SpacingValue;
  // Spacing - margin
  m?: SpacingValue;
  mx?: SpacingValue;
  my?: SpacingValue;
  mt?: SpacingValue;
  mr?: SpacingValue;
  mb?: SpacingValue;
  ml?: SpacingValue;
  // Layout
  gap?: SpacingValue;
  display?: DisplayValue;
  flexDirection?: FlexDirection;
  alignItems?: AlignValue;
  justifyContent?: JustifyValue;
  flexWrap?: "wrap" | "nowrap" | "wrap-reverse";
  flexGrow?: 0 | 1;
  flexShrink?: 0 | 1;
  // Standard HTML
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Maps spacing props to CSS utility classes.
 */
function buildSpacingClasses(props: BoxProps): string[] {
  const classes: string[] = [];

  // Padding
  if (props.p !== undefined) classes.push(`ds-p-${props.p}`);
  if (props.px !== undefined) classes.push(`ds-px-${props.px}`);
  if (props.py !== undefined) classes.push(`ds-py-${props.py}`);
  if (props.pt !== undefined) classes.push(`ds-pt-${props.pt}`);
  if (props.pr !== undefined) classes.push(`ds-pr-${props.pr}`);
  if (props.pb !== undefined) classes.push(`ds-pb-${props.pb}`);
  if (props.pl !== undefined) classes.push(`ds-pl-${props.pl}`);

  // Margin
  if (props.m !== undefined) classes.push(`ds-m-${props.m}`);
  if (props.mx !== undefined) classes.push(`ds-mx-${props.mx}`);
  if (props.my !== undefined) classes.push(`ds-my-${props.my}`);
  if (props.mt !== undefined) classes.push(`ds-mt-${props.mt}`);
  if (props.mr !== undefined) classes.push(`ds-mr-${props.mr}`);
  if (props.mb !== undefined) classes.push(`ds-mb-${props.mb}`);
  if (props.ml !== undefined) classes.push(`ds-ml-${props.ml}`);

  // Gap
  if (props.gap !== undefined) classes.push(`ds-gap-${props.gap}`);

  return classes;
}

/**
 * Maps layout props to CSS utility classes.
 */
function buildLayoutClasses(props: BoxProps): string[] {
  const classes: string[] = [];

  // Display
  if (props.display) {
    classes.push(`ds-d-${props.display}`);
  }

  // Flex direction
  if (props.flexDirection) {
    const dirMap: Record<FlexDirection, string> = {
      row: "ds-flex-row",
      "row-reverse": "ds-flex-row-reverse",
      column: "ds-flex-col",
      "column-reverse": "ds-flex-col-reverse",
    };
    classes.push(dirMap[props.flexDirection]);
  }

  // Align items
  if (props.alignItems) {
    classes.push(`ds-items-${props.alignItems}`);
  }

  // Justify content
  if (props.justifyContent) {
    classes.push(`ds-justify-${props.justifyContent}`);
  }

  // Flex wrap
  if (props.flexWrap) {
    const wrapMap = {
      wrap: "ds-flex-wrap",
      nowrap: "ds-flex-nowrap",
      "wrap-reverse": "ds-flex-wrap-reverse",
    } as const;
    classes.push(wrapMap[props.flexWrap]);
  }

  // Flex grow/shrink
  if (props.flexGrow !== undefined) {
    classes.push(props.flexGrow === 1 ? "ds-grow" : "ds-grow-0");
  }
  if (props.flexShrink !== undefined) {
    classes.push(props.flexShrink === 0 ? "ds-shrink-0" : "ds-shrink");
  }

  return classes;
}

/**
 * Box is a layout primitive that applies spacing and layout CSS classes.
 * Supports asChild for semantic HTML rendering.
 *
 * @example
 * ```tsx
 * <Box p={4} display="flex" gap={2}>
 *   <span>Item 1</span>
 *   <span>Item 2</span>
 * </Box>
 *
 * <Box p={6} asChild>
 *   <main>Content</main>
 * </Box>
 * ```
 */
export const Box = forwardRef<HTMLElement, BoxProps>((props, ref) => {
  const {
    asChild = false,
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    gap,
    display,
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap,
    flexGrow,
    flexShrink,
    className,
    style,
    children,
    ...rest
  } = props;

  const spacingClasses = buildSpacingClasses(props);
  const layoutClasses = buildLayoutClasses(props);
  const allClasses = mergeClassNames(...spacingClasses, ...layoutClasses, className);

  const Component = asChild ? Slot : "div";

  return createElement(
    Component,
    {
      ref,
      className: allClasses || undefined,
      style,
      ...rest,
    },
    children
  );
});

Box.displayName = "Box";

// Re-export types for convenience
export type {
  SpacingValue,
  DisplayValue,
  FlexDirection,
  AlignValue,
  JustifyValue,
} from "../types/polymorphic.js";
