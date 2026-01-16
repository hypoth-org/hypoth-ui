# Data Model: Architecture Review Fixes

**Feature**: 024-arch-review-fixes
**Date**: 2026-01-10

## Overview

This feature primarily modifies existing data structures rather than introducing new entities. The main data artifacts are:

1. **CLI Registry** (`components.json`) - Component metadata for CLI operations
2. **CLI Templates** (`.tsx` files) - Bundled source code for copy mode
3. **MDX Documentation** (`.mdx` files) - User-facing component documentation
4. **Button Event Detail** - Event payload structure (minor change)

---

## 1. CLI Registry Entry Schema

**Location**: `packages/cli/registry/components.json`

### Existing Schema (no changes required)

```typescript
interface ComponentRegistry {
  version: string;
  components: ComponentDefinition[];
}

interface ComponentDefinition {
  /** Unique component identifier (kebab-case) */
  name: string;

  /** Human-readable description */
  description: string;

  /** Semantic version */
  version: string;

  /** Supported frameworks */
  frameworks: ("react" | "wc")[];

  /** Component dependencies within the registry */
  registryDependencies: string[];

  /** npm package dependencies */
  dependencies: string[];

  /** Source files to copy in copy mode */
  files: ComponentFile[];
}

interface ComponentFile {
  /** Source path relative to template directory */
  path: string;

  /** Target path relative to user's components directory */
  target: string;

  /** File type for transformation handling */
  type: "ts" | "tsx" | "css" | "json";

  /** Framework filter (omit for shared files) */
  framework?: "react" | "wc";
}
```

### New Entries Required

**layout** entry:
```json
{
  "name": "layout",
  "description": "Layout primitives for page composition including Flow, Container, Grid, and Spacer",
  "version": "0.0.1",
  "frameworks": ["react", "wc"],
  "registryDependencies": [],
  "dependencies": [],
  "files": [
    { "path": "layout.tsx", "target": "layout.tsx", "type": "tsx", "framework": "react" }
  ]
}
```

**radio** entry:
```json
{
  "name": "radio",
  "description": "Individual radio button for use within radio groups",
  "version": "0.0.1",
  "frameworks": ["react", "wc"],
  "registryDependencies": ["radio-group"],
  "dependencies": [],
  "files": [
    { "path": "radio.tsx", "target": "radio.tsx", "type": "tsx", "framework": "react" }
  ]
}
```

---

## 2. CLI Template File Structure

**Location**: `packages/cli/templates/[component-name]/`

### Template Organization

```
packages/cli/templates/
├── accordion/
│   └── accordion.tsx          # React adapter
├── alert/
│   └── alert.tsx
├── alert-dialog/
│   ├── alert-dialog-root.tsx  # Compound component parts
│   ├── alert-dialog-trigger.tsx
│   ├── alert-dialog-content.tsx
│   └── index.tsx              # Re-exports
├── ...
└── visually-hidden/
    └── visually-hidden.tsx
```

### Template Import Conventions

Templates use these import aliases (transformed by CLI):

| Alias | Transforms To |
|-------|---------------|
| `@/components/` | User's configured components path |
| `@/lib/` | User's configured lib path |
| `@hypoth-ui/primitives-dom` | npm package (installed as dependency) |

---

## 3. MDX Documentation Schema

**Location**: `packages/docs-content/components/[component].mdx`

### Frontmatter Schema

```typescript
interface MDXFrontmatter {
  /** Display title */
  title: string;

  /** One-line description for meta tags and listings */
  description: string;

  /** Component ID (matches registry name) */
  component: string;

  /** Release status */
  status: "alpha" | "beta" | "stable";

  /** Category for grouping */
  category: "actions" | "forms" | "feedback" | "layout" | "navigation" | "overlays" | "data-display" | "utilities";

  /** Sort order within category */
  order: number;
}
```

### Required Sections

| Section | Content |
|---------|---------|
| `# [Title]` | Main heading matching frontmatter title |
| `## Usage` | WC and React code examples |
| `## Props` / `## Attributes` | Property documentation table |
| `## Accessibility` | Keyboard support, ARIA patterns, screen reader notes |
| `## Best Practices` | Do/Don't guidance |

### Props Table Format

```markdown
## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary"` | `"primary"` | Visual style variant |
| `disabled` | `boolean` | `false` | Whether the component is disabled |
```

---

## 4. Button Event Detail Schema

**Location**: `packages/wc/src/components/button/button.ts`

### Current Schema (unchanged)

```typescript
interface PressEventDetail {
  /** Original DOM event that triggered the press */
  originalEvent: MouseEvent | KeyboardEvent;

  /** Reference to the button element */
  target: DsButton;

  /** Whether activation was via keyboard (Enter/Space) vs mouse click */
  isKeyboard: boolean;
}
```

**Usage**: `emitEvent(this, StandardEvents.PRESS, { detail: PressEventDetail })`

The schema remains unchanged; the fix ensures this event is emitted exactly once per activation.

---

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLI Registry                                 │
│  components.json                                                 │
│  ├── ComponentDefinition[]                                       │
│  │   ├── name ─────────────────┐                                │
│  │   ├── files[] ──────────────┼──► Template Directory          │
│  │   └── registryDependencies[]│    templates/[name]/           │
│  │                             │                                 │
│  └───────────────────────────┐ │                                │
│                              │ │                                │
│              ┌───────────────┼─┘                                │
│              ▼               ▼                                   │
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │ MDX Docs        │  │ WC Manifest     │                       │
│  │ components/     │  │ manifest.json   │                       │
│  │ [name].mdx      │◄─┤ (a11y data)     │                       │
│  │                 │  │                 │                       │
│  │ - frontmatter   │  │ - apgPattern    │                       │
│  │ - usage         │  │ - keyboard      │                       │
│  │ - props         │  │ - ariaPatterns  │                       │
│  │ - accessibility │  │ - tokensUsed    │                       │
│  └─────────────────┘  └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Validation Rules

### CLI Registry
- `name` must be unique across all entries
- `name` must be kebab-case
- `registryDependencies` must reference existing `name` values
- `files[].path` must exist in `templates/[name]/` directory

### CLI Templates
- All imports must use recognized aliases (`@/`, `@hypoth-ui/`)
- File must be valid TypeScript/TSX
- Must export at least one named component

### MDX Documentation
- Frontmatter `component` must match a registry `name`
- Must include all required sections (Usage, Props/Attributes, Accessibility)
- Props table must have consistent column format

---

## State Transitions

### Component Status Lifecycle

```
alpha → beta → stable
         ↓
    deprecated → removed
```

Components in this feature are all `stable` status. No state transitions introduced.

### Button Event Flow (After Fix)

```
Mouse Click:
  click event → handleClick() → emit ds:press (isKeyboard: false)

Keyboard (Enter/Space):
  keydown event → handleKeyDown() → emit ds:press (isKeyboard: true)
                                    [NO click() call]
```

Previously, keyboard path also called `this.click()`, causing double emission.
