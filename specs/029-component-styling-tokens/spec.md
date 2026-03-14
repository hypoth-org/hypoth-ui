# Feature Specification: Component Styling Tokens

**Feature Branch**: `029-component-styling-tokens`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "I want you to work on styling for the components now. I want components to have the eventual ability to restyle any element of the component. I believe adobe spectrum does this by having component level tokens. The focus is on maximum flexibility. For the actual visual style of the components, I want you to use radix, tailwind, and shadcn. Don't create any styling that is not able to be modified later but also don't make every component have custom styles. I want there to be tiering from core design tokens, to semantic, to tokens for different types and also tokens for sizes that tier down to components."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Override a Component's Visual Style Without Forking (Priority: P1)

A design system consumer wants to customize the appearance of a specific component (e.g., Button) to match their product's brand. They need to change colors, spacing, border radius, and typography for that component without modifying the design system source code, and without those changes leaking into other components.

**Why this priority**: This is the core value proposition — maximum styling flexibility without forking. If consumers cannot customize individual components, adoption stalls because every product has unique brand requirements.

**Independent Test**: Can be fully tested by overriding a single component's styling tokens and verifying the component renders with the new values while all other components remain unchanged.

**Acceptance Scenarios**:

1. **Given** a consumer application using the default design system styles, **When** the consumer overrides the button's background color token, **Then** only the button component reflects the new background color while all other components retain their defaults.
2. **Given** a component with multiple internal elements (e.g., a Select with trigger, listbox, and option elements), **When** the consumer overrides a token scoped to the trigger element, **Then** only the trigger element changes appearance while listbox and option elements remain unchanged.
3. **Given** a consumer who has overridden several component tokens, **When** the design system releases a new version with updated default styles, **Then** the consumer's overrides continue to take effect and non-overridden properties adopt the new defaults.

---

### User Story 2 - Apply a Consistent Brand Theme Across All Components (Priority: P1)

A design system consumer wants to apply their brand's color palette, typography scale, and spacing rhythm across all components at once by modifying a small set of high-level tokens rather than customizing each component individually.

**Why this priority**: Equally critical to P1-US1 — the tiered token system must allow broad theming at the top tier and surgical overrides at the bottom tier. Without top-down theming, consumers must override every component one by one, which is impractical.

**Independent Test**: Can be fully tested by changing a single semantic color token and verifying all components that reference it update consistently.

**Acceptance Scenarios**:

1. **Given** the default design system theme, **When** a consumer redefines the primary color semantic token, **Then** every component that uses the primary color (Button, Link, Checkbox, Radio, etc.) reflects the new color across all states (default, hover, active, focus).
2. **Given** a consumer has applied a custom theme via semantic tokens, **When** the consumer additionally overrides a specific component's token, **Then** the component-level override takes precedence over the semantic token for that component only.

---

### User Story 3 - Create Size and Density Variants Without Custom CSS (Priority: P2)

A design system consumer wants to deploy the same components at different sizes or densities across different parts of their application (e.g., a compact data-heavy dashboard vs. a spacious marketing page) using the token system rather than writing custom CSS.

**Why this priority**: Size/density flexibility is a common enterprise requirement but is secondary to color and general styling flexibility which covers a broader set of use cases.

**Independent Test**: Can be fully tested by applying a size or density token override to a container and verifying all child components adopt the new sizing without any custom CSS.

**Acceptance Scenarios**:

1. **Given** components at their default size, **When** a consumer applies a different size tier (e.g., small vs. large) to a section of their page, **Then** all components within that section adopt the corresponding sizing tokens (padding, font size, height, gap) proportionally.
2. **Given** a compact density setting applied to a data table region, **When** the consumer also uses a large button inside that region, **Then** the explicit button size override takes precedence over the inherited density setting.

---

### User Story 4 - Restyle Specific Internal Elements of a Component (Priority: P2)

A design system consumer wants to change the appearance of a specific internal part of a complex component — for example, changing only the dropdown arrow color in a Select, or only the label typography in an Input, without affecting other parts of that component.

**Why this priority**: Per-element customization is essential for advanced use cases but most consumers start with whole-component or theme-level overrides first.

**Independent Test**: Can be fully tested by overriding a token scoped to a specific component sub-element and verifying only that element changes.

**Acceptance Scenarios**:

1. **Given** a Select component with default styling, **When** the consumer overrides the token for the Select's indicator icon color, **Then** only the indicator icon color changes while the trigger text, border, and dropdown list remain at their defaults.
2. **Given** an Input component with a label, field, and helper text, **When** the consumer overrides the label's font weight token, **Then** only the label font weight changes.

---

### User Story 5 - Design System Maintainer Adds a New Component with Proper Token Integration (Priority: P3)

A design system maintainer is creating a new component and needs to integrate it into the tiered token system. They need clear guidance on which tokens to reference (semantic vs. type-level vs. component-level), when to create new component-level tokens vs. reuse existing semantic tokens, and how to expose internal elements for consumer customization.

**Why this priority**: Maintainer experience is important for long-term system health but serves a smaller audience than consumer-facing features.

**Independent Test**: Can be fully tested by following the token integration guidelines to build a new component and verifying it responds correctly to theme changes and supports consumer overrides.

**Acceptance Scenarios**:

1. **Given** a maintainer creating a new Card component, **When** they follow the token integration guidelines, **Then** the Card automatically inherits the current theme's colors, spacing, and typography without defining any custom values.
2. **Given** a maintainer has created a component with internal sub-elements, **When** they expose customization tokens for those sub-elements following the naming convention, **Then** consumers can override those tokens without knowledge of the component's internal structure.

---

### Edge Cases

- What happens when a consumer defines a component-level token that references a nonexistent semantic token? The system should fall back gracefully to the next tier up, ultimately reaching the core primitive value.
- How does the system behave when conflicting overrides exist at multiple tiers (e.g., semantic, type, and component all override the same property)? The most specific tier (component) must always win.
- What happens when a new token tier is introduced in a future version? Existing consumer overrides at other tiers should remain unaffected.
- How does the token system interact with dark mode and high-contrast mode overrides? Mode tokens should override semantic defaults while still allowing component-level tokens to take final precedence.
- What happens when responsive/breakpoint tokens conflict with component size tokens? Explicit size tokens should take priority over inherited responsive adjustments.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The token system MUST provide a clear hierarchy of at least four tiers: core primitives, semantic tokens, type/category tokens (e.g., form controls, overlays, navigation), and component-level tokens.
- **FR-002**: Each tier MUST resolve values by referencing the tier above it, so that a change at a higher tier cascades down to all components that have not explicitly overridden that value.
- **FR-003**: Component-level tokens MUST allow consumers to override the styling of any visual property (color, spacing, typography, borders, shadows, radii) on any identifiable sub-element of a component.
- **FR-004**: The system MUST provide type-level tokens for six component categories — form-controls, overlays, navigation, feedback, containers, and actions — that group shared styling across related components within each category (e.g., all form controls share input-height, input-padding, input-border-radius tokens; all actions share action-height, action-padding tokens).
- **FR-005**: The system MUST provide size-level tokens that define consistent size scales (e.g., sm, md, lg) which components consume for their padding, font size, height, and gap values.
- **FR-006**: Component-level token overrides MUST NOT require consumers to modify the design system source code — overrides should be achievable through standard styling mechanisms available to consumers.
- **FR-007**: The token system MUST support mode-based variants (dark mode, high-contrast mode) at every tier, with lower tiers inheriting mode changes from higher tiers unless explicitly overridden.
- **FR-008**: The system MUST follow a consistent, predictable naming convention for tokens across all tiers so that consumers can discover and override tokens without consulting documentation for every component.
- **FR-009**: The visual defaults for all components MUST use shadcn/ui as the primary design reference for layout, spacing, and border radii, with these specific divergences: a blue accent color for the primary role (not dark gray), a default typeface per FR-015, and color-blind safe success/destructive colors per FR-014. Radix Themes and Tailwind Catalyst serve as secondary influences where shadcn does not provide guidance.
- **FR-014**: The success and destructive semantic colors MUST be distinguishable across the three most common forms of color vision deficiency (protanopia, deuteranopia, tritanopia), with a minimum hue separation of 120 degrees in oklch color space.
- **FR-015**: The default typeface MUST be Geist (sans-serif) and Geist Mono (monospace), with system-ui and ui-monospace as fallback stacks to ensure graceful degradation when the font is not loaded.
- **FR-010**: The system MUST NOT introduce any styling that cannot be overridden by consumers — no hardcoded values in component styles.
- **FR-011**: Components that share the same visual category (e.g., all buttons, all form inputs, all overlay panels) MUST share type-level tokens rather than each defining independent token sets.
- **FR-012**: The system MUST maintain backward compatibility with the existing `--ds-*` CSS custom property namespace and the current CSS layer architecture (reset → tokens → base → components → animations → utilities → high-contrast → overrides).
- **FR-013**: The token system MUST establish density variants (compact, default, spacious) as mode-level token overrides that cascade through the token tiers correctly. Density modes are defined as new token mode files alongside dark and high-contrast modes.

### Key Entities

- **Core Primitive Token**: A foundational design value with no semantic meaning (e.g., a specific color hex value, a spacing value in rem). These are the raw building blocks.
- **Semantic Token**: A purpose-driven alias that references a core primitive and conveys intent (e.g., "primary color", "body font size", "component gap"). These form the main theming surface.
- **Type Token**: A category-level token that groups shared styling for a family of related components. The six type categories are: **form-controls** (Input, Select, Checkbox, Radio, Textarea, Switch), **overlays** (Dialog, Popover, Dropdown, Tooltip), **navigation** (Tabs, Breadcrumb, Pagination, Nav), **feedback** (Alert, Badge, Toast, Progress), **containers** (Card, Accordion, Table), and **actions** (Button, Link, IconButton).
- **Size Token**: A scale-indexed token that defines sizing dimensions (padding, height, font size, gap) for a specific size variant (sm, md, lg), consumed by components via their size prop.
- **Component Token**: A token scoped to a single component, referencing a type or semantic token by default but directly overridable by consumers. Serves as both the internal default and the public override point — no separate modification namespace exists. May target specific sub-elements of the component (e.g., trigger, content, label). Named with a predictable pattern so consumers can discover overrides without deep documentation.

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Customizability**: The primary driver — how easily can consumers override any visual property at any level of specificity (theme-wide, category-wide, component-specific, element-specific)?
- **Performance**: Token resolution must not add meaningful runtime overhead. The system should resolve at cascade/parse time, not at runtime via JavaScript.
- **Maintainability**: How much overhead does the token system add for design system maintainers when creating or updating components?
- **Compatibility**: How well does the approach integrate with the existing Light DOM architecture, CSS layers, and DTCG token build pipeline?
- **Discoverability**: Can consumers find and understand available override points without reading extensive documentation?

### Approach A: Spectrum-Style Three-Layer CSS Variable Fallback

Each component defines internal default tokens, exposes a public modification layer (e.g., `--mod-button-*`), and supports an accessibility override layer. Component CSS uses a three-deep `var()` fallback chain: `var(--mod-button-bg, var(--ds-button-bg, var(--ds-color-primary-default)))`.

**Pros**:
- Maximum override flexibility — consumers can target any property on any sub-element via the `--mod-*` layer
- Clean separation between internal defaults and public API
- Well-proven at scale (Adobe Spectrum CSS has 80+ components using this pattern)
- No JavaScript runtime cost — pure CSS custom property resolution

**Cons**:
- Verbose CSS — every property needs a three-level fallback chain, significantly increasing stylesheet size
- High cognitive overhead for maintainers who must wire up three variable layers per property per sub-element
- The `--mod-*` namespace adds a large number of CSS custom properties to the global scope
- Requires comprehensive documentation of all `--mod-*` tokens per component for consumer discovery

### Approach B: Definition-Chain Token Resolution

Token tiering is expressed through definition chains in `@layer tokens` (e.g., `--ds-button-bg: var(--ds-action-bg)` and `--ds-action-bg: var(--ds-color-primary-default)`). Component CSS uses simple single-token references: `var(--ds-button-bg)`. Consumers override by redefining `--ds-button-bg`. No separate modification namespace — the component token itself is the public API.

**Pros**:
- Cleanest component CSS — single `var()` per property, no fallback nesting
- Fewer total CSS custom properties (no separate `--mod-*` namespace)
- The component token name is both the internal default and the consumer override point, reducing naming confusion
- Easier for maintainers — each property needs one component token that defaults to a type/semantic token in the definitions layer
- Aligns with how the existing system already works (Dialog component already uses `--ds-dialog-*` tokens)

**Cons**:
- No separate accessibility override layer (can be handled via the existing `high-contrast` CSS layer instead)
- Slightly less explicit separation between "internal" and "public" tokens — all component tokens are implicitly public
- Consumers override the same variable that the component defines, which could cause confusion if a consumer accidentally uses the internal default value pattern

### Approach C: Utility-Class-Only Customization (shadcn/Catalyst Style)

Components expose customization purely through CSS class composition and utility classes. No component-level tokens — consumers override by applying utility classes or modifying component source.

**Pros**:
- Zero token overhead — no additional CSS custom properties beyond the existing semantic tokens
- Familiar to Tailwind/shadcn users
- Simple mental model: "just add classes"

**Cons**:
- Incompatible with the existing Web Component architecture — Light DOM BEM classes cannot easily be overridden by utility classes without specificity conflicts
- No programmatic theming — consumers cannot change a component's appearance by setting a single variable
- Loses the cascading tier benefit where a semantic change automatically flows to all components
- Does not meet the requirement for per-sub-element customization without exposing internal DOM structure

### Recommendation

**Recommended: Approach B — Definition-Chain Token Resolution**

Approach B provides the best balance across all evaluation criteria:

1. **Customizability**: Consumers get full override capability at every tier (semantic, type, size, component, sub-element) through a predictable `--ds-{component}-{element}-{property}` naming convention. Token chains are expressed in `@layer tokens` definitions (`--ds-button-bg: var(--ds-action-bg)`), keeping component CSS clean with single-token references (`var(--ds-button-bg)`).

2. **Performance**: Pure CSS custom property resolution with no JavaScript overhead. Single `var()` in component CSS is more performant than nested fallback chains at scale.

3. **Compatibility**: Aligns perfectly with the existing system — the Dialog component already uses this exact pattern (`--ds-dialog-backdrop-color`, `--ds-dialog-content-bg`). The existing `--ds-*` namespace, CSS layer architecture, and DTCG build pipeline all support this approach without modification.

4. **Maintainability**: Lower overhead than Approach A (one token per property vs. three), while providing far more flexibility than Approach C. The pattern is already proven in the codebase.

5. **Discoverability**: A consistent naming convention (`--ds-{component}-{property}` for simple components, `--ds-{component}-{element}-{property}` for compound components) makes tokens predictable and discoverable.

The accessibility override concern from dropping Approach A's third layer is fully addressed by the existing `high-contrast` CSS layer, which already handles accessibility mode overrides at the appropriate cascade level.

## Assumptions

- shadcn/ui is the primary visual reference for layout, spacing, and border radii. The color palette diverges from shadcn's defaults: blue primary accent (not dark gray), teal success (not green), and warm vermillion destructive (not red) — the latter two chosen for color-blind accessibility. Geist is the default typeface. The aesthetic is adapted to work within the existing CSS custom property and CSS layer architecture rather than adopting Tailwind utility classes.
- Type tokens will be created for six defined categories: form-controls, overlays, navigation, feedback, containers, and actions. Each component belongs to exactly one category.
- Every existing component will receive dedicated component-level tokens with per-sub-element override points as part of this feature. Components still reference type-level tokens as their defaults, but each component exposes its own named tokens so consumers can override any component independently from day one.
- The existing `--ds-*` prefix will be used for all new tokens. No separate `--mod-*` or other namespace is introduced.
- Size tokens will align with the existing size scale (sm, md, lg) and integrate with the existing density system (compact, default, spacious).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of component style values are derived from tokens — zero hardcoded color, spacing, typography, border, shadow, or radius values exist in any component stylesheet.
- **SC-002**: A consumer can change the entire color scheme of all components by overriding fewer than 15 semantic color tokens.
- **SC-003**: A consumer can restyle any identifiable sub-element of any compound component by overriding a single, predictably-named token per visual property.
- **SC-004**: All component-level tokens resolve to sensible visual defaults when no consumer overrides are present, producing a polished, cohesive appearance out of the box.
- **SC-005**: The token system supports at least 4 tiers (core → semantic → type → component) with correct cascade precedence verified across all components.
- **SC-006**: Adding a new component to the system with full token integration can be completed by a maintainer following the documented guidelines in under 2 hours, without requiring changes to the token build pipeline.
- **SC-007**: Consumer overrides applied at the component-level tier survive design system version upgrades without breaking, as verified by an upgrade compatibility test.
- **SC-008**: The visual defaults of components match the shadcn/ui aesthetic (neutral/muted palette, medium radii, clean typography) as validated by manual visual comparison of key components (Button, Input, Select, Card, Dialog, Tabs) against shadcn reference screenshots, with intentional divergences (blue primary, Geist font, teal/vermillion colors) documented.

## Clarifications

### Session 2026-03-07

- Q: When Radix Themes, shadcn/ui, and Tailwind Catalyst disagree visually, which is the primary influence? → A: shadcn/ui is the primary visual baseline.
- Q: Which components should receive dedicated component-level tokens in this feature? → A: All existing components — every component gets dedicated tokens immediately.
- Q: Should "Component Token" and "Modification Token" be the same concept or distinct entities? → A: Merge into one — "Component Token" is both the default and the consumer override point.
- Q: What are the complete set of type token categories? → A: Six categories: form-controls, overlays, navigation, feedback, containers, actions.
- Q: What should the default primary/accent color be? → A: Blue (not shadcn's dark gray).
- Q: What typeface should be the default? → A: Geist (sans) and Geist Mono (mono).
- Q: How should success and destructive colors handle color blindness? → A: Teal success (hue 185) and warm vermillion destructive (hue 35) — 150° separation for color-blind safety.
