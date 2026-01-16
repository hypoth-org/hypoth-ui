# Feature Specification: Architecture Review Fixes

**Feature Branch**: `024-arch-review-fixes`
**Created**: 2026-01-10
**Status**: Draft
**Input**: User description: "Address architecture review gaps: CLI registry alignment, template coverage expansion, MDX documentation completion, and Button double-event bug fix"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Button Event Reliability (Priority: P1)

As a developer using ds-button, I need the component to emit exactly one `ds:press` event per user activation so that my event handlers execute predictably without duplicate side effects.

**Why this priority**: This is a bug that affects all button users immediately. Duplicate events can cause double form submissions, double API calls, or inconsistent UI state. Critical path for any interactive application.

**Independent Test**: Can be fully tested by clicking a button or pressing Enter/Space on a focused button and verifying exactly one event fires each time.

**Acceptance Scenarios**:

1. **Given** a ds-button with an event listener for `ds:press`, **When** the user clicks the button with a mouse, **Then** exactly one `ds:press` event is emitted
2. **Given** a ds-button with an event listener for `ds:press`, **When** the user presses Enter while the button is focused, **Then** exactly one `ds:press` event is emitted
3. **Given** a ds-button with an event listener for `ds:press`, **When** the user presses Space while the button is focused, **Then** exactly one `ds:press` event is emitted
4. **Given** a ds-button, **When** `ds:press` is emitted via keyboard, **Then** the event detail includes `isKeyboard: true` to distinguish activation method

---

### User Story 2 - CLI Component Installation (Priority: P2)

As a developer adopting hypoth-ui, I need to install any component via the CLI with full source code copied to my project so that I can customize components without being locked to package updates.

**Why this priority**: Copy-mode adoption (shadcn/ui style) is a key differentiator. Currently only 6/54 components have templates, blocking adoption for 89% of components.

**Independent Test**: Can be fully tested by running `hypoth-ui add [component]` with `style: "copy"` config and verifying source files appear in the project's components directory.

**Acceptance Scenarios**:

1. **Given** a project with `ds.config.json` set to `style: "copy"`, **When** running `hypoth-ui add accordion`, **Then** the accordion component source files are copied to the configured components directory
2. **Given** a project configured for React framework, **When** copying any component, **Then** only React-specific source files are copied (not WC files)
3. **Given** a project configured for WC/vanilla framework, **When** copying any component, **Then** only Web Component source files are copied (not React files)
4. **Given** any component in the CLI registry, **When** running `hypoth-ui add [component]` with copy mode, **Then** the component is successfully installed with full source code

---

### User Story 3 - CLI Registry Completeness (Priority: P2)

As a developer browsing available components, I need the CLI registry to include all components that exist in the design system so that I can discover and use any component via the CLI.

**Why this priority**: The CLI registry is missing 2 components (layout, radio) and has a naming inconsistency (radio-group vs radio). This creates confusion and incomplete adoption paths.

**Independent Test**: Can be tested by running `hypoth-ui list` and comparing output against WC component list.

**Acceptance Scenarios**:

1. **Given** a user running `hypoth-ui list`, **When** comparing to WC components, **Then** all 55 WC components are listed (or explicitly documented as intentionally excluded)
2. **Given** the component named `radio` in WC, **When** listed in CLI registry, **Then** the naming is consistent (either both use `radio` or both use `radio-group`)
3. **Given** the `layout` component in WC, **When** running `hypoth-ui add layout`, **Then** the layout component can be installed

---

### User Story 4 - Component Documentation Discovery (Priority: P3)

As a developer evaluating or using hypoth-ui, I need comprehensive MDX documentation for each component so that I can understand usage patterns, props, and examples without reading source code.

**Why this priority**: Documentation is a major adoption friction point. Currently only 24/55 components (44%) have MDX docs. However, all components have WC manifests with a11y contracts, so this is an enhancement rather than critical gap.

**Independent Test**: Can be tested by navigating to a component's documentation page and verifying it contains usage examples, props documentation, and accessibility notes.

**Acceptance Scenarios**:

1. **Given** any component in the design system, **When** accessing its documentation page, **Then** MDX documentation exists with at least: overview, basic usage example, props table, and accessibility notes
2. **Given** a component's MDX documentation, **When** viewing props, **Then** each prop includes name, type, default value, and description
3. **Given** a component with multiple variants, **When** viewing documentation, **Then** examples demonstrate each variant
4. **Given** a component documentation page, **When** reviewing accessibility section, **Then** keyboard navigation and ARIA requirements are documented

---

### Edge Cases

- What happens when a template file is corrupted or missing during copy operation? System should fail gracefully with clear error message.
- How does CLI handle component names that exist in registry but have no template? Should either have template or be excluded from copy mode with clear message.
- What happens when copying a component with dependencies? All dependency templates must also exist, or installation should fail with list of missing dependencies.
- How does documentation handle components with framework-specific differences? MDX should document both WC and React usage patterns.

## Requirements *(mandatory)*

### Functional Requirements

**Button Event Fix:**
- **FR-001**: ds-button MUST emit exactly one `ds:press` event per activation regardless of input method (mouse click, keyboard Enter, keyboard Space)
- **FR-002**: ds-button `ds:press` event MUST include `isKeyboard: boolean` in event detail to indicate activation method
- **FR-003**: ds-button MUST NOT call `this.click()` from keyboard handlers to prevent duplicate event emission

**CLI Registry Alignment:**
- **FR-004**: CLI registry MUST include all components that have WC implementations, with consistent naming
- **FR-005**: CLI registry MUST include `layout` component entry matching WC implementation
- **FR-006**: CLI registry MUST use consistent naming for radio component (align WC `radio` with CLI naming)

**CLI Template Coverage:**
- **FR-007**: CLI MUST have bundled templates for all 54 components in the registry
- **FR-008**: Each template MUST include framework-specific files (React and/or WC based on component support)
- **FR-009**: Templates MUST support import path transformation based on user's configured aliases
- **FR-010**: CLI copy operation MUST fail gracefully if template is missing, with clear error message listing missing files

**MDX Documentation:**
- **FR-011**: Every component MUST have MDX documentation file in docs-content package
- **FR-012**: MDX documentation MUST include: overview section, basic usage example, props/attributes table, and accessibility section
- **FR-013**: Props table MUST include: name, type, default value, and description for each prop
- **FR-014**: Accessibility section MUST document keyboard interactions and ARIA requirements

### Key Entities

- **Component Template**: Source files bundled with CLI for copy-mode installation. Includes framework-specific variants and supports alias transformation.
- **CLI Registry Entry**: Component metadata including name, description, dependencies, npm dependencies, supported frameworks, and file manifest.
- **MDX Documentation**: User-facing component documentation with structured sections for overview, usage, props, and accessibility.

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Development Velocity**: How quickly can we address all gaps with available resources?
- **Consistency**: Does the approach maintain consistent patterns across all components?
- **Maintainability**: How easy is it to keep templates/docs in sync with component changes?

### Approach A: Incremental Component-by-Component

Address each component one at a time, completing template + documentation + registry for each before moving to the next.

**Pros**:
- Each component becomes fully complete before moving on
- Easier to track progress per component
- Can release incrementally

**Cons**:
- Slower overall completion
- May miss cross-cutting patterns that could be templated
- Button bug fix delayed if done in component order

### Approach B: Issue-Type Batching

Fix all instances of each issue type together: (1) Button bug, (2) all registry entries, (3) all templates, (4) all MDX docs.

**Pros**:
- Button bug fixed immediately as P1
- Batching similar work enables pattern reuse
- Registry and templates can be scripted/automated
- Documentation can follow consistent template

**Cons**:
- Components aren't "complete" until all batches done
- Requires tracking multiple parallel workstreams

### Approach C: Priority-Tiered Rollout

Fix P1 bug immediately, then batch remaining work by component priority (most-used components first).

**Pros**:
- Critical bug fixed immediately
- High-value components complete first
- Balances velocity with impact

**Cons**:
- Requires determining component priority/usage
- Some components may wait longer for completion

### Recommendation

**Recommended: Approach B (Issue-Type Batching)**

Justification:
1. **Performance**: Button bug fix is isolated and can ship immediately without waiting for docs
2. **Consistency**: Batching templates enables automation and consistent structure across all 54 components
3. **Maintainability**: MDX docs can use a consistent template, making future updates easier

The button bug should be fixed first as an isolated change. Then registry alignment (small change), followed by template generation (can be partially automated from existing component source), and finally documentation (largest effort, can reference WC manifests for a11y content).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Button components emit exactly 1 event per activation (verified by automated tests)
- **SC-002**: CLI registry contains entries for all 55 WC components with consistent naming
- **SC-003**: CLI template coverage reaches 100% (54/54 components have bundled templates)
- **SC-004**: Running `hypoth-ui add [any-component]` with copy mode succeeds for all registry components
- **SC-005**: MDX documentation coverage reaches 100% (55/55 components have MDX docs)
- **SC-006**: All component documentation pages include: overview, usage example, props table, and accessibility section
- **SC-007**: Documentation site search returns results for all component names

## Assumptions

- The 55 WC components represent the canonical component list; CLI registry should align to this
- Template generation can partially leverage existing component source files
- MDX documentation can reference existing WC manifest content for accessibility sections
- The button double-event bug is isolated to `button.ts` and doesn't affect other components
- Radio and radio-group represent the same component with naming inconsistency (not separate components)
