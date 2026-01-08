# Feature Specification: Feedback, Data Display & Utilities

**Feature Branch**: `019-feedback-data-utilities`
**Created**: 2026-01-08
**Status**: Draft
**Input**: User description: "Feedback, Data Display & Utilities (16–18 components) - Add the status/feedback layer (alerts, toasts, progress, skeleton) plus core data display (avatar/table/list/tree/calendar) and utility primitives"

## Clarifications

### Session 2026-01-08

- Q: What is the default toast position? → A: top-right
- Q: What is the default maximum concurrent toasts? → A: 5

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Displaying Status Feedback with Alert (Priority: P1)

As a developer building an application, I need to display contextual status messages (info, success, warning, error) so that users understand the outcome of their actions or system states.

**Why this priority**: Alert is the most fundamental feedback component. Every application needs to communicate status to users. Without alerts, developers cannot build production-safe applications that inform users appropriately.

**Independent Test**: Can be fully tested by creating a form submission flow that shows success/error alerts based on validation results. Delivers immediate value for any application with user interactions.

**Acceptance Scenarios**:

1. **Given** an Alert component, **When** I set variant="success", **Then** the alert displays with success styling (green color scheme, check icon)
2. **Given** an Alert with closable=true, **When** I click the close button, **Then** the alert dismisses and fires onClose callback
3. **Given** an Alert component, **When** rendered, **Then** it has appropriate role (alert or status based on urgency)
4. **Given** an Alert with action button, **When** displayed, **Then** the action is accessible via keyboard navigation
5. **Given** an Alert variant="error", **When** using screen reader, **Then** the alert is announced immediately (role="alert")

---

### User Story 2 - Providing Non-Blocking Notifications with Toast (Priority: P1)

As a developer, I need to show temporary notifications that don't block user interaction so that I can inform users of background events without interrupting their workflow.

**Why this priority**: Toast notifications are essential for async feedback (save completed, message sent). Without them, applications cannot provide modern, non-intrusive feedback patterns.

**Independent Test**: Can be fully tested by creating a file upload that shows toast notifications for progress and completion. Delivers immediate value for any async operation feedback.

**Acceptance Scenarios**:

1. **Given** a toast() function call, **When** invoked with title and description, **Then** a toast appears in the configured position
2. **Given** an active toast, **When** I hover over it, **Then** the auto-dismiss timer pauses
3. **Given** multiple toasts, **When** displayed, **Then** they stack vertically without overlapping
4. **Given** a toast, **When** the dismiss timeout expires (default 5s), **Then** the toast exits with animation
5. **Given** a ToastProvider, **When** toast is dismissed, **Then** focus does NOT move (non-focus-stealing by default)
6. **Given** a toast with action button, **When** displayed, **Then** the action is clickable and executes callback

---

### User Story 3 - Indicating Operation Progress (Priority: P1)

As a developer, I need to show loading progress for operations so that users understand the system is working and roughly how long to wait.

**Why this priority**: Progress indicators are fundamental for perceived performance. Without them, users cannot distinguish between slow operations and broken functionality.

**Independent Test**: Can be fully tested by creating a file upload with linear progress bar and page load with circular spinner. Delivers immediate value for any loading state.

**Acceptance Scenarios**:

1. **Given** a Progress component with value={50}, **When** rendered, **Then** it displays 50% completion visually
2. **Given** a Progress in indeterminate mode, **When** rendered, **Then** it displays an animated looping indicator
3. **Given** a Progress component, **When** value changes, **Then** the bar animates smoothly to new position
4. **Given** a circular Progress variant, **When** rendered, **Then** it displays as a circular indicator with same API
5. **Given** Progress with aria-label, **When** using screen reader, **Then** progress value is announced

---

### User Story 4 - Displaying User Identity with Avatar (Priority: P2)

As a developer, I need to display user avatars with fallback strategies so that interfaces feel personal and users can identify participants in collaborative features.

**Why this priority**: Avatar is essential for user-facing applications. It enables personalization and identification in comments, profiles, and collaborative interfaces.

**Independent Test**: Can be fully tested by creating a user profile card and comment thread with avatars. Delivers value for any social or collaborative application.

**Acceptance Scenarios**:

1. **Given** an Avatar with src, **When** image loads successfully, **Then** it displays the image in circular format
2. **Given** an Avatar where image fails to load, **When** fallback is set, **Then** it shows initials or fallback icon
3. **Given** an AvatarGroup with 5 avatars and max={3}, **When** rendered, **Then** it shows 3 avatars plus "+2" overflow indicator
4. **Given** an Avatar with status indicator, **When** rendered, **Then** a colored dot appears in configured position (online/offline/away)
5. **Given** an Avatar, **When** alt text is provided, **Then** screen readers announce the user name

---

### User Story 5 - Displaying Tabular Data with Table (Priority: P2)

As a developer, I need a structured table component for displaying rows of data with sorting and selection capabilities so that users can scan, compare, and act on structured information.

**Why this priority**: Table is fundamental for data-driven applications. Dashboards, admin panels, and most business applications require tabular data display.

**Independent Test**: Can be fully tested by creating a user management table with sortable columns and row selection. Delivers value for any data-centric application.

**Acceptance Scenarios**:

1. **Given** a Table with columns and rows, **When** rendered, **Then** data displays in grid format with proper header associations
2. **Given** a sortable column header, **When** I click it, **Then** rows sort by that column (toggle asc/desc)
3. **Given** a Table with selectable rows, **When** I check row checkboxes, **Then** selection state updates and fires onSelectionChange
4. **Given** a Table header checkbox, **When** clicked, **Then** it toggles all row selections
5. **Given** a Table, **When** navigating with keyboard, **Then** arrow keys move focus between cells following grid pattern
6. **Given** a Table column, **When** using screen reader, **Then** header-cell associations are announced correctly

---

### User Story 6 - Indicating Loading States with Skeleton (Priority: P2)

As a developer, I need skeleton loading placeholders so that users understand content is loading without jarring layout shifts.

**Why this priority**: Skeleton loaders dramatically improve perceived performance and prevent cumulative layout shift. They're essential for professional loading experiences.

**Independent Test**: Can be fully tested by creating a card grid that shows skeletons before data loads. Delivers value for any async content loading.

**Acceptance Scenarios**:

1. **Given** a Skeleton component, **When** rendered, **Then** it displays a pulsing placeholder matching specified dimensions
2. **Given** Skeleton with variant="text", **When** rendered, **Then** it displays line-shaped skeleton at appropriate height
3. **Given** Skeleton with variant="circular", **When** rendered, **Then** it displays circular skeleton for avatar placeholders
4. **Given** Skeleton with animation disabled, **When** reduced-motion is preferred, **Then** animation stops or simplifies
5. **Given** multiple Skeleton elements, **When** rendered, **Then** they maintain consistent animation timing for visual coherence

---

### User Story 7 - Labeling Content with Badge and Tag (Priority: P2)

As a developer, I need Badge and Tag components to label, categorize, and indicate counts so that users can quickly scan and understand content metadata.

**Why this priority**: Badges and Tags are ubiquitous in modern interfaces for status indicators, counts, and categorization. They complete the "app chrome" layer.

**Independent Test**: Can be fully tested by creating a notification icon with count badge and article with category tags. Delivers value for any content organization.

**Acceptance Scenarios**:

1. **Given** a Badge with count, **When** rendered, **Then** it displays the count in a compact indicator
2. **Given** a Badge with count > max (e.g., max=99, count=150), **When** rendered, **Then** it shows "99+"
3. **Given** a Tag component, **When** rendered, **Then** it displays label with appropriate variant styling
4. **Given** a Tag with removable=true, **When** I click the remove button, **Then** it fires onRemove callback
5. **Given** a Badge positioned on an icon, **When** rendered, **Then** it appears in the top-right corner by default

---

### User Story 8 - Displaying Hierarchical Data with Tree (Priority: P3)

As a developer, I need a Tree component for displaying and navigating hierarchical data so that users can explore nested structures like file systems or organizational charts.

**Why this priority**: Tree is essential for file browsers, navigation sidebars, and nested data. It's more specialized but critical for certain application types.

**Independent Test**: Can be fully tested by creating a file browser tree with expand/collapse and selection. Delivers value for any application with nested data.

**Acceptance Scenarios**:

1. **Given** a Tree with nested items, **When** rendered, **Then** it displays hierarchical structure with visual indentation
2. **Given** a Tree node with children, **When** I click the expand icon, **Then** children are revealed with animation
3. **Given** an expanded Tree node, **When** I press arrow left on keyboard, **Then** the node collapses
4. **Given** a Tree, **When** I press arrow down, **Then** focus moves to next visible item
5. **Given** a Tree, **When** I type characters, **Then** focus jumps to matching item (typeahead)
6. **Given** a Tree, **When** using screen reader, **Then** ARIA tree pattern is followed (role="tree", "treeitem", aria-expanded)

---

### User Story 9 - Displaying Collections with List (Priority: P3)

As a developer, I need a List component for displaying scrollable collections with keyboard navigation so that users can browse and select from item collections.

**Why this priority**: List is a foundational pattern for sidebars, selection panels, and item displays. It provides consistent keyboard navigation.

**Independent Test**: Can be fully tested by creating a contact list with selection and keyboard navigation. Delivers value for any item-based interface.

**Acceptance Scenarios**:

1. **Given** a List with items, **When** rendered, **Then** items display in vertical stack with consistent spacing
2. **Given** a selectable List, **When** I click an item, **Then** it becomes selected and fires onSelectionChange
3. **Given** a List with focus, **When** I press arrow keys, **Then** focus moves between items
4. **Given** a List with typeahead, **When** I type characters, **Then** focus jumps to matching item
5. **Given** a List item, **When** it has leading/trailing content slots, **Then** icons and actions render in correct positions

---

### User Story 10 - Visualizing Dates with Calendar (Priority: P3)

As a developer, I need a Calendar component for displaying month grids and optionally showing events so that users can visualize date-based information.

**Why this priority**: Calendar completes date-related functionality alongside DatePicker. It's specialized but essential for scheduling applications.

**Independent Test**: Can be fully tested by creating a month view calendar with events displayed. Delivers value for scheduling and date visualization.

**Acceptance Scenarios**:

1. **Given** a Calendar component, **When** rendered, **Then** it displays current month with day grid
2. **Given** a Calendar, **When** I click prev/next arrows, **Then** the displayed month changes
3. **Given** a Calendar with events, **When** rendered, **Then** event indicators appear on corresponding dates
4. **Given** a Calendar, **When** navigating with keyboard, **Then** arrow keys move between days following grid pattern
5. **Given** a Calendar, **When** using screen reader, **Then** grid semantics and day labels are announced correctly

---

### User Story 11 - Handling Advanced Data Patterns with DataTable (Priority: P3)

As a developer, I need a DataTable component with virtualization, filtering, and pagination for displaying large datasets efficiently.

**Why this priority**: DataTable extends Table for enterprise scenarios. It's complex but essential for data-intensive applications.

**Independent Test**: Can be fully tested by creating a paginated, filterable table with 10,000+ rows. Delivers value for admin panels and analytics dashboards.

**Acceptance Scenarios**:

1. **Given** a DataTable with 10,000 rows, **When** scrolling, **Then** only visible rows are rendered (virtualization)
2. **Given** a DataTable filter input, **When** I type a search term, **Then** rows filter in real-time
3. **Given** a DataTable with pagination, **When** I click page numbers, **Then** the displayed page changes
4. **Given** a DataTable column, **When** I drag its edge, **Then** the column resizes
5. **Given** a DataTable, **When** I export data, **Then** visible/selected rows export to CSV/JSON format

---

### User Story 12 - Using Utility Primitives (Priority: P1)

As a developer, I need utility primitives (Portal, FocusScope, ClientOnly, Slot, VisuallyHidden) to build accessible, SSR-safe components without common footguns.

**Why this priority**: Utilities eliminate recurring bugs around SSR hydration, focus management, and composition. They're foundational for all other components.

**Independent Test**: Can be fully tested by using Portal for modals, FocusScope for dialogs, ClientOnly for browser-only code, and VisuallyHidden for screen reader text. Delivers immediate architectural value.

**Acceptance Scenarios**:

1. **Given** a Portal component, **When** rendered, **Then** children render in document.body (or custom container)
2. **Given** a FocusScope component, **When** rendered with trap=true, **Then** focus cannot tab outside the scope
3. **Given** a ClientOnly wrapper, **When** SSR renders, **Then** children are NOT rendered server-side
4. **Given** a ClientOnly wrapper, **When** hydrated client-side, **Then** children render without hydration mismatch
5. **Given** a VisuallyHidden component, **When** rendered, **Then** content is hidden visually but readable by screen readers
6. **Given** a Slot component with asChild pattern, **When** rendered, **Then** props merge onto the single child element

---

### Edge Cases

- What happens when Toast queue exceeds limit? (Oldest toast dismisses to make room, configurable max)
- How does Progress handle value > 100 or < 0? (Clamps to 0-100 range)
- What happens when Avatar image fails and no fallback provided? (Shows default placeholder icon)
- How does Table handle empty data? (Shows configurable empty state message)
- What happens when Tree has circular references? (Throws error during development, graceful handling in production)
- How does Calendar handle dates outside current month? (Displays greyed out but clickable if allowed)
- What happens when DataTable filter matches zero rows? (Shows empty state with clear filter option)
- How does FocusScope handle dynamically added content? (Re-calculates focusable elements on mutation)

## Requirements *(mandatory)*

### Functional Requirements

**Alert Component**

- **FR-001**: Alert MUST support variants: info, success, warning, error with corresponding visual styles
- **FR-002**: Alert MUST support optional title, description, icon, and action slots
- **FR-003**: Alert MUST support closable prop with onClose callback
- **FR-004**: Alert MUST use role="alert" for error/warning and role="status" for info/success
- **FR-005**: Alert variant="error" MUST be announced immediately by screen readers

**Toast/Notification System**

- **FR-006**: ToastProvider MUST manage toast queue with configurable max simultaneous toasts (default: 5)
- **FR-007**: toast() function MUST accept title, description, variant, duration, and action parameters
- **FR-008**: Toasts MUST stack without overlap with configurable position (top/bottom + left/center/right), defaulting to top-right
- **FR-009**: Toast auto-dismiss timer MUST pause on hover
- **FR-010**: Toast MUST support swipe-to-dismiss on touch devices (optional, configurable)
- **FR-011**: Toast MUST NOT steal focus from user's current activity
- **FR-012**: Toast MUST use ARIA live regions with appropriate politeness level
- **FR-013**: WC implementation MUST provide imperative API via dsToast() global or controller export

**Progress Component**

- **FR-014**: Progress MUST support linear and circular variants
- **FR-015**: Progress MUST support determinate mode (0-100 value) and indeterminate mode (looping animation)
- **FR-016**: Progress MUST animate value changes smoothly
- **FR-017**: Progress MUST provide aria-valuenow, aria-valuemin, aria-valuemax for determinate mode
- **FR-018**: Progress indeterminate MUST NOT expose misleading aria values

**Badge Component**

- **FR-019**: Badge MUST support count display with configurable max overflow (e.g., "99+")
- **FR-020**: Badge MUST support dot variant for presence indication without count
- **FR-021**: Badge MUST support positioning relative to wrapped child element
- **FR-022**: Badge MUST support status variants (info, success, warning, error, neutral)

**Avatar Component**

- **FR-023**: Avatar MUST display image with fallback chain: image → initials → default icon
- **FR-024**: Avatar MUST support size variants (xs, sm, md, lg, xl)
- **FR-025**: AvatarGroup MUST support max prop with overflow indicator showing remaining count
- **FR-026**: Avatar MUST support status indicator dot (online, offline, away, busy)
- **FR-027**: Avatar MUST have appropriate alt text for accessibility

**Table Component**

- **FR-028**: Table MUST render semantic HTML table structure (table, thead, tbody, tr, th, td)
- **FR-029**: Table MUST support sortable columns with click-to-sort and visual indicators
- **FR-030**: Table MUST support row selection with checkboxes and select-all header
- **FR-031**: Table MUST support column alignment (left, center, right)
- **FR-032**: Table MUST support custom cell rendering via render props or slots
- **FR-033**: Table MUST fire onSort and onSelectionChange callbacks
- **FR-034**: Table MUST support empty state rendering
- **FR-035**: Table MUST associate headers with cells via proper ARIA relationships

**Skeleton Component**

- **FR-036**: Skeleton MUST support width, height, and borderRadius customization
- **FR-037**: Skeleton MUST support variant presets (text, circular, rectangular)
- **FR-038**: Skeleton MUST respect prefers-reduced-motion by disabling animation
- **FR-039**: Skeleton shimmer animation MUST be GPU-accelerated

**Tag Component**

- **FR-040**: Tag MUST support variants (solid, subtle, outline) with color schemes
- **FR-041**: Tag MUST support removable prop with close button and onRemove callback
- **FR-042**: Tag MUST support disabled state
- **FR-043**: Tag MUST support leading icon slot

**List Component**

- **FR-044**: List MUST render with proper list semantics (role="listbox" for selectable)
- **FR-045**: List MUST support keyboard navigation (arrow keys, home, end)
- **FR-046**: List MUST support single and multiple selection modes
- **FR-047**: ListItem MUST support leading and trailing content slots
- **FR-048**: List MUST support typeahead navigation

**Tree Component**

- **FR-049**: Tree MUST implement WAI-ARIA tree pattern (role="tree", "treeitem")
- **FR-050**: Tree MUST support expand/collapse with animations
- **FR-051**: Tree MUST support keyboard navigation (arrow keys for navigation, enter/space for expand)
- **FR-052**: Tree MUST support multi-select and single-select modes
- **FR-053**: Tree MUST support typeahead navigation
- **FR-054**: TreeItem MUST support disabled state

**Calendar Component**

- **FR-055**: Calendar MUST display month grid with day headers
- **FR-056**: Calendar MUST support navigation between months/years
- **FR-057**: Calendar MUST support keyboard navigation following grid pattern
- **FR-058**: Calendar MUST support event rendering via slots or data prop
- **FR-059**: Calendar MUST use proper grid semantics for screen readers

**DataTable Component**

- **FR-060**: DataTable MUST virtualize rows for datasets > 100 items
- **FR-061**: DataTable MUST support column-level and global filtering
- **FR-062**: DataTable MUST support pagination with configurable page sizes
- **FR-063**: DataTable MUST support column resizing via drag
- **FR-064**: DataTable MUST extend all Table features (sorting, selection)
- **FR-065**: DataTable MAY support column pinning (frozen columns)
- **FR-066**: DataTable MAY support data export (CSV, JSON)

**Utility Components**

- **FR-067**: Portal MUST render children into document.body or custom container
- **FR-068**: Portal MUST clean up DOM on unmount
- **FR-069**: FocusScope MUST trap tab navigation when trap=true
- **FR-070**: FocusScope MUST restore focus to trigger element on unmount
- **FR-071**: FocusScope MUST handle dynamic content changes
- **FR-072**: ClientOnly MUST NOT render children during SSR
- **FR-073**: ClientOnly MUST render children after hydration without mismatch errors
- **FR-074**: Slot MUST implement asChild pattern for prop merging
- **FR-075**: VisuallyHidden MUST hide content visually while keeping it screen-reader accessible

**Cross-Cutting Requirements**

- **FR-076**: All components MUST support reduced-motion media query compliance
- **FR-077**: All interactive components MUST have visible focus indicators
- **FR-078**: All components MUST be available in both Web Component and React implementations
- **FR-079**: All components MUST use Light DOM rendering (no Shadow DOM)
- **FR-080**: All status-indicating components MUST use consistent semantic color tokens (info, success, warning, danger)

### Key Entities

- **Toast**: Individual notification message with lifecycle (enter, visible, exit, dismissed)
- **ToastQueue**: Collection of active toasts managed by provider
- **Column Definition**: Configuration object defining table column behavior (key, header, sortable, align, render)
- **Row Data**: Generic data object displayed in table rows
- **Tree Node**: Hierarchical item with children, expanded state, and selection state
- **Calendar Event**: Date-associated data rendered on calendar days

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Bundle Size**: Total gzipped weight; prioritize tree-shaking for optional features
- **Accessibility Completeness**: Full ARIA pattern implementation per WAI-ARIA APG
- **API Consistency**: Alignment with existing design system patterns
- **Performance**: Virtualization efficiency, animation frame rate, memory usage

### Approach A: Headless Core with Styled Components

Provide behavior utilities (useTable, useTree) as headless hooks, with styled components built on top. DataTable uses TanStack Table-inspired patterns.

**Pros**:
- Maximum flexibility for advanced customization
- Smaller bundle for consumers who need only behavior
- Proven pattern from TanStack Table ecosystem

**Cons**:
- Larger API surface to maintain
- More complex mental model for basic usage
- Requires maintaining two layers (hooks + components)

### Approach B: Compound Component Pattern (Consistent with Existing Specs)

Build all components as compound components (Root/Item/Content pattern) using shared primitives from `@ds/primitives-dom`. Table and DataTable use declarative column definitions rather than hooks.

**Pros**:
- Consistent with existing specs (017, 018) compound component pattern
- Single API surface per component
- Leverages existing primitive infrastructure (focus-trap, roving-focus)
- Better tree-shaking than monolithic approach

**Cons**:
- Less flexible than headless hooks for extreme customization
- DataTable complexity may strain compound pattern

### Approach C: Monolithic Components with Props Configuration

Each component is a single export configured entirely via props.

**Pros**:
- Simplest import story
- Familiar to developers from traditional component libraries

**Cons**:
- Poorest tree-shaking (all sub-features always bundled)
- Props API becomes unwieldy for complex components
- Diverges from established codebase patterns

### Recommendation

**Recommended: Approach B - Compound Component Pattern**

This approach:
1. Maintains API consistency with existing specs (consistency accelerates adoption)
2. Achieves good bundle size through tree-shaking without hooks overhead
3. Leverages existing `@ds/primitives-dom` investments
4. Aligns with constitution principle hierarchy (Performance > Accessibility > Customizability)

For DataTable specifically:
- Column definitions as data (similar to TanStack) rather than nested components
- Virtualization implemented internally using standard windowing technique
- This hybrid allows DataTable to handle complexity while maintaining familiar compound pattern for simpler table

The trade-off (less flexibility than headless) is acceptable because:
- 90% of use cases are covered by compound pattern
- Advanced users can compose primitives directly
- Documentation provides escape hatches via render props

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can implement feedback patterns (alerts, toasts, progress) within 10 minutes of reading documentation
- **SC-002**: All feedback components (Alert, Toast, Progress) pass WCAG 2.1 AA automated testing
- **SC-003**: Toast system handles 20 concurrent notifications without performance degradation
- **SC-004**: Table renders 1000 rows with sorting/selection in under 100ms
- **SC-005**: DataTable with virtualization renders 100,000 rows with smooth scrolling (60fps)
- **SC-006**: Skeleton animations run at 60fps without main thread blocking
- **SC-007**: Combined bundle size for all new components remains under 45KB gzipped
- **SC-008**: All utility primitives (Portal, FocusScope, ClientOnly) work correctly in Next.js App Router SSR
- **SC-009**: Tree component passes WAI-ARIA tree pattern automated conformance checks
- **SC-010**: 90% of developers find Table API intuitive in usability testing

## Assumptions

- Existing `@ds/primitives-dom` package provides required behavior utilities (focus-trap, roving-focus, type-ahead)
- Token system from `@ds/tokens` includes semantic status colors (info, success, warning, danger)
- Animation utilities from spec-016 (motion-system) are available for transitions
- Portal implementation will be shared across Toast, Popover, and other overlay components
- React 18+ and Lit 3.1+ are the target platforms per existing patterns
- VisuallyHidden component exists and needs enhancement per contracts (not new implementation)
- DatePicker from spec-017 handles date selection; Calendar focuses on display/visualization
