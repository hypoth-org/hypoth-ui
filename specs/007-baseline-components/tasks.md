# Tasks: Baseline Web Components

**Input**: Design documents from `/specs/007-baseline-components/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Required per FR-039 (unit tests and accessibility automation hooks)

**Organization**: Tasks grouped by user story. Each component = one user story enabling independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US6)
- Exact file paths included in descriptions

## Path Conventions

Monorepo structure per plan.md:
- Components: `packages/wc/src/components/{name}/`
- CSS: `packages/css/src/components/`
- Docs: `packages/docs-content/components/`
- Tests: `packages/wc/src/components/{name}/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependencies and shared infrastructure before component work

- [x] T001 Install Lucide icon library: `pnpm --filter @ds/wc add lucide@^0.468.0`
- [x] T002 [P] Verify token paths exist in `packages/tokens/` for link, icon, spinner sizes
- [x] T003 [P] Add missing tokens to `packages/tokens/src/` if needed (sizing.icon.*, sizing.spinner.*, color.link.*, motion.*)
- [x] T004 Update component registry types in `packages/wc/src/registry/registry.ts` for new components

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared utilities that multiple components depend on

**⚠️ CRITICAL**: VisuallyHidden is needed by Link (external indicator) and Button (loading state uses Spinner)

- [x] T005 Create VisuallyHidden CSS in `packages/css/src/components/visually-hidden.css` with clip-path technique
- [x] T006 Create VisuallyHidden component in `packages/wc/src/components/visually-hidden/visually-hidden.ts`
- [x] T007 [P] Create VisuallyHidden manifest in `packages/wc/src/components/visually-hidden/manifest.json`
- [x] T008 Create Spinner CSS in `packages/css/src/components/spinner.css` with reduced-motion support
- [x] T009 Create Spinner component in `packages/wc/src/components/spinner/spinner.ts`
- [x] T010 [P] Create Spinner manifest in `packages/wc/src/components/spinner/manifest.json`
- [x] T011 [P] Create Icon adapter in `packages/wc/src/components/icon/icon-adapter.ts` for Lucide integration
- [x] T012 Register foundational components in `packages/wc/src/registry/registry.ts`
- [x] T013 Export foundational components from `packages/wc/src/index.ts`

**Checkpoint**: VisuallyHidden, Spinner, and Icon adapter ready for other components

---

## Phase 3: User Story 1 - Button Component (Priority: P1) 🎯 MVP

**Goal**: Interactive button with variants, sizes, disabled/loading states, and full accessibility

**Independent Test**: Render `<ds-button>` in all variants, verify click/keyboard activation, check loading spinner, validate ARIA

### Tests for User Story 1

- [x] T014 [P] [US1] Create unit test in `packages/wc/src/components/button/button.test.ts`
- [x] T015 [P] [US1] Create a11y test in `packages/wc/src/components/button/button.a11y.test.ts`

### Implementation for User Story 1

- [x] T016 [US1] Update Button CSS in `packages/css/src/components/button.css` to add loading state styles
- [x] T017 [US1] Update Button component in `packages/wc/src/components/button/button.ts`:
  - Add `loading` attribute with Spinner integration
  - Verify `disabled` prevents interaction
  - Ensure `ds:click` event emission on Enter/Space
  - Add ARIA attributes (`aria-disabled`, `aria-busy`)
- [x] T018 [US1] Update Button manifest in `packages/wc/src/components/button/manifest.json` with loading state docs
- [x] T019 [US1] Update Button docs in `packages/docs-content/components/button.mdx`:
  - Add loading state example
  - Verify 3+ usage examples
  - Verify 2+ anti-patterns
  - Add keyboard/screen reader section

**Checkpoint**: Button fully functional with all variants, loading state, and accessibility

---

## Phase 4: User Story 2 - Link Component (Priority: P1)

**Goal**: Accessible link with navigation, external link handling, and SPA event interception

**Independent Test**: Render `<ds-link>` with various hrefs, verify external opens new tab, check `ds:navigate` event

### Tests for User Story 2

- [x] T020 [P] [US2] Create unit test in `packages/wc/src/components/link/link.test.ts`
- [x] T021 [P] [US2] Create a11y test in `packages/wc/src/components/link/link.a11y.test.ts`

### Implementation for User Story 2

- [x] T022 [P] [US2] Create Link CSS in `packages/css/src/components/link.css` with variants and external indicator
- [x] T023 [US2] Create Link component in `packages/wc/src/components/link/link.ts`:
  - Implement `href`, `external`, `variant` attributes
  - Add `target="_blank"` and `rel="noopener noreferrer"` for external
  - Emit `ds:navigate` event (cancelable)
  - Include VisuallyHidden "(opens in new tab)" for external links
  - Add external link icon via Icon component
- [x] T024 [P] [US2] Create Link manifest in `packages/wc/src/components/link/manifest.json`
- [x] T025 [US2] Register Link in `packages/wc/src/registry/registry.ts`
- [x] T026 [US2] Export Link from `packages/wc/src/index.ts`
- [x] T027 [US2] Create Link docs in `packages/docs-content/components/link.mdx`:
  - Internal link example
  - External link example
  - SPA navigation interception example
  - Anti-patterns (button-like links, icon-only links)

**Checkpoint**: Link fully functional with external handling and accessibility

---

## Phase 5: User Story 3 - Text Component (Priority: P2)

**Goal**: Typography component with size/weight/variant/semantic element support

**Independent Test**: Render `<ds-text>` at different sizes, verify computed styles match tokens, check `as` prop renders correct element

### Tests for User Story 3

- [x] T028 [P] [US3] Create unit test in `packages/wc/src/components/text/text.test.ts`
- [x] T029 [P] [US3] Create a11y test in `packages/wc/src/components/text/text.a11y.test.ts`

### Implementation for User Story 3

- [x] T030 [P] [US3] Create Text CSS in `packages/css/src/components/text.css` with all size/weight/variant combinations
- [x] T031 [US3] Create Text component in `packages/wc/src/components/text/text.ts`:
  - Implement `size`, `weight`, `variant`, `as`, `truncate` attributes
  - Use Lit's `unsafeStatic` for dynamic element rendering
  - Validate `as` prop, fall back to `span` with warning
- [x] T032 [P] [US3] Create Text manifest in `packages/wc/src/components/text/manifest.json`
- [x] T033 [US3] Register Text in `packages/wc/src/registry/registry.ts`
- [x] T034 [US3] Export Text from `packages/wc/src/index.ts`
- [x] T035 [US3] Create Text docs in `packages/docs-content/components/text.mdx`:
  - Typography scale examples
  - Semantic heading example (as="h2")
  - Truncation example
  - Anti-patterns (wrong heading levels, color-only meaning)

**Checkpoint**: Text fully functional with semantic element support

---

## Phase 6: User Story 4 - Icon Component (Priority: P2)

**Goal**: Accessible icon display with decorative/meaningful distinction and Lucide integration

**Independent Test**: Render `<ds-icon>` with/without label, verify ARIA attributes, check Lucide icon renders

### Tests for User Story 4

- [x] T036 [P] [US4] Create unit test in `packages/wc/src/components/icon/icon.test.ts`
- [x] T037 [P] [US4] Create a11y test in `packages/wc/src/components/icon/icon.a11y.test.ts`

### Implementation for User Story 4

- [x] T038 [P] [US4] Create Icon CSS in `packages/css/src/components/icon.css` with size tokens
- [x] T039 [US4] Create Icon component in `packages/wc/src/components/icon/icon.ts`:
  - Implement `name`, `size`, `label`, `color` attributes
  - Use icon-adapter.ts to get Lucide icon SVG
  - Set `aria-hidden="true"` when no label (decorative)
  - Set `role="img"` and `aria-label` when label provided
  - Handle invalid icon name with console warning and fallback
- [x] T040 [P] [US4] Create Icon manifest in `packages/wc/src/components/icon/manifest.json`
- [x] T041 [US4] Register Icon in `packages/wc/src/registry/registry.ts`
- [x] T042 [US4] Export Icon from `packages/wc/src/index.ts`
- [x] T043 [US4] Create Icon docs in `packages/docs-content/components/icon.mdx`:
  - Decorative icon example
  - Meaningful icon with label example
  - Color customization example
  - Anti-patterns (missing labels on meaningful icons, icon-only buttons)

**Checkpoint**: Icon fully functional with Lucide integration and accessibility

---

## Phase 7: User Story 5 - Spinner Component (Priority: P2)

**Goal**: Accessible loading indicator with reduced motion support

**Independent Test**: Render `<ds-spinner>`, verify animation, check reduced-motion fallback, validate screen reader announcement

### Tests for User Story 5

- [x] T044 [P] [US5] Create unit test in `packages/wc/src/components/spinner/spinner.test.ts`
- [x] T045 [P] [US5] Create a11y test in `packages/wc/src/components/spinner/spinner.a11y.test.ts`

### Implementation for User Story 5

- [x] T046 [US5] Enhance Spinner component in `packages/wc/src/components/spinner/spinner.ts` (if needed from foundational):
  - Verify `size`, `label` attributes
  - Ensure `role="status"` and `aria-label`
- [x] T047 [US5] Create Spinner docs in `packages/docs-content/components/spinner.mdx`:
  - Basic usage example
  - Custom label example
  - Use with aria-busy region example
  - Anti-patterns (infinite spinners without context, spinners without labels)

**Checkpoint**: Spinner fully functional with reduced motion support

---

## Phase 8: User Story 6 - VisuallyHidden Component (Priority: P3)

**Goal**: Utility to hide content visually while keeping it accessible to screen readers

**Independent Test**: Render `<ds-visually-hidden>`, verify not visible, check screen reader announces content

### Tests for User Story 6

- [x] T048 [P] [US6] Create unit test in `packages/wc/src/components/visually-hidden/visually-hidden.test.ts`
- [x] T049 [P] [US6] Create a11y test in `packages/wc/src/components/visually-hidden/visually-hidden.a11y.test.ts`

### Implementation for User Story 6

- [x] T050 [US6] Enhance VisuallyHidden component in `packages/wc/src/components/visually-hidden/visually-hidden.ts` (if needed):
  - Verify `focusable` attribute shows content on focus
- [x] T051 [US6] Create VisuallyHidden docs in `packages/docs-content/components/visually-hidden.mdx`:
  - Screen reader context example
  - Skip link (focusable) example
  - Icon accessibility example
  - Anti-patterns (overuse, hiding from all users)

**Checkpoint**: VisuallyHidden fully functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and integration

- [x] T052 [P] Run manifest validation: `pnpm --filter @ds/docs-core validate --strict`
- [x] T053 [P] Run all component tests: `pnpm --filter @ds/wc test` (292 tests passing)
- [x] T054 [P] Run type checking: `pnpm --filter @ds/wc typecheck`
- [x] T055 [P] Verify tree-shaking by building and checking bundle sizes (each component in separate chunk)
- [x] T056 Verify SSR rendering in Next.js test app (Light DOM ensures SSR compatibility)
- [x] T057 Verify token theming (brand/mode switching) on all components (CSS custom properties used throughout)
- [x] T058 Final documentation review for all 6 components (all .mdx files verified complete)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - Creates VisuallyHidden, Spinner, Icon adapter needed by other components
- **User Stories (Phases 3-8)**: All depend on Foundational completion
  - US1 (Button) and US2 (Link) are both P1 - can run in parallel
  - US3-5 are P2 - can start after Foundational, independent of each other
  - US6 is P3 - lowest priority, but VisuallyHidden was created in Foundational
- **Polish (Phase 9)**: Depends on all user stories complete

### User Story Dependencies

| Story | Component | Depends On | Can Parallel With |
|-------|-----------|------------|-------------------|
| US1 | Button | Foundational (Spinner for loading) | US2, US3, US4, US5, US6 |
| US2 | Link | Foundational (VisuallyHidden, Icon for external) | US1, US3, US4, US5, US6 |
| US3 | Text | Foundational only | All other stories |
| US4 | Icon | Foundational (adapter exists) | All other stories |
| US5 | Spinner | None (created in Foundational) | All other stories |
| US6 | VisuallyHidden | None (created in Foundational) | All other stories |

### Within Each User Story

1. Tests (T0xx-T0xx) written first, verify they FAIL
2. CSS created (can parallel with tests)
3. Component implemented
4. Manifest created (can parallel with component)
5. Registry updated
6. Docs created
7. Verify tests PASS

### Parallel Opportunities

- **Phase 1**: T002 and T003 can run in parallel
- **Phase 2**: T007, T010, T011 can run in parallel
- **All User Stories**: Once Foundational completes, all 6 user stories can proceed in parallel
- **Within Each Story**: Tests (T0xx, T0xx) can run in parallel; CSS and manifest can run in parallel

---

## Parallel Example: User Story 1 (Button)

```bash
# Launch tests in parallel:
Task: "Create unit test in packages/wc/src/components/button/button.test.ts"
Task: "Create a11y test in packages/wc/src/components/button/button.a11y.test.ts"

# Then sequentially:
# T016 → T017 → T018 → T019
```

## Parallel Example: All P1 Stories

```bash
# After Foundational phase completes, launch both P1 stories:
# Team Member A works on US1 (Button): T014-T019
# Team Member B works on US2 (Link): T020-T027
```

---

## Implementation Strategy

### MVP First (Button Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (creates Spinner, VisuallyHidden, Icon adapter)
3. Complete Phase 3: User Story 1 (Button)
4. **STOP and VALIDATE**: Test Button independently
5. Deploy/demo Button component

### Incremental Delivery

1. Setup + Foundational → Infrastructure ready
2. Add Button (US1) → Test → Demo (MVP!)
3. Add Link (US2) → Test → Demo
4. Add Text (US3) → Test → Demo
5. Add Icon (US4) → Test → Demo
6. Add Spinner docs (US5) → Test → Demo
7. Add VisuallyHidden docs (US6) → Test → Demo
8. Polish phase → Final validation

### Recommended Order (Single Developer)

Per quickstart.md recommendation:
1. Setup + Foundational (includes VisuallyHidden, Spinner core)
2. Button (US1) - updates existing, adds loading
3. Spinner docs (US5) - component done, just docs
4. VisuallyHidden docs (US6) - component done, just docs
5. Text (US3) - non-interactive, simpler
6. Link (US2) - interactive, uses Icon + VisuallyHidden
7. Icon (US4) - Lucide integration last

---

## Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 58 |
| Setup Tasks | 4 |
| Foundational Tasks | 9 |
| US1 (Button) Tasks | 6 |
| US2 (Link) Tasks | 8 |
| US3 (Text) Tasks | 8 |
| US4 (Icon) Tasks | 8 |
| US5 (Spinner) Tasks | 4 |
| US6 (VisuallyHidden) Tasks | 4 |
| Polish Tasks | 7 |
| Parallel Opportunities | 25 tasks marked [P] |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Tests required per FR-039
- Commit after each task or logical group
- Run `pnpm --filter @ds/docs-core validate --strict` frequently
