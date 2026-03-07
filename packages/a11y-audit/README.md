# @hypoth-ui/a11y-audit

Accessibility audit and conformance reporting tools for the hypoth-ui design system. Provides automated CI checks, manual audit checklists, and WCAG conformance report generation.

## Installation

```bash
npm install @hypoth-ui/a11y-audit
```

## Usage

### Run Automated Accessibility Tests

```bash
pnpm test:a11y
```

### Start a Manual Audit

```bash
pnpm a11y:audit -- --component ds-button --category form-controls
```

Available categories: `form-controls`, `overlays`, `navigation`, `data-display`, `feedback`.

### Generate a Conformance Report

```bash
pnpm a11y:report -- --version 1.0.0
```

### Validate Audit Records

```bash
pnpm a11y:validate
```

## Documentation

See the [main README](../../README.md) for full documentation and architecture overview.

## License

MIT
