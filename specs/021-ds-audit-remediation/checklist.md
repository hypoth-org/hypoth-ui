# Audit Remediation Quality Checklist: Design System Audit Remediation

**Purpose**: Verify all audit findings are properly addressed across form association, tree-shaking, behavior deduplication, and testing improvements.
**Created**: 2026-01-09
**Feature**: [spec.md](./spec.md)

## P1 - Form Association (ElementInternals)

- [ ] CHK001 DsCheckbox has `static formAssociated = true`
- [ ] CHK002 DsCheckbox uses `this.attachInternals()` in constructor
- [ ] CHK003 DsCheckbox implements `formResetCallback()` and `formDisabledCallback()`
- [ ] CHK004 DsCheckbox calls `this.internals.setFormValue()` on value change
- [ ] CHK005 DsSwitch has `static formAssociated = true`
- [ ] CHK006 DsSwitch implements ElementInternals form callbacks
- [ ] CHK007 DsRadio/DsRadioGroup have `static formAssociated = true`
- [ ] CHK008 DsRadioGroup properly manages form value for selected radio
- [ ] CHK009 DsSelect has `static formAssociated = true`
- [ ] CHK010 DsSelect calls `this.internals.setFormValue()` with selected option value
- [ ] CHK011 DsCombobox has `static formAssociated = true`
- [ ] CHK012 DsCombobox handles multi-select form values correctly
- [ ] CHK013 All form controls support `name` attribute
- [ ] CHK014 All form controls support `required` attribute with `setValidity()`
- [ ] CHK015 All form controls support `disabled` attribute
- [ ] CHK016 FormData submission test passes for all form controls

## P1 - Tree-Shaking

- [ ] CHK017 @ds/wc package.json has `"sideEffects": false`
- [ ] CHK018 No module-level side effects in component files (except define())
- [ ] CHK019 Single-component import bundle size verified <20KB gzipped
- [ ] CHK020 Unused components excluded from bundle (verified with bundle analyzer)
- [ ] CHK021 All imports use ES module syntax (no require())

## P1 - Behavior Deduplication (Dialog Family)

- [ ] CHK022 DsDialog imports createDialogBehavior from @ds/primitives-dom
- [ ] CHK023 DsDialog removes inline FocusTrap creation code
- [ ] CHK024 DsDialog removes inline DismissableLayer creation code
- [ ] CHK025 DsAlertDialog uses createDialogBehavior with role="alertdialog"
- [ ] CHK026 DsSheet uses createDialogBehavior
- [ ] CHK027 DsSheet removes inline focus/dismiss code
- [ ] CHK028 DsDrawer uses createDialogBehavior
- [ ] CHK029 DsDrawer removes inline focus/dismiss code
- [ ] CHK030 Escape key behavior matches React implementations
- [ ] CHK031 Focus return behavior matches React implementations

## P1 - Behavior Deduplication (Menu Family)

- [ ] CHK032 DsDropdownMenu imports createMenuBehavior from @ds/primitives-dom
- [ ] CHK033 DsDropdownMenu removes inline keyboard handling code
- [ ] CHK034 DsContextMenu imports createMenuBehavior from @ds/primitives-dom
- [ ] CHK035 DsContextMenu removes inline keyboard handling code
- [ ] CHK036 Arrow key navigation matches React implementations
- [ ] CHK037 Type-ahead search matches React implementations

## P2 - Tabs Behavior Primitive

- [ ] CHK038 createTabsBehavior exists in @ds/primitives-dom
- [ ] CHK039 createTabsBehavior exported from @ds/primitives-dom index
- [ ] CHK040 createTabsBehavior handles horizontal orientation (Left/Right arrows)
- [ ] CHK041 createTabsBehavior handles vertical orientation (Up/Down arrows)
- [ ] CHK042 createTabsBehavior supports automatic activation mode
- [ ] CHK043 createTabsBehavior supports manual activation mode
- [ ] CHK044 DsTabs uses createTabsBehavior
- [ ] CHK045 DsTabs removes inline keyboard navigation code
- [ ] CHK046 Tabs WAI-ARIA pattern tests pass

## P2 - Granular Package Exports

- [ ] CHK047 @ds/wc package.json has exports field
- [ ] CHK048 Subpath export for @ds/wc/button exists
- [ ] CHK049 Subpath export for @ds/wc/input exists
- [ ] CHK050 Subpath export for @ds/wc/dialog exists
- [ ] CHK051 Subpath export for @ds/wc/select exists
- [ ] CHK052 Subpath export for @ds/wc/tabs exists
- [ ] CHK053 All subpath exports include TypeScript types
- [ ] CHK054 Main entry (.) remains backward compatible
- [ ] CHK055 At least 10 subpath entries defined

## P3 - Test Harness

- [ ] CHK056 Shared test utilities package exists
- [ ] CHK057 Framework-agnostic keyboard simulation helpers exist
- [ ] CHK058 Framework-agnostic ARIA assertion helpers exist
- [ ] CHK059 Button keyboard test runs on both WC and React
- [ ] CHK060 Dialog focus trap test runs on both implementations

## Regression Testing

- [ ] CHK061 All existing @ds/wc tests pass
- [ ] CHK062 All existing @ds/react tests pass
- [ ] CHK063 TypeScript compilation succeeds with no errors
- [ ] CHK064 Biome linting passes
- [ ] CHK065 Build command completes successfully

## Notes

- Check items off as completed: `[x]`
- Add comments or findings inline
- Link to relevant resources or documentation
- Items are numbered sequentially for easy reference
