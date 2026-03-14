# Tasks: Component Styling Tokens

**Input**: Design documents from `/specs/029-component-styling-tokens/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. US1 and US2 (both P1) are combined because the same migration work satisfies both stories simultaneously.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Extend the token build pipeline and create directory structure for the new token tiers

- [x] T001 Create `packages/tokens/src/tokens/type/` directory and add placeholder `.gitkeep`; create `packages/tokens/src/tokens/component/` directory and add placeholder `.gitkeep`
- [x] T002 Extend the DTCG token compiler in `packages/tokens/src/build/build.ts` to discover and load JSON files from `src/tokens/type/` as a new "type" tier, resolving `{reference}` syntax against semantic tokens and emitting `dist/css/type-tokens.css` with all type token CSS custom properties inside `@layer tokens`
- [x] T003 Extend the DTCG token compiler in `packages/tokens/src/build/build.ts` to discover and load JSON files from `src/tokens/component/` as a new "component" tier, resolving `{reference}` syntax against type and semantic tokens and emitting `dist/css/component-tokens.css` with all component token CSS custom properties inside `@layer tokens`
- [x] T004 Extend TypeScript type generation in `packages/tokens/src/build/build.ts` to export union types for type-tier token paths (`TypeTokenPath`) and component-tier token paths (`ComponentTokenPath`) in `dist/ts/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update semantic tokens to the new visual baseline (oklch, Geist, color-blind palette) and create all six type token category files

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Semantic Token Updates

- [x] T005 Update semantic color tokens in `packages/tokens/src/tokens/semantic/colors.json` to oklch values: primary blue (`oklch(0.55 0.19 250)` default/hover/active/foreground/subtle), destructive vermillion (`oklch(0.55 0.2 35)` states), success teal (`oklch(0.55 0.14 185)` states), warning amber (`oklch(0.75 0.15 70)` states), plus neutral background/foreground/border/muted/secondary values per the shadcn mapping in research.md section 5
- [x] T006 [P] Update font-family tokens in `packages/tokens/src/tokens/primitives/typography.json`: set `font.family.sans` to `'Geist', system-ui, -apple-system, sans-serif` and `font.family.mono` to `'Geist Mono', ui-monospace, monospace`
- [x] T007 [P] Update dark mode semantic color overrides in `packages/tokens/src/tokens/modes/dark.json` to use oklch dark-mode equivalents of the new palette (blue primary, teal success, vermillion destructive) — invert lightness values: L=0.55→L=0.65 for defaults, adjust background/foreground/border for dark surfaces
- [x] T008 [P] Update high-contrast mode overrides in `packages/tokens/src/tokens/modes/high-contrast.json` to use maximum-contrast oklch variants of the new palette (increase chroma, push lightness to extremes)
- [x] T009 [P] Update status color aliases in `packages/tokens/src/tokens/semantic/status.json` to reference the new teal success and vermillion destructive semantic tokens, maintaining info/success/warning/error pattern with `default`, `hover`, `foreground`, `background`, `border` variants

### Type Token Definitions

- [x] T010 [P] Create `packages/tokens/src/tokens/type/actions.json` with DTCG tokens for the actions category: sizing tokens (height, padding-x, padding-y, font-size at sm/md/lg scales), appearance tokens (font-weight, border-radius, gap), and variant color tokens (primary/secondary/ghost/destructive bg/color/hover/active states, disabled, focus-ring) — all referencing semantic tokens via `{reference}` syntax per the token API contract
- [x] T011 [P] Create `packages/tokens/src/tokens/type/form-controls.json` with DTCG tokens: appearance (bg, border-color, border-color-hover, border-color-focus, border-radius, focus-ring, error-color, error-border-color, placeholder-color), sizing (height, padding-x, padding-y, font-size at sm/md/lg), and state tokens (disabled bg/color/border-color) — all referencing semantic tokens
- [x] T012 [P] Create `packages/tokens/src/tokens/type/overlays.json` with DTCG tokens: bg, border-color, border-radius, shadow, padding, backdrop-color, z-index, max-width — all referencing semantic tokens
- [x] T013 [P] Create `packages/tokens/src/tokens/type/navigation.json` with DTCG tokens: item padding-x/y, item color/color-hover/color-active, item bg-hover/bg-active, item border-radius, indicator-color, separator-color — all referencing semantic tokens
- [x] T014 [P] Create `packages/tokens/src/tokens/type/feedback.json` with DTCG tokens: border-radius, padding, font-size, and per-severity (info/success/warning/error) bg/color/border-color — referencing semantic status tokens
- [x] T015 [P] Create `packages/tokens/src/tokens/type/containers.json` with DTCG tokens: bg, border-color, border-radius, shadow, padding — all referencing semantic tokens

### Integration

- [x] T016 Update `packages/css/src/layers/index.css` to import `@hypoth-ui/tokens/dist/css/type-tokens.css` and `@hypoth-ui/tokens/dist/css/component-tokens.css` within `@layer tokens`, after the existing `tokens.css` import
- [x] T017 Run `pnpm --filter @hypoth-ui/tokens build` and verify that `dist/css/tokens.css`, `dist/css/type-tokens.css`, and `dist/css/component-tokens.css` are all generated without errors; verify `dist/ts/index.ts` exports `TypeTokenPath` and `ComponentTokenPath` types

**Checkpoint**: Foundation ready — semantic tokens updated to new visual baseline, all six type token categories defined, build pipeline producing three-tier CSS output. User story implementation can now begin.

---

## Phase 3: US1+US2 — Actions Category Migration (Priority: P1) 🎯 MVP

**Goal**: Migrate all action components (Button, Link, Icon, Tag) to the tiered token system, proving that both per-component overrides (US1) and theme-wide cascade (US2) work end-to-end

**Independent Test US1**: Override `--ds-button-bg` → only Button changes. Override `--ds-button-primary-bg-hover` → only Button hover state changes. Other action components (Link, Icon) remain at defaults.

**Independent Test US2**: Override `--ds-color-primary-default` → all action components update consistently across all states. Override `--ds-action-primary-bg` → all action components change but other categories unaffected.

### Component Token Definitions

- [x] T018 [P] [US1] Create `packages/tokens/src/tokens/component/button.json` with DTCG component tokens: root tokens (height, padding-x, padding-y, font-size, font-weight, border-radius, gap), variant tokens (primary/secondary/ghost/destructive — each with bg, bg-hover, bg-active, color), state tokens (disabled-bg, disabled-color, focus-ring), and sub-element tokens (spinner: color, size; icon: size, gap) — all referencing actions type tokens via `{reference}` syntax per the token API contract in `contracts/token-api.md`
- [x] T019 [P] [US1] Create `packages/tokens/src/tokens/component/link.json` with DTCG component tokens: color, color-hover, color-active, color-visited, font-weight, text-decoration, focus-ring — referencing actions type tokens and semantic color tokens
- [x] T020 [P] [US1] Create `packages/tokens/src/tokens/component/icon.json` with DTCG component tokens: size-sm, size-md, size-lg, color, stroke-width — referencing semantic icon and color tokens
- [x] T021 [P] [US1] Create `packages/tokens/src/tokens/component/tag.json` with DTCG component tokens: bg, color, border-color, border-radius, padding-x, padding-y, font-size, font-weight, gap — referencing actions type tokens; also create `packages/wc/src/components/tag/tag.css` with component token references

### Component CSS Migration

- [x] T022 [US1] Rebuild tokens (`pnpm --filter @hypoth-ui/tokens build`) to compile new component token JSON files into `dist/css/component-tokens.css`
- [x] T023 [US1] Migrate `packages/wc/src/components/button/button.css`: replace all direct semantic/primitive token references (e.g., `var(--ds-color-primary-default)`, `var(--ds-spacing-component-padding-sm)`) and any hardcoded values with component token references (e.g., `var(--ds-button-primary-bg)`, `var(--ds-button-padding-x)`). Ensure every variant (primary, secondary, ghost, destructive) and every state (hover, active, focus-visible, disabled, loading) uses its own component token. Zero hardcoded color/spacing/radius values should remain.
- [x] T024 [P] [US1] Migrate `packages/wc/src/components/link/link.css`: replace all direct semantic token references with component token references (`var(--ds-link-color)`, `var(--ds-link-color-hover)`, etc.)
- [x] T025 [P] [US1] Migrate `packages/wc/src/components/icon/icon.css`: replace token references with component tokens (`var(--ds-icon-size-md)`, `var(--ds-icon-color)`)

**Checkpoint**: Actions category fully migrated. A consumer can override `--ds-button-primary-bg` to change only Button, or `--ds-action-primary-bg` to change all action components, or `--ds-color-primary-default` to change the entire primary palette. This validates both US1 and US2.

---

## Phase 4: US1+US2 — Form Controls Category Migration (Priority: P1)

**Goal**: Migrate all 14 form control components to the tiered token system, including complex compound components with sub-element tokens

**Independent Test**: Override `--ds-form-control-border-radius` → all inputs, selects, checkboxes, etc. adopt the new radius. Override `--ds-input-border-radius` → only Input changes.

### Component Token Definitions

- [x] T026 [P] [US1] Create component token JSON files for basic text inputs: `packages/tokens/src/tokens/component/input.json` (root: bg, border-color, border-color-hover, border-color-focus, border-radius, height, padding-x, font-size, color, placeholder-color, focus-ring, error-border-color; sub-elements: field, label) and `packages/tokens/src/tokens/component/textarea.json` (root: bg, border-color, border-radius, padding, font-size, color, min-height, focus-ring, error-border-color) — referencing form-controls type tokens
- [x] T027 [P] [US1] Create component token JSON files for selection controls: `packages/tokens/src/tokens/component/select.json` (trigger: bg, border-color, border-color-hover, height, padding-x, font-size, color, placeholder-color; content: bg, border-color, border-radius, shadow, z-index; option: padding-x, padding-y, bg-hover, bg-active, color), `packages/tokens/src/tokens/component/checkbox.json` (control: size, bg, border-color, border-radius, bg-checked, bg-hover; indicator: color; label: font-size, color), `packages/tokens/src/tokens/component/radio.json` (control: size, bg, border-color, bg-checked; indicator: color, size; label: font-size, color), `packages/tokens/src/tokens/component/switch.json` (track: width, height, bg, bg-checked; thumb: size, bg; label: gap, font-size, color) — all referencing form-controls type tokens
- [x] T028 [P] [US1] Create component token JSON files for advanced inputs: `packages/tokens/src/tokens/component/number-input.json`, `packages/tokens/src/tokens/component/pin-input.json`, `packages/tokens/src/tokens/component/combobox.json`, `packages/tokens/src/tokens/component/slider.json` — each with root and sub-element tokens per the data model, referencing form-controls type tokens
- [x] T029 [P] [US1] Create component token JSON files for date/time controls and remaining form controls: `packages/tokens/src/tokens/component/date-picker.json`, `packages/tokens/src/tokens/component/time-picker.json`, `packages/tokens/src/tokens/component/file-upload.json`, `packages/tokens/src/tokens/component/field.json`, `packages/tokens/src/tokens/component/calendar.json` (header, grid, cell sub-elements) — referencing form-controls type tokens; for file-upload and field, also create CSS files at `packages/wc/src/components/{component}/{component}.css` if they don't exist

### Component CSS Migration

- [x] T030 [US1] Rebuild tokens (`pnpm --filter @hypoth-ui/tokens build`) to compile all new form-control component tokens
- [x] T031 [US1] Migrate basic text input CSS: update `packages/wc/src/components/input/input.css` and `packages/wc/src/components/textarea/textarea.css` to reference component tokens. Replace all `var(--ds-color-*)`, `var(--ds-spacing-*)`, `var(--ds-radius-*)` references and hardcoded values with component-level tokens (e.g., `var(--ds-input-bg)`, `var(--ds-input-border-radius)`, `var(--ds-textarea-padding)`)
- [x] T032 [US1] Migrate selection control CSS: update `packages/wc/src/components/select/select.css`, `packages/wc/src/components/checkbox/checkbox.css`, `packages/wc/src/components/radio/radio.css`, `packages/wc/src/components/switch/switch.css`. For Select, replace all existing `--ds-select-*` and `--_select-*` internal tokens with the new component token pattern. Ensure sub-element tokens (trigger, content, option) are properly scoped.
- [x] T033 [P] [US1] Migrate advanced input CSS: update `packages/wc/src/components/number-input/number-input.css`, `packages/wc/src/components/pin-input/pin-input.css`, `packages/wc/src/components/combobox/combobox.css`, `packages/wc/src/components/slider/slider.css`. Replace existing `--_combobox-*`, `--_pin-input-*`, `--_slider-*` internal tokens with the new standardized component token pattern.
- [x] T034 [P] [US1] Migrate date/time control CSS: update `packages/wc/src/components/date-picker/date-picker.css`, `packages/wc/src/components/time-picker/time-picker.css`. Replace existing `--ds-datepicker-*`, `--ds-time-picker-*` internal tokens with standardized component tokens.

**Checkpoint**: All 14 form control components migrated. `--ds-form-control-border-radius: 0` makes every input, select, checkbox, etc. square-cornered. `--ds-select-trigger-bg` overrides only the Select trigger.

---

## Phase 5: US1+US2 — Remaining Categories Migration (Priority: P1)

**Goal**: Complete the migration for containers (12), overlays (10), navigation (5), and feedback (9) categories

**Independent Test**: Override `--ds-overlay-shadow` → all dialogs, popovers, tooltips, sheets adopt the new shadow. Override `--ds-dialog-content-shadow` → only Dialog changes.

### Containers (12 components)

- [x] T035 [P] [US2] Create component token JSON files for containers: `packages/tokens/src/tokens/component/card.json` (header, content, footer sub-elements), `packages/tokens/src/tokens/component/accordion.json` (item, trigger, content), `packages/tokens/src/tokens/component/collapsible.json`, `packages/tokens/src/tokens/component/table.json`, `packages/tokens/src/tokens/component/data-table.json`, `packages/tokens/src/tokens/component/scroll-area.json` (viewport, scrollbar, thumb), `packages/tokens/src/tokens/component/tree.json`, `packages/tokens/src/tokens/component/list.json`, `packages/tokens/src/tokens/component/separator.json`, `packages/tokens/src/tokens/component/aspect-ratio.json`, `packages/tokens/src/tokens/component/layout.json`, `packages/tokens/src/tokens/component/text.json` — all referencing containers type tokens. Create missing CSS files for table, data-table, tree, list.
- [x] T036 [US2] Migrate container component CSS files: update `packages/wc/src/components/card/card.css`, `accordion/accordion.css`, `collapsible/collapsible.css`, `scroll-area/scroll-area.css`, `separator/separator.css` — replace all existing `--ds-card-*`, `--ds-accordion-*`, `--ds-separator-*` internal tokens with standardized component tokens referencing containers type tier

### Overlays (10 components)

- [x] T037 [P] [US2] Create component token JSON files for overlays: `packages/tokens/src/tokens/component/dialog.json` (backdrop, content, title, description, close), `alert-dialog.json` (backdrop, content, header, footer, title, description), `popover.json` (content, arrow), `tooltip.json` (content, arrow), `sheet.json` (overlay, content, header, footer, title, description, close), `drawer.json`, `hover-card.json`, `context-menu.json` (content, item, separator, label), `dropdown-menu.json`, `command.json` (input, list, item, group, separator, empty) — all referencing overlays type tokens. Create missing CSS files for drawer, hover-card, dropdown-menu.
- [x] T038 [US2] Migrate overlay component CSS files: update `packages/wc/src/components/dialog/dialog.css`, `alert-dialog/alert-dialog.css`, `popover/popover.css`, `tooltip/tooltip.css`, `sheet/sheet.css`, `context-menu/context-menu.css`, `command/command.css` — replace existing `--ds-dialog-*`, `--ds-popover-*`, `--ds-tooltip-*`, `--ds-sheet-*`, `--_alert-dialog-*` internal tokens with standardized component tokens referencing overlays type tier

### Navigation (5 components)

- [x] T039 [P] [US2] Create component token JSON files for navigation: `packages/tokens/src/tokens/component/tabs.json` (list, trigger, content), `breadcrumb.json` (list, item, link, page, separator), `pagination.json` (item, link, previous, next, ellipsis), `navigation-menu.json` (list, item, trigger, content, viewport, link, indicator), `menu.json` (content, item) — all referencing navigation type tokens
- [x] T040 [US2] Migrate navigation component CSS files: update `packages/wc/src/components/tabs/tabs.css`, `breadcrumb/breadcrumb.css`, `pagination/pagination.css`, `navigation-menu/navigation-menu.css`, `menu/menu.css` — replace existing `--ds-tabs-*`, `--ds-menu-*` internal tokens with standardized component tokens referencing navigation type tier

### Feedback (8 components)

- [x] T041 [P] [US2] Create component token JSON files for feedback: `packages/tokens/src/tokens/component/alert.json`, `badge.json`, `toast.json`, `progress.json`, `spinner.json`, `skeleton.json`, `empty-state.json`, `stepper.json` (item, indicator, separator, trigger, title, description, content), `avatar.json` (image, fallback sub-elements) — all referencing feedback type tokens. Create missing CSS files for alert, badge, toast, progress, skeleton, empty-state at `packages/wc/src/components/{component}/{component}.css`
- [x] T042 [US2] Migrate feedback component CSS files: update `packages/wc/src/components/spinner/spinner.css`, `stepper/stepper.css` and the newly created CSS files — all referencing component tokens that chain to feedback type tokens

### Build & Verify

- [x] T043 [US2] Rebuild all tokens (`pnpm --filter @hypoth-ui/tokens build`), then rebuild CSS (`pnpm --filter @hypoth-ui/css build`), then run `pnpm build` to verify full monorepo builds without errors. Verify `dist/css/component-tokens.css` contains tokens for all 55 components (56 minus visually-hidden which is excluded as an a11y utility).

**Checkpoint**: All 55 tokenized components migrated to the four-tier token system. US1 (per-component override) and US2 (theme-wide cascade) are fully satisfied for all components.

---

## Phase 6: US3 — Size and Density Variants (Priority: P2)

**Goal**: Enable consumers to change component sizing across entire regions using size-indexed type tokens and density settings, without writing custom CSS

**Independent Test**: Set `--ds-action-height-md: 3rem` → all buttons and links in the section become taller. Set `--ds-form-control-height-sm: 1.5rem` → all small form controls shrink. Explicit `--ds-button-height: 4rem` overrides the inherited action height.

- [x] T044 [US3] Verify that actions type tokens in `packages/tokens/src/tokens/type/actions.json` include size-indexed tokens at sm/md/lg for height, padding-x, padding-y, and font-size (should exist from T010). Verify that component token files for Button and Link reference the `md` size as default (e.g., `--ds-button-height` → `{action.height.md}`). If not, update the component token JSON files to use size-indexed type token references.
- [x] T045 [US3] Verify that form-controls type tokens in `packages/tokens/src/tokens/type/form-controls.json` include size-indexed tokens at sm/md/lg for height, padding-x, padding-y, and font-size (should exist from T011). Verify component token files for Input, Select, Checkbox, etc. reference the `md` size as default. Update component CSS files to use size-variant classes (`.ds-button--sm`, `.ds-input[data-size="sm"]`) that switch to the corresponding size token (e.g., `var(--ds-button-height-sm)` when size="sm").
- [x] T046 [US3] Integrate size tokens with the density system: create `packages/tokens/src/tokens/modes/density-compact.json` and `packages/tokens/src/tokens/modes/density-spacious.json` to define compact and spacious density overrides that modify the size-indexed type tokens. Compact density should reduce heights by ~15%, padding by ~25%. Spacious density should increase heights by ~15%, padding by ~25%. Ensure `[data-density="compact"]` and `[data-density="spacious"]` selectors in the compiled CSS override the correct type-tier size tokens.
- [x] T047 [US3] Rebuild tokens and verify that size overrides cascade correctly: setting `--ds-action-height-md: 3rem` at `:root` should make all default-sized action components 3rem tall, while explicit component-level overrides (`--ds-button-height: 4rem`) take precedence

**Checkpoint**: Size and density variants work through the token system. Consumers can control sizing at the type tier (all form controls) or component tier (individual components) without custom CSS.

---

## Phase 7: US4 — Sub-Element Token Verification (Priority: P2)

**Goal**: Verify and refine per-sub-element token granularity for the most complex compound components, ensuring consumers can restyle individual internal parts

**Independent Test**: Override `--ds-select-trigger-bg` → only the Select trigger changes, dropdown list and options remain at defaults. Override `--ds-dialog-title-font-size` → only the Dialog title changes.

- [x] T048 [US4] Audit and verify sub-element token completeness for the 5 most complex compound components: Select (trigger, content, option), Dialog (backdrop, content, title, description), Combobox (input, tag, content, option), Sheet (overlay, content, header, footer), and Stepper (item, indicator, separator, trigger, title, description, content). For each: verify that every identifiable sub-element has tokens for all visual properties it uses (bg, color, border-color, padding, font-size, font-weight where applicable). Add any missing sub-element tokens to the component JSON files and update the corresponding CSS.
- [x] T049 [US4] Verify sub-element token isolation: for Select, Combobox, and Dialog, create a test CSS file at `packages/wc/tests/token-isolation-test.css` that overrides one sub-element token per component (e.g., `--ds-select-trigger-bg`, `--ds-dialog-title-color`, `--ds-combobox-tag-bg`) and verify via visual inspection or snapshot test that only the targeted sub-element changes appearance while all other sub-elements retain their defaults

**Checkpoint**: Per-sub-element customization verified for compound components. A consumer can change the Select trigger's background, the Dialog title's font size, or the Combobox tag's color without affecting any other part of those components.

---

## Phase 8: US5 — Maintainer Token Integration Guide (Priority: P3)

**Goal**: Provide clear, actionable guidelines for design system maintainers adding new components to the token system

**Independent Test**: A maintainer follows the guide to create a new example component and it correctly inherits theme colors, responds to type-tier overrides, and exposes sub-element tokens.

- [x] T050 [US5] Create a token integration guide at `packages/tokens/AUTHORING.md` covering: (1) how to determine which type category a new component belongs to, (2) how to create a component token JSON file using the naming convention (`--ds-{component}-{element?}-{property}-{state?}`), (3) which properties need state variants (bg, color, border-color) vs. which don't (border-radius, font-size), (4) how to reference type tokens as defaults via DTCG `{reference}` syntax, (5) how to update component CSS to reference component tokens instead of semantic tokens, (6) the full property shorthand vocabulary from the token API contract
- [x] T051 [US5] Add a worked example to the authoring guide: walk through creating a hypothetical `InfoCard` component from scratch — selecting the containers category, creating `component/info-card.json` with root and sub-element (header, body, icon) tokens, creating `info-card.css` referencing the tokens, and verifying the component responds to both `--ds-container-bg` type overrides and `--ds-info-card-header-bg` component overrides

**Checkpoint**: Maintainer guide complete. A new contributor can follow the guide to add a fully token-integrated component without requiring help or changes to the build pipeline.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, cleanup, and cross-cutting improvements

- [x] T052 Run a full hardcoded-value audit across all component CSS files in `packages/wc/src/components/`: grep for any remaining hex colors, rgb/rgba values, rem/px values not wrapped in `var()`, and fix any found — ensuring SC-001 (100% token-derived values) is met
- [x] T053 Verify backward compatibility and upgrade resilience: ensure all existing `--ds-*` token names from `packages/tokens/dist/css/tokens.css` still exist and resolve to the same visual output (oklch equivalents of previous hex values). Verify consumer override survival: create a test override file that sets `--ds-button-primary-bg`, `--ds-form-control-border-radius`, and `--ds-color-primary-default` to custom values, then rebuild tokens and confirm the overrides still take effect (SC-007). Run `pnpm build && pnpm typecheck && pnpm lint` to verify no build regressions
- [x] T054 Update `packages/tokens/package.json` exports to include the new CSS files (`dist/css/type-tokens.css`, `dist/css/component-tokens.css`) so consumers can import them individually if needed
- [x] T055 Run `pnpm build` for the full monorepo and verify all packages build successfully. Run `pnpm test` to verify no test regressions. Run `pnpm lint` and fix any linting issues introduced by the changes.
- [x] T056 Visual comparison review (SC-008): render Button (all variants), Input, Select, Card, Dialog, and Tabs with default tokens and manually compare against shadcn/ui reference components for consistent aesthetic (neutral palette, medium radii, clean typography). Document any intentional divergences (blue primary, Geist font, teal/vermillion colors).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1+US2 Actions MVP (Phase 3)**: Depends on Phase 2 — the first testable increment
- **US1+US2 Form Controls (Phase 4)**: Depends on Phase 2 — can run in parallel with Phase 3
- **US1+US2 Remaining (Phase 5)**: Depends on Phase 2 — can run in parallel with Phases 3-4
- **US3 Size/Density (Phase 6)**: Depends on Phases 3-5 (component tokens must exist)
- **US4 Sub-Element (Phase 7)**: Depends on Phases 4-5 (compound component tokens must exist)
- **US5 Maintainer Guide (Phase 8)**: Depends on Phase 3 (needs at least one complete example)
- **Polish (Phase 9)**: Depends on all previous phases

### User Story Dependencies

- **US1+US2 (P1)**: Can start after Phase 2 — Phases 3, 4, 5 can run in parallel by category
- **US3 (P2)**: Depends on US1+US2 completion (component tokens must exist to add size variants)
- **US4 (P2)**: Depends on compound component migration (Phases 4-5)
- **US5 (P3)**: Can start after Phase 3 (only needs one complete category as example)

### Parallel Opportunities

- T005-T009 (semantic updates): T006, T007, T008, T009 can all run in parallel
- T010-T015 (type token files): All six can run in parallel (independent files)
- T018-T021 (action component tokens): All four can run in parallel
- T026-T029 (form control tokens): All four sub-groups can run in parallel
- T035, T037, T039, T041 (remaining category tokens): All four categories can run in parallel
- Phases 3, 4, 5 can run in parallel after Phase 2 completion (different categories, different files)

---

## Parallel Example: Phase 3 (Actions MVP)

```bash
# Launch all component token definitions in parallel:
Task T018: "Create button.json in packages/tokens/src/tokens/component/"
Task T019: "Create link.json in packages/tokens/src/tokens/component/"
Task T020: "Create icon.json in packages/tokens/src/tokens/component/"
Task T021: "Create tag.json in packages/tokens/src/tokens/component/"

# Then rebuild tokens (T022), then migrate CSS files in parallel:
Task T023: "Migrate button.css to component tokens"
Task T024: "Migrate link.css to component tokens"
Task T025: "Migrate icon.css to component tokens"
```

---

## Implementation Strategy

### MVP First (Phase 3: Actions Only)

1. Complete Phase 1: Setup (build pipeline)
2. Complete Phase 2: Foundational (semantic tokens + type tokens)
3. Complete Phase 3: Actions category (Button, Link, Icon, Tag)
4. **STOP and VALIDATE**: Test per-component override (US1) and theme cascade (US2) with actions
5. This proves the entire architecture works end-to-end with 4 components

### Incremental Delivery

1. Setup + Foundational → Build pipeline ready
2. Actions MVP → Test architecture → Validate US1+US2 (4 components)
3. Form Controls → Test category override → Validate US1+US2 (18 components total)
4. Remaining categories → Full coverage → Validate US1+US2 (55 tokenized components)
5. Size/Density → Validate US3
6. Sub-element verification → Validate US4
7. Maintainer guide → Validate US5
8. Each phase adds value without breaking previous work

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks in the same phase
- [Story] label maps task to specific user story for traceability
- US1 and US2 are combined because the same migration work (creating component tokens + updating CSS) satisfies both stories simultaneously
- The migration order (actions → form-controls → containers/overlays/navigation/feedback) follows the plan.md strategy
- Component token JSON files follow DTCG format with `$value`, `$type`, `$description` fields
- All component CSS migrations must produce zero visual diff — appearance stays identical, only the token resolution path changes
- Migrated component CSS uses single-token references (`var(--ds-button-bg)`) without inline fallbacks — the fallback chain is expressed in the `@layer tokens` definitions, not in component CSS
