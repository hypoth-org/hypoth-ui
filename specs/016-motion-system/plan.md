# Implementation Plan: Animation System

**Branch**: `016-motion-system` | **Date**: 2026-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/016-motion-system/spec.md`

## Summary

Implement a CSS-first animation system for component enter/exit transitions with motion tokens integration. The system provides:
- CSS animation keyframes and utility classes in `@ds/css`
- Presence utility in `@ds/primitives-dom` for exit animation coordination
- Integration with existing overlay components (dialog, popover, tooltip, menu)
- Full prefers-reduced-motion support via existing reduced-motion tokens

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (WC only), React 18+ (adapter peer dependency), existing `@ds/primitives-dom`
**Storage**: N/A (stateless animation system)
**Testing**: Vitest 1.x (unit tests), happy-dom (DOM simulation)
**Target Platform**: Browser (SSR-compatible), Next.js 14+ App Router
**Project Type**: Monorepo with workspace packages
**Performance Goals**: 60fps animations, ≤3KB JavaScript for presence logic
**Constraints**: CSS-first (no runtime CSS-in-JS), prefers-reduced-motion compliance, zero runtime deps for CSS layer
**Scale/Scope**: 4 overlay components (dialog, popover, tooltip, menu), 6 animation presets

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: CSS animations use GPU acceleration; no runtime CSS-in-JS; presence logic is minimal (~2KB)
- [x] **Accessibility**: prefers-reduced-motion fully supported via existing reduced-motion tokens that set all durations to 0ms
- [x] **Customizability**: Uses existing DTCG motion tokens; CSS layers for animation overrides; token-driven timing
- [x] **Zero-dep Core**: Presence utility in `@ds/primitives-dom` has no runtime deps; CSS animations are pure CSS
- [x] **Web Components**: Animation via CSS classes and data attributes; Lit components consume motion tokens via CSS vars
- [x] **Dependency Management**: No new dependencies required; uses existing Lit, React, and vitest

## Project Structure

### Documentation (this feature)

```text
specs/016-motion-system/
├── plan.md              # This file
├── research.md          # Phase 0: Animation patterns research
├── data-model.md        # Phase 1: Animation entities and states
├── quickstart.md        # Phase 1: Implementation guide
├── contracts/           # Phase 1: API contracts
│   ├── presence-api.ts  # Presence utility TypeScript interface
│   └── animation.css    # CSS animation API specification
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/
├── css/
│   └── src/
│       └── layers/
│           ├── utilities.css      # Add animation utility classes
│           └── animations.css     # NEW: Animation keyframes
├── primitives-dom/
│   └── src/
│       └── animation/
│           └── presence.ts        # NEW: Presence detection utility
├── wc/
│   └── src/
│       └── components/
│           ├── dialog/            # Add animation support
│           ├── popover/           # Add animation support
│           ├── tooltip/           # Add animation support
│           └── menu/              # Add animation support
└── react/
    └── src/
        └── primitives/
            └── Presence.tsx       # NEW: React Presence component
```

**Structure Decision**: Extends existing monorepo packages. Animation CSS goes in `@ds/css`, presence utility in `@ds/primitives-dom`, React Presence in `@ds/react`. No new packages required.

## Complexity Tracking

No constitution violations. All implementation choices align with existing patterns.
