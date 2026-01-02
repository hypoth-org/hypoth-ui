# Feature Specification: CSS Layered Output System

**Feature Branch**: `004-css-layers`
**Created**: 2026-01-01
**Status**: Draft
**Input**: User description: "Provide consistent baseline styling that works across Web Components (Light DOM), plain HTML recipes, and Next.js apps. Easily overridable without specificity wars. Define CSS layer order and files: reset, tokens, base, components, utilities, overrides. Define override guidance for tenants and apps, and ensure compatibility with docs renderer styling. Implement @ds/css layered output, create docs styling guidelines page, create demo showing tenant override layer working."

## Clarifications

### Session 2026-01-01

- Q: What is the minimum browser support target for CSS layers? → A: Evergreen browsers only (no IE11, no legacy fallbacks)
- Q: What is the scope of the utilities layer? → A: Minimal token-based utilities (spacing, colors, display, text-align only)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent Baseline Styling Across Platforms (Priority: P1)

A developer using the design system wants consistent baseline styling whether they're building a Web Component, writing plain HTML recipes, or working in a Next.js app. They import a single CSS file that provides predictable styling without conflicting with their app's existing styles or creating specificity issues.

**Why this priority**: This is the foundational use case - consistent baseline styling enables all other styling capabilities. Without predictable, non-conflicting base styles, developers cannot reliably build on the design system.

**Independent Test**: Can be fully tested by creating three minimal projects (vanilla HTML, Web Component, Next.js) that each import the CSS package, and verifying that identical HTML renders identically across all three environments with no style conflicts.

**Acceptance Scenarios**:

1. **Given** a vanilla HTML page imports `@ds/css`, **When** the page renders with basic elements (headings, paragraphs, lists, buttons), **Then** all elements have consistent typography, spacing, and colors matching design tokens.

2. **Given** a Light DOM Web Component uses design system base styles, **When** the component renders inside a host page, **Then** the component inherits baseline styles correctly without requiring Shadow DOM encapsulation.

3. **Given** a Next.js app imports `@ds/css` in its root layout, **When** pages render via SSR, **Then** styles are applied immediately without flash of unstyled content (FOUC).

---

### User Story 2 - Override Styles Without Specificity Conflicts (Priority: P1)

A developer needs to customize component appearance for their application without fighting CSS specificity. They write their overrides in the designated `overrides` layer and their styles take precedence predictably, without needing `!important` or artificially increasing selector specificity.

**Why this priority**: Overridability is equally critical to baseline styling - developers must be able to customize without "specificity wars" or resorting to anti-patterns like `!important`.

**Independent Test**: Can be fully tested by writing a component override with the same selector specificity as the base style, placing it in the `overrides` layer, and verifying the override takes precedence.

**Acceptance Scenarios**:

1. **Given** a button has base styles in the `components` layer, **When** a developer writes `.ds-button { background: red; }` in the `overrides` layer, **Then** the button renders with red background regardless of selector order in the file.

2. **Given** an application has conflicting global styles, **When** those styles are not in a layer, **Then** they do not override design system layered styles (unlayered styles cascade after layers but with lower specificity within the layer system).

3. **Given** a developer inspects an element in DevTools, **When** viewing the CSS cascade, **Then** they can clearly see which layer each rule belongs to and why overrides win.

---

### User Story 3 - Tenant-Branded Styling (Priority: P2)

A tenant (white-label customer) wants to apply their brand identity to the design system components. They provide a tenant override stylesheet that customizes colors, typography, and spacing while keeping all other design system functionality intact.

**Why this priority**: Tenant customization enables white-label adoption. This builds on P1 override capabilities but specifically addresses the multi-tenant use case.

**Independent Test**: Can be fully tested by creating a "tenant-acme" stylesheet, loading it after the base design system CSS, and verifying that tenant-specific colors/fonts/spacing appear on all components.

**Acceptance Scenarios**:

1. **Given** a tenant stylesheet defines `--ds-color-primary-default: #ff5500` in the `overrides` layer, **When** any component using that token renders, **Then** the component uses the tenant's orange color instead of the default blue.

2. **Given** a tenant wants to customize only button styling, **When** they add button-specific rules to their tenant stylesheet, **Then** only buttons are affected and all other components retain default styling.

3. **Given** the base design system CSS is updated, **When** a tenant re-deploys with the update, **Then** their tenant overrides continue to work without modification (API stability).

---

### User Story 4 - Documentation Rendering Integration (Priority: P2)

A documentation author wants the docs site to use the design system's CSS layers for consistent styling. The docs renderer imports the design system CSS and adds docs-specific styling in the appropriate layers without conflicting with component demos.

**Why this priority**: The docs site is a primary showcase for the design system. It must demonstrate best practices for CSS layer usage and render component demos accurately.

**Independent Test**: Can be fully tested by running the docs site, viewing a component demo, and verifying that both the docs chrome (navigation, layout) and the demo component use layered styles without conflicts.

**Acceptance Scenarios**:

1. **Given** the docs renderer imports `@ds/css`, **When** a component demo renders on the page, **Then** the demo component uses the same styles it would in a consumer application.

2. **Given** the docs site needs custom layout styles, **When** docs-specific CSS is placed in the `overrides` layer, **Then** layout works correctly without affecting component demos.

3. **Given** the docs site demonstrates light and dark modes, **When** the mode is toggled, **Then** both docs chrome and component demos switch modes consistently.

---

### User Story 5 - Documentation of Styling Guidelines (Priority: P3)

A developer onboarding to the design system wants to understand how to properly use CSS layers for customization. They read the styling guidelines documentation page that explains layer order, when to use each layer, and common customization patterns.

**Why this priority**: Documentation ensures sustainable adoption. Developers need guidance to use the system correctly without creating technical debt.

**Independent Test**: Can be fully tested by following the documentation to implement a custom theme, and verifying the instructions are accurate and complete.

**Acceptance Scenarios**:

1. **Given** a developer reads the styling guidelines page, **When** they follow the tenant override example, **Then** their overrides work as described without additional troubleshooting.

2. **Given** the documentation explains each layer's purpose, **When** a developer needs to add custom styles, **Then** they can determine the correct layer based on the documentation.

3. **Given** the documentation includes code examples, **When** a developer copies an example, **Then** it works in their project with minimal modification.

---

### Edge Cases

- What happens when a developer imports `@ds/css` multiple times (e.g., in both a component and the app root)?
  - Layer declarations are idempotent; duplicate imports are harmless and the layer order is maintained.

- How does the system handle CSS loaded from a CDN vs. bundled with the application?
  - Layer order is determined by the `@layer` declaration, not import order. CDN-loaded CSS works correctly if it declares the same layer structure.

- What happens when unlayered third-party CSS conflicts with design system styles?
  - Unlayered styles have implicit lower priority than layered styles within the same specificity. Documentation explains this behavior and mitigation strategies.

- How does reduced-motion mode interact with animation styles in the base layer?
  - The reset layer includes `prefers-reduced-motion` media query that disables animations globally. Component-specific motion is handled via mode tokens.

## Requirements *(mandatory)*

### Functional Requirements

**Layer Structure**

- **FR-001**: System MUST define CSS layer order as: `reset, tokens, base, components, utilities, overrides` (lowest to highest precedence).
- **FR-002**: System MUST provide a single entry point CSS file (`@ds/css`) that imports all layer definitions in correct order.
- **FR-003**: Each layer MUST be importable independently for advanced use cases (e.g., `@ds/css/layers/reset`).

**Layer Contents**

- **FR-004**: The `reset` layer MUST contain CSS reset rules that normalize browser defaults (box-sizing, margin reset, reduced-motion handling).
- **FR-005**: The `tokens` layer MUST import compiled design token CSS custom properties from `@ds/tokens`.
- **FR-006**: The `base` layer MUST contain semantic HTML element styles (typography, links, lists, code blocks) that consume design tokens.
- **FR-007**: The `components` layer MUST contain design system component styles (button, input, card, etc.) with class-based selectors.
- **FR-008**: The `utilities` layer MUST contain a minimal set of token-based utility classes limited to: spacing (margin/padding using token values), colors (text/background using token values), display (block, flex, grid, hidden), and text-align (left, center, right).
- **FR-009**: The `overrides` layer MUST be empty in the base package, reserved for consumer and tenant customizations.

**Override Mechanism**

- **FR-010**: Consumer applications MUST be able to add styles to the `overrides` layer that take precedence over `components` layer styles.
- **FR-011**: Tenant stylesheets MUST be loadable after the base CSS to customize token values and component styles.
- **FR-012**: System MUST NOT require `!important` declarations for consumer overrides to work correctly.

**Platform Compatibility**

- **FR-013**: CSS output MUST work in Light DOM Web Components without modification.
- **FR-014**: CSS output MUST work in vanilla HTML pages without a build step (CDN-loadable).
- **FR-015**: CSS output MUST work with Next.js SSR without flash of unstyled content.
- **FR-016**: CSS output MUST be compatible with CSS Modules and CSS-in-JS coexistence.
- **FR-016a**: CSS output targets evergreen browsers only (Chrome 99+, Firefox 97+, Safari 15.4+, Edge 99+); no IE11 support or legacy fallbacks required.

**Documentation Integration**

- **FR-017**: The docs renderer MUST import `@ds/css` as its base styling.
- **FR-018**: Docs-specific styles MUST be placed in the `overrides` layer to avoid demo conflicts.
- **FR-019**: Component demos in docs MUST render identically to how they would in a consumer app.

**Styling Guidelines Documentation**

- **FR-020**: Documentation MUST include a "Styling Guidelines" page explaining CSS layer architecture.
- **FR-021**: Documentation MUST provide examples for common customization scenarios (tenant theming, component overrides, dark mode).
- **FR-022**: Documentation MUST explain the cascade behavior of layered vs. unlayered styles.

**Demo Application**

- **FR-023**: Demo app MUST demonstrate tenant override capabilities with a working example.
- **FR-024**: Demo app MUST show mode switching (light/dark) working with tenant overrides.
- **FR-025**: Demo app MUST include controls to toggle between "default" and "tenant-acme" branding.

### Key Entities

- **CSS Layer**: A named cascade layer (`@layer`) that groups related styles and establishes precedence order. Higher layers override lower layers regardless of selector specificity.

- **Token Layer**: The CSS layer containing design token custom properties. Tokens are consumed by other layers via `var(--token-name)`.

- **Override Layer**: The highest-precedence layer reserved for consumer and tenant customizations. Empty in the base package.

- **Tenant Stylesheet**: A CSS file provided by a white-label customer that customizes the design system for their brand. Loaded after the base CSS.

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Predictability**: Developers must be able to reason about style precedence without deep CSS knowledge.
- **Performance**: Layer system must not add runtime overhead or significantly increase bundle size.
- **Debuggability**: DevTools must clearly show layer membership and cascade reasoning.
- **Compatibility**: Must work with existing CSS tooling (PostCSS, Tailwind coexistence, CSS Modules).

### Approach A: Standard CSS Layers with Import Structure

Use native CSS `@layer` declarations with a structured import system. Each layer is a separate CSS file imported with `@import ... layer(name)`.

**Pros**:
- Native browser feature, no build tooling required
- Excellent DevTools support showing layer membership
- Works with any bundler or CDN distribution
- Future-proof as CSS layers are now widely supported (95%+ browser coverage)

**Cons**:
- Requires PostCSS or bundler for `@import` flattening in production
- Layer declarations must appear before any non-layered styles
- Learning curve for developers unfamiliar with CSS layers

### Approach B: PostCSS Plugin with Virtual Layers

Use a PostCSS plugin to process traditional CSS files and wrap them in appropriate layers at build time. Developers write regular CSS and configure layer membership externally.

**Pros**:
- Familiar authoring experience (regular CSS files)
- No need to understand layer syntax when writing styles
- Build-time optimization possible

**Cons**:
- Requires specific build tooling (PostCSS)
- Layer assignment is invisible in source files
- Harder to debug when layers are added programmatically
- CDN distribution requires pre-built output

### Approach C: CSS-in-JS Layer Wrapper

Use a CSS-in-JS solution with layer wrappers that inject styles into the correct layer at runtime.

**Pros**:
- Works with dynamic styling use cases
- Familiar to React/styled-components users
- Can coordinate with JavaScript state

**Cons**:
- Runtime overhead for style injection
- Breaks SSR benefits (FOUC risk)
- Incompatible with "zero runtime" design principle
- Harder to cache and CDN-distribute

### Recommendation

**Recommended: Approach A (Standard CSS Layers with Import Structure)**

This approach best aligns with the design system principles:

1. **Performance**: Native CSS layers have zero runtime overhead. The browser handles precedence at parse time with no JavaScript required.

2. **Accessibility**: No runtime style injection means styles are available immediately for screen readers and other assistive technologies parsing the initial DOM.

3. **Customizability**: Standard CSS syntax is universally understood. Any developer with CSS knowledge can write overrides. DevTools clearly show layer membership for debugging.

4. **Compatibility**: Works with any framework, any bundler, and CDN distribution. PostCSS can flatten imports for production but isn't strictly required.

The trade-off of requiring developer education on CSS layers is acceptable because:
- CSS layers are a standard feature with broad browser support
- The learning curve is low (just understanding `@layer` precedence)
- DevTools make the cascade visible and debuggable
- Documentation can effectively teach the concepts

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Identical HTML markup renders with identical styling in vanilla HTML, Light DOM Web Component, and Next.js environments (pixel-perfect across all three).
- **SC-002**: Consumer overrides in the `overrides` layer take precedence over base styles 100% of the time without `!important` usage.
- **SC-003**: Tenant stylesheet loading adds less than 5KB gzipped to the total CSS bundle size for a typical branding customization.
- **SC-004**: DevTools inspection shows clear layer membership for all design system styles (layers visible in Styles panel).
- **SC-005**: Complete styling guidelines documentation page is published and covers layer structure, override patterns, and tenant customization with code examples.
- **SC-006**: Demo app successfully demonstrates switching between default and tenant branding with a visible toggle control.
- **SC-007**: Docs renderer component demos render identically to standalone component usage (verified by visual regression testing).
- **SC-008**: CSS bundle with all layers is under 20KB gzipped (excluding utilities layer which may be tree-shaken).
