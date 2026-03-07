# @hypoth-ui/wc

Lit-based Web Components with Light DOM rendering for the hypoth-ui design system. Framework-agnostic custom elements that work with any frontend stack.

## Installation

```bash
npm install @hypoth-ui/wc
```

### Peer Dependencies

```bash
npm install @hypoth-ui/css @hypoth-ui/tokens
```

## Usage

```html
<script type="module">
  import '@hypoth-ui/wc/primitives';
</script>

<ds-button variant="primary">Click me</ds-button>
```

### Granular Imports (Recommended)

Import from category-specific entry points for optimal bundle size:

```typescript
import { DsButton, DsLink, DsIcon } from "@hypoth-ui/wc/primitives";
import { DsInput, DsCheckbox, DsSwitch } from "@hypoth-ui/wc/form-controls";
import { DsDialog, DsPopover, DsTooltip } from "@hypoth-ui/wc/overlays";
import { DsTabs, DsAccordion, DsBreadcrumb } from "@hypoth-ui/wc/navigation";
import { DsAvatar, DsTable, DsBadge } from "@hypoth-ui/wc/data-display";
import { DsAlert, DsToast, DsProgress } from "@hypoth-ui/wc/feedback";
import { DsCard, DsSeparator } from "@hypoth-ui/wc/layout";
```

### Events

Components emit custom events with the `ds:` prefix:

```typescript
document.querySelector('ds-select')
  .addEventListener('ds:change', (e) => {
    console.log(e.detail.value);
  });
```

## Documentation

See the [main README](../../README.md) for full documentation and architecture overview.

## License

MIT
