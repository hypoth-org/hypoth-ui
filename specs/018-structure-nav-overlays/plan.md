# Implementation Plan: Structure, Navigation & Overlays

**Branch**: `018-structure-nav-overlays` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/018-structure-nav-overlays/spec.md`

## Summary

Implement 18 UI components organized into structure primitives (Card, Tabs, Accordion), confirmation dialogs (AlertDialog), overlay panels (Sheet, Drawer), menu systems (DropdownMenu, ContextMenu, HoverCard, NavigationMenu), utility components (Collapsible, Separator, AspectRatio, ScrollArea), and navigation patterns (Breadcrumb, Pagination, Stepper, Command). All components use the compound component pattern with shared primitives from `@ds/primitives-dom`, targeting both Web Components (Lit) and React implementations with API parity.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (WC), React 18+ (adapter peer dependency), `@ds/primitives-dom` (focus-trap, dismissable-layer, roving-focus, type-ahead)
**Storage**: N/A (stateless UI components)
**Testing**: Vitest (unit), axe-core (a11y), Playwright (e2e)
**Target Platform**: Browser (modern evergreen), SSR/RSC compatible via Next.js App Router
**Project Type**: Monorepo packages (`@ds/wc`, `@ds/react`)
**Performance Goals**: <40KB gzipped total for all new components; animations <300ms
**Constraints**: Light DOM only; no Shadow DOM; CSS custom properties for theming; `--ds-z-overlay` for z-index management
**Scale/Scope**: 18 components, ~53 functional requirements, 4 priority tiers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; minimal client boundaries; SSR-friendly (Light DOM + CSS vars)
- [x] **Accessibility**: WCAG 2.1 AA plan; APG patterns identified (tabs, accordion, menu, dialog, listbox); a11y testing via axe-core + manual checklist
- [x] **Customizability**: Uses DTCG tokens; CSS layers for overrides; `--ds-z-overlay` custom property for z-index
- [x] **Zero-dep Core**: Core packages remain zero-dep; `@ds/wc` depends only on Lit
- [x] **Web Components**: Light DOM default; Lit-based; theme via CSS vars
- [x] **Dependency Management**: pnpm used; bundle impact assessed (<40KB target)

## Project Structure

### Documentation (this feature)

```text
specs/018-structure-nav-overlays/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (component API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/
├── primitives-dom/
│   └── src/
│       ├── focus-trap/          # Existing - used by overlays
│       ├── dismissable-layer/   # Existing - used by overlays
│       ├── roving-focus/        # Existing - used by menus/tabs
│       └── type-ahead/          # Existing - used by menus/command
│
├── wc/
│   └── src/
│       ├── components/
│       │   ├── card/            # NEW: Card, CardHeader, CardContent, CardFooter
│       │   ├── tabs/            # NEW: Tabs, TabsList, TabsTrigger, TabsContent
│       │   ├── accordion/       # NEW: Accordion, AccordionItem, AccordionTrigger, AccordionContent
│       │   ├── alert-dialog/    # NEW: AlertDialog, AlertDialogTrigger, AlertDialogContent, etc.
│       │   ├── sheet/           # NEW: Sheet, SheetTrigger, SheetContent, SheetOverlay
│       │   ├── drawer/          # NEW: Drawer (composes Sheet with mobile enhancements)
│       │   ├── dropdown-menu/   # NEW: DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, etc.
│       │   ├── context-menu/    # NEW: ContextMenu, ContextMenuTrigger, ContextMenuContent
│       │   ├── hover-card/      # NEW: HoverCard, HoverCardTrigger, HoverCardContent
│       │   ├── navigation-menu/ # NEW: NavigationMenu, NavigationMenuList, NavigationMenuItem, etc.
│       │   ├── collapsible/     # NEW: Collapsible, CollapsibleTrigger, CollapsibleContent
│       │   ├── separator/       # NEW: Separator
│       │   ├── aspect-ratio/    # NEW: AspectRatio
│       │   ├── scroll-area/     # NEW: ScrollArea, ScrollAreaViewport, ScrollAreaScrollbar
│       │   ├── breadcrumb/      # NEW: Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink
│       │   ├── pagination/      # NEW: Pagination, PaginationContent, PaginationItem, etc.
│       │   ├── stepper/         # NEW: Stepper, StepperItem, StepperTrigger, StepperContent
│       │   └── command/         # NEW: Command, CommandInput, CommandList, CommandGroup, CommandItem
│       └── index.ts             # Barrel exports
│
├── react/
│   └── src/
│       └── components/
│           ├── card/            # React wrappers for Card components
│           ├── tabs/            # React wrappers for Tabs components
│           ├── accordion/       # React wrappers for Accordion components
│           ├── alert-dialog/    # React wrappers for AlertDialog components
│           ├── sheet/           # React wrappers for Sheet components
│           ├── drawer/          # React wrappers for Drawer components
│           ├── dropdown-menu/   # React wrappers for DropdownMenu components
│           ├── context-menu/    # React wrappers for ContextMenu components
│           ├── hover-card/      # React wrappers for HoverCard components
│           ├── navigation-menu/ # React wrappers for NavigationMenu components
│           ├── collapsible/     # React wrappers for Collapsible components
│           ├── separator/       # React wrappers for Separator components
│           ├── aspect-ratio/    # React wrappers for AspectRatio components
│           ├── scroll-area/     # React wrappers for ScrollArea components
│           ├── breadcrumb/      # React wrappers for Breadcrumb components
│           ├── pagination/      # React wrappers for Pagination components
│           ├── stepper/         # React wrappers for Stepper components
│           └── command/         # React wrappers for Command components
│
└── css/
    └── src/
        └── components/
            ├── card.css
            ├── tabs.css
            ├── accordion.css
            ├── alert-dialog.css
            ├── sheet.css
            ├── drawer.css
            ├── dropdown-menu.css
            ├── context-menu.css
            ├── hover-card.css
            ├── navigation-menu.css
            ├── collapsible.css
            ├── separator.css
            ├── aspect-ratio.css
            ├── scroll-area.css
            ├── breadcrumb.css
            ├── pagination.css
            ├── stepper.css
            └── command.css
```

**Structure Decision**: Monorepo with separate packages for Web Components (`@ds/wc`), React adapters (`@ds/react`), and CSS (`@ds/css`). Each component follows compound component pattern with Root/Trigger/Content sub-components. Drawer composes Sheet internally per clarification decision.

## Complexity Tracking

No constitution violations identified. All requirements align with established patterns.

| Aspect | Status | Notes |
|--------|--------|-------|
| Light DOM | Compliant | All components use Light DOM per constitution |
| Zero-dep Core | Compliant | `@ds/wc` depends only on Lit; no new runtime deps |
| Bundle Size | Target: <40KB | Must verify during implementation |
| A11y Patterns | Identified | tabs, accordion, menu, dialog, listbox APG patterns |
