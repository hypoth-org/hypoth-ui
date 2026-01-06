# Feature Specification: Shared Accessible Component API

**Feature Branch**: `014-shared-a11y-api`
**Created**: 2026-01-05
**Status**: Draft
**Input**: User description: "Create a shared accessible component API layer that drives both React and Web Component implementations"

## Clarifications

### Session 2026-01-05

- Q: What is the bundle size target for behavior primitives? → A: ≤3KB gzipped per component behavior module (fine-grained imports)
- Q: Should behavior primitives be a new package or expand primitives-dom? → A: Expand `@ds/primitives-dom` (no external consumers, simpler architecture)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - React Developer Uses Native Components (Priority: P1)

A React developer using the design system wants to implement a Dialog in their Next.js application. They want to use standard React patterns like compound components, refs, context, and the `asChild` polymorphism pattern without dealing with Web Component wrappers.

**Why this priority**: React is the primary consumer framework. Native React components eliminate the friction of WC wrappers, enable proper React tooling (DevTools, testing libraries), and follow React idioms that developers expect.

**Independent Test**: Can be fully tested by importing `Dialog` from `@ds/react`, composing it using `Dialog.Root`, `Dialog.Trigger`, `Dialog.Content` pattern, and verifying it renders as native React elements without any `ds-*` custom elements in the DOM.

**Acceptance Scenarios**:

1. **Given** a React application with `@ds/react` installed, **When** the developer imports `Dialog` and renders `<Dialog.Root><Dialog.Trigger asChild><button>Open</button></Dialog.Trigger><Dialog.Content>...</Dialog.Content></Dialog.Root>`, **Then** the rendered output uses native HTML elements with appropriate ARIA attributes.

2. **Given** an open Dialog rendered with React, **When** the developer inspects the component tree in React DevTools, **Then** they see native React components (not custom element wrappers) with proper displayNames.

3. **Given** a Dialog component with a ref attached to `Dialog.Content`, **When** the developer accesses `ref.current`, **Then** they receive a standard `HTMLElement` reference that works with React's ref patterns.

---

### User Story 2 - Accessibility Test Parity (Priority: P1)

A QA engineer needs to verify that both React and Web Component implementations of the same component pass identical accessibility tests. The same WCAG compliance should apply regardless of which framework consumes the design system.

**Why this priority**: Accessibility is foundational. If the shared behavior layer works correctly, both implementations should produce identical accessible output. This validates the entire architecture.

**Independent Test**: Run the same axe-core test suite against both `@ds/react Dialog` and `@ds/wc ds-dialog` and compare ARIA attributes, keyboard interactions, and focus behavior.

**Acceptance Scenarios**:

1. **Given** a Dialog component in both React and WC implementations, **When** the axe-core accessibility audit runs, **Then** both pass with zero violations.

2. **Given** an open Dialog in both implementations, **When** the user presses Escape, **Then** both dialogs close and return focus to the trigger element.

3. **Given** an open Dialog in both implementations, **When** the user presses Tab repeatedly, **Then** focus stays trapped within the dialog content in both cases identically.

---

### User Story 3 - Non-React Framework Usage (Priority: P2)

A Vue.js developer using the design system wants to use the Menu component in their application. Web Components remain the interface for non-React frameworks, ensuring broad framework compatibility.

**Why this priority**: Web Components provide framework-agnostic usage. While React is primary, maintaining WC support ensures the design system serves all consumers.

**Independent Test**: Import `@ds/wc` in a Vue 3 application, render `<ds-menu>` with trigger and items, verify roving focus and type-ahead work correctly.

**Acceptance Scenarios**:

1. **Given** a Vue 3 application with `@ds/wc` installed, **When** the developer renders `<ds-menu><button slot="trigger">Actions</button><ds-menu-content>...</ds-menu-content></ds-menu>`, **Then** the menu opens, navigates with arrow keys, and supports type-ahead search.

2. **Given** a Menu component in Web Component form, **When** updated to use the new behavior primitives, **Then** all existing tests continue to pass.

---

### User Story 4 - Compound Component API (Priority: P2)

A React developer building a complex form with multiple dialogs wants to use the compound component pattern to compose Dialog parts flexibly. They need to render the trigger in one location and content in another using React context.

**Why this priority**: Compound components are a standard React pattern for complex UI. Supporting this pattern makes the design system feel native to React developers.

**Independent Test**: Render `Dialog.Root` with `Dialog.Trigger` and `Dialog.Content` in different branches of the component tree, verify context properly connects them.

**Acceptance Scenarios**:

1. **Given** a Dialog with `Dialog.Root` wrapping separate `Dialog.Trigger` and `Dialog.Content` components, **When** the trigger is clicked, **Then** the content opens because they share context.

2. **Given** nested compound components like `<Dialog.Root><Menu.Root><Menu.Trigger/><Menu.Content/></Menu.Root></Dialog.Root>`, **When** both are used together, **Then** their contexts don't conflict.

---

### User Story 5 - Polymorphic Rendering with asChild (Priority: P3)

A developer wants their existing styled button to serve as a Dialog trigger without wrapping markup. They use the `asChild` prop to merge the trigger behavior onto their custom component.

**Why this priority**: The `asChild` pattern (popularized by Radix UI) eliminates wrapper div issues and enables seamless integration with custom components.

**Independent Test**: Render `<Dialog.Trigger asChild><MyStyledButton /></Dialog.Trigger>` and verify `MyStyledButton` receives the trigger props and handlers.

**Acceptance Scenarios**:

1. **Given** a `Dialog.Trigger` with `asChild` prop and a custom `StyledButton` child, **When** rendered, **Then** no wrapper element is added and `StyledButton` receives `aria-haspopup`, `aria-expanded`, and click handler.

2. **Given** a `Menu.Trigger` with `asChild` and a Link component child, **When** the link is clicked, **Then** the menu opens (behavior merged with link).

---

### Edge Cases

- What happens when a Dialog is opened while another Dialog is already open (nested dialogs)?
  - Focus trap and dismiss layer stack; closing inner returns focus to outer.
- How does keyboard navigation work when Menu items are dynamically added/removed?
  - Roving focus recalculates item list on each navigation.
- What happens if `asChild` is used with a component that doesn't forward refs?
  - Behavior gracefully degrades with console warning in development.
- How are multiple trigger elements handled for the same Dialog?
  - Last activated trigger receives return focus.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expand `@ds/primitives-dom` to include headless behavior primitives (state machines, ARIA computation, keyboard handlers) for Button, Dialog, and Menu components.
- **FR-002**: Behavior primitives MUST compute ARIA attributes automatically based on component state.
- **FR-003**: Behavior primitives MUST provide keyboard interaction handlers following WAI-ARIA patterns.
- **FR-004**: Behavior primitives MUST integrate with existing focus management utilities (focus-trap, roving-focus).
- **FR-005**: `@ds/react` MUST provide native React components (not WC wrappers) for Button, Dialog, and Menu.
- **FR-006**: React components MUST support compound component patterns (Root, Trigger, Content, etc.).
- **FR-007**: React components MUST support the `asChild` polymorphism pattern for triggers.
- **FR-008**: React components MUST work with React context, refs, and Suspense.
- **FR-009**: `@ds/wc` MUST be updated to consume the same behavior primitives as `@ds/react`.
- **FR-010**: Both React and WC implementations MUST pass identical accessibility test suites.
- **FR-011**: Both implementations MUST emit equivalent events (React: callbacks, WC: CustomEvents).
- **FR-012**: Both implementations MUST use the same token-based styling via `@ds/tokens` and `@ds/css`.
- **FR-013**: Initial implementation MUST cover Button, Dialog, and Menu as proof-of-concept.
- **FR-014**: System MUST NOT remove or break existing Web Component functionality.

### Key Entities

- **Behavior Primitive**: Framework-agnostic state machine + accessibility logic for a component type. Includes state, actions, ARIA attribute computation, keyboard handlers, and focus management configuration.
- **React Component**: Native React component consuming behavior primitives, following compound component and asChild patterns.
- **Web Component**: Lit-based custom element consuming behavior primitives, using Light DOM rendering.
- **Compound Component**: Pattern where a parent component (Root) provides context to child components (Trigger, Content, etc.) that can be placed anywhere in the subtree.

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Code Sharing**: How much behavior logic is truly shared vs duplicated between React and WC.
- **Developer Experience**: How natural the API feels for React developers (compound components, hooks, refs).
- **Bundle Size**: Impact on final bundle size for consumers using only one framework.
- **Accessibility Consistency**: Confidence that both implementations produce identical accessible output.
- **Migration Path**: Effort required to update existing components and consumer code.

### Approach A: Behavior Hooks + Adapters

Create behavior primitives as pure functions/hooks that return state and handlers. React consumes them directly via hooks. WC adapts them via a thin Lit integration layer.

**Pros**:
- Maximum code sharing - behavior logic written once
- Natural React hook patterns (`useDialogBehavior`, `useMenuBehavior`)
- Framework-agnostic core enables future framework support
- Clear separation of concerns (behavior vs rendering)

**Cons**:
- Requires careful state synchronization for WC (reactive properties vs hook state)
- Two rendering implementations still needed (React JSX vs Lit templates)
- Initial complexity higher than current approach

### Approach B: Headless Component Library Integration

Adopt an existing headless UI library (e.g., Radix Primitives, Headless UI) for React and map WC to match its patterns.

**Pros**:
- Battle-tested accessibility patterns
- Large community and documentation
- Reduced maintenance burden for complex interactions

**Cons**:
- Adds external dependency contradicting zero-dependency constitution principle
- WC implementation would diverge from React (different source of truth)
- Less control over bundle size and behavior customization
- Would need to wrap/adapt external library rather than own the primitives

### Approach C: Web Components as Source of Truth

Keep WC as the primary implementation. Improve React wrappers to feel more native through better property passing and event handling.

**Pros**:
- Minimal changes to current architecture
- Single source of truth for behavior
- Lower implementation effort

**Cons**:
- React experience remains compromised (no true compound components)
- Cannot support `asChild` pattern with WC wrappers
- React DevTools shows custom elements, not React components
- Testing React components requires WC registration

### Recommendation

**Recommended: Approach A (Behavior Hooks + Adapters)**

This approach scores highest on:
1. **Code Sharing**: Behavior written once, consumed by both frameworks (constitution principle: DRY)
2. **Developer Experience**: Native React patterns without compromise
3. **Accessibility Consistency**: Single behavior source guarantees parity
4. **Performance**: Constitution priority #1 - enables tree-shaking, no WC overhead in React

Trade-offs acknowledged:
- Higher initial implementation effort (acceptable for long-term maintainability)
- Requires adapting existing WC components (migration can be incremental)
- Two render implementations still needed (unavoidable given Light DOM WC vs React JSX)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Button, Dialog, and Menu work natively in React without any `ds-*` custom elements in rendered output.
- **SC-002**: Same three components work as Web Components with unchanged public API.
- **SC-003**: Both React and WC implementations pass 100% of accessibility tests (axe-core + manual keyboard tests).
- **SC-004**: React components support `Dialog.Root`, `Dialog.Trigger`, `Dialog.Content` compound component API.
- **SC-005**: React trigger components support `asChild` prop with ref forwarding.
- **SC-006**: No increase in bundle size for WC-only consumers (behavior primitives tree-shake when unused).
- **SC-009**: Each behavior primitive module (Button, Dialog, Menu) is ≤3KB gzipped, enabling fine-grained imports.
- **SC-007**: Existing `@ds/wc` tests continue to pass after refactoring to use behavior primitives.
- **SC-008**: Documentation demonstrates identical usage patterns for accessibility (ARIA, keyboard) across both frameworks.

## Assumptions

- The existing `@ds/primitives-dom` package provides a foundation that can be extended or a sibling package can be created.
- React 18+ is the minimum supported React version (for concurrent features compatibility).
- The design system constitution's zero-dependency principle applies to runtime dependencies; build-time tooling is acceptable.
- Compound component context isolation follows standard React patterns (React.createContext per component family).
- The `asChild` implementation will follow the pattern established by Radix UI (Slot component with ref merging).
- Migration of the 14 remaining components (beyond Button, Dialog, Menu) will follow in subsequent features after this proof-of-concept validates the architecture.

## Out of Scope

- Rewriting all 17 existing components (this feature covers Button, Dialog, Menu only)
- Removing Web Components (they serve non-React users)
- Changing token/CSS architecture
- Server Components support (SSR works, but RSC streaming is deferred)
- Form component integration (Input, Checkbox, etc. - future feature)
