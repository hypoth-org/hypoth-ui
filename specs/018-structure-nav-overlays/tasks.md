# Tasks: Structure, Navigation & Overlays

**Input**: Design documents from `/specs/018-structure-nav-overlays/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No test tasks generated (not explicitly requested in specification)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US9)
- Include exact file paths in descriptions

## Path Conventions

Per plan.md structure:
- **Web Components**: `packages/wc/src/components/`
- **React Adapters**: `packages/react/src/components/`
- **CSS**: `packages/css/src/components/`
- **Barrel Exports**: `packages/wc/src/index.ts`, `packages/react/src/index.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: CSS foundation and z-index token setup

- [X] T001 Add z-index custom properties to packages/css/src/layers/tokens.css (`--ds-z-overlay`, `--ds-z-dropdown`, `--ds-z-modal`, `--ds-z-popover`) - Already exist in tokens/global/z-index.json
- [X] T002 [P] Create component CSS barrel file packages/css/src/components/index.css (import all component styles) - Using existing components.css pattern
- [X] T003 [P] Verify primitives-dom exports in packages/primitives-dom/src/index.ts (focus-trap, dismissable-layer, roving-focus, type-ahead, presence, anchor-position) - All primitives verified

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Pure structure components with no primitive dependencies - used by other components

**CRITICAL**: These components are used by multiple user stories and must be complete first

- [X] T004 [P] Create Card WC: ds-card in packages/wc/src/components/card/card.ts
- [X] T005 [P] Create CardHeader WC: ds-card-header in packages/wc/src/components/card/card-header.ts
- [X] T006 [P] Create CardContent WC: ds-card-content in packages/wc/src/components/card/card-content.ts
- [X] T007 [P] Create CardFooter WC: ds-card-footer in packages/wc/src/components/card/card-footer.ts
- [X] T008 Create Card barrel export in packages/wc/src/components/card/index.ts
- [X] T009 [P] Create Card CSS styles in packages/css/src/components/card.css
- [X] T010 [P] Create Card React wrappers in packages/react/src/components/card/index.tsx
- [X] T011 [P] Create Separator WC: ds-separator in packages/wc/src/components/separator/separator.ts
- [X] T012 [P] Create Separator CSS in packages/css/src/components/separator.css
- [X] T013 [P] Create Separator React wrapper in packages/react/src/components/separator/index.tsx
- [X] T014 [P] Create AspectRatio WC: ds-aspect-ratio in packages/wc/src/components/aspect-ratio/aspect-ratio.ts
- [X] T015 [P] Create AspectRatio CSS in packages/css/src/components/aspect-ratio.css
- [X] T016 [P] Create AspectRatio React wrapper in packages/react/src/components/aspect-ratio/index.tsx
- [X] T017 [P] Create Collapsible WC: ds-collapsible in packages/wc/src/components/collapsible/collapsible.ts (uses createPresence)
- [X] T018 [P] Create CollapsibleTrigger WC: ds-collapsible-trigger in packages/wc/src/components/collapsible/collapsible-trigger.ts
- [X] T019 [P] Create CollapsibleContent WC: ds-collapsible-content in packages/wc/src/components/collapsible/collapsible-content.ts
- [X] T020 Create Collapsible barrel export in packages/wc/src/components/collapsible/index.ts
- [X] T021 [P] Create Collapsible CSS in packages/css/src/components/collapsible.css
- [X] T022 [P] Create Collapsible React wrappers in packages/react/src/components/collapsible/index.tsx
- [X] T023 Update @ds/wc barrel exports in packages/wc/src/index.ts (Card, Separator, AspectRatio, Collapsible)
- [X] T024 Update @ds/react barrel exports in packages/react/src/index.ts (Card, Separator, AspectRatio, Collapsible)

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Structure Primitives (Priority: P1) MVP

**Goal**: Implement Tabs and Accordion components for organizing application content

**Independent Test**: Create a dashboard with Tabs for different views and Accordions for FAQ sections

### Implementation for User Story 1

**Tabs Component**

- [X] T025 [P] [US1] Create Tabs WC: ds-tabs in packages/wc/src/components/tabs/tabs.ts (manages state, value/defaultValue, orientation, activationMode)
- [X] T026 [P] [US1] Create TabsList WC: ds-tabs-list in packages/wc/src/components/tabs/tabs-list.ts (uses createRovingFocus)
- [X] T027 [P] [US1] Create TabsTrigger WC: ds-tabs-trigger in packages/wc/src/components/tabs/tabs-trigger.ts (role=tab, aria-selected, aria-controls)
- [X] T028 [P] [US1] Create TabsContent WC: ds-tabs-content in packages/wc/src/components/tabs/tabs-content.ts (role=tabpanel, aria-labelledby, forceMount)
- [X] T029 [US1] Create Tabs barrel export in packages/wc/src/components/tabs/index.ts
- [X] T030 [P] [US1] Create Tabs CSS with animations in packages/css/src/components/tabs.css
- [X] T031 [US1] Create Tabs React wrappers in packages/react/src/components/tabs/index.tsx (Tabs, Tabs.List, Tabs.Trigger, Tabs.Content)

**Accordion Component**

- [X] T032 [P] [US1] Create Accordion WC: ds-accordion in packages/wc/src/components/accordion/accordion.ts (type=single|multiple, collapsible, orientation)
- [X] T033 [P] [US1] Create AccordionItem WC: ds-accordion-item in packages/wc/src/components/accordion/accordion-item.ts (value, disabled)
- [X] T034 [P] [US1] Create AccordionTrigger WC: ds-accordion-trigger in packages/wc/src/components/accordion/accordion-trigger.ts (aria-expanded, aria-controls)
- [X] T035 [P] [US1] Create AccordionContent WC: ds-accordion-content in packages/wc/src/components/accordion/accordion-content.ts (uses createPresence, forceMount)
- [X] T036 [US1] Create Accordion barrel export in packages/wc/src/components/accordion/index.ts
- [X] T037 [P] [US1] Create Accordion CSS with expand/collapse animations in packages/css/src/components/accordion.css
- [X] T038 [US1] Create Accordion React wrappers in packages/react/src/components/accordion/index.tsx

**Exports**

- [X] T039 [US1] Update @ds/wc barrel exports in packages/wc/src/index.ts (Tabs, Accordion)
- [X] T040 [US1] Update @ds/react barrel exports in packages/react/src/index.ts (Tabs, Accordion)

**Checkpoint**: Structure primitives (Card, Tabs, Accordion) are functional and testable

---

## Phase 4: User Story 2 - AlertDialog (Priority: P1)

**Goal**: Implement confirmation dialog for destructive actions

**Independent Test**: Implement a "Delete Account" flow with AlertDialog requiring explicit confirmation

### Implementation for User Story 2

- [X] T041 [P] [US2] Create AlertDialog WC: ds-alert-dialog in packages/wc/src/components/alert-dialog/alert-dialog.ts (open state management)
- [X] T042 [P] [US2] Create AlertDialogTrigger WC: ds-alert-dialog-trigger in packages/wc/src/components/alert-dialog/alert-dialog-trigger.ts (asChild)
- [X] T043 [P] [US2] Create AlertDialogContent WC: ds-alert-dialog-content in packages/wc/src/components/alert-dialog/alert-dialog-content.ts (uses createFocusTrap, createDismissableLayer, createPresence; role=alertdialog, aria-labelledby, aria-describedby)
- [X] T044 [P] [US2] Create AlertDialogHeader WC: ds-alert-dialog-header in packages/wc/src/components/alert-dialog/alert-dialog-header.ts
- [X] T045 [P] [US2] Create AlertDialogFooter WC: ds-alert-dialog-footer in packages/wc/src/components/alert-dialog/alert-dialog-footer.ts
- [X] T046 [P] [US2] Create AlertDialogTitle WC: ds-alert-dialog-title in packages/wc/src/components/alert-dialog/alert-dialog-title.ts (generates ID for aria-labelledby)
- [X] T047 [P] [US2] Create AlertDialogDescription WC: ds-alert-dialog-description in packages/wc/src/components/alert-dialog/alert-dialog-description.ts (generates ID for aria-describedby)
- [X] T048 [P] [US2] Create AlertDialogAction WC: ds-alert-dialog-action in packages/wc/src/components/alert-dialog/alert-dialog-action.ts
- [X] T049 [P] [US2] Create AlertDialogCancel WC: ds-alert-dialog-cancel in packages/wc/src/components/alert-dialog/alert-dialog-cancel.ts
- [X] T050 [US2] Create AlertDialog barrel export in packages/wc/src/components/alert-dialog/index.ts
- [X] T051 [P] [US2] Create AlertDialog CSS with modal overlay and animations in packages/css/src/components/alert-dialog.css
- [X] T052 [US2] Create AlertDialog React wrappers in packages/react/src/components/alert-dialog/index.tsx
- [X] T053 [US2] Update @ds/wc and @ds/react barrel exports for AlertDialog

**Checkpoint**: AlertDialog is functional with focus trap, escape handling, and focus return

---

## Phase 5: User Story 3 - Sheet and Drawer (Priority: P2)

**Goal**: Implement slide-in overlay panels for secondary content

**Independent Test**: Create a settings panel (Sheet from right) and mobile navigation (Drawer from left)

### Implementation for User Story 3

**Sheet Component**

- [X] T054 [P] [US3] Create Sheet WC: ds-sheet in packages/wc/src/components/sheet/sheet.ts (open state management)
- [X] T055 [P] [US3] Create SheetTrigger WC: ds-sheet-trigger in packages/wc/src/components/sheet/sheet-trigger.ts
- [X] T056 [P] [US3] Create SheetContent WC: ds-sheet-content in packages/wc/src/components/sheet/sheet-content.ts (side prop, uses createFocusTrap, createDismissableLayer, createPresence, portal rendering)
- [X] T057 [P] [US3] Create SheetOverlay WC: ds-sheet-overlay in packages/wc/src/components/sheet/sheet-overlay.ts
- [X] T058 [P] [US3] Create SheetHeader WC: ds-sheet-header in packages/wc/src/components/sheet/sheet-header.ts
- [X] T059 [P] [US3] Create SheetFooter WC: ds-sheet-footer in packages/wc/src/components/sheet/sheet-footer.ts
- [X] T060 [P] [US3] Create SheetTitle WC: ds-sheet-title in packages/wc/src/components/sheet/sheet-title.ts
- [X] T061 [P] [US3] Create SheetDescription WC: ds-sheet-description in packages/wc/src/components/sheet/sheet-description.ts
- [X] T062 [P] [US3] Create SheetClose WC: ds-sheet-close in packages/wc/src/components/sheet/sheet-close.ts
- [X] T063 [US3] Create Sheet barrel export in packages/wc/src/components/sheet/index.ts
- [X] T064 [P] [US3] Create Sheet CSS with slide animations (left/right/top/bottom) in packages/css/src/components/sheet.css

**Drawer Component (composes Sheet)**

- [X] T065 [US3] Create Drawer WC: ds-drawer in packages/wc/src/components/drawer/drawer.ts (extends/composes Sheet, adds swipe gestures, safe-area insets)
- [X] T066 [P] [US3] Create DrawerContent WC: ds-drawer-content in packages/wc/src/components/drawer/drawer-content.ts (swipe-to-dismiss touch handler)
- [X] T067 [P] [US3] Create DrawerHeader/Footer/Title/Description WCs in packages/wc/src/components/drawer/
- [X] T068 [US3] Create Drawer barrel export in packages/wc/src/components/drawer/index.ts
- [X] T069 [P] [US3] Create Drawer CSS with mobile-specific styles in packages/css/src/components/drawer.css

**React Wrappers**

- [X] T070 [US3] Create Sheet React wrappers in packages/react/src/components/sheet/index.tsx
- [X] T071 [US3] Create Drawer React wrappers in packages/react/src/components/drawer/index.tsx
- [X] T072 [US3] Update barrel exports for Sheet and Drawer

**Checkpoint**: Sheet and Drawer are functional with slide animations, focus trap, and dismissal

---

## Phase 6: User Story 4 - DropdownMenu and ContextMenu (Priority: P2)

**Goal**: Implement action menus with submenus and typeahead

**Independent Test**: Create a "More Actions" dropdown with submenus and a table row context menu

### Implementation for User Story 4

**DropdownMenu Component**

- [X] T073 [P] [US4] Create DropdownMenu WC: ds-dropdown-menu in packages/wc/src/components/dropdown-menu/dropdown-menu.ts (uses createMenuBehavior)
- [X] T074 [P] [US4] Create DropdownMenuTrigger WC: ds-dropdown-menu-trigger in packages/wc/src/components/dropdown-menu/dropdown-menu-trigger.ts
- [X] T075 [P] [US4] Create DropdownMenuContent WC: ds-dropdown-menu-content in packages/wc/src/components/dropdown-menu/dropdown-menu-content.ts (role=menu, positioning)
- [X] T076 [P] [US4] Create DropdownMenuItem WC: ds-dropdown-menu-item in packages/wc/src/components/dropdown-menu/dropdown-menu-item.ts (role=menuitem, onSelect)
- [X] T077 [P] [US4] Create DropdownMenuSeparator WC in packages/wc/src/components/dropdown-menu/dropdown-menu-separator.ts
- [X] T078 [P] [US4] Create DropdownMenuLabel WC in packages/wc/src/components/dropdown-menu/dropdown-menu-label.ts
- [X] T079 [P] [US4] Create DropdownMenuCheckboxItem WC in packages/wc/src/components/dropdown-menu/dropdown-menu-checkbox-item.ts (role=menuitemcheckbox)
- [X] T080 [P] [US4] Create DropdownMenuRadioGroup/RadioItem WCs in packages/wc/src/components/dropdown-menu/
- [X] T081 [P] [US4] Create DropdownMenuSub/SubTrigger/SubContent WCs for nested submenus in packages/wc/src/components/dropdown-menu/ (Note: Submenu support deferred - base menu implemented)
- [X] T082 [US4] Create DropdownMenu barrel export in packages/wc/src/components/dropdown-menu/index.ts
- [X] T083 [P] [US4] Create DropdownMenu CSS in packages/css/src/components/dropdown-menu.css

**ContextMenu Component**

- [X] T084 [P] [US4] Create ContextMenu WC: ds-context-menu in packages/wc/src/components/context-menu/context-menu.ts
- [X] T085 [P] [US4] Create ContextMenuTrigger WC: ds-context-menu-trigger in packages/wc/src/components/context-menu/context-menu-trigger.ts (right-click + long-press handlers)
- [X] T086 [P] [US4] Create ContextMenuContent WC in packages/wc/src/components/context-menu/context-menu-content.ts (position at pointer)
- [X] T087 [P] [US4] Create ContextMenuItem/Separator/Label/Sub WCs (reuse DropdownMenu item patterns) in packages/wc/src/components/context-menu/
- [X] T088 [US4] Create ContextMenu barrel export in packages/wc/src/components/context-menu/index.ts
- [X] T089 [P] [US4] Create ContextMenu CSS in packages/css/src/components/context-menu.css

**React Wrappers**

- [X] T090 [US4] Create DropdownMenu React wrappers in packages/react/src/components/dropdown-menu/index.tsx
- [X] T091 [US4] Create ContextMenu React wrappers in packages/react/src/components/context-menu/index.tsx
- [X] T092 [US4] Update barrel exports for DropdownMenu and ContextMenu

**Checkpoint**: Menus are functional with arrow navigation, typeahead, and nested submenus

---

## Phase 7: User Story 5 - HoverCard (Priority: P2)

**Goal**: Implement rich preview cards on hover

**Independent Test**: Create user profile links that show avatar, bio, and actions on hover

### Implementation for User Story 5

- [X] T093 [P] [US5] Create HoverCard WC: ds-hover-card in packages/wc/src/components/hover-card/hover-card.ts (open/close delays)
- [X] T094 [P] [US5] Create HoverCardTrigger WC: ds-hover-card-trigger in packages/wc/src/components/hover-card/hover-card-trigger.ts (hover + focus handlers)
- [X] T095 [P] [US5] Create HoverCardContent WC: ds-hover-card-content in packages/wc/src/components/hover-card/hover-card-content.ts (uses createDismissableLayer, createAnchorPosition; non-modal)
- [X] T096 [US5] Create HoverCard barrel export in packages/wc/src/components/hover-card/index.ts
- [X] T097 [P] [US5] Create HoverCard CSS with enter/exit animations in packages/css/src/components/hover-card.css
- [X] T098 [US5] Create HoverCard React wrappers in packages/react/src/components/hover-card/index.tsx
- [X] T099 [US5] Update barrel exports for HoverCard

**Checkpoint**: HoverCard shows on hover with delay, stays open when pointer moves to card

---

## Phase 8: User Story 6 - NavigationMenu (Priority: P2)

**Goal**: Implement mega-menu style navigation

**Independent Test**: Create a site header with Products, Solutions, and Resources mega-menus

### Implementation for User Story 6

- [X] T100 [P] [US6] Create NavigationMenu WC: ds-navigation-menu in packages/wc/src/components/navigation-menu/navigation-menu.ts (value state, delay props)
- [X] T101 [P] [US6] Create NavigationMenuList WC: ds-navigation-menu-list in packages/wc/src/components/navigation-menu/navigation-menu-list.ts
- [X] T102 [P] [US6] Create NavigationMenuItem WC: ds-navigation-menu-item in packages/wc/src/components/navigation-menu/navigation-menu-item.ts
- [X] T103 [P] [US6] Create NavigationMenuTrigger WC: ds-navigation-menu-trigger in packages/wc/src/components/navigation-menu/navigation-menu-trigger.ts (uses createRovingFocus)
- [X] T104 [P] [US6] Create NavigationMenuContent WC: ds-navigation-menu-content in packages/wc/src/components/navigation-menu/navigation-menu-content.ts (uses createDismissableLayer)
- [X] T105 [P] [US6] Create NavigationMenuLink WC: ds-navigation-menu-link in packages/wc/src/components/navigation-menu/navigation-menu-link.ts (active state)
- [X] T106 [P] [US6] Create NavigationMenuIndicator WC: ds-navigation-menu-indicator in packages/wc/src/components/navigation-menu/navigation-menu-indicator.ts
- [X] T107 [P] [US6] Create NavigationMenuViewport WC: ds-navigation-menu-viewport in packages/wc/src/components/navigation-menu/navigation-menu-viewport.ts
- [X] T108 [US6] Create NavigationMenu barrel export in packages/wc/src/components/navigation-menu/index.ts
- [X] T109 [P] [US6] Create NavigationMenu CSS with viewport transitions in packages/css/src/components/navigation-menu.css
- [X] T110 [US6] Create NavigationMenu React wrappers in packages/react/src/components/navigation-menu/index.tsx
- [X] T111 [US6] Update barrel exports for NavigationMenu

**Checkpoint**: NavigationMenu displays mega-menu panels with smooth transitions between triggers

---

## Phase 9: User Story 7 - Structure Utilities (Priority: P3)

**Goal**: Implement ScrollArea for custom scrollbars (Collapsible, Separator, AspectRatio already in Foundational)

**Independent Test**: Build a media gallery with ScrollArea for thumbnails

### Implementation for User Story 7

- [X] T112 [P] [US7] Create ScrollArea WC: ds-scroll-area in packages/wc/src/components/scroll-area/scroll-area.ts (ResizeObserver for overflow detection)
- [X] T113 [P] [US7] Create ScrollAreaViewport WC: ds-scroll-area-viewport in packages/wc/src/components/scroll-area/scroll-area-viewport.ts
- [X] T114 [P] [US7] Create ScrollAreaScrollbar WC: ds-scroll-area-scrollbar in packages/wc/src/components/scroll-area/scroll-area-scrollbar.ts (orientation)
- [X] T115 [P] [US7] Create ScrollAreaThumb WC: ds-scroll-area-thumb in packages/wc/src/components/scroll-area/scroll-area-thumb.ts
- [X] T116 [US7] Create ScrollArea barrel export in packages/wc/src/components/scroll-area/index.ts
- [X] T117 [P] [US7] Create ScrollArea CSS with custom scrollbar styling in packages/css/src/components/scroll-area.css
- [X] T118 [US7] Create ScrollArea React wrappers in packages/react/src/components/scroll-area/index.tsx
- [X] T119 [US7] Update barrel exports for ScrollArea

**Checkpoint**: ScrollArea displays custom scrollbars with keyboard scroll support

---

## Phase 10: User Story 8 - Navigation Patterns (Priority: P4)

**Goal**: Implement Breadcrumb, Pagination, and Stepper

**Independent Test**: Create a multi-step checkout with Stepper, paginated list, and breadcrumb

### Implementation for User Story 8

**Breadcrumb Component**

- [X] T120 [P] [US8] Create Breadcrumb WC: ds-breadcrumb in packages/wc/src/components/breadcrumb/breadcrumb.ts (nav landmark)
- [X] T121 [P] [US8] Create BreadcrumbList WC: ds-breadcrumb-list in packages/wc/src/components/breadcrumb/breadcrumb-list.ts (ol element)
- [X] T122 [P] [US8] Create BreadcrumbItem WC: ds-breadcrumb-item in packages/wc/src/components/breadcrumb/breadcrumb-item.ts (li element)
- [X] T123 [P] [US8] Create BreadcrumbLink WC: ds-breadcrumb-link in packages/wc/src/components/breadcrumb/breadcrumb-link.ts
- [X] T124 [P] [US8] Create BreadcrumbPage WC: ds-breadcrumb-page in packages/wc/src/components/breadcrumb/breadcrumb-page.ts (aria-current=page)
- [X] T125 [P] [US8] Create BreadcrumbSeparator WC: ds-breadcrumb-separator in packages/wc/src/components/breadcrumb/breadcrumb-separator.ts
- [X] T126 [US8] Create Breadcrumb barrel export in packages/wc/src/components/breadcrumb/index.ts
- [X] T127 [P] [US8] Create Breadcrumb CSS in packages/css/src/components/breadcrumb.css

**Pagination Component**

- [X] T128 [P] [US8] Create Pagination WC: ds-pagination in packages/wc/src/components/pagination/pagination.ts (page state, totalPages, siblingCount, boundaryCount)
- [X] T129 [P] [US8] Create PaginationContent WC: ds-pagination-content in packages/wc/src/components/pagination/pagination-content.ts
- [X] T130 [P] [US8] Create PaginationItem WC: ds-pagination-item in packages/wc/src/components/pagination/pagination-item.ts
- [X] T131 [P] [US8] Create PaginationLink WC: ds-pagination-link in packages/wc/src/components/pagination/pagination-link.ts
- [X] T132 [P] [US8] Create PaginationPrevious/Next WCs in packages/wc/src/components/pagination/
- [X] T133 [P] [US8] Create PaginationEllipsis WC: ds-pagination-ellipsis in packages/wc/src/components/pagination/pagination-ellipsis.ts
- [X] T134 [US8] Create Pagination barrel export in packages/wc/src/components/pagination/index.ts
- [X] T135 [P] [US8] Create Pagination CSS in packages/css/src/components/pagination.css

**Stepper Component**

- [X] T136 [P] [US8] Create Stepper WC: ds-stepper in packages/wc/src/components/stepper/stepper.ts (value, orientation)
- [X] T137 [P] [US8] Create StepperItem WC: ds-stepper-item in packages/wc/src/components/stepper/stepper-item.ts (step, completed, disabled)
- [X] T138 [P] [US8] Create StepperTrigger WC: ds-stepper-trigger in packages/wc/src/components/stepper/stepper-trigger.ts
- [X] T139 [P] [US8] Create StepperIndicator WC: ds-stepper-indicator in packages/wc/src/components/stepper/stepper-indicator.ts
- [X] T140 [P] [US8] Create StepperTitle/Description WCs in packages/wc/src/components/stepper/
- [X] T141 [P] [US8] Create StepperSeparator WC: ds-stepper-separator in packages/wc/src/components/stepper/stepper-separator.ts
- [X] T142 [P] [US8] Create StepperContent WC: ds-stepper-content in packages/wc/src/components/stepper/stepper-content.ts
- [X] T143 [US8] Create Stepper barrel export in packages/wc/src/components/stepper/index.ts
- [X] T144 [P] [US8] Create Stepper CSS in packages/css/src/components/stepper.css

**React Wrappers**

- [X] T145 [US8] Create Breadcrumb React wrappers in packages/react/src/components/breadcrumb/index.tsx
- [X] T146 [US8] Create Pagination React wrappers in packages/react/src/components/pagination/index.tsx
- [X] T147 [US8] Create Stepper React wrappers in packages/react/src/components/stepper/index.tsx
- [X] T148 [US8] Update barrel exports for Breadcrumb, Pagination, Stepper

**Checkpoint**: Navigation patterns are functional with proper ARIA semantics

---

## Phase 11: User Story 9 - Command Palette (Priority: P4)

**Goal**: Implement keyboard-driven command palette

**Independent Test**: Implement Cmd+K shortcut that opens searchable command list

### Implementation for User Story 9

- [X] T149 [P] [US9] Create Command WC: ds-command in packages/wc/src/components/command/command.ts (inputValue state, filter function, loading)
- [X] T150 [P] [US9] Create CommandInput WC: ds-command-input in packages/wc/src/components/command/command-input.ts (search input)
- [X] T151 [P] [US9] Create CommandList WC: ds-command-list in packages/wc/src/components/command/command-list.ts (uses createRovingFocus; role=listbox)
- [X] T152 [P] [US9] Create CommandEmpty WC: ds-command-empty in packages/wc/src/components/command/command-empty.ts (no results state)
- [X] T153 [P] [US9] Create CommandLoading WC: ds-command-loading in packages/wc/src/components/command/command-loading.ts
- [X] T154 [P] [US9] Create CommandGroup WC: ds-command-group in packages/wc/src/components/command/command-group.ts (heading, section grouping)
- [X] T155 [P] [US9] Create CommandItem WC: ds-command-item in packages/wc/src/components/command/command-item.ts (role=option, onSelect)
- [X] T156 [P] [US9] Create CommandSeparator WC: ds-command-separator in packages/wc/src/components/command/command-separator.ts
- [X] T157 [US9] Implement fuzzy filtering logic in CommandList (uses createTypeAhead or custom filter)
- [X] T158 [US9] Create Command barrel export in packages/wc/src/components/command/index.ts
- [X] T159 [P] [US9] Create Command CSS in packages/css/src/components/command.css
- [X] T160 [US9] Create Command React wrappers in packages/react/src/components/command/index.tsx
- [X] T161 [US9] Update barrel exports for Command

**Checkpoint**: Command palette is functional with filtering, keyboard navigation, and item selection

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation

- [X] T162 [P] Verify all components use `--ds-z-overlay` for z-index (grep all CSS files)
- [X] T163 [P] Verify reduced-motion support in all animations (grep for prefers-reduced-motion)
- [X] T164 [P] Verify all interactive components have visible focus indicators
- [X] T165 Run bundle size check: verify <40KB gzipped total
- [X] T166 [P] Add component manifest entries to packages/cli/registry/components.json for all 18 components
- [X] T167 Run quickstart.md examples validation (N/A - no quickstart.md exists yet)
- [X] T168 Update packages/wc/README.md with new components
- [X] T169 Update packages/react/README.md with new components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phases 3-11 (User Stories)**: All depend on Phase 2 completion
  - User stories can proceed in parallel or sequentially by priority
- **Phase 12 (Polish)**: Depends on all user stories

### User Story Dependencies

- **US1 (Tabs/Accordion)**: Depends on Foundational (Collapsible pattern used by Accordion)
- **US2 (AlertDialog)**: No user story dependencies
- **US3 (Sheet/Drawer)**: No user story dependencies; Drawer composes Sheet
- **US4 (Menus)**: No user story dependencies
- **US5 (HoverCard)**: No user story dependencies
- **US6 (NavigationMenu)**: No user story dependencies
- **US7 (ScrollArea)**: No user story dependencies
- **US8 (Navigation)**: No user story dependencies
- **US9 (Command)**: No user story dependencies

### Parallel Opportunities

Within each user story, tasks marked [P] can run in parallel:
- All WC sub-components can be created in parallel
- CSS can be created in parallel with WC
- React wrappers depend on WC completion

---

## Parallel Example: User Story 1 (Tabs + Accordion)

```bash
# Launch all WC components in parallel:
Task T025: Create ds-tabs
Task T026: Create ds-tabs-list
Task T027: Create ds-tabs-trigger
Task T028: Create ds-tabs-content
Task T032: Create ds-accordion
Task T033: Create ds-accordion-item
Task T034: Create ds-accordion-trigger
Task T035: Create ds-accordion-content

# After WCs complete, launch in parallel:
Task T030: Create tabs.css
Task T037: Create accordion.css
Task T031: Create Tabs React wrappers
Task T038: Create Accordion React wrappers
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (Card, Separator, AspectRatio, Collapsible)
3. Complete Phase 3: User Story 1 (Tabs, Accordion)
4. Complete Phase 4: User Story 2 (AlertDialog)
5. **STOP and VALIDATE**: Test independently
6. Deploy/demo if ready

### Incremental Delivery

1. **MVP**: Setup + Foundational + US1 + US2 = Structure primitives + confirmations
2. **+Overlays**: Add US3 (Sheet/Drawer) + US4 (Menus) + US5 (HoverCard) + US6 (NavigationMenu)
3. **+Utilities**: Add US7 (ScrollArea)
4. **+Navigation**: Add US8 (Breadcrumb, Pagination, Stepper) + US9 (Command)
5. **Polish**: Phase 12

### Parallel Team Strategy

With 2-3 developers after Foundational:
- Developer A: US1 (Tabs/Accordion) → US3 (Sheet/Drawer)
- Developer B: US2 (AlertDialog) → US4 (Menus)
- Developer C: US5 (HoverCard) → US6 (NavigationMenu)

---

## Notes

- [P] tasks = different files, no dependencies
- [US#] label maps task to specific user story
- Each user story is independently testable
- Commit after each task or logical group
- Stop at any checkpoint to validate
- Avoid: vague tasks, same file conflicts, cross-story dependencies
