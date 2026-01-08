# Implementation Plan: Layout Primitives & Page Composition

**Branch**: `020-layout-primitives` | **Date**: 2026-01-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/020-layout-primitives/spec.md`

## Summary

Deliver a framework-agnostic layout layer with 14 token-driven, Light DOM components (Flow, Container, Grid, Box, Section, Page, AppShell, Header, Footer, Main, Spacer, Center, Split, Wrap) for React and Web Components. Uses CSS-only responsive approach with pre-generated media query classes from design tokens. Flow is the primary 1D layout primitive with responsive direction switching, replacing separate Stack/Inline components.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (Web Components), React 18+ (adapter peer dependency)
**Storage**: N/A (stateless layout components)
**Testing**: Vitest (unit tests), axe-core (a11y automation), Playwright (visual regression)
**Target Platform**: Browser (SSR-compatible with Next.js App Router)
**Project Type**: Monorepo packages (`@ds/wc`, `@ds/react`, `@ds/css`)
**Performance Goals**: <3KB gzipped total bundle for all layout components (tree-shaken)
**Constraints**: Zero runtime JS for responsive behavior; CSS-only media queries; Light DOM only
**Scale/Scope**: 14 components, ~40 functional requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; CSS-only responsive via pre-generated media query classes; SSR-friendly (layout correct on first paint)
- [x] **Accessibility**: WCAG 2.1 AA plan; APG patterns for landmarks (Header=banner, Footer=contentinfo, Main=main); a11y testing via axe-core
- [x] **Customizability**: Uses DTCG tokens for spacing, sizing, breakpoints; CSS layers for overrides; no inline styles blocking customization
- [x] **Zero-dep Core**: Layout CSS extends `@ds/css` with zero runtime deps; `@ds/tokens` provides CSS variables
- [x] **Web Components**: Light DOM via DSElement base class; Lit-based; theme via CSS vars
- [x] **Dependency Management**: No new dependencies required; uses existing Lit 3.1+, React 18+

## Project Structure

### Documentation (this feature)

```text
specs/020-layout-primitives/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
packages/
├── tokens/
│   └── src/tokens/global/
│       ├── breakpoint.json     # Existing: xs, sm, md, lg, xl, 2xl, 3xl, max
│       ├── spacing.json        # Existing: none, xs, sm, md, lg, xl, 2xl, 3xl
│       └── sizing.json         # Existing: 0-64, full, screen, min, max, fit
│
├── css/
│   └── src/
│       ├── layers/index.css    # Existing layer order
│       └── components/
│           └── layout/         # NEW: Layout component styles
│               ├── flow.css
│               ├── container.css
│               ├── grid.css
│               ├── box.css
│               ├── section.css
│               ├── page.css
│               ├── app-shell.css
│               ├── header.css
│               ├── footer.css
│               ├── main.css
│               ├── spacer.css
│               ├── center.css
│               ├── split.css
│               └── wrap.css
│
├── wc/
│   └── src/
│       ├── base/ds-element.ts  # Existing Light DOM base class
│       └── components/
│           └── layout/         # NEW: Layout Web Components
│               ├── flow.ts
│               ├── container.ts
│               ├── grid.ts
│               ├── box.ts
│               ├── section.ts
│               ├── page.ts
│               ├── app-shell/
│               │   ├── app-shell.ts
│               │   ├── header.ts
│               │   ├── footer.ts
│               │   ├── main.ts
│               │   └── sidebar.ts
│               ├── spacer.ts
│               ├── center.ts
│               ├── split.ts
│               ├── wrap.ts
│               └── index.ts
│
└── react/
    └── src/
        └── components/
            └── layout/         # NEW: React wrappers
                ├── flow.tsx
                ├── container.tsx
                ├── grid.tsx
                ├── box.tsx
                ├── section.tsx
                ├── page.tsx
                ├── app-shell.tsx
                ├── spacer.tsx
                ├── center.tsx
                ├── split.tsx
                ├── wrap.tsx
                ├── stack.tsx   # Alias: Flow direction="column"
                ├── inline.tsx  # Alias: Flow direction="row"
                └── index.ts
```

**Structure Decision**: Layout components follow existing pattern with CSS in `@ds/css`, Web Components in `@ds/wc`, and React adapters in `@ds/react`. All components use Light DOM via `DSElement` base class.

## Complexity Tracking

> No constitution violations requiring justification. All requirements align with existing architecture.
