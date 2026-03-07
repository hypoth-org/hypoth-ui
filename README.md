# hypoth-ui

**A modern, accessible design system with Web Components and React adapters.**

![Alpha](https://img.shields.io/badge/status-alpha-orange)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

---

## Architecture

hypoth-ui provides **accessible behavior** (ARIA, keyboard, focus management) through React components and Web Components, with **styling via CSS layers and design tokens**. Components are headless by default — they handle behavior and accessibility, and you style them with the provided token-based CSS or your own styles.

| Layer | Package | What it provides |
|-------|---------|-----------------|
| **Behavior** | `@hypoth-ui/react` or `@hypoth-ui/wc` | Accessible components (ARIA, keyboard, focus) |
| **Tokens** | `@hypoth-ui/tokens` | CSS custom properties for colors, spacing, typography |
| **Styles** | `@hypoth-ui/css` | Base component styles using CSS layers |
| **Next.js** | `@hypoth-ui/next` | App Router integration (WC registration, SSR) |
| **CLI** | `@hypoth-ui/cli` | Copy component source into your project (shadcn-style) |

---

## Getting Started — Package Mode

**1. Install packages:**

```bash
npm install @hypoth-ui/react @hypoth-ui/tokens @hypoth-ui/css
```

**2. Import the base CSS in your app entry point:**

```ts
import '@hypoth-ui/css';
```

**3. Import and use a component:**

```tsx
import { Button } from '@hypoth-ui/react';

export default function App() {
  return <Button onPress={() => console.log('clicked')}>Click me</Button>;
}
```

Components provide accessible behavior out of the box. Use `@hypoth-ui/css` for base styles, or apply your own CSS classes.

---

## Getting Started — Copy Mode

Copy component source files directly into your project for full customization control (similar to shadcn/ui).

**1. Initialize configuration:**

```bash
npx @hypoth-ui/cli init
```

**2. Add components:**

```bash
npx @hypoth-ui/cli add button dialog
```

**3. Use the `--copy` flag to copy source files into your components directory:**

```bash
npx @hypoth-ui/cli add button --copy
```

Files are copied to your configured components directory with transformed imports, giving you full ownership of the source code.

---

## Package Mode vs Copy Mode

|  | Package Mode | Copy Mode |
|---|---|---|
| Updates | npm update | Manual re-copy |
| Customization | CSS tokens & layers | Full source control |
| Setup | npm install | CLI init + add |
| Best for | Most projects | Deep customization |

---

## Framework Quick-Starts

### React

```tsx
import '@hypoth-ui/css';
import { Button, Dialog } from '@hypoth-ui/react';

export default function App() {
  return (
    <Dialog>
      <Dialog.Trigger>
        <Button>Open</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <p>Dialog content here.</p>
      </Dialog.Content>
    </Dialog>
  );
}
```

### Web Components

```html
<script type="module">
  import '@hypoth-ui/wc';
</script>

<link rel="stylesheet" href="node_modules/@hypoth-ui/css/dist/index.css" />

<ds-button>Click me</ds-button>
<ds-dialog>
  <ds-button slot="trigger">Open</ds-button>
  <p>Dialog content here.</p>
</ds-dialog>
```

### Next.js (App Router)

Register Web Components once in your root layout using `@hypoth-ui/next`, then use React adapter components in Server Components.

```tsx
// app/layout.tsx
import '@hypoth-ui/css';
import { DsLoader } from '@hypoth-ui/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DsLoader />
        {children}
      </body>
    </html>
  );
}
```

```tsx
// app/page.tsx
import { Button } from '@hypoth-ui/react';

export default function Page() {
  return <Button onPress={() => console.log('clicked')}>Click me</Button>;
}
```

---

## Tooling & Documentation Packages

| Package | Description |
|---------|-------------|
| `@hypoth-ui/primitives-dom` | DOM behavior primitives (focus trap, roving focus) |
| `@hypoth-ui/docs-core` | Documentation engine |
| `@hypoth-ui/docs-content` | Documentation content packs |
| `@hypoth-ui/docs-renderer-next` | Next.js docs renderer |
| `@hypoth-ui/test-utils` | Test utilities |
| `@hypoth-ui/a11y-audit` | Accessibility audit tools |

---

## Alpha Notice

> **Alpha:** APIs may change between minor versions before 1.0. Pin your versions for stability.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, coding standards, and contribution guidelines.

---

## License

[MIT](./LICENSE)
