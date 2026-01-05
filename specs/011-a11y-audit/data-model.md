# Data Model: Auditable Accessibility Program

**Feature**: 011-a11y-audit
**Date**: 2026-01-04

## Entity Overview

```
┌─────────────────────┐     ┌─────────────────────┐
│   AuditChecklist    │     │  AutomatedTestRun   │
│   (template)        │     │  (CI artifact)      │
└─────────┬───────────┘     └──────────┬──────────┘
          │                            │
          │ generates                  │ produces
          ▼                            ▼
┌─────────────────────┐     ┌─────────────────────┐
│    AuditRecord      │     │ AccessibilityResult │
│ (completed audit)   │     │  (per-component)    │
└─────────┬───────────┘     └──────────┬──────────┘
          │                            │
          └──────────┬─────────────────┘
                     │ aggregated into
                     ▼
          ┌─────────────────────┐
          │  ConformanceReport  │
          │  (release artifact) │
          └─────────────────────┘
                     │
                     │ displayed in
                     ▼
          ┌─────────────────────┐
          │ ComponentConformance│
          │  (docs view)        │
          └─────────────────────┘
```

---

## Entities

### 1. AuditChecklist

Template defining manual tests for a component category.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Unique identifier (e.g., "form-controls") |
| name | string | yes | Human-readable name |
| description | string | yes | Purpose of this checklist |
| wcagVersion | string | yes | WCAG version (e.g., "2.1") |
| conformanceLevel | enum | yes | "A" \| "AA" \| "AAA" |
| items | ChecklistItem[] | yes | Array of test items |
| version | string | yes | Checklist template version |

#### ChecklistItem (embedded)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Unique item ID (e.g., "fc-001") |
| criterion | string | yes | WCAG success criterion (e.g., "1.3.1") |
| description | string | yes | What to test |
| procedure | string | yes | How to test |
| expectedOutcome | string | yes | What passing looks like |
| tools | string[] | no | Recommended testing tools |
| screenReaders | string[] | no | Screen readers to test with |

**Validation Rules**:
- `id` must be unique across all checklists
- `criterion` must match WCAG success criterion format (X.X.X)
- `items` must have at least 1 item

**Storage**: `/packages/a11y-audit/src/templates/{category}.json`

---

### 2. AuditRecord

Completed manual audit for a specific component version.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Auto-generated UUID |
| component | string | yes | Component ID (e.g., "ds-button") |
| version | string | yes | Component version audited |
| checklistId | string | yes | Reference to checklist template |
| checklistVersion | string | yes | Version of checklist used |
| auditor | string | yes | Auditor email/identifier |
| auditDate | ISO8601 | yes | Timestamp of audit completion |
| items | AuditItem[] | yes | Completed audit items |
| overallStatus | enum | yes | "conformant" \| "partial" \| "non-conformant" |
| notes | string | no | General audit notes |
| exceptions | Exception[] | no | Documented accessibility exceptions |

#### AuditItem (embedded)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| itemId | string | yes | Reference to ChecklistItem.id |
| status | enum | yes | "pass" \| "fail" \| "na" \| "blocked" |
| notes | string | no | Auditor notes |
| evidence | string | no | Screenshot/recording reference |

#### Exception (embedded)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| criterion | string | yes | WCAG criterion with exception |
| rationale | string | yes | Why exception is acceptable |
| workaround | string | no | Alternative approach for users |
| plannedFix | string | no | Roadmap reference if temporary |

**Validation Rules**:
- All checklist items must have corresponding AuditItem
- `overallStatus` computed from item statuses:
  - "conformant": all pass or na
  - "partial": some pass, some fail
  - "non-conformant": majority fail
- `auditDate` must be valid ISO8601

**State Transitions**:
```
[New] → [In Progress] → [Submitted] → [Archived]
                ↑               │
                └───────────────┘ (revision needed)
```

**Storage**: `/a11y-audits/records/{component}/{version}.json`

---

### 3. AutomatedTestRun

CI-generated accessibility test results.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| runId | string | yes | CI run identifier |
| timestamp | ISO8601 | yes | Test execution time |
| gitCommit | string | yes | Git SHA |
| branch | string | yes | Branch name |
| results | AccessibilityResult[] | yes | Per-component results |
| summary | RunSummary | yes | Aggregate statistics |

#### AccessibilityResult (embedded)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| component | string | yes | Component ID |
| testFile | string | yes | Test file path |
| passed | boolean | yes | Overall pass/fail |
| violations | Violation[] | yes | Detected violations |
| passes | string[] | yes | Passing rule IDs |
| incomplete | string[] | yes | Inconclusive rules |

#### Violation (embedded)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ruleId | string | yes | axe-core rule ID |
| impact | enum | yes | "critical" \| "serious" \| "moderate" \| "minor" |
| description | string | yes | Issue description |
| helpUrl | string | yes | Remediation documentation |
| nodes | NodeInfo[] | yes | Affected DOM elements |

#### NodeInfo (embedded)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| html | string | yes | Element HTML snippet |
| target | string[] | yes | CSS selector path |
| failureSummary | string | yes | Why this element failed |

**Storage**: CI artifact (GitHub Actions), `/a11y-audits/ci/{runId}.json`

---

### 4. ConformanceReport

Release-level accessibility conformance summary.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Report identifier |
| version | string | yes | Release version |
| generatedAt | ISO8601 | yes | Report generation timestamp |
| generatedBy | string | yes | Generator (CI job/user) |
| wcagVersion | string | yes | Target WCAG version |
| conformanceLevel | string | yes | Target level (AA) |
| components | ComponentStatus[] | yes | Per-component status |
| summary | ConformanceSummary | yes | Aggregate statistics |
| metadata | ReportMetadata | yes | Report metadata |

#### ComponentStatus (embedded)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| component | string | yes | Component ID |
| version | string | yes | Component version |
| status | enum | yes | "conformant" \| "partial" \| "non-conformant" \| "pending" |
| automatedResult | AutomatedSummary | yes | CI test summary |
| manualAudit | ManualAuditSummary | no | Manual audit summary |
| lastUpdated | ISO8601 | yes | Most recent audit date |

#### ConformanceSummary (embedded)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| totalComponents | number | yes | Total component count |
| conformant | number | yes | Fully conformant count |
| partial | number | yes | Partially conformant count |
| nonConformant | number | yes | Non-conformant count |
| pending | number | yes | Awaiting audit count |
| conformancePercentage | number | yes | (conformant / total) * 100 |

**Validation Rules**:
- `version` must match semver format
- Report is immutable once generated (new reports for updates)
- `generatedAt` must be after all component audit dates

**Storage**: `/a11y-audits/reports/{version}/report.json`

---

### 5. ComponentConformance

Documentation display model (derived, not stored).

| Field | Type | Description |
|-------|------|-------------|
| component | string | Component ID |
| displayName | string | Human-readable name |
| category | string | Component category |
| status | enum | Conformance status |
| wcagCriteria | CriteriaStatus[] | Per-criterion status |
| lastAuditDate | ISO8601 | Most recent audit |
| auditor | string | Last auditor |
| detailsUrl | string | Link to full audit |
| apgPattern | string | APG pattern reference |

**Derived from**: ComponentStatus + AuditRecord + component manifest

---

## Relationships

```
AuditChecklist 1 ──────< * AuditRecord
     │                        │
     │ (template)             │ (instance)
     │                        │
     └────────────────────────┼──────────────────────┐
                              │                      │
AutomatedTestRun 1 ─────< * AccessibilityResult     │
     │                        │                      │
     │                        │                      │
     └────────────────────────┼──────────────────────┘
                              │
                              ▼
                    ConformanceReport
                              │
                              │ (displayed as)
                              ▼
                    ComponentConformance
```

---

## Indexes / Query Patterns

| Query | Pattern | Used By |
|-------|---------|---------|
| Get audit by component+version | `records/{component}/{version}.json` | CLI, docs |
| List all audits for component | Glob `records/{component}/*.json` | Report generator |
| Get latest CI run | Sort by timestamp | CI, docs |
| Get report by version | `reports/{version}/report.json` | Docs, release |
| Filter by conformance status | In-memory filter on report | Docs UI |

---

## Data Retention

| Artifact Type | Retention Period | Archival Strategy |
|---------------|------------------|-------------------|
| AuditRecord | 5 years | Git history |
| AutomatedTestRun | 5 years | GitHub Actions artifacts |
| ConformanceReport | 5 years | Git history + artifact storage |
| AuditChecklist | Indefinite | Version controlled |
