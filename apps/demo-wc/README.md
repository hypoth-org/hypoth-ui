# @ds/demo-wc

Web Components demo application showcasing the Hypoth UI design system using Lit and Vite.

## Prerequisites

- Node.js 20+
- pnpm 10+

## Setup

From the monorepo root:

```bash
pnpm install
pnpm build          # Build all packages first
```

## Development

```bash
# From monorepo root
pnpm dev:demo-wc

# Or directly
pnpm --filter @ds/demo-wc dev
```

The app runs at **http://localhost:3002**.

## Sections

| Route            | Description                                  |
| ---------------- | -------------------------------------------- |
| `#dashboard`     | Dashboard overview                           |
| `#forms`         | Input, Textarea, Checkbox, Radio, Switch, Select |
| `#data-display`  | Table, Card, Avatar, Badge, Tag              |
| `#overlays`      | Dialog, Sheet, Drawer, Tooltip               |
| `#feedback`      | Alert, Toast, Progress, Spinner, Skeleton    |

## Architecture

- **Routing**: Hash-based (`#section`) via vanilla JS in `src/main.ts`
- **Components**: Lit custom elements with Light DOM (global CSS applies)
- **Theme**: `localStorage` persistence with system preference fallback
- **Styling**: Shared `globals.css` mirroring the React demo for visual parity

## Key Files

| File                            | Purpose                           |
| ------------------------------- | --------------------------------- |
| `src/main.ts`                   | Entry point, router, app init     |
| `src/components/app-shell.ts`   | Main layout (sidebar + header)    |
| `src/components/sidebar-nav.ts` | Navigation sidebar                |
| `src/utils/theme.ts`            | Theme management + localStorage   |
| `src/pages/*.ts`                | Section page components           |
| `styles/globals.css`            | Layout and responsive styles      |

## Build

```bash
pnpm --filter @ds/demo-wc build
```

Output is generated in `dist/`.
