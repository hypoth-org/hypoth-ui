# Implementation Plan: Auditable Accessibility Program

**Branch**: `011-a11y-audit` | **Date**: 2026-01-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-a11y-audit/spec.md`

## Summary

Implement an auditable accessibility program that makes accessibility testing repeatable across releases. The system provides:
1. Automated CI checks using axe-core integrated with Vitest
2. Category-specific manual audit checklists (JSON-based)
3. Release conformance report generation
4. Documentation "Accessibility Conformance" section with tenant extension support

Technical approach: Hybrid system using axe-core for automation + structured JSON checklists with CLI tooling for manual audits.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: axe-core (automated testing), Vitest (test runner), @hypoth-ui/docs-core (documentation integration)
**Storage**: File-based (JSON artifacts in repository, 5-year retention)
**Testing**: Vitest with vitest-axe for a11y assertions
**Target Platform**: Node.js CLI (audit tools), GitHub Actions (CI), Next.js (docs integration)
**Project Type**: Monorepo packages (tooling + CI + docs integration)
**Performance Goals**: CI a11y checks complete in <30s per component; report generation <5 minutes
**Constraints**: Zero runtime dependencies for core packages; all artifacts versioned in git
**Scale/Scope**: ~30 components initially, growing with design system

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; a11y tests run in CI only; no client-side impact
- [x] **Accessibility**: WCAG 2.1 AA as baseline; APG patterns referenced in checklists; automated + manual testing strategy
- [x] **Customizability**: JSON-based checklists enable tenant extension; CSS layers not applicable (tooling feature)
- [x] **Zero-dep Core**: Audit tooling is build/dev-time only; no runtime deps added to core packages
- [x] **Web Components**: N/A - this feature is tooling/CI, not component code
- [x] **Dependency Management**: axe-core is industry standard; vitest-axe minimal wrapper; pnpm used

## Project Structure

### Documentation (this feature)

```text
specs/011-a11y-audit/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (JSON schemas)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/
├── a11y-audit/                    # New package: CLI tooling
│   ├── src/
│   │   ├── cli/                   # CLI commands
│   │   │   ├── audit.ts           # Run manual audit workflow
│   │   │   ├── report.ts          # Generate conformance reports
│   │   │   └── validate.ts        # Validate audit artifacts
│   │   ├── schemas/               # JSON schemas
│   │   │   ├── checklist.schema.json
│   │   │   ├── audit-record.schema.json
│   │   │   └── conformance-report.schema.json
│   │   ├── templates/             # Checklist templates per category
│   │   │   ├── form-controls.json
│   │   │   ├── overlays.json
│   │   │   ├── navigation.json
│   │   │   ├── data-display.json
│   │   │   └── feedback.json
│   │   └── lib/                   # Core utilities
│   │       ├── artifact.ts        # Artifact generation
│   │       ├── aggregator.ts      # Report aggregation
│   │       └── validator.ts       # Schema validation
│   ├── tests/
│   │   └── unit/
│   └── package.json
│
├── wc/                            # Existing: Web Components
│   └── tests/
│       └── a11y/                  # A11y test files (axe-core)
│           ├── setup.ts           # axe-core + vitest-axe setup
│           └── *.a11y.test.ts     # Per-component a11y tests
│
├── docs-core/                     # Existing: Docs engine
│   └── src/
│       └── conformance/           # Conformance section integration
│           ├── loader.ts          # Load conformance data
│           └── types.ts           # TypeScript types
│
└── docs-app/                      # Existing: Docs site
    └── app/
        └── accessibility/         # Accessibility Conformance pages
            ├── page.tsx           # Main conformance table
            └── [component]/       # Component detail pages
                └── page.tsx

.github/
└── workflows/
    ├── a11y-check.yml             # A11y CI job
    └── conformance-report.yml     # Release report generation

a11y-audits/                       # Audit artifacts storage (git-tracked)
├── records/                       # Completed audit records
│   └── {component}/{version}.json
└── reports/                       # Release conformance reports
    └── {version}/
        ├── report.json
        └── report.html
```

**Structure Decision**: Monorepo structure with new `@hypoth-ui/a11y-audit` package for CLI tooling. A11y tests co-located with components in `@hypoth-ui/wc`. Audit artifacts stored in dedicated `a11y-audits/` directory at repo root for easy access and git history. Documentation integration through existing `@hypoth-ui/docs-core` and `@hypoth-ui/docs-app` packages.

## Complexity Tracking

> No constitution violations requiring justification. The feature adds development tooling without impacting runtime behavior of core packages.
