# Implementation Plan: Governance, Versioning & Adoption Playbook

**Branch**: `012-governance-adoption` | **Date**: 2026-01-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/012-governance-adoption/spec.md`

## Summary

Implement governance documentation, versioning processes, and adoption tooling for the design system. This feature establishes semver practices, deprecation workflows, contribution gates, tenant update tracking, and adoption guides. Uses a hybrid approach: automated scaffolding (changesets for versioning/changelogs) combined with manual enhancement (migration guides, release summaries). Documentation published both in repo (for contributors) and on docs site (for adopters).

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode)
**Primary Dependencies**: @changesets/cli (versioning), conventional-commits (commit format), @ds/docs-core (docs integration)
**Storage**: File-based (JSON deprecation registry, markdown templates, changelog files)
**Testing**: Vitest (unit tests for utilities), manual validation for docs
**Target Platform**: Node.js 20+ (CI/tooling), web (docs site)
**Project Type**: Monorepo tooling + documentation
**Performance Goals**: CI gates complete in <10 minutes; docs build <60 seconds
**Constraints**: Zero runtime dependencies for governance tooling; docs site builds statically
**Scale/Scope**: Support 50+ components, 5+ framework guides, multi-tenant changelog filtering

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime impact - governance is tooling + docs only; no client-side code added
- [x] **Accessibility**: Documentation follows accessible authoring practices; deprecation banners use proper ARIA
- [x] **Customizability**: Deprecation registry uses DTCG-compatible JSON; templates support tenant customization
- [x] **Zero-dep Core**: Governance tooling is devDependencies only; no runtime deps added to core packages
- [x] **Web Components**: N/A - this feature is documentation and tooling only
- [x] **Dependency Management**: changesets is widely adopted, actively maintained; pnpm compatible

**Constitution Status**: PASS - No violations. This feature adds devDependencies for tooling only.

## Project Structure

### Documentation (this feature)

```text
specs/012-governance-adoption/
├── plan.md              # This file
├── research.md          # Phase 0: Tooling research
├── data-model.md        # Phase 1: Governance entities
├── quickstart.md        # Phase 1: Implementation quickstart
├── contracts/           # Phase 1: Schema definitions
│   ├── deprecation-registry.schema.json
│   ├── migration-guide.schema.json
│   └── changelog.schema.json
└── tasks.md             # Phase 2: Implementation tasks
```

### Source Code (repository root)

```text
# Root-level governance files (contributor-focused)
CONTRIBUTING.md          # Contribution guide
CHANGELOG.md             # Generated changelog
.changeset/              # Changesets config and pending changes
│   └── config.json

# Governance tooling package
packages/governance/
├── src/
│   ├── deprecation/
│   │   ├── registry.ts          # Deprecation tracking
│   │   ├── validator.ts         # Validate deprecation rules
│   │   └── warnings.ts          # Console warning utilities
│   ├── changelog/
│   │   ├── filter.ts            # Edition-filtered changelogs
│   │   └── generator.ts         # Changelog scaffolding
│   └── cli/
│       ├── deprecate.ts         # CLI: Add deprecation
│       └── check-gates.ts       # CLI: Validate contribution gates
├── templates/
│   ├── migration-guide.md       # Migration guide template
│   ├── pr-template.md           # PR template for components
│   └── component-scaffold/      # New component starter
└── tests/
    └── unit/

# Docs content (adopter-focused)
packages/docs-content/
├── governance/
│   ├── quick-start.mdx          # 30-minute quick start
│   ├── react-nextjs.mdx         # React/Next.js guide
│   ├── vanilla-js.mdx           # Vanilla JS guide
│   ├── vue.mdx                  # Vue guide
│   ├── angular.mdx              # Angular guide
│   ├── troubleshooting.mdx      # Common issues
│   ├── versioning.mdx           # Semver policy
│   ├── deprecation-policy.mdx   # Deprecation windows
│   └── migration/               # Migration guides per version
│       └── v1-to-v2.mdx
└── manifest.json                # Updated with governance entries

# CI configuration
.github/
├── workflows/
│   └── contribution-gates.yml   # Automated quality gates
└── PULL_REQUEST_TEMPLATE.md     # PR template with checklist
```

**Structure Decision**: Governance tooling lives in a dedicated `@ds/governance` package (devDependency only). Adopter documentation integrates into existing `@ds/docs-content`. Contributor documentation stays at repo root per industry convention.

## Complexity Tracking

No constitution violations to justify.

## Post-Design Constitution Re-Check

*Verified after Phase 1 design completion.*

- [x] **Performance**: Confirmed - all tooling runs at build/CI time only; no runtime impact
- [x] **Accessibility**: Confirmed - deprecation banners will use `role="alert"` and proper ARIA
- [x] **Customizability**: Confirmed - JSON schemas allow extension; templates are customizable
- [x] **Zero-dep Core**: Confirmed - @ds/governance is devDependency only; no changes to core packages
- [x] **Web Components**: N/A - no component changes
- [x] **Dependency Management**: Confirmed - @changesets/cli v2.27.0 is latest stable; bundle impact = 0 (dev only)

**Post-Design Status**: PASS - Design phase complete, ready for task generation.

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Research | `specs/012-governance-adoption/research.md` | Complete |
| Data Model | `specs/012-governance-adoption/data-model.md` | Complete |
| Quickstart | `specs/012-governance-adoption/quickstart.md` | Complete |
| Deprecation Schema | `specs/012-governance-adoption/contracts/deprecation-registry.schema.json` | Complete |
| Changeset Schema | `specs/012-governance-adoption/contracts/changeset-entry.schema.json` | Complete |
| Gates Schema | `specs/012-governance-adoption/contracts/contribution-gates.schema.json` | Complete |
| Migration Schema | `specs/012-governance-adoption/contracts/migration-guide.schema.json` | Complete |

## Next Step

Run `/speckit.tasks` to generate implementation tasks.
