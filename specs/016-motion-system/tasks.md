# Tasks: Animation System

**Input**: Design documents from `/specs/016-motion-system/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested - test tasks are omitted (can be added in Polish phase if needed).

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Paths are relative to repository root

---

## Phase 1: Setup

**Purpose**: Verify existing infrastructure and create new file structure

- [x] T001 Verify motion tokens exist in packages/tokens/src/tokens/global/motion.json
- [x] T002 Verify reduced-motion mode tokens exist in packages/tokens/src/tokens/modes/reduced-motion.json
- [x] T003 [P] Create animation directory in packages/primitives-dom/src/animation/
- [x] T004 [P] Create primitives directory in packages/react/src/primitives/ (if not exists)

---

## Phase 2: Foundational - CSS Animation System

**Purpose**: CSS keyframes and utility classes that ALL user stories depend on

**⚠️ CRITICAL**: User stories cannot proceed until animations.css is complete

- [x] T005 Create animations.css with keyframes in packages/css/src/layers/animations.css
  - Define @keyframes: ds-fade-in, ds-fade-out, ds-scale-in, ds-scale-out, ds-slide-up, ds-slide-down
  - Reference motion tokens: --ds-motion-duration-*, --ds-motion-easing-*
- [x] T006 Add animation utility classes to packages/css/src/layers/animations.css
  - Classes: .ds-animate-fade-in, .ds-animate-fade-out, .ds-animate-scale-in, .ds-animate-scale-out, .ds-animate-slide-up, .ds-animate-slide-down
- [x] T007 Add reduced motion media query support in packages/css/src/layers/animations.css
  - @media (prefers-reduced-motion: reduce) to disable all animations
- [x] T008 Import animations.css in packages/css/src/index.css
- [x] T009 Build and verify CSS output with `pnpm --filter @ds/css build`

**Checkpoint**: CSS animations ready - utility classes work, reduced motion respected

---

## Phase 3: User Story 1 - Developer Adds Animated Overlay (Priority: P1) 🎯 MVP

**Goal**: Dialog opens/closes with smooth fade+scale animation using data-state attribute

**Independent Test**: Open a dialog, verify it fades+scales in. Close it, verify it animates out before removal.

### Implementation for User Story 1

- [x] T010 [US1] Add data-state attribute animations for ds-dialog-content in packages/css/src/layers/animations.css
  - ds-dialog-content[data-state="open"]: fade-in + scale-in
  - ds-dialog-content[data-state="closed"]: fade-out + scale-out
- [x] T011 [US1] Create presence utility types in packages/primitives-dom/src/animation/types.ts
  - Export AnimationState type: 'idle' | 'animating-in' | 'animating-out' | 'exited'
  - Export PresenceOptions and Presence interfaces
- [x] T012 [US1] Implement createPresence utility in packages/primitives-dom/src/animation/presence.ts
  - Implement show(), hide(), cancel(), prefersReducedMotion(), destroy()
  - Use animationend event for completion detection
  - Handle rapid open/close (animation cancellation)
- [x] T013 [US1] Export presence from packages/primitives-dom/src/index.ts
- [x] T014 [US1] Update dialog behavior to support animation in packages/primitives-dom/src/behavior/dialog.ts
  - Add optional animated: boolean option
  - Add animationState to state object
  - Integrate presence utility for exit animation timing
- [x] T015 [US1] Update ds-dialog-content to set data-state attribute in packages/wc/src/components/dialog/dialog-content.ts
  - Add data-state property reflecting open/closed
  - Wire up to parent dialog behavior
- [x] T016 [US1] Update ds-dialog to coordinate animation timing in packages/wc/src/components/dialog/dialog.ts
  - Wait for exit animation before removing content from DOM
  - Call presence.hide() on close, listen for onExitComplete
- [x] T017 [US1] Verify dialog animation works with `pnpm --filter @ds/wc build && pnpm --filter @ds/wc test`

**Checkpoint**: Dialog animates in/out with fade+scale. Exit animation completes before removal.

---

## Phase 4: User Story 2 - Reduced Motion Accessibility (Priority: P2)

**Goal**: Users with prefers-reduced-motion see instant transitions with no animation

**Independent Test**: Enable prefers-reduced-motion in system settings, open/close dialog - should be instant.

### Implementation for User Story 2

- [x] T018 [US2] Add prefersReducedMotion helper function in packages/primitives-dom/src/animation/motion-preference.ts
  - Use matchMedia('(prefers-reduced-motion: reduce)')
  - Support SSR (return false if window undefined)
- [x] T019 [US2] Export prefersReducedMotion from packages/primitives-dom/src/index.ts
- [x] T020 [US2] Update createPresence to skip animation when reduced motion preferred in packages/primitives-dom/src/animation/presence.ts
  - Check prefersReducedMotion() on show/hide
  - If true, call onExitComplete immediately without waiting
- [x] T021 [US2] Verify CSS reduced motion rules work (already in T007)
  - Test that @media (prefers-reduced-motion) correctly disables animations
- [x] T022 [US2] Verify dialog works with reduced motion enabled

**Checkpoint**: Animations skip when prefers-reduced-motion is active. No jarring cuts.

---

## Phase 5: User Story 3 - Token Customization (Priority: P3)

**Goal**: Changing motion token values updates all animated components

**Independent Test**: Modify --ds-motion-duration-normal value, verify dialog animation speed changes.

### Implementation for User Story 3

- [x] T023 [US3] Verify animations use CSS custom properties in packages/css/src/layers/animations.css
  - All animation declarations should reference --ds-motion-duration-* and --ds-motion-easing-*
  - No hardcoded values (already done if T005-T006 followed contract)
- [x] T024 [P] [US3] Add data-animate-in/data-animate-out attribute support in packages/css/src/layers/animations.css
  - [data-animate-in~="fade-in"][data-state="open"] { animation-name: ds-fade-in; }
  - Same for scale-in, slide-up, slide-down, and exit variants
- [x] T025 [P] [US3] Add data-no-animation attribute support in packages/css/src/layers/animations.css
  - [data-no-animation] { animation: none !important; }
- [x] T026 [US3] Document token customization in component documentation

**Checkpoint**: Token changes propagate to all animations. Custom presets work via data attributes.

---

## Phase 6: User Story 4 - Framework-Specific Animation (Priority: P4)

**Goal**: React Presence component and Web Component attribute-based configuration

**Independent Test**: Implement same animated dialog in React and WC - verify identical visual behavior.

### Implementation for User Story 4 - Web Components

- [x] T027 [P] [US4] Add animation support to ds-popover-content in packages/wc/src/components/popover/popover-content.ts
  - Add data-state attribute
  - Apply fade-in + slide-up / fade-out + slide-down animations
- [x] T028 [P] [US4] Add animation support to ds-tooltip-content in packages/wc/src/components/tooltip/tooltip-content.ts
  - Add data-state attribute
  - Apply fade-in / fade-out animations
- [x] T029 [P] [US4] Add animation support to ds-menu-content in packages/wc/src/components/menu/menu-content.ts
  - Add data-state attribute
  - Apply fade-in + slide-up / fade-out + slide-down animations
- [x] T030 [US4] Add CSS animations for popover, tooltip, menu in packages/css/src/layers/animations.css
  - ds-popover-content[data-state="open/closed"]
  - ds-tooltip-content[data-state="open/closed"]
  - ds-menu-content[data-state="open/closed"]

### Implementation for User Story 4 - React

- [x] T031 [US4] Create Presence component in packages/react/src/primitives/Presence.tsx
  - Props: present, children, forceMount, onExitComplete
  - Use animationend event to detect exit completion
  - Clone child with ref and data-state attribute
- [x] T032 [US4] Create usePresence hook in packages/react/src/primitives/use-presence.ts
  - Return { isPresent, ref } for custom implementations
- [x] T033 [US4] Export Presence and usePresence from packages/react/src/index.ts
- [x] T034 [US4] Build and verify React package with `pnpm --filter @ds/react build && pnpm --filter @ds/react test`

**Checkpoint**: React Presence works. All 4 overlay WC components animate. Same visual behavior.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, cleanup, and documentation

- [x] T035 [P] Verify all overlay components animate correctly with `pnpm --filter @ds/wc test`
- [x] T036 [P] Verify bundle size meets ≤3KB target for presence logic
- [x] T037 [P] Run full build to verify no regressions with `pnpm build`
- [x] T038 [P] Run typecheck across affected packages with `pnpm typecheck`
- [x] T039 Update component manifest files with animation documentation
- [x] T040 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2), extends US1 work
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2)
- **User Story 4 (Phase 6)**: Depends on Foundational (Phase 2), extends US1 presence utility
- **Polish (Phase 7)**: Depends on all user stories

### User Story Dependencies

```
Phase 2 (Foundational)
        │
        ▼
   ┌────┴────┬────────────────┐
   │         │                │
   ▼         ▼                ▼
 US1 ──► US2 │             US3
 (MVP)       │                │
   │         │                │
   └────┬────┘                │
        │                     │
        ▼                     │
      US4 ◄───────────────────┘
        │
        ▼
    Polish
```

- **US1 → US2**: Reduced motion builds on presence utility from US1
- **US1 → US4**: React Presence uses same patterns as WC presence
- **US3**: Can run in parallel with US1/US2 (mostly CSS work)
- **All → US4**: Framework integration after core animation works

### Parallel Opportunities

**Setup Phase**:
```
T003 (create animation dir) ║ T004 (create primitives dir)
```

**User Story 3**:
```
T024 (data-animate-in CSS) ║ T025 (data-no-animation CSS)
```

**User Story 4 - WC**:
```
T027 (popover) ║ T028 (tooltip) ║ T029 (menu)
```

**Polish Phase**:
```
T035 (tests) ║ T036 (bundle size) ║ T037 (build) ║ T038 (typecheck)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational CSS (T005-T009)
3. Complete Phase 3: User Story 1 - Dialog animation (T010-T017)
4. **STOP and VALIDATE**: Dialog opens/closes with animation
5. Can ship with just animated dialog

### Incremental Delivery

1. **Foundation** → CSS animations work
2. **+US1** → Dialog animates (MVP!)
3. **+US2** → Reduced motion works (Accessibility complete)
4. **+US3** → Token customization works (Designer workflow)
5. **+US4** → All overlays + React Presence (Full platform support)

### Recommended Sequence

For a single developer:
1. T001-T009 (Setup + Foundational)
2. T010-T017 (US1 - Dialog animation)
3. T018-T022 (US2 - Reduced motion)
4. T023-T026 (US3 - Token customization)
5. T027-T034 (US4 - Framework integration)
6. T035-T040 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies between them
- [Story] label maps task to user story for traceability
- Motion tokens already exist - no changes needed to @ds/tokens
- CSS animations reference existing token CSS variables
- Presence utility is the core JS logic (~2KB budget)
- Each user story can be independently validated
- Commit after each task or logical group
