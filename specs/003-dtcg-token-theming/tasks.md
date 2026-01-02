# Tasks: DTCG Token-Driven Theming

**Input**: Design documents from `/specs/003-dtcg-token-theming/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo structure**: `packages/<package>/src/`
- Token compiler: `packages/tokens/src/compiler/`
- Token definitions: `packages/tokens/src/tokens/`
- Docs integration: `packages/docs-core/src/`
- Component manifests: `packages/wc/src/components/<name>/manifest.json`

---

## Phase 1: Setup (Shared Infrastructure) ✅

**Purpose**: Project initialization, directory structure, and schema copying

- [x] T001 Create compiler directory structure at packages/tokens/src/compiler/
- [x] T002 [P] Create tokens directory structure at packages/tokens/src/tokens/ (global/, brands/, modes/)
- [x] T003 [P] Create types directory at packages/tokens/src/types/
- [x] T004 [P] Copy dtcg-token.schema.json from specs/003-dtcg-token-theming/contracts/ to packages/tokens/src/schemas/
- [x] T005 [P] Copy tokens-used.schema.json from specs/003-dtcg-token-theming/contracts/ to packages/docs-core/src/schemas/
- [x] T006 [P] Copy token-reference-doc.schema.json from specs/003-dtcg-token-theming/contracts/ to packages/docs-core/src/schemas/
- [x] T007 Update packages/tokens/package.json with new exports for CSS, JSON, and TypeScript outputs
- [x] T008 [P] Add VS Code settings for DTCG JSON Schema associations in .vscode/settings.json

---

## Phase 2: Foundational (Blocking Prerequisites) ✅

**Purpose**: Core types and utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create DTCG TypeScript types in packages/tokens/src/types/dtcg.ts (Token, TokenValue, TokenType, TokenSet, etc.)
- [x] T010 [P] Create token category constants in packages/tokens/src/types/categories.ts (12 categories: color, typography, spacing, etc.)
- [x] T011 [P] Create token path utilities in packages/tokens/src/compiler/utils/paths.ts (tokenPathToCSS, parseTokenPath)
- [x] T012 Create token reference utilities in packages/tokens/src/compiler/utils/references.ts (isReference, parseReference)
- [x] T013 Export foundational types from packages/tokens/src/types/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Component Author Applies Design Tokens (Priority: P1) 🎯 MVP ✅

**Goal**: Component authors can declare `tokensUsed` in manifests and consume tokens via CSS custom properties

**Independent Test**: Create a component with `tokensUsed` declaration, apply tokens via CSS custom properties, verify styles change when brand/mode attributes change

### Implementation for User Story 1

- [x] T014 [US1] Implement DTCG parser in packages/tokens/src/compiler/parser.ts (parse JSON, extract tokens with $value)
- [x] T015 [US1] Implement token reference resolver in packages/tokens/src/compiler/resolver.ts (resolve {token.path} references)
- [x] T016 [US1] Implement cascade resolver in packages/tokens/src/compiler/resolver.ts (brand-mode → brand-base → global-mode → global-base)
- [x] T017 [US1] Implement cycle detection in packages/tokens/src/compiler/validator.ts (detect and report circular references)
- [x] T018 [US1] Implement undefined reference detection in packages/tokens/src/compiler/validator.ts
- [x] T019 [US1] Implement CSS emitter in packages/tokens/src/compiler/emitters/css.ts (generate scoped custom properties)
- [x] T020 [P] [US1] Create sample global color tokens in packages/tokens/src/tokens/global/color.json
- [x] T021 [P] [US1] Create sample global spacing tokens in packages/tokens/src/tokens/global/spacing.json
- [x] T022 [P] [US1] Create sample global typography tokens in packages/tokens/src/tokens/global/typography.json
- [x] T023 [P] [US1] Create default brand tokens in packages/tokens/src/tokens/brands/default/tokens.json
- [x] T024 [P] [US1] Create sample acme brand tokens in packages/tokens/src/tokens/brands/acme/tokens.json
- [x] T025 [P] [US1] Create light mode tokens in packages/tokens/src/tokens/modes/light.json
- [x] T026 [P] [US1] Create dark mode tokens in packages/tokens/src/tokens/modes/dark.json
- [x] T027 [US1] Implement build orchestration in packages/tokens/src/build/build.ts (load all token sets, compile outputs)
- [x] T028 [US1] Update component-manifest.schema.json to add tokensUsed field in packages/docs-core/src/schemas/
- [x] T029 [US1] Update button component manifest with tokensUsed in packages/wc/src/components/button/manifest.json
- [x] T030 [US1] Update input component manifest with tokensUsed in packages/wc/src/components/input/manifest.json
- [x] T031 [US1] Add "build" script to packages/tokens/package.json (runs build.ts)

**Checkpoint**: Component authors can now use tokens - CSS outputs generated, manifests declare tokensUsed

---

## Phase 4: User Story 2 - Design System Maintainer Defines Brand Tokens (Priority: P1) ✅

**Goal**: Design system maintainers can author DTCG tokens and compile to CSS, JSON, and TypeScript outputs

**Independent Test**: Create a DTCG token file, run compiler, verify CSS/JSON/TS outputs are correct

### Implementation for User Story 2

- [x] T032 [US2] Implement JSON bundle emitter in packages/tokens/src/compiler/emitters/json.ts (resolved token tree)
- [x] T033 [US2] Implement TypeScript types emitter in packages/tokens/src/compiler/emitters/typescript.ts (token path types)
- [x] T034 [US2] Add composite type handling to parser for shadow, border, typography in packages/tokens/src/compiler/parser.ts
- [x] T035 [US2] Add composite type CSS emission in packages/tokens/src/compiler/emitters/css.ts
- [x] T036 [P] [US2] Create high-contrast mode tokens in packages/tokens/src/tokens/modes/high-contrast.json
- [x] T037 [P] [US2] Create reduced-motion mode tokens in packages/tokens/src/tokens/modes/reduced-motion.json
- [x] T038 [P] [US2] Create shadow tokens in packages/tokens/src/tokens/global/shadow.json
- [x] T039 [P] [US2] Create border tokens in packages/tokens/src/tokens/global/border.json
- [x] T040 [P] [US2] Create radius tokens in packages/tokens/src/tokens/global/radius.json
- [x] T041 [US2] Update build.ts to write all three outputs (CSS, JSON, TS) in packages/tokens/src/build/build.ts
- [x] T042 [US2] Add compilation metadata to JSON output in packages/tokens/src/compiler/emitters/json.ts
- [x] T043 [US2] Add warning collection and reporting to build.ts

**Checkpoint**: Full DTCG compilation working - CSS, JSON, TypeScript outputs all generated

---

## Phase 5: User Story 3 - Documentation Author References Component Tokens (Priority: P2) ✅

**Goal**: Documentation automatically displays tokensUsed from manifests and links to token reference docs

**Independent Test**: View component documentation page, verify tokens section displays with links to definitions

### Implementation for User Story 3

- [x] T044 [US3] Implement tokensUsed validator in packages/docs-core/src/validation/validate-tokens-used.ts
- [x] T045 [US3] Integrate tokensUsed validation into unified validate command in packages/docs-core/src/cli/validate.ts
- [x] T046 [US3] Implement token docs generator in packages/docs-core/src/generators/token-docs.ts
- [x] T047 [US3] Create token category template in packages/docs-content/tokens/_template.mdx
- [x] T048 [US3] Add "build:token-docs" script to packages/docs-core/package.json
- [x] T049 [US3] Generate color token reference doc at packages/docs-content/tokens/color.mdx
- [x] T050 [US3] Update component page to display tokensUsed section in packages/docs-renderer-next/app/components/[id]/page.tsx
- [x] T051 [US3] Create TokensUsed component for documentation in packages/docs-renderer-next/components/tokens-used.tsx
- [x] T052 [US3] Add reverse lookup (which components use each token) to token-docs.ts

**Checkpoint**: Documentation shows tokensUsed per component and has token reference pages

---

## Phase 6: User Story 4 - Theme Consumer Switches Modes at Runtime (Priority: P2) ✅

**Goal**: Runtime mode/brand switching without page reload, respects user preferences

**Independent Test**: Toggle data-mode attribute via JavaScript, verify all components update within 100ms

### Implementation for User Story 4

- [x] T053 [US4] Add media query support to CSS emitter in packages/tokens/src/compiler/emitters/css.ts (prefers-color-scheme, prefers-contrast, prefers-reduced-motion)
- [x] T054 [US4] Add CSS @layer declarations to CSS output in packages/tokens/src/compiler/emitters/css.ts
- [x] T055 [US4] Create theme initialization script in packages/tokens/src/runtime/init.ts (blocking script for no-flicker)
- [x] T056 [US4] Create theme controller utility in packages/tokens/src/runtime/theme-controller.ts (setMode, setBrand)
- [x] T057 [US4] Export runtime utilities from packages/tokens/src/index.ts
- [x] T058 [US4] Update docs-renderer to include theme init script in packages/docs-renderer-next/app/layout.tsx
- [x] T059 [US4] Add mode/brand switcher to docs UI in packages/docs-renderer-next/components/theme-switcher.tsx
- [x] T060 [US4] Add runtime exports to packages/tokens/package.json (./runtime entry point)

**Checkpoint**: Runtime theming working - mode switching instant, user preferences respected

---

## Phase 7: User Story 5 - CI Pipeline Validates Token Changes (Priority: P3) ✅

**Goal**: CI generates snapshot diffs for token changes, fails on orphaned references

**Independent Test**: Modify token value, run CI, verify diff report shows old vs new values

### Implementation for User Story 5

- [x] T061 [US5] Ensure deterministic output in all emitters (sorted keys, consistent formatting)
- [x] T062 [US5] Add token outputs to git tracking (dist/ checked in for diff review)
- [x] T063 [US5] Create CI validation script in packages/tokens/scripts/ci-validate.sh
- [x] T064 [US5] Add token validation to .github/workflows/ci.yml
- [x] T065 [US5] Add orphaned token reference check to packages/docs-core/src/validation/validate-tokens-used.ts
- [x] T066 [US5] Create token diff reporter in packages/tokens/src/cli/diff-reporter.ts

**Checkpoint**: CI catches token changes and orphaned references

---

## Phase 8: Polish & Cross-Cutting Concerns ✅

**Purpose**: Integration, documentation, and refinements across all stories

- [x] T067 [P] Add JSDoc comments to all public functions in packages/tokens/src/
- [x] T068 [P] Add JSDoc comments to token-related functions in packages/docs-core/src/
- [x] T069 Update CLAUDE.md with new token commands (build:tokens, validate:tokens)
- [x] T070 Run full validation suite and fix any issues
- [x] T071 [P] Create remaining global token files (sizing, motion, opacity, z-index, breakpoint, icon) in packages/tokens/src/tokens/global/
- [x] T072 Update quickstart.md in specs/003-dtcg-token-theming/ with actual command outputs
- [x] T073 Run pnpm lint and fix any linting errors
- [x] T074 Run pnpm typecheck and fix any type errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 and US2 can proceed in parallel (both P1)
  - US3 depends on US1/US2 (needs tokensUsed and compiled tokens)
  - US4 depends on US2 (needs full CSS output with media queries)
  - US5 depends on US2 (needs deterministic outputs to diff)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Can run parallel with US1
- **User Story 3 (P2)**: Depends on US1 (tokensUsed) and US2 (token docs source)
- **User Story 4 (P2)**: Depends on US2 (CSS output with layers/media queries)
- **User Story 5 (P3)**: Depends on US2 (outputs to diff)

### Within Each User Story

- Parser/resolver before emitters
- Core functionality before sample data
- CLI commands last
- Integration with other packages after core works

### Parallel Opportunities

- T002-T006, T008 (Setup) - all parallel
- T009-T012 (Foundational) - T010, T011, T012 parallel after T009
- T020-T026 (US1 sample tokens) - all parallel
- T036-T040 (US2 tokens) - all parallel
- T067-T068, T071 (Polish) - parallel

---

## Parallel Example: User Story 1 & 2 Sample Tokens

```bash
# After foundational types exist, launch token creation tasks together:
Task: "Create sample global color tokens in packages/tokens/src/tokens/global/color.json"
Task: "Create sample global spacing tokens in packages/tokens/src/tokens/global/spacing.json"
Task: "Create sample global typography tokens in packages/tokens/src/tokens/global/typography.json"
Task: "Create default brand tokens in packages/tokens/src/tokens/brands/default/tokens.json"
Task: "Create sample acme brand tokens in packages/tokens/src/tokens/brands/acme/tokens.json"
Task: "Create light mode tokens in packages/tokens/src/tokens/modes/light.json"
Task: "Create dark mode tokens in packages/tokens/src/tokens/modes/dark.json"
```

---

## Parallel Example: User Stories 1 & 2

```bash
# After Phase 2, US1 and US2 can start in parallel:

# Developer A - User Story 1 (Token Consumption):
Task: "T014 [US1] Implement DTCG parser..."
Task: "T015 [US1] Implement token reference resolver..."

# Developer B - User Story 2 (Token Compilation):
Task: "T032 [US2] Implement JSON bundle emitter..."
Task: "T033 [US2] Implement TypeScript types emitter..."
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Token Consumption)
4. Complete Phase 4: User Story 2 (Token Compilation)
5. **STOP and VALIDATE**: Run `pnpm --filter @ds/tokens build`, verify CSS/JSON/TS outputs
6. Deploy/demo if ready - basic token pipeline working

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 + US2 → Test token pipeline → Deploy (Tokens MVP!)
3. Add US3 → Test token docs → Deploy (Documentation ready)
4. Add US4 → Test runtime switching → Deploy (Full theming)
5. Add US5 → Test CI integration → Deploy (Production ready)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Parser, Resolver, CSS Emitter)
   - Developer B: User Story 2 (JSON Emitter, TS Emitter, Composite Types)
3. After US1/US2:
   - Developer A: User Story 3 (Token Docs)
   - Developer B: User Story 4 (Runtime Theming)
4. Then: User Story 5 (CI Integration)

---

## Summary

| Phase | Tasks | Parallel | Story |
|-------|-------|----------|-------|
| Setup | T001-T008 | 6 | - |
| Foundational | T009-T013 | 3 | - |
| User Story 1 | T014-T031 | 9 | US1 |
| User Story 2 | T032-T043 | 5 | US2 |
| User Story 3 | T044-T052 | 0 | US3 |
| User Story 4 | T053-T060 | 0 | US4 |
| User Story 5 | T061-T066 | 0 | US5 |
| Polish | T067-T074 | 4 | - |

**Total Tasks**: 74
**Parallel Opportunities**: 27 tasks can run in parallel within their phases

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Schemas are copied from specs/contracts/ to ensure consistency with design
