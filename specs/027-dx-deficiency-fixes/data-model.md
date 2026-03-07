# Data Model: DX Deficiency Fixes

**Date**: 2026-03-07
**Branch**: `027-dx-deficiency-fixes`

This feature is primarily about API surface changes, dependency graph fixes, and documentation — not data persistence. The "data model" here describes the structural relationships between packages, entry points, and component exports.

## Package Dependency Graph (Target State)

```
@hypoth-ui/tokens (0 runtime deps)
    ↑ peerDep
@hypoth-ui/css (0 runtime deps; @hypoth-ui/wc in devDependencies only)
    ↑ peerDep
@hypoth-ui/wc (runtime dep: lit)
    ↑ peerDep
@hypoth-ui/react (runtime dep: @hypoth-ui/primitives-dom; peerDeps: react, react-dom, @hypoth-ui/wc >=0.1.0)
    ↑ peerDep
@hypoth-ui/next (peerDeps: react, react-dom, next ^14||^15, @hypoth-ui/react >=0.1.2, @hypoth-ui/wc >=0.1.2)
```

No circular dependencies. CSS → WC link is devDependencies-only (build time).

## Entry Point Export Map (Target State)

### @hypoth-ui/react (main entry — `"use client"`)

| Export Name | Type | Source File | Description |
|-------------|------|-------------|-------------|
| `Button` | Component | `components/button/button.tsx` | Headless button with onPress |
| `ButtonProps` | Type | `components/button/index.ts` | Props interface |
| `EmptyState` | Component | `components/empty-state/index.tsx` | Empty state container (new) |
| `EmptyStateProps` | Type | `components/empty-state/index.tsx` | Props interface (new) |
| *(all other components)* | Component | *(unchanged)* | ~55 existing components |

Removed from main entry:
- `LegacyButton` alias (was `Button as LegacyButton` from `./components/button.js`)
- `LegacyButtonProps`, `ButtonVariant`, `ButtonSize` type re-exports from WC wrapper

### @hypoth-ui/react/client (`"use client"`)

| Export Name | Type | Source File | Description |
|-------------|------|-------------|-------------|
| `DsButton` | Component | `components/button.tsx` | WC-wrapping button (renamed) |
| `DsButtonProps` | Type | `components/button.tsx` | Props interface (renamed) |
| `ButtonVariant` | Type | `components/button.tsx` | Variant union type |
| `ButtonSize` | Type | `components/button.tsx` | Size union type |
| *(all other WC wrappers)* | Component | *(unchanged)* | Existing WC wrapper exports |

## Event Naming Convention

### Mapping Rule

```
WC CustomEvent name     →  React prop name
─────────────────────      ──────────────────
ds:{action}             →  on{PascalAction}
ds:{noun}-{verb}        →  on{PascalNounVerb}
```

### Canonical Event Map

| WC Event | React Prop | Components |
|----------|-----------|------------|
| `ds:change` | `onChange` | Checkbox, Switch, RadioGroup |
| `ds:change` (value) | `onValueChange` | Accordion, Tabs, Input |
| `ds:open-change` | `onOpenChange` | Dialog, Select, Drawer, Menu, DatePicker, Combobox |
| `ds:press` | `onPress` | Button (headless) |
| `ds:select` | `onSelect` | Menu |
| Native `click` | `onClick` | DsButton (WC wrapper — standard DOM) |

## EmptyState Component Structure

```
EmptyState (container)
├── EmptyState.Icon        (optional, decorative icon)
├── EmptyState.Title       (required, heading text)
├── EmptyState.Description (optional, body text)
└── EmptyState.Action      (optional, CTA button/link)
```

### WC Tag Mapping

| React Component | WC Tag | HTML Role |
|----------------|--------|-----------|
| `EmptyState` | `<ds-empty-state>` | `<section>` with role="status" |
| `EmptyState.Icon` | (child element) | decorative, `aria-hidden="true"` |
| `EmptyState.Title` | (child element) | `<h3>` |
| `EmptyState.Description` | (child element) | `<p>` |
| `EmptyState.Action` | (child element) | button/link |
