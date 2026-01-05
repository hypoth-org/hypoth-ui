# Research: Governance Tooling & Best Practices

**Feature**: 012-governance-adoption
**Date**: 2026-01-04

## Research Topics

### 1. Monorepo Versioning: Changesets vs Semantic-Release

**Decision**: Use @changesets/cli

**Rationale**:
- Native monorepo support without community plugins
- First-class pnpm workspace compatibility (no additional plugins needed)
- Version PR workflow enables manual changelog enhancement before publish
- Actively maintained by Atlassian with large community
- Supports "fixed" versioning mode for single version across all @ds/* packages

**Alternatives considered**:
- **semantic-release**: Rejected because monorepo plugin (semantic-release-monorepo) is unmaintained since 2022, requires additional pnpm plugin, and tightly couples commits to publishing without manual review step
- **Lerna**: Legacy tool, most projects migrating to Changesets or Nx
- **Manual versioning**: Rejected per spec requirement for automated scaffolding

### 2. Changelog Format

**Decision**: Keep A Changelog format with custom edition filtering

**Rationale**:
- Industry-standard format (keepachangelog.com) widely recognized
- Supports grouping by: Added, Changed, Deprecated, Removed, Fixed, Security
- Custom `getReleaseLine()` function can add edition metadata for filtering
- Markdown-based for easy manual enhancement

**Alternatives considered**:
- **GitHub releases only**: Rejected because tenants need offline/static changelog access
- **Conventional changelog**: Less human-friendly grouping

### 3. Deprecation Registry Format

**Decision**: JSON file with structured metadata

**Rationale**:
- Machine-readable for automated validation and warning generation
- Easy to query for sunset date enforcement
- Can be consumed by docs site for deprecation banners
- Version-controlled in repository

**Structure**:
```json
{
  "deprecations": [
    {
      "id": "unique-id",
      "type": "component|api|token",
      "name": "ds-old-button",
      "deprecated_in": "2.0.0",
      "removal_target": "4.0.0",
      "replacement": "ds-button",
      "migration_guide": "/docs/migration/v2-button",
      "reason": "Consolidated button variants"
    }
  ]
}
```

**Alternatives considered**:
- **JSDoc annotations only**: Rejected because harder to aggregate and query
- **Database**: Rejected per constitution (zero runtime deps, file-based storage)

### 4. Contribution Gates Implementation

**Decision**: GitHub Actions workflow with composite actions

**Rationale**:
- Native GitHub integration for PR feedback
- Composite actions enable reusable gate definitions
- Clear pass/fail status in PR checks
- Can block merge until gates pass

**Gates to implement**:
1. **test-coverage**: Vitest coverage report, fail if <80%
2. **accessibility**: axe-core + jest-axe, fail on violations
3. **manifest-validation**: JSON schema validation via AJV
4. **docs-presence**: Check for required MDX sections

**Alternatives considered**:
- **Pre-commit hooks**: Supplement but not replace CI (can be bypassed)
- **External service (CodeClimate, etc.)**: Adds external dependency

### 5. Tenant Changelog Filtering

**Decision**: Build-time filtering with edition metadata in changeset files

**Rationale**:
- No runtime overhead (static generation)
- Leverages existing edition-config from docs-renderer
- Each changeset entry can specify affected editions
- Filter function generates tenant-specific changelog views

**Implementation approach**:
```markdown
<!-- .changeset/happy-dog.md -->
---
"@ds/wc": minor
editions: [core, pro, enterprise]
security: false
---

Added new DatePicker component with full keyboard support.
```

**Alternatives considered**:
- **Runtime filtering**: Rejected for performance (violates constitution)
- **Separate changelogs per edition**: Too much duplication, hard to maintain

### 6. Documentation Authoring Standards

**Decision**: MDX with frontmatter metadata, following existing docs-content patterns

**Rationale**:
- Consistent with existing @ds/docs-content structure
- Enables component embedding in guides
- Frontmatter supports edition filtering and navigation ordering
- Portable format per constitution

**Required frontmatter for governance docs**:
```yaml
---
title: Quick Start Guide
description: Get started with the design system in 30 minutes
category: governance
order: 1
editions: [core, pro, enterprise]
---
```

## Dependencies

| Package | Version | Purpose | Bundle Impact |
|---------|---------|---------|---------------|
| @changesets/cli | ^2.27.0 | Version management | devDep only |
| @changesets/changelog-github | ^0.5.0 | PR/author links in changelog | devDep only |
| ajv | ^8.12.0 | Schema validation (already in project) | existing |

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Changesets deprecation | Low | High | Active project, Atlassian backed; if deprecated, migration path to similar tools exists |
| Contributors skip changeset files | Medium | Medium | CI gate enforces changeset presence for non-trivial PRs |
| Manual changelog enhancement forgotten | Medium | Low | PR template checklist includes changelog review step |
| Edition metadata not added to changesets | Medium | Medium | Lint rule to require editions field in changeset files |
