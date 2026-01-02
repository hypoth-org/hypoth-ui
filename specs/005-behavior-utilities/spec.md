# Feature Specification: Framework-Agnostic Behavior Utilities

**Feature Branch**: `005-behavior-utilities`
**Created**: 2026-01-02
**Status**: Draft
**Input**: User description: "Ship framework-agnostic behavior utilities required for accessible components: focus management, roving tabindex, dismissable layer, keyboard helpers. Define stable API signatures and test strategy. Ensure utilities can be used by @ds/wc implementations while preserving Light DOM. Implement primitives + unit tests. Create test harness pages used by docs and e2e. Document usage patterns."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Focus Management for Modal Dialogs (Priority: P1)

When a user opens a modal dialog, focus must be trapped within the modal until dismissed. This ensures keyboard-only users can navigate the dialog content without accidentally tabbing out of the modal into the background page content.

**Why this priority**: Focus trapping is foundational for accessible modals, drawers, and popover components. Without proper focus management, keyboard users cannot interact with overlays safely, making components inaccessible.

**Independent Test**: Can be tested by opening a modal with 3 focusable elements (close button, input, submit button) and pressing Tab repeatedly to verify focus cycles within the modal only.

**Acceptance Scenarios**:

1. **Given** a modal is opened with multiple focusable elements, **When** the user presses Tab on the last focusable element, **Then** focus moves to the first focusable element in the modal
2. **Given** a modal is opened, **When** the user presses Shift+Tab on the first focusable element, **Then** focus moves to the last focusable element in the modal
3. **Given** a modal has an initial focus target specified, **When** the modal opens, **Then** focus is programmatically moved to that target element
4. **Given** focus was on a trigger button before modal opened, **When** the modal is dismissed, **Then** focus returns to the original trigger button

---

### User Story 2 - Keyboard Navigation for Composite Widgets (Priority: P1)

When a user interacts with a composite widget (tabs, menu, toolbar, listbox), arrow keys navigate between options while Tab moves focus into/out of the widget. This follows WAI-ARIA roving tabindex pattern for efficient keyboard navigation.

**Why this priority**: Roving tabindex is essential for tabs, menus, toolbars, and listboxes—core components in any design system. Without this, keyboard users must Tab through every option, which is unusable for long lists.

**Independent Test**: Can be tested with a 5-item horizontal toolbar where arrow keys move focus between items and Tab exits the toolbar entirely.

**Acceptance Scenarios**:

1. **Given** a horizontal widget (tabs, toolbar) with focus on the first item, **When** the user presses Right Arrow, **Then** focus moves to the next item
2. **Given** a horizontal widget with focus on the last item, **When** the user presses Right Arrow with wrap enabled, **Then** focus moves to the first item
3. **Given** a vertical widget (listbox, menu) with focus on an item, **When** the user presses Down Arrow, **Then** focus moves to the next item
4. **Given** a widget with focus on any item, **When** the user presses Home, **Then** focus moves to the first item
5. **Given** a widget with focus on any item, **When** the user presses End, **Then** focus moves to the last item
6. **Given** a widget with roving focus active, **When** the user presses Tab, **Then** focus exits the widget to the next focusable element on the page

---

### User Story 3 - Dismissable Layers for Popovers and Menus (Priority: P1)

When a user opens a popover, dropdown menu, or tooltip, they can dismiss it by pressing Escape or clicking outside the content area. This provides standard dismissal patterns expected by all users.

**Why this priority**: Dismissable behavior is required for dropdown menus, comboboxes, popovers, and date pickers. Without consistent dismiss handling, each component implements its own logic, leading to inconsistency and bugs.

**Independent Test**: Can be tested by opening a dropdown, pressing Escape to close it, opening again, and clicking outside to close it.

**Acceptance Scenarios**:

1. **Given** a popover is open, **When** the user presses Escape, **Then** the popover closes and an onDismiss callback fires
2. **Given** a popover is open, **When** the user clicks outside the popover content area, **Then** the popover closes
3. **Given** a popover is open, **When** the user clicks inside the popover content area, **Then** the popover remains open
4. **Given** multiple nested layers are open (e.g., menu inside a modal), **When** the user presses Escape, **Then** only the topmost layer dismisses
5. **Given** a dismissable layer has a designated exclude element (the trigger), **When** the user clicks the trigger, **Then** the layer is not dismissed (toggle behavior controlled elsewhere)

---

### User Story 4 - Keyboard Helpers for Interactive Elements (Priority: P2)

Component developers need reusable keyboard event handlers for common patterns: Enter/Space activation, arrow key direction normalization, and type-ahead search in lists.

**Why this priority**: Keyboard helpers reduce code duplication across components and ensure consistent behavior. They support P1 utilities but are also valuable standalone for custom components.

**Independent Test**: Can be tested by attaching keyboard handler to a custom element and verifying correct key detection and action execution.

**Acceptance Scenarios**:

1. **Given** an element with an activation handler attached, **When** the user presses Enter or Space, **Then** the activation callback fires
2. **Given** an element with arrow key handler attached, **When** the user presses any arrow key, **Then** the handler receives normalized direction (up, down, left, right)
3. **Given** a list with type-ahead enabled, **When** the user types "abc" within 500ms, **Then** focus moves to the first item starting with "abc"
4. **Given** a list with type-ahead enabled, **When** the user types "a", waits 600ms, then types "b", **Then** focus moves to the first item starting with "b" (buffer cleared after timeout)

---

### User Story 5 - Test Harness Pages for Documentation and E2E (Priority: P2)

Developers and QA need interactive test pages that demonstrate each utility in isolation, suitable for both documentation examples and end-to-end test automation.

**Why this priority**: Test harnesses validate that utilities work correctly in real browser environments and serve as live documentation. They enable E2E tests to run against actual behavior.

**Independent Test**: Can be tested by loading the test harness page for focus-trap and verifying Tab key behavior matches expected focus trapping.

**Acceptance Scenarios**:

1. **Given** a test harness page for focus-trap exists, **When** the page loads, **Then** it displays an interactive demo with activation/deactivation controls
2. **Given** a test harness page has E2E data attributes, **When** an E2E test queries `[data-testid="focus-trap-demo"]`, **Then** the element is found
3. **Given** a utility test harness page is part of docs, **When** a user views the documentation, **Then** they see a live working example
4. **Given** all behavior utilities have harness pages, **When** running the full E2E suite, **Then** each utility's core scenarios are covered

---

### User Story 6 - Usage Documentation for Component Authors (Priority: P3)

Component authors need clear documentation explaining how to integrate behavior utilities into their components, including TypeScript types, configuration options, and integration patterns.

**Why this priority**: Documentation ensures consistent usage across components and reduces learning curve. Without it, developers may misuse utilities or reimplement behavior incorrectly.

**Independent Test**: Can be tested by having a developer follow documentation to add focus-trap to a custom modal component and verifying it works correctly.

**Acceptance Scenarios**:

1. **Given** documentation for focus-trap exists, **When** a developer reads it, **Then** they understand the API signature, options, and lifecycle methods
2. **Given** documentation includes code examples, **When** a developer copies the example, **Then** it works without modification in a standard setup
3. **Given** documentation covers TypeScript types, **When** a developer imports the utility, **Then** they receive full autocomplete and type checking
4. **Given** documentation explains Light DOM considerations, **When** a developer uses utilities in @ds/wc components, **Then** they understand how to maintain Light DOM compatibility

---

### Edge Cases

- What happens when focus-trap is activated on a container with no focusable elements? (Utility should handle gracefully, focus stays on container or logs warning)
- What happens when roving focus items change dynamically (added/removed)? (Utility should update focusable item list on next interaction)
- What happens when multiple dismissable layers try to handle the same Escape key? (Only topmost layer handles it via layer stack management)
- What happens when type-ahead search finds no matches? (Focus remains on current item, no error)
- What happens when a test harness page is accessed directly (not through docs)? (Page should work standalone)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a focus trap utility that constrains Tab/Shift+Tab navigation within a container element
- **FR-002**: System MUST provide a roving focus utility implementing WAI-ARIA roving tabindex pattern for arrow key navigation
- **FR-003**: System MUST provide a dismissable layer utility that handles Escape key and outside click dismissal
- **FR-004**: System MUST provide keyboard helper utilities for activation keys (Enter/Space) and arrow key normalization
- **FR-005**: System MUST provide a type-ahead search utility for keyboard-driven list navigation
- **FR-006**: All utilities MUST have zero runtime dependencies beyond native browser APIs
- **FR-007**: All utilities MUST work with Light DOM components (no Shadow DOM assumptions in selectors)
- **FR-008**: All utilities MUST be importable as ES modules from `@ds/primitives-dom`
- **FR-009**: All utilities MUST provide TypeScript type definitions with full JSDoc documentation
- **FR-010**: All utilities MUST provide cleanup/deactivation methods to prevent memory leaks
- **FR-011**: System MUST provide test harness pages for each utility in the demo app
- **FR-012**: Test harness pages MUST include `data-testid` attributes for E2E test targeting
- **FR-013**: System MUST provide usage documentation in MDX format for the docs site
- **FR-014**: Dismissable layer MUST support layer stacking so nested layers dismiss correctly (topmost first)
- **FR-015**: Roving focus MUST support both horizontal (left/right) and vertical (up/down) navigation modes

### Key Entities

- **FocusTrap**: Configuration object with container, initialFocus, returnFocus options; returns activate/deactivate methods
- **RovingFocus**: Configuration object with container, items selector, orientation, wrap options; returns activate/deactivate methods and current index
- **DismissableLayer**: Configuration object with container, excludeElements, onDismiss callback; returns activate/deactivate methods
- **KeyboardHandler**: Factory function returning event handler for specific key patterns (activation, arrows, type-ahead)
- **TestHarness**: HTML page with interactive controls, status indicators, and data-testid attributes for E2E

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Performance**: Minimal runtime overhead, no unnecessary DOM queries, efficient event delegation
- **Accessibility**: WCAG 2.1 AA compliance, follows WAI-ARIA APG patterns, tested with axe-core
- **Customizability**: Configurable options for different component needs, callback hooks for state sync
- **Light DOM Compatibility**: Works with @ds/wc Light DOM architecture, no Shadow DOM assumptions
- **API Ergonomics**: Simple factory pattern, clear lifecycle, TypeScript-first

### Approach A: Factory Functions with Lifecycle Objects

Each utility is a factory function that accepts a configuration object and returns an object with `activate()` and `deactivate()` methods. This matches the existing pattern in `@ds/primitives-dom` for focus-trap, roving-focus, and live-region.

**Pros**:
- Consistent with existing @ds/primitives-dom patterns (focus-trap.ts, roving-focus.ts already use this)
- Clear lifecycle management—developer explicitly controls when behavior starts/stops
- Easy to integrate into component lifecycle hooks (connectedCallback/disconnectedCallback)
- No global state pollution, each instance is independent
- Simple testing—create, activate, assert, deactivate

**Cons**:
- Slightly more verbose than decorator patterns
- Developer must remember to call deactivate() to prevent leaks

### Approach B: Decorator/Mixin Pattern

Create class decorators or mixins that extend LitElement to add behavior automatically when components connect/disconnect.

**Pros**:
- Less boilerplate in component code
- Automatic lifecycle integration

**Cons**:
- Ties utilities to Lit framework, reduces portability
- Harder to compose multiple behaviors
- Less explicit, magic behavior harder to debug
- Doesn't match existing @ds/primitives-dom patterns
- Limits use in non-Lit contexts (vanilla JS, React wrappers)

### Approach C: Global Event Registry

Central registry that components register with, using custom events for communication between behaviors.

**Pros**:
- Single source of truth for layer stacking
- Components communicate indirectly

**Cons**:
- Global state introduces complexity and potential for bugs
- Harder to test in isolation
- Performance overhead from event dispatch
- Doesn't match existing patterns

### Recommendation

**Recommended: Approach A (Factory Functions with Lifecycle Objects)**

This approach:
1. Scores highest on API ergonomics and customizability—developers have explicit control
2. Aligns with existing @ds/primitives-dom patterns (focus-trap.ts, roving-focus.ts use this exact pattern)
3. Maintains Light DOM compatibility—no framework assumptions in the utilities themselves
4. Supports Performance requirements—no runtime framework overhead, just native event listeners
5. Enables Accessibility testing—utilities can be tested independently with jest-axe

The minor verbosity trade-off (explicit activate/deactivate calls) is acceptable because it provides clarity and prevents the hidden lifecycle issues common with decorator patterns.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All behavior utilities pass axe-core accessibility tests with zero violations
- **SC-002**: Developers can add focus trapping to a modal in under 5 lines of code
- **SC-003**: Each utility's bundle contribution is under 2KB minified+gzipped
- **SC-004**: All test harness pages pass E2E tests for their documented scenarios
- **SC-005**: 100% of utility methods have TypeScript type definitions and JSDoc comments
- **SC-006**: Documentation enables a new developer to integrate any utility within 10 minutes of reading
- **SC-007**: Zero memory leaks when utilities are activated and deactivated repeatedly (verified via test)
- **SC-008**: Utilities work correctly in all supported browsers (Chrome, Firefox, Safari, Edge latest 2 versions)

## Assumptions

- Utilities will be used in Light DOM Web Components, not Shadow DOM (per existing @ds/wc architecture)
- Consumers will call deactivate() when components disconnect (standard Lit lifecycle pattern)
- Test harness pages will be served via the existing demo app at `apps/demo`
- Documentation will follow existing MDX patterns in `packages/docs-content`
- Browser support matches design system targets (modern browsers, no IE11)
- Existing focus-trap.ts and roving-focus.ts in @ds/primitives-dom serve as reference implementations
