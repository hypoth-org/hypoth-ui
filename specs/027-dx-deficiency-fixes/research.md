# Research: DX Deficiency Fixes

**Date**: 2026-03-07
**Branch**: `027-dx-deficiency-fixes`

## 1. Peer Dependency Resolution in pnpm Publish

**Decision**: Use `>=0.1.0` for internal peerDependencies, widen React to `^18.0.0 || ^19.0.0`, Next.js to `^14.0.0 || ^15.0.0`.

**Rationale**: pnpm resolves `workspace:*` in `dependencies` and `devDependencies` during `pnpm publish`, converting them to actual version numbers. However, pnpm does NOT resolve `workspace:*` in `peerDependencies` — the literal string `workspace:*` gets published to npm, which npm cannot resolve. This was already fixed in `@hypoth-ui/next` and `@hypoth-ui/wc` packages but missed in `@hypoth-ui/react`.

**Alternatives considered**:
- `workspace:^` — Resolves to `^X.Y.Z` during publish, but still not resolved in peerDeps by pnpm
- Exact version pinning (`0.1.2`) — Too narrow; forces lockstep updates across packages
- `>=0.1.0` — Flexible, allows any future version, appropriate for alpha-stage internal peers

**Current state of affected files**:
- `packages/react/package.json` line 47: `"@hypoth-ui/wc": "workspace:*"` in peerDependencies — **must fix**
- `packages/next/package.json`: Already fixed to `>=0.1.2` — no change needed
- `packages/wc/package.json`: Already fixed — no change needed

## 2. "use client" Directive Placement

**Decision**: Add `"use client";` as line 1 of `packages/react/src/index.ts`.

**Rationale**: The main entry point exports ~60 interactive React components that use hooks (useState, useEffect, useRef, useMemo, useCallback). Without the directive, importing any component from `@hypoth-ui/react` in a Next.js Server Component causes a build error. The `client.ts` sub-entry already has `"use client"` but the main entry does not.

**Alternatives considered**:
- Per-component `"use client"` in each file — Granular but adds 60+ directives, error-prone if missed
- Split into `@hypoth-ui/react` (types-only) and `@hypoth-ui/react/client` (runtime) — Unnecessary since there are no server-safe runtime exports; `import type` works from "use client" modules
- Single directive on `index.ts` — Simplest, correct, and matches how Radix UI, Ark UI, and other React component libraries handle it

**Key insight**: `import type { ButtonProps } from "@hypoth-ui/react"` is unaffected by the `"use client"` directive — TypeScript type-only imports are erased at compile time and never trigger the client boundary.

## 3. Button API Consolidation

**Decision**: Make headless Button the canonical `Button` export everywhere. Rename WC-wrapper to `DsButton`.

**Rationale**: Two components named `Button` exist with incompatible APIs:

| Aspect | Headless Button | WC Wrapper Button |
|--------|-----------------|-------------------|
| File | `components/button/button.tsx` | `components/button.tsx` |
| Main entry | `Button` | `LegacyButton` |
| Client entry | Not exported | `Button` |
| Renders | `<button>` (native HTML) | `<ds-button>` (Web Component) |
| Press event | `onPress` callback | `onClick` handler |
| Styling | CSS classes | `variant`/`size` props |
| Responsive | No | Yes (object syntax) |

The headless Button is the correct canonical implementation: it uses behavior primitives from `@hypoth-ui/primitives-dom`, supports `asChild`, and follows the React adapter strategy defined in the constitution ("thin wrappers", "composition over polymorphism").

**Migration path**:
1. `import { Button } from "@hypoth-ui/react"` — No change (already headless)
2. `import { LegacyButton } from "@hypoth-ui/react"` — Change to `import { DsButton } from "@hypoth-ui/react/client"`
3. `import { Button } from "@hypoth-ui/react/client"` — Change to `import { DsButton } from "@hypoth-ui/react/client"`

## 4. Event Naming Audit

**Decision**: Standardize on `on` + PascalCase for all React event props. The WC `ds:` prefix naming is already correct and stays unchanged.

**Rationale**: Comprehensive audit of all React adapter components reveals the naming is mostly consistent, with one major exception:

**Already correct (no changes needed)**:
- `onOpenChange` — Dialog, Select, Drawer, Collapsible, Menu, DatePicker, Combobox
- `onValueChange` — Accordion, Tabs, Select, Slider, DatePicker, NumberInput, PinInput, Combobox
- `onChange` — Checkbox, Switch, RadioGroup, Input (maps to `ds:change` or native `change`)
- `onSelect` — Menu
- `onComplete` — PinInput
- `onError`, `onFilesAdd`, `onFileRemove`, `onFilesChange` — FileUpload

**Needs change**:
- WC wrapper Button uses `onClick` mapping native click — should use `onPress` if wrapping `ds:press` (or be renamed to DsButton which resolves via Button unification)

**Implementation patterns found**:
1. **Direct addEventListener** — Simple components (Checkbox, Switch, etc.) use `useEffect` + `addEventListener` on the WC element
2. **Behavior primitives** — Compound components (Dialog, Select, Menu, etc.) use `createDialogBehavior()` etc. from `@hypoth-ui/primitives-dom`, which manages event handling internally
3. **createComponent() factory** — Exists in `utils/create-component.ts` but is NOT used by any component

**Decision on createComponent()**: Keep but do not mandate migration. The manual pattern is well-established and works. Forcing all components through a factory would be a large refactor with no user-facing benefit.

## 5. CSS ↔ WC Circular Dependency

**Decision**: Move `@hypoth-ui/wc` from `dependencies` to `devDependencies` in `packages/css/package.json`.

**Rationale**: The CSS package imports component CSS from WC source files during its PostCSS build. At runtime, the published CSS package is a self-contained `.css` file with no JavaScript or WC dependency. Therefore `@hypoth-ui/wc` is a build-time-only dependency.

Current state:
- `packages/css/package.json` → `@hypoth-ui/wc` in `dependencies` (line 36) — **must move to devDependencies**
- `packages/wc/package.json` → `@hypoth-ui/css` in `peerDependencies` (line 79) — correct, keep as-is

## 6. DsLoader Selective Loading

**Decision**: Add documentation for `include` and `exclude` props to both the main README.md and `packages/next/README.md`.

**Rationale**: The feature is fully implemented with JSDoc comments in source but completely absent from published READMEs. Props:
- `include?: ComponentTag[]` — Register only specified tags
- `exclude?: ComponentTag[]` — Register all except specified tags
- `include` takes precedence when both are provided
- `debug?: boolean` — Console logging for troubleshooting
- `onLoad?: () => void` — Callback after registration completes

## 7. EmptyState Component

**Decision**: Create a compound component with sub-components: `EmptyState`, `EmptyState.Icon`, `EmptyState.Title`, `EmptyState.Description`, `EmptyState.Action`.

**Rationale**: EmptyState is a purely presentational, composable pattern. The compound component pattern (used by Dialog, Accordion, Tabs, etc.) is the established approach in this design system.

**Alternatives considered**:
- Props-based (`<EmptyState title="..." description="..." />`) — Less flexible, doesn't support custom content
- Slot-based (WC `<slot name="title">`) — Would require Shadow DOM which violates constitution (Light DOM by default)
- Compound component — Follows existing patterns, maximum flexibility, Light DOM compatible
