# Requirements Checklist: Design System Quality Overhaul

**Purpose**: Track implementation of all functional requirements from the audit remediation spec
**Created**: 2026-01-09
**Feature**: [spec.md](../spec.md)

## Phase 0 - Accessibility Testing (P0)

### A11y Test Infrastructure
- [ ] REQ001 Set up axe-core test harness in `packages/wc/tests/a11y/`
- [ ] REQ002 Create shared test utilities for component setup/teardown
- [ ] REQ003 Add `pnpm test:a11y` script to package.json
- [ ] REQ004 Configure CI pipeline to run a11y tests and fail on violations

### A11y Tests - Form Controls (14 components)
- [x] REQ005 ds-button a11y tests (existing)
- [ ] REQ006 ds-input a11y tests
- [ ] REQ007 ds-textarea a11y tests
- [ ] REQ008 ds-checkbox a11y tests
- [ ] REQ009 ds-radio-group a11y tests
- [ ] REQ010 ds-switch a11y tests
- [ ] REQ011 ds-select a11y tests
- [ ] REQ012 ds-slider a11y tests
- [ ] REQ013 ds-date-picker a11y tests
- [ ] REQ014 ds-time-picker a11y tests
- [ ] REQ015 ds-file-upload a11y tests
- [ ] REQ016 ds-rating a11y tests
- [ ] REQ017 ds-pin-input a11y tests
- [ ] REQ018 ds-color-picker a11y tests

### A11y Tests - Navigation (8 components)
- [ ] REQ019 ds-breadcrumb a11y tests
- [ ] REQ020 ds-tabs a11y tests
- [ ] REQ021 ds-pagination a11y tests
- [ ] REQ022 ds-navigation-menu a11y tests
- [ ] REQ023 ds-sidebar a11y tests
- [ ] REQ024 ds-stepper a11y tests
- [ ] REQ025 ds-skip-link a11y tests
- [ ] REQ026 ds-link a11y tests

### A11y Tests - Overlays (8 components)
- [ ] REQ027 ds-dialog a11y tests
- [ ] REQ028 ds-drawer/sheet a11y tests
- [ ] REQ029 ds-popover a11y tests
- [ ] REQ030 ds-tooltip a11y tests
- [ ] REQ031 ds-dropdown-menu a11y tests
- [ ] REQ032 ds-context-menu a11y tests
- [ ] REQ033 ds-alert-dialog a11y tests
- [ ] REQ034 ds-command a11y tests

### A11y Tests - Feedback (7 components)
- [ ] REQ035 ds-toast a11y tests
- [ ] REQ036 ds-alert a11y tests
- [ ] REQ037 ds-progress a11y tests
- [ ] REQ038 ds-skeleton a11y tests
- [ ] REQ039 ds-spinner a11y tests
- [ ] REQ040 ds-badge a11y tests
- [ ] REQ041 ds-banner a11y tests

### A11y Tests - Data Display (9 components)
- [ ] REQ042 ds-data-table a11y tests
- [ ] REQ043 ds-accordion a11y tests
- [ ] REQ044 ds-card a11y tests
- [ ] REQ045 ds-avatar a11y tests
- [ ] REQ046 ds-carousel a11y tests
- [ ] REQ047 ds-collapsible a11y tests
- [ ] REQ048 ds-hover-card a11y tests
- [ ] REQ049 ds-list a11y tests
- [ ] REQ050 ds-tree-view a11y tests

### A11y Tests - Layout (8 components)
- [ ] REQ051 ds-container a11y tests
- [ ] REQ052 ds-stack a11y tests
- [ ] REQ053 ds-grid a11y tests
- [ ] REQ054 ds-flex a11y tests
- [ ] REQ055 ds-divider a11y tests
- [ ] REQ056 ds-scroll-area a11y tests
- [ ] REQ057 ds-resizable a11y tests
- [ ] REQ058 ds-aspect-ratio a11y tests

### A11y Tests - Typography (3 components)
- [ ] REQ059 ds-heading a11y tests
- [ ] REQ060 ds-text a11y tests
- [ ] REQ061 ds-label a11y tests

### A11y Tests - Utilities (3 components)
- [ ] REQ062 ds-visually-hidden a11y tests
- [ ] REQ063 ds-portal a11y tests
- [ ] REQ064 ds-focus-scope a11y tests

## Phase 0 - Overlay Composites (P0)

### createModalOverlay
- [ ] REQ065 Create `createModalOverlay()` in `packages/primitives-dom/src/composites/`
- [ ] REQ066 Bundle focus-trap primitive
- [ ] REQ067 Bundle dismissable-layer primitive
- [ ] REQ068 Bundle presence animation primitive
- [ ] REQ069 Add prefers-reduced-motion support
- [ ] REQ070 Add TypeScript types for ModalOverlayOptions
- [ ] REQ071 Add unit tests for createModalOverlay

### createPopoverOverlay
- [ ] REQ072 Create `createPopoverOverlay()` in `packages/primitives-dom/src/composites/`
- [ ] REQ073 Add anchor positioning with collision detection
- [ ] REQ074 Add scroll/resize repositioning
- [ ] REQ075 Bundle dismissable-layer primitive
- [ ] REQ076 Bundle presence animation primitive
- [ ] REQ077 Add TypeScript types for PopoverOverlayOptions
- [ ] REQ078 Add unit tests for createPopoverOverlay

### Migrate Components to Composites
- [ ] REQ079 Refactor ds-dialog to use createModalOverlay
- [ ] REQ080 Refactor ds-sheet to use createModalOverlay
- [ ] REQ081 Refactor ds-popover to use createPopoverOverlay
- [ ] REQ082 Refactor ds-dropdown-menu to use createPopoverOverlay

## Phase 1 - Selectable List Composite (P1)

### createSelectableList
- [ ] REQ083 Create `createSelectableList()` in `packages/primitives-dom/src/composites/`
- [ ] REQ084 Bundle roving-focus primitive
- [ ] REQ085 Bundle type-ahead primitive
- [ ] REQ086 Add selection tracking (single mode)
- [ ] REQ087 Add selection tracking (multi-select mode)
- [ ] REQ088 Add range selection support (Shift+click)
- [ ] REQ089 Add configurable type-ahead debounce
- [ ] REQ090 Add TypeScript types for SelectableListOptions
- [ ] REQ091 Add unit tests for createSelectableList

## Phase 1 - Performance Fixes (P1)

### Scroll Area
- [ ] REQ092 Cache scroll-area dimensions instead of per-frame getBoundingClientRect
- [ ] REQ093 Add ResizeObserver for dimension recalculation
- [ ] REQ094 Verify 60fps scrolling with DevTools Performance panel

### Animation
- [ ] REQ095 Clean up animation exit timeouts properly
- [ ] REQ096 Add timeout cleanup on component disconnect

## Phase 1 - ARIA Utilities (P1)

### Utility Functions
- [ ] REQ097 Create `generateAriaId()` with optional prefix
- [ ] REQ098 Create `connectAriaDescribedBy()` supporting multiple describers
- [ ] REQ099 Create `announceToScreenReader()` using aria-live regions
- [ ] REQ100 Add unit tests for ARIA utilities
- [ ] REQ101 Export utilities from `packages/primitives-dom/src/aria/`

## Phase 1 - React Pattern Fixes (P1)

### Handler Stability
- [ ] REQ102 Audit all React adapters for handler recreation
- [ ] REQ103 Fix ds-input handler recreation (lines 73-102)
- [ ] REQ104 Apply useCallback pattern across all adapters
- [ ] REQ105 Verify referential equality with React DevTools

## Phase 1 - Component Manifests (P1)

### Manifest Files
- [ ] REQ106 Create manifest.json template with required fields
- [ ] REQ107 Add manifests for Form Controls (14 components)
- [ ] REQ108 Add manifests for Navigation (8 components)
- [ ] REQ109 Add manifests for Overlays (8 components)
- [ ] REQ110 Add manifests for Feedback (7 components)
- [ ] REQ111 Add manifests for Data Display (9 components)
- [ ] REQ112 Add manifests for Layout (8 components)
- [ ] REQ113 Add manifests for Typography (3 components)
- [ ] REQ114 Add manifests for Utilities (3 components)
- [ ] REQ115 Verify `pnpm --filter @ds/docs-core validate:manifests` passes

## Phase 1 - Development Warnings (P1)

### Warning System
- [ ] REQ116 Ensure dev warnings are tree-shaken in production
- [ ] REQ117 Add DS003 warning for missing aria-labelledby on Dialog
- [ ] REQ118 Add a11y-specific warnings per audit findings
- [ ] REQ119 Verify warnings appear in dev mode only

## Phase 2 - ComponentController (P2)

### Controller Mixin
- [ ] REQ120 Create ComponentController mixin in `packages/wc/src/base/`
- [ ] REQ121 Handle connectedCallback/disconnectedCallback lifecycle
- [ ] REQ122 Provide form association via ElementInternals
- [ ] REQ123 Add onMount, onUnmount, onUpdate hooks
- [ ] REQ124 Add unit tests for ComponentController

## Phase 2 - High Contrast Mode (P2)

### Testing
- [ ] REQ125 Test interactive components in Windows High Contrast Mode
- [ ] REQ126 Verify focus indicators visible in forced-colors mode
- [ ] REQ127 Add forced-colors media query fallbacks where needed
- [ ] REQ128 Document high contrast testing procedure

## Notes

- Check items off as completed: `[x]`
- Phase gates: P0 must be complete before starting P1, P1 before P2
- Items are numbered sequentially for cross-reference (REQ001-REQ128)
- Link to relevant PRs when items are completed
