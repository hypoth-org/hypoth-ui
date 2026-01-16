# Research: Architecture Review Fixes

**Feature**: 024-arch-review-fixes
**Date**: 2026-01-10

## 1. Button Double-Event Bug

### Problem Analysis

**Location**: `packages/wc/src/components/button/button.ts`

**Root Cause** (lines 115-133):
```typescript
private handleKeyDown(event: KeyboardEvent): void {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (!this.disabled && !this.loading) {
      // Problem 1: Emits ds:press with isKeyboard: true
      emitEvent(this, StandardEvents.PRESS, { detail: { isKeyboard: true } });
      // Problem 2: Calls this.click() which triggers handleClick()
      this.click();  // This calls handleClick() which emits ds:press again with isKeyboard: false
    }
  }
}
```

The `handleClick()` method (lines 98-113) also emits `ds:press`, so keyboard activation emits the event twice.

### Decision: Remove `this.click()` from keyboard handler

**Rationale**:
- The `ds:press` event is the semantic action event; native click is not needed for event consumers
- Removing `this.click()` eliminates duplicate events
- Keyboard users get `isKeyboard: true` in event detail (useful for analytics, focus management)
- Mouse users get `isKeyboard: false` in event detail

**Alternatives Considered**:
1. **Remove emit from handleKeyDown, keep this.click()**: Rejected - loses `isKeyboard` distinction
2. **Add flag to prevent double-emit**: Rejected - adds complexity, state management
3. **Remove this.click() from handleKeyDown**: ✅ Selected - simplest, clean semantics

**Implementation**:
```typescript
private handleKeyDown(event: KeyboardEvent): void {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (!this.disabled && !this.loading) {
      emitEvent(this, StandardEvents.PRESS, {
        detail: {
          originalEvent: event,
          target: this,
          isKeyboard: true,
        },
      });
      // Remove: this.click();
    }
  }
}
```

**Note**: Also remove the unused `handleActivate()` method (lines 93-96) and the behavior callback that calls it, since click is no longer triggered programmatically.

---

## 2. CLI Registry Alignment

### Current State

**Registry location**: `packages/cli/registry/components.json`
**Registry count**: 54 components
**WC count**: 55 components

**Missing from CLI registry**:
- `layout` - exists in WC at `packages/wc/src/components/layout/`
- `radio` - exists in WC at `packages/wc/src/components/radio/`

**Naming inconsistency**:
- CLI has `radio-group`
- WC has both `radio` and `radio-group` as separate directories

### Decision: Add missing entries, verify naming

**Rationale**:
- CLI registry should match WC components 1:1
- `radio` and `radio-group` appear to be separate components (individual radio vs grouped radios)
- Both should be in CLI registry

**Implementation**:
1. Add `layout` entry to `components.json` with files from `packages/wc/src/components/layout/`
2. Add `radio` entry to `components.json` with files from `packages/wc/src/components/radio/`
3. Verify `radio-group` entry exists (it does)
4. Final count: 56 CLI registry entries matching 55 WC component directories

Wait - need to recount. Let me verify the exact component lists.

**Verification needed during implementation**:
- Compare `ls packages/wc/src/components/` vs `jq '.components[].name' packages/cli/registry/components.json`
- Ensure 1:1 mapping

---

## 3. CLI Template Coverage

### Current State

**Templates location**: `packages/cli/templates/`
**Current templates**: 6 components (button, checkbox, dialog, field, input, select)
**Target**: 54+ components (all registry entries)

### Template Structure Pattern

Each template directory contains framework-specific source files:

```
templates/
└── button/
    └── button.tsx    # React adapter source
```

Templates are React components that use:
- `@hypoth-ui/primitives-dom` for behavior
- `@/lib/primitives/slot` for polymorphism
- Standard React patterns (forwardRef, hooks)

### Decision: Generate templates from existing React adapters

**Rationale**:
- React adapters already exist in `packages/react/src/components/`
- Templates should match adapter structure with import path adjustments
- Import transformation is already implemented in CLI (`@/components/`, `@/lib/`)

**Implementation Strategy**:
1. Use existing React adapter source as template basis
2. Adjust imports to use template aliases (`@/` prefix)
3. Bundle in `packages/cli/templates/[component-name]/`
4. One `.tsx` file per component (or multiple for compound components)

**Template Generation Script** (recommended):
```bash
# For each component in packages/react/src/components/
# 1. Copy the main component file(s)
# 2. Transform imports from "@ds/react" to relative
# 3. Transform imports from "@ds/primitives-dom" to "@hypoth-ui/primitives-dom"
# 4. Place in packages/cli/templates/[component]/
```

**Alternatives Considered**:
1. **Manual creation**: Rejected - 48 new templates is too manual
2. **Symlinks to react package**: Rejected - CLI bundles need to be self-contained
3. **Copy with transform script**: ✅ Selected - automated, maintainable

---

## 4. MDX Documentation Coverage

### Current State

**MDX location**: `packages/docs-content/components/`
**Current docs**: 25 MDX files
**Target**: 55 MDX files (all WC components)

### MDX Structure Pattern

Existing MDX files follow this structure:
```markdown
---
title: [Component Name]
description: [One-line description]
component: [component-id]
status: stable
category: [actions|forms|feedback|layout|etc]
order: [number]
---

# [Component Name]

[Description paragraph]

## Usage
[WC and React examples]

## Variants
[If applicable]

## Sizes
[If applicable]

## States
[Loading, disabled, etc.]

## Accessibility
[Keyboard, ARIA, screen reader notes]

## Best Practices
[Do/Don't lists]
```

### Decision: Generate MDX from WC manifests + templates

**Rationale**:
- WC manifests contain a11y patterns, keyboard support, tokens used
- Consistent structure across all components
- Can be semi-automated with template + manifest data

**Implementation Strategy**:
1. Create MDX template with placeholder sections
2. For each component missing MDX:
   - Read `packages/wc/src/components/[component]/manifest.json` for a11y data
   - Read component source for props/attributes
   - Generate MDX with Usage, Props, Accessibility sections
3. Manual review pass for quality

**Missing MDX files** (30 components):
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, calendar, card, collapsible, command, context-menu, data-table, drawer, dropdown-menu, hover-card, layout, list, navigation-menu, pagination, progress, radio-group, scroll-area, separator, sheet, skeleton, stepper, table, tabs, tag, toast, tree

---

## Summary of Decisions

| Area | Decision | Effort |
|------|----------|--------|
| Button bug | Remove `this.click()` from keyboard handler | Small (1 file) |
| CLI registry | Add `layout` and `radio` entries | Small (1 file) |
| CLI templates | Script-based generation from React adapters | Medium (48 files) |
| MDX docs | Template-based generation with manifest data | Large (30 files) |

## Dependencies

- No new npm dependencies required
- Uses existing build infrastructure
- Tests can use existing Vitest setup

## Risks

1. **Template import paths**: Must verify all imports transform correctly
2. **MDX quality**: Generated docs may need manual polish
3. **Registry/WC mismatch**: Must verify exact component list alignment
