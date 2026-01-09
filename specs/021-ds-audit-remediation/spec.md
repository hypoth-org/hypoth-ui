# Feature Specification: Design System Audit Remediation

**Feature Branch**: `021-ds-audit-remediation`
**Created**: 2026-01-09
**Status**: Draft
**Input**: User description: "Address comprehensive design system audit recommendations including P0 critical issues (form association, behavior deduplication, tree-shaking), P1 high priority items (Tabs behavior, keyboard handling), and P2 medium priority improvements (entrypoints, test harness)."

## Clarifications

### Session 2026-01-09

- Q: What is the minimum browser support target for ElementInternals form association? → A: Modern only: Chrome 77+, Firefox 93+, Safari 16.4+ (no polyfill)
- Q: How should form validation errors be displayed for form-associated WC controls? → A: Both: Support native by default, allow custom via opt-in attribute

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Native Form Participation for WC Form Controls (Priority: P1)

As a developer using Web Components in a standard HTML form, I want form controls (Checkbox, Switch, Radio, Select, Combobox) to participate natively in form submission so that values are included when the form is submitted without requiring custom JavaScript event handling.

**Why this priority**: Native form integration is fundamental for production use. Without ElementInternals/formAssociated, WC form controls cannot participate in `<form>` submit events, making them unsuitable for standard form workflows.

**Independent Test**: Can be tested by wrapping a ds-checkbox in a `<form>`, submitting, and verifying the value appears in FormData.

**Acceptance Scenarios**:

1. **Given** a ds-checkbox inside a form with name="terms", **When** the form is submitted, **Then** FormData contains terms=on (or the checkbox value)
2. **Given** a ds-switch with name="notifications" in a form, **When** user toggles it on and submits, **Then** FormData includes notifications=true
3. **Given** a ds-select with name="country" in a form, **When** user selects a value and submits, **Then** FormData includes the selected value
4. **Given** a form with ds-input[required], **When** form.reportValidity() is called, **Then** validation messages appear and form submission is blocked if invalid

---

### User Story 2 - Tree-Shaking Support for WC Package (Priority: P1)

As a developer importing specific components from @ds/wc, I want unused components excluded from my bundle so that my application's JavaScript payload is minimized.

**Why this priority**: Bundle size directly impacts load time and user experience. The current barrel file approach forces bundlers to include all 400+ lines of exports even when only one component is used.

**Independent Test**: Import only `ds-button` from @ds/wc, build with tree-shaking enabled bundler, verify bundle does not include dialog, tabs, or other unused component code.

**Acceptance Scenarios**:

1. **Given** a project importing only DsButton, **When** built with Vite/webpack in production mode, **Then** bundle size is <20KB (baseline component only)
2. **Given** a project importing DsButton and DsInput, **When** built with tree-shaking, **Then** bundle excludes all Dialog, Tabs, Accordion code
3. **Given** package.json has `sideEffects: false`, **When** bundler analyzes imports, **Then** dead code elimination removes unused exports

---

### User Story 3 - Unified Behavior Primitives for WC Overlays (Priority: P1)

As a maintainer of the design system, I want Web Component overlays (Dialog, AlertDialog, Sheet, Drawer, DropdownMenu) to use shared behavior primitives from @ds/primitives-dom so that accessibility patterns and keyboard handling are consistent across React and WC implementations.

**Why this priority**: The React implementation correctly uses createDialogBehavior/createMenuBehavior from primitives-dom, but WC duplicates this logic. This creates maintenance burden and potential accessibility inconsistencies.

**Independent Test**: Verify DsDialog uses createDialogBehavior, maintains identical keyboard navigation as React Dialog component.

**Acceptance Scenarios**:

1. **Given** DsDialog component, **When** inspecting implementation, **Then** it imports and uses createDialogBehavior from @ds/primitives-dom
2. **Given** DsSheet component with createDialogBehavior, **When** user presses Escape, **Then** behavior matches React Sheet exactly
3. **Given** DsDropdownMenu using createMenuBehavior, **When** user navigates with arrow keys, **Then** focus management matches React DropdownMenu

---

### User Story 4 - Tabs Behavior Primitive (Priority: P2)

As a component developer, I want a createTabsBehavior primitive in @ds/primitives-dom so that Tabs keyboard navigation and ARIA patterns are centralized and reusable across React and WC.

**Why this priority**: Both React and WC Tabs components implement similar keyboard navigation logic separately. While functional, this creates maintenance overhead for a commonly-used pattern.

**Independent Test**: Create createTabsBehavior, integrate into DsTabs, verify all WAI-ARIA Tabs pattern requirements pass.

**Acceptance Scenarios**:

1. **Given** createTabsBehavior primitive, **When** Arrow keys pressed on tab list, **Then** focus moves correctly based on orientation (horizontal: left/right, vertical: up/down)
2. **Given** activation-mode="manual", **When** focus moves to tab, **Then** tab is not selected until Enter/Space pressed
3. **Given** activation-mode="automatic", **When** focus moves to tab, **Then** tab is automatically selected

---

### User Story 5 - Granular Package Exports (Priority: P2)

As a developer with strict bundle requirements, I want individual component entrypoints in @ds/wc so that I can import `@ds/wc/button` directly for maximum tree-shaking certainty.

**Why this priority**: While sideEffects:false helps tree-shaking, some bundler configurations work better with explicit subpath exports. This provides an escape hatch for edge cases.

**Independent Test**: Import `@ds/wc/button`, verify only button component code is included.

**Acceptance Scenarios**:

1. **Given** @ds/wc/button import, **When** bundled, **Then** only Button component and its direct dependencies included
2. **Given** package.json exports field, **When** importing subpath, **Then** TypeScript types resolve correctly
3. **Given** @ds/wc/dialog import, **When** bundled, **Then** includes Dialog and child components (DialogContent, DialogTitle, etc.)

---

### User Story 6 - Shared Test Harness (Priority: P3)

As a component test author, I want a shared test harness that works for both React and WC implementations so that accessibility and behavior tests can be written once and run against both frameworks.

**Why this priority**: Reduces test maintenance burden and ensures parity between implementations. Lower priority as it's developer experience rather than end-user facing.

**Independent Test**: Write one keyboard navigation test, run against both Button implementations, both pass.

**Acceptance Scenarios**:

1. **Given** shared test for "button activates on Enter", **When** run against ds-button (WC) and Button (React), **Then** both pass
2. **Given** shared a11y test for dialog focus trap, **When** run against both implementations, **Then** identical behavior verified

---

### Edge Cases

- What happens when ElementInternals is not supported (older browsers)? Target modern browsers only (Chrome 77+, Firefox 93+, Safari 16.4+); no polyfill required.
- How does form association work with Shadow DOM? Use formAssociated: true static property correctly.
- What if bundler doesn't support exports field? Maintain backward-compatible main entry.
- How to handle circular dependencies when refactoring to use behavior primitives? Use careful import ordering and lazy initialization where needed.

## Requirements *(mandatory)*

### Functional Requirements

**P1 - Critical (Form Association)**
- **FR-001**: DsCheckbox MUST use ElementInternals with static formAssociated = true
- **FR-002**: DsSwitch MUST use ElementInternals with static formAssociated = true
- **FR-003**: DsRadio/DsRadioGroup MUST use ElementInternals with proper group handling
- **FR-004**: DsSelect MUST use ElementInternals for form value submission
- **FR-005**: DsCombobox MUST use ElementInternals for form value submission
- **FR-006**: All form-associated components MUST support name, value, disabled, required attributes
- **FR-007**: Form validation MUST integrate with native constraint validation API (setValidity, reportValidity); native browser UI by default, custom ds-field-error integration via opt-in attribute

**P1 - Critical (Tree-Shaking)**
- **FR-008**: @ds/wc package.json MUST include `"sideEffects": false`
- **FR-009**: All component imports MUST be ES module compatible for static analysis
- **FR-010**: Component files MUST NOT have module-level side effects beyond class definition and define() call

**P1 - Critical (Behavior Deduplication)**
- **FR-011**: DsDialog MUST use createDialogBehavior from @ds/primitives-dom
- **FR-012**: DsAlertDialog MUST use createDialogBehavior with alertdialog role configuration
- **FR-013**: DsSheet MUST use createDialogBehavior with side panel configuration
- **FR-014**: DsDrawer MUST use createDialogBehavior with drawer configuration
- **FR-015**: DsDropdownMenu MUST use createMenuBehavior from @ds/primitives-dom
- **FR-016**: DsContextMenu MUST use createMenuBehavior from @ds/primitives-dom

**P2 - High (Tabs Behavior)**
- **FR-017**: @ds/primitives-dom MUST export createTabsBehavior
- **FR-018**: createTabsBehavior MUST handle horizontal and vertical orientations
- **FR-019**: createTabsBehavior MUST support automatic and manual activation modes
- **FR-020**: DsTabs MUST use createTabsBehavior for keyboard navigation

**P2 - High (Granular Exports)**
- **FR-021**: @ds/wc package.json exports field MUST include subpath for each component category
- **FR-022**: Subpath exports MUST include TypeScript type definitions
- **FR-023**: Main entry MUST remain backward compatible

**P3 - Medium (Test Harness)**
- **FR-024**: Shared test utilities MUST work with both Vitest and component test environments
- **FR-025**: Test harness MUST provide framework-agnostic assertions for keyboard navigation
- **FR-026**: Test harness MUST provide framework-agnostic assertions for ARIA attributes

### Key Entities

- **ElementInternals**: Browser API for custom element form participation, validation, accessibility
- **Behavior Primitive**: Stateless utility from @ds/primitives-dom that encapsulates interaction patterns (focus, keyboard, dismissal)
- **Form-Associated Custom Element**: Custom element with static formAssociated = true that can participate in HTML forms
- **Subpath Export**: Package.json exports field entry enabling granular imports like `@ds/wc/button`

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Bundle Impact**: Final bundle size for typical usage patterns (importing 3-5 components)
- **Maintenance Burden**: Lines of duplicated code, number of files to update for behavior changes
- **Browser Compatibility**: Modern browsers only - Chrome 77+, Firefox 93+, Safari 16.4+ (no polyfills)
- **Migration Effort**: Amount of breaking changes, code modification required

### Approach A: Incremental Refactoring

Refactor each component category sequentially: (1) Add form association to form controls, (2) Add sideEffects:false, (3) Migrate overlays to use behavior primitives, (4) Add createTabsBehavior.

**Pros**:
- Lower risk - changes can be tested in isolation
- Easier code review - smaller PRs
- Can ship improvements incrementally

**Cons**:
- Longer total implementation time
- Temporary inconsistency between migrated and non-migrated components
- Multiple deployment cycles

### Approach B: Comprehensive Single Release

Implement all P1 changes in a single coordinated release, with P2/P3 following in a subsequent release.

**Pros**:
- Clean cutover - all critical issues addressed at once
- Simpler documentation - single set of migration notes
- Ensures consistent implementation patterns from day one

**Cons**:
- Larger change set increases review complexity
- Higher risk if issues discovered post-release
- Longer time to first improvement

### Approach C: Feature-Flagged Gradual Rollout

Implement changes behind feature flags, allowing components to opt-in to new behavior patterns during a transition period.

**Pros**:
- Enables A/B testing of new implementations
- Reduces risk during transition

**Cons**:
- Adds complexity for a library with no consumers
- Feature flag overhead not justified given no backward compatibility requirement
- Complicates testing matrix

### Recommendation

**Recommended: Approach A (Incremental Refactoring)**

Given the user's explicit statement that there are no consumers and no backward compatibility requirements, Approach A provides the best balance:

1. **Bundle Impact**: sideEffects:false can ship immediately with no code changes, providing immediate tree-shaking benefit
2. **Maintenance Burden**: Incremental approach allows thorough testing of behavior primitive migrations without risking regressions across all overlays simultaneously
3. **Browser Compatibility**: Form association changes can include polyfill detection and graceful degradation, testable in isolation
4. **Migration Effort**: Zero migration effort for non-existent consumers; incremental approach allows for course correction

The lack of consumers actually makes Approach A more attractive because there's no pressure to ship everything at once - each improvement can be merged and verified before proceeding.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All form controls (Checkbox, Switch, Radio, Select, Combobox) pass FormData submission test
- **SC-002**: Bundle size for single-component import (ds-button only) is <15KB gzipped
- **SC-003**: Zero lines of focus-trap/dismiss-layer logic remain in DsDialog, DsSheet, DsDrawer, DsAlertDialog (moved to behavior primitives)
- **SC-004**: DsTabs passes all WAI-ARIA Tabs pattern automated tests using createTabsBehavior
- **SC-005**: @ds/wc exports field includes at least 10 subpath entries for major component categories
- **SC-006**: TypeScript compilation succeeds with no type errors after all refactoring
- **SC-007**: All existing component tests continue to pass after migrations
