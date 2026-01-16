# Quickstart: Architecture Review Fixes

**Feature**: 024-arch-review-fixes
**Date**: 2026-01-10

## Overview

This guide covers the implementation of four fixes identified in the architecture review:

1. Button double-event bug fix (P1)
2. CLI registry alignment (P2)
3. CLI template expansion (P2)
4. MDX documentation completion (P3)

## 1. Button Double-Event Fix

### Location
`packages/wc/src/components/button/button.ts`

### The Fix

Remove `this.click()` from the keyboard handler to prevent double event emission:

```typescript
// BEFORE (buggy)
private handleKeyDown(event: KeyboardEvent): void {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (!this.disabled && !this.loading) {
      emitEvent(this, StandardEvents.PRESS, {
        detail: { originalEvent: event, target: this, isKeyboard: true },
      });
      this.click(); // BUG: This triggers handleClick() which emits again
    }
  }
}

// AFTER (fixed)
private handleKeyDown(event: KeyboardEvent): void {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (!this.disabled && !this.loading) {
      emitEvent(this, StandardEvents.PRESS, {
        detail: { originalEvent: event, target: this, isKeyboard: true },
      });
      // Removed: this.click();
    }
  }
}
```

### Also Remove
- The unused `handleActivate()` method (lines 93-96)
- The behavior callback `onActivate: () => this.handleActivate()` in `connectedCallback()`

### Test

```typescript
// packages/wc/tests/unit/button.test.ts
it("should emit exactly one ds:press event on keyboard activation", async () => {
  const button = await fixture<DsButton>(html`<ds-button>Test</ds-button>`);
  let eventCount = 0;
  button.addEventListener("ds:press", () => eventCount++);

  // Simulate Enter key
  const keyEvent = new KeyboardEvent("keydown", { key: "Enter" });
  button.dispatchEvent(keyEvent);

  expect(eventCount).toBe(1);
});
```

---

## 2. CLI Registry Alignment

### Location
`packages/cli/registry/components.json`

### Add Missing Entries

Add these entries to the `components` array:

```json
{
  "name": "layout",
  "description": "Layout primitives including Flow, Container, Grid, Box, and Spacer",
  "version": "0.0.1",
  "frameworks": ["react", "wc"],
  "registryDependencies": [],
  "dependencies": [],
  "files": [
    { "path": "layout.tsx", "target": "layout.tsx", "type": "tsx", "framework": "react" }
  ]
},
{
  "name": "radio",
  "description": "Individual radio button input for use within radio groups",
  "version": "0.0.1",
  "frameworks": ["react", "wc"],
  "registryDependencies": [],
  "dependencies": [],
  "files": [
    { "path": "radio.tsx", "target": "radio.tsx", "type": "tsx", "framework": "react" }
  ]
}
```

### Verification Script

```bash
# Compare WC components to CLI registry
WC_COMPONENTS=$(ls packages/wc/src/components/ | sort)
CLI_COMPONENTS=$(jq -r '.components[].name' packages/cli/registry/components.json | sort)
diff <(echo "$WC_COMPONENTS") <(echo "$CLI_COMPONENTS")
```

---

## 3. CLI Template Expansion

### Location
`packages/cli/templates/`

### Template Generation Pattern

For each missing component, create a template directory with the React adapter:

```bash
# Example: Create accordion template
mkdir -p packages/cli/templates/accordion
cp packages/react/src/components/accordion/*.tsx packages/cli/templates/accordion/
```

### Import Transformation

Templates must use these import patterns:

```typescript
// Transform FROM (React package)
import { createAccordionBehavior } from "@ds/primitives-dom";
import { Slot } from "../primitives/slot";

// Transform TO (CLI template)
import { createAccordionBehavior } from "@hypoth-ui/primitives-dom";
import { Slot } from "@/lib/primitives/slot";
```

### Batch Script

```bash
#!/bin/bash
# sync-templates.sh - Sync React adapters to CLI templates

REACT_DIR="packages/react/src/components"
TEMPLATES_DIR="packages/cli/templates"

for component in $(ls $REACT_DIR); do
  if [ ! -d "$TEMPLATES_DIR/$component" ]; then
    mkdir -p "$TEMPLATES_DIR/$component"
    # Copy and transform imports
    for file in $REACT_DIR/$component/*.tsx; do
      sed 's|@ds/primitives-dom|@hypoth-ui/primitives-dom|g; s|"\.\./primitives/|"@/lib/primitives/|g' \
        "$file" > "$TEMPLATES_DIR/$component/$(basename $file)"
    done
    echo "Created template: $component"
  fi
done
```

---

## 4. MDX Documentation Completion

### Location
`packages/docs-content/components/`

### MDX Template

Use this template for new component docs:

```markdown
---
title: [Component Name]
description: [One-line description]
component: [component-id]
status: stable
category: [category]
order: [number]
---

# [Component Name]

[Description paragraph]

## Usage

### Web Component

\`\`\`html
<ds-[component]>[content]</ds-[component]>
\`\`\`

### React

\`\`\`tsx
import { [Component] } from "@ds/react";

function Example() {
  return <[Component]>[content]</[Component]>;
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `prop1` | `string` | `""` | Description |

## Accessibility

- Keyboard: [keyboard interactions]
- ARIA: [aria patterns]
- Screen reader: [announcements]

## Best Practices

### Do

- [Good practice 1]
- [Good practice 2]

### Don't

- [Anti-pattern 1]
- [Anti-pattern 2]
```

### Generating from Manifests

Each WC component has a manifest with accessibility data:

```bash
# Read accessibility data from manifest
cat packages/wc/src/components/accordion/manifest.json | jq '.accessibility'
```

Use this data to populate the Accessibility section of the MDX.

---

## Verification Checklist

### Button Fix
- [ ] `handleKeyDown` no longer calls `this.click()`
- [ ] `handleActivate` method removed
- [ ] Tests pass with single event emission
- [ ] Mouse click still works (emits once)
- [ ] Keyboard Enter/Space still works (emits once)

### CLI Registry
- [ ] `layout` entry added
- [ ] `radio` entry added
- [ ] `hypoth-ui list` shows all 55+ components
- [ ] No duplicate entries

### CLI Templates
- [ ] 54 template directories exist
- [ ] All templates have valid imports
- [ ] `hypoth-ui add [component] --style copy` works for all components

### MDX Documentation
- [ ] 55 MDX files exist
- [ ] All frontmatter is valid
- [ ] All required sections present
- [ ] Accessibility section populated from manifests

---

## Running Tests

```bash
# Button tests
pnpm --filter @ds/wc test -- --run button

# Full test suite
pnpm test

# Verify CLI
cd /tmp && mkdir test-project && cd test-project
pnpm init -y
npx @hypoth-ui/cli init
npx @hypoth-ui/cli add button --style copy
```
