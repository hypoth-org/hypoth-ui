# @hypoth-ui/next

![Alpha](https://img.shields.io/badge/status-alpha-orange)

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

Then use components in any page or Server Component:

```tsx
import { Button } from '@hypoth-ui/react';

export default function Page() {
  return <Button variant="primary">Click me</Button>;
}
```

## Documentation

See the [main README](../../README.md) for full documentation and architecture overview.

## License

MIT
