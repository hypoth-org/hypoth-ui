# Implementation Plan: Web Components Platform Conventions

**Branch**: `006-wc-platform` | **Date**: 2026-01-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-wc-platform/spec.md`

## Summary

Establish standardized Web Components platform conventions for the design system, including: a DSElement base class extending Lit's LightElement for Light DOM rendering, consistent naming conventions (ds-{name} tags, ds:{event} events), a centralized component registry, the @ds/next root loader for Next.js App Router integration, and an AST-based enforcement script to prevent accidental self-registration.

## Technical Context

**Language/Version**: TypeScript 5.3+
**Primary Dependencies**: Lit 3.1+ (Web Components), React 18+ (Next.js adapter), Next.js 14+ (App Router)
**Storage**: N/A (no persistence layer)
**Testing**: Vitest (unit), Playwright (E2E/integration)
**Target Platform**: Browser (SSR via Next.js, CSR hydration)
**Project Type**: Monorepo with multiple packages
**Performance Goals**: Root loader <2KB gzipped; registration completes before first paint
**Constraints**: No side-effect imports; Light DOM only; single registration per element
**Scale/Scope**: ~10-50 components in registry; used across docs, demo, and consumer apps

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; minimal client boundaries; SSR-friendly
  - DSElement uses Light DOM with CSS variables; DsLoader is single `'use client'` boundary
- [x] **Accessibility**: WCAG 2.1 AA plan; APG patterns identified; a11y testing strategy defined
  - Light DOM enables standard accessibility tree; components follow APG patterns
- [x] **Customizability**: Uses DTCG tokens; CSS layers for overrides; no inline styles blocking customization
  - Components consume tokens via CSS custom properties; Light DOM allows CSS layer overrides
- [x] **Zero-dep Core**: Core packages (`@ds/tokens`, `@ds/css`, `@ds/primitives-dom`) have no runtime deps
  - DSElement in @ds/wc depends only on Lit; enforcement script has no runtime deps
- [x] **Web Components**: Light DOM default; Lit-based; theme via CSS vars
  - DSElement extends LitElement with createRenderRoot returning `this` for Light DOM
- [x] **Dependency Management**: Latest stable versions verified; pnpm used; bundle impact assessed
  - Lit 3.1+ already in use; no new dependencies required for core features

## Project Structure

### Documentation (this feature)

```text
specs/006-wc-platform/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/
├── wc/                           # @ds/wc - Web Components
│   └── src/
│       ├── base/
│       │   └── ds-element.ts     # DSElement base class (rename from light-element.ts)
│       ├── registry/
│       │   ├── define.ts         # Registration utilities (exists)
│       │   └── registry.ts       # Component registry map (new)
│       ├── events/
│       │   └── emit.ts           # Event helper with ds: prefix (new)
│       └── components/           # Individual components
│
├── next/                         # @ds/next - Next.js integration
│   └── src/
│       └── loader/
│           ├── element-loader.tsx  # DsLoader component (exists)
│           └── register.ts         # Registration from registry (enhance)
│
└── tooling/                      # Build/CI tools
    └── scripts/
        └── check-auto-define.ts  # Enforcement script (new)

apps/
├── docs/                         # Documentation site
│   └── content/
│       └── guides/
│           └── nextjs-app-router.mdx  # Usage guide (new)
└── demo/                         # Demo application
```

**Structure Decision**: Extends existing @ds/wc and @ds/next packages with new modules for registry, events, and enforcement. Documentation added to apps/docs.

## Constitution Check (Post-Design Verification)

*Re-evaluated after Phase 1 design completion.*

All constitution principles remain satisfied:

- [x] **Performance**: DSElement adds ~100 bytes; DsLoader ~500 bytes; emitEvent ~50 bytes. Total platform overhead well under 2KB gzipped target.
- [x] **Accessibility**: Light DOM design verified in data-model.md; standard DOM APIs work; no accessibility barriers introduced.
- [x] **Customizability**: Event conventions documented in contracts/events.ts; CSS custom properties work in Light DOM.
- [x] **Zero-dep Core**: Enforcement script uses ts-morph (dev-only); no new runtime dependencies added.
- [x] **Web Components**: Registry pattern documented; DSElement contract defined; Light DOM verified.
- [x] **Dependency Management**: ts-morph is dev-only for enforcement script; no impact on runtime bundle.

**New Dependency**: `ts-morph` (dev-only, for enforcement script)
- Bundle impact: None (not in runtime bundle)
- Purpose: AST parsing for detecting side-effect registrations
- Justification: Only used during CI/build; enables accurate detection without adding ESLint

## Complexity Tracking

No constitution violations requiring justification. Implementation aligns with all principles.
