# Quickstart: Auditable Accessibility Program

**Feature**: 011-a11y-audit
**Date**: 2026-01-04

## Prerequisites

- Node.js 20+
- pnpm 10+
- Repository cloned and dependencies installed

```bash
pnpm install
```

## 1. Running Automated A11y Tests

### Run all accessibility tests

```bash
pnpm --filter @ds/wc test:a11y
```

### Run a11y tests for a specific component

```bash
pnpm --filter @ds/wc test:a11y -- --grep "ds-button"
```

### CI behavior

- Tests run automatically on PR to main
- Fails on Critical + Serious violations (configurable)
- Generates JSON artifact for audit trail

## 2. Writing Accessibility Tests

Create `*.a11y.test.ts` files alongside component tests:

```typescript
// packages/wc/tests/a11y/button.a11y.test.ts
import { describe, it, expect } from 'vitest';
import { axe, toHaveNoViolations } from 'vitest-axe';
import { html, fixture } from '@open-wc/testing';
import '../../src/components/button/button.js';

expect.extend(toHaveNoViolations);

describe('ds-button accessibility', () => {
  it('should have no axe violations', async () => {
    const el = await fixture(html`
      <ds-button>Click me</ds-button>
    `);

    const results = await axe(el);
    expect(results).toHaveNoViolations();
  });

  it('should be keyboard accessible', async () => {
    const el = await fixture(html`
      <ds-button>Click me</ds-button>
    `);

    el.focus();
    expect(document.activeElement).toBe(el);
  });
});
```

## 3. Conducting Manual Audits

### Start a manual audit

```bash
pnpm a11y:audit --component ds-button --category form-controls
```

This opens an interactive checklist based on the component category.

### Available categories

- `form-controls` - Buttons, inputs, checkboxes, etc.
- `overlays` - Dialogs, popovers, tooltips, menus
- `navigation` - Links, tabs, breadcrumbs
- `data-display` - Tables, lists, cards
- `feedback` - Alerts, toasts, progress indicators

### Checklist workflow

1. CLI presents each test item
2. Mark as: `pass`, `fail`, `na` (not applicable), `blocked`
3. Add notes for failures or edge cases
4. Submit to generate audit record

### View completed audits

```bash
ls a11y-audits/records/ds-button/
# Output: 1.0.0.json, 1.1.0.json, ...
```

## 4. Generating Conformance Reports

### Generate report for a release

```bash
pnpm a11y:report --version 1.5.0
```

### Output formats

- `a11y-audits/reports/1.5.0/report.json` - Machine-readable
- `a11y-audits/reports/1.5.0/report.html` - Human-readable

### Report contents

- Component-level conformance status
- WCAG success criteria mapping
- Automated + manual test results
- Exception documentation

## 5. Viewing Conformance in Docs

### Local development

```bash
pnpm --filter @ds/docs-app dev
# Navigate to /accessibility
```

### Features

- **Conformance table**: All components with status badges
- **Filtering**: By category, conformance level, audit status
- **Component detail**: Full audit history, test results, exceptions

## 6. Tenant Extension

### Add custom component audits

Create `a11y-conformance.json` in your tenant config:

```json
{
  "extends": "@ds/a11y-audit/base-conformance.json",
  "additionalComponents": [
    {
      "id": "custom-date-picker",
      "category": "form-controls",
      "auditRecordPath": "./a11y-audits/records/custom-date-picker/1.0.0.json"
    }
  ]
}
```

### Exclude components

```json
{
  "extends": "@ds/a11y-audit/base-conformance.json",
  "excludeComponents": ["ds-internal-debug"]
}
```

## 7. CI Configuration

### GitHub Actions workflow (a11y-check.yml)

```yaml
name: Accessibility Check

on:
  pull_request:
    branches: [main]

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install
      - run: pnpm --filter @ds/wc test:a11y

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: a11y-report-${{ github.sha }}
          path: a11y-reports/
          retention-days: 1825
```

## Common Tasks

| Task | Command |
|------|---------|
| Run all a11y tests | `pnpm --filter @ds/wc test:a11y` |
| Start manual audit | `pnpm a11y:audit --component <id> --category <cat>` |
| Generate release report | `pnpm a11y:report --version <ver>` |
| Validate audit records | `pnpm a11y:validate` |
| View docs locally | `pnpm --filter @ds/docs-app dev` |

## Troubleshooting

### "No violations" but known issues exist

axe-core covers ~40% of WCAG criteria. Some issues require manual testing:
- Screen reader announcements
- Cognitive accessibility
- Complex interaction patterns

Always complete manual audits before releases.

### Flaky a11y tests

A11y tests should be deterministic. If flaky:
1. Check for async rendering issues
2. Ensure DOM is stable before running axe
3. Use proper fixtures with `await fixture()`

### Missing audit records

Ensure records are committed to git:
```bash
git add a11y-audits/records/
git commit -m "Add audit records for ds-button v1.2.0"
```
