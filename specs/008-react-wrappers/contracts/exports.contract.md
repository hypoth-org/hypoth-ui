# Contract: Package Exports

**Package**: `@ds/react`
**Path**: `packages/react/`

## Purpose

Define the public API surface for the React package, ensuring correct server/client component boundaries for Next.js App Router.

## Export Structure

### Main Entry (`index.ts`)

Server-safe exports - types and re-exports that don't require `'use client'`:

```typescript
// packages/react/src/index.ts

// Type exports (zero runtime, server-safe)
export type {
  // Components
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  LinkProps,
  LinkVariant,
  InputProps,
  InputType,
  InputSize,
  TextProps,
  TextSize,
  TextWeight,
  TextVariant,
  IconProps,
  IconSize,
  SpinnerProps,
  SpinnerSize,
  VisuallyHiddenProps,

  // Primitives
  BoxProps,
  SpacingValue,
  DisplayValue,
  FlexDirection,
  AlignValue,
  JustifyValue,
  SlotProps,
  AsChildProps,

  // Events
  DsNavigateEventDetail,
  DsInputEventDetail,
  NavigateEventHandler,
  InputValueHandler,
} from './types';

// Utilities (no client-side effects)
export { createComponent, type WrapperConfig } from './utils/create-component';
export { mergeProps } from './utils/merge-props';
```

### Client Entry (`client.ts`)

Interactive components requiring `'use client'`:

```typescript
// packages/react/src/client.ts
'use client';

// WC Wrappers
export { Button } from './components/button';
export { Link } from './components/link';
export { Input } from './components/input';
export { Icon } from './components/icon';
export { Spinner } from './components/spinner';
export { VisuallyHidden } from './components/visually-hidden';

// React-only components
export { Text } from './components/text';
export { Box } from './primitives/box';
export { Slot } from './primitives/slot';
```

## package.json Exports

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./client": {
      "types": "./dist/client.d.ts",
      "import": "./dist/client.js"
    },
    "./package.json": "./package.json"
  }
}
```

## Usage Patterns

### Server Component (Types Only)

```tsx
// app/components/hero.tsx (Server Component)
import type { TextProps, ButtonProps } from '@ds/react';

interface HeroProps {
  titleSize?: TextProps['size'];
  ctaVariant?: ButtonProps['variant'];
}

export function Hero({ titleSize = 'xl', ctaVariant = 'primary' }: HeroProps) {
  return (
    <section>
      <ClientHeading size={titleSize}>Welcome</ClientHeading>
      <ClientButton variant={ctaVariant}>Get Started</ClientButton>
    </section>
  );
}
```

### Client Component (Interactive)

```tsx
// app/components/client-button.tsx
'use client';
import { Button } from '@ds/react/client';
export { Button as ClientButton };

// app/components/client-heading.tsx
'use client';
import { Text } from '@ds/react/client';

export function ClientHeading(props: React.ComponentProps<typeof Text>) {
  return <Text {...props} asChild><h1>{props.children}</h1></Text>;
}
```

### Direct Client Usage

```tsx
// app/page.tsx
'use client';
import { Button, Link, Text, Box } from '@ds/react/client';

export default function Page() {
  return (
    <Box p={4}>
      <Text size="xl">Hello</Text>
      <Button onClick={() => {}}>Click</Button>
    </Box>
  );
}
```

## Import Rules

| Import Path | Use Case | Requires 'use client' |
|-------------|----------|----------------------|
| `@ds/react` | Types, utilities | No |
| `@ds/react/client` | Interactive components | Yes |

## Validation

### Server Component Errors

```tsx
// ❌ This will error in a Server Component
import { Button } from '@ds/react/client';
// Error: You're importing a component that needs 'use client'

// ✅ This works in a Server Component
import type { ButtonProps } from '@ds/react';
```

### Client Boundary Detection

```tsx
// ❌ Importing client components without 'use client'
import { Button } from '@ds/react/client';
export function MyComponent() {
  return <Button>Click</Button>;
}
// Next.js error: You need to add "use client" directive

// ✅ Correct usage
'use client';
import { Button } from '@ds/react/client';
export function MyComponent() {
  return <Button>Click</Button>;
}
```

## Tree-Shaking

All exports are individually tree-shakeable:

```tsx
// Only Button code is included in bundle
import { Button } from '@ds/react/client';

// Only types - zero runtime cost
import type { ButtonProps, LinkProps } from '@ds/react';
```

## Bundle Impact Targets

| Export | Size Target |
|--------|-------------|
| `@ds/react` (types only) | 0 bytes runtime |
| `@ds/react/client` (all components) | <6KB minified |
| Individual component | <1KB each |

## sideEffects

```json
{
  "sideEffects": false
}
```

All exports are pure - no side effects on import.
