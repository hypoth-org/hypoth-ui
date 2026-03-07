# Research: Consumer Adoption Fixes

**Feature**: 028-consumer-adoption-fixes
**Date**: 2026-03-07

## R1: Entry Point Architecture — How to Make Main Entry Server-Safe

**Decision**: Remove `"use client"` from `packages/react/src/index.ts` and remove all runtime re-exports. Main entry exports types only + pure utility functions. All runtime components live exclusively in `/client`.

**Rationale**: Each component file already has its own `"use client"` directive at the file level. The barrel `"use client"` in index.ts is redundant and forces a client boundary even for type-only imports. Removing it from the barrel while keeping it in individual component files is the standard pattern (Radix UI, Ark UI). Per Alpha Policy, no backward-compat concern.

**Alternatives considered**:
- Keep runtime re-exports in main entry but remove barrel `"use client"` → individual component `"use client"` directives would still create client boundaries per-import, but `import type` would be server-safe. Simpler but leaves a confusing dual-source pattern.
- Add tsup banner injection like `@hypoth-ui/next` does → Would re-add the same problem at build time.

## R2: Deprecated Event Constants — Can They Be Removed?

**Decision**: Complete the OPEN/CLOSE → OPEN_CHANGE migration across all 11 remaining components, then delete the dead constants (OPEN, CLOSE, BEFORE_CLOSE, CLICK).

**Rationale**: The migration was started but only Dialog and Select were updated to use OPEN_CHANGE. The other 11 components (sheet, drawer, alert-dialog, dropdown-menu, context-menu, popover, combobox, hover-card, collapsible, date-picker, menu) still emit separate OPEN/CLOSE events. This is an incomplete refactor — the `@deprecated` tags were premature markers for a migration that stalled.

OPEN_CHANGE is the better API: a single `ds:open-change` event with `{ open: boolean, reason?: string }` detail is cleaner than separate OPEN/CLOSE events. This aligns with the `ds:` event naming convention documented in CLAUDE.md. The migration is mechanical (~35 `emitEvent` calls):
- `emitEvent(this, StandardEvents.OPEN)` → `emitEvent(this, StandardEvents.OPEN_CHANGE, { detail: { open: true } })`
- `emitEvent(this, StandardEvents.CLOSE)` → `emitEvent(this, StandardEvents.OPEN_CHANGE, { detail: { open: false } })`
- For cancelable close: add `cancelable: true` and `reason` detail (matching Dialog pattern)

After migration, OPEN, CLOSE, BEFORE_CLOSE, and CLICK constants are deleted from StandardEvents. BEFORE_CLOSE is superseded by cancelable OPEN_CHANGE. CLICK is superseded by PRESS (no usages found).

**Alternatives considered**:
- Remove only `@deprecated` tags, keep constants → Leaves inconsistent event API (2 components use OPEN_CHANGE, 11 use OPEN/CLOSE). Technical debt.
- Keep `@deprecated` tags as internal documentation → Violates Alpha Policy and IDE shows misleading strikethroughs.

## R3: LightElement Alias — Can It Be Removed?

**Decision**: Remove the `LightElement` alias and migrate all references to `DSElement`.

**Rationale**: `LightElement` is used in:
- `tooling/scripts/new-component.ts` (component generator template)
- `CONTRIBUTING.md` (documentation examples)
- `packages/wc/tests/base/ds-element.test.ts` (compat test)
- `packages/wc/src/base/index.ts`, `src/index.ts`, `src/core.ts` (re-exports)

All usages are internal tooling/docs — no external consumers. Migration is straightforward: rename references from `LightElement` to `DSElement`. Remove the compat test (tests an alias that no longer exists). Per Alpha Policy, no backward-compat concern.

## R4: Dependency Optimization — Making date-fns and lucide Optional

**Decision**: Move `date-fns`, `@date-fns/tz`, and `lucide` from direct dependencies to `peerDependencies` with `peerDependenciesMeta` marking them optional.

**Rationale**:
- **lucide**: Only `packages/wc/src/components/icon/icon-adapter.ts` imports it
- **date-fns**: Only `packages/wc/src/components/date-picker/date-utils.ts` imports it
- Consumers using only Button/Input/Dialog shouldn't install 3 extra packages
- `peerDependenciesMeta: { "date-fns": { "optional": true } }` lets npm/pnpm skip them without warnings

**Alternatives considered**:
- Subpath imports (`@hypoth-ui/wc/button`) → Requires package.json exports restructuring for all components. Larger scope.
- Dynamic imports at runtime → Adds complexity and async loading. Unnecessary.

## R5: Client Entry Gap — Scope of Missing Exports

**Decision**: Add all 48+ missing runtime components to `packages/react/src/client.ts`.

**Missing components** (currently only in index.ts, not in client.ts):
- Form controls: Field, Label, FieldDescription, FieldError, Textarea, Checkbox, RadioGroup, Radio, Switch
- Overlays: Dialog, Popover, PopoverContent, Tooltip, TooltipContent, AlertDialog, Sheet, Drawer
- Menus: Menu, Select, Combobox, DropdownMenu, ContextMenu
- Advanced inputs: DatePicker, Slider, NumberInput, FileUpload, TimePicker, PinInput
- Structure: Card, Separator, AspectRatio, Collapsible, Tabs, Accordion, HoverCard, NavigationMenu, ScrollArea, Breadcrumb, Pagination, Stepper, Command
- Layout: Flow, Container, Grid, LayoutBox, Page, Section, AppShell, Spacer, Center, Split, Wrap, Stack, Inline
- Theme: ThemeProvider, DensityProvider, useTheme, useThemeState, useColorMode, useDensity, useDensityContext, getThemeScriptContent, getThemeScriptTag, getThemeScriptProps, parseThemeCookie, getSystemColorMode, syncThemeStorage
- Compound: EmptyState and parts
- Hooks: useStableId, useStableIds, useScopedIdGenerator, useConditionalId
- Primitives: Presence, usePresence

## R6: README Code Samples — Verified Issues

**Decision**: Rewrite all code examples in README.md to use the correct APIs.

**Issues found**:
1. Getting Started imports `Button` from `@hypoth-ui/react` — should use `DsButton` from `@hypoth-ui/react/client`
2. React Quick-Start uses `<Dialog>` as wrapper — should be `<Dialog.Root>`
3. React Quick-Start imports from `@hypoth-ui/react` — should import from `@hypoth-ui/react/client`
4. Alpha badge and Alpha Notice section — should be removed
5. Next.js example imports `Button` from `@hypoth-ui/react` — should use `DsButton` from `/client`

## R7: Alpha Text in Package Descriptions

**Decision**: Remove "(Alpha)" from all 12 package.json description fields.

**Affected packages**: @hypoth-ui/react, @hypoth-ui/next, @hypoth-ui/wc, @hypoth-ui/css, @hypoth-ui/tokens, @hypoth-ui/cli, @hypoth-ui/primitives-dom, @hypoth-ui/docs-core, @hypoth-ui/docs-content, @hypoth-ui/docs-renderer-next, @hypoth-ui/test-utils, @hypoth-ui/a11y-audit
