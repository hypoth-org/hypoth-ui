# Requirements Checklist: Component & Documentation Contracts

**Feature Branch**: `002-component-docs-contracts`
**Generated**: 2026-01-01

## Functional Requirements

### Manifest Schema
- [ ] **FR-001**: System MUST define a JSON Schema for component manifests with required fields: name, version, status, description, editions
- [ ] **FR-002**: System MUST validate manifest.json files against the schema during build
- [ ] **FR-003**: Manifest MUST support accessibility metadata with sections: keyboard, screenReader, ariaPatterns
- [ ] **FR-004**: Manifest MUST support status values: experimental, alpha, beta, stable, deprecated
- [ ] **FR-005**: Manifest MUST support edition tags for multi-tenant filtering

### Documentation Contract
- [ ] **FR-006**: System MUST define MDX frontmatter schema that references the component manifest
- [ ] **FR-007**: System MUST validate that docs frontmatter status matches component manifest status
- [ ] **FR-008**: System MUST warn when docs examples use deprecated component props
- [ ] **FR-009**: System MUST support edition-specific content blocks in MDX (e.g., `<Edition only="pro">`)

### Edition Filtering
- [ ] **FR-010**: System MUST read tenant edition configuration from a config file or environment variable
- [ ] **FR-011**: System MUST filter navigation to only show components matching the active edition
- [ ] **FR-012**: System MUST exclude filtered component pages from static generation (not just hide them)
- [ ] **FR-013**: System MUST handle direct URL access to filtered components with appropriate response (404 or upgrade prompt)
- [ ] **FR-014**: System MUST support component inheritance (e.g., "pro" includes all "core" components)

### Validation & Tooling
- [ ] **FR-015**: System MUST provide a CLI command to validate all manifests and docs
- [ ] **FR-016**: System MUST provide a CLI command to generate audit reports
- [ ] **FR-017**: System MUST integrate validation into the build pipeline
- [ ] **FR-018**: System MUST provide VS Code / IDE schema support for autocomplete

### Developer Experience
- [ ] **FR-019**: System MUST provide clear, actionable error messages for validation failures
- [ ] **FR-020**: System MUST support preview mode with edition switching
- [ ] **FR-021**: System MUST support hot-reload during docs development with validation feedback

## Success Criteria

- [ ] **SC-001**: 100% of components have valid manifest.json files passing schema validation
- [ ] **SC-002**: Build fails if any manifest or frontmatter validation error exists
- [ ] **SC-003**: IDE autocomplete works for all manifest and frontmatter fields with zero configuration
- [ ] **SC-004**: Edition filtering reduces docs site bundle to only include content for active edition
- [ ] **SC-005**: Validation errors include file path, line number (where applicable), and remediation suggestion
- [ ] **SC-006**: Audit command generates report within 5 seconds for up to 100 components
- [ ] **SC-007**: Adding a new edition requires only config change, no code modifications
- [ ] **SC-008**: All P1 and P2 user stories pass acceptance criteria before feature is considered complete

## User Story Acceptance

### P1 - Component Author Defines Metadata
- [ ] Schema provides autocomplete for all required manifest fields
- [ ] Validation fails with clear errors for missing required fields
- [ ] Accessibility notes support keyboard, screenReader, and ariaPatterns sections

### P1 - Documentation Author Creates Validated Docs
- [ ] Frontmatter schema enforces required fields (title, component, status)
- [ ] Validation warns about status mismatches between docs and manifest
- [ ] Validation warns about deprecated prop usage in examples

### P2 - Tenant Administrator Configures Edition
- [ ] Edition config controls which components appear in navigation
- [ ] Direct URL access to filtered components shows appropriate response
- [ ] Excluded component pages are not generated during build

### P2 - Maintainer Audits Component Status
- [ ] Audit command reports status, edition, and validation state for all components
- [ ] Audit supports filtering by status
- [ ] Validation warnings include actionable remediation steps

### P3 - Content Publisher Updates Docs
- [ ] Preview command supports --edition flag
- [ ] Hot-reload works with validation feedback
- [ ] Edition toggle updates view without full page reload
