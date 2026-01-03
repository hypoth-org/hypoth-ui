# Data Model: Baseline Web Components

**Feature**: 007-baseline-components
**Date**: 2026-01-03

## Overview

This feature involves UI components with no persistent data storage. The "data model" consists of component property types, event payloads, and manifest structures.

## Component Type Definitions

### Button

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit' | 'reset';

interface DsButtonProps {
  variant?: ButtonVariant;    // default: 'primary'
  size?: ButtonSize;          // default: 'md'
  disabled?: boolean;         // default: false
  loading?: boolean;          // default: false
  type?: ButtonType;          // default: 'button'
}

interface DsClickEventDetail {
  originalEvent: MouseEvent | KeyboardEvent;
}
```

### Link

```typescript
type LinkVariant = 'default' | 'muted' | 'underline';

interface DsLinkProps {
  href: string;               // required
  external?: boolean;         // default: false
  variant?: LinkVariant;      // default: 'default'
}

interface DsNavigateEventDetail {
  href: string;
  external: boolean;
  originalEvent: MouseEvent | KeyboardEvent;
}
```

### Text

```typescript
type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextVariant = 'default' | 'muted' | 'success' | 'warning' | 'error';
type TextAs = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface DsTextProps {
  size?: TextSize;            // default: 'md'
  weight?: TextWeight;        // default: 'normal'
  variant?: TextVariant;      // default: 'default'
  as?: TextAs;                // default: 'span'
  truncate?: boolean;         // default: false
}
```

### Icon

```typescript
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface DsIconProps {
  name: string;               // required - Lucide icon name
  size?: IconSize;            // default: 'md'
  label?: string;             // optional - accessible name
  color?: string;             // default: 'currentColor'
}
```

### Spinner

```typescript
type SpinnerSize = 'sm' | 'md' | 'lg';

interface DsSpinnerProps {
  size?: SpinnerSize;         // default: 'md'
  label?: string;             // default: 'Loading'
}
```

### VisuallyHidden

```typescript
interface DsVisuallyHiddenProps {
  focusable?: boolean;        // default: false
}
```

## Component Manifest Structure

Each component includes a `manifest.json` following the schema at `packages/docs-core/src/schemas/component-manifest.schema.json`:

```typescript
interface ComponentManifest {
  id: string;                 // kebab-case identifier
  name: string;               // display name
  version: string;            // semver (e.g., "1.0.0")
  status: 'experimental' | 'alpha' | 'beta' | 'stable' | 'deprecated';
  description: string;        // 10-500 chars
  editions: ('core' | 'pro' | 'enterprise')[];
  accessibility: {
    apgPattern: string;       // APG pattern name
    keyboard: string[];       // supported key interactions
    screenReader: string;     // screen reader behavior
    ariaPatterns?: string[];  // ARIA roles/states used
    knownLimitations?: string[];
  };
  tokensUsed?: string[];      // token paths consumed
  recommendedUsage?: string;
  antiPatterns?: string;
  platforms?: ('wc' | 'react' | 'html-recipe')[];
}
```

## Event Naming Convention

All custom events use the `ds:` namespace prefix:

| Event | Component | Payload |
|-------|-----------|---------|
| `ds:click` | Button | `DsClickEventDetail` |
| `ds:navigate` | Link | `DsNavigateEventDetail` |

Events are dispatched with:
- `bubbles: true` - enables event delegation
- `composed: true` - crosses shadow DOM boundaries (future-proofing)
- `cancelable: true` - for `ds:navigate` to allow SPA interception

## CSS Class Naming Convention

All components use the `ds-` prefix with BEM-style modifiers:

```
ds-{component}                    # base class
ds-{component}--{variant}         # variant modifier
ds-{component}--{size}            # size modifier
ds-{component}--{state}           # state modifier (disabled, loading)
```

Examples:
- `ds-button ds-button--primary ds-button--md`
- `ds-link ds-link--external`
- `ds-text ds-text--lg ds-text--muted`
- `ds-spinner ds-spinner--sm`
- `ds-visually-hidden ds-visually-hidden--focusable`

## Validation Rules

### Button
- `disabled` and `loading` are mutually exclusive states (loading takes precedence)
- `type` only applies when button is inside a form

### Link
- `href` is required; empty string renders as span with link styling
- `external` automatically adds `target="_blank"` and `rel="noopener noreferrer"`

### Text
- `as` validated against allowed values; invalid falls back to `span`
- `truncate` requires parent width constraint to function

### Icon
- `name` validated against Lucide icon registry
- Invalid name shows fallback icon in dev, logs warning

### Spinner
- `label` has minimum length requirement for meaningful announcement

### VisuallyHidden
- Content must not be empty (enforced by component warning)
