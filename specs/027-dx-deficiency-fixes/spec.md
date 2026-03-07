# Feature Specification: DX Deficiency Fixes

**Feature Branch**: `027-dx-deficiency-fixes`
**Created**: 2026-03-07
**Status**: Draft
**Input**: Fix 7 top developer experience deficiencies blocking adoption

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Install and import without errors (Priority: P1)

A developer installs `@hypoth-ui/react` from npm into a Next.js 15 project using React 19. They import a Button component in a Server Component file. The app builds and renders without errors.

**Why this priority**: This is the #1 adoption blocker. If packages can't be installed or imported correctly, nothing else matters.

**Independent Test**: Install `@hypoth-ui/react` in a fresh Next.js 15 + React 19 project, import Button in a page component, and verify the app builds successfully.

**Acceptance Scenarios**:

1. **Given** a Next.js 15 project with React 19, **When** the developer runs `npm install @hypoth-ui/react`, **Then** peer dependency warnings are resolved and the package installs without errors.
2. **Given** a Server Component file that imports from `@hypoth-ui/react`, **When** the developer builds the app, **Then** the build succeeds without "use client" or hook-related errors.
3. **Given** `@hypoth-ui/react` is installed, **When** the developer checks `node_modules/@hypoth-ui/react/package.json`, **Then** peerDependencies contain valid semver ranges (no `workspace:*` literals).

---

### User Story 2 - One Button, one API (Priority: P2)

A developer imports `Button` from `@hypoth-ui/react`. There is exactly one Button component with a clear, consistent API. They don't encounter a second conflicting Button when exploring the package exports.

**Why this priority**: Having two Buttons with different APIs and behaviors under the same name creates confusion and bugs. This must be resolved before more adopters encounter it.

**Independent Test**: Import `Button` from both `@hypoth-ui/react` and `@hypoth-ui/react/client`, verify they behave consistently and use the same event prop naming.

**Acceptance Scenarios**:

1. **Given** a developer imports `Button` from `@hypoth-ui/react`, **When** they render it, **Then** they get a single, well-documented Button component.
2. **Given** a developer imports from `@hypoth-ui/react/client`, **When** they look for Button, **Then** the WC-wrapping variant is exported under a distinct name (`DsButton`), not `Button`.
3. **Given** a developer uses `Button`, **When** they handle press events, **Then** the prop is consistently named `onPress` across all entry points.

---

### User Story 3 - Consistent event prop naming (Priority: P2)

A developer learns that `onPress` handles button activation. When they use other components (Dialog, Select, Menu), the event naming follows the same predictable pattern: `on` + PascalCase action name. They never have to guess between `onClick`, `onPress`, or `onChange` for the same type of action.

**Why this priority**: Inconsistent APIs increase cognitive load and cause bugs. Standardizing now prevents technical debt from growing.

**Independent Test**: Audit all React component exports and verify event props follow the `on` + PascalCase convention with a 1:1 mapping to WC `ds:` events.

**Acceptance Scenarios**:

1. **Given** a WC fires `ds:press`, **When** the React adapter exposes this event, **Then** the prop is named `onPress`.
2. **Given** a WC fires `ds:open-change`, **When** the React adapter exposes this event, **Then** the prop is named `onOpenChange`.
3. **Given** CONTRIBUTING.md, **When** a developer reads the event naming section, **Then** they find a clear convention: WC `ds:kebab-case` maps to React `onPascalCase`.

---

### User Story 4 - Clean dependency graph (Priority: P3)

A developer installs `@hypoth-ui/css` for styling. They don't see confusing circular dependency warnings or need to install `@hypoth-ui/wc` just to get CSS files.

**Why this priority**: Circular dependencies confuse developers and package managers. Easy fix with no risk.

**Independent Test**: Install `@hypoth-ui/css` in isolation and verify no circular dependency warnings appear and `@hypoth-ui/wc` is not required at runtime.

**Acceptance Scenarios**:

1. **Given** a project with only `@hypoth-ui/css` installed, **When** the developer imports the CSS file, **Then** it works without requiring `@hypoth-ui/wc` at runtime.
2. **Given** the `@hypoth-ui/css` package.json, **When** inspecting dependencies, **Then** `@hypoth-ui/wc` appears only in devDependencies (build-time need), not dependencies.

---

### User Story 5 - Selective component loading is documented (Priority: P3)

A developer using Next.js wants to reduce bundle size by only loading the WC components they actually use. They find clear documentation on how to use `DsLoader`'s `include` and `exclude` props.

**Why this priority**: The feature already exists but is undiscoverable. Documentation is the lowest-effort, highest-impact fix.

**Independent Test**: Read the README and follow the selective loading instructions to configure `DsLoader` with specific components.

**Acceptance Scenarios**:

1. **Given** the project README, **When** a developer searches for "selective loading" or "DsLoader", **Then** they find documented examples of `include` and `exclude` props.
2. **Given** the documented examples, **When** a developer copies them into their project, **Then** only the specified components are registered.

---

### User Story 6 - Empty state pattern available (Priority: P4)

A developer needs to show an empty state (e.g., "No results found" with an icon and action button). They find a built-in `EmptyState` compound component that handles the common layout pattern.

**Why this priority**: Common UI pattern that every app needs. Additive change with no breaking risk, but lower priority than fixing existing broken APIs.

**Independent Test**: Import and render `EmptyState` with title, description, icon, and action sub-components.

**Acceptance Scenarios**:

1. **Given** a developer imports `EmptyState` from `@hypoth-ui/react`, **When** they render it with `EmptyState.Title` and `EmptyState.Description`, **Then** a centered, accessible empty state is displayed.
2. **Given** an `EmptyState` with an `EmptyState.Action` child, **When** the user activates the action, **Then** the developer's callback fires.

---

### Edge Cases

- What happens when a developer has both React 18 and React 19 projects in the same monorepo? Peer dep ranges must accommodate both.
- How does the `"use client"` directive interact with `import type { ButtonProps }` in Server Components? Type-only imports are unaffected by the directive.
- What happens to existing consumers of `Button` from `@hypoth-ui/react/client` after the rename? They must update imports to `DsButton` — acceptable during alpha.
- What if `DsLoader` is given both `include` and `exclude` props simultaneously? Document that `include` takes precedence.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All published packages MUST have valid semver ranges in peerDependencies (no `workspace:*` literals).
- **FR-002**: The `@hypoth-ui/react` package MUST support React 18.x and React 19.x as peer dependencies.
- **FR-003**: The `@hypoth-ui/next` package MUST support Next.js 14.x and Next.js 15.x as peer dependencies.
- **FR-004**: The main `@hypoth-ui/react` entry point MUST include a `"use client"` directive to prevent Server Component import errors.
- **FR-005**: There MUST be exactly one component named `Button` exported from `@hypoth-ui/react`. The WC-wrapping variant MUST be exported under a distinct name.
- **FR-006**: All React adapter event props MUST follow the `on` + PascalCase naming convention (e.g., `onPress`, `onOpenChange`, `onValueChange`).
- **FR-007**: The event naming convention MUST be documented in CONTRIBUTING.md with a clear mapping table between WC events and React props.
- **FR-008**: The `@hypoth-ui/css` package MUST NOT list `@hypoth-ui/wc` as a runtime dependency. Build-time dependencies MUST be in devDependencies.
- **FR-009**: The README MUST document `DsLoader`'s `include` and `exclude` props with usage examples.
- **FR-010**: The design system MUST provide an `EmptyState` compound component with sub-components for icon, title, description, and action.
- **FR-011**: The `EmptyState` component MUST be accessible, with appropriate ARIA roles and semantic structure.
- **FR-012**: Breaking API changes (Button rename, event prop changes) MUST be clearly documented in the changelog.
- **FR-013**: The `@hypoth-ui/react` peerDependency on `@hypoth-ui/wc` MUST use a valid semver range (e.g., `>=0.1.0`), not `workspace:*`.
- **FR-014**: Each React WC-wrapper component MUST use either the direct addEventListener pattern (for simple components) or the behavior primitives pattern (for compound components) — not a mix of both within a single component. The existing dual-pattern architecture is intentional and documented in research.md.

### Key Entities

- **Package Manifest**: `package.json` files defining dependency relationships, peer dependency ranges, and export maps.
- **Entry Point**: Module entry files (`index.ts`, `client.ts`) that define the public API surface and framework directives.
- **Event Mapping**: The correspondence between WC CustomEvent names (`ds:press`) and React callback prop names (`onPress`).
- **Component Export**: Named exports from package entry points, each mapping to exactly one component implementation.

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Adoption friction**: How easily can new developers install and use the packages without encountering errors?
- **API consistency**: How predictable and learnable is the component API across entry points and frameworks?
- **Breaking change scope**: How many existing consumers are affected, and how disruptive is the migration?

### Approach A: Incremental Fixes (Ship in Phases)

Fix issues in priority order across multiple releases: Phase 1 ships critical blockers (peer deps, "use client") as a patch. Phase 2 ships API consolidation (Button unification, event naming) as a minor/breaking release. Phase 3 ships documentation and new components.

**Pros**:
- Critical blockers are fixed immediately without waiting for larger changes
- Breaking changes are isolated in their own release, making migration clear
- Each phase is independently testable and deployable

**Cons**:
- Multiple releases in short succession may confuse consumers tracking versions
- Phase 2 breaking changes may require consumers to update twice if they adopt between Phase 1 and Phase 2

### Approach B: Single Breaking Release

Bundle all fixes into one release: fix peer deps, add "use client", rename Button, standardize events, fix CSS deps, add docs, and add EmptyState all at once.

**Pros**:
- Consumers only need to update once
- All API changes are documented in a single changelog entry

**Cons**:
- Delays critical blockers (peer deps, "use client") until all work is complete
- Larger change surface increases risk of regressions
- Harder to bisect issues if something breaks

### Approach C: Feature Flags with Deprecation Warnings

Keep both Button APIs but add runtime deprecation warnings for the old pattern. Gradually migrate over 2-3 releases.

**Pros**:
- No immediate breaking changes for existing consumers
- Graceful migration path with warnings

**Cons**:
- Maintains confusing dual-API surface longer
- Deprecation warnings add noise to developer console
- More code to maintain during transition period
- Alpha stage is exactly when breaking changes should happen, before widespread adoption

### Recommendation

**Recommended: Approach A (Incremental Fixes)**

This approach scores highest on adoption friction (critical blockers ship immediately) while managing breaking change scope (isolated in Phase 2). The phased approach aligns with the project's alpha status — fixing install blockers first maximizes the number of developers who can even try the library, while the subsequent breaking release cleans up the API before the user base grows. The trade-off of multiple releases is acceptable because the project uses changesets with clear changelogs, and the alpha audience expects API instability.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can install `@hypoth-ui/react` in a Next.js 15 + React 19 project with zero peer dependency warnings.
- **SC-002**: A Next.js app importing from `@hypoth-ui/react` in a Server Component file builds successfully on first attempt.
- **SC-003**: The string `Button` resolves to exactly one component definition when imported from `@hypoth-ui/react`.
- **SC-004**: 100% of React adapter event props follow the `on` + PascalCase naming convention.
- **SC-005**: Installing `@hypoth-ui/css` produces zero circular dependency warnings.
- **SC-006**: The README contains at least two code examples demonstrating `DsLoader` selective loading.
- **SC-007**: `EmptyState` component renders with correct accessibility attributes (verified by automated a11y tests).
- **SC-008**: All breaking changes are documented in the changelog with migration instructions.
