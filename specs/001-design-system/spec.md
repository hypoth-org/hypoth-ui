# Feature Specification: White-Label Design System Monorepo

**Feature Branch**: `001-design-system`
**Created**: 2026-01-01
**Status**: Draft
**Input**: Build a reusable design system with token-driven theming, Web Components, Next.js integration, and white-label documentation

## Clarifications

### Session 2026-01-01

- Q: What npm scope should packages use? → A: `@ds` - generic scope for maximum rebranding flexibility

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Token-Driven Theme Consumption (Priority: P1)

A developer at a company adopting the design system wants to apply their brand's visual identity without modifying component source code. They configure brand tokens (colors, typography, spacing) and mode tokens (light/dark/high-contrast), then see all components automatically reflect their brand.

**Why this priority**: Token-driven theming is the foundational capability that enables multi-brand adoption. Without this, companies cannot customize the design system for their brand, making adoption impossible.

**Independent Test**: Can be fully tested by creating a custom token file, importing it, and verifying that a rendered component reflects the custom values for colors, typography, and spacing in both light and dark modes.

**Acceptance Scenarios**:

1. **Given** a developer has a custom brand token file, **When** they import it alongside the design system CSS, **Then** all components render using the custom brand colors, typography, and spacing values
2. **Given** a user's system preference is set to dark mode, **When** a page loads with the design system, **Then** components automatically render in dark mode using the appropriate mode tokens
3. **Given** a developer wants to support high-contrast mode, **When** they enable the high-contrast token set, **Then** all components meet enhanced contrast requirements

---

### User Story 2 - Web Component Integration (Priority: P2)

A developer wants to use design system components in their application regardless of their framework choice. They import the Web Components package and use standard HTML custom elements that work in any environment (vanilla HTML, Vue, Angular, Svelte, or React).

**Why this priority**: Web Components provide the framework-agnostic foundation. This must work before framework-specific adapters can be built on top.

**Independent Test**: Can be fully tested by creating a vanilla HTML page, importing the Web Components bundle, and using custom elements with attributes, properties, and event listeners.

**Acceptance Scenarios**:

1. **Given** a vanilla HTML page, **When** a developer imports the Web Components bundle and adds a `<ds-button>` element, **Then** the button renders with correct styling and responds to click events
2. **Given** a Web Component is rendered, **When** a developer inspects the DOM, **Then** the component uses Light DOM (no Shadow DOM) and can be styled with external CSS
3. **Given** design tokens are loaded, **When** a Web Component renders, **Then** it consumes token values via CSS custom properties

---

### User Story 3 - Next.js App Router Integration (Priority: P3)

A Next.js developer wants to use the design system with the App Router while maintaining optimal performance. They import a single client-side loader at the app root that registers all custom elements, then use components throughout their app (including Server Components) with minimal client-side JavaScript.

**Why this priority**: Next.js is a primary target framework. Proper App Router integration with minimal client boundaries is critical for performance and adoption by the React/Next.js community.

**Independent Test**: Can be fully tested by creating a Next.js App Router project, adding the loader to the root layout, and using design system components in both Server and Client components while verifying hydration works correctly.

**Acceptance Scenarios**:

1. **Given** a Next.js App Router project, **When** a developer adds the design system loader to their root layout as a Client Component, **Then** custom elements are registered once and available throughout the application
2. **Given** a Server Component renders a design system custom element, **When** the page loads, **Then** the HTML streams immediately and the component hydrates on the client without blocking initial render
3. **Given** multiple pages use design system components, **When** navigating between pages, **Then** custom elements are not re-registered (single registration at root)

---

### User Story 4 - Tenant-Filtered Documentation (Priority: P4)

A company using the design system wants to provide their own branded documentation site that only shows components they've licensed or approved for internal use. They configure a tenant edition file that specifies which components and docs sections to include, then generate a documentation site that reflects only their approved content.

**Why this priority**: White-label documentation enables enterprise adoption where companies need controlled, branded experiences for their developers.

**Independent Test**: Can be fully tested by creating two tenant config files with different component visibility settings, generating docs for each, and verifying the navigation and component pages differ based on configuration.

**Acceptance Scenarios**:

1. **Given** a tenant config that excludes the "DataGrid" component, **When** the docs site is generated, **Then** DataGrid does not appear in navigation or search results
2. **Given** a tenant config with "enterprise" availability tag, **When** the docs site is generated, **Then** only components tagged as "public" or "enterprise" appear (not "internal-only" components)
3. **Given** base docs content and a tenant overlay with custom "Getting Started" content, **When** the docs site is generated, **Then** the tenant's custom content replaces the base content for that section

---

### User Story 5 - Component Development Workflow (Priority: P5)

A design system contributor wants to add a new component to the library. They create the component following established patterns, add required metadata to the manifest, write documentation in MDX format, and the component automatically appears in the docs site with proper categorization.

**Why this priority**: Sustainable growth of the design system requires a clear, repeatable process for adding components with proper documentation and metadata.

**Independent Test**: Can be fully tested by following the component creation guide to add a minimal new component, verifying the manifest is valid, and confirming the component appears correctly in the generated docs.

**Acceptance Scenarios**:

1. **Given** a developer creates a new Web Component with proper manifest entry, **When** the docs pipeline runs, **Then** the component appears in the correct navigation category with status badge (alpha/beta/stable)
2. **Given** a component has MDX documentation with frontmatter, **When** the docs site renders the component page, **Then** it displays usage examples, API documentation, and accessibility notes
3. **Given** a component manifest is invalid (missing required fields), **When** the build runs, **Then** validation fails with clear error messages identifying missing fields

---

### Edge Cases

- What happens when a tenant config references a component that doesn't exist? The docs pipeline warns but does not fail, skipping the unknown component.
- How does the system handle conflicting token values between brand and mode tokens? Mode tokens take precedence for color-related properties; brand tokens define the base palette.
- What happens when a Web Component is used before the loader registers it? The custom element renders as an empty/unstyled element until registration completes; no JavaScript errors thrown.
- How does the system handle missing or invalid DTCG token files? Build fails with clear error message identifying the issue; no silent fallbacks to defaults.

## Requirements *(mandatory)*

### Functional Requirements

**Foundation Layer (Zero Runtime Dependencies)**

- **FR-001**: System MUST provide a tokens package that outputs CSS custom properties and TypeScript constants from DTCG-format JSON source files
- **FR-002**: System MUST provide a CSS package with layered styles (`@layer reset, tokens, base, components, utilities, overrides`) that consume token values via CSS custom properties
- **FR-003**: System MUST provide a DOM primitives package with framework-agnostic accessibility and behavior utilities (focus management, keyboard navigation, ARIA helpers)

**Component Layer**

- **FR-004**: System MUST provide Web Components built with Lit that use Light DOM by default (no Shadow DOM) and consume theme via CSS custom properties
- **FR-005**: Web Components MUST support theming entirely through CSS variables and CSS layer overrides without requiring JavaScript configuration
- **FR-006**: Each component MUST expose a stable public API of attributes, properties, events, and CSS custom properties

**Adapter Layer**

- **FR-007**: System MUST provide React wrapper components that forward props and normalize events from custom elements
- **FR-008**: React wrappers MUST NOT support polymorphic `as` prop; composition patterns preferred
- **FR-009**: System MUST provide a Next.js integration package with a single client-side loader pattern for custom element registration
- **FR-010**: Next.js integration MUST support streaming SSR and App Router with minimal client boundaries

**Documentation Layer**

- **FR-011**: System MUST provide a docs-core library that ingests component manifests, parses MDX frontmatter, and generates navigation structures
- **FR-012**: System MUST support edition/tenant filtering where a configuration file determines which components and sections appear in generated documentation
- **FR-013**: Docs content MUST be portable Markdown/MDX with frontmatter metadata, independent of rendering framework
- **FR-014**: System MUST provide at least one docs renderer (Next.js-based) that consumes docs-core and content packs
- **FR-015**: Docs architecture MUST allow future renderers (Astro, Docusaurus) without modifying content packs

**Component Manifest**

- **FR-016**: Every component MUST have a manifest entry with: id, name, status, availabilityTags, platforms, a11y info, tokensUsed, recommendedUsage, and antiPatterns
- **FR-017**: Component manifests MUST be machine-readable JSON and validated at build time
- **FR-018**: Manifest validation MUST fail the build if required fields are missing or invalid

**Multi-Brand/Multi-Mode Theming**

- **FR-019**: System MUST support brand switching by loading different token files without code changes
- **FR-020**: System MUST support multiple modes (light, dark, high-contrast, reduced-motion) as first-class token sets
- **FR-021**: Mode switching MUST respect user system preferences via CSS media queries by default

### Key Entities

- **Design Token**: A named value (color, spacing, typography, etc.) in DTCG format with `$value`, `$type`, and optional `$description`. Organized hierarchically (e.g., `color.action.primary`).
- **Component Manifest**: Machine-readable metadata for a component including identity, status, availability, platform support, accessibility details, and usage guidance.
- **Tenant/Edition Config**: Configuration defining which components and documentation sections are visible for a specific deployment or customer.
- **Content Pack**: A collection of MDX documentation files with frontmatter metadata, organized by component and topic, independent of rendering framework.
- **Package Scope**: All packages use the `@ds` npm scope (e.g., `@ds/tokens`, `@ds/wc`). This generic scope is intentional to support white-labeling—adopting organizations can republish under their own scope without source changes.

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Zero Runtime Dependencies for Core**: Foundation packages must have no runtime dependencies to ensure minimal bundle impact and maximum portability (Constitution: Performance First)
- **SSR/Streaming Compatibility**: Architecture must support server-side rendering and streaming without blocking or hydration issues (Constitution: Performance First)
- **Light DOM for Global Styling**: Components must be stylable with external CSS for maximum customizability (Constitution: Customizability)
- **Accessibility Built-In**: Architecture must enable WCAG 2.1 AA compliance with clear patterns for keyboard navigation and ARIA (Constitution: Accessibility)
- **Framework Agnosticism**: Core components must work in any framework while supporting optimized adapters for popular frameworks

### Approach A: Shadow DOM Web Components with CSS Part Exposure

Use Shadow DOM for encapsulation and expose styling hooks via `::part()` selectors and CSS custom properties. Each component owns its styles completely.

**Pros**:
- Strong style encapsulation prevents accidental CSS conflicts
- Browser-native scoping requires no build tooling
- Consistent rendering regardless of host page styles

**Cons**:
- `::part()` has limited browser support and cannot target nested elements
- Global theme application requires explicit property forwarding through shadow boundaries
- Makes it harder for consumers to customize components beyond exposed parts
- Accessibility tools sometimes have issues with shadow DOM boundaries

### Approach B: Light DOM Web Components with CSS Layers

Use Light DOM (no Shadow DOM) with CSS `@layer` for cascade control. Components render directly into the document and rely on CSS layers for predictable specificity.

**Pros**:
- Full CSS customization capability—consumers can style any element
- CSS layers provide deterministic cascade without `!important` wars
- Better accessibility tool support with standard DOM
- Simpler debugging with visible DOM structure
- Token-based theming works naturally via CSS custom properties

**Cons**:
- No automatic style isolation; requires disciplined CSS architecture
- Component styles could theoretically be overridden accidentally (mitigated by layers)
- Slightly more CSS architecture discipline required from consumers

### Approach C: Hybrid (Shadow DOM Optional, Light DOM Default)

Default to Light DOM but allow opt-in Shadow DOM for specific components that benefit from encapsulation (e.g., third-party embed widgets).

**Pros**:
- Flexibility to use the right approach per component
- Can use Shadow DOM where encapsulation truly matters

**Cons**:
- Inconsistent mental model for consumers
- More complex testing matrix
- Documentation must cover both patterns
- Token theming patterns differ between the two modes

### Recommendation

**Recommended: Approach B (Light DOM with CSS Layers)**

This approach best aligns with the constitution principles:

1. **Performance**: Light DOM has no shadow boundary overhead; CSS layers are native and zero-runtime
2. **Customizability**: Full CSS access means consumers can customize anything; CSS layers provide the override mechanism without specificity conflicts
3. **Accessibility**: Standard DOM structure works best with assistive technologies

The trade-off of requiring CSS discipline is acceptable because:
- The design system provides the CSS layer structure; consumers just use it
- Component class naming conventions (BEM or similar) prevent accidental conflicts
- The override layer (`@layer overrides`) gives consumers a clear, designated place for customizations

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can apply a complete custom brand theme (colors, typography, spacing) by providing a single token configuration file, with changes reflected across all components within 5 minutes of setup
- **SC-002**: Web Components render correctly in at least 4 different environments (vanilla HTML, React, Vue, Angular) without framework-specific modifications to the component code
- **SC-003**: A Next.js App Router application using the design system achieves a Lighthouse Performance score of 90+ with components rendering in under 100ms on initial page load
- **SC-004**: Documentation site generation completes in under 30 seconds for a library of 50+ components
- **SC-005**: Tenant-filtered documentation correctly hides/shows components based on configuration with 100% accuracy (no leakage of restricted components)
- **SC-006**: New component addition (from creation to appearing in docs) can be completed by a developer in under 2 hours following the documented workflow
- **SC-007**: All components pass automated accessibility testing (axe-core) with zero violations at WCAG 2.1 AA level
- **SC-008**: The combined size of foundation packages (@ds/tokens + @ds/css + @ds/primitives-dom) is under 15KB gzipped
