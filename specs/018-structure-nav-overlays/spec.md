# Feature Specification: Structure, Navigation & Overlays

**Feature Branch**: `018-structure-nav-overlays`
**Created**: 2026-01-07
**Status**: Draft
**Input**: User description: "Structure, Navigation & Overlays (18–20 components) - Deliver app skeleton primitives (Card/Tabs/Accordion) and the navigation + overlay ecosystem needed for real apps"

## Clarifications

### Session 2026-01-07

- Q: Are Sheet and Drawer separate components or variants? → A: Sheet and Drawer are separate components (Drawer wraps Sheet with mobile enhancements)
- Q: What z-index strategy should overlays use? → A: CSS custom property base with relative increments (configurable `--ds-z-overlay`)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Building Application Layouts with Structure Primitives (Priority: P1)

As a developer building an application, I need to organize content into Cards, Tabs, and Accordions so that I can create structured, scannable interfaces that users can navigate intuitively.

**Why this priority**: Structure primitives (Card/Tabs/Accordion) are foundational components that unblock most application development. Without these, developers cannot build basic app shells or organize content effectively.

**Independent Test**: Can be fully tested by creating a dashboard with Cards containing metrics, Tabs for different views, and Accordions for FAQ sections. Delivers immediate value for organizing any application content.

**Acceptance Scenarios**:

1. **Given** a Card component, **When** I add CardHeader, CardContent, and CardFooter children, **Then** the content is visually separated into distinct sections with appropriate spacing
2. **Given** a Tabs component with multiple TabsTrigger elements, **When** I click a trigger, **Then** the corresponding TabsContent is displayed and others are hidden
3. **Given** an Accordion with multiple items, **When** I click an AccordionTrigger, **Then** the AccordionContent expands/collapses with smooth animation
4. **Given** a Tabs component, **When** I press arrow keys while focused on triggers, **Then** focus moves between triggers following WAI-ARIA tab pattern
5. **Given** an Accordion component, **When** I press Enter or Space on a trigger, **Then** the content toggles open/closed state

---

### User Story 2 - Presenting Confirmations with AlertDialog (Priority: P1)

As a developer, I need to show confirmation dialogs for destructive actions so that users have a clear opportunity to confirm or cancel irreversible operations.

**Why this priority**: AlertDialog is essential for safe user experiences. Without proper confirmation patterns, applications risk accidental data loss and poor UX for destructive actions.

**Independent Test**: Can be fully tested by implementing a "Delete Account" flow with AlertDialog that requires explicit confirmation. Delivers immediate value for any destructive action pattern.

**Acceptance Scenarios**:

1. **Given** an AlertDialog trigger button, **When** I click it, **Then** the dialog opens with focus trapped inside
2. **Given** an open AlertDialog, **When** I press Escape, **Then** the dialog closes and focus returns to the trigger
3. **Given** an AlertDialog with Cancel and Confirm buttons, **When** I click Cancel, **Then** the dialog closes without executing the destructive action
4. **Given** an AlertDialog, **When** it opens, **Then** focus moves to the primary action button (or first focusable element per configuration)
5. **Given** an AlertDialog, **When** using a screen reader, **Then** the dialog role and description are announced appropriately

---

### User Story 3 - Creating Overlay Panels with Sheet and Drawer (Priority: P2)

As a developer, I need slide-in panels (Sheet/Drawer) to display secondary content, filters, or navigation without leaving the current context.

**Why this priority**: Overlays are critical for mobile-responsive designs and progressive disclosure patterns. They enable complex applications to remain usable on smaller screens.

**Independent Test**: Can be fully tested by creating a settings panel that slides in from the right (Sheet) and a mobile navigation that slides from the left (Drawer). Delivers value for any application needing side panels.

**Acceptance Scenarios**:

1. **Given** a Sheet trigger, **When** I click it, **Then** a panel slides in from the configured side (left/right/top/bottom)
2. **Given** an open Sheet, **When** I click outside or press Escape, **Then** the Sheet closes with slide-out animation
3. **Given** a Drawer on mobile viewport, **When** displayed, **Then** it respects safe-area insets for notched devices
4. **Given** a Sheet/Drawer, **When** opening, **Then** focus is trapped within the panel
5. **Given** a Sheet/Drawer, **When** closing, **Then** focus returns to the trigger element

---

### User Story 4 - Building Menus with DropdownMenu and ContextMenu (Priority: P2)

As a developer, I need dropdown menus for actions and context menus for right-click interactions to provide compact, contextual action access.

**Why this priority**: Menu components are essential for action-dense interfaces. They enable applications to offer many actions without cluttering the UI.

**Independent Test**: Can be fully tested by creating a "More Actions" dropdown with submenus and a table row with right-click context menu. Delivers value for any application with multiple contextual actions.

**Acceptance Scenarios**:

1. **Given** a DropdownMenu trigger, **When** I click it, **Then** the menu opens positioned relative to the trigger
2. **Given** an open menu, **When** I press arrow keys, **Then** focus moves between menu items
3. **Given** a menu item with submenu, **When** I hover or press arrow right, **Then** the submenu opens
4. **Given** an element with ContextMenu, **When** I right-click (or long-press on touch), **Then** the context menu appears at pointer position
5. **Given** an open menu, **When** I type characters, **Then** focus jumps to matching items (typeahead)
6. **Given** nested menus, **When** I press Escape, **Then** only the innermost menu closes first

---

### User Story 5 - Displaying Rich Previews with HoverCard (Priority: P2)

As a developer, I need hover cards to show rich preview content when users hover over links or avatars without requiring a click.

**Why this priority**: HoverCard improves information density and discovery. Users can preview content without navigating away from their current view.

**Independent Test**: Can be fully tested by creating user profile links that show avatar, bio, and actions on hover. Delivers value for any application with linked entities.

**Acceptance Scenarios**:

1. **Given** a HoverCard trigger, **When** I hover over it, **Then** the card appears after a brief delay (default 700ms)
2. **Given** an open HoverCard, **When** I move pointer into the card, **Then** the card stays open
3. **Given** an open HoverCard, **When** I move pointer away from both trigger and card, **Then** the card closes after a brief delay
4. **Given** a HoverCard, **When** I focus the trigger via keyboard, **Then** the card opens (focus equivalent to hover)
5. **Given** HoverCard content, **When** it contains interactive elements, **Then** I can tab into and interact with them

---

### User Story 6 - Creating Mega-Navigation with NavigationMenu (Priority: P2)

As a developer, I need a mega-menu style navigation component for complex site navigation with grouped links and featured content.

**Why this priority**: NavigationMenu unlocks enterprise-scale navigation patterns. It enables large sites to organize complex navigation hierarchies.

**Independent Test**: Can be fully tested by creating a site header with Products, Solutions, and Resources menus containing grouped links. Delivers value for marketing sites and enterprise applications.

**Acceptance Scenarios**:

1. **Given** a NavigationMenu, **When** I hover over a trigger, **Then** the corresponding content panel opens
2. **Given** an open navigation panel, **When** I press arrow keys, **Then** focus moves through items following roving tabindex pattern
3. **Given** a NavigationMenu on mobile, **When** viewport is narrow, **Then** it adapts to a hamburger menu or stacked layout
4. **Given** multiple navigation triggers, **When** I move between them, **Then** the open panel transitions smoothly between content

---

### User Story 7 - Using Structure Utilities (Priority: P3)

As a developer, I need utility components (Collapsible, Separator, AspectRatio, ScrollArea) to handle common layout patterns without custom CSS.

**Why this priority**: Utility components reduce boilerplate and ensure consistency. They handle edge cases that developers often implement incorrectly.

**Independent Test**: Can be fully tested by building a media gallery with AspectRatio containers, Separators between sections, Collapsible advanced options, and ScrollArea for thumbnails. Delivers value for consistent, accessible layouts.

**Acceptance Scenarios**:

1. **Given** a Collapsible component, **When** I toggle it, **Then** the content smoothly expands/collapses
2. **Given** a Separator, **When** rendered horizontally or vertically, **Then** it displays appropriate visual divider with correct ARIA role
3. **Given** an AspectRatio with 16:9 ratio, **When** container width changes, **Then** height adjusts to maintain ratio
4. **Given** a ScrollArea, **When** content overflows, **Then** custom scrollbars appear with keyboard scroll support
5. **Given** a ScrollArea, **When** using keyboard, **Then** I can scroll content without focus being trapped

---

### User Story 8 - Building Navigation Patterns (Priority: P4)

As a developer, I need Breadcrumb, Pagination, and Stepper components to provide wayfinding and progress indication in multi-step flows.

**Why this priority**: Navigation utilities complete the application shell. They're essential for complex applications but can be worked around initially.

**Independent Test**: Can be fully tested by creating a multi-step checkout with Stepper, paginated product list, and breadcrumb trail. Delivers value for e-commerce and wizard-style applications.

**Acceptance Scenarios**:

1. **Given** a Breadcrumb, **When** rendered, **Then** it shows hierarchical navigation with proper separator characters
2. **Given** a Breadcrumb, **When** using screen reader, **Then** it announces as navigation landmark with current page indicated
3. **Given** Pagination, **When** I click page numbers or prev/next, **Then** page changes and state updates
4. **Given** Pagination with many pages, **When** rendered, **Then** it shows truncation with ellipsis for middle pages
5. **Given** a Stepper, **When** viewing current progress, **Then** completed, current, and future steps are visually distinct
6. **Given** a Stepper, **When** step is accessible, **Then** it can be navigated to directly

---

### User Story 9 - Command Palette Integration (Priority: P4)

As a developer, I need a Command (cmdk-style) palette for keyboard-driven application navigation and actions.

**Why this priority**: Command palette is a power-user feature. It significantly improves efficiency for keyboard-centric users but isn't required for basic functionality.

**Independent Test**: Can be fully tested by implementing Cmd+K shortcut that opens searchable command list with sections and keyboard navigation. Delivers value for productivity applications.

**Acceptance Scenarios**:

1. **Given** Command palette trigger (Cmd+K), **When** pressed, **Then** the command dialog opens with focus in search input
2. **Given** Command palette, **When** I type, **Then** items are filtered in real-time with fuzzy matching
3. **Given** filtered results, **When** I press arrow keys, **Then** focus moves between items
4. **Given** Command items, **When** grouped into sections, **Then** groups are visually separated with labels
5. **Given** a selected command item, **When** I press Enter, **Then** the command executes and palette closes

---

### Edge Cases

- What happens when Tabs has no default selected tab? (First tab should be selected by default)
- How does system handle nested popovers/menus? (Overlay stack manages z-index and focus, inner dismisses first)
- What happens when Sheet content is taller than viewport? (Content scrolls within Sheet, not the page)
- How does ContextMenu handle touch devices? (Long-press triggers context menu with appropriate delay)
- What happens when AccordionContent contains focusable elements and accordion closes? (Focus moves to trigger)
- How does HoverCard handle touch-only devices? (Converts to tap-to-open pattern)
- What happens when CommandPalette has no matching results? (Shows empty state message)
- How do components handle reduced-motion preference? (Animations disabled or simplified)

## Requirements *(mandatory)*

### Functional Requirements

**Structure Primitives**

- **FR-001**: Card MUST render with CardHeader, CardContent, and CardFooter slots that can be used independently
- **FR-002**: Tabs MUST support both automatic activation (focus moves selection) and manual activation (focus then Enter) modes
- **FR-003**: Tabs MUST support controlled and uncontrolled value states via `value` and `defaultValue` props
- **FR-004**: Accordion MUST support single-expand and multiple-expand modes via `type` prop
- **FR-005**: Accordion items MUST support disabled state that prevents expansion
- **FR-006**: Tabs and Accordion MUST support horizontal and vertical orientations for keyboard navigation

**AlertDialog**

- **FR-007**: AlertDialog MUST trap focus within the dialog when open
- **FR-008**: AlertDialog MUST return focus to trigger element when closed
- **FR-009**: AlertDialog MUST support custom initial focus element via prop
- **FR-010**: AlertDialog MUST close on Escape key unless explicitly prevented
- **FR-011**: AlertDialog MUST have `role="alertdialog"` with `aria-labelledby` and `aria-describedby`

**Overlay Panels**

- **FR-012**: Sheet MUST support four edge positions: left, right, top, bottom
- **FR-013**: Sheet MUST render in a portal to escape stacking context issues
- **FR-014**: Drawer MUST be a separate component that composes Sheet internally
- **FR-015**: Drawer MUST add mobile-specific enhancements: safe-area insets, swipe-to-dismiss gesture support
- **FR-016**: Sheet MUST support custom overlay/backdrop styling
- **FR-017**: Sheet and Drawer MUST fire `onOpenChange` callback when state changes

**Menu Components**

- **FR-018**: DropdownMenu MUST support trigger button or custom trigger element
- **FR-019**: Menus MUST support nested submenus with keyboard navigation (arrow keys)
- **FR-020**: ContextMenu MUST open at pointer position on right-click
- **FR-021**: ContextMenu MUST support long-press activation on touch devices (default 500ms)
- **FR-022**: Menus MUST support typeahead navigation by typing first characters
- **FR-023**: Menu items MUST support `onSelect` callback and disabled state
- **FR-024**: Menus MUST support separator, label, and checkbox/radio item types

**HoverCard**

- **FR-025**: HoverCard MUST support configurable open/close delays
- **FR-026**: HoverCard MUST remain open when pointer moves from trigger to card
- **FR-027**: HoverCard MUST support keyboard activation (focus trigger opens card)
- **FR-028**: HoverCard MUST support custom alignment and side positioning

**NavigationMenu**

- **FR-029**: NavigationMenu MUST support roving tabindex for keyboard navigation
- **FR-030**: NavigationMenu items MUST support nested content panels
- **FR-031**: NavigationMenu MUST support indicator/viewport for active item highlighting
- **FR-032**: NavigationMenu MUST support custom viewport for shared content area

**Utility Components**

- **FR-033**: Collapsible MUST support controlled and uncontrolled open state
- **FR-034**: Separator MUST render with appropriate ARIA role (separator or none for decorative)
- **FR-035**: AspectRatio MUST maintain ratio regardless of container size
- **FR-036**: ScrollArea MUST provide custom scrollbars while maintaining keyboard scroll access
- **FR-037**: ScrollArea MUST NOT trap keyboard focus within scrollable region

**Navigation Patterns**

- **FR-038**: Breadcrumb MUST render as navigation landmark with proper list semantics
- **FR-039**: Breadcrumb MUST indicate current page with aria-current="page"
- **FR-040**: Pagination MUST support controlled and uncontrolled page state
- **FR-041**: Pagination MUST support customizable sibling/boundary counts for truncation
- **FR-042**: Stepper MUST indicate completed, current, and pending step states
- **FR-043**: Stepper MUST support both horizontal and vertical orientations

**Command Palette**

- **FR-044**: Command MUST support real-time filtering with customizable filter function
- **FR-045**: Command MUST support grouped items with section headings
- **FR-046**: Command MUST support keyboard navigation with arrow keys
- **FR-047**: Command MUST support `onSelect` callback when item is chosen
- **FR-048**: Command MUST support loading state for async filtering

**Cross-Cutting Requirements**

- **FR-049**: All overlay components MUST use CSS custom property `--ds-z-overlay` as configurable base with relative increments for z-index management
- **FR-050**: All components MUST support reduced-motion media query compliance
- **FR-051**: All interactive components MUST have visible focus indicators
- **FR-052**: All components MUST be available in both Web Component and React implementations with API parity
- **FR-053**: All components MUST use Light DOM rendering (no Shadow DOM) per platform conventions

### Key Entities

- **Component**: Individual UI element with defined props, state, and behavior (Card, Tabs, Sheet, etc.)
- **Overlay Stack**: System managing z-index and focus across nested overlays (dialogs, menus, popovers)
- **Trigger**: Element that activates an overlay or state change (button, link, or custom element)
- **Content**: The payload rendered inside overlays or collapsible regions
- **Item**: Child element within list-style components (TabsTrigger, MenuItem, AccordionItem)

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Bundle Size**: Total gzipped weight added to applications (constitution requires minimal footprint)
- **Keyboard Accessibility**: Full keyboard operability per WAI-ARIA patterns
- **Animation Performance**: GPU-accelerated transitions, reduced-motion compliance
- **Composition Pattern**: Flexibility in assembling sub-components vs monolithic API

### Approach A: Compound Component Pattern with Shared Primitives

Build each component as compound components (Root/Trigger/Content pattern) that compose shared primitives from `@ds/primitives-dom` (focus-trap, dismissable-layer, roving-focus, type-ahead).

**Pros**:
- Maximizes code reuse across overlay components (Sheet, Dialog, Menu share focus-trap)
- Enables tree-shaking: unused sub-components are excluded
- Aligns with existing codebase patterns (Dialog, Popover, Select already use this)
- Provides maximum flexibility for customization

**Cons**:
- More complex mental model for consumers (many exports per component)
- Requires understanding of composition pattern

### Approach B: Monolithic Components with Render Props

Build each component as a single export that accepts render props or children for customization.

**Pros**:
- Simpler import story (one import per component)
- Familiar pattern for developers from other libraries

**Cons**:
- Larger bundle size (all sub-components always included)
- Less flexible: render props limit styling/structure options
- Diverges from existing codebase patterns

### Approach C: Headless Hooks + Primitives

Provide behavior as hooks (useAccordion, useTabs) separate from styled components.

**Pros**:
- Maximum flexibility for custom implementations
- Smallest possible bundle for advanced users

**Cons**:
- Significant additional API surface
- Requires maintaining both hooks and components
- Most consumers want ready-to-use components

### Recommendation

**Recommended: Approach A - Compound Component Pattern with Shared Primitives**

This approach:
1. Scores best on bundle size through tree-shaking and primitive reuse
2. Aligns with constitution principle hierarchy (Performance > Accessibility > Customizability)
3. Maintains consistency with existing components (Dialog, Popover, Select from spec-017)
4. Leverages existing `@ds/primitives-dom` investments

The complexity trade-off is acceptable because:
- Documentation and examples mitigate learning curve
- TypeScript provides excellent autocomplete for sub-components
- Pattern is already established in the codebase

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can build a complete app shell (header, sidebar, main content) using only design system components within 30 minutes
- **SC-002**: All overlay components (Sheet, Drawer, Menus, AlertDialog) pass WCAG 2.1 AA automated testing
- **SC-003**: Keyboard-only users can complete all component interactions without mouse
- **SC-004**: 90% of developers find the Tabs/Accordion/Card API intuitive in usability testing
- **SC-005**: Combined bundle size for all new components remains under 40KB gzipped
- **SC-006**: Animation transitions complete within 300ms and respect prefers-reduced-motion
- **SC-007**: Nested overlay scenarios (menu inside sheet inside dialog) maintain correct focus and z-index management
- **SC-008**: All components render correctly in SSR/RSC environments without hydration errors

## Assumptions

- Existing `@ds/primitives-dom` package provides required behavior utilities (focus-trap, dismissable-layer, roving-focus, type-ahead)
- Token system from `@ds/tokens` includes appropriate surface, overlay, and navigation tokens
- Animation utilities from spec-016 (motion-system) are available for transitions
- Portal implementation exists for overlay rendering
- The design system follows Light DOM strategy per platform conventions (spec-006)
- React 18+ and Lit 3.1+ are the target platforms per existing patterns
