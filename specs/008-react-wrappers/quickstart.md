# Quickstart: React Wrappers for Web Components

**Date**: 2026-01-03
**Feature**: 008-react-wrappers
**Phase**: 1 (Design)

## Installation

```bash
pnpm add @ds/react @ds/wc @ds/css
```

## Basic Usage

### Type-Safe Components

```tsx
// app/page.tsx (Next.js App Router)
'use client';

import { Button, Link, Input, Text, Box } from '@ds/react/client';

export default function Page() {
  return (
    <Box p={4} display="flex" flexDirection="column" gap={4}>
      <Text size="xl" weight="bold">Welcome</Text>

      <Input
        type="email"
        placeholder="Enter your email"
        onValueChange={(value) => console.log(value)}
      />

      <Button
        variant="primary"
        onClick={() => console.log('clicked')}
      >
        Submit
      </Button>

      <Link href="/about" variant="default">
        Learn more
      </Link>
    </Box>
  );
}
```

### Using asChild for Polymorphism

The `asChild` prop lets you render a different element while keeping the component's styling:

```tsx
import { Text, Link, Box } from '@ds/react/client';
import NextLink from 'next/link';

// Render Text as an h1
<Text size="2xl" weight="bold" asChild>
  <h1>Page Title</h1>
</Text>

// Render Link with Next.js router
<Link href="/dashboard" asChild>
  <NextLink href="/dashboard">Dashboard</NextLink>
</Link>

// Render Box as a section
<Box p={6} display="flex" asChild>
  <section aria-label="Features">
    {/* content */}
  </section>
</Box>
```

### Server vs Client Components

```tsx
// app/layout.tsx - Server Component
import type { ButtonProps } from '@ds/react'; // Types are server-safe

export default function Layout({ children }) {
  return <html><body>{children}</body></html>;
}

// app/interactive.tsx - Client Component
'use client';
import { Button } from '@ds/react/client'; // Components need 'use client'

export function InteractiveButton(props: ButtonProps) {
  return <Button {...props} />;
}
```

## Component Examples

### Button

```tsx
import { Button } from '@ds/react/client';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>

// With click handler
<Button onClick={(e) => console.log('Clicked', e)}>
  Click me
</Button>
```

### Link

```tsx
import { Link } from '@ds/react/client';

// Basic link
<Link href="/about">About Us</Link>

// External link (opens in new tab)
<Link href="https://example.com" external>
  External Site
</Link>

// Handle navigation event
<Link
  href="/dashboard"
  onNavigate={(event) => {
    // Access event details
    console.log(event.detail.href);
    console.log(event.detail.external);

    // Prevent navigation if needed
    event.preventDefault();
  }}
>
  Dashboard
</Link>

// With Next.js Link (asChild)
import NextLink from 'next/link';

<Link href="/products" asChild>
  <NextLink href="/products" prefetch>Products</NextLink>
</Link>
```

### Input

```tsx
import { Input } from '@ds/react/client';

// Basic input
<Input placeholder="Enter text" />

// With value change handler (fires on every keystroke)
<Input
  type="email"
  onValueChange={(value, event) => {
    console.log('Current value:', value);
  }}
/>

// With change handler (fires on blur)
<Input
  type="password"
  onChange={(value, event) => {
    console.log('Final value:', value);
  }}
/>

// Validation states
<Input error placeholder="Invalid input" />
<Input disabled placeholder="Cannot edit" />
<Input required placeholder="Required field" />
```

### Text

```tsx
import { Text } from '@ds/react/client';

// Sizes
<Text size="xs">Extra small</Text>
<Text size="sm">Small</Text>
<Text size="md">Medium (default)</Text>
<Text size="lg">Large</Text>
<Text size="xl">Extra large</Text>
<Text size="2xl">2X Large</Text>

// Weights
<Text weight="normal">Normal weight</Text>
<Text weight="medium">Medium weight</Text>
<Text weight="semibold">Semibold weight</Text>
<Text weight="bold">Bold weight</Text>

// Variants (colors)
<Text variant="default">Default text</Text>
<Text variant="muted">Muted text</Text>
<Text variant="success">Success text</Text>
<Text variant="warning">Warning text</Text>
<Text variant="error">Error text</Text>

// Truncation
<Text truncate>This long text will be truncated with ellipsis...</Text>

// As semantic element
<Text size="2xl" weight="bold" asChild>
  <h1>Page Heading</h1>
</Text>

<Text asChild>
  <p>This is a paragraph with default text styling.</p>
</Text>
```

### Box

```tsx
import { Box } from '@ds/react/client';

// Spacing (padding)
<Box p={4}>Padding all sides</Box>
<Box px={4} py={2}>Horizontal and vertical padding</Box>
<Box pt={4} pb={2}>Top and bottom padding</Box>

// Spacing (margin)
<Box m={4}>Margin all sides</Box>
<Box mx="auto">Centered horizontally</Box>

// Flexbox layout
<Box display="flex" flexDirection="row" gap={4} alignItems="center">
  <span>Item 1</span>
  <span>Item 2</span>
</Box>

// Flexbox column
<Box display="flex" flexDirection="column" gap={2}>
  <span>Top</span>
  <span>Bottom</span>
</Box>

// Grid layout
<Box display="grid" gap={4}>
  <div>Cell 1</div>
  <div>Cell 2</div>
</Box>

// As semantic element
<Box p={6} asChild>
  <main>Main content area</main>
</Box>

<Box display="flex" gap={4} asChild>
  <nav>Navigation items</nav>
</Box>
```

### Icon

```tsx
import { Icon } from '@ds/react/client';

// Decorative icon (hidden from screen readers)
<Icon name="search" />

// Meaningful icon (announced to screen readers)
<Icon name="alert-triangle" label="Warning" />

// Sizes
<Icon name="star" size="xs" />
<Icon name="star" size="sm" />
<Icon name="star" size="md" />
<Icon name="star" size="lg" />
<Icon name="star" size="xl" />

// Custom color
<Icon name="heart" color="red" />
<Icon name="check" color="var(--ds-color-success)" />
```

### Spinner

```tsx
import { Spinner } from '@ds/react/client';

// Basic spinner
<Spinner />

// With custom label
<Spinner label="Loading content..." />

// Sizes
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />

// In a loading container
<div aria-busy={isLoading}>
  {isLoading && <Spinner label="Fetching data" />}
  {!isLoading && <Content />}
</div>
```

### VisuallyHidden

```tsx
import { VisuallyHidden } from '@ds/react/client';
import { Icon } from '@ds/react/client';

// Hidden label for icon button
<button>
  <Icon name="trash" />
  <VisuallyHidden>Delete item</VisuallyHidden>
</button>

// Skip link (visible on focus)
<VisuallyHidden focusable>
  <a href="#main-content">Skip to main content</a>
</VisuallyHidden>
```

## Next.js App Router Integration

### Custom Elements Registration

```tsx
// app/providers.tsx
'use client';

import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Import @ds/wc to register custom elements
    import('@ds/wc');
  }, []);

  return <>{children}</>;
}

// app/layout.tsx
import { Providers } from './providers';
import '@ds/css/index.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Hybrid Server/Client Pattern

```tsx
// components/hero.tsx - Server Component
import type { TextProps } from '@ds/react';

interface HeroProps {
  title: string;
  titleSize?: TextProps['size'];
}

export function Hero({ title, titleSize = 'xl' }: HeroProps) {
  return (
    <section>
      <ClientText size={titleSize}>{title}</ClientText>
    </section>
  );
}

// components/client-text.tsx - Client Component
'use client';
import { Text } from '@ds/react/client';

export function ClientText(props: React.ComponentProps<typeof Text>) {
  return <Text {...props} />;
}
```

## TypeScript Tips

### Extracting Component Props

```tsx
import type { Button, Link } from '@ds/react/client';
import type { ComponentProps } from 'react';

// Get props type from component
type MyButtonProps = ComponentProps<typeof Button>;
type MyLinkProps = ComponentProps<typeof Link>;
```

### Type-Safe Event Handlers

```tsx
import type { DsNavigateEventDetail } from '@ds/react';

function handleNavigate(event: CustomEvent<DsNavigateEventDetail>) {
  if (event.detail.external) {
    // Track external link click
    analytics.track('external_link', { href: event.detail.href });
  }
}
```
