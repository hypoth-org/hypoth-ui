# Feature Specification: Consumer Adoption Fixes

**Feature Branch**: `028-consumer-adoption-fixes`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "Fix consumer adoption issues found during downstream integration (contexly). Covers peer dep ranges, entry point architecture, documentation accuracy, export completeness, and dependency optimization."

## Clarifications

### Session 2026-03-07

- Q: Should FR-002 update the README to use `DsButton`, or make headless `Button` auto-apply CSS classes? → A: Update README to use `DsButton` (Option A). The headless `Button` is the only component with a headless/styled duality — no other component has a `Ds`-prefixed variant. This makes it a unique exception, not a pattern. The README should lead with the styled component; headless `Button` is for advanced users who want behavior-only.
- Q: How should entry point restructuring (FR-004) handle breaking changes for existing consumers? → A: Minor version (1.1.0), no migration concern. **Alpha Policy: hypoth-ui is alpha. Alpha has no users. Do not flag deprecated, do not worry about migration, do not worry about breaking changes. Do not add bloat or make decisions based on users who don't exist.** This policy applies until the project is explicitly promoted to beta.

## Triage Summary

Before defining user stories, this spec categorizes the 20 reported issues (and self-discovered issues) into three buckets:

### Fix — Legitimate Deficiencies

| # | Issue | Why it's a deficiency |
|---|-------|-----------------------|
| 13 | `@hypoth-ui/next` peer dep missing `next ^16` | Blocks adoption on current Next.js versions |
| 14 | README Getting Started shows headless `Button` + CSS import | New users get unstyled output; misleading first experience |
| 15 | `DsButton` marked `@deprecated` but is the only styled button | Contradictory — consumers get IDE warnings using the correct component |
| 16 | `"use client"` on main entry forces all imports client-side | Architectural regression — defeats server-safe type exports |
| 17 | README Dialog example uses `<Dialog>` instead of `<Dialog.Root>` | Documentation bug — code won't work as shown |
| 18 | Alpha notice on 1.0.0 packages | Contradicts semver contract; erodes consumer confidence |
| 20 | EmptyState not exported from `/client` entry | Inconsistent with other compound components |
| 9 | Field/Label/FieldError not exported from `/client` entry | Form components require workaround import path |
| A1 | `/client` entry severely incomplete — missing Dialog, Checkbox, Radio, Switch, Select, Menu, Tabs and more | Audit confirmed: only DsButton, Input, Link, and some compound components are in `/client`; majority of interactive components are missing |
| A2 | Other README examples may have incorrect API surface | Audit needed for all code samples |
| A3 | Peer dep ranges may be inconsistent across packages | Audit needed for React/Next.js range consistency |
| A4 | 4 `@deprecated` tags on WC event constants + incomplete migration to OPEN_CHANGE/PRESS | Alpha Policy violation + inconsistent event API — only Dialog/Select migrated to OPEN_CHANGE; 11 other components still use OPEN/CLOSE. Complete the migration and delete the dead constants. |
| A5 | `LightElement` backward-compat alias for `DSElement` in `packages/wc/src/base/ds-element.ts` | Alpha Policy violation — remove alias, use canonical name only |
| A6 | CSS "legacy" compatibility comments on spacing/flexbox utilities | Alpha Policy violation — remove "legacy, kept for compatibility" labels; keep the utilities if useful |
| A7 | `packages/react/src/index.ts` re-exports runtime components "for backwards compatibility" | Alpha Policy violation — overlaps with FR-004; remove runtime re-exports from main entry |
| A8 | `packages/docs-content/governance/deprecations.mdx` deprecation policy doc | Alpha Policy violation — remove or archive; ceremony for users who don't exist |
| A9 | `packages/primitives-dom/src/events/README.md` "Migration from Legacy Events" section | Alpha Policy violation — document current API only, remove migration framing |

### Keep — Expected Design Decisions

| # | Issue | Why it's by-design |
|---|-------|--------------------|
| 4 | Headless `Button` vs styled `DsButton` split | Intentional but unique — `Button` is the only component with this duality. No other component has a `Ds`-prefixed variant. Keep both, but surface `DsButton` as the default in docs. |
| 19 (partial) | `lit` as direct dependency of `@hypoth-ui/wc` | Lit is the WC rendering engine — it's a core architectural choice, not optional. |
| 12 | Compound components extend `HTMLAttributes` (includes className) | className passthrough works via standard HTML attribute inheritance. No change needed. |
| 2 | CSS workspace import paths (`@ds/wc/src/...`) in source | Pre-compiled at publish time; consumers get resolved paths. Not a runtime issue. |

### Optimize — Improvements Worth Investigating

| # | Issue | Recommendation |
|---|-------|---------------|
| 19 (partial) | `date-fns` and `lucide` as direct deps of `@hypoth-ui/wc` | Move to optional peer deps so consumers using only Button/Input don't pull in date libraries and full icon sets |
| 11 | No documented token override pattern for Next.js | Add a recipe to docs showing CSS variable overrides in globals.css |

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — New Consumer Gets Working Styled Components on First Try (Priority: P1)

A developer discovers hypoth-ui, follows the README Getting Started, and gets a working styled button on their first attempt without needing to read source code or hunt for alternative imports.

**Why this priority**: First impressions determine adoption. If the README leads to an unstyled button, consumers abandon the library before evaluating it.

**Independent Test**: Follow the README Getting Started instructions exactly in a fresh project and verify styled output renders.

**Acceptance Scenarios**:

1. **Given** a new project with `@hypoth-ui/react`, `@hypoth-ui/tokens`, and `@hypoth-ui/css` installed, **When** a developer follows the README Getting Started example verbatim, **Then** a visually styled button renders with the design system's default appearance.
2. **Given** the README React Quick-Start Dialog example, **When** a developer copies it verbatim, **Then** the Dialog opens and closes correctly without runtime errors.
3. **Given** all README code examples, **When** each is copied into a compatible project, **Then** every example produces the documented output without modification.

---

### User Story 2 — Next.js 16 Consumer Can Install Without Overrides (Priority: P1)

A developer using Next.js 16 can install `@hypoth-ui/next` without needing package.json overrides or resolutions to satisfy peer dependency checks.

**Why this priority**: Next.js 16 is current; blocking it blocks the largest target audience.

**Independent Test**: Run `npm install @hypoth-ui/next` in a Next.js 16 project and confirm no peer dependency warnings or errors.

**Acceptance Scenarios**:

1. **Given** a Next.js 16.x project, **When** `npm install @hypoth-ui/next` is run, **Then** installation succeeds with no peer dependency warnings for the `next` range.
2. **Given** all published packages, **When** their peer dependency ranges are reviewed, **Then** React 18/19 and Next.js 14/15/16 are consistently supported across all packages.

---

### User Story 3 — Server Component Can Import Types Without Client Boundary (Priority: P1)

A developer using Next.js App Router can import type definitions from `@hypoth-ui/react` in a Server Component without triggering a client module boundary.

**Why this priority**: Forcing all imports to client-side defeats React Server Component benefits and contradicts the documented architecture.

**Independent Test**: Import `type { ButtonProps }` in a Server Component and verify no client bundle is created for that import.

**Acceptance Scenarios**:

1. **Given** a Next.js App Router Server Component, **When** `import type { ButtonProps } from "@hypoth-ui/react"` is used, **Then** no client module boundary is created and the component remains a Server Component.
2. **Given** the main entry point (`@hypoth-ui/react`), **When** only type exports are imported, **Then** no runtime JavaScript from the package is included in the server bundle.
3. **Given** the `/client` entry point (`@hypoth-ui/react/client`), **When** runtime components are imported, **Then** the `"use client"` directive correctly marks them as client components.

---

### User Story 4 — Consumer Sees No Contradictory IDE Warnings (Priority: P2)

A developer using `DsButton` (the correct styled component) does not see deprecation warnings in their IDE, and the library's versioning/stability messaging is consistent.

**Why this priority**: Contradictory signals (deprecated tag on the primary component, alpha notice on 1.0.0) erode trust and cause confusion.

**Independent Test**: Import `DsButton` in VS Code and confirm no strikethrough or deprecation tooltip appears.

**Acceptance Scenarios**:

1. **Given** a consumer importing `DsButton` from `@hypoth-ui/react/client`, **When** they hover over the import in their IDE, **Then** no `@deprecated` warning is shown.
2. **Given** the README and package descriptions, **When** a consumer reads them, **Then** no alpha/pre-release language appears alongside 1.0.0 versioning.
3. **Given** all package.json description fields, **When** searched for "(Alpha)" text, **Then** none is found.

---

### User Story 5 — All Interactive Components Available from `/client` Entry (Priority: P2)

A developer using Next.js App Router can import all interactive components from `@hypoth-ui/react/client` without needing to mix import paths.

**Why this priority**: Inconsistent exports force consumers to learn which components come from which entry point, adding friction.

**Independent Test**: Import EmptyState, Field, Label, and FieldError from `/client` and verify they render correctly.

**Acceptance Scenarios**:

1. **Given** the `/client` entry point, **When** a consumer imports `EmptyState`, **Then** all compound component parts (`EmptyState.Icon`, `.Title`, `.Description`, `.Action`) are available.
2. **Given** the `/client` entry point, **When** a consumer imports `Field`, `Label`, and `FieldError`, **Then** all three render correctly as client components.
3. **Given** a complete audit of all components exported from the main entry, **When** compared against the `/client` entry, **Then** every interactive (non-type-only) component is available from `/client`.

---

### User Story 6 — Codebase Contains No Alpha Policy Violations (Priority: P2)

The codebase contains no `@deprecated` tags, backward-compatibility aliases, "legacy/compat" labels, or consumer-facing governance docs that add bloat for users who don't exist.

**Why this priority**: The Alpha Policy is a constitutional principle. Violations create misleading signals (IDE warnings, confusing comments) and add maintenance burden with zero benefit during alpha.

**Independent Test**: Search the active codebase for `@deprecated`, "backwards compatibility", "legacy", "kept for compatibility", and "migration" labels. Zero results in active packages.

**Acceptance Scenarios**:

1. **Given** all TypeScript source in `packages/`, **When** searched for `@deprecated` JSDoc tags, **Then** zero results are found.
2. **Given** all TypeScript source in `packages/`, **When** searched for backward-compat aliases or re-exports with "compatibility" comments, **Then** zero results are found.
3. **Given** CSS source files in `packages/css/`, **When** searched for "legacy" or "kept for compatibility" comments, **Then** zero results are found.
4. **Given** `packages/docs-content/governance/`, **When** checked for deprecation policy or migration guide docs, **Then** none exist (removed or archived).

---

### User Story 7 — Minimal Dependency Footprint for Basic Usage (Priority: P3)

A developer using only basic components (Button, Input, Link) does not pull in date-handling or icon libraries they don't use.

**Why this priority**: Unnecessary transitive dependencies increase install time, bundle size, and audit surface. Important but not blocking adoption.

**Independent Test**: Install `@hypoth-ui/wc` and verify `date-fns` and `lucide` are not required for basic component usage.

**Acceptance Scenarios**:

1. **Given** a project using only `DsButton` and `Input`, **When** the dependency tree is inspected, **Then** `date-fns`, `@date-fns/tz`, and `lucide` are not installed (unless the consumer explicitly opts in).
2. **Given** the `@hypoth-ui/wc` package.json, **When** reviewed, **Then** `date-fns` and `lucide` are listed as optional peer dependencies (not direct dependencies).

---

### Edge Cases

- What happens when a consumer uses both main entry and `/client` entry in the same project? Should work without conflicts or duplicate module instances.
- What happens when a consumer imports a component that internally depends on `date-fns` but hasn't installed it? Clear error message at build time, not a cryptic runtime failure.
- What happens when peer dep ranges are widened — do older versions still work? Must maintain backward compatibility with Next.js 14/15, React 18.
- What happens when the main entry exports types that reference client component types? TypeScript should resolve types without triggering client boundaries.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `@hypoth-ui/next` package MUST accept `next ^14.0.0 || ^15.0.0 || ^16.0.0` as its peer dependency range
- **FR-002**: The README Getting Started example MUST use the styled component (`DsButton` from `@hypoth-ui/react/client`) with `@hypoth-ui/css`. The headless `Button` is an advanced option for behavior-only usage and MUST NOT be the default Getting Started path.
- **FR-003**: The `DsButton` component MUST NOT carry a `@deprecated` JSDoc tag (it is the correct styled component; per Alpha Policy, no deprecation tags)
- **FR-004**: The main entry point (`@hypoth-ui/react`) MUST NOT include a `"use client"` directive; it MUST export only types and server-safe utilities
- **FR-005**: The `/client` entry point (`@hypoth-ui/react/client`) MUST retain its `"use client"` directive and export all interactive runtime components
- **FR-006**: The README Dialog example MUST use `<Dialog.Root>` (the correct API), not `<Dialog>` as a direct wrapper
- **FR-007**: The README and all package descriptions MUST NOT contain alpha/pre-release language when packages are versioned at 1.0.0+
- **FR-008**: `EmptyState` and its compound parts MUST be exported from the `/client` entry
- **FR-009**: `Field`, `Label`, and `FieldError` MUST be exported from the `/client` entry
- **FR-010**: All interactive components exported from the main entry MUST also be available from the `/client` entry
- **FR-011**: `date-fns`, `@date-fns/tz`, and `lucide` MUST be moved from direct dependencies to optional peer dependencies in `@hypoth-ui/wc`
- **FR-012**: All README code examples MUST be verified against the actual component API surface and produce the documented output
- **FR-013**: Peer dependency ranges for React and Next.js MUST be consistent across all packages in the monorepo
- **FR-014**: All `@deprecated` JSDoc tags MUST be removed from active package source (per Alpha Policy). The incomplete OPEN/CLOSE → OPEN_CHANGE migration MUST be completed: all 11 remaining WC components (sheet, drawer, alert-dialog, dropdown-menu, context-menu, popover, combobox, hover-card, collapsible, date-picker, menu) MUST be migrated from separate OPEN/CLOSE events to the unified OPEN_CHANGE event pattern (matching Dialog/Select). After migration, the dead OPEN, CLOSE, BEFORE_CLOSE, and CLICK constants MUST be deleted.
- **FR-015**: The `LightElement` backward-compat alias in `@hypoth-ui/wc` MUST be removed; only the canonical `DSElement` name remains
- **FR-016**: CSS comments labeling utilities as "legacy" or "kept for compatibility" MUST be removed; the utilities themselves are kept if useful
- **FR-017**: The deprecation policy doc (`packages/docs-content/governance/deprecations.mdx`) MUST be removed or archived
- **FR-018**: The "Migration from Legacy Events" section in `packages/primitives-dom/src/events/README.md` MUST be rewritten to document the current API only, without migration framing

### Key Entities

- **Entry Point (main)**: The `@hypoth-ui/react` package root — exports types and server-safe code only
- **Entry Point (client)**: The `@hypoth-ui/react/client` subpath — exports all interactive runtime components with `"use client"` directive
- **Peer Dependency Range**: Version constraints in package.json that declare compatible framework versions

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Consumer First Experience**: How quickly a new user gets a working styled component following only the README
- **Framework Compatibility**: Breadth of supported framework versions without workarounds
- **Bundle Efficiency**: Avoidance of unnecessary dependencies in the consumer's node_modules
- **Server Component Safety**: Ability to use type imports in Server Components without client boundary pollution

### Approach A: Targeted Patches

Fix each issue individually as independent commits/PRs. Minimum code changes, maximum isolation.

**Pros**:
- Each fix is small, reviewable, and independently releasable
- Low risk of introducing regressions across unrelated areas
- Can prioritize critical fixes (peer deps, README) and defer lower-priority items

**Cons**:
- Entry point architecture fix (FR-004) requires moving exports between files, which affects multiple issues simultaneously
- Risk of inconsistency if fixes are applied piecemeal without cross-cutting audit

### Approach B: Grouped Thematic Fix

Group related fixes into themes (entry point architecture, documentation, dependency optimization, export completeness) and address each theme as a cohesive unit.

**Pros**:
- Related changes are coordinated (e.g., entry point restructuring + export audit happen together)
- Cross-cutting audit catches issues the original feedback missed (A1, A2, A3)

**Cons**:
- Larger changeset increases review complexity
- Themes may have different urgency levels (peer deps are critical, dep optimization is lower priority)

### Approach C: Breaking v2 Release

Use this as an opportunity to make breaking changes: rename components, restructure entry points, drop the headless/styled split entirely.

**Pros**:
- Clean slate for entry point design
- Could simplify the `Button` vs `DsButton` confusion permanently

**Cons**:
- Disproportionate effort for the issues being solved
- Unnecessary churn when Approach B achieves the same architectural outcome

### Recommendation

**Recommended: Approach B — Grouped Thematic Fix**

Per the Alpha Policy, there are no breaking change concerns. This approach coordinates related fixes into coherent themes: entry point restructuring groups naturally with the export completeness audit, documentation fixes batch into a single README overhaul, and dependency optimization is its own theme.

Approach A risks leaving gaps; Approach C is disproportionate. Approach B gets the architecture right in one pass.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new developer following the README Getting Started can render a styled button in under 5 minutes without consulting any source beyond the README
- **SC-002**: All packages install cleanly on Next.js 14, 15, and 16 with React 18 and 19 — zero peer dependency warnings
- **SC-003**: Server Components importing types from `@hypoth-ui/react` produce no client module boundary (verified via build output)
- **SC-004**: 100% of interactive components are importable from `@hypoth-ui/react/client` — zero components require mixed import paths
- **SC-005**: Zero `@deprecated` warnings appear in IDE when using recommended components
- **SC-006**: All README code examples pass a copy-paste test — each produces the documented output in a compatible project
- **SC-007**: A project using only Button and Input does not have `date-fns` or `lucide` in its resolved dependency tree
- **SC-008**: No alpha/pre-release language appears in any package description or README for packages versioned 1.0.0+
- **SC-009**: Zero `@deprecated` tags, backward-compat aliases, or "legacy/kept for compatibility" labels exist in active package source
- **SC-010**: No consumer-facing governance docs (deprecation policy, migration guides) exist in active docs-content

## Alpha Policy

**hypoth-ui is alpha. Alpha has no users.** Until the project is explicitly promoted to beta:

- Do not add `@deprecated` tags, migration guides, or breaking change warnings
- Do not hedge architectural decisions around hypothetical consumer impact
- Do not add backward-compatibility shims or dual-export workarounds
- Make the right technical decision directly; do not add bloat for users who don't exist
- Semver is used for internal tracking, not as a stability contract to external consumers

## Assumptions

- Next.js 16 does not introduce breaking changes to the App Router integration that would require code changes beyond the peer dep range update
- `date-fns` and `lucide` can be made optional without breaking components that depend on them
- The headless `Button` + styled `DsButton` architecture is intentional and will be preserved (but `Button` is the only component with this duality)
