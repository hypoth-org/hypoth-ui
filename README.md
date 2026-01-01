# Hypoth UI - White-Label Design System

A production-ready, white-label design system monorepo built with Web Components and React adapters.

## Features

- 🎨 **Token-Driven Theming** - DTCG-compliant design tokens with CSS custom properties
- 🧩 **Web Components** - Lit-based Light DOM components for any framework
- ⚛️ **React Integration** - Type-safe React wrapper components
- 📱 **Next.js Support** - Single client loader pattern for App Router
- 📚 **Tenant Documentation** - Edition-filtered docs with white-label branding
- ♿ **Accessible** - WCAG 2.1 AA compliant components

## Quick Start

### Installation

```bash
# Install design system packages
pnpm add @ds/wc @ds/css @ds/tokens

# For React projects
pnpm add @ds/react

# For Next.js projects
pnpm add @ds/next
```

### Basic Usage

```html
<!-- Import CSS -->
<link rel="stylesheet" href="node_modules/@ds/css/dist/index.css">

<!-- Use components -->
<script type="module">
  import '@ds/wc';
</script>

<ds-button variant="primary">Click me</ds-button>
```

### React Usage

```tsx
import '@ds/css';
import { Button } from '@ds/react';

function App() {
  return <Button variant="primary" onClick={() => alert('Clicked!')}>Click me</Button>;
}
```

### Next.js Usage

```tsx
// app/layout.tsx
import '@ds/css';
import { DsLoader } from '@ds/next';

export default function RootLayout({ children }) {
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

## Packages

| Package | Description |
|---------|-------------|
| `@ds/tokens` | Design tokens (colors, spacing, typography) |
| `@ds/css` | CSS layers (reset, tokens, base, utilities) |
| `@ds/wc` | Web Components (Lit Light DOM) |
| `@ds/react` | React wrapper components |
| `@ds/next` | Next.js App Router integration |
| `@ds/primitives-dom` | DOM utilities (focus, keyboard, ARIA) |
| `@ds/docs-core` | Documentation engine with filtering |
| `@ds/docs-content` | Component manifests and content |
| `@ds/docs-renderer-next` | Next.js docs site renderer |

## Development

### Prerequisites

- Node.js 20+
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/hypoth-org/hypoth-ui.git
cd hypoth-ui

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development
pnpm dev
```

### Scripts

```bash
pnpm build          # Build all packages
pnpm dev            # Start development servers
pnpm lint           # Run Biome linter
pnpm typecheck      # Type check all packages
pnpm test           # Run unit tests
pnpm test:e2e       # Run E2E tests
pnpm new-component  # Generate a new component
pnpm validate:manifests  # Validate component manifests
```

### Adding Components

Use the component generator:

```bash
pnpm new-component card layout "A container for grouping content"
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## Theming

Override CSS custom properties to customize the theme:

```css
:root {
  --ds-color-primary-default: #ff6600;
  --ds-color-primary-hover: #cc5200;
  --ds-spacing-md: 1rem;
}
```

### Dark Mode

```html
<html data-theme="dark">
```

### High Contrast

```html
<html data-theme="high-contrast">
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Applications                      │
│  ┌─────────────┐  ┌─────────────┐                   │
│  │  Demo App   │  │  Docs App   │                   │
│  └─────────────┘  └─────────────┘                   │
├─────────────────────────────────────────────────────┤
│                     Adapters                         │
│  ┌─────────────┐  ┌─────────────┐                   │
│  │   @ds/react │  │   @ds/next  │                   │
│  └─────────────┘  └─────────────┘                   │
├─────────────────────────────────────────────────────┤
│                  Core Components                     │
│  ┌─────────────┐  ┌─────────────┐                   │
│  │   @ds/wc    │  │ primitives  │                   │
│  └─────────────┘  └─────────────┘                   │
├─────────────────────────────────────────────────────┤
│                    Foundation                        │
│  ┌─────────────┐  ┌─────────────┐                   │
│  │ @ds/tokens  │  │   @ds/css   │                   │
│  └─────────────┘  └─────────────┘                   │
└─────────────────────────────────────────────────────┘
```

## Components

| Component | Status | Description |
|-----------|--------|-------------|
| Button | Stable | Interactive button for actions |
| Input | Stable | Text input field |

## Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 15+

## License

MIT © Hypoth

---

Built with ❤️ using [Claude Code](https://claude.com/claude-code)
