# Feature Specification: Design System Quality Overhaul

**Feature Branch**: `023-quality-overhaul`
**Created**: 2026-01-09
**Status**: Draft
**Input**: Comprehensive audit findings requiring remediation of P0-P2 items including full a11y test coverage for 55 components and overlay composite primitives

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Accessibility Test Coverage (Priority: P1)

As a design system maintainer, I need axe accessibility tests for all 55 components so that accessibility regressions are caught automatically before release.

**Why this priority**: Currently only 18/55 components have axe tests. This is a critical gap that exposes the system to WCAG violations. Full a11y coverage is the foundation for a reliable, accessible design system.

**Independent Test**: Can be fully tested by running `pnpm test:a11y` and verifying all 60 components pass axe-core automated checks.

**Acceptance Scenarios**:

1. **Given** a component without a11y tests, **When** I run the a11y test suite, **Then** I see axe tests for that component covering default, disabled, loading, and variant states
2. **Given** all 55 components with a11y tests, **When** I run `pnpm test:a11y`, **Then** all tests pass with no axe violations
3. **Given** a component with an accessibility regression, **When** I run CI, **Then** the a11y test fails and blocks the PR

---

### User Story 2 - Overlay Composite Primitives (Priority: P1)

As a component developer, I need composite overlay primitives (createModalOverlay, createPopoverOverlay) that bundle focus-trap, dismissable-layer, and presence animation so that I can implement accessible modal/popover patterns without manually coordinating multiple primitives.

**Why this priority**: The audit identified that Dialog, Sheet, Popover, and DropdownMenu all duplicate the same focus-trap + dismissable-layer + presence coordination pattern. This duplication leads to inconsistent behavior and maintenance burden.

**Independent Test**: Can be tested by creating a modal using `createModalOverlay()` and verifying focus trapping, Escape key dismissal, and exit animations work correctly.

**Acceptance Scenarios**:

1. **Given** a new Dialog implementation, **When** I use createModalOverlay(), **Then** focus is trapped, Escape closes, backdrop click closes, and exit animations play
2. **Given** createPopoverOverlay with anchor positioning, **When** the popover opens, **Then** it positions relative to trigger and repositions on scroll/resize
3. **Given** prefers-reduced-motion enabled, **When** an overlay animates, **Then** animations are skipped per user preference

---

### User Story 3 - Selectable List Composite (Priority: P2)

As a component developer, I need a createSelectableList composite that bundles roving-focus, type-ahead, and selection tracking so that Listbox, Combobox, and Menu components share consistent keyboard navigation.

**Why this priority**: Multiple components (Listbox, Combobox, Menu, RadioGroup) implement similar selection + keyboard patterns. A shared composite reduces code duplication and ensures consistent UX.

**Independent Test**: Can be tested by creating a selectable list and verifying arrow key navigation, type-ahead filtering, and selection state management.

**Acceptance Scenarios**:

1. **Given** a list using createSelectableList(), **When** I press Arrow Down, **Then** focus moves to next item with roving tabindex
2. **Given** a list with type-ahead enabled, **When** I type "app", **Then** focus jumps to first item starting with "app"
3. **Given** multi-select mode, **When** I hold Shift and click, **Then** range selection is applied

---

### User Story 4 - Performance Fix: Scroll Area (Priority: P2)

As a user scrolling content, I need the scroll area thumb to update smoothly without layout thrashing so that scrolling feels performant.

**Why this priority**: The audit identified repeated `getBoundingClientRect()` calls during scroll that cause layout thrashing. This affects UX but is not a blocking issue.

**Independent Test**: Can be tested by scrolling content in a scroll-area and measuring frame rate with DevTools Performance panel.

**Acceptance Scenarios**:

1. **Given** scroll-area-thumb.ts, **When** user scrolls, **Then** thumb position updates using cached dimensions (no per-frame layout queries)
2. **Given** scroll-area resize, **When** container dimensions change, **Then** dimensions are recalculated once via ResizeObserver

---

### User Story 5 - Extract ARIA Utilities (Priority: P2)

As a component developer, I need shared ARIA utility helpers (generateAriaId, connectAriaDescribedBy, announceToScreenReader) so that components implement ARIA patterns consistently without duplication.

**Why this priority**: Multiple components generate unique IDs and wire up aria-describedby relationships. Centralizing these utilities ensures consistency and reduces errors.

**Independent Test**: Can be tested by importing utilities and verifying ID generation and ARIA relationship setup.

**Acceptance Scenarios**:

1. **Given** generateAriaId("dialog-title"), **When** called twice, **Then** returns unique IDs like "dialog-title-1", "dialog-title-2"
2. **Given** connectAriaDescribedBy(element, describer), **When** called, **Then** sets up bidirectional aria-describedby relationship

---

### User Story 6 - React Hook Anti-Pattern Fix (Priority: P2)

As a React developer using the design system, I need stable event handler references so that my components don't have unnecessary re-renders caused by handler recreation.

**Why this priority**: The audit found handlers being recreated on every render in useEffect dependencies. While not critical, this causes subtle performance issues in React applications.

**Independent Test**: Can be tested by profiling React adapter components and verifying handlers maintain referential stability.

**Acceptance Scenarios**:

1. **Given** ds-input React adapter, **When** parent re-renders, **Then** internal handlers maintain referential equality (via useCallback with stable deps)
2. **Given** any React adapter component, **When** profiled with React DevTools, **Then** no "highlight updates" flicker from internal handler changes

---

### User Story 7 - Component Manifests (Priority: P2)

As a documentation system, I need manifest.json files for all 55 components so that the docs-core package can auto-generate component documentation and validate contracts.

**Why this priority**: The docs system requires manifest files to generate API docs. Many components are missing manifests, blocking automated documentation.

**Independent Test**: Can be tested by running `pnpm --filter @ds/docs-core validate:manifests` and seeing all 60 components pass.

**Acceptance Scenarios**:

1. **Given** a component directory, **When** checked, **Then** manifest.json exists with props, events, slots, and parts documented
2. **Given** all manifests present, **When** docs build runs, **Then** API documentation is auto-generated for all components

---

### User Story 8 - Development Warnings (Priority: P2)

As a component developer, I need dev-time warnings for common a11y mistakes so that issues are caught during development before reaching production.

**Why this priority**: The audit found accessibility warnings are not consistently implemented. Dev warnings provide early feedback to catch issues.

**Independent Test**: Can be tested by intentionally omitting required aria attributes and verifying console warnings appear in dev mode.

**Acceptance Scenarios**:

1. **Given** ds-dialog without aria-labelledby in dev mode, **When** rendered, **Then** console warns "DS003: Dialog missing aria-labelledby"
2. **Given** production build, **When** same condition occurs, **Then** no warning is logged (tree-shaken)

---

### User Story 9 - ComponentController Mixin (Priority: P3)

As a component author, I need a ComponentController mixin that standardizes lifecycle, form participation, and error handling so that all components behave consistently.

**Why this priority**: Lower priority as existing components work, but a controller pattern would reduce boilerplate and ensure consistency for new components.

**Independent Test**: Can be tested by creating a new component with ComponentController and verifying lifecycle hooks fire correctly.

**Acceptance Scenarios**:

1. **Given** a component extending ComponentController, **When** connected to DOM, **Then** standard lifecycle hooks (onMount, onUnmount, onUpdate) fire
2. **Given** a form-associated component, **When** inside a form, **Then** ElementInternals are set up automatically

---

### User Story 10 - High Contrast Mode Tests (Priority: P3)

As a user with visual impairments, I need components to remain usable in Windows High Contrast Mode so that I can use the design system regardless of my display settings.

**Why this priority**: While important for accessibility, this is lower priority as it affects a smaller user segment. Current components generally work due to semantic HTML.

**Independent Test**: Can be tested by enabling Windows High Contrast and visually verifying component boundaries are visible.

**Acceptance Scenarios**:

1. **Given** Windows High Contrast enabled, **When** viewing interactive components, **Then** focus indicators and boundaries are visible
2. **Given** forced-colors media query, **When** active, **Then** components use system colors appropriately

---

### Edge Cases

- What happens when multiple modals are open simultaneously? (Stack management)
- How does focus restoration work when a modal opens another modal?
- What happens when type-ahead search matches no items?
- How do scroll-area dimensions update when content is dynamically added?
- What happens when aria-describedby target is removed from DOM?

## Requirements *(mandatory)*

### Functional Requirements

**Accessibility Testing (P0)**
- **FR-001**: System MUST have axe-core tests for all 55 components in `packages/wc/tests/a11y/`
- **FR-002**: Each a11y test MUST cover default state, disabled state, and loading state where applicable
- **FR-003**: Each a11y test MUST cover all variants (size, color, etc.)
- **FR-004**: CI pipeline MUST run a11y tests and fail on violations

**Overlay Composites (P0)**
- **FR-005**: `createModalOverlay()` MUST bundle focus-trap, dismissable-layer, and presence primitives
- **FR-006**: `createPopoverOverlay()` MUST include anchor positioning with collision detection
- **FR-007**: Composites MUST respect prefers-reduced-motion media query
- **FR-008**: Composites MUST provide TypeScript types for all options and return values

**Selectable List Composite (P1)**
- **FR-009**: `createSelectableList()` MUST bundle roving-focus, type-ahead, and selection tracking
- **FR-010**: Selection MUST support single and multi-select modes
- **FR-011**: Type-ahead MUST support configurable debounce and match strategy

**Performance (P1)**
- **FR-012**: scroll-area-thumb MUST cache dimensions and only recalculate on resize
- **FR-013**: Animation exit handling MUST clean up timeouts properly

**ARIA Utilities (P1)**
- **FR-014**: `generateAriaId()` MUST return globally unique IDs with optional prefix
- **FR-015**: `connectAriaDescribedBy()` MUST handle multiple describers
- **FR-016**: `announceToScreenReader()` MUST use aria-live regions appropriately

**React Patterns (P1)**
- **FR-017**: All React adapters MUST use useCallback for event handlers
- **FR-018**: Handler dependencies MUST be stable (no object/function literals)

**Component Manifests (P1)**
- **FR-019**: All 55 components MUST have manifest.json files
- **FR-020**: Manifests MUST include props, events, slots, and CSS parts

**Dev Warnings (P1)**
- **FR-021**: Dev warnings MUST be tree-shaken in production builds
- **FR-022**: Warnings MUST follow DS00X code convention (DS001-DS006)

**ComponentController (P2)**
- **FR-023**: Controller mixin MUST handle connectedCallback/disconnectedCallback
- **FR-024**: Controller MUST provide form association via ElementInternals

**High Contrast (P2)**
- **FR-025**: Components MUST be tested in Windows High Contrast Mode
- **FR-026**: Focus indicators MUST remain visible in forced-colors mode

### Key Entities

- **Composite Primitive**: A higher-level primitive that bundles multiple low-level primitives (focus-trap, dismissable-layer, etc.) into a single cohesive API
- **ModalOverlay**: Composite for modal dialogs with focus trapping, dismissal handling, and animated presence
- **PopoverOverlay**: Composite for positioned popovers with anchor positioning and collision avoidance
- **SelectableList**: Composite for keyboard-navigable, selectable lists with type-ahead
- **ARIA Utility**: Shared helper functions for consistent ARIA pattern implementation
- **Component Manifest**: JSON metadata file describing component API (props, events, slots, parts)

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Code Reuse**: Maximize shared code between WC and React to reduce maintenance burden
- **Bundle Size**: Composites should be tree-shakeable; unused primitives should not increase bundle
- **Accessibility Completeness**: Test coverage should catch regressions before release
- **Migration Path**: Changes should not break existing component consumers

### Approach A: Incremental Remediation

Add tests and composites incrementally over multiple sprints, allowing gradual improvement while maintaining stability.

**Pros**:
- Lower risk of regressions
- Can ship partial improvements quickly
- Easier code review with smaller PRs

**Cons**:
- Longer total timeline
- Potential for inconsistency during transition period
- May leave gaps if priorities shift

### Approach B: Comprehensive Overhaul

Complete all P0-P2 items in a single coordinated effort with a dedicated sprint.

**Pros**:
- Consistent end state across all components
- Clear milestone for "quality complete"
- Single QA pass covers all changes

**Cons**:
- Higher risk if issues discovered late
- Large PR size makes review harder
- Blocks other work during sprint

### Approach C: Phased with Checkpoints (Recommended)

Implement in 3 phases (P0 → P1 → P2) with CI gates between phases. Each phase is a complete deliverable.

**Pros**:
- Balances speed with risk management
- Each phase is independently valuable
- CI gates ensure quality before proceeding
- Allows course correction between phases

**Cons**:
- Requires discipline to complete all phases
- Three code review cycles

### Recommendation

**Recommended: Approach C - Phased with Checkpoints**

This approach aligns with constitution principles:
1. **Performance**: Composites are tree-shakeable, scroll-area fix addresses measured perf issue
2. **Accessibility**: P0 focuses entirely on a11y test coverage, ensuring no regressions
3. **Customizability**: Composites provide options without forcing specific patterns

The phased approach allows shipping P0 a11y coverage quickly (highest value) while ensuring P1/P2 improvements follow. CI gates between phases prevent quality regression.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of components (55/55) have passing axe-core accessibility tests
- **SC-002**: Zero code duplication for overlay patterns (Dialog, Sheet, Popover, DropdownMenu all use composites)
- **SC-003**: scroll-area maintains 60fps during scrolling (no layout thrashing in DevTools)
- **SC-004**: All React adapter handlers maintain referential equality across re-renders
- **SC-005**: `pnpm --filter @ds/docs-core validate:manifests` passes for all 55 components
- **SC-006**: CI pipeline includes a11y test gate that blocks PRs with violations
- **SC-007**: New components can be built 40% faster using composites (measured by LOC reduction)

## Component List for A11y Testing

The following 55 components require axe-core accessibility tests:

**Form Controls (14)**
1. ds-button ✓ (existing)
2. ds-input
3. ds-textarea
4. ds-checkbox
5. ds-radio-group
6. ds-switch
7. ds-select
8. ds-slider
9. ds-date-picker
10. ds-time-picker
11. ds-file-upload
12. ds-rating
13. ds-pin-input
14. ds-color-picker

**Navigation (8)**
15. ds-breadcrumb
16. ds-tabs
17. ds-pagination
18. ds-navigation-menu
19. ds-sidebar
20. ds-stepper
21. ds-skip-link
22. ds-link

**Overlays (8)**
23. ds-dialog
24. ds-drawer/sheet
25. ds-popover
26. ds-tooltip
27. ds-dropdown-menu
28. ds-context-menu
29. ds-alert-dialog
30. ds-command

**Feedback (7)**
31. ds-toast
32. ds-alert
33. ds-progress
34. ds-skeleton
35. ds-spinner
36. ds-badge
37. ds-banner

**Data Display (9)**
38. ds-data-table
39. ds-accordion
40. ds-card
41. ds-avatar
42. ds-carousel
43. ds-collapsible
44. ds-hover-card
45. ds-list
46. ds-tree-view

**Layout (8)**
47. ds-container
48. ds-stack
49. ds-grid
50. ds-flex
51. ds-divider
52. ds-scroll-area
53. ds-resizable
54. ds-aspect-ratio

**Typography (3)**
55. ds-heading
56. ds-text
57. ds-label

**Utilities (3)**
58. ds-visually-hidden
59. ds-portal
60. ds-focus-scope
