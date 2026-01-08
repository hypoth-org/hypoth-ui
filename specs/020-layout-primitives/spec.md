# Feature Specification: Layout Primitives & Page Composition

**Feature Branch**: `020-layout-primitives`
**Created**: 2026-01-08
**Status**: Draft
**Input**: User description: "Layout Primitives & Page Composition (with Flow) - Framework-agnostic layout layer with token-driven, Light DOM components for React + Web Components"

## Clarifications

### Session 2026-01-08

- Q: How should components handle invalid token values (raw CSS)? → A: Console warning in development, silently ignore in production
- Q: Should Flow include a built-in divider prop? → A: No, users should compose with a separate Divider component

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Page Layout with Flow (Priority: P1)

A developer building a new page needs to create a responsive layout where content stacks vertically on mobile and flows horizontally on desktop. They want to use consistent spacing from the design system tokens without writing custom CSS.

**Why this priority**: Flow is the primary layout primitive that replaces both Stack and Inline components. It's the foundational building block for all other layout patterns and directly addresses the core problem of responsive layout composition.

**Independent Test**: Can be fully tested by creating a page with Flow components that switch direction at breakpoints, verifying token-based spacing is applied consistently.

**Acceptance Scenarios**:

1. **Given** a Flow component with `direction="column"`, **When** the viewport is at default (mobile) size, **Then** children are arranged vertically with the specified gap token applied between items
2. **Given** a Flow component with `direction={{ base: "column", md: "row" }}`, **When** the viewport reaches the `md` breakpoint, **Then** children switch to horizontal arrangement without component changes
3. **Given** a Flow component with `gap="4"`, **When** rendered, **Then** the gap between children matches the spacing token value for `4`
4. **Given** a Flow component, **When** inspected in the DOM, **Then** children remain in the Light DOM (not Shadow DOM) for styling flexibility

---

### User Story 2 - Container-Constrained Content (Priority: P1)

A developer building a marketing page needs to constrain content width with responsive max-widths and consistent horizontal padding, ensuring content doesn't stretch too wide on large screens.

**Why this priority**: Container is essential for all page layouts as it establishes the content boundary. Nearly every page needs content width constraints.

**Independent Test**: Can be tested by rendering content within Container and verifying max-width constraints and padding at various viewport sizes.

**Acceptance Scenarios**:

1. **Given** a Container component, **When** the viewport is wider than the max-width, **Then** content is centered with the specified max-width applied
2. **Given** a Container component, **When** the viewport is narrower than max-width, **Then** content fills the width with horizontal padding applied
3. **Given** a Container with `size="lg"`, **When** rendered, **Then** the max-width matches the corresponding layout token value

---

### User Story 3 - Grid-Based Dashboard Layout (Priority: P1)

A developer creating a dashboard needs a 2D grid layout with responsive column counts that automatically adjust based on viewport size.

**Why this priority**: Grid completes the core layout trio (Flow + Container + Grid) that covers the majority of layout patterns.

**Independent Test**: Can be tested by creating a dashboard with Grid containing cards, verifying column count changes at breakpoints.

**Acceptance Scenarios**:

1. **Given** a Grid component with `columns={{ base: 1, md: 2, lg: 3 }}`, **When** the viewport is at mobile size, **Then** items display in a single column
2. **Given** a Grid component with `columns={{ base: 1, md: 2, lg: 3 }}`, **When** the viewport reaches `lg` breakpoint, **Then** items display in 3 columns
3. **Given** a Grid with `gap="4"`, **When** rendered, **Then** consistent gap tokens are applied both horizontally and vertically

---

### User Story 4 - Box for Token-Based Styling (Priority: P2)

A developer needs to apply padding, background, and border-radius to a content area using only design tokens, without writing custom CSS or inline styles.

**Why this priority**: Box provides the token-only styling escape hatch for cases where other layout components don't provide needed visual styling.

**Independent Test**: Can be tested by wrapping content in Box with various token props and verifying correct CSS is applied.

**Acceptance Scenarios**:

1. **Given** a Box component with `p="4" bg="surface" radius="md"`, **When** rendered, **Then** padding, background, and border-radius match their respective token values
2. **Given** a Box component, **When** a raw CSS value like `p="13px"` is attempted, **Then** the component rejects it (only token values accepted)
3. **Given** a Box with `as="section"`, **When** rendered, **Then** the underlying HTML element is a semantic `<section>`

---

### User Story 5 - App Shell Structure (Priority: P2)

A developer building an application shell needs predefined regions for Header, Main content, Footer, and optional Sidebar, with proper landmark semantics.

**Why this priority**: AppShell provides structural consistency across applications and ensures proper accessibility landmarks are in place.

**Independent Test**: Can be tested by creating an AppShell with all regions and verifying landmark roles and layout structure.

**Acceptance Scenarios**:

1. **Given** an AppShell with Header, Main, and Footer, **When** rendered, **Then** each region has the correct ARIA landmark role
2. **Given** an AppShell with a Sidebar, **When** rendered on desktop, **Then** Sidebar appears alongside Main content
3. **Given** an AppShell, **When** Main is rendered, **Then** it can be the target for a "Skip to content" link

---

### User Story 6 - Section with Semantic Wrapper (Priority: P2)

A developer creating a content page needs semantic section wrappers with consistent vertical spacing and optional heading slots.

**Why this priority**: Section provides semantic structure with built-in spacing, reducing repetitive token application.

**Independent Test**: Can be tested by creating multiple Sections on a page and verifying semantic markup and consistent spacing.

**Acceptance Scenarios**:

1. **Given** a Section component, **When** rendered, **Then** it outputs a semantic `<section>` element
2. **Given** a Section with `spacing="lg"`, **When** rendered, **Then** vertical padding/margin matches the `lg` spacing variant
3. **Given** a Section with a heading slot populated, **When** rendered, **Then** the heading appears in the designated slot position

---

### User Story 7 - Page Wrapper with Vertical Rhythm (Priority: P2)

A developer needs a Page component that establishes consistent vertical rhythm, minimum height, and background for entire pages.

**Why this priority**: Page provides the outermost wrapper that sets baseline page characteristics.

**Independent Test**: Can be tested by wrapping content in Page and verifying min-height, background, and spacing are applied.

**Acceptance Scenarios**:

1. **Given** a Page component, **When** content is shorter than viewport, **Then** the Page fills at least the full viewport height
2. **Given** a Page with `bg="background"`, **When** rendered, **Then** the background matches the surface token value

---

### User Story 8 - Header and Footer with Sticky Options (Priority: P3)

A developer needs Header and Footer landmark wrappers with optional sticky positioning and safe-area support for notched devices.

**Why this priority**: Header/Footer are commonly needed but secondary to the core layout primitives.

**Independent Test**: Can be tested by creating Header/Footer with sticky option and verifying position behavior and safe-area padding.

**Acceptance Scenarios**:

1. **Given** a Header with `sticky`, **When** the page scrolls, **Then** Header remains fixed at the top
2. **Given** a Footer on a notched device, **When** `safeArea` is enabled, **Then** content respects the safe-area-inset values
3. **Given** a Header component, **When** rendered, **Then** it has the `banner` landmark role

---

### User Story 9 - Center Component for Alignment (Priority: P3)

A developer needs to center content horizontally and/or vertically with optional max-width constraints.

**Why this priority**: Center is a specialized helper that simplifies a common layout pattern.

**Independent Test**: Can be tested by wrapping content in Center and verifying centering behavior.

**Acceptance Scenarios**:

1. **Given** a Center component, **When** rendered, **Then** children are horizontally centered by default
2. **Given** a Center with `vertical`, **When** rendered with sufficient container height, **Then** children are vertically centered
3. **Given** a Center with `maxWidth="md"`, **When** content exceeds that width, **Then** content is constrained and centered

---

### User Story 10 - Split Layout with Collapse (Priority: P3)

A developer building a sidebar layout needs a two-region Split that collapses to a stacked layout at a specified breakpoint.

**Why this priority**: Split handles a common two-panel pattern with responsive collapse.

**Independent Test**: Can be tested by creating a Split layout and verifying the collapse behavior at the specified breakpoint.

**Acceptance Scenarios**:

1. **Given** a Split with `collapseAt="md"`, **When** viewport is above `md`, **Then** two regions appear side-by-side
2. **Given** a Split with `collapseAt="md"`, **When** viewport is below `md`, **Then** regions stack vertically (collapse to Flow)
3. **Given** a Split, **When** collapsed, **Then** reduced motion preferences are respected for any transition

---

### User Story 11 - Wrap Layout for Tags/Chips (Priority: P3)

A developer displaying a list of tags or chips needs a wrapping row layout with consistent gaps.

**Why this priority**: Wrap provides a common pattern for inline-block-like layouts with proper gap handling.

**Independent Test**: Can be tested by rendering multiple tags in Wrap and verifying wrapping and gap behavior.

**Acceptance Scenarios**:

1. **Given** a Wrap component with multiple items, **When** items exceed container width, **Then** items wrap to the next line
2. **Given** a Wrap with `gap="2"`, **When** rendered, **Then** consistent gap token is applied between all items (both rows and within rows)

---

### User Story 12 - Spacer for Explicit Spacing (Priority: P4)

A developer needs to insert explicit spacing between elements in contexts where gap isn't available or sufficient.

**Why this priority**: Spacer is an escape hatch for edge cases; primary approach should be gap tokens.

**Independent Test**: Can be tested by inserting Spacer between elements and verifying the space matches the specified token.

**Acceptance Scenarios**:

1. **Given** a Spacer with `size="4"`, **When** rendered, **Then** it creates space matching the `4` spacing token
2. **Given** a Spacer in a vertical context, **When** rendered, **Then** it expands vertically by default

---

### Edge Cases

- What happens when Flow has no children? (Should render empty container without errors)
- How does Grid handle fewer items than columns? (Items should not stretch; remaining cells are empty)
- What happens when responsive values use invalid breakpoint names? (Should warn in dev, use fallback)
- How does Container behave in a nested Container? (Inner Container should respect outer constraints)
- What happens with conflicting token values? (Later props should override earlier ones)
- How do components behave in SSR environments? (All components must hydrate correctly without flash)

## Requirements *(mandatory)*

### Functional Requirements

**Core Layout Primitives (Phase 1)**

- **FR-001**: Flow component MUST support `direction` prop with values `row`, `column`, `row-reverse`, `column-reverse`
- **FR-002**: Flow component MUST support responsive direction values using breakpoint object syntax in React and breakpoint string syntax in WC
- **FR-003**: Flow component MUST support `gap` prop accepting only spacing token values (not raw CSS)
- **FR-004**: Flow component MUST support `align` prop with values `start`, `center`, `end`, `stretch`, `baseline`
- **FR-005**: Flow component MUST support `justify` prop with values `start`, `center`, `end`, `between`, `around`, `evenly`
- **FR-006**: Flow component MUST support `wrap` prop with values `nowrap`, `wrap`, `wrap-reverse`
- **FR-007**: Flow component MUST support `inline` boolean for inline-flex vs flex display
- **FR-008**: Container component MUST constrain content to configurable max-width tokens
- **FR-009**: Container component MUST apply horizontal padding using spacing tokens
- **FR-010**: Container component MUST center content when viewport exceeds max-width
- **FR-011**: Grid component MUST support responsive column counts using breakpoint syntax
- **FR-012**: Grid component MUST support `gap` prop for consistent row and column gaps
- **FR-013**: Box component MUST accept only token values for `p`, `px`, `py`, `bg`, `radius` props
- **FR-014**: Box component MUST reject raw CSS values (e.g., `p="13px"`) by logging a console warning in development mode and silently ignoring the invalid value in production
- **FR-015**: All layout components MUST render children in Light DOM (not Shadow DOM)

**Semantic Structure (Phase 2)**

- **FR-016**: Section component MUST render as semantic `<section>` element
- **FR-017**: Section component MUST support spacing variants for vertical rhythm
- **FR-018**: Page component MUST establish minimum viewport height
- **FR-019**: Page component MUST support background token for page background
- **FR-020**: AppShell component MUST provide Header, Main, Footer, and Sidebar region slots
- **FR-021**: Header component MUST have `banner` landmark role
- **FR-022**: Footer component MUST have `contentinfo` landmark role
- **FR-023**: Main component MUST be suitable as skip-link target
- **FR-024**: Header and Footer MUST support sticky positioning option
- **FR-025**: Header and Footer MUST support safe-area insets for notched devices

**Responsive Helpers (Phase 3)**

- **FR-026**: Spacer component MUST accept spacing token for size
- **FR-027**: Center component MUST horizontally center children by default
- **FR-028**: Center component MUST support vertical centering option
- **FR-029**: Center component MUST support maxWidth constraint
- **FR-030**: Split component MUST display two regions side-by-side above collapse breakpoint
- **FR-031**: Split component MUST stack regions below collapse breakpoint
- **FR-032**: Split transitions MUST respect reduced motion preferences
- **FR-033**: Wrap component MUST allow items to wrap to multiple lines
- **FR-034**: Wrap component MUST apply consistent gap tokens between items

**Cross-Cutting Requirements**

- **FR-035**: All components MUST support `as` prop for polymorphic element rendering
- **FR-036**: React components MUST support `asChild` pattern for Slot composition
- **FR-037**: All responsive props MUST use consistent encoding (object in React, string parser in WC)
- **FR-038**: All components MUST provide data attributes for animation targeting (e.g., `data-layout="flow"`)
- **FR-039**: All components MUST work correctly with SSR (no hydration mismatches)
- **FR-040**: React aliases Stack (Flow direction="column") and Inline (Flow direction="row") MAY be provided for discoverability

### Key Entities

- **Layout Token**: Spacing, width, and breakpoint values from the design token system that constrain component styling
- **Breakpoint**: Named viewport width thresholds (sm, md, lg, xl) used for responsive value switching
- **Layout Region**: Semantic area within a page structure (Header, Main, Footer, Sidebar) with associated landmark roles

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Performance**: Bundle size impact, runtime CSS generation, SSR compatibility
- **Accessibility**: Semantic HTML preservation, landmark support, focus management neutrality
- **Customizability**: Token integration depth, CSS layer compatibility, Light DOM for external styling

### Approach A: CSS-Only Responsive (Media Query Classes)

Generate CSS classes for each breakpoint and responsive value combination. Components apply classes based on props.

**Pros**:
- Zero runtime JavaScript for responsive behavior
- Excellent SSR support - classes are applied immediately
- Browser handles all responsive logic natively
- Smallest possible JavaScript bundle impact

**Cons**:
- CSS file size grows with number of token/breakpoint combinations
- All possible combinations must be pre-generated
- Less flexible for dynamic responsive values at runtime

### Approach B: CSS Custom Properties with Runtime Fallback

Use CSS custom properties for token values, with a small runtime script to update properties at breakpoints.

**Pros**:
- Smaller CSS footprint (single property per token)
- More flexible for dynamic theming
- Can support runtime breakpoint changes

**Cons**:
- Requires JavaScript for responsive behavior
- Slightly larger bundle for responsive logic
- Potential for flash of unstyled content if JS delayed

### Approach C: Pure Runtime Responsive (JavaScript-Driven)

Calculate styles and apply them via JavaScript based on ResizeObserver or matchMedia.

**Pros**:
- Maximum flexibility for complex responsive logic
- Can support container queries more easily
- Dynamic value calculation possible

**Cons**:
- Larger JavaScript bundle
- Requires JavaScript for any styling
- SSR hydration complexity
- Performance cost of runtime calculations

### Recommendation

**Recommended: Approach A (CSS-Only Responsive)**

Justification:
1. **Performance**: Aligns with constitution's "Performance > Accessibility > Customizability" priority. Zero runtime JS for layout means fastest possible render and smallest bundle. Media queries are the most performant responsive mechanism.
2. **SSR Compatibility**: Layout appears correct immediately without waiting for JS hydration - critical for avoiding layout shift.
3. **Accessibility**: Media query approach preserves all semantic HTML without JavaScript dependencies.
4. **Token-First Design**: Pre-generating classes from tokens enforces the token-only constraint naturally - if it's not a token, there's no class for it.

Trade-off acknowledged: CSS file will be larger than runtime approaches, but this is acceptable because:
- CSS is cacheable and compresses well
- Tree-shaking can remove unused component styles
- Initial paint performance is prioritized over file size

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can build 80% of common layouts (forms, dashboards, marketing pages, app shells) using only Container, Flow, and Grid without custom CSS
- **SC-002**: Flow component enables responsive direction switching without changing components or writing media queries manually
- **SC-003**: React and Web Component APIs have 100% feature parity (same props/attributes, same behavior)
- **SC-004**: All layout components pass WCAG 2.1 AA accessibility audit for semantic structure
- **SC-005**: Layout components add less than 3KB gzipped to total bundle when tree-shaken
- **SC-006**: No custom CSS is required for token-based spacing, sizing, or responsive breakpoints
- **SC-007**: Teams report 50% reduction in layout-related CSS in new projects using these components
- **SC-008**: All components render correctly on first paint in SSR environments (no hydration-caused layout shift)

## Assumptions

- **Breakpoints are predefined**: Using tokenized breakpoints (sm, md, lg, xl) rather than arbitrary pixel values
- **Token system exists**: The @ds/tokens package provides spacing, layout, and surface tokens referenced by these components
- **Light DOM is required**: Based on constitution's theming and SSR requirements, Shadow DOM is not used for layout components
- **No behavior logic**: Layout components are purely structural - no collapsible sidebars, drawer logic, or navigation behavior
- **No built-in dividers**: Flow does not include a divider prop; users compose with a separate Divider component for visual separators
- **CSS layers are used**: Components integrate with the existing @ds/css layer system for predictable cascade
