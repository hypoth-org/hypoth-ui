# Feature Specification: Forms and Overlays Components

**Feature Branch**: `010-forms-overlays`
**Created**: 2026-01-04
**Status**: Draft
**Input**: User description: "Forms + overlays: Add accessible form controls and overlays with strict evidence. Input/Textarea/Checkbox/Radio/Switch + Field pattern. Dialog/Popover/Tooltip/Menu. All must meet docs + manifest + testing requirements. Define focus/dismiss patterns using primitives, define required APG alignment notes, and define which parts require JS. Implement incrementally (Input + Dialog first), each with docs + manifest + evidence gates."

## Clarifications

### Session 2026-01-04

- Q: Which positioning strategy should Popover/Tooltip use? → A: CSS anchor positioning with JS fallback for unsupported browsers

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Creates Accessible Form with Input and Field (Priority: P1)

A developer building a form needs accessible text input fields with labels, help text, and error messages that work correctly with screen readers and keyboard navigation.

**Why this priority**: Input with Field pattern is the most fundamental form building block. Every web application requires forms, and proper label association is critical for accessibility compliance.

**Independent Test**: Can be fully tested by rendering an Input within a Field component, then verifying label association via `aria-labelledby`, error announcement via `aria-describedby`, and keyboard accessibility.

**Acceptance Scenarios**:

1. **Given** a developer renders `<ds-field><ds-label>Email</ds-label><ds-input type="email"></ds-input></ds-field>`, **When** a screen reader user focuses the input, **Then** "Email" is announced as the accessible name.
2. **Given** an input has an error, **When** `<ds-field-error>Invalid email</ds-field-error>` is present, **Then** the error message is announced via `aria-describedby` and the input has `aria-invalid="true"`.
3. **Given** an input has help text via `<ds-field-description>`, **When** a screen reader user focuses the input, **Then** the help text is announced after the label.
4. **Given** a required field, **When** rendered with `required` attribute, **Then** the input is marked as required both visually and for assistive technology.

---

### User Story 2 - Developer Opens a Modal Dialog (Priority: P1)

A developer needs to display a modal dialog that traps focus, can be dismissed via Escape, and returns focus to the trigger when closed.

**Why this priority**: Dialog is the foundational overlay component. It establishes patterns for focus trapping, layer management, and keyboard dismissal that other overlays (popover, menu) build upon.

**Independent Test**: Can be fully tested by opening a dialog, verifying focus moves inside, pressing Escape to close, and confirming focus returns to the trigger button.

**Acceptance Scenarios**:

1. **Given** a dialog trigger button exists, **When** the user clicks the trigger, **Then** the dialog opens and focus moves to the first focusable element inside (or the dialog itself if no focusable children).
2. **Given** a dialog is open, **When** the user presses Tab at the last focusable element, **Then** focus wraps to the first focusable element inside the dialog.
3. **Given** a dialog is open, **When** the user presses Escape, **Then** the dialog closes and focus returns to the trigger button.
4. **Given** a dialog is open, **When** the user clicks outside the dialog (on the backdrop), **Then** the dialog closes.
5. **Given** a dialog has `role="alertdialog"`, **When** opened, **Then** the content is announced immediately to screen readers.

---

### User Story 3 - Developer Adds Textarea for Multi-line Input (Priority: P2)

A developer needs a multi-line text input that auto-resizes and integrates with the Field pattern for labels and error states.

**Why this priority**: Textarea extends the Input pattern for multi-line content, commonly needed for comments, descriptions, and messages.

**Independent Test**: Can be fully tested by typing multi-line content and verifying the textarea grows, then checking label and error integration via Field.

**Acceptance Scenarios**:

1. **Given** a textarea is rendered, **When** the user types text that exceeds one line, **Then** the textarea height grows to accommodate content (auto-resize enabled).
2. **Given** a textarea with `maxlength` attribute, **When** the user types beyond the limit, **Then** further input is prevented.
3. **Given** a textarea inside a Field with an error, **When** the error is displayed, **Then** the textarea is styled with error state and `aria-invalid="true"` is set.

---

### User Story 4 - Developer Creates Checkbox and Radio Groups (Priority: P2)

A developer needs checkbox and radio button components that work individually and in groups, with proper keyboard navigation within groups.

**Why this priority**: Checkbox and radio are essential form controls for selection. Radio groups require roving tabindex for proper keyboard navigation (APG pattern).

**Independent Test**: Can be fully tested by rendering a radio group, navigating with arrow keys, and verifying only one selection is active at a time.

**Acceptance Scenarios**:

1. **Given** a standalone checkbox, **When** the user clicks or presses Space, **Then** the checkbox toggles between checked and unchecked.
2. **Given** a radio group with 3 options, **When** the user focuses the group and presses Down Arrow, **Then** focus moves to the next radio button and selects it.
3. **Given** a radio group, **When** the user presses Tab, **Then** focus exits the group to the next focusable element (roving tabindex pattern).
4. **Given** a checkbox with `indeterminate` state, **When** rendered, **Then** the visual indicator shows mixed state and `aria-checked="mixed"` is set.

---

### User Story 5 - Developer Uses Switch for On/Off Toggle (Priority: P2)

A developer needs a toggle switch for boolean settings that provides immediate visual feedback and proper accessibility semantics.

**Why this priority**: Switch is a common pattern for settings and preferences, distinct from checkbox semantically (immediate vs. deferred effect).

**Independent Test**: Can be fully tested by clicking the switch to toggle state and verifying ARIA attributes update correctly.

**Acceptance Scenarios**:

1. **Given** a switch is rendered, **When** the user clicks it, **Then** the switch toggles state and emits `ds:change` event with the new value.
2. **Given** a switch, **When** the user presses Space or Enter, **Then** the switch toggles state.
3. **Given** a switch with `role="switch"`, **When** focused, **Then** screen readers announce it as a switch with its current state (on/off).

---

### User Story 6 - Developer Creates a Popover for Contextual Content (Priority: P2)

A developer needs a non-modal popover that appears anchored to a trigger element, can be dismissed via Escape or outside click, but does not trap focus.

**Why this priority**: Popover is distinct from Dialog—it doesn't trap focus and is used for supplementary content like dropdowns, date pickers, and contextual actions.

**Independent Test**: Can be fully tested by opening a popover, tabbing through content (focus can leave), pressing Escape to close.

**Acceptance Scenarios**:

1. **Given** a popover trigger exists, **When** the user clicks the trigger, **Then** the popover opens positioned relative to the trigger.
2. **Given** a popover is open, **When** the user presses Escape, **Then** the popover closes and focus returns to the trigger.
3. **Given** a popover is open, **When** the user presses Tab past the last focusable element, **Then** focus exits the popover to the next page element (no focus trap).
4. **Given** a popover is open, **When** the user clicks outside, **Then** the popover closes.

---

### User Story 7 - Developer Adds Tooltips for Additional Information (Priority: P3)

A developer needs tooltips to display supplementary information on hover or focus, following accessible tooltip patterns.

**Why this priority**: Tooltips enhance UX but are not essential for core functionality. They must be accessible to keyboard users and not rely solely on hover.

**Independent Test**: Can be fully tested by focusing a trigger element and verifying the tooltip appears and is announced.

**Acceptance Scenarios**:

1. **Given** an element with a tooltip, **When** the user hovers over or focuses the trigger, **Then** the tooltip appears after a short delay.
2. **Given** a tooltip is visible, **When** the user moves focus/cursor away, **Then** the tooltip hides after a short delay.
3. **Given** a tooltip, **When** the user presses Escape while visible, **Then** the tooltip hides immediately.
4. **Given** a tooltip has `role="tooltip"`, **When** visible, **Then** the trigger element references it via `aria-describedby`.

---

### User Story 8 - Developer Creates an Accessible Menu (Priority: P3)

A developer needs a dropdown menu for actions with proper keyboard navigation, selection, and dismissal patterns.

**Why this priority**: Menus are common for action lists but build on Popover and roving focus patterns established by other components.

**Independent Test**: Can be fully tested by opening a menu, navigating with arrow keys, selecting with Enter, and dismissing with Escape.

**Acceptance Scenarios**:

1. **Given** a menu trigger exists, **When** the user clicks the trigger, **Then** the menu opens and focus moves to the first menu item.
2. **Given** a menu is open, **When** the user presses Down Arrow, **Then** focus moves to the next menu item.
3. **Given** a menu is open, **When** the user presses Enter on a menu item, **Then** the item's action fires and the menu closes.
4. **Given** a menu is open, **When** the user types "se", **Then** focus moves to the first item starting with "se" (type-ahead).
5. **Given** a menu has `role="menu"` and items have `role="menuitem"`, **When** navigating, **Then** screen readers announce the menu structure correctly.

---

### Edge Cases

- What happens when a required field is submitted empty? The Field pattern displays an error and the input has `aria-invalid="true"`.
- How does Dialog handle nested dialogs? The most recently opened dialog is topmost, and Escape closes only the topmost.
- What happens when a popover trigger is scrolled out of view? The popover repositions or closes based on visibility.
- How does Menu handle disabled items? Disabled items are skipped during arrow key navigation.
- What happens when Tooltip content is too long? Content wraps within max-width constraints defined by tokens.
- How does Radio group handle all options being disabled? Focus cannot enter the group; the group is announced as disabled.
- What happens when Textarea auto-resize exceeds max-height? Scrollbar appears, maintaining max-height constraint.

## Requirements *(mandatory)*

### Functional Requirements

#### Form Controls - Input (extends existing)

- **FR-001**: Input MUST integrate with Field pattern for label association via `aria-labelledby`
- **FR-002**: Input MUST support `aria-describedby` for help text and error messages from Field
- **FR-003**: Input MUST support `aria-invalid` when error state is active

#### Form Controls - Textarea

- **FR-004**: Textarea MUST support multi-line text input with configurable rows
- **FR-005**: Textarea MUST support auto-resize to fit content when `auto-resize` is enabled
- **FR-006**: Textarea MUST support `maxlength` attribute to limit input length
- **FR-007**: Textarea MUST integrate with Field pattern identically to Input
- **FR-008**: Textarea MUST support `resize` attribute with values: `none`, `vertical`, `horizontal`, `both`

#### Form Controls - Checkbox

- **FR-009**: Checkbox MUST support `checked` boolean attribute for selection state
- **FR-010**: Checkbox MUST support `indeterminate` boolean attribute for mixed state
- **FR-011**: Checkbox MUST toggle state on click and Space key press
- **FR-012**: Checkbox MUST support `disabled` state that prevents interaction
- **FR-013**: Checkbox MUST emit `ds:change` event when state changes
- **FR-014**: Checkbox MUST use `aria-checked` reflecting current state (true/false/mixed)

#### Form Controls - Radio

- **FR-015**: Radio MUST be used within a RadioGroup container for proper semantics
- **FR-016**: RadioGroup MUST implement roving tabindex pattern for keyboard navigation
- **FR-017**: Radio MUST support arrow key navigation within its group (vertical by default)
- **FR-018**: Radio MUST be selected when focused via arrow keys (selection follows focus)
- **FR-019**: RadioGroup MUST ensure only one radio is selected at a time
- **FR-020**: Radio MUST use `role="radio"` and `aria-checked` for accessibility

#### Form Controls - Switch

- **FR-021**: Switch MUST use `role="switch"` for proper accessibility semantics
- **FR-022**: Switch MUST support `checked` boolean attribute for on/off state
- **FR-023**: Switch MUST toggle on click, Space, and Enter key
- **FR-024**: Switch MUST emit `ds:change` event when state changes
- **FR-025**: Switch MUST use `aria-checked` reflecting current state

#### Form Controls - Field Pattern

- **FR-026**: Field MUST generate unique IDs for label, description, and error association
- **FR-027**: Field MUST compose `aria-labelledby` from Label component
- **FR-028**: Field MUST compose `aria-describedby` from Description and Error components
- **FR-029**: Field MUST propagate error state to child form controls via context or attribute
- **FR-030**: Field MUST support `required` indicator that applies to child form control

#### Overlays - Dialog

- **FR-031**: Dialog MUST trap focus within its content using `createFocusTrap` primitive
- **FR-032**: Dialog MUST return focus to trigger element when closed
- **FR-033**: Dialog MUST close on Escape key via `createDismissableLayer` primitive
- **FR-034**: Dialog MUST support optional backdrop click to close (configurable)
- **FR-035**: Dialog MUST use `role="dialog"` or `role="alertdialog"` with `aria-modal="true"`
- **FR-036**: Dialog MUST support `aria-labelledby` pointing to dialog title
- **FR-037**: Dialog MUST support `aria-describedby` pointing to dialog description
- **FR-038**: Dialog MUST render in a portal at document root for proper stacking

#### Overlays - Popover

- **FR-039**: Popover MUST NOT trap focus (focus can exit to page)
- **FR-040**: Popover MUST close on Escape key via `createDismissableLayer` primitive
- **FR-041**: Popover MUST close on outside click via `createDismissableLayer` primitive
- **FR-042**: Popover MUST position relative to trigger element with configurable placement
- **FR-043**: Popover MUST support automatic repositioning when near viewport edges
- **FR-044**: Popover MUST manage its own visibility state internally

#### Overlays - Tooltip

- **FR-045**: Tooltip MUST appear on hover and focus of trigger element
- **FR-046**: Tooltip MUST use `role="tooltip"` for accessibility
- **FR-047**: Tooltip trigger MUST reference tooltip via `aria-describedby`
- **FR-048**: Tooltip MUST support configurable show/hide delay
- **FR-049**: Tooltip MUST close on Escape key press
- **FR-050**: Tooltip MUST NOT receive focus (informational only)

#### Overlays - Menu

- **FR-051**: Menu MUST use `role="menu"` with items using `role="menuitem"`
- **FR-052**: Menu MUST implement roving focus for arrow key navigation via `createRovingFocus`
- **FR-053**: Menu MUST close on Escape key via `createDismissableLayer`
- **FR-054**: Menu MUST close on item selection (Enter or click)
- **FR-055**: Menu MUST support type-ahead search via `createTypeAhead` primitive
- **FR-056**: Menu MUST skip disabled items during keyboard navigation
- **FR-057**: Menu MUST support nested submenus (future enhancement, design now)

#### Cross-Cutting Requirements

- **FR-058**: All form controls MUST work with native form submission
- **FR-059**: All components MUST extend `DSElement` base class for Light DOM rendering
- **FR-060**: All components MUST use CSS custom properties from the token system
- **FR-061**: All components MUST include a `manifest.json` with accessibility metadata
- **FR-062**: All components MUST have MDX documentation meeting the docs contract
- **FR-063**: All components MUST declare `tokensUsed` in their manifest
- **FR-064**: All components MUST be SSR-compatible (render meaningful HTML without JavaScript)
- **FR-065**: All components MUST emit events using the `ds:` namespace prefix
- **FR-066**: All components MUST include unit tests and accessibility automation tests
- **FR-067**: All overlay components MUST integrate with the layer stack for proper stacking order

### Key Entities

- **Form Control**: An interactive element that accepts user input and participates in form submission
- **Field**: A container that associates a form control with its label, description, and error message
- **Overlay**: A component that displays content above the main page content (dialog, popover, tooltip, menu)
- **Layer Stack**: A managed stack of active overlays for proper Escape handling and stacking order
- **Focus Trap**: A behavior that constrains Tab navigation within a container
- **Roving Focus**: A behavior that uses arrow keys for navigation within a group with single Tab stop

## JavaScript Requirements Analysis

### Components Requiring JavaScript

| Component  | JS Required | Reason                                                            |
| ---------- | ----------- | ----------------------------------------------------------------- |
| Input      | Minimal     | Event handling, value sync; HTML input provides core functionality |
| Textarea   | Moderate    | Auto-resize calculation, event handling                           |
| Checkbox   | Minimal     | Toggle state, event emission; HTML checkbox provides core behavior |
| Radio      | Moderate    | Roving tabindex coordination within group                         |
| Switch     | Minimal     | Toggle state, event emission                                      |
| Field      | Minimal     | ID generation, ARIA attribute composition                         |
| Dialog     | Required    | Focus trapping, dismiss handling, portal rendering                |
| Popover    | Required    | Positioning calculation, dismiss handling                         |
| Tooltip    | Required    | Show/hide timing, positioning, ARIA connection                    |
| Menu       | Required    | Roving focus, type-ahead, dismiss handling                        |

### SSR Considerations

All components render semantic HTML that is functional before JavaScript hydration:
- Form controls render as styled native elements with correct ARIA
- Overlays render hidden content that JS activates (progressive enhancement)
- Initial render includes all accessibility attributes

## APG Alignment Notes

| Component       | APG Pattern                        | Key Requirements                                             |
| --------------- | ---------------------------------- | ------------------------------------------------------------ |
| Checkbox        | Checkbox (Dual-state)              | Space toggles, `aria-checked`, focus visible                 |
| Checkbox        | Checkbox (Tri-state)               | `aria-checked="mixed"` for indeterminate                     |
| Radio           | Radio Group                        | Arrow keys navigate and select, single Tab stop              |
| Switch          | Switch                             | `role="switch"`, Space/Enter toggles, `aria-checked`         |
| Dialog          | Dialog (Modal)                     | Focus trap, Escape closes, `aria-modal="true"`               |
| Dialog          | Alert Dialog                       | Same as modal + `role="alertdialog"`                         |
| Popover         | N/A (no direct APG)                | Based on Disclosure + Popup patterns                         |
| Tooltip         | Tooltip                            | `role="tooltip"`, `aria-describedby`, appears on hover/focus |
| Menu            | Menu Button                        | `role="menu"`, roving focus, type-ahead, Escape closes       |

## Focus and Dismiss Pattern Mapping

### Focus Patterns

| Component | Initial Focus           | Focus Behavior                     | Return Focus     |
| --------- | ----------------------- | ---------------------------------- | ---------------- |
| Dialog    | First focusable or self | Trapped (Tab cycles within)        | To trigger       |
| Popover   | None (stays on trigger) | Not trapped (Tab can exit)         | To trigger       |
| Tooltip   | N/A (not focusable)     | N/A                                | N/A              |
| Menu      | First item              | Roving (arrows navigate)           | To trigger       |
| Radio     | Selected or first       | Roving (arrows navigate and select)| N/A (inline)     |

### Dismiss Patterns (via `createDismissableLayer`)

| Component | Escape | Outside Click | Item Selection |
| --------- | ------ | ------------- | -------------- |
| Dialog    | Yes    | Configurable  | N/A            |
| Popover   | Yes    | Yes           | N/A            |
| Tooltip   | Yes    | No            | N/A            |
| Menu      | Yes    | Yes           | Yes            |

## Implementation Phases

### Phase 1: Input + Dialog Foundation
- Enhance existing Input with Field pattern integration
- Implement Field, Label, FieldDescription, FieldError components
- Implement Dialog with focus trap and dismiss layer
- Manifest + docs + tests for each component

### Phase 2: Additional Form Controls
- Implement Textarea with auto-resize
- Implement Checkbox with tri-state support
- Implement RadioGroup with roving focus
- Implement Switch
- Manifest + docs + tests for each component

### Phase 3: Overlay Components
- Implement Popover with positioning
- Implement Tooltip with delays
- Implement Menu with roving focus and type-ahead
- Manifest + docs + tests for each component

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **APG Compliance**: Strict adherence to WAI-ARIA Authoring Practices Guide patterns
- **Primitive Reuse**: Maximum leverage of existing `@ds/primitives-dom` utilities
- **SSR Compatibility**: Components must render meaningful HTML without JavaScript
- **Testing Evidence**: Each component must have unit tests, a11y tests, and manifest validation

### Approach A: Headless + Styled Layers

Build form controls and overlays as two layers: a headless behavior layer (using primitives) and a styled presentation layer. Consumers can use either.

**Pros**:
- Maximum flexibility for consumers
- Clear separation of concerns
- Behavior can be reused in different styling contexts

**Cons**:
- More packages to maintain
- Higher API surface area
- Increased learning curve for consumers

### Approach B: Integrated Components with Primitive Composition

Build components that integrate behavior primitives internally, exposing a unified API. Components use `createFocusTrap`, `createDismissableLayer`, and `createRovingFocus` directly.

**Pros**:
- Simpler consumer API—one import per component
- Consistent with existing baseline components (Button, Input)
- Primitives already exist and are tested
- Clear evidence chain: component → primitive → behavior

**Cons**:
- Less flexibility for consumers who want only behavior
- Component implementation is more complex internally

### Approach C: Native HTML Enhancement Only

Rely primarily on native HTML elements with minimal JavaScript, using CSS for styling and progressive enhancement for advanced features.

**Pros**:
- Smallest JavaScript footprint
- Maximum browser compatibility
- Simplest implementation

**Cons**:
- Cannot achieve required accessibility patterns (focus trap, roving focus)
- Missing ARIA widget patterns (switch, menu, dialog)
- Insufficient for design system requirements

### Recommendation

**Recommended: Approach B (Integrated Components with Primitive Composition)**

This approach:
1. Scores highest on APG compliance—primitives already implement correct patterns
2. Aligns with existing component architecture (DSElement, Light DOM)
3. Enables evidence-based testing—each primitive is independently tested
4. Maintains SSR compatibility—components render semantic HTML
5. Balances complexity—consumers get simple API, internals use proven primitives

The trade-off of less flexibility is acceptable because:
- Most consumers want complete, working components
- Advanced users can use primitives directly for custom implementations
- Documentation will show both patterns

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All form controls pass WCAG 2.1 AA automated accessibility checks
- **SC-002**: All overlay components implement APG keyboard patterns correctly (verified via E2E tests)
- **SC-003**: Focus trap correctly cycles through all focusable elements in Dialog
- **SC-004**: Radio group keyboard navigation matches APG specification (arrow keys, Home, End)
- **SC-005**: All components render meaningful, styled content before JavaScript hydration
- **SC-006**: Manifest validation passes for all components in strict mode (CI)
- **SC-007**: Each component's documentation page includes at least 3 usage examples and 2 anti-patterns
- **SC-008**: Screen reader testing confirms all form controls announce labels, errors, and states correctly
- **SC-009**: All overlays correctly participate in layer stack (Escape closes topmost only)
- **SC-010**: Unit test coverage reaches minimum 80% for all component logic

## Assumptions

1. The existing `@ds/primitives-dom` utilities (focus-trap, dismissable-layer, roving-focus, type-ahead) are production-ready
2. Field pattern components (Field, Label, FieldDescription, FieldError) are new additions
3. Positioning for Popover/Tooltip will use CSS anchor positioning with a JS fallback for browsers without anchor positioning support (not Floating UI)
4. Portal rendering for Dialog uses standard DOM manipulation, not framework-specific portals
5. All components target the `core` edition as baseline (available to all tiers)
6. The docs contract schema from feature 002 defines MDX structure requirements
7. Token paths referenced exist in the token system or will be added as part of implementation
