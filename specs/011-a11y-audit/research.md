# Research: Auditable Accessibility Program

**Feature**: 011-a11y-audit
**Date**: 2026-01-04

## Research Summary

This document captures research decisions for implementing the auditable accessibility program.

---

## 1. Automated A11y Testing Framework

### Decision
Use **axe-core** with **vitest-axe** wrapper for Vitest integration.

### Rationale
- axe-core is the industry standard (used by Google, Microsoft, Deque)
- vitest-axe provides clean assertion API for Vitest
- Covers ~40% of WCAG 2.1 AA criteria automatically
- Same engine powers browser extensions, enabling dev-CI consistency
- Active maintenance and regular rule updates

### Alternatives Considered

| Tool | Pros | Cons | Why Not Chosen |
|------|------|------|----------------|
| Pa11y | CLI-first, Puppeteer-based | Less comprehensive rules | Fewer rules than axe-core |
| jest-axe | Mature, well-documented | Jest-specific | We use Vitest |
| Lighthouse a11y | Part of Chrome DevTools | Subset of axe rules | Less comprehensive |
| WAVE API | Professional reports | Paid service, external dep | Constitution: no external deps for core |

### Implementation Notes
- Install: `pnpm add -D axe-core vitest-axe`
- Configure severity threshold in vitest config
- Each component gets `*.a11y.test.ts` file

---

## 2. Manual Audit Checklist Format

### Decision
Use **JSON Schema-validated JSON files** with category-specific templates.

### Rationale
- Machine-readable for report aggregation and docs integration
- Schema validation catches incomplete audits
- Git-tracked for version history
- Category templates ensure comprehensive coverage
- CLI can generate/validate artifacts

### Alternatives Considered

| Format | Pros | Cons | Why Not Chosen |
|--------|------|------|----------------|
| Markdown checklists | Human-readable | Hard to aggregate, no validation | Can't programmatically process |
| YAML | Readable, less verbose | No native schema validation | JSON Schema is better tooled |
| Database (SQLite) | Query-friendly | Overhead, not git-friendly | Adds complexity, breaks git workflow |
| Notion/Airtable | Rich UI, collaboration | External dependency | Constitution: no external deps |

### Schema Structure
```json
{
  "$schema": "audit-record.schema.json",
  "component": "ds-button",
  "version": "1.2.0",
  "category": "form-controls",
  "auditor": "jane.doe@example.com",
  "auditDate": "2026-01-04T10:30:00Z",
  "wcagVersion": "2.1",
  "conformanceLevel": "AA",
  "items": [
    {
      "id": "fc-001",
      "criterion": "1.3.1",
      "description": "Label programmatically associated",
      "status": "pass",
      "notes": ""
    }
  ],
  "overallStatus": "conformant"
}
```

---

## 3. Conformance Report Format

### Decision
Generate **JSON primary format** with **HTML export** for human consumption.

### Rationale
- JSON enables programmatic consumption (docs site, CI checks)
- HTML provides shareable, printable format for stakeholders
- Both generated from same data source
- Versioned and immutable (5-year retention requirement)

### Alternatives Considered

| Format | Pros | Cons | Why Not Chosen |
|--------|------|------|----------------|
| PDF only | Professional, print-ready | Hard to generate, not machine-readable | Need machine-readable format |
| Markdown | Git-friendly | Limited formatting | Less professional for external sharing |
| VPAT template | Industry standard | Complex, specific format | Future enhancement (not MVP) |

### Report Structure
- Component-level conformance matrix
- WCAG success criteria mapping
- Automated vs manual test results
- Exception documentation with rationale
- Audit metadata (dates, auditors, versions)

---

## 4. CLI Tool Architecture

### Decision
Use **Node.js CLI** with **commander** for argument parsing and **Ajv** for JSON Schema validation.

### Rationale
- Consistent with existing TypeScript tooling
- commander is lightweight, well-documented
- Ajv already used in codebase for schema validation
- No new runtime dependencies for core packages

### Alternatives Considered

| Approach | Pros | Cons | Why Not Chosen |
|----------|------|------|----------------|
| Bash scripts | Simple, no deps | Hard to maintain, no type safety | Complex logic needed |
| Go CLI | Fast, single binary | Different language | Team expertise is TypeScript |
| Deno | Modern, secure | Different runtime | pnpm/Node ecosystem |

### CLI Commands
```bash
# Run manual audit workflow
pnpm a11y:audit --component ds-button --category form-controls

# Generate release conformance report
pnpm a11y:report --version 1.5.0 --output reports/

# Validate audit artifacts
pnpm a11y:validate --records a11y-audits/records/
```

---

## 5. Documentation Integration Pattern

### Decision
Use **static generation** with conformance data loaded at build time.

### Rationale
- Aligns with Next.js App Router patterns
- No runtime data fetching required
- Data freshness via CI-triggered rebuilds
- Tenant extension via configuration overlay

### Alternatives Considered

| Pattern | Pros | Cons | Why Not Chosen |
|---------|------|------|----------------|
| API endpoints | Real-time data | Server overhead, complexity | Overkill for release-time data |
| Client-side fetch | Dynamic updates | Performance, SEO | Constitution: performance first |
| External service | Professional dashboards | External dependency | Constitution: no external deps |

### Integration Points
1. `@ds/docs-core`: Load conformance JSON at build time
2. `@ds/docs-app`: Render conformance table + filters
3. Tenant config: Filter/extend component list

---

## 6. CI Integration Strategy

### Decision
Add **dedicated a11y workflow** with **artifact upload** and **status checks**.

### Rationale
- Separate workflow enables parallel execution
- Artifacts preserved for debugging/auditing
- Status checks gate PRs on a11y compliance
- Reusable across component packages

### Workflow Triggers
- **a11y-check.yml**: On PR to main, runs axe-core tests
- **conformance-report.yml**: On release tag, generates full report

### GitHub Actions Pattern
```yaml
# Artifact upload for audit trail
- uses: actions/upload-artifact@v4
  with:
    name: a11y-report-${{ github.sha }}
    path: a11y-reports/
    retention-days: 1825  # 5 years
```

---

## 7. Category-Specific Checklist Items

### Decision
Define **5 component categories** with tailored checklist templates.

### Rationale
- Different component types have different a11y concerns
- Templates ensure comprehensive coverage
- Reduces auditor cognitive load
- Maps to WCAG success criteria

### Categories and Key Tests

| Category | Key Manual Tests | WCAG Focus |
|----------|------------------|------------|
| Form Controls | Label association, error states, required indication | 1.3.1, 3.3.1, 3.3.2 |
| Overlays | Focus trap, escape dismiss, background inert | 2.1.2, 2.4.3 |
| Navigation | Skip links, current page indicator, keyboard order | 2.4.1, 2.4.4, 2.4.7 |
| Data Display | Table headers, data relationships, reading order | 1.3.1, 1.3.2 |
| Feedback | Alert announcements, timeout warnings, status updates | 4.1.3 |

---

## 8. Tenant Extension Mechanism

### Decision
Use **configuration overlay pattern** with JSON merge.

### Rationale
- Tenants can add custom components without forking
- Base + overlay mirrors existing docs architecture
- JSON merge is simple and predictable
- Git-friendly (tenant config in their repo)

### Extension Pattern
```json
// tenant-config/a11y-conformance.json
{
  "extends": "@ds/a11y-audit/base-conformance.json",
  "additionalComponents": [
    {
      "id": "custom-date-picker",
      "auditRecordPath": "./a11y-audits/records/custom-date-picker/1.0.0.json"
    }
  ],
  "excludeComponents": ["ds-internal-debug"]
}
```

---

## Open Questions Resolved

All research questions resolved. Ready to proceed to Phase 1 design.
