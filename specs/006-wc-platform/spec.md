# Feature Specification: Web Components Platform Conventions

**Feature Branch**: `006-wc-platform`
**Created**: 2026-01-02
**Status**: Draft
**Input**: User description: "Establish the default Web Components platform behavior so all components share: Light DOM rendering, consistent event + attribute conventions, predictable registration in Next.js with a single root loader, Lit base class pattern for Light DOM, naming conventions for tags/attributes/events, @ds/next loader responsibilities and the define once rule, how docs renderer and demo apps ensure elements are defined, create a wc base class/utilities module, implement the @ds/next root loader, add docs page Using components in Next.js App Router, add enforcement check to avoid accidental side-effect auto-definitions"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Component Author Creates a New Component (Priority: P1)

A design system developer needs to create a new web component that follows the established patterns. They extend the provided base class, follow naming conventions, and the component works correctly in all rendering contexts (SSR, CSR) without any boilerplate for element registration.

**Why this priority**: This is the foundational use case - all components must be buildable using the platform conventions. Without this, no other user stories can be fulfilled.

**Independent Test**: Create a sample button component using the base class and verify it renders correctly in Light DOM, responds to attributes, and fires events following the naming conventions.

**Acceptance Scenarios**:

1. **Given** a developer extends the provided Lit base class, **When** they define a component with standard Lit patterns, **Then** the component renders its content in the Light DOM (not Shadow DOM)
2. **Given** a developer creates a component, **When** they add reactive properties, **Then** the component reflects changes to attributes following the established naming pattern
3. **Given** a developer creates a component, **When** they emit custom events, **Then** the events follow the established naming convention and bubble appropriately

---

### User Story 2 - Application Developer Uses Components in Next.js (Priority: P1)

An application developer using Next.js App Router wants to use design system components. They import a single loader at the app root, and all components work correctly with Server-Side Rendering and client-side hydration.

**Why this priority**: Next.js is the primary framework target, and proper SSR/hydration is critical for production applications.

**Independent Test**: Create a Next.js App Router application, add the root loader component, and verify components render correctly on server and hydrate properly on client without console errors or flicker.

**Acceptance Scenarios**:

1. **Given** a Next.js App Router application, **When** the developer adds the root loader component to the layout, **Then** all design system components are registered before first render
2. **Given** a component is used in a Server Component, **When** the page is rendered, **Then** the component HTML is included in the initial server response
3. **Given** a component is used in a Client Component, **When** the page hydrates, **Then** the component becomes interactive without registration errors

---

### User Story 3 - Documentation Site Displays Components (Priority: P2)

The documentation site needs to render interactive component examples. The MDX renderer or demo application ensures all component elements are defined before attempting to render them.

**Why this priority**: Documentation is essential for adoption, but secondary to the core platform conventions.

**Independent Test**: Load a documentation page with component examples and verify all components render correctly and are interactive.

**Acceptance Scenarios**:

1. **Given** a documentation page with component examples, **When** the page loads, **Then** all referenced components are defined and render correctly
2. **Given** the demo application, **When** a component is dynamically loaded, **Then** it is properly registered before rendering
3. **Given** multiple pages reference the same component, **When** navigating between pages, **Then** components are only registered once (no duplicate registration errors)

---

### User Story 4 - CI Pipeline Prevents Accidental Auto-Registration (Priority: P2)

The development team wants to prevent components from self-registering on import. A build-time or CI check enforces that component files do not contain `customElements.define()` calls as side effects.

**Why this priority**: Prevents subtle bugs in SSR environments and ensures predictable component loading, but is a safeguard rather than core functionality.

**Independent Test**: Run the enforcement check against a codebase with both compliant and non-compliant component files and verify it correctly identifies violations.

**Acceptance Scenarios**:

1. **Given** a component file without side-effect registration, **When** the enforcement check runs, **Then** the file passes validation
2. **Given** a component file with side-effect `customElements.define()` call, **When** the enforcement check runs, **Then** the file fails validation with a clear error message
3. **Given** the CI pipeline, **When** code with accidental auto-registration is pushed, **Then** the build fails and the developer is notified

---

### Edge Cases

- What happens when a component is used before the loader runs? (The component renders as undefined custom element until registered)
- How does the system handle duplicate component definitions? (The registry checks before defining; logs warning if already defined)
- What happens when a component is dynamically imported in a Server Component? (Covered by the loader initializing all components upfront)
- How does the system handle component inheritance with the base class? (Standard class inheritance works; child inherits Light DOM behavior)
- What happens when custom elements are used in streaming SSR contexts? (Components are pre-registered before streaming begins)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Lit-based base class that renders components in Light DOM by default
- **FR-002**: System MUST define tag naming convention as `ds-{component-name}` (e.g., `ds-button`, `ds-card`)
- **FR-003**: System MUST define attribute naming convention as lowercase with hyphens for multi-word attributes (e.g., `is-disabled`, `aria-label`)
- **FR-004**: System MUST define event naming convention as `ds:{event-name}` for custom events (e.g., `ds:click`, `ds:change`) with `bubbles: true` and `composed: true` by default
- **FR-005**: System MUST provide an `@ds/next` package with a root loader component for Next.js App Router
- **FR-006**: System MUST ensure each custom element is registered only once across the application lifecycle
- **FR-007**: System MUST provide utilities for component authors to export component classes without self-registration
- **FR-008**: System MUST support SSR in Next.js with proper hydration of custom elements
- **FR-009**: System MUST provide documentation page explaining Next.js App Router integration
- **FR-010**: System MUST provide a standalone script that flags accidental `customElements.define()` calls as side effects in component files, runnable in CI and as a pre-commit hook
- **FR-011**: System MUST ensure the documentation renderer and demo apps have a mechanism to register all required components before rendering
- **FR-012**: System MUST support reactive properties that sync with element attributes following Lit conventions

### Key Entities

- **DSElement Base Class**: The foundational Lit class that all design system components extend, configured for Light DOM rendering
- **Component Registry**: A static TypeScript/JavaScript object export mapping tag names to class constructors (e.g., `{ 'ds-button': DSButton, ... }`)
- **Root Loader**: The Next.js-specific component that handles element registration at application startup
- **Enforcement Check**: A standalone Node.js/TypeScript script using AST parsing that validates component files don't self-register, integrated into CI and pre-commit hooks

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **SSR Compatibility**: Components must work with Next.js Server Components and streaming SSR without hydration mismatches
- **Bundle Size**: The platform overhead should be minimal (<5KB gzipped for base class and utilities)
- **Developer Experience**: Clear patterns, minimal boilerplate, good error messages
- **Accessibility**: Light DOM ensures standard accessibility tree traversal and styling

### Approach A: Centralized Registry with Lazy Registration

All component classes are exported as pure classes. A central registry file maps tag names to classes. The root loader reads this registry and calls `customElements.define()` for each component when mounted.

**Pros**:
- Single source of truth for all component registrations
- Easy to tree-shake unused components
- Works well with code-splitting
- Clear separation between component definition and registration

**Cons**:
- Requires maintaining a registry file
- Components cannot be used in isolation without explicit registration
- Additional setup step for new components

### Approach B: Self-Registering Components with Guard

Components call `customElements.define()` themselves but with a guard that checks if already defined. The root loader becomes optional, only ensuring early registration.

**Pros**:
- Components work immediately upon import
- No registry to maintain
- Simpler for simple use cases

**Cons**:
- Risk of registration order issues in SSR
- Harder to tree-shake effectively
- Side effects on import make testing harder
- Violates the stated requirement to avoid side-effect auto-definitions

### Approach C: Decorator-Based Registration

Use a TypeScript decorator that marks components for registration. A build step or runtime scanner collects decorated classes and registers them.

**Pros**:
- Declarative syntax close to component definition
- Can be collected at build time
- Works with existing Lit patterns

**Cons**:
- Requires decorator support (TypeScript experimental or Stage 3)
- Build-time processing adds complexity
- Magic behavior may confuse developers

### Recommendation

**Recommended: Approach A - Centralized Registry with Lazy Registration**

Justification:
1. **SSR Compatibility**: Clean separation means no side effects on import, preventing hydration issues in Next.js Server Components
2. **Bundle Size**: Tree-shaking works optimally when components don't self-register
3. **Developer Experience**: Explicit registration makes the system predictable and debuggable
4. **Aligns with Constitution Principles**: Performance-first (tree-shaking), Accessibility (Light DOM), and the explicit requirement to avoid auto-definitions

The trade-off of maintaining a registry is acceptable because it can be automated via tooling and provides clear documentation of available components.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All design system components render in Light DOM, verified by inspecting the DOM structure (no `#shadow-root` present)
- **SC-002**: Components work correctly in Next.js App Router with no hydration errors, verified by console output and visual comparison
- **SC-003**: The root loader adds less than 2KB gzipped to the bundle (excluding component code)
- **SC-004**: The enforcement check correctly identifies 100% of component files with side-effect registrations in test suite
- **SC-005**: Component authors can create a new component following conventions in under 5 minutes, verified by documentation walkthrough
- **SC-006**: Zero duplicate registration warnings appear when navigating between pages in a Next.js application
- **SC-007**: Documentation site loads with all component examples functional and no console errors

## Assumptions

- The design system uses Lit 3.x as the base for web components
- Next.js App Router (v14+) is the primary framework target
- Components will be published as ES modules
- The existing `@ds/wc` package contains component implementations
- Light DOM is the established pattern for better CSS integration and accessibility
- Custom events should bubble and be composed by default to enable event delegation patterns and cross-shadow-boundary propagation

## Clarifications

### Session 2026-01-02

- Q: Should custom events (`ds:{event-name}`) be composed by default? → A: Yes - composed: true (events cross shadow boundaries)
- Q: What format should the component registry use? → A: Static JS/TS object export mapping tag names to class constructors
- Q: What type of enforcement check should be implemented? → A: Standalone script (AST-based, runs in CI and pre-commit hooks)
