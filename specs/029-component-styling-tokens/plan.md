# Implementation Plan: Component Styling Tokens

**Branch**: `029-component-styling-tokens` | **Date**: 2026-03-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/029-component-styling-tokens/spec.md`

## Summary

Introduce a four-tier token hierarchy (core primitives → semantic → type → component) that enables consumers to restyle any element of any component via CSS custom properties. Type tokens group shared styling across six component categories (form-controls, overlays, navigation, feedback, containers, actions). Every component gets dedicated component-level tokens with sub-element granularity, using a two-layer resolution pattern where component tokens default to type/semantic tokens in the `@layer tokens` layer and component CSS references only the most-specific token. Visual defaults follow the shadcn/ui aesthetic.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (WC), React 18+ (adapters), existing DTCG token compiler
**Storage**: File-based (DTCG JSON tokens → compiled CSS/JSON/TS outputs)
**Testing**: Vitest (unit tests), visual regression snapshots
**Target Platform**: Browser (all modern browsers), SSR-compatible (Next.js 14+)
**Project Type**: Monorepo (pnpm workspaces)
**Performance Goals**: Zero runtime JS for token resolution; CSS-only cascade
**Constraints**: Backward compatible with existing `--ds-*` namespace; must work within existing CSS layer architecture
**Scale/Scope**: 55 tokenized components across 6 type categories (1 excluded: visually-hidden); ~42 with existing CSS files; ~14 need CSS files created

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Performance**: No runtime CSS-in-JS; pure CSS custom property resolution; SSR-friendly (tokens are static CSS)
- [x] **Accessibility**: Token system supports high-contrast mode via existing `high-contrast` CSS layer; reduced-motion via mode tokens; no a11y regression from token changes
- [x] **Customizability**: DTCG tokens as source; CSS layers for override cascade; component tokens are CSS custom properties overridable by consumers in `overrides` layer; no inline styles
- [x] **Zero-dep Core**: `@hypoth-ui/tokens` has 0 runtime deps; type/component tokens are compiled to static CSS — no new runtime dependencies
- [x] **Web Components**: Light DOM default preserved; Lit-based; all theming via CSS vars; no Shadow DOM introduced
- [x] **Dependency Management**: No new dependencies; leverages existing DTCG compiler and CSS layer pipeline

## Project Structure

### Documentation (this feature)

```text
specs/029-component-styling-tokens/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output — token tier data model
├── quickstart.md        # Phase 1 output — consumer guide
├── contracts/           # Phase 1 output — token naming contracts
│   └── token-api.md     # CSS custom property naming convention spec
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/tokens/
├── src/
│   ├── tokens/
│   │   ├── primitives/          # Tier 1: Core primitives (existing)
│   │   ├── global/              # Tier 1: Global tokens (existing)
│   │   ├── semantic/            # Tier 2: Semantic aliases (existing, expanded)
│   │   ├── type/                # Tier 3: Type category tokens (NEW)
│   │   │   ├── form-controls.json
│   │   │   ├── overlays.json
│   │   │   ├── navigation.json
│   │   │   ├── feedback.json
│   │   │   ├── containers.json
│   │   │   └── actions.json
│   │   ├── component/           # Tier 4: Component-level tokens (NEW)
│   │   │   ├── button.json
│   │   │   ├── input.json
│   │   │   ├── select.json
│   │   │   ├── dialog.json
│   │   │   └── ... (one per component)
│   │   └── modes/               # Mode overrides (existing, extended)
│   └── build/
│       └── build.ts             # Token compiler (extended for type/component tiers)
├── dist/
│   ├── css/
│   │   ├── tokens.css           # Core + semantic (existing)
│   │   ├── type-tokens.css      # Type category tokens (NEW)
│   │   └── component-tokens.css # Component-level tokens (NEW)
│   └── ts/
│       └── index.ts             # TypeScript types (extended)

packages/wc/
└── src/
    └── components/
        └── {component}/
            └── {component}.css  # Updated to reference component tokens

packages/css/
└── src/
    └── layers/
        └── index.css            # Updated imports for new token files
```

**Structure Decision**: Extends existing monorepo structure. New token tiers are added as subdirectories within `packages/tokens/src/tokens/`. Component CSS files are updated in-place within `packages/wc/`. No new packages created.

## Architecture Decisions

### Token Resolution Pattern

Token tiering is implemented through CSS custom property definition chains in the `@layer tokens` layer, NOT through nested `var()` fallback chains in component CSS.

**Token definitions** (in `@layer tokens`):
```css
:root {
  /* Tier 2: Semantic */
  --ds-color-primary-default: oklch(0.55 0.19 250);

  /* Tier 3: Type — actions category */
  --ds-action-bg: var(--ds-color-primary-default);
  --ds-action-color: var(--ds-color-primary-foreground);
  --ds-action-height-md: 2.25rem;

  /* Tier 4: Component — button */
  --ds-button-bg: var(--ds-action-bg);
  --ds-button-color: var(--ds-action-color);
  --ds-button-height: var(--ds-action-height-md);
}
```

**Component CSS** (in `@layer components`):
```css
.ds-button {
  background-color: var(--ds-button-bg);
  color: var(--ds-button-color);
  height: var(--ds-button-height);
}
```

**Consumer override** (in `@layer overrides` or any higher-specificity context):
```css
:root {
  /* Override just button */
  --ds-button-bg: oklch(0.6 0.15 150);

  /* Or override all actions */
  --ds-action-bg: oklch(0.6 0.15 150);

  /* Or override everything using primary */
  --ds-color-primary-default: oklch(0.6 0.15 150);
}
```

### Token Naming Convention

```
--ds-{scope}-{element?}-{property}-{state?}
```

| Tier | Pattern | Example |
|------|---------|---------|
| Primitive | `--ds-{category}-{value}` | `--ds-spacing-4`, `--ds-radius-md` |
| Semantic | `--ds-color-{intent}-{state}` | `--ds-color-primary-hover` |
| Type | `--ds-{type-category}-{property}` | `--ds-form-control-border-radius` |
| Type + size | `--ds-{type-category}-{property}-{size}` | `--ds-action-height-sm` |
| Component | `--ds-{component}-{property}` | `--ds-button-bg` |
| Component + element | `--ds-{component}-{element}-{property}` | `--ds-select-trigger-bg` |

### Component Category Assignments

| Category | Components |
|----------|-----------|
| **form-controls** | Input, Select, Checkbox, Radio, Textarea, Switch, Number-Input, Pin-Input, Combobox, Time-Picker, Date-Picker, Slider, File-Upload, Field, Calendar |
| **overlays** | Dialog, Alert-Dialog, Popover, Tooltip, Sheet, Drawer, Hover-Card, Context-Menu, Dropdown-Menu, Command |
| **navigation** | Tabs, Breadcrumb, Pagination, Navigation-Menu, Menu |
| **feedback** | Alert, Badge, Toast, Progress, Spinner, Skeleton, Empty-State, Stepper, Avatar |
| **containers** | Card, Accordion, Collapsible, Table, Data-Table, Scroll-Area, Tree, List, Separator, Aspect-Ratio, Layout, Text |
| **actions** | Button, Link, Icon, Tag |
| **excluded** | Visually-Hidden (a11y utility — no visual tokens needed) |

### Visual Defaults (shadcn/ui Reference, Customized)

**Typography**:
- Default sans-serif font: Geist (Vercel's typeface) — `'Geist', system-ui, -apple-system, sans-serif`
- Default monospace font: Geist Mono — `'Geist Mono', ui-monospace, monospace`
- Geist is loaded via `@font-face` or consumer's font loading strategy; system-ui fallback ensures graceful degradation

**Color palette** (mapped to existing semantic tokens):
- Neutral gray scale (zinc-based) for backgrounds, borders, text
- **Blue primary** — vibrant blue accent (`oklch(0.55 0.19 250)`) instead of shadcn's dark gray default. Primary buttons, links, focus rings, and active states all use this blue.
- **Teal success** — `oklch(0.55 0.14 185)` (blue-green) instead of typical green. Hue 185 is visually distinct from both the blue primary (hue 250) and the destructive color.
- **Color-blind-safe destructive** — warm vermillion `oklch(0.55 0.2 35)` (orange-red, hue 35) instead of pure red. The 150-degree hue separation between teal success (185) and vermillion destructive (35) ensures they remain distinguishable for protanopia, deuteranopia, and tritanopia. Additional non-color cues (icons, labels, positioning) are provided at the component level.
- Warning remains amber-based (`oklch(0.75 0.15 70)`)
- Background/foreground pairing pattern: `--ds-color-{role}` / `--ds-color-{role}-foreground`

**Semantic color token values**:

| Role | Default | Hover | Active | Foreground | Subtle |
|------|---------|-------|--------|------------|--------|
| Primary | `oklch(0.55 0.19 250)` | `oklch(0.49 0.19 250)` | `oklch(0.43 0.19 250)` | `oklch(0.985 0 0)` | `oklch(0.95 0.03 250)` |
| Destructive | `oklch(0.55 0.2 35)` | `oklch(0.49 0.2 35)` | `oklch(0.43 0.2 35)` | `oklch(0.985 0 0)` | `oklch(0.95 0.04 35)` |
| Success | `oklch(0.55 0.14 185)` | `oklch(0.49 0.14 185)` | `oklch(0.43 0.14 185)` | `oklch(0.985 0 0)` | `oklch(0.95 0.03 185)` |
| Warning | `oklch(0.75 0.15 70)` | `oklch(0.70 0.15 70)` | `oklch(0.65 0.15 70)` | `oklch(0.205 0 0)` | `oklch(0.97 0.04 70)` |

**Spacing & sizing**:
- Border radius: `0.375rem` (md) as default component radius, `0.5rem` (lg) for cards/dialogs
- Component padding follows 8px grid: xs=4px, sm=8px, md=12px, lg=16px
- Height scale: sm=2rem, md=2.25rem, lg=2.75rem (matching shadcn button sizes)

### Migration Strategy

Components are migrated incrementally by type category. Each category migration:
1. Define type tokens for the category
2. Define component tokens for each component in the category
3. Update component CSS to reference component tokens
4. Verify visual regression — appearance should not change
5. Verify consumer override capability

Order of migration: actions → form-controls → containers → overlays → navigation → feedback

### Build Pipeline Extension

The existing DTCG compiler in `packages/tokens/src/build/build.ts` is extended to:
1. Load type token JSON files from `src/tokens/type/`
2. Load component token JSON files from `src/tokens/component/`
3. Resolve cross-tier references (component → type → semantic → primitive)
4. Emit `type-tokens.css` and `component-tokens.css` alongside existing `tokens.css`
5. Export TypeScript types for all token tiers

No new dependencies required — the existing compiler handles DTCG reference resolution.

## Complexity Tracking

No constitution violations. All decisions align with zero-dep core, CSS-only styling, Light DOM, and DTCG token pipeline.
