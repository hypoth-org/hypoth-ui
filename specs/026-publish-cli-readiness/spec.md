# Feature Specification: NPM Publishing & CLI Copy-Mode Readiness

**Feature Branch**: `026-publish-cli-readiness`
**Created**: 2026-03-03
**Status**: Draft
**Input**: Prepare all 12 publishable design system packages for npm release, close gaps in CLI copy-mode, and create user-facing documentation (README, usage guides) covering both installation options.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Install Design System Packages from npm (Priority: P1)

A developer building a new application wants to install hypoth-ui design system components as npm packages. They run `npm install @hypoth-ui/react @hypoth-ui/tokens @hypoth-ui/css` and get working, versioned packages with proper metadata, license information, and dependency resolution.

**Why this priority**: Without published packages, no external consumer can use the design system. This is the foundational gate for all adoption.

**Independent Test**: Can be fully tested by running `npm install @hypoth-ui/react` from an external project after the first release, verifying the package installs, resolves dependencies, and exposes the documented exports.

**Acceptance Scenarios**:

1. **Given** a new project with no hypoth-ui dependencies, **When** a developer runs `npm install @hypoth-ui/react @hypoth-ui/tokens @hypoth-ui/css`, **Then** all three packages install successfully with correct versions and resolved dependencies.
2. **Given** the npm registry, **When** a developer views any `@hypoth-ui/*` package page, **Then** the package displays license (MIT), repository link, description, and keywords.
3. **Given** a published `@hypoth-ui/react` package, **When** a developer imports a component (`import { Button } from '@hypoth-ui/react'`), **Then** TypeScript types resolve correctly and the component renders.
4. **Given** all `@hypoth-ui/*` packages at version 0.0.0, **When** the maintainer creates a changeset and triggers the release workflow, **Then** all packages are versioned together (e.g., 0.1.0) and published to npm.

---

### User Story 2 - Copy Component Source into Project (Priority: P2)

A developer who prefers the shadcn/ui pattern wants to copy component source code directly into their project for full control and customization. They use the CLI to selectively copy components, and the copied files have correct import paths for their project structure.

**Why this priority**: The copy-mode foundation exists but only covers 14 of 56 registered components. Expanding template coverage and adding the `--copy` flag enables the documented workflow for all components.

**Independent Test**: Can be tested by running `npx @hypoth-ui/cli add accordion --copy` and verifying the component source files appear in the configured directory with transformed imports.

**Acceptance Scenarios**:

1. **Given** a project initialized with `hypoth-ui init --style copy`, **When** a developer runs `hypoth-ui add accordion`, **Then** the accordion component source files are copied to the configured components directory with imports transformed to match the project's aliases.
2. **Given** a project initialized with `hypoth-ui init --style package`, **When** a developer runs `hypoth-ui add button --copy`, **Then** the button component is copied (overriding the global style for this command) instead of installed as a package.
3. **Given** the CLI templates directory, **When** the maintainer runs `pnpm sync:templates`, **Then** all components that have source in `packages/react/src/components/` and `packages/wc/src/components/` are synced to the templates directory automatically.
4. **Given** a component with registry dependencies (e.g., dialog depends on overlay primitives), **When** a developer copies that component, **Then** all required dependency components are also copied and npm dependencies are installed.

---

### User Story 3 - Discover and Choose an Installation Approach (Priority: P2)

A developer new to hypoth-ui visits the repository README or documentation site and wants to understand how to get started. They find clear documentation explaining both installation options (package mode and copy mode), with step-by-step instructions, trade-offs, and example commands for each.

**Why this priority**: Documentation is the first touchpoint for adoption. Without clear getting-started instructions, developers won't know how to use the published packages or the CLI, regardless of how well they work.

**Independent Test**: Can be tested by having a developer with no prior hypoth-ui knowledge follow the README instructions from scratch and successfully set up a project using their chosen approach.

**Acceptance Scenarios**:

1. **Given** the repository README, **When** a new developer reads it, **Then** they can identify both installation options (package mode and copy mode) with a clear comparison of trade-offs.
2. **Given** the README's "Getting Started" section, **When** a developer follows the package-mode steps, **Then** they can install components and render a working example in a new project.
3. **Given** the README's "Getting Started" section, **When** a developer follows the copy-mode steps, **Then** they can copy components into their project and render a working example.
4. **Given** the documentation, **When** a developer looks for framework-specific guidance, **Then** they find instructions for React, Web Components, and Next.js with framework-appropriate examples.

---

### User Story 4 - Automated Release Pipeline (Priority: P3)

A maintainer wants to release a new version of the design system. They merge PRs with changesets, then trigger the release workflow from GitHub Actions. The workflow builds, tests, versions, and publishes all packages automatically.

**Why this priority**: The release workflow already exists but hasn't been validated end-to-end. Ensuring it works correctly is essential for ongoing maintenance, but less urgent than the initial setup and documentation.

**Independent Test**: Can be tested by triggering the release workflow with `dry_run: true` and verifying it completes all steps without errors.

**Acceptance Scenarios**:

1. **Given** a changeset has been merged to main, **When** the maintainer triggers the release workflow, **Then** all `@hypoth-ui/*` packages are versioned together and published to npm.
2. **Given** the release workflow is triggered with dry-run enabled, **When** the workflow completes, **Then** it logs what would have been published without actually pushing to npm.
3. **Given** a PR that modifies source code in any publishable package, **When** the PR is opened without a changeset, **Then** CI warns that a changeset is required.
4. **Given** a successful publish, **When** the workflow completes, **Then** a version PR is created that updates all package.json versions and changelogs.

---

### Edge Cases

- What happens when a developer tries to install a `@hypoth-ui/*` package that has a `workspace:*` dependency on another `@hypoth-ui/*` package? Changesets must convert these to real version ranges before publishing.
- What happens when `pnpm sync:templates` runs for a component that exists in the registry but has no source in `@hypoth-ui/react` or `@hypoth-ui/wc`? The sync script should skip it gracefully and log a notice.
- What happens when a developer runs `hypoth-ui add` with `--copy` on a component that has no template files? The CLI should display a clear error listing which components support copy mode.
- What happens when the NPM_TOKEN secret is missing or expired during a release workflow run? The workflow should fail early with a clear error, not after building and testing.
- What happens when a developer uses an older CLI version with a newer registry? The CLI should suggest upgrading. [DEFERRED: Not in scope for initial alpha release; revisit post-1.0 when registry versioning is established.]

## Requirements *(mandatory)*

### Functional Requirements

**Package Metadata (Publishing Readiness)**

- **FR-001**: All 12 publishable packages MUST be renamed from `@hypoth-ui/*` to `@hypoth-ui/*` for npm publishing (e.g., `@hypoth-ui/react` becomes `@hypoth-ui/react`). All internal references (imports, dependencies, scripts) MUST also be updated — dual-name strategy is not feasible with pnpm workspace resolution.
- **FR-002**: All 12 publishable packages MUST include `license`, `repository`, `keywords`, `description`, and `homepage` fields in their package.json.
- **FR-003**: The `license` field MUST be set to `"MIT"` for all publishable packages, matching the already-published `@hypoth-ui/cli`.
- **FR-004**: The `repository` field MUST include the monorepo URL and the package-specific `directory` path (e.g., `"directory": "packages/react"`).
- **FR-005**: All `workspace:*` internal dependencies MUST be correctly converted to versioned ranges by changesets before publishing.

**Version Management**

- **FR-006**: All `@hypoth-ui/*` packages MUST be versioned together using changesets' fixed versioning strategy.
- **FR-007**: The first release MUST bump all packages from `0.0.0` to an initial version (0.1.0).
- **FR-008**: The release workflow MUST validate that the NPM_TOKEN secret is present before proceeding with build and test steps.

**CLI Copy-Mode Enhancements**

- **FR-009**: The `add` command MUST support a `--copy` flag that overrides the global `style` setting for a single invocation, allowing `hypoth-ui add button --copy` regardless of the project's configured style.
- **FR-010**: The template sync script MUST auto-discover all components that have source files in the React and WC source packages, not just a hardcoded list.
- **FR-011**: The CLI MUST display a clear message when a developer attempts to copy a component that has no template files, listing which components currently support copy mode.
- **FR-012**: The component registry MUST accurately reflect which components have template files available for copy mode.

**Documentation**

- **FR-013**: The repository README MUST include a "Getting Started" section with step-by-step instructions for both package mode and copy mode.
- **FR-014**: The README MUST include a comparison table or section explaining when to use package mode vs. copy mode, covering trade-offs (ease of updates vs. customization control).
- **FR-015**: The README MUST include framework-specific quick-start examples for React, Web Components, and Next.js.
- **FR-016**: The README MUST list packages in two tiers: "Core Packages" (react, wc, tokens, css, next, cli) promoted prominently with install instructions, and "Tooling & Documentation" (docs-core, docs-content, docs-renderer-next, test-utils, a11y-audit) listed separately for design system contributors.
- **FR-017**: The README and each package description MUST include an "Alpha" badge and a one-line stability caveat (e.g., "Alpha: API may change between minor versions before 1.0").
- **FR-018**: Each publishable package MUST have a package-level README with installation instructions, basic usage examples, and a link back to the main documentation.

### Key Entities

- **Package**: A publishable npm module with name, version, metadata, exports, and dependencies. 12 packages are publishable; 4 are private (demo-react, demo-wc, demo-shared, docs-app).
- **Component**: A UI element registered in the CLI's component registry (56 total). Each has metadata, framework-specific source files, and dependency relationships.
- **Template**: A framework-specific source file bundled with the CLI for copy-mode installation. Currently 14 of 56 components have templates.
- **Changeset**: A file describing a version bump and changelog entry, consumed by the release pipeline to determine which packages to version and publish.

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Consumer Experience**: How easy is it for a developer to discover, install, and use the packages from zero?
- **Maintainer Effort**: How much ongoing effort is required to keep packages published, templates in sync, and docs current?
- **Reliability**: How robust is the release pipeline against failures (missing secrets, broken builds, partial publishes)?

### Approach A: Metadata-First with Manual Template Expansion

Add missing package.json metadata fields, create the initial changeset, write README/docs, and manually expand the template list in sync-templates.ts to cover all components with existing source files. Add the `--copy` flag to the CLI.

**Pros**:
- Straightforward implementation with no architectural changes
- Each step can be validated independently
- Low risk: metadata changes and template syncing are well-understood operations

**Cons**:
- The hardcoded template list in sync-templates.ts will need manual updates whenever new components are added
- Requires maintainer discipline to keep the template list and docs current

### Approach B: Auto-Discovery Templates with Registry Validation

Same as Approach A for metadata and docs, but replace the hardcoded component list in sync-templates.ts with automatic discovery: scan `@hypoth-ui/react` and `@hypoth-ui/wc` source directories for all components and sync any that match registry entries. Add a CI check that validates registry entries match available templates.

**Pros**:
- New components are automatically included in templates when source files exist
- CI validation catches registry/template mismatches before release
- Reduces maintainer burden for ongoing releases

**Cons**:
- Slightly more complex sync script
- Auto-discovery may pick up internal/experimental components not ready for copy mode (mitigated by filtering against the registry)

### Recommendation

**Recommended: Approach B**

Auto-discovery eliminates the manual maintenance burden of keeping a hardcoded list in sync with the growing component library. The CI validation step catches mismatches early, and the sync script can filter to only components that exist in the registry (preventing experimental components from leaking). This aligns with the existing pattern of automated validation throughout the project and reduces the chance of documentation/template drift over time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 12 publishable packages are installable from npm with `npm install @hypoth-ui/<name>` and resolve dependencies correctly.
- **SC-002**: Every `@hypoth-ui/*` package on npm displays license, repository, description, and keywords on its registry page.
- **SC-003**: The release workflow completes successfully (dry-run mode) with all packages versioned and ready for publish.
- **SC-004**: The `--copy` flag works on the `add` command, allowing per-component override of the global style setting.
- **SC-005**: Template coverage increases from 14 components to all components that have source files in `@hypoth-ui/react` and `@hypoth-ui/wc`.
- **SC-006**: A developer with no prior hypoth-ui knowledge can follow the README and have a working component rendered in under 5 minutes using either installation option.
- **SC-007**: The repository README includes complete getting-started guides for both package mode and copy mode, with framework-specific examples for React, Web Components, and Next.js.

## Clarifications

### Session 2026-03-03

- Q: Should packages publish under the `@hypoth-ui/*` scope or unify under `@hypoth-ui/*`? → A: Unify all packages under `@hypoth-ui/*` (e.g., `@hypoth-ui/react`, `@hypoth-ui/tokens`). The `@hypoth-ui/*` names remain as internal workspace aliases only.
- Q: Should the README promote all 12 packages equally or distinguish consumer-facing from internal? → A: Tiered presentation — "Core Packages" (react, wc, tokens, css, next, cli) prominently, then "Tooling & Docs" section for internal packages (docs-core, docs-content, docs-renderer-next, test-utils, a11y-audit).
- Q: Should the README include an explicit stability warning for the initial pre-1.0 release? → A: Yes — add an "Alpha" badge and one-line caveat in README and each package description (e.g., "Alpha: API may change between minor versions").

## Assumptions

- All packages will be published under the `@hypoth-ui` npm scope (already established via `@hypoth-ui/cli`). Internal workspace names (`@hypoth-ui/*`) remain as development aliases only.
- The `NPM_TOKEN` secret can be configured in GitHub repository settings by the maintainer (this is an operational step, not a code change).
- The existing changesets configuration (fixed versioning for all publishable packages) is the desired strategy: all packages release together.
- The initial version will be `0.1.0` to signal pre-1.0 status while being meaningful.
- Components in the registry that lack source files in `@hypoth-ui/react` or `@hypoth-ui/wc` are intentionally excluded from copy mode (they may be planned but not yet implemented).
- The repository README is the primary documentation entry point; the docs site (`@hypoth-ui/docs-app`) provides deeper reference but is not in scope for this feature.
