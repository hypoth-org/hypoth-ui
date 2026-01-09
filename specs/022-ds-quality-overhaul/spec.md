# Feature Specification: Design System Quality Overhaul

**Feature Branch**: `022-ds-quality-overhaul`
**Created**: 2026-01-09
**Status**: Draft
**Input**: Address audit findings from AUDIT_REPORT.md including 5 biggest risks/gaps, 10 maintainability issues, event semantics standardization, async state loading props, theme primitives (12-step colors, density, responsive variants), APG accessibility alignment for Tree/DataTable/Stepper/NavigationMenu, and style props system.

## Clarifications

### Session 2026-01-09

- Q: What runtime strategy should style props use? → A: Build-time CSS generation (like Panda/Vanilla Extract) - style props compiled to atomic CSS classes at build time for zero runtime cost
- Q: How should event naming migration handle existing consumers? → A: Breaking change - remove old event names immediately (no existing consumers to migrate)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete React Component Coverage (Priority: P1)

As a React developer adopting Hypoth-UI, I need all 55 components to have React adapters so I can use the full design system without falling back to Web Components or blocking my team's adoption.

**Why this priority**: The React coverage gap (24 missing components) is the #1 blocker for production adoption. Teams cannot adopt a partial library for React-first projects.

**Independent Test**: Import each of the 24 missing React components, render them with basic props, and verify they function identically to their WC counterparts.

**Acceptance Scenarios**:

1. **Given** a React application, **When** I import any of the 55 components from `@ds/react`, **Then** each component renders correctly with full prop support
2. **Given** a React component and its WC counterpart, **When** I use identical props/attributes, **Then** both produce functionally identical behavior
3. **Given** the missing components list (Accordion, AlertDialog, Breadcrumb, Command, DataTable, NavigationMenu, Pagination, Progress, ScrollArea, Skeleton, Stepper, Table, Toast, Tree, etc.), **When** I import each from `@ds/react`, **Then** TypeScript provides complete type definitions

---

### User Story 2 - Style Props System for React (Priority: P1)

As a React developer, I need Chakra-like style props (e.g., `<Box px={4} bg="primary">`) so I can rapidly prototype UI without writing separate CSS and maintain consistency with design tokens.

**Why this priority**: Style props dramatically improve DX for React teams. This is a major expectation gap compared to Chakra/Radix that blocks React-centric team adoption.

**Independent Test**: Use style props on Box and other primitive components to style layouts inline while verifying token integration.

**Acceptance Scenarios**:

1. **Given** a Box component, **When** I pass `px={4}` and `bg="primary.default"`, **Then** the component renders with correct spacing and color from design tokens
2. **Given** a Text component, **When** I pass `fontSize="lg"` and `color="foreground.muted"`, **Then** typography tokens are applied correctly
3. **Given** responsive props like `px={{ base: 2, md: 4, lg: 8 }}`, **When** the viewport changes, **Then** the corresponding values apply at each breakpoint
4. **Given** any style prop value, **When** it references a token path, **Then** the corresponding CSS variable is used (e.g., `--ds-spacing-4`)

---

### User Story 3 - SSR-Safe ID Generation (Priority: P1)

As a Next.js developer using SSR/RSC, I need deterministic ID generation so my components don't cause hydration mismatches between server and client renders.

**Why this priority**: SSR ID collision is a silent bug that breaks React hydration. This is a critical fix before RSC deployment can be recommended.

**Independent Test**: Render any ID-generating component (Dialog, Select, Menu) on server and client, verify IDs match.

**Acceptance Scenarios**:

1. **Given** a Dialog rendered server-side, **When** the client hydrates, **Then** all generated IDs match exactly (no console warnings)
2. **Given** multiple instances of the same component type, **When** rendered on both server and client, **Then** IDs are unique and consistent across renders
3. **Given** React 18's `useId()` hook, **When** integrated with behavior primitives, **Then** ID generation is automatically SSR-safe

---

### User Story 4 - Event Semantics Standardization (Priority: P2)

As a developer using Hypoth-UI components, I need consistent event naming conventions so I can predict callback prop names without checking documentation for each component.

**Why this priority**: Inconsistent event naming (`onClick` vs `onPress`, `ds:change` vs `onValueChange`) creates friction and errors. Standardization improves DX significantly.

**Independent Test**: Use callback props across all interactive components with the standardized naming convention.

**Acceptance Scenarios**:

1. **Given** any interactive component, **When** the primary action occurs (click, selection, activation), **Then** the callback follows the pattern: `onPress` for buttons, `onValueChange` for value changes, `onOpenChange` for open state
2. **Given** a documented event convention, **When** I look at any component's props, **Then** I can predict the callback name without reading docs
3. **Given** Web Components using `ds:` prefixed events, **When** the same component is used in React, **Then** props use camelCase callbacks (e.g., `ds:change` → `onValueChange`)

---

### User Story 5 - Async/Loading States for Complex Components (Priority: P2)

As a developer building data-driven UIs, I need built-in loading states for Select, Combobox, Table, and Tree components so I can show appropriate feedback during async data fetching.

**Why this priority**: Many real-world use cases involve async data (API calls for options, paginated tables). Without built-in loading states, developers must implement custom solutions.

**Independent Test**: Set `loading={true}` on Select, Combobox, Table, and Tree components and verify loading UI appears.

**Acceptance Scenarios**:

1. **Given** a Select component, **When** `loading={true}` is set, **Then** a loading indicator appears in the dropdown and `aria-busy="true"` is set
2. **Given** a Combobox component, **When** `loading={true}` is set, **Then** options show a loading skeleton and keyboard navigation is disabled until loaded
3. **Given** a Table component, **When** `loading={true}` is set, **Then** skeleton rows appear with the expected column count
4. **Given** a Tree component, **When** a parent node has `loading={true}`, **Then** child expansion shows loading indicator

---

### User Story 6 - 16-Step Color Scales (Priority: P2)

As a designer/developer, I need 16-step color scales so I can build nuanced UI with proper contrast ratios and multiple levels of surface layering without manually calculating shades.

**Why this priority**: Single-value color tokens limit UI expressiveness. 16-step scales (vs industry-standard 12) enable better layered surfaces (4 background levels for nested cards/panels) plus consistent color contrast across all components and states.

**Independent Test**: Access any color at steps 1-16 (e.g., `color.blue.1` through `color.blue.16`) and verify consistent progression with clear purpose per step.

**Acceptance Scenarios**:

1. **Given** a color scale like `blue`, **When** I access steps 1-16, **Then** each step represents a progressively darker shade suitable for specific purposes:
   - Steps 1-4: Backgrounds (page, card, nested card, deep nested)
   - Steps 5-7: Interactive (element, hover, active)
   - Steps 8-10: Borders (subtle, default, strong)
   - Steps 11-14: Solids (default, hover, active, emphasis)
   - Steps 15-16: Text (muted, default)
2. **Given** a semantic color like `primary`, **When** I access it, **Then** it maps to appropriate steps from the underlying scale (e.g., `primary.default` → `blue.11`, `primary.subtle` → `blue.2`)
3. **Given** dark mode, **When** I use the same color step, **Then** the mapping inverts symmetrically (1↔16, 2↔15, etc.)
4. **Given** a contrast requirement between two color steps, **When** checked against WCAG 2.1 AA, **Then** recommended pairings meet 4.5:1 contrast ratio

---

### User Story 7 - Density/Scaling System (Priority: P2)

As a developer building different product contexts (dashboards vs marketing sites), I need density variants (compact, comfortable, spacious) so I can adjust component sizing without custom CSS.

**Why this priority**: Different products need different densities. Dashboards need compact views; marketing sites need spacious layouts. A density system prevents one-off customizations.

**Independent Test**: Set density on a component or provider and verify all child components adjust appropriately.

**Acceptance Scenarios**:

1. **Given** a density provider set to "compact", **When** components render inside it, **Then** padding, font sizes, and spacing reduce proportionally
2. **Given** a density provider set to "spacious", **When** components render inside it, **Then** padding, font sizes, and spacing increase proportionally
3. **Given** a component with explicit `size` prop, **When** density provider is also set, **Then** the explicit size takes precedence
4. **Given** density tokens, **When** consumed via CSS variables, **Then** custom components can also respond to density changes

---

### User Story 8 - Responsive Variants (Priority: P2)

As a developer building responsive UIs, I need breakpoint-aware component sizing so I can adjust component appearance per viewport without media query boilerplate.

**Why this priority**: Responsive design is table-stakes. Without built-in responsive variants, developers write repetitive CSS media queries.

**Independent Test**: Pass responsive object props to components and verify they apply at correct breakpoints.

**Acceptance Scenarios**:

1. **Given** a Button with `size={{ base: "sm", md: "md", lg: "lg" }}`, **When** viewport width changes, **Then** button size adjusts at each breakpoint
2. **Given** breakpoint tokens (sm, md, lg, xl), **When** used in responsive props, **Then** they apply at the correct pixel values
3. **Given** a responsive prop, **When** rendered server-side, **Then** appropriate CSS is generated without runtime JS

---

### User Story 9 - APG Accessibility Alignment (Priority: P1)

As a developer building accessible applications, I need Tree, DataTable, Stepper, and NavigationMenu to fully comply with WAI-ARIA Authoring Practices Guide so screen reader users have proper context and navigation.

**Why this priority**: Accessibility is non-negotiable. These four components have specific APG gaps that must be fixed to achieve 5/5 a11y maturity.

**Independent Test**: Run VoiceOver/NVDA on each component and verify all expected announcements and keyboard behaviors match APG specifications.

**Acceptance Scenarios**:

1. **Given** a Tree component, **When** screen reader navigates it, **Then** it announces `aria-expanded`, `aria-level`, `aria-setsize`, and `aria-posinset` for each node
2. **Given** a DataTable with sortable columns, **When** sort state changes, **Then** screen reader announces "sorted ascending/descending by [column]"
3. **Given** a Stepper component, **When** on step 2 of 4, **Then** `aria-current="step"` is set on the active step
4. **Given** a NavigationMenu, **When** screen reader reads it, **Then** it uses `role="menubar"` with `role="menuitem"` children following APG menu pattern

---

### User Story 10 - Documentation Site Deployment (Priority: P2)

As a potential adopter evaluating Hypoth-UI, I need a deployed searchable documentation site with interactive examples so I can evaluate components without cloning the repo.

**Why this priority**: Incomplete docs is the #3 risk/gap. External evaluation is impossible without deployed documentation.

**Independent Test**: Visit the deployed docs site, search for a component, and interact with live examples.

**Acceptance Scenarios**:

1. **Given** the docs site URL, **When** I visit it, **Then** I see a component list with categories
2. **Given** a component page, **When** I view it, **Then** I see live interactive examples, prop tables, and usage code
3. **Given** the search feature, **When** I type a component name, **Then** relevant results appear instantly
4. **Given** any documented component, **When** I copy the example code, **Then** it works in my project without modification

---

### User Story 11 - Copy/Paste Adoption Model (Priority: P3)

As a developer who prefers owning component code, I need a CLI command to copy component source into my project so I can customize freely without library version coupling.

**Why this priority**: Copy/paste model (like shadcn/ui) reduces version coupling and enables deep customization. Important for teams with unique requirements.

**Independent Test**: Run CLI copy command for a component and verify source files are added to project with working imports.

**Acceptance Scenarios**:

1. **Given** the CLI installed, **When** I run `npx @ds/cli copy button`, **Then** Button source files are copied to my project's component directory
2. **Given** a copied component, **When** I import it from my local path, **Then** it works identically to the library version
3. **Given** a copied component, **When** I modify its source, **Then** library updates don't override my changes
4. **Given** dependencies between components, **When** I copy one, **Then** CLI prompts to copy required dependencies

---

### User Story 12 - Dev Mode Warnings (Priority: P2)

As a developer using components incorrectly, I need console warnings in development mode so I can identify and fix misuse before production.

**Why this priority**: Silent failures are developer-hostile. Dev warnings catch common mistakes early.

**Independent Test**: Intentionally misuse a component (e.g., Dialog without DialogTitle) and verify console warning appears.

**Acceptance Scenarios**:

1. **Given** a Dialog without DialogTitle, **When** running in development mode, **Then** console warns "[ds-dialog] Missing required ds-dialog-title for accessibility"
2. **Given** a Form without Field wrapper around Input, **When** running in development, **Then** console warns about missing field context
3. **Given** production mode (`NODE_ENV=production`), **When** component is misused, **Then** no console warnings appear (for performance)

---

### Edge Cases

- What happens when style props conflict with className styles? (className wins via CSS specificity)
- How does density interact with responsive variants? (density applies first, responsive overrides)
- What if a 16-step color scale doesn't exist for a custom brand color? (system generates intermediate steps using OKLCH interpolation)
- How does copy/paste handle version mismatches with behavior primitives? (copied components pin to current primitives version)
- What if SSR ID generation produces different IDs across server restarts? (IDs should be deterministic based on component tree position, not random)

## Requirements *(mandatory)*

### Functional Requirements

**React Coverage:**
- **FR-001**: System MUST provide React adapters for all 55 WC components
- **FR-002**: React adapters MUST have TypeScript definitions matching WC prop interfaces
- **FR-003**: React adapters MUST support `forwardRef` for all components

**Style Props:**
- **FR-004**: System MUST provide style props (`px`, `py`, `m`, `bg`, `color`, etc.) on primitive components (Box, Text, Flex, Grid)
- **FR-005**: Style prop values MUST reference design token paths (e.g., `px={4}` → `--ds-spacing-4`)
- **FR-006**: Style props MUST support responsive object syntax (`px={{ base: 2, md: 4 }}`)
- **FR-007**: Style props MUST use build-time CSS generation (compiled to atomic CSS classes) with zero runtime cost
- **FR-007a**: Style props MUST NOT increase bundle size for teams not using them (tree-shakeable)

**SSR/ID Generation:**
- **FR-008**: All behavior primitives MUST accept a `generateId` option for custom ID generation
- **FR-009**: React package MUST provide `useStableId()` hook using React 18's `useId()`
- **FR-010**: Default ID generation MUST be deterministic based on component tree position

**Event Semantics:**
- **FR-011**: System MUST document the event naming convention in a canonical location
- **FR-012**: All button-like activations MUST use `onPress` callback
- **FR-013**: All value-changing components MUST use `onValueChange` callback
- **FR-014**: All open/close components MUST use `onOpenChange` callback
- **FR-015**: WC custom events MUST follow `ds:{action}` pattern (e.g., `ds:change`, `ds:open`)

**Async/Loading:**
- **FR-016**: Select, Combobox, Table, Tree MUST support `loading` prop
- **FR-017**: Loading state MUST set `aria-busy="true"` and display appropriate loading UI
- **FR-018**: Keyboard navigation MUST be disabled while loading (for list components)

**Token/Theme System:**
- **FR-019**: Color tokens MUST provide 16-step scales (1-16) for each color with enhanced layering support (4 background levels, 3 interactive, 3 border, 4 solid, 2 text)
- **FR-020**: System MUST provide automatic contrast calculation for text/background pairs
- **FR-021**: System MUST provide density tokens (compact, default, spacious)
- **FR-022**: Components MUST respond to density context without prop changes
- **FR-023**: Component sizing props MUST support responsive object syntax
- **FR-023a**: Spacing and sizing tokens MUST use relative units (rem) not fixed pixels
- **FR-023b**: Density-specific token sets MUST be pre-computed (no runtime calc())

**Theme Provider:**
- **FR-040**: System MUST provide a unified `ThemeProvider` that manages both color mode (light/dark/system) and density
- **FR-041**: ThemeProvider MUST support persistence strategies: localStorage, cookie, or none (controlled)
- **FR-042**: ThemeProvider MUST provide SSR-safe initialization via `ssrValues` prop and `getThemeScript()` utility
- **FR-043**: ThemeProvider MUST apply `data-color-mode` and `data-density` attributes to the root element
- **FR-044**: System MUST provide `useTheme()` hook returning current values and setter functions
- **FR-045**: System MUST provide `DensityProvider` for nested density overrides within a subtree

**Accessibility:**
- **FR-024**: Tree MUST implement `aria-expanded`, `aria-level`, `aria-setsize`, `aria-posinset`
- **FR-025**: DataTable MUST announce sort state changes via live region
- **FR-026**: Stepper MUST implement `aria-current="step"` on active step
- **FR-027**: NavigationMenu MUST implement `role="menubar"` pattern per APG

**Documentation:**
- **FR-028**: Documentation site MUST be deployed with search functionality
- **FR-029**: Each component MUST have interactive examples in documentation
- **FR-030**: All 55 components MUST have complete manifest.json files

**Copy/Paste Model:**
- **FR-031**: CLI MUST support `copy <component>` command to copy source to project
- **FR-032**: Copied components MUST work without library dependency
- **FR-033**: CLI MUST handle component dependencies during copy

**Dev Warnings:**
- **FR-034**: System MUST warn in development mode for missing required children
- **FR-035**: System MUST warn for invalid prop combinations
- **FR-036**: Warnings MUST be stripped in production builds

**Maintainability:**
- **FR-037**: System MUST extract shared overlay logic into `createOverlayBehavior` primitive
- **FR-038**: System MUST standardize event naming across all components
- **FR-039**: React components MUST include error boundaries for graceful degradation

### Assumptions

- **No existing external consumers**: The design system has no production consumers yet, enabling breaking changes without migration burden

### Key Entities

- **Color Scale**: A 12-step progression of a color from lightest (1) to darkest (12), with semantic mappings for common uses
- **Density Mode**: A named configuration (compact/default/spacious) affecting spacing, sizing, and typography across all components
- **Style Prop**: A React prop that maps to a CSS property and design token value (e.g., `px={4}` → `padding-left: var(--ds-spacing-4)`)
- **Event Convention**: A documented naming pattern for component callbacks ensuring predictability across the system
- **Stable ID**: A server/client consistent identifier generated deterministically from component tree position

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Performance**: Bundle size impact, runtime overhead, SSR compatibility
- **Accessibility**: WCAG 2.1 AA compliance, screen reader compatibility, keyboard navigation
- **Customizability**: Token integration, override mechanisms, extensibility for brands
- **Developer Experience**: API consistency, learning curve, migration effort from current state

### Approach A: Incremental Enhancement

Enhance existing architecture piece by piece without major refactoring. Add React components one at a time, add style props to existing primitives, fix ID generation in place.

**Pros**:
- Lower risk of breaking existing functionality
- Can be delivered incrementally with smaller PRs
- Existing tests continue to pass throughout

**Cons**:
- May accumulate technical debt if patterns aren't unified first
- Longer total timeline as each piece requires separate context
- Risk of inconsistency between early and late additions

### Approach B: Foundation-First Refactor

Establish unified patterns (event conventions, style props system, ID generation) first, then implement features on the new foundation.

**Pros**:
- Ensures consistency across all new additions
- Refactored patterns benefit all future development
- Cleaner codebase long-term

**Cons**:
- Higher initial investment before visible feature delivery
- More complex PRs touching multiple files
- Requires careful migration of existing components

### Approach C: Parallel Track Development

Split work into independent tracks (React coverage, theming, a11y) that can proceed simultaneously with minimal dependencies.

**Pros**:
- Faster overall delivery with parallel work
- Teams can specialize on different tracks
- Blocking issues in one track don't stop others

**Cons**:
- Risk of inconsistent patterns between tracks
- Coordination overhead for shared primitives
- Integration challenges when tracks merge

### Recommendation

**Recommended: Approach B (Foundation-First Refactor)**

Justification:
1. **Performance**: New foundation (style props, ID generation) can be designed for optimal tree-shaking and SSR from the start
2. **Accessibility**: APG fixes integrate better with unified event/state conventions
3. **Customizability**: Token system expansion (12-step colors, density) benefits from being designed holistically
4. **Developer Experience**: Consistent patterns across all features reduce cognitive load

Trade-offs acknowledged:
- Initial sprint focuses on infrastructure rather than features
- Requires discipline to not ship features before foundation is solid
- Acceptable because: foundation work unblocks all subsequent features and prevents rework

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 55 components have React adapters with TypeScript definitions (100% coverage)
- **SC-002**: Style props work on all primitive components with full responsive syntax support
- **SC-003**: Zero hydration mismatch warnings in Next.js SSR/RSC environments
- **SC-004**: All interactive components follow documented event naming convention
- **SC-005**: Tree, DataTable, Stepper, NavigationMenu pass NVDA and VoiceOver screen reader testing
- **SC-006**: Documentation site deployed with search returning results in under 500ms
- **SC-007**: 16-step color scales available for all semantic colors (primary, secondary, success, warning, error, neutral) with documented step usage guide
- **SC-008**: Density variants (compact, default, spacious) affect all spacing-sensitive components
- **SC-009**: Select, Combobox, Table, Tree components support loading state with appropriate ARIA
- **SC-010**: CLI copy command successfully extracts components with dependencies to new project
- **SC-011**: All 55 components have complete manifest.json with accessibility contracts
- **SC-012**: Dev mode warnings appear for 100% of documented misuse patterns
- **SC-013**: ThemeProvider persists color mode and density preferences across page reloads with zero flash of wrong theme on SSR
