# Implementation Plan: Forms and Overlays Components

**Branch**: `010-forms-overlays` | **Date**: 2026-01-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-forms-overlays/spec.md`

## Summary

Implement accessible form controls (Input Field pattern, Textarea, Checkbox, Radio, Switch) and overlay components (Dialog, Popover, Tooltip, Menu) using existing `@ds/primitives-dom` behavior utilities. Components will extend `DSElement` with Light DOM rendering, integrate with DTCG token system, and follow WAI-ARIA APG patterns. Positioning for overlays uses CSS anchor positioning with JS fallback.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (Web Components), `@ds/primitives-dom` (focus-trap, dismissable-layer, roving-focus, type-ahead)
**Storage**: N/A (stateless UI components)
**Testing**: Vitest (unit), jest-axe (a11y automation), Playwright (E2E)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge latest 2 versions), SSR-compatible
**Project Type**: Monorepo package (`@ds/wc`)
**Performance Goals**: <2KB per component (minified+gzipped), SSR renders meaningful HTML before hydration
**Constraints**: Zero runtime deps in primitives, Lit-only in `@ds/wc`, CSS layers for styling
**Scale/Scope**: 10 new components (Field pattern: 4, Form controls: 5, Overlays: 4), ~67 functional requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; minimal client boundaries; SSR-friendly
  - Components render semantic HTML before JS hydration
  - All styling via CSS custom properties from token system
  - Single client boundary pattern for custom element registration
- [x] **Accessibility**: WCAG 2.1 AA plan; APG patterns identified; a11y testing strategy defined
  - APG patterns mapped: Dialog, Radio Group, Switch, Menu Button, Tooltip, Checkbox
  - Testing: jest-axe automation + manual screen reader testing checklist
  - All keyboard interactions documented per APG
- [x] **Customizability**: Uses DTCG tokens; CSS layers for overrides; no inline styles blocking customization
  - Components consume tokens via CSS custom properties
  - Styles in `components` layer, consumer overrides in `overrides` layer
- [x] **Zero-dep Core**: Core packages (`@ds/tokens`, `@ds/css`, `@ds/primitives-dom`) have no runtime deps
  - All behavior utilities in `@ds/primitives-dom` have zero runtime deps
  - Components use primitives via composition, not inheritance
- [x] **Web Components**: Light DOM default; Lit-based; theme via CSS vars
  - All components extend `DSElement` (Light DOM rendering)
  - Theme switching via CSS custom property updates on root
- [x] **Dependency Management**: Latest stable versions verified; pnpm used; bundle impact assessed
  - Lit 3.1+ already in use
  - No new runtime dependencies required

## Project Structure

### Documentation (this feature)

```text
specs/010-forms-overlays/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── component-api.md # Component attribute/event contracts
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
packages/wc/
├── src/
│   ├── base/
│   │   └── ds-element.ts           # Existing base class
│   ├── components/
│   │   ├── field/                  # NEW: Field pattern
│   │   │   ├── field.ts            # Container component
│   │   │   ├── label.ts            # Label component
│   │   │   ├── field-description.ts # Help text component
│   │   │   ├── field-error.ts      # Error message component
│   │   │   └── manifest.json
│   │   ├── input/                  # EXISTING: Enhanced for Field
│   │   │   └── input.ts
│   │   ├── textarea/               # NEW
│   │   │   ├── textarea.ts
│   │   │   └── manifest.json
│   │   ├── checkbox/               # NEW
│   │   │   ├── checkbox.ts
│   │   │   └── manifest.json
│   │   ├── radio/                  # NEW
│   │   │   ├── radio.ts
│   │   │   ├── radio-group.ts
│   │   │   └── manifest.json
│   │   ├── switch/                 # NEW
│   │   │   ├── switch.ts
│   │   │   └── manifest.json
│   │   ├── dialog/                 # NEW
│   │   │   ├── dialog.ts
│   │   │   ├── dialog-trigger.ts
│   │   │   ├── dialog-content.ts
│   │   │   ├── dialog-title.ts
│   │   │   ├── dialog-description.ts
│   │   │   └── manifest.json
│   │   ├── popover/                # NEW
│   │   │   ├── popover.ts
│   │   │   ├── popover-trigger.ts
│   │   │   ├── popover-content.ts
│   │   │   └── manifest.json
│   │   ├── tooltip/                # NEW
│   │   │   ├── tooltip.ts
│   │   │   ├── tooltip-trigger.ts
│   │   │   ├── tooltip-content.ts
│   │   │   └── manifest.json
│   │   └── menu/                   # NEW
│   │       ├── menu.ts
│   │       ├── menu-trigger.ts
│   │       ├── menu-content.ts
│   │       ├── menu-item.ts
│   │       └── manifest.json
│   ├── events/
│   │   └── emit.ts                 # Existing event utilities
│   └── index.ts                    # Export all components
├── tests/
│   ├── unit/                       # Component unit tests
│   └── a11y/                       # Accessibility automation tests
└── package.json

packages/primitives-dom/
├── src/
│   ├── focus/
│   │   └── focus-trap.ts           # EXISTING
│   ├── keyboard/
│   │   ├── roving-focus.ts         # EXISTING
│   │   ├── activation.ts           # EXISTING
│   │   ├── arrow-keys.ts           # EXISTING
│   │   └── type-ahead.ts           # EXISTING
│   ├── layer/
│   │   └── dismissable-layer.ts    # EXISTING
│   └── positioning/                # NEW: Anchor positioning utility
│       └── anchor-position.ts
└── package.json

packages/css/
├── src/
│   └── components/
│       ├── field.css               # NEW
│       ├── textarea.css            # NEW
│       ├── checkbox.css            # NEW
│       ├── radio.css               # NEW
│       ├── switch.css              # NEW
│       ├── dialog.css              # NEW
│       ├── popover.css             # NEW
│       ├── tooltip.css             # NEW
│       └── menu.css                # NEW
└── package.json

packages/docs-content/
└── components/
    ├── field/
    │   └── field.mdx               # NEW
    ├── textarea/
    │   └── textarea.mdx            # NEW
    ├── checkbox/
    │   └── checkbox.mdx            # NEW
    ├── radio/
    │   └── radio.mdx               # NEW
    ├── switch/
    │   └── switch.mdx              # NEW
    ├── dialog/
    │   └── dialog.mdx              # NEW
    ├── popover/
    │   └── popover.mdx             # NEW
    ├── tooltip/
    │   └── tooltip.mdx             # NEW
    └── menu/
        └── menu.mdx                # NEW
```

**Structure Decision**: Extends existing monorepo structure. New components added to `@ds/wc`, new primitive (anchor-position) to `@ds/primitives-dom`, component styles to `@ds/css`, documentation to `@ds/docs-content`.

## Complexity Tracking

No constitution violations. All requirements align with established patterns.
