# Feature Specification: Baseline Web Components

**Feature Branch**: `007-baseline-components`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User description: "Deliver baseline components as Web Components with token-driven styling, a11y and keyboard behavior, docs pages with recommended usage + anti-patterns, manifest entries and validation. Start with: Button, Link, Text, Icon, Spinner, VisuallyHidden."

## Clarifications

### Session 2026-01-03

- Q: Should this feature create an icon registry, defer Icon component, use inline SVG, or use an external icon library? → A: Use external icon library with adapter (future separate icon registry feature planned)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Integrates Button Component (Priority: P1)

A developer building a web application needs interactive button elements that follow accessibility best practices and integrate with the design system's token-driven theming.

**Why this priority**: Buttons are the most fundamental interactive primitive. Every application requires them, and they serve as the foundation for understanding how other interactive components work.

**Independent Test**: Can be fully tested by importing the button component, rendering it in multiple variants, and verifying click interactions, keyboard navigation, and screen reader announcements.

**Acceptance Scenarios**:

1. **Given** a developer has imported the button component, **When** they render `<ds-button>Submit</ds-button>`, **Then** a styled, accessible button appears that responds to clicks and keyboard activation.
2. **Given** a button is rendered with `disabled` attribute, **When** a user attempts to click or press Enter/Space, **Then** no action occurs and the button is announced as disabled to screen readers.
3. **Given** a button is rendered with `loading` attribute, **When** a user views it, **Then** a loading indicator is visible and the button is announced as busy.
4. **Given** a button with `variant="destructive"`, **When** rendered, **Then** the button uses destructive color tokens to visually indicate caution.

---

### User Story 2 - Developer Uses Link Component for Navigation (Priority: P1)

A developer needs accessible link elements that can navigate within an application or to external resources while maintaining proper semantics and styling.

**Why this priority**: Links are equally fundamental to buttons for any web application and require distinct semantics (navigation vs. action).

**Independent Test**: Can be fully tested by rendering links with different href values and verifying navigation behavior, keyboard focus, and screen reader announcements.

**Acceptance Scenarios**:

1. **Given** a developer renders `<ds-link href="/about">About</ds-link>`, **When** the user clicks or presses Enter, **Then** navigation occurs to the specified URL.
2. **Given** a link has `external` attribute, **When** rendered, **Then** it opens in a new tab/window and includes visual and accessible indication of external navigation.
3. **Given** a link is inside a sentence, **When** the user navigates with a screen reader, **Then** it is announced as a link with its accessible name.

---

### User Story 3 - Developer Displays Text with Consistent Typography (Priority: P2)

A developer needs to render text content with consistent typography that respects the design system's typographic scale and theming.

**Why this priority**: Typography consistency is essential for visual coherence, though text can be rendered with native elements initially.

**Independent Test**: Can be fully tested by rendering text at different sizes and weights, then verifying the computed styles match token values.

**Acceptance Scenarios**:

1. **Given** a developer renders `<ds-text size="lg">Heading</ds-text>`, **When** displayed, **Then** the text uses the large size from the typography token scale.
2. **Given** a text component with `variant="muted"`, **When** rendered, **Then** the text uses muted color tokens for secondary content.
3. **Given** a text component wrapping an element that should be a heading, **When** `as="h2"` is specified, **Then** the underlying semantic element is an `<h2>`.

---

### User Story 4 - Developer Displays Icons with Accessibility (Priority: P2)

A developer needs to display icons that are either decorative (hidden from assistive technology) or meaningful (announced with a label).

**Why this priority**: Icons enhance visual communication and are used pervasively, but require proper accessibility handling.

**Independent Test**: Can be fully tested by rendering icons with and without labels, then verifying ARIA attributes and screen reader behavior.

**Acceptance Scenarios**:

1. **Given** a developer renders `<ds-icon name="search" label="Search"></ds-icon>`, **When** a screen reader encounters it, **Then** it announces "Search".
2. **Given** an icon without a label attribute, **When** rendered, **Then** it has `aria-hidden="true"` and is ignored by screen readers.
3. **Given** an icon with an invalid name, **When** rendered, **Then** a fallback or error indication appears in development mode.

---

### User Story 5 - Developer Indicates Loading State (Priority: P2)

A developer needs to show loading spinners during asynchronous operations with proper accessibility announcements.

**Why this priority**: Loading indicators are essential for good UX but are not blocking for basic component usage.

**Independent Test**: Can be fully tested by rendering spinners with various sizes and labels, then verifying animation, sizing, and screen reader announcements.

**Acceptance Scenarios**:

1. **Given** a developer renders `<ds-spinner label="Loading content"></ds-spinner>`, **When** a screen reader encounters it, **Then** it announces "Loading content".
2. **Given** a spinner with `size="lg"`, **When** rendered, **Then** it uses the large sizing token for dimensions.
3. **Given** a spinner appears in a region, **When** rendered, **Then** the region can use `aria-busy="true"` to indicate loading.

---

### User Story 6 - Developer Hides Content Visually but Not from Screen Readers (Priority: P3)

A developer needs to hide content visually while keeping it accessible to screen readers for context that benefits assistive technology users.

**Why this priority**: VisuallyHidden is a utility component that enhances accessibility but is not required for core functionality.

**Independent Test**: Can be fully tested by rendering content inside VisuallyHidden and verifying it is not visible but is announced by screen readers.

**Acceptance Scenarios**:

1. **Given** a developer renders `<ds-visually-hidden>Additional context for screen readers</ds-visually-hidden>`, **When** displayed, **Then** the content is not visible but is announced by screen readers.
2. **Given** VisuallyHidden wraps a focusable element, **When** the element receives focus, **Then** it becomes visible temporarily (if `focusable` is enabled).

---

### Edge Cases

- What happens when a button is clicked while in a loading state? The click is ignored and no event is emitted.
- How does the link component handle JavaScript-based navigation (SPA)? It emits a custom event that can be intercepted to prevent default navigation.
- What happens when an icon name doesn't exist in the external library? A console warning in development and a fallback visual indicator.
- How does the spinner behave when reduced motion preferences are enabled? Animation is replaced with a static or minimal animation indicator.
- What happens when Text component receives invalid `as` prop? It falls back to a `<span>` element with a console warning.

## Requirements *(mandatory)*

### Functional Requirements

#### Button Component

- **FR-001**: Button MUST support `variant` attribute with values: `primary`, `secondary`, `ghost`, `destructive`
- **FR-002**: Button MUST support `size` attribute with values: `sm`, `md`, `lg`
- **FR-003**: Button MUST support `disabled` boolean attribute that prevents interaction and applies disabled styling
- **FR-004**: Button MUST support `loading` boolean attribute that shows a spinner and prevents interaction
- **FR-005**: Button MUST emit `ds:click` custom event when activated (click or Enter/Space)
- **FR-006**: Button MUST support keyboard activation via Enter and Space keys
- **FR-007**: Button MUST announce its disabled/loading state to screen readers via ARIA attributes

#### Link Component

- **FR-008**: Link MUST support `href` attribute for navigation destination
- **FR-009**: Link MUST support `external` boolean attribute that opens in new tab and adds external indicator
- **FR-010**: Link MUST support `variant` attribute with values: `default`, `muted`, `underline`
- **FR-011**: Link MUST emit `ds:navigate` custom event before navigation occurs (can be prevented)
- **FR-012**: Link MUST be keyboard navigable via Tab and activatable via Enter
- **FR-013**: Link with `external` MUST include accessible announcement of external link behavior

#### Text Component

- **FR-014**: Text MUST support `size` attribute with values: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
- **FR-015**: Text MUST support `weight` attribute with values: `normal`, `medium`, `semibold`, `bold`
- **FR-016**: Text MUST support `variant` attribute with values: `default`, `muted`, `success`, `warning`, `error`
- **FR-017**: Text MUST support `as` attribute to change the underlying semantic element (span, p, h1-h6)
- **FR-018**: Text MUST support `truncate` boolean attribute that adds ellipsis overflow

#### Icon Component

- **FR-019**: Icon MUST support `name` attribute to specify which icon to display from an external icon library via adapter
- **FR-020**: Icon MUST support `size` attribute with values: `xs`, `sm`, `md`, `lg`, `xl`
- **FR-021**: Icon MUST support `label` attribute for accessible name (when meaningful)
- **FR-022**: Icon without `label` MUST have `aria-hidden="true"` (decorative)
- **FR-023**: Icon MUST support `color` attribute to override default color token

#### Spinner Component

- **FR-024**: Spinner MUST support `size` attribute with values: `sm`, `md`, `lg`
- **FR-025**: Spinner MUST support `label` attribute for accessible loading announcement
- **FR-026**: Spinner MUST respect `prefers-reduced-motion` media query
- **FR-027**: Spinner MUST use `role="status"` and announce loading state to screen readers

#### VisuallyHidden Component

- **FR-028**: VisuallyHidden MUST hide content visually while keeping it in the accessibility tree
- **FR-029**: VisuallyHidden MUST support `focusable` boolean attribute that makes content visible on focus
- **FR-030**: VisuallyHidden MUST use CSS technique that doesn't affect layout of surrounding content

#### Cross-Cutting Requirements

- **FR-031**: All components MUST extend `DSElement` base class for Light DOM rendering
- **FR-032**: All components MUST use CSS custom properties from the token system
- **FR-033**: All components MUST include a `manifest.json` with accessibility metadata
- **FR-034**: All components MUST have MDX documentation meeting the docs contract
- **FR-035**: All components MUST declare `tokensUsed` in their manifest
- **FR-036**: All components MUST be SSR-compatible (render meaningful HTML without JavaScript)
- **FR-037**: All components MUST emit events using the `ds:` namespace prefix
- **FR-038**: All components MUST be registered via the component registry
- **FR-039**: All components MUST include unit tests and accessibility automation hooks
- **FR-040**: All components MUST support filtering by edition configuration in examples

### Key Entities

- **Component**: A reusable Web Component with defined attributes, events, and accessibility contract
- **Manifest**: JSON metadata describing a component's API, accessibility, and token usage
- **Token**: A design decision (color, spacing, typography) expressed as a CSS custom property
- **Edition**: A tier (core, pro, enterprise) that determines component availability
- **Docs Page**: MDX documentation including usage examples, API reference, and anti-patterns

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **SSR Compatibility**: Components must render meaningful content without JavaScript for initial page load
- **Accessibility Completeness**: Full WCAG 2.1 AA compliance with documented keyboard and screen reader behavior
- **Token Integration**: Seamless use of the DTCG token system for all styling decisions
- **Bundle Efficiency**: Minimal JavaScript footprint with tree-shakable component imports

### Approach A: Full Shadow DOM Components

Each component uses Shadow DOM for complete style encapsulation, with adopted stylesheets for token integration.

**Pros**:
- Complete style isolation prevents CSS conflicts
- Slotted content uses composition patterns

**Cons**:
- Forms integration requires form-associated custom elements API
- Token custom properties must pierce shadow boundary
- SSR requires Declarative Shadow DOM (browser support considerations)
- Additional complexity for accessibility testing

### Approach B: Light DOM Components (Established Pattern)

Continue the established `DSElement` pattern using Light DOM rendering for all baseline components.

**Pros**:
- Proven pattern already implemented for Button and Input
- Direct CSS styling without shadow boundary issues
- Native form integration works automatically
- Standard accessibility tree traversal
- SSR renders actual HTML that styles correctly before hydration
- Simpler testing with standard DOM assertions

**Cons**:
- No style encapsulation (mitigated by CSS layers and BEM-style classes)
- Component styles can be accidentally overridden (mitigated by layer precedence)

### Approach C: Hybrid (Shadow DOM for Complex, Light DOM for Simple)

Use Shadow DOM only for components requiring encapsulation (none in baseline set) and Light DOM for primitives.

**Pros**:
- Flexibility to choose best approach per component
- Can optimize based on specific needs

**Cons**:
- Inconsistent mental model for developers
- Different testing approaches per component
- SSR complexity varies by component

### Recommendation

**Recommended: Approach B (Light DOM Components)**

This approach aligns with the established patterns in the codebase (Button and Input already use Light DOM via `DSElement`). It scores highest on accessibility (standard DOM traversal), SSR compatibility (no Declarative Shadow DOM required), and maintains consistency with existing implementation. The lack of style encapsulation is acceptable given the CSS layer system provides clear precedence rules, and the `ds-` prefix convention avoids naming collisions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 6 baseline components pass WCAG 2.1 AA automated accessibility checks
- **SC-002**: All components render meaningful, styled content before JavaScript hydration
- **SC-003**: All components complete keyboard interaction flows without mouse dependency
- **SC-004**: Each component's documentation page includes at least 3 usage examples and 2 anti-patterns
- **SC-005**: Manifest validation passes for all components in strict mode (CI)
- **SC-006**: Screen reader testing confirms all interactive states are properly announced
- **SC-007**: Components correctly inherit token values when brand or mode attributes change on root element
- **SC-008**: Tree-shaking correctly excludes unused components from production bundles
- **SC-009**: Unit test coverage reaches minimum 80% for all component logic
- **SC-010**: All components work correctly in both client-side and server-side rendered contexts

## Appendix: Component API Reference

### Button

| Attribute  | Type                                                          | Default     | Description                     |
| ---------- | ------------------------------------------------------------- | ----------- | ------------------------------- |
| `variant`  | `"primary"` \| `"secondary"` \| `"ghost"` \| `"destructive"`  | `"primary"` | Visual style variant            |
| `size`     | `"sm"` \| `"md"` \| `"lg"`                                    | `"md"`      | Button size                     |
| `disabled` | `boolean`                                                     | `false`     | Prevents interaction            |
| `loading`  | `boolean`                                                     | `false`     | Shows spinner, prevents action  |
| `type`     | `"button"` \| `"submit"` \| `"reset"`                         | `"button"`  | HTML button type                |

**Events**: `ds:click`

**Tokens Used**: `color.primary`, `color.secondary`, `color.destructive`, `color.text.inverse`, `color.background.surface`, `color.border.focus`, `spacing.sm`, `spacing.md`, `spacing.lg`, `radius.md`, `typography.font-weight.medium`

**A11y**: APG Button pattern, keyboard Enter/Space, `aria-disabled`, `aria-busy`

---

### Link

| Attribute  | Type                                        | Default     | Description                        |
| ---------- | ------------------------------------------- | ----------- | ---------------------------------- |
| `href`     | `string`                                    | —           | Navigation destination URL         |
| `external` | `boolean`                                   | `false`     | Opens in new tab, adds indicator   |
| `variant`  | `"default"` \| `"muted"` \| `"underline"`   | `"default"` | Visual style variant               |

**Events**: `ds:navigate` (cancelable)

**Tokens Used**: `color.link.default`, `color.link.hover`, `color.link.visited`, `color.text.muted`, `typography.text-decoration`

**A11y**: Native link semantics, keyboard Tab/Enter, external link announcement

---

### Text

| Attribute  | Type                                                          | Default     | Description                   |
| ---------- | ------------------------------------------------------------- | ----------- | ----------------------------- |
| `size`     | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| `"2xl"`     | `"md"`      | Typography size scale         |
| `weight`   | `"normal"` \| `"medium"` \| `"semibold"` \| `"bold"`          | `"normal"`  | Font weight                   |
| `variant`  | `"default"` \| `"muted"` \| `"success"` \| `"warning"` \| `"error"` | `"default"` | Color variant            |
| `as`       | `"span"` \| `"p"` \| `"h1"` - `"h6"`                          | `"span"`    | Semantic element              |
| `truncate` | `boolean`                                                     | `false`     | Truncate with ellipsis        |

**Events**: None

**Tokens Used**: `typography.font-size.xs` through `typography.font-size.2xl`, `typography.font-weight.*`, `typography.line-height.*`, `color.text.default`, `color.text.muted`, `color.semantic.*`

**A11y**: Semantic element via `as` prop, proper heading hierarchy

---

### Icon

| Attribute | Type                                               | Default          | Description                          |
| --------- | -------------------------------------------------- | ---------------- | ------------------------------------ |
| `name`    | `string`                                           | —                | Icon identifier from external library |
| `size`    | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"`     | `"md"`           | Icon size                            |
| `label`   | `string`                                           | —                | Accessible name (omit for decorative)|
| `color`   | `string`                                           | `"currentColor"` | Icon color override                  |

**Events**: None

**Tokens Used**: `sizing.icon.xs` through `sizing.icon.xl`, `color.icon.default`

**A11y**: `aria-hidden="true"` when decorative, `role="img"` with `aria-label` when meaningful

---

### Spinner

| Attribute | Type                           | Default     | Description                        |
| --------- | ------------------------------ | ----------- | ---------------------------------- |
| `size`    | `"sm"` \| `"md"` \| `"lg"`     | `"md"`      | Spinner size                       |
| `label`   | `string`                       | `"Loading"` | Accessible loading announcement    |

**Events**: None

**Tokens Used**: `sizing.spinner.sm` through `sizing.spinner.lg`, `color.primary`, `motion.duration.slow`, `motion.easing.linear`

**A11y**: `role="status"`, `aria-label` from label prop, respects `prefers-reduced-motion`

---

### VisuallyHidden

| Attribute   | Type      | Default | Description                   |
| ----------- | --------- | ------- | ----------------------------- |
| `focusable` | `boolean` | `false` | Become visible on focus       |

**Events**: None

**Tokens Used**: None (uses CSS positioning technique)

**A11y**: Content remains in accessibility tree, visually hidden via CSS clip/position

## Assumptions

1. Icon component uses an external icon library (e.g., Lucide, Heroicons) via an adapter pattern; a custom icon registry is planned as a future separate feature
2. Token paths referenced (e.g., `color.link.default`) exist in the token system or will be added
3. The docs contract schema from feature 002 defines the MDX structure requirements
4. Edition filtering is handled at the docs layer, not within component implementation
5. The behavior utilities from feature 005 will be used for focus management and keyboard handling
6. All components target the `core` edition as baseline (available to all tiers)
