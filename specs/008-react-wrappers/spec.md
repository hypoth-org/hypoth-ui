# Feature Specification: React Wrappers for Web Components

**Feature Branch**: `008-react-wrappers`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User description: "Provide React wrappers that improve ergonomics without adding runtime overhead: typed props mapping to WC attributes/events, minimal client boundary guidance, targeted asChild primitives (Box/Text/Link) only"

## Clarifications

### Session 2026-01-03

- Q: What is Box component's relationship to Web Components? → A: Box is React-only, applies CSS classes for spacing/layout props (no WC dependency)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Type-Safe Component Usage (Priority: P1)

A React developer uses design system components with full TypeScript support. They import Button, Link, Text, and other components with properly typed props that match the underlying Web Component attributes. IDE autocomplete suggests valid prop values (e.g., variant options), and TypeScript catches prop type errors at compile time.

**Why this priority**: Type safety is the primary value proposition of React wrappers. Without it, developers would use raw Web Components directly.

**Independent Test**: Import any wrapped component, verify that TypeScript enforces prop types, event handlers have correct signatures, and refs resolve to the correct element type.

**Acceptance Scenarios**:

1. **Given** a developer imports `Button` from `@ds/react`, **When** they pass an invalid `variant` value, **Then** TypeScript shows a compile-time error with valid options
2. **Given** a developer uses `onClick` on a wrapped component, **When** the event fires, **Then** the event object has the correct type (including custom event details for `onNavigate`)
3. **Given** a developer passes a `ref` to a wrapped component, **When** the component mounts, **Then** the ref resolves to the underlying DOM element with correct type

---

### User Story 2 - asChild Polymorphism for Box/Text/Link (Priority: P1)

A developer needs to render a Text component as a heading or a Link component as a Next.js router link. They use the `asChild` prop to pass a single child element that receives all styling props while maintaining the child's semantic behavior and routing capabilities.

**Why this priority**: asChild enables composition patterns essential for Next.js integration and semantic HTML without wrapper element bloat.

**Independent Test**: Render a Link with `asChild` wrapping a Next.js `Link`, verify the child receives styling classes while preserving router behavior.

**Acceptance Scenarios**:

1. **Given** a `Text` component with `asChild` wrapping an `<h1>`, **When** rendered, **Then** the output is a styled `<h1>` (not nested elements) with correct typography classes
2. **Given** a `Link` component with `asChild` wrapping Next.js `Link`, **When** clicked, **Then** client-side navigation works and the link has design system styling
3. **Given** a `Box` component with `asChild` wrapping a `<section>`, **When** rendered, **Then** spacing/layout props are applied to the section element

---

### User Story 3 - Event Handling with Custom Events (Priority: P1)

A developer handles both native DOM events and custom design system events (like `ds:navigate` for Link, `ds:click` for Button). Event handlers receive properly typed event objects with access to custom detail data.

**Why this priority**: Events are core to interactive components. Proper typing and forwarding is essential for React patterns.

**Independent Test**: Add `onNavigate` handler to Link, click the link, verify the handler receives typed event with `href` and `external` details.

**Acceptance Scenarios**:

1. **Given** a `Link` with `onNavigate` handler, **When** clicked, **Then** handler receives event with `{ href, external, originalEvent }` detail
2. **Given** a `Button` with `onClick` handler in loading state, **When** clicked, **Then** the click is prevented and handler is not called
3. **Given** any wrapped component, **When** using standard React event props (`onFocus`, `onBlur`, etc.), **Then** events work as expected

---

### User Story 4 - Next.js App Router Compatibility (Priority: P2)

A developer uses the design system in a Next.js App Router project. Components work seamlessly with server components where possible, and client boundaries are minimal and clearly documented. The `"use client"` directive is only added where necessary.

**Why this priority**: Next.js is the primary framework target. Improper client boundaries cause hydration errors and bundle bloat.

**Independent Test**: Import and render components in both server and client components, verify no hydration mismatches and minimal client JS.

**Acceptance Scenarios**:

1. **Given** a Next.js server component, **When** importing re-exported types and utilities, **Then** no `"use client"` error occurs
2. **Given** a component that requires client interactivity, **When** rendered in server component, **Then** clear error message indicates `"use client"` is needed
3. **Given** `asChild` with Next.js Link, **When** rendered, **Then** prefetching and client navigation work correctly

---

### User Story 5 - Simple Re-exports vs Real Components (Priority: P2)

A developer understands which exports are simple type re-exports (zero runtime) versus actual React components (minimal runtime). Documentation clearly indicates the nature of each export for bundle optimization decisions.

**Why this priority**: Understanding the runtime cost helps developers make informed decisions about imports.

**Independent Test**: Tree-shake the package, verify that unused components are eliminated and type-only exports add zero bytes.

**Acceptance Scenarios**:

1. **Given** only `ButtonProps` type is imported, **When** bundle is built, **Then** no component code is included
2. **Given** `Button` component is imported, **When** bundle is analyzed, **Then** runtime overhead is documented and minimal (<1KB per component)
3. **Given** documentation, **When** reading export docs, **Then** each export clearly states: "type-only", "re-export", or "wrapper component"

---

### User Story 6 - Ref Forwarding (Priority: P2)

A developer needs to access the underlying DOM element for imperative operations (focus management, measurements, animations). Refs work correctly with the wrapper components and resolve to the actual DOM element.

**Why this priority**: Refs are essential for focus management, accessibility, and integration with other libraries.

**Independent Test**: Create ref, pass to Button, verify `ref.current` is the `<ds-button>` element with correct methods.

**Acceptance Scenarios**:

1. **Given** a `useRef<HTMLElement>()` passed to `Button`, **When** component mounts, **Then** ref.current is the ds-button element
2. **Given** a callback ref passed to component, **When** component mounts/unmounts, **Then** callback is called with element/null
3. **Given** `forwardRef` pattern in wrapper, **When** used with React.forwardRef HOC, **Then** refs compose correctly

---

### Edge Cases

- What happens when asChild receives multiple children? (Error with helpful message)
- How does asChild handle fragments? (Error - must be single element child)
- What happens when event handler throws? (Error propagates normally, no silent failures)
- How do boolean attributes work? (`disabled={false}` should remove attribute, not set "false")

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Package MUST export React wrapper components for: Button, Input, Link, Text, Icon, Spinner, VisuallyHidden
- **FR-002**: Package MUST export Box (React-only), Text, and Link components with `asChild` prop support
- **FR-003**: All wrapper components MUST forward refs to the underlying Web Component element
- **FR-004**: All wrapper components MUST provide TypeScript types for props matching Web Component attributes
- **FR-005**: Event props MUST be typed with correct event detail types (e.g., `onNavigate: (event: CustomEvent<DsNavigateEventDetail>) => void`)
- **FR-006**: Boolean props MUST correctly map to boolean attributes (false = attribute removed, not "false" string)
- **FR-007**: asChild MUST merge wrapper props onto single child element via `cloneElement`
- **FR-008**: asChild MUST throw descriptive error if child is not a single valid React element
- **FR-009**: Components MUST work without hydration errors in Next.js App Router
- **FR-010**: Package MUST provide clear documentation for server vs client component usage
- **FR-011**: Unused components MUST be tree-shakeable (separate entry points or proper sideEffects)
- **FR-012**: Components MUST handle className merging between wrapper props and asChild child props
- **FR-013**: Box component MUST apply spacing/layout CSS classes without depending on any Web Component

### Key Entities

- **WrapperComponent**: A React component that renders a Web Component with typed props and event forwarding
- **asChild Component**: A React component supporting polymorphic rendering via child element cloning
- **Box**: A React-only primitive (no Web Component dependency) that applies layout/spacing CSS classes via asChild pattern
- **EventMapping**: Configuration mapping React event prop names to DOM custom event names

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Bundle Size**: Minimal runtime overhead per component (<1KB minified+gzipped)
- **Type Safety**: Full TypeScript inference for props, events, and refs
- **SSR Compatibility**: Works with Next.js App Router server components where possible
- **Developer Experience**: Intuitive API matching React patterns

### Approach A: Manual Wrapper per Component

Create individual, hand-crafted wrapper components for each Web Component with explicit prop types and event handling.

**Pros**:
- Maximum type safety with explicit interfaces
- Each component can have custom logic (e.g., Button loading state handling)
- Clear, readable code that's easy to debug
- Can optimize each wrapper independently

**Cons**:
- More code to maintain (one file per component)
- Risk of inconsistency between wrappers
- Duplication of ref forwarding and event handling logic

### Approach B: Factory Function (createComponent)

Use a factory function that generates wrapper components from a configuration object describing props, events, and the tag name.

**Pros**:
- DRY - single source of truth for common patterns
- Consistent behavior across all wrappers
- Easy to add new components
- Existing `createComponent` utility can be extended

**Cons**:
- Type inference is more complex (requires careful generic typing)
- Harder to debug generated components
- Less flexibility for component-specific customization

### Approach C: Hybrid (Factory + Manual for Complex Components)

Use factory for simple wrappers (Icon, Spinner, VisuallyHidden), manual wrappers for interactive components (Button, Link, Input), and separate asChild primitives (Box, Text, Link).

**Pros**:
- Best of both approaches - consistency where possible, customization where needed
- asChild components get dedicated attention for the polymorphic pattern
- Balance between DRY and explicit code

**Cons**:
- Two patterns to understand
- Need clear criteria for when to use which approach

### Recommendation

**Recommended: Approach C (Hybrid)**

This approach aligns with the constitution's priorities:
1. **Performance**: Minimal runtime by sharing factory code for simple components
2. **Type Safety**: Complex components get explicit typing for better DX
3. **Flexibility**: asChild primitives need special handling that doesn't fit factory pattern

The trade-off (two patterns) is acceptable because:
- Clear criteria: asChild = manual, no asChild + simple = factory
- The codebase already has `createComponent` utility to build upon
- Interactive components (Button, Link, Input) benefit from explicit handling

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can use all baseline components with zero TypeScript errors when passing valid props
- **SC-002**: Bundle size overhead is less than 1KB per component (minified + gzipped)
- **SC-003**: asChild components render correct HTML structure (single element, no wrappers) in 100% of valid use cases
- **SC-004**: All wrapped components pass existing accessibility tests when rendered via React
- **SC-005**: Documentation covers all export types with server/client guidance, achieving zero hydration errors in Next.js example app
- **SC-006**: Test suite covers prop typing, event handling, ref forwarding, and asChild behavior with >90% coverage
