# Feature Specification: DTCG Token-Driven Theming

**Feature Branch**: `003-dtcg-token-theming`
**Created**: 2026-01-01
**Status**: Draft
**Input**: User description: "Enable token-driven theming with multi-brand and multi-mode. Tokens must drive both runtime theming via CSS variables and documentation (tokensUsed per component + token reference pages). Implement DTCG token pipeline that outputs CSS variables (scoped by data-brand and data-mode), JSON bundle for tooling, and TypeScript types."

## Clarifications

### Session 2026-01-01

- Q: When a component references a token not overridden by the current brand, what should happen? → A: Cascade fallback: brand-mode → brand-base → global-mode → global-base
- Q: What top-level semantic token categories should be standardized? → A: Expanded set: `color`, `typography`, `spacing`, `sizing`, `border`, `shadow`, `motion`, `opacity`, `z-index`, `breakpoint`, `icon`, `radius`
- Q: Must every deployment specify a brand, or is there an implicit default? → A: Implicit "default" brand applies when `data-brand` is absent or empty

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Component Author Applies Design Tokens (Priority: P1)

A component author building a web component needs to use design tokens for styling. They declare which tokens their component uses (e.g., `color.background.primary`, `spacing.md`) and the component automatically receives the correct values based on the active brand and mode (light/dark/high-contrast).

**Why this priority**: This is the foundational use case - without token consumption by components, no other theming capability has value. Components are the primary consumers of tokens.

**Independent Test**: Can be fully tested by creating a component with `tokensUsed` declaration, applying tokens via CSS custom properties, and verifying styles change when brand/mode attributes change on the document.

**Acceptance Scenarios**:

1. **Given** a component declares `tokensUsed: ["color.background.primary", "spacing.md"]` in its manifest, **When** the component is rendered, **Then** those tokens are available as CSS custom properties within the component's scope.

2. **Given** a page has `data-brand="acme"` and `data-mode="dark"`, **When** a component uses `var(--color-background-primary)`, **Then** the value resolves to Acme's dark mode background color.

3. **Given** a component uses a token that doesn't exist, **When** the build runs, **Then** a warning is emitted listing the unknown token reference.

---

### User Story 2 - Design System Maintainer Defines Brand Tokens (Priority: P1)

A design system maintainer needs to define a complete set of design tokens for a brand, including semantic tokens (like `color.text.primary`) that reference primitive tokens (like `color.blue.500`). They author tokens in DTCG format and the pipeline compiles them to CSS, JSON, and TypeScript outputs.

**Why this priority**: Token definition is co-equal with token consumption - you cannot consume tokens that don't exist. This enables multi-brand support.

**Independent Test**: Can be fully tested by creating a DTCG token file, running the compiler, and verifying CSS custom properties, JSON bundle, and TypeScript types are generated correctly.

**Acceptance Scenarios**:

1. **Given** a DTCG token file with primitive and semantic tokens, **When** the token compiler runs, **Then** CSS custom properties are generated with correct scoping (e.g., `[data-brand="acme"][data-mode="light"]`).

2. **Given** tokens are compiled, **When** examining the JSON output, **Then** it contains the full token tree with resolved values for tooling integration.

3. **Given** tokens are compiled, **When** examining the TypeScript output, **Then** it contains type definitions for all token paths (e.g., `color.background.primary` is a valid token path).

---

### User Story 3 - Documentation Author References Component Tokens (Priority: P2)

A documentation author writing component docs wants to show which design tokens a component uses. The docs should automatically display the `tokensUsed` declaration from the component manifest and link to token reference documentation.

**Why this priority**: This enables discoverability and teaches consumers which tokens affect which components, but the theming system works without it.

**Independent Test**: Can be fully tested by viewing a component's documentation page and verifying the tokens section displays with correct token names linked to their definitions.

**Acceptance Scenarios**:

1. **Given** a component manifest declares `tokensUsed`, **When** viewing the component's documentation, **Then** a "Tokens Used" section displays listing each token with a link to its reference.

2. **Given** a token reference page exists, **When** a user clicks a token link, **Then** they navigate to that token's documentation showing its purpose, values per mode, and which components use it.

---

### User Story 4 - Theme Consumer Switches Modes at Runtime (Priority: P2)

An application consumer using the design system wants to switch between light, dark, high-contrast, and reduced-motion modes at runtime without page reload. Mode switching should be instantaneous and affect all components.

**Why this priority**: Runtime mode switching is a key differentiator for theming systems, but the core token pipeline can function with build-time mode selection.

**Independent Test**: Can be fully tested by rendering a page, toggling the `data-mode` attribute via JavaScript, and measuring that all component styles update within 100ms.

**Acceptance Scenarios**:

1. **Given** a page is in light mode, **When** JavaScript sets `document.documentElement.dataset.mode = "dark"`, **Then** all components immediately reflect dark mode tokens.

2. **Given** the user has `prefers-reduced-motion: reduce`, **When** the page loads, **Then** `data-mode` includes reduced-motion token overrides (animations disabled, transitions minimized).

3. **Given** the user has `prefers-contrast: more`, **When** the page loads, **Then** high-contrast tokens are applied automatically.

---

### User Story 5 - CI Pipeline Validates Token Changes (Priority: P3)

A design system maintainer submitting a PR that modifies tokens wants to see exactly what changed in the compiled outputs. CI should generate snapshot diffs showing CSS, JSON, and TypeScript changes for review.

**Why this priority**: Snapshot diffs catch unintended regressions but are a quality-of-life improvement rather than core functionality.

**Independent Test**: Can be fully tested by modifying a token value, running CI, and verifying a diff report shows the old vs. new compiled values.

**Acceptance Scenarios**:

1. **Given** a PR modifies `color.primary` from `#0066cc` to `#0077dd`, **When** CI runs, **Then** a snapshot diff shows the change in CSS output for all brand/mode combinations.

2. **Given** a PR adds a new token, **When** CI runs, **Then** the diff shows the new token as an addition (green) in all outputs.

3. **Given** a PR removes a token still referenced by a component, **When** CI runs, **Then** the build fails with an error identifying the orphaned reference.

---

### Edge Cases

- What happens when a component references a token that doesn't exist in the current brand?
  - The CSS custom property should fall back to an inherited or initial value; a build warning should be emitted.

- How does the system handle circular token references (A references B, B references A)?
  - The compiler should detect cycles and fail with a clear error message identifying the cycle path.

- What happens when two brands define the same token with incompatible units (e.g., one uses `px`, another uses `rem`)?
  - The compiler should emit a warning recommending consistent units; the output should still compile.

- How does reduced-motion mode interact with dark mode (two modes active)?
  - Modes are composable: `data-mode="dark reduced-motion"` applies both sets of overrides, with reduced-motion taking precedence for conflicting properties.

## Requirements *(mandatory)*

### Functional Requirements

**Token Definition**
- **FR-001**: System MUST accept DTCG-format token files as input (JSON with `$value`, `$type`, `$description` properties).
- **FR-002**: System MUST support primitive tokens (concrete values like colors, spacing) and semantic tokens (references to other tokens).
- **FR-003**: System MUST support token grouping into hierarchical namespaces (e.g., `color.background.primary`).
- **FR-004**: System MUST support three token scopes: global (shared), brand-specific, and mode-specific (light/dark/high-contrast/reduced-motion).

**Token Resolution**
- **FR-004a**: System MUST resolve tokens using cascade fallback order: brand-mode → brand-base → global-mode → global-base, ensuring components always receive a valid value.

**Token Compilation**
- **FR-005**: System MUST compile tokens to CSS custom properties scoped by `[data-brand]` and `[data-mode]` attribute selectors.
- **FR-006**: System MUST compile tokens to a JSON bundle containing the resolved token tree for tooling integration.
- **FR-007**: System MUST compile tokens to TypeScript type definitions enabling autocomplete for token paths.
- **FR-008**: System MUST detect and report circular token references during compilation.
- **FR-009**: System MUST detect and report references to undefined tokens during compilation.

**Token Consumption**
- **FR-010**: Components MUST be able to declare `tokensUsed` in their manifest, listing token paths they consume.
- **FR-011**: System MUST validate that all tokens declared in `tokensUsed` exist in the compiled token set.
- **FR-012**: Components MUST access tokens via CSS custom properties using a consistent naming convention (e.g., `--color-background-primary`).

**Runtime Theming**
- **FR-013**: System MUST support runtime mode switching by changing the `data-mode` attribute on a root element.
- **FR-014**: System MUST support runtime brand switching by changing the `data-brand` attribute on a root element.
- **FR-015**: System MUST respect user preferences for `prefers-color-scheme`, `prefers-contrast`, and `prefers-reduced-motion`.

**Documentation Integration**
- **FR-016**: System MUST generate token reference documentation consumable by docs-core.
- **FR-017**: Component documentation MUST display which tokens the component uses, derived from the manifest.
- **FR-018**: Token reference pages MUST show which components use each token.

**CI Integration**
- **FR-019**: System MUST generate deterministic outputs suitable for snapshot comparison.
- **FR-020**: CI MUST produce diff reports when token outputs change.

### Key Entities

- **Token**: A design decision encoded as a name-value pair. Has a path (e.g., `color.background.primary`), value (e.g., `#ffffff`), type (e.g., `color`), and optional description. Can reference other tokens.

- **Token Categories**: The standardized top-level semantic groups are: `color`, `typography`, `spacing`, `sizing`, `border`, `shadow`, `motion`, `opacity`, `z-index`, `breakpoint`, `icon`, `radius`. All tokens must belong to one of these categories as their first path segment.

- **Token Set**: A collection of tokens for a specific context. Types include: global (base tokens), brand (brand-specific overrides), and mode (light/dark/high-contrast/reduced-motion variations).

- **Brand**: A named theme configuration (e.g., "default", "acme", "partner-a"). Each brand can override any global token. A "default" brand is implicit and applies when `data-brand` is absent or empty, enabling zero-configuration initial setup.

- **Mode**: A runtime-switchable variation (e.g., "light", "dark", "high-contrast", "reduced-motion"). Modes modify token values without changing the brand.

- **Token Reference**: A relationship between a component and the tokens it consumes. Stored in the component manifest as `tokensUsed`.

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Build Performance**: Token compilation should complete in seconds, not minutes, even for large token sets (1000+ tokens).
- **Runtime Performance**: Mode/brand switching must not cause layout thrashing or perceptible delay.
- **Tooling Compatibility**: Output formats must work with common design tools (Figma, Style Dictionary ecosystem).
- **Developer Experience**: Token authoring and consumption should have excellent IDE support (autocomplete, validation).

### Approach A: Style Dictionary-based Pipeline

Use Style Dictionary (industry-standard token transformer) as the core compiler, extending it with custom transforms for DTCG format and mode/brand scoping.

**Pros**:
- Industry standard with large community and ecosystem
- Extensive documentation and examples
- Plugin architecture for custom transforms
- Already supports multiple output formats

**Cons**:
- DTCG support requires custom transforms (not native)
- Mode/brand scoping requires significant customization
- Adds external dependency (though well-maintained)

### Approach B: Custom DTCG Compiler

Build a purpose-built compiler specifically for DTCG format with native support for multi-brand and multi-mode output.

**Pros**:
- Optimized for exact requirements (no unused features)
- Native DTCG support without translation layers
- Full control over output format and scoping strategy
- No external runtime dependency

**Cons**:
- More initial development effort
- Must build and maintain parsing, resolution, and output logic
- Less ecosystem tooling available

### Approach C: Hybrid (DTCG Parser + Style Dictionary Transforms)

Parse DTCG tokens with a lightweight custom parser, then leverage Style Dictionary's transform and format infrastructure for output generation.

**Pros**:
- Best of both: native DTCG parsing with proven output infrastructure
- Incremental adoption path (can swap pieces later)
- Leverages Style Dictionary's battle-tested output formats
- Custom parser keeps DTCG handling clean

**Cons**:
- Two systems to understand and maintain
- Some complexity in bridging the two
- Still dependent on Style Dictionary for core transforms

### Recommendation

**Recommended: Approach B (Custom DTCG Compiler)**

Justification:
1. **Performance**: A purpose-built compiler can be optimized for the exact token structure and output requirements, avoiding Style Dictionary's generalized processing overhead.
2. **DTCG Native**: The DTCG format is relatively simple; building a parser is straightforward and avoids translation layers that could introduce bugs or limitations.
3. **Multi-brand/mode Scoping**: This is a specialized requirement that would require significant Style Dictionary customization anyway; building it natively ensures it works exactly as needed.
4. **Reduced Dependencies**: Fewer external dependencies means fewer version conflicts and security concerns in enterprise environments.
5. **Future Flexibility**: Full ownership of the compiler enables rapid iteration on features like incremental compilation, better error messages, and integration with the existing docs-core validation pipeline.

The trade-off of more initial development is acceptable because the scope is well-defined (DTCG spec is stable) and the integration with the existing docs-core infrastructure will be cleaner with a purpose-built solution.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Token compilation for a set of 500 tokens across 3 brands and 4 modes completes in under 5 seconds.
- **SC-002**: Runtime mode switching (light ↔ dark) completes in under 100ms with no visible flicker.
- **SC-003**: 100% of component token references are validated at build time (no runtime "undefined token" errors possible).
- **SC-004**: Token reference documentation is automatically generated with zero manual authoring required per token.
- **SC-005**: CI snapshot diffs correctly identify 100% of token value changes, additions, and removals.
- **SC-006**: All components in the design system declare their `tokensUsed` and the documentation displays this information.
- **SC-007**: Developers can get autocomplete for token paths in both CSS (via custom property names) and TypeScript (via type definitions).
