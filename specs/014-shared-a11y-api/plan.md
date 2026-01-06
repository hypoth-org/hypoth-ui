# Implementation Plan: Shared Accessible Component API

**Branch**: `014-shared-a11y-api` | **Date**: 2026-01-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-shared-a11y-api/spec.md`

## Summary

Create a shared behavior primitive layer in `@ds/primitives-dom` that provides headless state machines, ARIA computation, and keyboard handlers for Button, Dialog, and Menu components. Both `@ds/react` (native React components with compound patterns and asChild) and `@ds/wc` (Lit-based Web Components) consume these primitives, ensuring identical accessibility behavior across frameworks.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (WC only), React 18+ (React adapter peer dependency)
**Storage**: N/A (stateless UI components)
**Testing**: Vitest 1.x (unit tests), axe-core (a11y automation), Playwright (e2e)
**Target Platform**: Browser (modern evergreen), SSR-compatible (Next.js 14+ App Router)
**Project Type**: Monorepo with multiple packages
**Performance Goals**: ≤3KB gzipped per behavior primitive module; no bundle size increase for WC-only consumers
**Constraints**: Zero runtime dependencies for `@ds/primitives-dom`; Light DOM only for WC
**Scale/Scope**: 3 components (Button, Dialog, Menu) as proof-of-concept; 14 remaining components deferred

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; behavior primitives are pure JS with no styling; SSR-friendly (framework-agnostic core)
- [x] **Accessibility**: WCAG 2.1 AA plan via shared ARIA computation; APG patterns (Dialog Modal, Menu Button) identified; axe-core + manual keyboard testing strategy defined
- [x] **Customizability**: Styling remains via DTCG tokens and CSS layers; behavior primitives are headless (no style opinions)
- [x] **Zero-dep Core**: `@ds/primitives-dom` remains zero runtime dependencies; behavior primitives are pure TypeScript
- [x] **Web Components**: Light DOM default maintained; Lit-based; WC consumes same primitives as React
- [x] **Dependency Management**: No new runtime dependencies; pnpm workspace protocol for internal deps

## Project Structure

### Documentation (this feature)

```text
specs/014-shared-a11y-api/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (TypeScript interfaces)
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
packages/
├── primitives-dom/           # Expanded with behavior primitives
│   └── src/
│       ├── behavior/         # NEW: Component behavior primitives
│       │   ├── button.ts     # Button state + ARIA + keyboard
│       │   ├── dialog.ts     # Dialog state + ARIA + keyboard + focus
│       │   └── menu.ts       # Menu state + ARIA + keyboard + roving focus
│       ├── focus/            # Existing: focus-trap.ts
│       ├── keyboard/         # Existing: roving-focus.ts, type-ahead.ts, etc.
│       ├── layer/            # Existing: dismissable-layer.ts
│       └── index.ts          # Updated exports
│
├── react/                    # Native React components (rewritten)
│   └── src/
│       ├── primitives/       # Slot, Presence utilities
│       ├── components/
│       │   ├── button/       # Native React Button (compound: Button)
│       │   ├── dialog/       # Native React Dialog (compound: Root, Trigger, Content, Title, Description)
│       │   └── menu/         # Native React Menu (compound: Root, Trigger, Content, Item)
│       └── utils/
│           └── create-context.ts  # Compound component context factory
│
├── wc/                       # Web Components (refactored to use primitives)
│   └── src/
│       ├── components/
│       │   ├── button/       # DsButton using behavior/button.ts
│       │   ├── dialog/       # DsDialog using behavior/dialog.ts
│       │   └── menu/         # DsMenu using behavior/menu.ts
│       └── base/
│           └── ds-element.ts # Base class (unchanged)
│
└── [other packages unchanged]
```

**Structure Decision**: Monorepo with behavior primitives in `@ds/primitives-dom`, consumed by both `@ds/react` (native React) and `@ds/wc` (Lit WC). This follows the recommended "Behavior Hooks + Adapters" approach from the spec.

## Complexity Tracking

No constitution violations requiring justification. The design:
- Adds no runtime dependencies to core packages
- Maintains Light DOM for Web Components
- Uses pure TypeScript for behavior primitives (zero-dep)
- React components are native (not WC wrappers), satisfying the compound component and asChild requirements
