# Implementation Plan: CSS Layered Output System

**Branch**: `004-css-layers` | **Date**: 2026-01-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-css-layers/spec.md`

## Summary

Implement a complete CSS layered output system for `@ds/css` that provides consistent baseline styling across Web Components (Light DOM), plain HTML recipes, and Next.js apps. The system uses native CSS `@layer` declarations with the order: `reset, tokens, base, components, utilities, overrides`. It enables override-friendly customization without specificity wars and supports tenant branding via the `overrides` layer. Deliverables include the complete layer structure, tenant override example, styling guidelines documentation page, and a demo app showing brand switching.

## Technical Context

**Language/Version**: CSS (native `@layer`), TypeScript 5.x (build tooling only)
**Primary Dependencies**: PostCSS 8.x (build-time import flattening), postcss-import, cssnano (minification)
**Storage**: N/A (static CSS files)
**Testing**: Vitest (unit tests for build output), Playwright (E2E for visual consistency)
**Target Platform**: Evergreen browsers only (Chrome 99+, Firefox 97+, Safari 15.4+, Edge 99+)
**Project Type**: Monorepo package (`@ds/css`) with demo app integration
**Performance Goals**: <20KB gzipped for full bundle (excluding tree-shakeable utilities)
**Constraints**: Zero runtime dependencies; all styling via CSS custom properties; SSR-friendly
**Scale/Scope**: 6 CSS layers, ~50 utility classes, 1 tenant example, 1 docs page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; CSS layers are build-time only; zero runtime overhead
- [x] **Accessibility**: Reset layer includes `prefers-reduced-motion`; high-contrast mode supported via tokens
- [x] **Customizability**: Uses DTCG tokens in `tokens` layer; `overrides` layer enables consumer customization; no inline styles
- [x] **Zero-dep Core**: `@ds/css` has no runtime dependencies; PostCSS is dev-only
- [x] **Web Components**: Light DOM components consume styles via CSS classes; theme via CSS vars
- [x] **Dependency Management**: PostCSS 8.x stable; pnpm used; minimal build tooling

## Project Structure

### Documentation (this feature)

```text
specs/004-css-layers/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (layer API contracts)
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
packages/css/
├── src/
│   ├── index.css              # Entry point: @layer declaration + imports
│   └── layers/
│       ├── index.css          # Layer order declaration
│       ├── reset.css          # Browser reset (existing)
│       ├── tokens.css         # Token import (new: imports @ds/tokens/css)
│       ├── base.css           # Semantic HTML styles (existing)
│       ├── components.css     # Component styles (new: aggregates from @ds/wc)
│       ├── utilities.css      # Minimal utility classes (existing, expand)
│       └── overrides.css      # Empty placeholder (new)
├── dist/
│   └── index.css              # Built output (flattened, minified)
├── postcss.config.js          # PostCSS configuration
├── package.json
└── tests/
    └── layers.test.ts         # Layer structure tests

packages/docs-content/
└── guides/
    └── styling-guidelines.mdx # New documentation page

apps/demo/
├── app/
│   └── layout.tsx             # Already imports @ds/css
├── styles/
│   └── tenant-acme.css        # New: tenant override example
└── components/
    └── brand-switcher.tsx     # New: toggle between default/tenant-acme

packages/docs-renderer-next/
└── styles/
    └── globals.css            # Update to use @ds/css layers
```

**Structure Decision**: Extends existing `packages/css/` with complete layer structure. Demo app gains tenant override example. Docs content package gains styling guidelines page.

## Complexity Tracking

> No constitution violations. Complexity is minimal:
> - No additional packages created
> - No runtime dependencies added
> - PostCSS already in use for CSS processing
