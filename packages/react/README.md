# @hypoth-ui/react

React adapter components for the hypoth-ui design system. Provides type-safe React wrappers around the underlying Lit Web Components with full support for Server Components and Client Components in Next.js.

## Installation

```bash
npm install @hypoth-ui/react
```

### Peer Dependencies

```bash
npm install @hypoth-ui/wc react react-dom
```

## Usage

### Type Imports (Server-Safe)

```tsx
import type { ButtonProps, DialogRootProps } from '@hypoth-ui/react';
```

### Runtime Components

```tsx
import { DsButton } from '@hypoth-ui/react/client';

function App() {
  return <DsButton variant="primary">Click me</DsButton>;
}
```

### Client Components (Next.js App Router)

```tsx
"use client";
import { Dialog, Input, DsButton } from "@hypoth-ui/react/client";

function MyComponent() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <DsButton>Open Dialog</DsButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Edit Profile</Dialog.Title>
        <Input placeholder="Enter name" />
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

### Compound Component Pattern

Most complex components use the compound pattern:

```tsx
import { Select } from "@hypoth-ui/react/client";

<Select.Root onValueChange={(value) => console.log(value)}>
  <Select.Trigger>
    <Select.Value placeholder="Choose..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Option value="a">Option A</Select.Option>
    <Select.Option value="b">Option B</Select.Option>
  </Select.Content>
</Select.Root>
```

## Documentation

See the [main README](../../README.md) for full documentation and architecture overview.

## License

MIT
