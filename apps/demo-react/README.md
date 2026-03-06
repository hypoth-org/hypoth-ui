# @hypoth-ui/demo-react

React/Next.js demo application showcasing the Hypoth UI design system.

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
pnpm dev:demo-react

# Or directly
pnpm --filter @hypoth-ui/demo-react dev
```

The app runs at **http://localhost:3001**.

## Sections

| Route          | Description                                  |
| -------------- | -------------------------------------------- |
| `/`            | Dashboard overview                           |
| `/forms`       | Input, Textarea, Checkbox, Radio, Switch, Select |
| `/data-display`| Table, Card, Avatar, Badge, Tag              |
| `/overlays`    | Dialog, Sheet, Drawer, Tooltip               |
| `/feedback`    | Alert, Toast, Progress, Spinner, Skeleton    |

## Key Files

| File                           | Purpose                          |
| ------------------------------ | -------------------------------- |
| `app/layout.tsx`               | Root layout with providers       |
| `app/page.tsx`                 | Dashboard home page              |
| `components/app-shell.tsx`     | Main layout (sidebar + header)   |
| `components/sidebar-nav.tsx`   | Navigation sidebar               |
| `components/theme-provider.tsx`| Theme context + localStorage     |
| `components/theme-toggle.tsx`  | Dark/light mode switch           |
| `styles/globals.css`           | Layout and responsive styles     |

## Testing

```bash
# E2E tests
pnpm test:e2e

# Visual regression
pnpm test:e2e -- --project=visual-desktop
```

## Build

```bash
pnpm --filter @hypoth-ui/demo-react build
```
