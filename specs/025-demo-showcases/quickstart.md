# Quickstart: Framework-Specific Demo Showcases

**Date**: 2026-01-16
**Feature**: 025-demo-showcases

## Prerequisites

- Node.js 20+
- pnpm 10+
- Monorepo dependencies installed (`pnpm install` at root)

## Development

### Running Both Demos

```bash
# From monorepo root
pnpm dev
```

This starts:
- **demo-react**: http://localhost:3001
- **demo-wc**: http://localhost:3002

### Running Individual Demos

```bash
# React demo only
pnpm --filter @ds/demo-react dev

# Web Component demo only
pnpm --filter @ds/demo-wc dev
```

### Building

```bash
# Build all packages including demos
pnpm build

# Build specific demo
pnpm --filter @ds/demo-react build
pnpm --filter @ds/demo-wc build
```

## Project Structure

```
apps/
├── demo-react/     # Next.js React demo (port 3001)
└── demo-wc/        # Vite Web Component demo (port 3002)

packages/
└── demo-shared/    # Shared mock data and navigation config
```

## Key Files

### demo-react

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with theme provider |
| `components/app-shell.tsx` | Main layout (header, sidebar, content) |
| `components/theme-toggle.tsx` | Light/dark mode switch |

### demo-wc

| File | Purpose |
|------|---------|
| `src/main.ts` | Entry point, custom element registration |
| `src/app-shell.ts` | Main layout web component |
| `src/components/theme-toggle.ts` | Theme switch web component |

### demo-shared

| File | Purpose |
|------|---------|
| `src/navigation.ts` | Sidebar navigation config |
| `src/mock-data/` | Users, products, notifications |
| `src/content/` | Section content configurations |

## Testing

### Unit Tests

```bash
pnpm --filter @ds/demo-shared test
```

### E2E Tests

```bash
# Run E2E tests for both demos
pnpm test:e2e

# Visual regression tests
pnpm test:e2e --project=visual-regression
```

### Accessibility Tests

```bash
pnpm --filter @ds/demo-react test:a11y
pnpm --filter @ds/demo-wc test:a11y
```

## Common Tasks

### Adding a New Navigation Section

1. Update `packages/demo-shared/src/navigation.ts`
2. Add content config in `packages/demo-shared/src/content/`
3. Create page in both demos:
   - React: `apps/demo-react/app/[section]/page.tsx`
   - WC: `apps/demo-wc/src/pages/[section].ts`

### Modifying Theme Behavior

Theme logic is implemented independently in each demo but follows the same contract:

- React: `apps/demo-react/components/theme-toggle.tsx`
- WC: `apps/demo-wc/src/components/theme-toggle.ts`

Both use localStorage key: `ds-demo-theme`

### Updating Mock Data

All mock data lives in `packages/demo-shared/src/mock-data/`. Changes automatically reflect in both demos after rebuild.

## Verification Checklist

After making changes, verify:

- [ ] Both demos start without errors
- [ ] Navigation works in both demos
- [ ] Theme toggle persists across refresh
- [ ] Responsive breakpoints work (desktop, tablet, mobile)
- [ ] Visual regression tests pass
- [ ] Accessibility tests pass

## Troubleshooting

### Demo won't start

```bash
# Rebuild dependencies
pnpm --filter @ds/demo-shared build
pnpm --filter @ds/wc build
pnpm --filter @ds/react build
```

### Theme not persisting

Check browser localStorage for `ds-demo-theme` key. Clear and refresh to reset to system preference.

### Visual regression failures

```bash
# Update snapshots after intentional changes
pnpm test:e2e --update-snapshots
```
