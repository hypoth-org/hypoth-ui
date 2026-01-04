# Implementation Plan: React Wrappers for Web Components

**Branch**: `008-react-wrappers` | **Date**: 2026-01-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-react-wrappers/spec.md`

## Summary

Implement React wrapper components for the design system Web Components, providing type-safe props, event handling, and ref forwarding. Use a hybrid approach: factory-generated wrappers for simple components (Icon, Spinner, VisuallyHidden), manual wrappers for interactive components (Button, Link, Input), and dedicated `asChild` primitives (Box, Text, Link) for polymorphic rendering.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode)
**Primary Dependencies**: React 18+ (peer), @ds/wc (peer), @ds/css (tokens/classes)
**Storage**: N/A (no persistence layer)
**Testing**: Vitest 1.x, @testing-library/react 14.x
**Target Platform**: Browser (Next.js App Router primary target)
**Project Type**: Monorepo package (packages/react)
**Performance Goals**: <1KB per component wrapper (minified + gzipped)
**Constraints**: Zero runtime CSS-in-JS; SSR-compatible; minimal `'use client'` surface
**Scale/Scope**: 10 component wrappers + 3 asChild primitives

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; minimal client boundaries; SSR-friendly
  - Wrappers use `createElement` with static tag names
  - `'use client'` only on components requiring event handlers
  - Type exports are server-component safe
- [x] **Accessibility**: WCAG 2.1 AA plan; APG patterns identified; a11y testing strategy defined
  - Wrappers inherit a11y from underlying Web Components
  - Ref forwarding enables focus management
  - axe-core tests already in place for WC layer
- [x] **Customizability**: Uses DTCG tokens; CSS layers for overrides; no inline styles blocking customization
  - Box component applies CSS classes from @ds/css
  - No inline styles in wrappers
  - className merging supported
- [x] **Zero-dep Core**: Core packages (`@ds/tokens`, `@ds/css`, `@ds/primitives-dom`) have no runtime deps
  - N/A - @ds/react is an adapter package with React as peer dep
- [x] **Web Components**: Light DOM default; Lit-based; theme via CSS vars
  - Wrappers consume existing WC implementations
  - No Shadow DOM changes introduced
- [x] **Dependency Management**: Latest stable versions verified; pnpm used; bundle impact assessed
  - React 18 peer dep (already required)
  - No new runtime dependencies
  - Bundle impact <1KB per component

## Project Structure

### Documentation (this feature)

```text
specs/008-react-wrappers/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/react/
├── src/
│   ├── index.ts                    # Public exports (updated)
│   ├── client.ts                   # 'use client' re-exports for Next.js
│   ├── components/
│   │   ├── button.tsx              # (existing) Manual wrapper
│   │   ├── input.tsx               # (existing) Manual wrapper
│   │   ├── link.tsx                # Manual wrapper with onNavigate
│   │   ├── text.tsx                # asChild primitive
│   │   ├── icon.tsx                # Factory-generated wrapper
│   │   ├── spinner.tsx             # Factory-generated wrapper
│   │   └── visually-hidden.tsx     # Factory-generated wrapper
│   ├── primitives/
│   │   ├── box.tsx                 # React-only asChild primitive
│   │   ├── slot.tsx                # Slot component for asChild
│   │   └── index.ts
│   ├── utils/
│   │   ├── create-component.ts     # (existing) Factory utility
│   │   ├── events.ts               # (existing) Event utilities
│   │   ├── merge-props.ts          # Props merging for asChild
│   │   └── slot-utils.ts           # asChild/Slot utilities
│   └── types/
│       ├── events.ts               # Custom event type definitions
│       └── polymorphic.ts          # asChild type utilities
├── tests/
│   ├── components/
│   │   ├── button.test.tsx
│   │   ├── link.test.tsx
│   │   ├── text.test.tsx
│   │   ├── icon.test.tsx
│   │   ├── spinner.test.tsx
│   │   └── visually-hidden.test.tsx
│   ├── primitives/
│   │   ├── box.test.tsx
│   │   └── slot.test.tsx
│   └── utils/
│       ├── merge-props.test.ts
│       └── slot-utils.test.ts
└── package.json
```

**Structure Decision**: Extend existing `packages/react` structure. Add `primitives/` directory for React-only components (Box, Slot). Add `types/` directory for shared type definitions. Maintain separation between WC wrappers (`components/`) and React-only primitives (`primitives/`).

## Complexity Tracking

> No Constitution Check violations - all requirements align with constitution principles.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Phase 0: Research Summary

See [research.md](./research.md) for detailed analysis.

### Key Decisions

1. **Slot Implementation**: Implement minimal Slot from scratch (~50 lines) rather than adding @radix-ui/react-slot dependency. Only need single-child case, and constitution requires minimal dependencies.

2. **Component Categories**:
   | Category | Components | Rationale |
   |----------|------------|-----------|
   | Factory | Icon, Spinner, VisuallyHidden | Simple prop forwarding |
   | Manual | Button, Link, Input | Custom events, complex props |
   | asChild | Box, Text, Link | Polymorphic rendering |

3. **Text/Box Strategy**: React-only components (no WC dependency) that apply CSS classes. More elegant than wrapping the WC for polymorphic cases.

4. **Next.js Compatibility**: Dual entry points (`index.ts` for types, `client.ts` for components) to minimize client boundary surface.

### Open Questions Resolved
- Box is React-only, applies CSS classes from @ds/css (no WC dependency)
- cloneElement deprecation: Not blocking - no removal timeline announced

## Phase 1: Design Artifacts

### Data Model
See [data-model.md](./data-model.md) for complete TypeScript type definitions:
- Core types (Slot, AsChild, Events)
- Component props (Button, Link, Input, Text, Icon, Spinner, VisuallyHidden)
- Primitive props (Box)
- Factory configuration types

### Quickstart Guide
See [quickstart.md](./quickstart.md) for:
- Installation and basic usage
- Component examples for all 10 components
- asChild pattern examples
- Next.js App Router integration patterns

### Component Contracts
See [contracts/](./contracts/) for detailed behavioral specifications:
- [slot.contract.md](./contracts/slot.contract.md) - Slot utility
- [box.contract.md](./contracts/box.contract.md) - Box primitive
- [text.contract.md](./contracts/text.contract.md) - Text primitive
- [link.contract.md](./contracts/link.contract.md) - Link wrapper with asChild
- [factory-components.contract.md](./contracts/factory-components.contract.md) - Icon, Spinner, VisuallyHidden
- [exports.contract.md](./contracts/exports.contract.md) - Package export structure

## Implementation Order

Based on dependency analysis:

1. **Utilities** (foundation)
   - `merge-props.ts` - Props merging logic
   - Update `create-component.ts` - Add defaults support

2. **Slot Primitive** (enables asChild)
   - `primitives/slot.tsx` - Core Slot component
   - Tests for props merging, event composition, ref merging

3. **asChild Primitives** (depends on Slot)
   - `primitives/box.tsx` - Layout primitive
   - `components/text.tsx` - Typography primitive

4. **WC Wrappers** (parallel work)
   - `components/link.tsx` - With onNavigate + asChild
   - `components/icon.tsx` - Factory-generated
   - `components/spinner.tsx` - Factory-generated
   - `components/visually-hidden.tsx` - Factory-generated

5. **Export Structure** (final)
   - `types/events.ts` - Event type exports
   - `types/polymorphic.ts` - asChild type exports
   - `index.ts` - Type-only exports
   - `client.ts` - Component exports
   - Update `package.json` exports

6. **Testing & Documentation**
   - Unit tests for all components
   - Update existing Button/Input tests if needed
   - Bundle size verification
