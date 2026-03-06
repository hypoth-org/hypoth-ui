# Implementation Plan: Feedback, Data Display & Utilities

**Branch**: `019-feedback-data-utilities` | **Date**: 2026-01-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/019-feedback-data-utilities/spec.md`

## Summary

Implement 17 UI components organized into feedback (Alert, Toast, Progress, Badge), data display (Avatar/AvatarGroup, Table, DataTable, Skeleton, Tag, List, Tree, Calendar), and utility primitives (Portal, FocusScope, ClientOnly, Slot). All components use the compound component pattern with shared primitives from `@hypoth-ui/primitives-dom`, targeting both Web Components (Lit) and React implementations with API parity. Toast system provides imperative API for both platforms. DataTable uses column definitions as data (TanStack-inspired) with internal virtualization.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (WC), React 18+ (adapter peer dependency), `@hypoth-ui/primitives-dom` (focus-trap, roving-focus, type-ahead)
**Storage**: N/A (stateless UI components)
**Testing**: Vitest (unit), axe-core (a11y), Playwright (e2e)
**Target Platform**: Browser (modern evergreen), SSR/RSC compatible via Next.js App Router
**Project Type**: Monorepo packages (`@hypoth-ui/wc`, `@hypoth-ui/react`, `@hypoth-ui/primitives-dom`)
**Performance Goals**: <45KB gzipped total for all new components; DataTable 100k rows @ 60fps; animations <300ms
**Constraints**: Light DOM only; no Shadow DOM; CSS custom properties for theming; status tokens (info, success, warning, danger)
**Scale/Scope**: 17 components, ~80 functional requirements, 3 priority tiers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; minimal client boundaries; SSR-friendly (Light DOM + CSS vars); virtualization for DataTable
- [x] **Accessibility**: WCAG 2.1 AA plan; APG patterns identified (alert, progressbar, listbox, tree, grid); a11y testing via axe-core + manual checklist
- [x] **Customizability**: Uses DTCG tokens; CSS layers for overrides; semantic status tokens for consistent feedback styling
- [x] **Zero-dep Core**: Core packages remain zero-dep; `@hypoth-ui/wc` depends only on Lit; utilities (Portal, FocusScope) in primitives-dom
- [x] **Web Components**: Light DOM default; Lit-based; theme via CSS vars
- [x] **Dependency Management**: pnpm used; bundle impact assessed (<45KB target)

## Project Structure

### Documentation (this feature)

```text
specs/019-feedback-data-utilities/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (component API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/
├── primitives-dom/
│   └── src/
│       ├── focus/
│       │   ├── focus-trap.ts       # Existing - enhanced for FocusScope
│       │   └── focus-scope.ts      # NEW: FocusScope primitive
│       ├── layer/
│       │   ├── dismissable-layer.ts # Existing
│       │   └── portal.ts           # NEW: Portal primitive
│       ├── behavior/
│       │   ├── tree.ts             # NEW: Tree keyboard behavior
│       │   ├── list.ts             # NEW: List keyboard behavior
│       │   └── table.ts            # NEW: Table sorting/selection behavior
│       └── ssr/
│           └── client-only.ts      # NEW: ClientOnly utility
│
├── wc/
│   └── src/
│       ├── components/
│       │   ├── alert/              # NEW: Alert
│       │   ├── toast/              # NEW: Toast, ToastProvider, toast()
│       │   ├── progress/           # NEW: Progress (linear + circular)
│       │   ├── badge/              # NEW: Badge
│       │   ├── avatar/             # NEW: Avatar, AvatarGroup
│       │   ├── table/              # NEW: Table, TableHeader, TableBody, TableRow, TableCell
│       │   ├── data-table/         # NEW: DataTable (extends Table with virtualization)
│       │   ├── skeleton/           # NEW: Skeleton
│       │   ├── tag/                # NEW: Tag
│       │   ├── list/               # NEW: List, ListItem
│       │   ├── tree/               # NEW: Tree, TreeItem
│       │   └── calendar/           # NEW: Calendar
│       └── index.ts                # Barrel exports
│
├── react/
│   └── src/
│       ├── components/
│       │   ├── alert/              # React wrappers for Alert
│       │   ├── toast/              # React wrappers for Toast + useToast hook
│       │   ├── progress/           # React wrappers for Progress
│       │   ├── badge/              # React wrappers for Badge
│       │   ├── avatar/             # React wrappers for Avatar, AvatarGroup
│       │   ├── table/              # React wrappers for Table components
│       │   ├── data-table/         # React wrappers for DataTable
│       │   ├── skeleton/           # React wrappers for Skeleton
│       │   ├── tag/                # React wrappers for Tag
│       │   ├── list/               # React wrappers for List, ListItem
│       │   ├── tree/               # React wrappers for Tree, TreeItem
│       │   └── calendar/           # React wrappers for Calendar
│       └── primitives/
│           ├── portal.tsx          # NEW: Portal React component
│           ├── focus-scope.tsx     # NEW: FocusScope React component
│           └── client-only.tsx     # NEW: ClientOnly React component
│
└── css/
    └── src/
        └── components/
            ├── alert.css
            ├── toast.css
            ├── progress.css
            ├── badge.css
            ├── avatar.css
            ├── table.css
            ├── data-table.css
            ├── skeleton.css
            ├── tag.css
            ├── list.css
            ├── tree.css
            └── calendar.css
```

**Structure Decision**: Monorepo with separate packages for Web Components (`@hypoth-ui/wc`), React adapters (`@hypoth-ui/react`), CSS (`@hypoth-ui/css`), and behavior primitives (`@hypoth-ui/primitives-dom`). Utility primitives (Portal, FocusScope, ClientOnly) live in primitives-dom for sharing. Each component follows compound component pattern except for simpler components (Alert, Badge, Progress, Skeleton, Tag) which are single elements.

## Complexity Tracking

No constitution violations identified. All requirements align with established patterns.

| Aspect | Status | Notes |
|--------|--------|-------|
| Light DOM | Compliant | All components use Light DOM per constitution |
| Zero-dep Core | Compliant | `@hypoth-ui/wc` depends only on Lit; no new runtime deps |
| Bundle Size | Target: <45KB | DataTable virtualization adds complexity; must verify |
| A11y Patterns | Identified | alert, progressbar, listbox, tree, grid APG patterns |
| Toast Imperative API | Design Decision | Both React hook and WC global/controller export |
