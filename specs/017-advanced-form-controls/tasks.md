# Tasks: Advanced Form Controls

**Input**: Design documents from `/specs/017-advanced-form-controls/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Components are ordered by priority (P1 → P2 → P3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependencies

- [x] T001 Add date-fns v4 and @date-fns/tz as dependencies to @ds/wc in `packages/wc/package.json`
- [x] T002 [P] Create component directory structure for all 8 components in `packages/wc/src/components/`
- [x] T003 [P] Create React adapter directory structure for all 8 components in `packages/react/src/components/`
- [x] T004 [P] Create CSS layer files for all 8 components in `packages/css/src/layers/components/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core behavior primitives that MUST be complete before component implementation

**⚠️ CRITICAL**: Select, Combobox, Slider, and PinInput depend on these primitives

### Shared Behavior Primitives

- [x] T005 Implement `createSelectBehavior` in `packages/primitives-dom/src/behavior/select.ts` per contracts/behavior-primitives.md
- [x] T006 [P] Implement `createComboboxBehavior` in `packages/primitives-dom/src/behavior/combobox.ts` per contracts/behavior-primitives.md
- [x] T007 [P] Implement `createSliderBehavior` in `packages/primitives-dom/src/behavior/slider.ts` per contracts/behavior-primitives.md
- [x] T008 [P] Implement `createPinInputBehavior` in `packages/primitives-dom/src/behavior/pin-input.ts` per contracts/behavior-primitives.md
- [x] T009 [P] Implement `createVirtualizedList` in `packages/primitives-dom/src/keyboard/virtualized-list.ts` per contracts/behavior-primitives.md
- [x] T010 Export all new primitives from `packages/primitives-dom/src/index.ts`
- [x] T011 Build primitives-dom package with `pnpm --filter @ds/primitives-dom build`

### Primitive Unit Tests

- [x] T012 [P] Add unit tests for createSelectBehavior in `packages/primitives-dom/tests/behavior/select.test.ts`
- [x] T013 [P] Add unit tests for createComboboxBehavior in `packages/primitives-dom/tests/behavior/combobox.test.ts`
- [x] T014 [P] Add unit tests for createSliderBehavior in `packages/primitives-dom/tests/behavior/slider.test.ts`
- [x] T015 [P] Add unit tests for createPinInputBehavior in `packages/primitives-dom/tests/behavior/pin-input.test.ts`
- [x] T016 [P] Add unit tests for createVirtualizedList in `packages/primitives-dom/tests/keyboard/virtualized-list.test.ts`

**Checkpoint**: Foundation ready - all behavior primitives implemented and tested. Component implementation can now begin.

---

## Phase 3: User Story 1 - Select Component (Priority: P1) 🎯 MVP

**Goal**: Developer can add a searchable, accessible Select for country picker with 200+ options

**Independent Test**: Render Select with 200 options, type to filter, navigate with arrow keys, select with Enter

### Web Component Implementation

- [x] T017 [US1] Create `ds-select` root component in `packages/wc/src/components/select/select.ts` using createSelectBehavior
- [x] T018 [P] [US1] Create `ds-select-trigger` in `packages/wc/src/components/select/select-trigger.ts`
- [x] T019 [P] [US1] Create `ds-select-content` (popover listbox) in `packages/wc/src/components/select/select-content.ts`
- [x] T020 [P] [US1] Create `ds-select-option` in `packages/wc/src/components/select/select-option.ts`
- [x] T021 [P] [US1] Create `ds-select-group` for grouped options in `packages/wc/src/components/select/select-group.ts`
- [x] T022 [US1] Add typeahead search filtering when `searchable` attribute is set
- [x] T023 [US1] Add clear button functionality when `clearable` attribute is set
- [x] T024 [US1] Integrate virtualization for >100 options using createVirtualizedList
- [x] T025 [US1] Add keyboard navigation (Arrow keys, Home, End, Escape, Enter, Space)
- [x] T026 [US1] Integrate with Field pattern (aria-labelledby, aria-describedby, aria-invalid)
- [x] T027 [US1] Create manifest.json in `packages/wc/src/components/select/manifest.json`
- [x] T028 [US1] Export Select components from `packages/wc/src/components/select/index.ts`

### React Adapter

- [x] T029 [US1] Create React `<Select>` wrapper in `packages/react/src/components/select/select.tsx`
- [x] T030 [P] [US1] Create `Select.Trigger` compound component
- [x] T031 [P] [US1] Create `Select.Content` compound component
- [x] T032 [P] [US1] Create `Select.Option` compound component
- [x] T033 [P] [US1] Create `Select.Group` compound component
- [x] T034 [US1] Export Select from `packages/react/src/components/select/index.ts`

### Styles

- [x] T035 [P] [US1] Create Select CSS styles in `packages/wc/src/components/select/select.css`
- [x] T036 [US1] Add Select import to `packages/css/src/layers/components.css`

### Tests

- [x] T037 [P] [US1] Add unit tests for ds-select in `packages/wc/tests/unit/select.test.ts`
- [x] T038 [P] [US1] Add accessibility tests for Select (axe-core) in `packages/wc/tests/a11y/select.test.ts`

**Checkpoint**: Select component fully functional - searchable, clearable, accessible, virtualized for 200+ options

---

## Phase 4: User Story 2 - Combobox Component (Priority: P1)

**Goal**: Developer can create multi-select Combobox with async search and tag display

**Independent Test**: Type to trigger async search, select multiple items as tags, remove tags, create new values

### Web Component Implementation

- [x] T039 [US2] Create `ds-combobox` root component in `packages/wc/src/components/combobox/combobox.ts` using createComboboxBehavior
- [x] T040 [P] [US2] Create `ds-combobox-input` in `packages/wc/src/components/combobox/combobox-input.ts`
- [x] T041 [P] [US2] Create `ds-combobox-content` (popover listbox) in `packages/wc/src/components/combobox/combobox-content.ts`
- [x] T042 [P] [US2] Create `ds-combobox-option` in `packages/wc/src/components/combobox/combobox-option.ts`
- [x] T043 [P] [US2] Create `ds-combobox-tag` for multi-select display in `packages/wc/src/components/combobox/combobox-tag.ts`
- [x] T044 [US2] Implement async loading via `loadItems` property with loading state
- [x] T045 [US2] Implement debounced input (default 300ms via `debounce` attribute)
- [x] T046 [US2] Implement multi-select mode with `multiple` attribute
- [x] T047 [US2] Implement creatable mode with `creatable` attribute (Create "[value]" option)
- [x] T048 [US2] Integrate virtualization for >100 options
- [x] T049 [US2] Add keyboard navigation including Backspace to remove last tag
- [x] T050 [US2] Integrate with Field pattern
- [x] T051 [US2] Create manifest.json in `packages/wc/src/components/combobox/manifest.json`
- [x] T052 [US2] Export Combobox components from `packages/wc/src/components/combobox/index.ts`

### React Adapter

- [x] T053 [US2] Create React `<Combobox>` wrapper in `packages/react/src/components/combobox/combobox.tsx`
- [x] T054 [P] [US2] Create `Combobox.Input` compound component
- [x] T055 [P] [US2] Create `Combobox.Content` compound component
- [x] T056 [P] [US2] Create `Combobox.Option` compound component
- [x] T057 [P] [US2] Create `Combobox.Empty` and `Combobox.Loading` compound components
- [x] T058 [P] [US2] Create `Combobox.Tag` compound component
- [x] T059 [US2] Export Combobox from `packages/react/src/components/combobox/index.ts`

### Styles

- [x] T060 [P] [US2] Create Combobox CSS styles in `packages/wc/src/components/combobox/combobox.css`
- [x] T061 [US2] Add Combobox import to `packages/css/src/layers/components.css`

### Tests

- [x] T062 [P] [US2] Add unit tests for ds-combobox in `packages/wc/tests/unit/combobox.test.ts`
- [x] T063 [P] [US2] Add accessibility tests for Combobox (axe-core) in `packages/wc/tests/a11y/combobox.test.ts`
- [x] T064 [US2] Add async loading test scenarios (race conditions, error handling)

**Checkpoint**: Combobox fully functional - async search, multi-select tags, creatable, debounced, accessible

---

## Phase 5: User Story 3 - DatePicker Component (Priority: P1)

**Goal**: Developer can add DatePicker for booking form with single/range selection, min/max constraints, and locale support

**Independent Test**: Open calendar, navigate with arrow keys, select date/range, verify locale formatting

### Web Component Implementation

- [x] T065 [US3] Create date utility functions using date-fns in `packages/wc/src/components/date-picker/date-utils.ts`
- [x] T066 [US3] Create `ds-date-picker` root component in `packages/wc/src/components/date-picker/date-picker.ts`
- [x] T067 [P] [US3] Create `ds-calendar` grid component in `packages/wc/src/components/date-picker/calendar.ts`
- [x] T068 [P] [US3] Create `ds-calendar-cell` gridcell in `packages/wc/src/components/date-picker/calendar-cell.ts`
- [x] T069 [US3] Implement single date selection mode (`mode="single"`)
- [x] T070 [US3] Implement date range selection mode (`mode="range"`)
- [x] T071 [US3] Implement min/max date constraints with disabled styling
- [x] T072 [US3] Implement locale-aware formatting via `locale` attribute (using date-fns locales)
- [x] T073 [US3] Add keyboard navigation (Arrow keys, Page Up/Down for month, Home/End)
- [x] T074 [US3] Implement month/year navigation (prev/next buttons, quick selectors)
- [x] T075 [US3] Implement typed date input with format validation
- [x] T076 [US3] Integrate with Field pattern
- [x] T077 [US3] Create manifest.json in `packages/wc/src/components/date-picker/manifest.json`
- [x] T078 [US3] Export DatePicker components from `packages/wc/src/components/date-picker/index.ts`

### React Adapter

- [x] T079 [US3] Create React `<DatePicker>` wrapper in `packages/react/src/components/date-picker/date-picker.tsx`
- [x] T080 [P] [US3] Create `DatePicker.Trigger` compound component
- [x] T081 [P] [US3] Create `DatePicker.Calendar` compound component
- [x] T082 [US3] Export DatePicker from `packages/react/src/components/date-picker/index.ts`

### Styles

- [x] T083 [P] [US3] Create DatePicker CSS styles in `packages/wc/src/components/date-picker/date-picker.css`
- [x] T084 [US3] Add DatePicker import to `packages/css/src/layers/components.css`

### Tests

- [x] T085 [P] [US3] Add unit tests for ds-date-picker in `packages/wc/tests/unit/date-picker.test.ts`
- [x] T086 [P] [US3] Add accessibility tests for DatePicker (axe-core) in `packages/wc/tests/a11y/date-picker.test.ts`
- [x] T087 [US3] Add locale tests (en-US, de-DE, fr-FR, es-ES, ja-JP)

**Checkpoint**: DatePicker fully functional - single/range selection, min/max, locale-aware, keyboard accessible

---

## Phase 6: User Story 4 - Slider Component (Priority: P2)

**Goal**: Developer can add range Slider for price filter with two thumbs, step snapping, and keyboard control

**Independent Test**: Drag thumbs, use arrow keys to adjust, verify thumbs cannot cross

### Web Component Implementation

- [x] T088 [US4] Create `ds-slider` root component in `packages/wc/src/components/slider/slider.ts` using createSliderBehavior
- [x] T089 [P] [US4] Create `ds-slider-thumb` in `packages/wc/src/components/slider/slider-thumb.ts`
- [x] T090 [P] [US4] Create `ds-slider-track` in `packages/wc/src/components/slider/slider-track.ts`
- [x] T091 [US4] Implement single-thumb mode (default)
- [x] T092 [US4] Implement range mode with `range` attribute (two thumbs: min/max)
- [x] T093 [US4] Implement step snapping with `step` attribute
- [x] T094 [US4] Implement thumb collision prevention (min cannot exceed max)
- [x] T095 [US4] Add keyboard control (Arrow keys = step, Page Up/Down = 10× step, Home/End = min/max)
- [x] T096 [US4] Implement optional tick marks with `show-ticks` attribute
- [x] T097 [US4] Implement value tooltip on focus/drag with `show-tooltip` attribute
- [x] T098 [US4] Implement vertical orientation with `orientation="vertical"` attribute
- [x] T099 [US4] Integrate with Field pattern
- [x] T100 [US4] Create manifest.json in `packages/wc/src/components/slider/manifest.json`
- [x] T101 [US4] Export Slider components from `packages/wc/src/components/slider/index.ts`

### React Adapter

- [x] T102 [US4] Create React `<Slider>` wrapper in `packages/react/src/components/slider/slider.tsx`
- [x] T103 [US4] Export Slider from `packages/react/src/components/slider/index.ts`

### Styles

- [x] T104 [P] [US4] Create Slider CSS styles in `packages/wc/src/components/slider/slider.css`
- [x] T105 [US4] Add Slider import to `packages/css/src/layers/components.css`

### Tests

- [x] T106 [P] [US4] Add unit tests for ds-slider in `packages/wc/tests/unit/slider.test.ts`
- [x] T107 [P] [US4] Add accessibility tests for Slider (axe-core) in `packages/wc/tests/a11y/slider.test.ts`

**Checkpoint**: Slider fully functional - single/range mode, step snapping, keyboard accessible, tooltips

---

## Phase 7: User Story 5 - NumberInput Component (Priority: P2)

**Goal**: Developer can add NumberInput with increment/decrement buttons, step, and min/max validation

**Independent Test**: Click +/- buttons, type values, verify constraints are enforced

### Web Component Implementation

- [x] T108 [US5] Create `ds-number-input` component in `packages/wc/src/components/number-input/number-input.ts`
- [x] T109 [US5] Implement increment (+) and decrement (-) buttons with `role="spinbutton"` ARIA
- [x] T110 [US5] Implement step, min, max constraints with button disabling at bounds
- [x] T111 [US5] Implement keyboard control (Up/Down arrows for step increment)
- [x] T112 [US5] Implement input sanitization (allow only valid numeric characters)
- [x] T113 [US5] Implement optional prefix/suffix display (`prefix`, `suffix` attributes)
- [x] T114 [US5] Integrate with Field pattern
- [x] T115 [US5] Create manifest.json in `packages/wc/src/components/number-input/manifest.json`
- [x] T116 [US5] Export NumberInput from `packages/wc/src/components/number-input/index.ts`

### React Adapter

- [x] T117 [US5] Create React `<NumberInput>` wrapper in `packages/react/src/components/number-input/number-input.tsx`
- [x] T118 [US5] Export NumberInput from `packages/react/src/components/number-input/index.ts`

### Styles

- [x] T119 [P] [US5] Create NumberInput CSS styles in `packages/wc/src/components/number-input/number-input.css`
- [x] T120 [US5] Add NumberInput import to `packages/css/src/layers/components.css`

### Tests

- [x] T121 [P] [US5] Add unit tests for ds-number-input in `packages/wc/tests/unit/number-input.test.ts`
- [x] T122 [P] [US5] Add accessibility tests for NumberInput (axe-core) in `packages/wc/tests/a11y/number-input.test.ts`

**Checkpoint**: NumberInput fully functional - +/- buttons, step/min/max, keyboard control, prefix/suffix

---

## Phase 8: User Story 6 - FileUpload Component (Priority: P2)

**Goal**: Developer can add FileUpload with drag-and-drop, file validation, and upload progress

**Independent Test**: Drag files onto drop zone, select via button, verify validation and preview

### Web Component Implementation

- [x] T123 [US6] Create `ds-file-upload` root component in `packages/wc/src/components/file-upload/file-upload.ts`
- [x] T124 [P] [US6] Create `ds-file-item` for file preview in `packages/wc/src/components/file-upload/file-item.ts`
- [x] T125 [US6] Implement native file picker via hidden `<input type="file">`
- [x] T126 [US6] Implement drag-and-drop with visual hover state
- [x] T127 [US6] Implement file type validation via `accept` attribute
- [x] T128 [US6] Implement max file size validation via `max-size` attribute
- [x] T129 [US6] Implement multiple file support with `max-files` attribute
- [x] T130 [US6] Implement file preview list (name, size, remove button)
- [x] T131 [US6] Implement `onUpload` hook for upload progress reporting
- [x] T132 [US6] Add ARIA live region for file addition/removal announcements
- [x] T133 [US6] Always provide visible button alternative (WCAG 2.5.7 compliance)
- [x] T134 [US6] Integrate with Field pattern
- [x] T135 [US6] Create manifest.json in `packages/wc/src/components/file-upload/manifest.json`
- [x] T136 [US6] Export FileUpload components from `packages/wc/src/components/file-upload/index.ts`

### React Adapter

- [x] T137 [US6] Create React `<FileUpload>` wrapper in `packages/react/src/components/file-upload/file-upload.tsx`
- [x] T138 [P] [US6] Create `FileUpload.DropZone` compound component
- [x] T139 [P] [US6] Create `FileUpload.FileList` compound component
- [x] T140 [P] [US6] Create `FileUpload.FileItem` compound component
- [x] T141 [US6] Export FileUpload from `packages/react/src/components/file-upload/index.ts`

### Styles

- [x] T142 [P] [US6] Create FileUpload CSS styles in `packages/wc/src/components/file-upload/file-upload.css`
- [x] T143 [US6] Add FileUpload import to `packages/css/src/layers/components.css`

### Tests

- [x] T144 [P] [US6] Add unit tests for ds-file-upload in `packages/wc/tests/unit/file-upload.test.ts`
- [x] T145 [P] [US6] Add accessibility tests for FileUpload (axe-core) in `packages/wc/tests/a11y/file-upload.test.ts`

**Checkpoint**: FileUpload fully functional - drag-drop, file picker, validation, progress, accessible

---

## Phase 9: User Story 7 - TimePicker Component (Priority: P3)

**Goal**: Developer can add TimePicker with 12/24 hour format, minute intervals, and AM/PM selection

**Independent Test**: Open picker, select hour/minute, toggle AM/PM, verify format output

### Web Component Implementation

- [x] T146 [US7] Create time utility functions using date-fns in `packages/wc/src/components/time-picker/time-utils.ts`
- [x] T147 [US7] Create `ds-time-picker` component in `packages/wc/src/components/time-picker/time-picker.ts`
- [x] T148 [US7] Implement hour/minute selection UI (listboxes or spinbuttons)
- [x] T149 [US7] Implement 12-hour format with AM/PM selector (`format="12h"`)
- [x] T150 [US7] Implement 24-hour format (`format="24h"`)
- [x] T151 [US7] Implement configurable minute intervals (`minute-step`: 1, 5, 15, 30)
- [x] T152 [US7] Add keyboard navigation for hour/minute selection
- [x] T153 [US7] Integrate with Field pattern
- [x] T154 [US7] Create manifest.json in `packages/wc/src/components/time-picker/manifest.json`
- [x] T155 [US7] Export TimePicker from `packages/wc/src/components/time-picker/index.ts`

### React Adapter

- [x] T156 [US7] Create React `<TimePicker>` wrapper in `packages/react/src/components/time-picker/time-picker.tsx`
- [x] T157 [US7] Export TimePicker from `packages/react/src/components/time-picker/index.ts`

### Styles

- [x] T158 [P] [US7] Create TimePicker CSS styles in `packages/wc/src/components/time-picker/time-picker.css`
- [x] T159 [US7] Add TimePicker import to `packages/css/src/layers/components.css`

### Tests

- [x] T160 [P] [US7] Add unit tests for ds-time-picker in `packages/wc/tests/unit/time-picker.test.ts`
- [x] T161 [P] [US7] Add accessibility tests for TimePicker (axe-core) in `packages/wc/tests/a11y/time-picker.test.ts`

**Checkpoint**: TimePicker fully functional - 12/24 hour format, minute intervals, keyboard accessible

---

## Phase 10: User Story 8 - PinInput Component (Priority: P3)

**Goal**: Developer can add PinInput for OTP verification with auto-advance, paste support, and masking

**Independent Test**: Type digits with auto-advance, paste full code, backspace navigation

### Web Component Implementation

- [x] T162 [US8] Create `ds-pin-input` root component in `packages/wc/src/components/pin-input/pin-input.ts` using createPinInputBehavior
- [x] T163 [P] [US8] Create `ds-pin-digit` individual input in `packages/wc/src/components/pin-input/pin-digit.ts`
- [x] T164 [US8] Implement configurable length via `length` attribute (default: 6)
- [x] T165 [US8] Implement auto-advance focus on digit entry
- [x] T166 [US8] Implement paste handling to populate all digits at once
- [x] T167 [US8] Implement backspace to delete and move focus backward
- [x] T168 [US8] Implement masking (show dots) with `mask` attribute
- [x] T169 [US8] Implement alphanumeric mode with `alphanumeric` attribute
- [x] T170 [US8] Fire `ds:complete` event when all digits entered
- [x] T171 [US8] Add proper ARIA: role="group" container, individual inputs with labels
- [x] T172 [US8] Integrate with Field pattern
- [x] T173 [US8] Create manifest.json in `packages/wc/src/components/pin-input/manifest.json`
- [x] T174 [US8] Export PinInput components from `packages/wc/src/components/pin-input/index.ts`

### React Adapter

- [x] T175 [US8] Create React `<PinInput>` wrapper in `packages/react/src/components/pin-input/pin-input.tsx`
- [x] T176 [P] [US8] Create `PinInput.Field` compound component
- [x] T177 [US8] Export PinInput from `packages/react/src/components/pin-input/index.ts`

### Styles

- [x] T178 [P] [US8] Create PinInput CSS styles in `packages/wc/src/components/pin-input/pin-input.css`
- [x] T179 [US8] Add PinInput import to `packages/css/src/layers/components.css`

### Tests

- [x] T180 [P] [US8] Add unit tests for ds-pin-input in `packages/wc/tests/unit/pin-input.test.ts`
- [x] T181 [P] [US8] Add accessibility tests for PinInput (axe-core) in `packages/wc/tests/a11y/pin-input.test.ts`
- [x] T182 [US8] Add paste workflow test (paste "123456" → all populated + onComplete fires)

**Checkpoint**: PinInput fully functional - auto-advance, paste, backspace, masking, accessible

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Package Exports & Integration

- [x] T183 [P] Export all WC components from `packages/wc/src/index.ts`
- [x] T184 [P] Export all React components from `packages/react/src/index.ts`
- [x] T185 Build all packages with `pnpm build`
- [x] T186 Run type checking with `pnpm typecheck`

### Motion & Animation Integration

- [x] T187 [P] Add popover open/close animations to Select using motion tokens
- [x] T188 [P] Add popover open/close animations to Combobox using motion tokens
- [x] T189 [P] Add calendar open/close animations to DatePicker using motion tokens
- [x] T190 [P] Add tooltip animations to Slider
- [x] T191 [P] Add time picker popover animations
- [x] T192 Verify `prefers-reduced-motion` is respected in all components

### Manifest & Documentation Validation

- [ ] T193 Run manifest validation with `pnpm --filter @ds/docs-core validate:manifests --strict`
- [ ] T194 Validate quickstart.md examples execute without errors
- [x] T195 [P] Add MDX documentation for Select in `packages/docs-content/components/select.mdx`
- [x] T196 [P] Add MDX documentation for Combobox in `packages/docs-content/components/combobox.mdx`
- [x] T197 [P] Add MDX documentation for DatePicker in `packages/docs-content/components/date-picker.mdx`
- [x] T198 [P] Add MDX documentation for Slider in `packages/docs-content/components/slider.mdx`
- [x] T199 [P] Add MDX documentation for NumberInput in `packages/docs-content/components/number-input.mdx`
- [x] T200 [P] Add MDX documentation for FileUpload in `packages/docs-content/components/file-upload.mdx`
- [x] T201 [P] Add MDX documentation for TimePicker in `packages/docs-content/components/time-picker.mdx`
- [x] T202 [P] Add MDX documentation for PinInput in `packages/docs-content/components/pin-input.mdx`

### Final Verification

- [x] T203 Run full test suite with `pnpm test` (893 tests passing in @ds/wc)
- [x] T204 Run accessibility audit with `pnpm test:a11y` (all a11y tests passing)
- [x] T205 Verify bundle size <10KB gzipped per component (excluding date-fns)
- [ ] T206 Verify SSR compatibility (components render meaningful HTML without JS)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all component implementation
- **User Stories (Phases 3-10)**: All depend on Foundational phase completion
  - P1 components (Select, Combobox, DatePicker) can proceed in parallel
  - P2 components (Slider, NumberInput, FileUpload) can proceed in parallel
  - P3 components (TimePicker, PinInput) can proceed in parallel
- **Polish (Phase 11)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (Select)**: Requires createSelectBehavior, createVirtualizedList
- **User Story 2 (Combobox)**: Requires createComboboxBehavior, createVirtualizedList
- **User Story 3 (DatePicker)**: Requires date-fns, no behavior primitive (calendar logic is custom)
- **User Story 4 (Slider)**: Requires createSliderBehavior
- **User Story 5 (NumberInput)**: No primitive dependency (simpler control)
- **User Story 6 (FileUpload)**: No primitive dependency
- **User Story 7 (TimePicker)**: Requires date-fns
- **User Story 8 (PinInput)**: Requires createPinInputBehavior

### Within Each User Story

- WC implementation before React adapter
- Root component before child components
- Implementation before tests
- Component complete before adding to package exports

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All primitive implementations in Phase 2 marked [P] can run in parallel
- P1 user stories (US1, US2, US3) can run in parallel after Phase 2
- P2 user stories (US4, US5, US6) can run in parallel
- P3 user stories (US7, US8) can run in parallel
- All documentation tasks marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (P1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: Select (US1)
4. Complete Phase 4: Combobox (US2)
5. Complete Phase 5: DatePicker (US3)
6. **STOP and VALIDATE**: Test all P1 components independently
7. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add Select → Test → Deploy (MVP with basic selection)
3. Add Combobox → Test → Deploy (async search capability)
4. Add DatePicker → Test → Deploy (scheduling capability)
5. Add Slider, NumberInput, FileUpload → Test → Deploy (P2 complete)
6. Add TimePicker, PinInput → Test → Deploy (full feature set)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Select + Combobox (shared virtualization)
   - Developer B: DatePicker + TimePicker (shared date-fns)
   - Developer C: Slider + NumberInput (numeric controls)
   - Developer D: FileUpload + PinInput
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Verify tests pass before moving to next story
- All components use Light DOM rendering for SSR and theming compatibility
