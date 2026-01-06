# Feature Specification: CLI Tool for Component Installation

**Feature Branch**: `015-cli-tool`
**Created**: 2026-01-05
**Status**: Draft
**Input**: User description: "CLI Tool for Component Installation - Create a CLI tool for adding components to projects, similar to shadcn-ui's approach."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Initialize Project for Design System (Priority: P1)

A developer starting a new project wants to quickly set up the hypoth-ui design system. They run a single command that detects their project configuration and installs the necessary dependencies, creating a configuration file for future component additions.

**Why this priority**: This is the foundational step - without proper initialization, no other CLI features can work. It's the first thing every user will do.

**Independent Test**: Can be fully tested by running `npx @hypoth-ui/cli init` in a fresh Next.js project and verifying that configuration file is created and base dependencies are installed.

**Acceptance Scenarios**:

1. **Given** a fresh Next.js project with no design system config, **When** user runs `npx @hypoth-ui/cli init`, **Then** the CLI detects Next.js framework, pnpm package manager, TypeScript usage, and creates `ds.config.json` with correct defaults
2. **Given** an initialized project, **When** user runs `npx @hypoth-ui/cli init` again, **Then** the CLI warns about existing configuration and offers to reset or update
3. **Given** a project using npm instead of pnpm, **When** user runs `npx @hypoth-ui/cli init`, **Then** the CLI uses npm for all subsequent installations

---

### User Story 2 - Add Single Component (Priority: P1)

A developer needs a button component. They run a single command to add it to their project. Depending on their configuration, either the component source is copied into their project (copy mode) or the package dependency is installed (package mode).

**Why this priority**: This is the core value proposition - zero-friction component installation. Equal priority with init since both are essential for MVP.

**Independent Test**: Can be fully tested by running `npx @hypoth-ui/cli add button` after init and verifying the Button component is available and working in the project.

**Acceptance Scenarios**:

1. **Given** an initialized project in copy mode, **When** user runs `npx @hypoth-ui/cli add button`, **Then** button component source files are copied to configured components directory and any required dependencies are installed
2. **Given** an initialized project in package mode, **When** user runs `npx @hypoth-ui/cli add button`, **Then** the appropriate package (@hypoth-ui/react or @hypoth-ui/wc based on framework) is installed with tree-shakeable imports
3. **Given** a button component already exists, **When** user runs `npx @hypoth-ui/cli add button`, **Then** the CLI warns about existing component and does not overwrite without explicit `--overwrite` flag
4. **Given** the button component depends on tokens, **When** user runs `npx @hypoth-ui/cli add button`, **Then** the CLI automatically installs @hypoth-ui/tokens as a dependency

---

### User Story 3 - Add Multiple Components at Once (Priority: P2)

A developer setting up a new feature needs dialog, menu, and button components. They add all three with a single command rather than running multiple commands.

**Why this priority**: Convenience feature that builds on P1 functionality. Important for productivity but not essential for core functionality.

**Independent Test**: Can be fully tested by running `npx @hypoth-ui/cli add button dialog menu` and verifying all three components are installed correctly.

**Acceptance Scenarios**:

1. **Given** an initialized project, **When** user runs `npx @hypoth-ui/cli add button dialog menu`, **Then** all three components are installed with their dependencies deduplicated
2. **Given** button already exists but dialog doesn't, **When** user runs `npx @hypoth-ui/cli add button dialog`, **Then** the CLI skips button (with warning) and installs dialog

---

### User Story 4 - List Available Components (Priority: P2)

A developer wants to see what components are available in the design system before deciding what to add.

**Why this priority**: Discovery feature that helps users explore the system. Important for adoption but not blocking core functionality.

**Independent Test**: Can be fully tested by running `npx @hypoth-ui/cli list` and verifying a complete list of available components with descriptions is displayed.

**Acceptance Scenarios**:

1. **Given** any project (initialized or not), **When** user runs `npx @hypoth-ui/cli list`, **Then** a list of all available components is displayed with names, descriptions, and installation status (if initialized)
2. **Given** an initialized project with some components installed, **When** user runs `npx @hypoth-ui/cli list`, **Then** installed components are marked with a visual indicator (e.g., checkmark)

---

### User Story 5 - Check for Component Updates (Priority: P3)

A developer wants to see if there are updates available for their installed components.

**Why this priority**: Maintenance feature. Less critical than installation flows since projects function without updates.

**Independent Test**: Can be fully tested by running `npx @hypoth-ui/cli diff` and verifying it shows which components have newer versions available.

**Acceptance Scenarios**:

1. **Given** an initialized project with components installed, **When** user runs `npx @hypoth-ui/cli diff`, **Then** the CLI shows which components have updates available with version comparison
2. **Given** all components are up to date, **When** user runs `npx @hypoth-ui/cli diff`, **Then** the CLI confirms all components are current

---

### User Story 6 - Add All Components (Priority: P3)

A developer building a comprehensive application wants to add all available components at once.

**Why this priority**: Bulk operation that's convenient but rarely needed. Most users add components incrementally.

**Independent Test**: Can be fully tested by running `npx @hypoth-ui/cli add --all` and verifying all components are installed.

**Acceptance Scenarios**:

1. **Given** an initialized project, **When** user runs `npx @hypoth-ui/cli add --all`, **Then** all available components are installed with dependencies deduplicated
2. **Given** some components already exist, **When** user runs `npx @hypoth-ui/cli add --all`, **Then** only missing components are added (existing ones skipped with summary)

---

### Edge Cases

- What happens when the CLI is run outside a JavaScript/TypeScript project (no package.json)?
  - CLI displays helpful error message explaining requirements
- How does the system handle network failures during package installation?
  - CLI implements retry logic (3 attempts) and provides clear error messages with manual recovery steps
- What happens when a component has a breaking change between versions?
  - CLI warns user during diff/update operations and requires explicit confirmation for major version updates
- How does the system handle conflicting dependencies between components?
  - CLI resolves to highest compatible version and warns if resolution fails
- What happens when the user's project has incompatible peer dependencies?
  - CLI warns about incompatibility before installation and suggests resolution steps

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: CLI MUST detect project framework (React, Next.js, or vanilla/Web Components) from package.json and tsconfig.json
- **FR-002**: CLI MUST detect package manager (npm, pnpm, yarn, bun) from lock files
- **FR-003**: CLI MUST detect TypeScript vs JavaScript from tsconfig.json presence
- **FR-004**: CLI MUST support both copy (source files) and package (npm dependency) installation modes for components; tokens always remain as package dependency regardless of mode
- **FR-005**: CLI MUST track installed components and their versions in configuration file
- **FR-006**: CLI MUST resolve component dependencies automatically (e.g., Dialog depends on focus-trap)
- **FR-007**: CLI MUST provide clear, actionable error messages for all failure scenarios
- **FR-008**: CLI MUST work without initialization for `list` command (discovery-first approach)
- **FR-009**: CLI MUST support React and Web Components through unified command interface with framework auto-detection
- **FR-010**: CLI MUST prevent accidental overwrites with explicit `--overwrite` flag requirement
- **FR-011**: CLI MUST generate correct imports based on TypeScript/JavaScript and framework settings
- **FR-012**: CLI MUST install @hypoth-ui/tokens as npm dependency and configure CSS layer imports during init (tokens are never copied, always installed as package)
- **FR-013**: CLI MUST validate that added components are compatible with detected/configured framework

### Key Entities

- **Configuration (ds.config.json)**: Stores user preferences including installation style (copy/package), framework, paths, TypeScript setting, and installed component registry
- **Component Registry (remote)**: Hosted metadata about available components including name, description, version, dependencies, peer dependencies, and file manifest for copy mode
- **Installed Component**: Record of a component added to the project including name, version, installation mode, and installation path

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Developer Experience**: How quickly can a developer go from zero to working component?
- **Maintainability**: How easy is it to update components and track versions?
- **Bundle Size**: Does the approach minimize shipped JavaScript?
- **Flexibility**: Can users customize without fighting the tool?

### Approach A: Copy-Only (shadcn-ui style)

Copy component source code directly into user's project. User owns the code entirely.

**Pros**:
- Full ownership and customization freedom
- No dependency version conflicts
- Easy to understand what's in the project
- Works offline after initial copy

**Cons**:
- Updates require manual diffing or full replacement
- No automatic security patches
- Duplicates code across projects
- Larger git repositories

### Approach B: Package-Only (traditional npm)

Install components as npm package dependencies with tree-shaking.

**Pros**:
- Easy updates via package manager
- Automatic security patches
- Deduplication across projects
- Smaller git repositories
- Proven distribution model

**Cons**:
- Less customization flexibility
- Dependency version conflicts possible
- Requires careful tree-shaking setup
- Black box to users

### Approach C: Hybrid (User Choice)

Let users choose per-project whether to use copy mode or package mode via configuration.

**Pros**:
- Flexibility for different use cases (prototypes vs production)
- Best of both worlds when needed
- Users can migrate between modes
- Supports different team preferences

**Cons**:
- More complex CLI implementation
- Documentation must cover both paths
- Testing matrix doubles
- Potential user confusion about which to choose

### Recommendation

**Recommended: Approach C (Hybrid)**

Justification:
1. **Developer Experience**: Users get to choose based on their specific needs - copy for maximum customization, package for easier maintenance
2. **Bundle Size**: Package mode with tree-shaking keeps bundles minimal; copy mode puts control in user hands
3. **Flexibility**: Maximum flexibility by supporting both paradigms
4. **Alignment with constitution**: Supports customizability (copy mode) while maintaining performance (tree-shakeable packages)

The added implementation complexity is justified because different projects have genuinely different needs. The default should be package mode (easier maintenance, smaller footprint) with copy mode as an explicit opt-in for teams requiring deep customization.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developer can go from empty Next.js project to working Button component in under 2 minutes using `init` + `add button`
- **SC-002**: Adding a component with `add` command completes in under 30 seconds (excluding network time)
- **SC-003**: 95% of users successfully install their first component without errors on first attempt
- **SC-004**: Package mode installations tree-shake unused components (verified: adding only Button results in no Dialog code in bundle)
- **SC-005**: CLI provides helpful error messages that include resolution steps for 100% of known failure scenarios
- **SC-006**: Copy mode source files match published package source exactly (automated verification)

## Clarifications

### Session 2026-01-06

- Q: In copy mode, should tokens/themes also be copied or remain as package dependencies? → A: Tokens always installed as npm package (@hypoth-ui/tokens), only components are copied
- Q: In copy mode, should behavior utilities (primitives-dom) be copied or remain as package? → A: Always npm package (never copied) - behavior utilities are stable primitives that benefit from automatic bug fixes

## Assumptions

- Users have Node.js 18+ installed (required for modern ESM and fetch)
- npm scope `@hypoth-ui` will be registered on npmjs.com before release
- Component registry will be hosted as static JSON (no backend required initially)
- The monorepo already exports components in tree-shakeable format
- Users running `npx` have internet connectivity for initial download
