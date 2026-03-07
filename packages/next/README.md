# @hypoth-ui/next

Next.js App Router integration for hypoth-ui Web Components. Provides a client-side loader that registers custom elements for use with Server Components and React Server Components (RSC).

## Installation

```bash
npm install @hypoth-ui/next
```

### Peer Dependencies

```bash
npm install @hypoth-ui/wc @hypoth-ui/react next react react-dom
```

## Usage

Add `HypothUIProvider` to your root layout to register all custom elements client-side:

```tsx
// app/layout.tsx
import '@hypoth-ui/css';
import { DsLoader } from '@hypoth-ui/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <DsLoader />
        {children}
      </body>
    </html>
  );
}
```

Then use components in any client component or page:

```tsx
"use client";
import { DsButton } from '@hypoth-ui/react/client';

export default function Page() {
  return <DsButton variant="primary">Click me</DsButton>;
}
```

## Selective Component Loading

By default, `DsLoader` registers all Web Components. Use `include` or `exclude` to load only the components you need, reducing bundle size:

```tsx
// Register only specific components
<DsLoader include={["ds-button", "ds-dialog", "ds-input"]} />

// Register all except specific components
<DsLoader exclude={["ds-data-table"]} />
```

When both `include` and `exclude` are provided, `include` takes precedence.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `include` | `ComponentTag[]` | Only register these component tags |
| `exclude` | `ComponentTag[]` | Register all except these tags (ignored if `include` is set) |
| `debug` | `boolean` | Enable console logging for registration |
| `onLoad` | `() => void` | Callback fired after all components are registered |

### Debug Mode

Enable `debug` to see which components are registered and catch unknown tag names:

```tsx
<DsLoader include={["ds-button"]} debug onLoad={() => console.log("Components ready")} />
```

## Documentation

See the [main README](../../README.md) for full documentation and architecture overview.

## License

MIT
