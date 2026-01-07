# Implementation Plan: Advanced Form Controls

**Branch**: `017-advanced-form-controls` | **Date**: 2026-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/017-advanced-form-controls/spec.md`

## Summary

Implement 8 advanced form control components (Select, Combobox, DatePicker, Slider, NumberInput, FileUpload, TimePicker, PinInput) using a hybrid approach: custom primitives for core form controls, date-fns for calendar logic. All components use Light DOM, integrate with Field pattern, and follow APG accessibility patterns.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (WC), React 18+ (adapters), date-fns 3.x (DatePicker/TimePicker only)
**Storage**: N/A (stateless UI components)
**Testing**: Vitest 1.x, happy-dom, axe-core, Playwright (e2e a11y)
**Target Platform**: Web (SSR-friendly, Next.js App Router compatible)
**Project Type**: Monorepo (existing packages: @ds/primitives-dom, @ds/wc, @ds/react, @ds/css)
**Performance Goals**: <100ms filter response for 1000+ options; <10KB gzipped per component
**Constraints**: Zero runtime deps for core packages; Lit-only for @ds/wc; date-fns isolated to date components
**Scale/Scope**: 8 components × 2 platforms (WC + React) = 16 component implementations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; minimal client boundaries; SSR-friendly (Light DOM, progressive enhancement)
- [x] **Accessibility**: WCAG 2.1 AA plan (APG patterns: listbox, combobox, grid, slider, spinbutton); axe-core + manual testing
- [x] **Customizability**: Uses DTCG tokens; CSS layers for overrides; no inline styles blocking customization
- [x] **Zero-dep Core**: @ds/primitives-dom has 0 deps; date-fns only in @ds/wc for DatePicker/TimePicker
- [x] **Web Components**: Light DOM default; Lit-based; theme via CSS vars
- [x] **Dependency Management**: date-fns 3.x (latest stable, tree-shakable); pnpm workspace

## Project Structure

### Documentation (this feature)

```text
specs/017-advanced-form-controls/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/
├── primitives-dom/src/
│   ├── behavior/
│   │   ├── select.ts           # NEW: Select behavior primitive
│   │   ├── combobox.ts         # NEW: Combobox behavior primitive
│   │   ├── slider.ts           # NEW: Slider behavior primitive
│   │   └── pin-input.ts        # NEW: PinInput behavior primitive
│   ├── keyboard/
│   │   └── virtualized-list.ts # NEW: Intersection observer virtualization
│   └── index.ts                # Export new primitives
│
├── wc/src/components/
│   ├── select/
│   │   ├── select.ts           # ds-select (root)
│   │   ├── select-trigger.ts   # ds-select-trigger
│   │   ├── select-content.ts   # ds-select-content
│   │   ├── select-option.ts    # ds-select-option
│   │   ├── select-group.ts     # ds-select-group
│   │   └── manifest.json
│   ├── combobox/
│   │   ├── combobox.ts         # ds-combobox (root)
│   │   ├── combobox-input.ts   # ds-combobox-input
│   │   ├── combobox-content.ts # ds-combobox-content
│   │   ├── combobox-option.ts  # ds-combobox-option
│   │   ├── combobox-tag.ts     # ds-combobox-tag
│   │   └── manifest.json
│   ├── date-picker/
│   │   ├── date-picker.ts      # ds-date-picker (root)
│   │   ├── calendar.ts         # ds-calendar (grid)
│   │   ├── calendar-cell.ts    # ds-calendar-cell
│   │   └── manifest.json
│   ├── slider/
│   │   ├── slider.ts           # ds-slider (root)
│   │   ├── slider-thumb.ts     # ds-slider-thumb
│   │   ├── slider-track.ts     # ds-slider-track
│   │   └── manifest.json
│   ├── number-input/
│   │   ├── number-input.ts     # ds-number-input
│   │   └── manifest.json
│   ├── file-upload/
│   │   ├── file-upload.ts      # ds-file-upload (root)
│   │   ├── file-item.ts        # ds-file-item
│   │   └── manifest.json
│   ├── time-picker/
│   │   ├── time-picker.ts      # ds-time-picker
│   │   └── manifest.json
│   └── pin-input/
│       ├── pin-input.ts        # ds-pin-input (root)
│       ├── pin-digit.ts        # ds-pin-digit
│       └── manifest.json
│
├── react/src/components/
│   ├── select/                 # React wrappers (compound pattern)
│   ├── combobox/
│   ├── date-picker/
│   ├── slider/
│   ├── number-input/
│   ├── file-upload/
│   ├── time-picker/
│   └── pin-input/
│
├── css/src/layers/
│   └── components/
│       ├── select.css          # NEW: Select styles
│       ├── combobox.css        # NEW: Combobox styles
│       ├── date-picker.css     # NEW: DatePicker styles
│       ├── slider.css          # NEW: Slider styles
│       ├── number-input.css    # NEW: NumberInput styles
│       ├── file-upload.css     # NEW: FileUpload styles
│       ├── time-picker.css     # NEW: TimePicker styles
│       └── pin-input.css       # NEW: PinInput styles
│
└── tokens/src/tokens/
    └── components/             # Component-specific tokens (if needed)
```

**Structure Decision**: Extends existing monorepo structure. New components follow established patterns from Dialog/Menu. Behavior primitives go in @ds/primitives-dom; WC implementations in @ds/wc; React adapters in @ds/react; styles in @ds/css.

## Complexity Tracking

> No constitution violations. date-fns dependency is justified in Approach Analysis.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| date-fns in @ds/wc | DatePicker/TimePicker require complex date math (timezones, locales, leap years) | Hand-rolling date logic is error-prone; date-fns is tree-shakable |

## New Primitives Required

Based on existing primitives analysis, these new behavior primitives are needed:

### @ds/primitives-dom additions

1. **createSelectBehavior** - Manages select open/close, value selection, typeahead filtering
   - Reuses: createDismissableLayer, createTypeAhead, createRovingFocus
   - New: Option virtualization (>100 items), clear button logic

2. **createComboboxBehavior** - Manages input, async loading, multi-select tags
   - Reuses: createDismissableLayer, createTypeAhead, createRovingFocus
   - New: Async state management, debounce, tag management, creatable mode

3. **createSliderBehavior** - Manages thumb dragging, keyboard control, range constraints
   - New: Drag handling, value clamping, step snapping, range thumb collision prevention

4. **createPinInputBehavior** - Manages focus auto-advance, paste handling, backspace
   - New: Multi-input coordination, paste distribution, alphanumeric filtering

5. **createVirtualizedList** - Intersection observer-based virtualization
   - Shared by: Select, Combobox (when >100 options)
   - Threshold: Auto-activate at >100 items

## APG Pattern Mapping

| Component    | APG Pattern        | Key ARIA Roles                    |
|-------------|--------------------|-----------------------------------|
| Select      | Listbox (collapsed)| combobox, listbox, option         |
| Combobox    | Combobox           | combobox, listbox, option         |
| DatePicker  | Grid (dialog)      | dialog, grid, gridcell            |
| Slider      | Slider             | slider                            |
| NumberInput | Spinbutton         | spinbutton                        |
| FileUpload  | Button + list      | button, list, listitem            |
| TimePicker  | Listbox (multiple) | listbox, option (hour/minute/am)  |
| PinInput    | Group of textboxes | group, textbox                    |
