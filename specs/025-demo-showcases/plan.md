# Implementation Plan: Framework-Specific Demo Showcases

**Branch**: `025-demo-showcases` | **Date**: 2026-01-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/025-demo-showcases/spec.md`

## Summary

Create two parallel demo applications—`demo-react` (renamed from existing `apps/demo`) and `demo-wc` (new)—that showcase the design system's components in a realistic app shell layout. Both demos share mock data and assets via a new `@ds/demo-shared` package while implementing layouts idiomatically for their respective frameworks. Visual regression tests ensure cross-framework parity.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**:
- demo-react: Next.js 14+, React 18+, @ds/react, @ds/tokens, @ds/css
- demo-wc: Vite 5+, @ds/wc, @ds/tokens, @ds/css
- demo-shared: None (pure TypeScript/JSON data)

**Storage**: localStorage (theme persistence only)
**Testing**: Vitest (unit), Playwright (E2E + visual regression)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
**Project Type**: Monorepo with multiple apps
**Performance Goals**:
- Initial load <3s on 3G
- Theme toggle <200ms
- Interaction response <100ms
**Constraints**:
- No runtime CSS-in-JS
- WCAG 2.1 AA compliance
- Visual parity >95% between demos
**Scale/Scope**: 5 navigation sections, ~20 component showcases per demo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; minimal client boundaries; SSR-friendly
  - demo-react uses Next.js with minimal `'use client'` boundaries
  - demo-wc is client-only (appropriate for WC showcase)
  - Both use CSS variables from @ds/tokens
- [x] **Accessibility**: WCAG 2.1 AA plan; APG patterns identified; a11y testing strategy defined
  - Components already implement APG patterns
  - Playwright axe-core tests for each demo
  - Keyboard navigation testing included
- [x] **Customizability**: Uses DTCG tokens; CSS layers for overrides; no inline styles blocking customization
  - Both demos consume @ds/tokens
  - CSS layers respected (reset, tokens, base, components)
- [x] **Zero-dep Core**: Core packages (`@ds/tokens`, `@ds/css`, `@ds/primitives-dom`) have no runtime deps
  - demos depend on these but don't modify them
- [x] **Web Components**: Light DOM default; Lit-based; theme via CSS vars
  - demo-wc showcases existing @ds/wc components
- [x] **Dependency Management**: Latest stable versions verified; pnpm used; bundle impact assessed
  - Vite for demo-wc (minimal bundler overhead)
  - Next.js already in use for demo-react

## Project Structure

### Documentation (this feature)

```text
specs/025-demo-showcases/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (minimal - no API contracts needed)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
apps/
├── demo-react/          # Renamed from apps/demo
│   ├── app/
│   │   ├── layout.tsx           # Root layout with theme provider
│   │   ├── page.tsx             # Dashboard (landing)
│   │   ├── forms/page.tsx       # Forms section
│   │   ├── data-display/page.tsx
│   │   ├── overlays/page.tsx
│   │   └── feedback/page.tsx
│   ├── components/
│   │   ├── app-shell.tsx        # Header + sidebar + content
│   │   ├── sidebar-nav.tsx      # Responsive sidebar
│   │   ├── theme-toggle.tsx     # Light/dark toggle
│   │   └── mobile-nav.tsx       # Hamburger drawer
│   └── styles/
│       └── globals.css
│
├── demo-wc/             # New Vite-based WC demo
│   ├── index.html
│   ├── src/
│   │   ├── main.ts              # Entry point, custom element registration
│   │   ├── app-shell.ts         # WC app shell
│   │   ├── pages/
│   │   │   ├── dashboard.ts
│   │   │   ├── forms.ts
│   │   │   ├── data-display.ts
│   │   │   ├── overlays.ts
│   │   │   └── feedback.ts
│   │   └── components/
│   │       ├── sidebar-nav.ts
│   │       ├── theme-toggle.ts
│   │       └── mobile-nav.ts
│   └── styles/
│       └── globals.css
│
packages/
└── demo-shared/         # New shared package
    ├── src/
    │   ├── index.ts
    │   ├── navigation.ts        # Navigation config
    │   ├── mock-data/
    │   │   ├── users.ts
    │   │   ├── products.ts
    │   │   └── notifications.ts
    │   └── content/
    │       ├── dashboard.ts
    │       ├── forms.ts
    │       ├── data-display.ts
    │       ├── overlays.ts
    │       └── feedback.ts
    ├── assets/
    │   ├── logo.svg
    │   └── placeholder-avatar.svg
    └── package.json
```

**Structure Decision**: Monorepo with two demo apps sharing data via `@ds/demo-shared` package. This follows Approach C from the spec, allowing idiomatic implementations while sharing mock data and assets.

## Complexity Tracking

No constitution violations. Complexity is justified by the spec requirement to demonstrate both React and Web Component consumption patterns.
