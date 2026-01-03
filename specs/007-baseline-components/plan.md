# Implementation Plan: Baseline Web Components

**Branch**: `007-baseline-components` | **Date**: 2026-01-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-baseline-components/spec.md`

## Summary

Deliver 6 baseline Web Components (Button, Link, Text, Icon, Spinner, VisuallyHidden) extending the established `DSElement` Light DOM pattern. Each component includes token-driven styling via CSS custom properties, WCAG 2.1 AA accessibility with documented keyboard/screen reader behavior, component manifests meeting the docs contract, and MDX documentation with usage examples and anti-patterns.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (Web Components), External icon library (Lucide or Heroicons) with adapter
**Storage**: N/A (stateless UI components)
**Testing**: Vitest 1.0+ (unit), jest-axe/axe-core (a11y automation), Playwright (visual regression)
**Target Platform**: Browser (all modern browsers), SSR via Next.js 14+ App Router
**Project Type**: Monorepo with pnpm workspaces
**Performance Goals**: <5KB gzipped per component, <100ms time-to-interactive after hydration
**Constraints**: Zero runtime CSS-in-JS, Light DOM only, SSR-compatible (meaningful HTML before JS)
**Scale/Scope**: 6 components, 6 manifests, 6 MDX docs pages, ~40 functional requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; minimal client boundaries; SSR-friendly
  - All styling via CSS custom properties in `@layer components`
  - Components render meaningful HTML during SSR
- [x] **Accessibility**: WCAG 2.1 AA plan; APG patterns identified; a11y testing strategy defined
  - Each component has documented APG pattern (button, link, custom)
  - jest-axe for automated checks, manual testing checklist per component
- [x] **Customizability**: Uses DTCG tokens; CSS layers for overrides; no inline styles blocking customization
  - All components consume tokens via CSS custom properties
  - Styles wrapped in `@layer components`
- [x] **Zero-dep Core**: Core packages (`@ds/tokens`, `@ds/css`, `@ds/primitives-dom`) have no runtime deps
  - Components live in `@ds/wc` which has only Lit as runtime dep (per constitution)
- [x] **Web Components**: Light DOM default; Lit-based; theme via CSS vars
  - All components extend `DSElement` which uses Light DOM
- [x] **Dependency Management**: Latest stable versions verified; pnpm used; bundle impact assessed
  - Lit 3.1+ (already in use), icon library adapter adds minimal overhead

## Project Structure

### Documentation (this feature)

```text
specs/007-baseline-components/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (component type contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/
├── wc/
│   └── src/
│       ├── base/
│       │   └── ds-element.ts           # Existing base class
│       ├── registry/
│       │   ├── registry.ts             # Component registry (update)
│       │   └── define.ts               # Safe registration
│       ├── events/
│       │   └── emit.ts                 # Event utilities (existing)
│       ├── components/
│       │   ├── button/                 # Existing (enhance if needed)
│       │   │   ├── button.ts
│       │   │   ├── button.css
│       │   │   └── manifest.json
│       │   ├── link/                   # NEW
│       │   │   ├── link.ts
│       │   │   ├── link.css
│       │   │   └── manifest.json
│       │   ├── text/                   # NEW
│       │   │   ├── text.ts
│       │   │   ├── text.css
│       │   │   └── manifest.json
│       │   ├── icon/                   # NEW
│       │   │   ├── icon.ts
│       │   │   ├── icon.css
│       │   │   ├── icon-adapter.ts     # External library adapter
│       │   │   └── manifest.json
│       │   ├── spinner/                # NEW
│       │   │   ├── spinner.ts
│       │   │   ├── spinner.css
│       │   │   └── manifest.json
│       │   └── visually-hidden/        # NEW
│       │       ├── visually-hidden.ts
│       │       ├── visually-hidden.css
│       │       └── manifest.json
│       └── index.ts                    # Export all components
├── docs-content/
│   └── components/
│       ├── button.mdx                  # Update/verify existing
│       ├── link.mdx                    # NEW
│       ├── text.mdx                    # NEW
│       ├── icon.mdx                    # NEW
│       ├── spinner.mdx                 # NEW
│       └── visually-hidden.mdx         # NEW
└── css/
    └── src/
        └── components/
            ├── button.css              # Existing
            ├── link.css                # NEW
            ├── text.css                # NEW
            ├── icon.css                # NEW
            ├── spinner.css             # NEW
            └── visually-hidden.css     # NEW

tests/
├── unit/
│   └── components/
│       ├── button.test.ts
│       ├── link.test.ts
│       ├── text.test.ts
│       ├── icon.test.ts
│       ├── spinner.test.ts
│       └── visually-hidden.test.ts
└── a11y/
    └── components/
        ├── button.a11y.test.ts
        ├── link.a11y.test.ts
        ├── text.a11y.test.ts
        ├── icon.a11y.test.ts
        ├── spinner.a11y.test.ts
        └── visually-hidden.a11y.test.ts
```

**Structure Decision**: Follows established monorepo pattern with `@ds/wc` for components, `@ds/css` for styles, and `@ds/docs-content` for MDX documentation. Each component has co-located manifest.json for validation.

## Complexity Tracking

No constitution violations requiring justification. All components follow established patterns.
