# Feature Specification: Advanced Form Controls

**Feature Branch**: `017-advanced-form-controls`
**Created**: 2026-01-06
**Status**: Draft
**Input**: User description: "Inputs & Advanced Form Controls (16–18 components) - Expand the system's input surface area to unblock real production forms (searchable select, async/multi combobox, date/time, file upload, sliders, numeric/OTP). Priority 1: Select, Combobox, DatePicker. Priority 2: Slider, NumberInput, FileUpload. Priority 3: TimePicker, PinInput."

## Clarifications

### Session 2026-01-06

- Q: When should virtualization activate for Select/Combobox option lists? → A: Auto-trigger at threshold (>100 options activates virtualization automatically)
- Q: How should Combobox handle async data loading? → A: Component manages loading state internally; consumer provides `loadItems(query): Promise<Option[]>`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Adds Searchable Select for Country Picker (Priority: P1)

A developer building a registration form needs a searchable select component to let users choose from a list of 200+ countries, with keyboard navigation and screen reader support.

**Why this priority**: Select is the most common advanced form control. It replaces the limited native `<select>` with searchable, accessible, and customizable behavior—a prerequisite for any production form system.

**Independent Test**: Can be fully tested by rendering a Select with 200 options, typing to filter, navigating with arrow keys, and selecting with Enter.

**Acceptance Scenarios**:

1. **Given** a Select with 200 country options, **When** the user types "un", **Then** the list filters to show "United States", "United Kingdom", "United Arab Emirates", etc.
2. **Given** a Select is open, **When** the user presses Down Arrow, **Then** focus moves to the next visible option.
3. **Given** a Select is open with an option highlighted, **When** the user presses Enter, **Then** the option is selected, the popover closes, and focus returns to the trigger.
4. **Given** a Select is closed, **When** the user presses Space or Enter on the trigger, **Then** the popover opens with the first option highlighted.
5. **Given** a Select with a selected value, **When** the user clicks the clear button, **Then** the value is cleared and the placeholder is shown.
6. **Given** a Select inside a Field, **When** a required validation fails, **Then** `aria-invalid="true"` is set and the error message is announced.

---

### User Story 2 - Developer Creates Multi-Select Combobox with Async Search (Priority: P1)

A developer building a user mention feature needs a combobox that searches users asynchronously, allows multiple selections displayed as tags, and supports creating new entries.

**Why this priority**: Combobox is essential for search-driven UIs (user pickers, tag inputs, autocomplete). Async support is required for any real-world application with large datasets.

**Independent Test**: Can be fully tested by typing to trigger async search, selecting multiple items as tags, removing tags, and verifying keyboard navigation.

**Acceptance Scenarios**:

1. **Given** a Combobox with async search, **When** the user types "ja", **Then** a loading indicator appears while the API is called, then results containing "ja" are displayed.
2. **Given** a Combobox in multi-select mode with 2 selected values, **When** the user selects a third option, **Then** all three appear as removable tags.
3. **Given** a Combobox with tags, **When** the user clicks the X on a tag, **Then** that selection is removed and focus moves to the input.
4. **Given** a Combobox with no matching results, **When** `creatable` is enabled, **Then** a "Create [value]" option appears that adds the typed text as a new value.
5. **Given** a Combobox is open, **When** the user presses Backspace in an empty input, **Then** the last tag is removed.
6. **Given** a Combobox, **When** typing rapidly triggers multiple API calls, **Then** only the most recent result is displayed (debounce/race handling).

---

### User Story 3 - Developer Adds Date Picker for Booking Form (Priority: P1)

A developer building a hotel booking form needs a date picker that supports single date and date range selection with min/max constraints and locale-aware formatting.

**Why this priority**: Date selection is required for any scheduling, booking, or event-based application. It must handle internationalization and accessibility correctly.

**Independent Test**: Can be fully tested by opening the calendar, navigating with arrow keys, selecting a date/range, and verifying keyboard and screen reader behavior.

**Acceptance Scenarios**:

1. **Given** a DatePicker, **When** the user clicks the calendar icon, **Then** a calendar grid opens showing the current month with today highlighted.
2. **Given** a DatePicker with `min="2026-01-01"`, **When** the calendar renders, **Then** dates before January 1, 2026 are visually disabled and not selectable.
3. **Given** a DatePicker in range mode, **When** the user selects a start date then an end date, **Then** the range is highlighted and both dates are set.
4. **Given** a calendar is open, **When** the user presses Left Arrow, **Then** focus moves to the previous day (wrapping to previous month if needed).
5. **Given** a calendar is open, **When** the user presses Page Down, **Then** the next month is displayed.
6. **Given** a DatePicker with `locale="de-DE"`, **When** rendered, **Then** month names, day names, and date format match German locale conventions.

---

### User Story 4 - Developer Adds Slider for Price Range Filter (Priority: P2)

A developer building an e-commerce filter sidebar needs a range slider to let users select a minimum and maximum price within bounds.

**Why this priority**: Sliders are common in filter UIs and configurators. Range sliders require careful keyboard accessibility for two-thumb control.

**Independent Test**: Can be fully tested by dragging thumbs, using arrow keys to adjust values, and verifying the range updates correctly.

**Acceptance Scenarios**:

1. **Given** a range Slider with min=0 and max=1000, **When** the user drags the left thumb to 200, **Then** the minimum value updates to 200.
2. **Given** a range Slider, **When** the user focuses a thumb and presses Right Arrow, **Then** the value increments by the step amount (default 1).
3. **Given** a Slider with `step=50`, **When** the user drags a thumb, **Then** it snaps to the nearest multiple of 50.
4. **Given** a range Slider, **When** the left thumb reaches the right thumb, **Then** the thumbs cannot cross (min cannot exceed max).
5. **Given** a Slider with `showTicks`, **When** rendered, **Then** tick marks appear at step intervals along the track.
6. **Given** a disabled Slider, **When** the user attempts to drag or use keyboard, **Then** no interaction occurs.

---

### User Story 5 - Developer Adds Number Input with Increment/Decrement (Priority: P2)

A developer building a quantity selector needs a number input with +/- buttons, step controls, and min/max validation.

**Why this priority**: Number inputs are common for quantities, scores, and numeric settings. The increment/decrement buttons must be accessible.

**Independent Test**: Can be fully tested by clicking +/- buttons, typing values, and verifying min/max constraints are enforced.

**Acceptance Scenarios**:

1. **Given** a NumberInput with value=5, **When** the user clicks the + button, **Then** the value becomes 6.
2. **Given** a NumberInput with `max=10` and value=10, **When** the user clicks +, **Then** the value remains 10 and + button is disabled.
3. **Given** a NumberInput with `step=0.5`, **When** the user presses Up Arrow, **Then** the value increments by 0.5.
4. **Given** a NumberInput, **When** the user types "abc", **Then** the input is sanitized to remove non-numeric characters.
5. **Given** a NumberInput inside a Field with error, **When** the value is invalid, **Then** `aria-invalid="true"` is set.
6. **Given** a NumberInput with `prefix="$"`, **When** rendered, **Then** "$" appears before the number visually but is not part of the value.

---

### User Story 6 - Developer Adds File Upload with Drag and Drop (Priority: P2)

A developer building a document submission form needs a file upload component that supports drag-and-drop, file type validation, and upload progress indication.

**Why this priority**: File upload is essential for any application handling user documents, images, or attachments. Drag-and-drop is expected UX.

**Independent Test**: Can be fully tested by dragging files onto the drop zone, selecting files via button, and verifying validation and progress.

**Acceptance Scenarios**:

1. **Given** a FileUpload component, **When** the user drags a file over the drop zone, **Then** the zone shows a visual hover state indicating it accepts the drop.
2. **Given** a FileUpload with `accept=".pdf,.doc"`, **When** the user drops a .png file, **Then** an error is shown and the file is rejected.
3. **Given** a FileUpload with a file pending, **When** the file preview is rendered, **Then** it shows filename, size, and a remove button.
4. **Given** a FileUpload with `multiple`, **When** the user selects 3 files, **Then** all 3 appear in the preview list.
5. **Given** a FileUpload, **When** the `onUpload` handler is called, **Then** a progress indicator shows upload status (0-100%).
6. **Given** a FileUpload in disabled state, **When** the user attempts to drop files, **Then** no files are accepted.

---

### User Story 7 - Developer Adds Time Picker for Appointment Scheduling (Priority: P3)

A developer building a scheduling application needs a time picker with 12/24 hour format support, minute intervals, and timezone awareness.

**Why this priority**: Time picker complements DatePicker for scheduling but is less universally required—many apps only need dates.

**Independent Test**: Can be fully tested by opening the time picker, selecting hours/minutes, and verifying format and keyboard navigation.

**Acceptance Scenarios**:

1. **Given** a TimePicker, **When** the user opens the picker, **Then** hour and minute selectors appear.
2. **Given** a TimePicker with `format="12h"`, **When** rendered, **Then** AM/PM selector is shown.
3. **Given** a TimePicker with `minuteStep=15`, **When** navigating minutes, **Then** options are 00, 15, 30, 45.
4. **Given** a TimePicker in 24-hour format, **When** the user selects 14:30, **Then** the value is formatted as "14:30".
5. **Given** a TimePicker combined with DatePicker, **When** both are selected, **Then** a combined ISO datetime string is available.

---

### User Story 8 - Developer Adds PIN Input for OTP Verification (Priority: P3)

A developer building a two-factor authentication flow needs a PIN/OTP input that splits digits into individual boxes with auto-advance.

**Why this priority**: PIN input is specialized for authentication flows—important but narrower use case than general form controls.

**Independent Test**: Can be fully tested by typing digits that auto-advance through boxes, pasting a code, and verifying screen reader announcements.

**Acceptance Scenarios**:

1. **Given** a PinInput with 6 digits, **When** the user types "1", **Then** "1" appears in the first box and focus moves to the second box.
2. **Given** a PinInput with 3 digits entered, **When** the user presses Backspace, **Then** the third digit is cleared and focus moves to the third box.
3. **Given** a PinInput, **When** the user pastes "123456", **Then** all 6 boxes are populated and the `onComplete` callback fires.
4. **Given** a PinInput, **When** the user presses Left Arrow, **Then** focus moves to the previous input box.
5. **Given** a PinInput with `mask`, **When** rendered, **Then** digits are displayed as dots for security.
6. **Given** a PinInput, **When** focused, **Then** screen reader announces "PIN input, digit 1 of 6".

---

### Edge Cases

- What happens when Select/Combobox options exceed viewport height? A scrollable listbox with max-height is displayed.
- How does DatePicker handle invalid typed dates? Invalid input is rejected with an error; value reverts to previous valid date.
- What happens when Slider min equals max? The slider is effectively disabled; no dragging is possible.
- How does FileUpload handle files exceeding max size? Files are rejected with an error message; they do not appear in the preview.
- What happens when PinInput receives non-numeric input? Non-digit characters are ignored; no visual feedback for blocked input.
- How does NumberInput handle locale-specific decimal separators? It respects the locale setting (comma vs. period) for display and input parsing.
- What happens when Combobox loses focus mid-search? The async request completes but results are discarded; popover closes.
- How does TimePicker handle timezone conversion? TimePicker displays in local timezone; ISO output includes timezone offset.

## Requirements *(mandatory)*

### Functional Requirements

#### Select

- **FR-001**: Select MUST support single value selection from a list of options
- **FR-002**: Select MUST support optional typeahead search to filter visible options
- **FR-003**: Select MUST implement listbox/combobox ARIA pattern with proper roles
- **FR-004**: Select MUST support keyboard navigation (Arrow keys, Enter, Escape, Home, End)
- **FR-005**: Select MUST support disabled state for individual options and the entire control
- **FR-006**: Select MUST support a clear button to reset value (when enabled)
- **FR-007**: Select MUST support grouped options with visual and accessible grouping
- **FR-008**: Select MUST integrate with Field pattern for label, description, and error association
- **FR-008a**: Select MUST automatically enable virtualization when option count exceeds 100

#### Combobox

- **FR-009**: Combobox MUST support text input with filtered suggestions
- **FR-010**: Combobox MUST support single-select and multi-select modes
- **FR-011**: Combobox MUST support async loading via `loadItems(query): Promise<Option[]>` callback; component manages loading/error states internally
- **FR-012**: Combobox MUST support "create new" option when no match found (creatable mode)
- **FR-013**: Combobox in multi-select mode MUST display selected values as removable tags
- **FR-014**: Combobox MUST debounce input changes for async search
- **FR-015**: Combobox MUST implement active-descendant pattern for screen readers
- **FR-016**: Combobox MUST show empty state when no options match
- **FR-016a**: Combobox MUST automatically enable virtualization when option count exceeds 100

#### DatePicker

- **FR-017**: DatePicker MUST support single date selection via calendar grid
- **FR-018**: DatePicker MUST support date range selection (start and end dates)
- **FR-019**: DatePicker MUST support min/max date constraints
- **FR-020**: DatePicker MUST support locale-aware month/day names and date formatting
- **FR-021**: DatePicker MUST support keyboard navigation within calendar (Arrow keys, Page Up/Down)
- **FR-022**: DatePicker MUST implement grid ARIA pattern with role="grid"
- **FR-023**: DatePicker MUST support month/year quick navigation (dropdowns or arrows)
- **FR-024**: DatePicker MUST support typed date input with format validation

#### Slider

- **FR-025**: Slider MUST support single value mode with one thumb
- **FR-026**: Slider MUST support range mode with two thumbs (min/max selection)
- **FR-027**: Slider MUST support configurable step, min, and max values
- **FR-028**: Slider MUST support keyboard control (Arrow keys for small step, Page Up/Down for large step)
- **FR-029**: Slider thumbs in range mode MUST NOT cross each other
- **FR-030**: Slider MUST use `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- **FR-031**: Slider MUST support optional tick marks at step intervals
- **FR-032**: Slider MUST support optional value tooltip on thumb focus/drag

#### NumberInput

- **FR-033**: NumberInput MUST display increment (+) and decrement (-) buttons
- **FR-034**: NumberInput MUST support step, min, and max value constraints
- **FR-035**: NumberInput MUST support keyboard control (Up/Down arrows for step increment)
- **FR-036**: NumberInput MUST sanitize input to allow only valid numeric characters
- **FR-037**: NumberInput MUST support optional prefix/suffix display (e.g., currency symbols)
- **FR-038**: NumberInput MUST use `role="spinbutton"` with appropriate ARIA attributes
- **FR-039**: NumberInput increment/decrement buttons MUST be accessible to screen readers

#### FileUpload

- **FR-040**: FileUpload MUST support file selection via native file picker
- **FR-041**: FileUpload MUST support drag-and-drop file selection
- **FR-042**: FileUpload MUST support file type validation via `accept` attribute
- **FR-043**: FileUpload MUST support max file size validation
- **FR-044**: FileUpload MUST support multiple file selection when enabled
- **FR-045**: FileUpload MUST display file preview with name, size, and remove button
- **FR-046**: FileUpload MUST provide hooks for upload progress reporting
- **FR-047**: FileUpload MUST announce file additions and removals to screen readers

#### TimePicker

- **FR-048**: TimePicker MUST support 12-hour and 24-hour format display
- **FR-049**: TimePicker MUST support configurable minute intervals (1, 5, 15, 30)
- **FR-050**: TimePicker MUST support AM/PM selection in 12-hour mode
- **FR-051**: TimePicker MUST support keyboard navigation for hour/minute selection
- **FR-052**: TimePicker MUST integrate with DatePicker for datetime selection

#### PinInput

- **FR-053**: PinInput MUST render as individual input boxes (configurable count: 4, 6, etc.)
- **FR-054**: PinInput MUST auto-advance focus when a digit is entered
- **FR-055**: PinInput MUST support paste to populate all boxes at once
- **FR-056**: PinInput MUST support backspace to delete and move focus backward
- **FR-057**: PinInput MUST support optional masking (show dots instead of digits)
- **FR-058**: PinInput MUST fire `onComplete` callback when all digits are entered
- **FR-059**: PinInput MUST support alphanumeric mode (not just digits)

#### Cross-Cutting Requirements

- **FR-060**: All components MUST expose consistent subpart naming: Root, Trigger, Content, Listbox, Option, Group, Label, Description, Error, Clear, Indicator
- **FR-061**: All components MUST integrate with the existing Field pattern for form context
- **FR-062**: All components MUST support controlled and uncontrolled value modes
- **FR-063**: All components MUST emit standard events: `change` and custom `valuechange` with detail payload
- **FR-064**: All components MUST support `disabled` and `readOnly` states where applicable
- **FR-065**: All components MUST use Light DOM rendering for theming and SSR compatibility
- **FR-066**: All components MUST reference motion tokens for animations
- **FR-067**: All components MUST respect `prefers-reduced-motion` setting
- **FR-068**: All components MUST be installable via CLI tool
- **FR-069**: All components MUST include manifest.json with accessibility metadata
- **FR-070**: All components MUST have MDX documentation with usage examples and anti-patterns

### Key Entities

- **Option**: A selectable item in Select/Combobox with value, label, and optional disabled state
- **Option Group**: A labeled collection of related options for visual and semantic grouping
- **Calendar Cell**: A single day in the DatePicker grid with date value and selection state
- **Slider Thumb**: A draggable control point representing a value on the slider track
- **Upload File**: A file reference with name, size, type, and upload progress state
- **PIN Digit**: A single character input in a PIN/OTP sequence

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **APG Compliance**: Strict adherence to WAI-ARIA Authoring Practices Guide patterns for listbox, combobox, grid, slider, spinbutton
- **Primitive Reuse**: Leverage existing `@ds/primitives-dom` utilities (roving-focus, type-ahead, dismissable-layer, focus-trap)
- **SSR Compatibility**: Components must render semantic HTML without JavaScript; progressive enhancement for interactivity
- **Performance**: Virtualization support for large option sets; efficient DOM updates
- **Customizability**: Token-based styling; consistent with existing design system patterns

### Approach A: Build from Scratch with Primitives

Build all components using existing primitives (roving-focus, type-ahead, dismissable-layer) and new primitives where needed. Custom implementations for all logic.

**Pros**:
- Maximum control over behavior and API
- Consistent with existing component architecture (DSElement, Light DOM)
- No external dependencies—aligns with constitution's zero-runtime-dependency goal
- Optimized bundle size—only include what's used

**Cons**:
- Significant development effort (8 complex components)
- Risk of accessibility bugs in novel implementations
- Date/calendar logic is complex and error-prone

### Approach B: Adapt Existing Headless Libraries

Use established headless libraries (e.g., Downshift for Combobox, React Aria for primitives) and wrap them in our component architecture.

**Pros**:
- Battle-tested accessibility patterns
- Faster time to ship
- Community maintenance and bug fixes

**Cons**:
- Adds external dependencies (violates constitution for some packages)
- API constraints from library design
- Harder to maintain Light DOM and WC parity
- Bundle size overhead from full library imports

### Approach C: Hybrid - Primitives + Date Library

Build form controls with primitives (Approach A) but use a dedicated date library (e.g., Temporal API polyfill, date-fns) for DatePicker/TimePicker calendar logic.

**Pros**:
- Date handling is complex; libraries prevent common bugs
- Core form controls remain dependency-free
- date-fns is tree-shakable; Temporal API is a standard
- Balances effort and reliability

**Cons**:
- Adds one dependency for date components
- Temporal API still requires polyfill in some browsers
- Two patterns to maintain (primitive-only vs. library-assisted)

### Recommendation

**Recommended: Approach C (Hybrid - Primitives + Date Library)**

This approach:
1. Scores highest on accessibility—primitives implement proven ARIA patterns; date library handles edge cases
2. Aligns with constitution—zero dependencies for most components; minimal dependency for date handling is pragmatic
3. Balances development velocity—core controls ship faster; date components ship with confidence
4. Maintains bundle efficiency—date-fns functions are tree-shakable; only import what's used
5. Enables SSR—both primitives and date-fns work server-side

The trade-off of adding a date dependency is acceptable because:
- Date/time handling is genuinely complex (timezones, locales, leap years, edge cases)
- Hand-rolling date logic is a known source of production bugs
- date-fns is widely trusted, well-maintained, and tree-shakable

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can search and select from 1000+ options in Select/Combobox within 100ms filter response
- **SC-002**: All components pass WCAG 2.1 AA automated accessibility checks
- **SC-003**: Keyboard-only users can complete all interactions without mouse
- **SC-004**: Screen reader users receive correct announcements for selection changes, errors, and state updates
- **SC-005**: Components render meaningful, styled content before JavaScript hydration (SSR verified)
- **SC-006**: DatePicker correctly handles locale-specific formatting for 5+ major locales
- **SC-007**: Slider range thumbs cannot cross; visual feedback is immediate during drag
- **SC-008**: FileUpload correctly rejects invalid file types with accessible error messages
- **SC-009**: PinInput paste workflow completes all digits and fires onComplete callback
- **SC-010**: All components installable via CLI with single command
- **SC-011**: Bundle size for each component under 10KB gzipped (excluding date library for DatePicker/TimePicker)
- **SC-012**: All components have manifest.json validated in strict mode
- **SC-013**: Documentation includes at least 3 usage examples and 2 anti-patterns per component

## Shared Contracts *(mandatory)*

### A) Component Manifest (machine-readable, required in Stage 1-3)

Each component MUST ship a manifest entry including:
- **id, name, status** (alpha/beta/stable)
- **availabilityTags** (public/enterprise/internal-only/regulated)
- **platforms** (wc/react/html-recipe)
- **a11y** (APG pattern name, keyboard support, known limitations)
- **tokensUsed** (semantic token groups)
- **recommendedUsage + antiPatterns** (short strings; long-form in MDX)

### B) Docs Contract (portable, engine-agnostic)

- Docs produced as headless content (option: "docs engine as a library") with multiple renderers
- Every component includes:
  - Installation snippet (CLI)
  - Anatomy diagram (textual ok)
  - Accessibility notes + keyboard table
  - Recipes + anti-patterns
  - WC + React usage parity examples

### C) Platform + Runtime Decisions

- **Shadow DOM strategy**: Light DOM everywhere (default)
- **Next.js registration strategy**: single root "define elements" client loader
- **SSR/RSC**: ClientOnly used as explicit boundary; avoid hidden runtime globals

### D) Per-Component Acceptance Checklist

For each component ticket:
- [ ] Behavior spec written + reviewed (states, events, focus, a11y mapping)
- [ ] React implementation matches behavior spec
- [ ] WC implementation matches behavior spec (Light DOM)
- [ ] Keyboard + SR tested; automated a11y checks added
- [ ] Tokens + variants documented
- [ ] Animations implemented + reduced-motion compliant
- [ ] Manifest + MDX docs complete
- [ ] CLI install works; tree-shake friendly exports

## Assumptions

1. The existing `@ds/primitives-dom` utilities (roving-focus, type-ahead, dismissable-layer) are production-ready and sufficient
2. date-fns is an acceptable dependency for DatePicker/TimePicker; no other date library is required
3. Virtualization for large option sets (>100 options) will use intersection observer pattern, not a third-party virtualization library; activates automatically at threshold
4. FileUpload does not handle actual upload—it provides hooks for consumers to integrate their upload logic
5. TimePicker timezone handling outputs ISO strings with offset; display timezone is always local
6. PIN input supports digits by default; alphanumeric mode is opt-in
7. All components target the `core` edition as baseline (available to all tiers)
8. The existing popover/overlay animation system (motion tokens, presence utility) is reused
9. React wrappers will use the same compound component patterns established by Dialog/Menu
