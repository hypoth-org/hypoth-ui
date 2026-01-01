# Feature Specification: Component & Documentation Contracts

**Feature Branch**: `002-component-docs-contracts`
**Created**: 2026-01-01
**Status**: Draft
**Input**: User description: "Define enforceable contracts for components and documentation so that: every component has consistent metadata, a11y notes, and recommended usage; docs are validated against the manifest schema; white-label packaging rules can filter components by tier/edition; docs site can filter content based on tenant config"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Component Author Defines Metadata (Priority: P1)

As a component author, I want to define metadata for my component in a structured manifest so that consumers understand its purpose, accessibility requirements, and usage patterns without reading implementation code.

**Why this priority**: The manifest is the foundation for all other features - without structured component metadata, filtering, validation, and documentation cannot function.

**Independent Test**: Can be fully tested by creating a component with a manifest.json file and running schema validation. Delivers immediate value by providing autocomplete and validation in editors.

**Acceptance Scenarios**:

1. **Given** a new component directory, **When** the author creates a manifest.json file, **Then** the schema provides autocomplete for all required fields (name, status, description, accessibility, editions)
2. **Given** a manifest.json with missing required fields, **When** the build runs, **Then** validation fails with clear error messages indicating which fields are missing
3. **Given** a valid manifest.json, **When** the author adds accessibility notes, **Then** the notes are structured with keyboard, screenReader, and ariaPatterns sections

---

### User Story 2 - Documentation Author Creates Validated Docs (Priority: P1)

As a documentation author, I want my MDX documentation to be validated against the component manifest so that the docs accurately reflect the component's capabilities and status.

**Why this priority**: Documentation quality directly impacts developer experience. Invalid or outdated docs cause confusion and support burden.

**Independent Test**: Can be tested by writing an MDX file with frontmatter and running the validation command. Invalid frontmatter produces clear errors.

**Acceptance Scenarios**:

1. **Given** a component with a manifest, **When** I create an MDX file, **Then** the frontmatter schema enforces required fields (title, component, status)
2. **Given** a docs file referencing a component, **When** the referenced component status differs from docs status, **Then** validation warns about the mismatch
3. **Given** a docs file with code examples, **When** the examples use deprecated props, **Then** validation warns about deprecated usage

---

### User Story 3 - Tenant Administrator Configures Edition (Priority: P2)

As a tenant administrator, I want to configure which component edition my docs site displays so that my users only see components they have access to.

**Why this priority**: Multi-tenant support is a key differentiator for white-label packaging, but requires the manifest foundation first.

**Independent Test**: Can be tested by creating an edition config file and verifying the navigation only shows components matching that edition.

**Acceptance Scenarios**:

1. **Given** components with different edition tags (core, pro, enterprise), **When** the tenant config specifies "core" edition, **Then** only core components appear in navigation
2. **Given** a tenant config with "pro" edition, **When** a user navigates to an enterprise component URL directly, **Then** a 404 or "upgrade required" page is shown
3. **Given** edition filtering is enabled, **When** the docs site builds, **Then** excluded component pages are not generated (not just hidden)

---

### User Story 4 - Maintainer Audits Component Status (Priority: P2)

As a design system maintainer, I want to generate reports of component status and metadata so that I can track which components need attention.

**Why this priority**: Governance and maintenance workflows depend on visibility into component status across the system.

**Independent Test**: Can be tested by running the audit command and verifying the output includes all components with their status and any validation issues.

**Acceptance Scenarios**:

1. **Given** multiple components with manifests, **When** I run the audit command, **Then** I receive a report showing each component's status, edition, and validation state
2. **Given** components with different statuses (stable, beta, deprecated), **When** I filter the audit by status, **Then** only matching components appear
3. **Given** a component with validation warnings, **When** the audit runs, **Then** warnings are clearly listed with actionable remediation steps

---

### User Story 5 - Content Publisher Updates Docs (Priority: P3)

As a content publisher, I want to preview how documentation changes will appear across different editions so that I can verify content is correct before publishing.

**Why this priority**: Preview functionality enhances the authoring experience but is not required for core functionality.

**Independent Test**: Can be tested by running the preview command with an edition flag and verifying the correct content is displayed.

**Acceptance Scenarios**:

1. **Given** a docs file with edition-specific content blocks, **When** I preview with --edition=core, **Then** only core content is rendered
2. **Given** I'm editing a component doc, **When** I save, **Then** the preview hot-reloads with validation feedback
3. **Given** edition-specific content, **When** I toggle editions in preview mode, **Then** the view updates without full page reload

---

### Edge Cases

- What happens when a component has no manifest.json? System should fail validation with a clear error.
- How does system handle a manifest referencing non-existent editions? Validation error with available editions listed.
- What happens when docs reference a component that was deleted? Build fails with reference error.
- How does filtering work for components in multiple editions? Component appears if user's edition includes any of the component's editions.
- What happens to cross-component links when target is filtered out? Links become disabled with tooltip explaining edition requirement.

## Requirements *(mandatory)*

### Functional Requirements

**Manifest Schema**:
- **FR-001**: System MUST define a JSON Schema for component manifests with required fields: name, version, status, description, editions
- **FR-002**: System MUST validate manifest.json files against the schema during build
- **FR-003**: Manifest MUST support accessibility metadata with sections: keyboard, screenReader, ariaPatterns
- **FR-004**: Manifest MUST support status values: experimental, alpha, beta, stable, deprecated
- **FR-005**: Manifest MUST support edition tags for multi-tenant filtering

**Documentation Contract**:
- **FR-006**: System MUST define MDX frontmatter schema that references the component manifest
- **FR-007**: System MUST validate that docs frontmatter status matches component manifest status
- **FR-008**: System MUST warn when docs examples use deprecated component props
- **FR-009**: System MUST support edition-specific content blocks in MDX (e.g., `<Edition only="pro">`)

**Edition Filtering**:
- **FR-010**: System MUST read tenant edition configuration from a config file or environment variable
- **FR-011**: System MUST filter navigation to only show components matching the active edition
- **FR-012**: System MUST exclude filtered component pages from static generation (not just hide them)
- **FR-013**: System MUST handle direct URL access to filtered components by displaying an upgrade prompt showing component name with "available in [edition]" message
- **FR-014**: System MUST support three edition tiers with hierarchical inheritance: core → pro → enterprise (each tier includes all components from lower tiers)

**Validation & Tooling**:
- **FR-015**: System MUST provide a CLI command to validate all manifests and docs
- **FR-016**: System MUST provide a CLI command to generate audit reports
- **FR-017**: System MUST integrate validation into the build pipeline with configurable strictness: warnings in development mode, errors in CI/production
- **FR-018**: System MUST provide VS Code / IDE schema support for autocomplete

**Developer Experience**:
- **FR-019**: System MUST provide clear, actionable error messages for validation failures
- **FR-020**: System MUST support preview mode with edition switching
- **FR-021**: System MUST support hot-reload during docs development with validation feedback

### Key Entities

- **ComponentManifest**: Structured metadata for a component including name, status, accessibility notes, and edition tags. Lives in the WC package as `packages/wc/src/components/<name>/manifest.json` (canonical source of truth).
- **DocsFrontmatter**: YAML frontmatter in MDX files that references a component and provides documentation-specific metadata.
- **EditionConfig**: Tenant-level configuration that defines which edition(s) are active, controlling component visibility.
- **ValidationResult**: Output from the validation process including errors, warnings, and component/doc references.

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Schema Authoring DX**: How easy is it to write and maintain manifest files? Autocomplete, validation, error messages.
- **Build Performance**: How much overhead does validation add to the build process?
- **Runtime Flexibility**: Can editions be switched at runtime or only at build time?
- **Extensibility**: How easy is it to add new metadata fields or edition types?

### Approach A: JSON Schema with Static Validation

Define component manifests using JSON Schema. Validation runs at build time using a schema validator like Ajv. Edition filtering is static, determined at build time.

**Pros**:
- Industry-standard schema format with excellent tooling (VS Code support, ajv)
- Zero runtime overhead - all validation happens at build time
- JSON Schema can be shared across tools (CLI, IDE, CI)
- Clear separation between schema definition and validation logic

**Cons**:
- JSON Schema syntax can be verbose for complex validations
- Static filtering means separate builds per edition (or SSR-based filtering)
- No runtime edition switching without page reload

### Approach B: TypeScript Types with Zod Validation

Define manifests as TypeScript interfaces. Use Zod for runtime schema validation. Store manifests as TypeScript files instead of JSON.

**Pros**:
- TypeScript-native with excellent type inference
- Zod provides both types and runtime validation from single source
- Can do runtime validation and filtering
- More expressive validation logic (custom refinements)

**Cons**:
- Requires TypeScript knowledge to author manifests
- Zod adds bundle size if used at runtime (~12KB)
- Less portable - tied to TypeScript ecosystem
- Harder to generate from other tools

### Approach C: Hybrid - JSON Schema Definition, Build-Time Validation, Runtime Filtering

Use JSON Schema for manifest definition and IDE support. Validate at build time with Ajv. Generate a lightweight runtime manifest for edition filtering that can work with SSR or client-side switching.

**Pros**:
- Best IDE experience from JSON Schema
- No runtime validation overhead (build-time only)
- Small runtime payload for filtering (just component-edition map)
- Can support both static and dynamic filtering strategies

**Cons**:
- Two representations (full schema, runtime map) to keep in sync
- Slightly more complex build pipeline

### Recommendation

**Recommended: Approach C - Hybrid**

This approach provides the best balance across our evaluation criteria:

1. **Schema Authoring DX**: JSON Schema provides excellent autocomplete and inline validation in VS Code/IDEs, matching the "declarative contracts" philosophy.
2. **Build Performance**: Full validation only at build time, no runtime parsing of manifests.
3. **Runtime Flexibility**: The generated edition map enables SSR-based filtering (respecting Next.js patterns) without rebuilding.
4. **Extensibility**: JSON Schema's `$ref` and composition features make extending the schema straightforward.

The trade-off of maintaining two representations is acceptable because:
- The runtime map is auto-generated from manifests (not manually maintained)
- The map is tiny (component name → edition array)
- This pattern aligns with our existing DTCG token approach (source files → generated outputs)

## Clarifications

### Session 2026-01-01

- Q: How many edition tiers should the system support, and what is their inheritance relationship? → A: Three tiers: core, pro, enterprise (each includes all lower)
- Q: Should validation have different strictness modes for dev vs CI? → A: Configurable: warnings in dev, errors in CI/production
- Q: Where should the canonical manifest.json reside? → A: WC package only (e.g., `packages/wc/src/components/button/manifest.json`)
- Q: What behavior for direct URL access to filtered components? → A: Upgrade prompt showing component name with "available in [edition]" message

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of components have valid manifest.json files passing schema validation
- **SC-002**: Build fails if any manifest or frontmatter validation error exists
- **SC-003**: IDE autocomplete works for all manifest and frontmatter fields with zero configuration
- **SC-004**: Edition filtering reduces docs site bundle to only include content for active edition
- **SC-005**: Validation errors include file path, line number (where applicable), and remediation suggestion
- **SC-006**: Audit command generates report within 5 seconds for up to 100 components
- **SC-007**: Adding a new edition requires only config change, no code modifications
- **SC-008**: All P1 and P2 user stories pass acceptance criteria before feature is considered complete
