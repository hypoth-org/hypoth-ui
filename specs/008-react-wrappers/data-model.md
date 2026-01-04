# Data Model: React Wrappers for Web Components

**Date**: 2026-01-03
**Feature**: 008-react-wrappers
**Phase**: 1 (Design)

## Overview

This document defines the TypeScript types and interfaces for the React wrapper components. No database or persistence layer is involved.

## Core Types

### Slot & asChild Types

```typescript
// primitives/slot.tsx
/**
 * Slot renders its child element with merged props.
 * Used internally by asChild implementations.
 */
export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * Base props for components supporting asChild pattern.
 */
export interface AsChildProps {
  /**
   * When true, the component renders its child element with merged props
   * instead of its default element.
   */
  asChild?: boolean;
}
```

### Event Types

```typescript
// types/events.ts

/**
 * Event detail for ds:navigate custom event from ds-link.
 */
export interface DsNavigateEventDetail {
  /** The target URL */
  href: string;
  /** Whether the link opens in a new tab */
  external: boolean;
  /** The original DOM event that triggered navigation */
  originalEvent: MouseEvent | KeyboardEvent;
}

/**
 * Event detail for input value changes.
 */
export interface DsInputEventDetail {
  value: string;
}

/**
 * Typed event handler for ds:navigate.
 */
export type NavigateEventHandler = (
  event: CustomEvent<DsNavigateEventDetail>
) => void;

/**
 * Typed event handler for input events.
 */
export type InputValueHandler = (
  value: string,
  event: CustomEvent<DsInputEventDetail>
) => void;
```

### Utility Types

```typescript
// types/polymorphic.ts

/**
 * Utility to merge slot props with child props.
 * Child props take precedence except for className (concatenated)
 * and event handlers (composed).
 */
export type MergedProps<P extends Record<string, unknown>> = P;

/**
 * Spacing values supported by Box component.
 * Maps to design system spacing tokens.
 */
export type SpacingValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

/**
 * Display values for Box component.
 */
export type DisplayValue =
  | 'block'
  | 'inline'
  | 'inline-block'
  | 'flex'
  | 'inline-flex'
  | 'grid'
  | 'inline-grid'
  | 'none';

/**
 * Flex direction values.
 */
export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

/**
 * Alignment values for flex/grid.
 */
export type AlignValue = 'start' | 'end' | 'center' | 'stretch' | 'baseline';

/**
 * Justify values for flex/grid.
 */
export type JustifyValue = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
```

## Component Props

### WC Wrapper Props

```typescript
// components/button.tsx (existing, updated types)
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}

// components/link.tsx
export type LinkVariant = 'default' | 'muted' | 'underline';

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    AsChildProps {
  href: string;
  external?: boolean;
  variant?: LinkVariant;
  /** Handler for ds:navigate event. Can prevent default navigation. */
  onNavigate?: NavigateEventHandler;
  children?: React.ReactNode;
}

// components/input.tsx (existing, reference)
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'onInput'> {
  type?: InputType;
  size?: InputSize;
  error?: boolean;
  onChange?: InputValueHandler;
  onValueChange?: InputValueHandler;
}

// components/icon.tsx
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  /** Icon name from Lucide library (kebab-case) */
  name: string;
  size?: IconSize;
  /** Accessible label. When omitted, icon is decorative. */
  label?: string;
  /** Custom color (CSS value) */
  color?: string;
  className?: string;
}

// components/spinner.tsx
export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  /** Accessible label for screen readers */
  label?: string;
  className?: string;
}

// components/visually-hidden.tsx
export interface VisuallyHiddenProps {
  /** When true, content becomes visible on focus */
  focusable?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

### React-Only Primitive Props

```typescript
// primitives/box.tsx
export interface BoxProps extends AsChildProps {
  // Spacing
  p?: SpacingValue;
  px?: SpacingValue;
  py?: SpacingValue;
  pt?: SpacingValue;
  pr?: SpacingValue;
  pb?: SpacingValue;
  pl?: SpacingValue;
  m?: SpacingValue;
  mx?: SpacingValue;
  my?: SpacingValue;
  mt?: SpacingValue;
  mr?: SpacingValue;
  mb?: SpacingValue;
  ml?: SpacingValue;
  gap?: SpacingValue;

  // Display & Layout
  display?: DisplayValue;
  flexDirection?: FlexDirection;
  alignItems?: AlignValue;
  justifyContent?: JustifyValue;
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  flexGrow?: 0 | 1;
  flexShrink?: 0 | 1;

  // Standard HTML
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// components/text.tsx (React-only, not WC wrapper)
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextVariant = 'default' | 'muted' | 'success' | 'warning' | 'error';

export interface TextProps extends AsChildProps {
  size?: TextSize;
  weight?: TextWeight;
  variant?: TextVariant;
  truncate?: boolean;
  className?: string;
  children?: React.ReactNode;
}
```

## Factory Configuration

```typescript
// utils/create-component.ts (updated)
export interface WrapperConfig<P extends Record<string, unknown>> {
  /** Custom element tag name (e.g., 'ds-button') */
  tagName: string;
  /**
   * Props that should be set as element properties (not attributes).
   * Use for complex values that can't be serialized to strings.
   */
  properties?: (keyof P)[];
  /**
   * Event mappings: React prop name → DOM event name.
   * Example: { onNavigate: 'ds:navigate' }
   */
  events?: Record<string, string>;
  /**
   * Default prop values.
   */
  defaults?: Partial<P>;
}
```

## Type Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                     AsChildProps                             │
│  ┌─────────────┐   ┌─────────────┐   ┌──────────────┐       │
│  │   BoxProps   │   │  TextProps  │   │  LinkProps   │       │
│  │  (extends)   │   │  (extends)  │   │  (extends)   │       │
│  └─────────────┘   └─────────────┘   └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Slot                                 │
│  Renders child element with merged SlotProps                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Event Type Flow                            │
│                                                              │
│  ds-link fires 'ds:navigate' → CustomEvent<DsNavigateDetail>│
│       ↓                                                      │
│  LinkProps.onNavigate: NavigateEventHandler                  │
│       ↓                                                      │
│  React wrapper calls handler with typed event                │
└─────────────────────────────────────────────────────────────┘
```

## Export Structure

```typescript
// index.ts - Server-safe exports (types only for server components)
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/button';
export type { LinkProps, LinkVariant } from './components/link';
export type { InputProps, InputType, InputSize } from './components/input';
export type { TextProps, TextSize, TextWeight, TextVariant } from './components/text';
export type { BoxProps, SpacingValue, DisplayValue } from './primitives/box';
export type { IconProps, IconSize } from './components/icon';
export type { SpinnerProps, SpinnerSize } from './components/spinner';
export type { VisuallyHiddenProps } from './components/visually-hidden';
export type { DsNavigateEventDetail, NavigateEventHandler } from './types/events';

// client.ts - Interactive components (requires 'use client')
'use client';
export { Button } from './components/button';
export { Link } from './components/link';
export { Input } from './components/input';
export { Text } from './components/text';
export { Box } from './primitives/box';
export { Icon } from './components/icon';
export { Spinner } from './components/spinner';
export { VisuallyHidden } from './components/visually-hidden';
export { Slot } from './primitives/slot';
```
