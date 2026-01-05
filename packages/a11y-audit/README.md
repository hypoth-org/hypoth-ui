# @ds/a11y-audit

Accessibility audit tooling for the design system. Provides automated CI checks, manual audit checklists, and conformance report generation.

## Features

- **Automated CI Checks**: Run axe-core accessibility tests in CI
- **Manual Audit Checklists**: Category-specific checklists for form controls, overlays, navigation, data display, and feedback components
- **Conformance Reports**: Generate release-level accessibility conformance reports
- **Documentation Integration**: Display conformance status in docs site

## Installation

```bash
pnpm add @ds/a11y-audit
```

## Usage

### Automated Testing

Run accessibility tests for web components:

```bash
pnpm --filter @ds/wc test:a11y
```

### Manual Audits

Start a manual accessibility audit for a component:

```bash
pnpm a11y:audit -- --component ds-button --category form-controls
```

Available categories:
- `form-controls` - Buttons, inputs, checkboxes, etc.
- `overlays` - Dialogs, popovers, tooltips, menus
- `navigation` - Links, tabs, breadcrumbs
- `data-display` - Tables, lists, cards
- `feedback` - Alerts, toasts, progress indicators

### Conformance Reports

Generate a conformance report for a release:

```bash
pnpm a11y:report -- --version 1.0.0
```

Reports are generated in `a11y-audits/reports/<version>/`:
- `report.json` - Machine-readable format
- `report.html` - Human-readable format

### Validation

Validate audit records:

```bash
pnpm a11y:validate
```

## Directory Structure

```
a11y-audits/
├── records/           # Manual audit records per component
│   └── ds-button/
│       └── 1.0.0.json
└── reports/           # Generated conformance reports
    └── 1.0.0/
        ├── report.json
        └── report.html
```

## CI Integration

The `a11y-check.yml` workflow runs on every PR:
- Executes all accessibility tests
- Fails on Critical + Serious violations
- Uploads test artifacts (5-year retention)
- Provides remediation guidance for failures

## Configuration

### Severity Threshold

Configure which violations cause CI failures:

```bash
# Via CLI flag
pnpm a11y:audit -- --severity critical,serious

# Via environment variable
A11Y_SEVERITY=critical,serious pnpm test:a11y
```

Options:
- `critical` - Most severe violations
- `serious` - Significant violations
- `moderate` - Medium severity
- `minor` - Minor issues
- `all` - Fail on any violation

Default: `critical,serious`

## JSON Schemas

Schemas for audit artifacts are available at:
- `@ds/a11y-audit/schemas/audit-checklist.schema.json`
- `@ds/a11y-audit/schemas/audit-record.schema.json`
- `@ds/a11y-audit/schemas/conformance-report.schema.json`

## License

MIT
