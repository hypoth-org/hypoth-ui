# Implementation Plan: Docs Renderer v1 (Next.js) + White-Label Overlay Workflow

**Branch**: `009-docs-renderer` | **Date**: 2026-01-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-docs-renderer/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a customizable documentation site renderer that consumes docs content packs and manifests, supports tenant editions (filtering + branding), and allows tenants to add/override pages. Uses file-system based overlay approach where tenant content packs override base content packs at matching paths.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode)
**Primary Dependencies**: Next.js 14+ (App Router), @ds/docs-core (existing), @ds/docs-content (existing), @mdx-js/mdx 3.x, gray-matter 4.x
**Storage**: File-based (content packs as npm packages, edition-config.json per deployment)
**Testing**: vitest (unit/integration), Playwright (e2e)
**Target Platform**: Next.js App Router (SSR/SSG), Node.js 20+
**Project Type**: Monorepo packages (extends existing @ds/docs-renderer-next)
**Performance Goals**: Build <60s for 100-component site; Lighthouse 90+ on rendered pages
**Constraints**: Zero runtime CSS-in-JS; minimal client boundaries; content resolution at build time
**Scale/Scope**: 100+ components, 50+ guides, multiple editions (core/pro/enterprise)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; minimal client boundaries; SSR-friendly
  - Content resolution at build time via generateStaticParams
  - CSS via tokens/CSS layers, no CSS-in-JS runtime
  - Only interactive components (ThemeSwitcher, Search) use 'use client'
- [x] **Accessibility**: WCAG 2.1 AA plan; APG patterns identified; a11y testing strategy defined
  - Navigation follows APG disclosure pattern
  - Skip links and landmark roles in layout
  - a11y testing via axe-core in Playwright tests
- [x] **Customizability**: Uses DTCG tokens; CSS layers for overrides; no inline styles blocking customization
  - Branding via edition-config.json maps to CSS custom properties
  - All styles in CSS layers (base, components, overrides)
  - No inline styles blocking customization
- [x] **Zero-dep Core**: Core packages (`@ds/tokens`, `@ds/css`, `@ds/primitives-dom`) have no runtime deps
  - @ds/docs-core has dev deps only (build-time validation)
  - @ds/docs-renderer-next has peer deps (Next.js, React)
- [x] **Web Components**: Light DOM default; Lit-based; theme via CSS vars
  - Docs site consumes @ds/wc components which use Light DOM
  - Theme switching via CSS custom properties
- [x] **Dependency Management**: Latest stable versions verified; pnpm used; bundle impact assessed
  - Next.js 14+, React 18+, MDX 3.x (already in use)
  - pnpm workspace protocol for internal packages

## Project Structure

### Documentation (this feature)

```text
specs/009-docs-renderer/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── docs-core/                     # Existing - headless docs engine
│   ├── src/
│   │   ├── content/               # Content loading and parsing
│   │   │   ├── frontmatter.ts     # Existing frontmatter parsing
│   │   │   └── overlay.ts         # NEW: Content overlay resolution
│   │   ├── filter/                # Edition filtering
│   │   │   └── edition-filter.ts  # Existing - extend for overlay
│   │   ├── nav/                   # Navigation generation
│   │   │   └── navigation.ts      # Existing - extend for overlay
│   │   ├── search/                # NEW: Search index generation
│   │   │   └── indexer.ts         # Build-time search index generator
│   │   └── validation/            # Existing validation utilities
│   └── tests/
│
├── docs-content/                  # Existing - base content pack
│   ├── manifests/                 # Component manifests
│   ├── components/                # Component MDX docs
│   ├── guides/                    # Guide MDX docs
│   └── editions/                  # Edition config examples
│
├── docs-renderer-next/            # Existing - Next.js renderer (extend)
│   ├── app/
│   │   ├── layout.tsx             # Extend for branding
│   │   ├── components/[id]/       # Existing - extend for overlay
│   │   └── guides/[id]/           # Existing - extend for overlay
│   ├── components/
│   │   ├── nav-sidebar.tsx        # Extend for edition filtering
│   │   ├── branding/              # NEW: Branding components
│   │   │   ├── logo.tsx           # Tenant logo component
│   │   │   └── header.tsx         # Branded header
│   │   └── search/                # NEW: Search UI (stub)
│   │       └── search-input.tsx   # Search input component
│   ├── lib/
│   │   ├── content-resolver.ts    # NEW: Overlay content resolution
│   │   └── branding-context.tsx   # NEW: Branding context provider
│   └── styles/
│
└── docs-content-tenant-example/   # NEW: Example tenant content pack
    ├── package.json
    ├── components/                # Override/add component docs
    ├── guides/                    # Override/add guides
    └── edition-config.json        # Tenant edition config
```

**Structure Decision**: Extends existing monorepo packages (@ds/docs-core, @ds/docs-content, @ds/docs-renderer-next) with new functionality. Creates example tenant content pack to demonstrate overlay workflow.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
