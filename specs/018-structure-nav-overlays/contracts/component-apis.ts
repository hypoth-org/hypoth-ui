/**
 * Component API Contracts: Structure, Navigation & Overlays
 *
 * This file defines the TypeScript interfaces for all component props.
 * These serve as the contract between spec and implementation.
 */

// =============================================================================
// Common Types
// =============================================================================

export type Orientation = "horizontal" | "vertical";
export type Side = "left" | "right" | "top" | "bottom";
export type Align = "start" | "center" | "end";

// =============================================================================
// Card
// =============================================================================

export interface CardProps {
  /** Additional CSS class */
  className?: string;
}

export interface CardHeaderProps {
  className?: string;
}

export interface CardContentProps {
  className?: string;
}

export interface CardFooterProps {
  className?: string;
}

// =============================================================================
// Tabs
// =============================================================================

export interface TabsProps {
  /** Controlled value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Keyboard navigation orientation */
  orientation?: Orientation;
  /**
   * Activation mode:
   * - automatic: selection follows focus
   * - manual: selection requires Enter/Space
   */
  activationMode?: "automatic" | "manual";
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  className?: string;
}

export interface TabsListProps {
  /** Loop focus at ends */
  loop?: boolean;
  className?: string;
}

export interface TabsTriggerProps {
  /** Unique value identifying this tab */
  value: string;
  /** Disable this tab */
  disabled?: boolean;
  className?: string;
}

export interface TabsContentProps {
  /** Value of associated tab */
  value: string;
  /** Keep mounted when inactive (for animations) */
  forceMount?: boolean;
  className?: string;
}

// =============================================================================
// Accordion
// =============================================================================

export interface AccordionSingleProps {
  type: "single";
  /** Controlled value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Allow collapsing all items */
  collapsible?: boolean;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
}

export interface AccordionMultipleProps {
  type: "multiple";
  /** Controlled value */
  value?: string[];
  /** Default value (uncontrolled) */
  defaultValue?: string[];
  /** Callback when value changes */
  onValueChange?: (value: string[]) => void;
}

export type AccordionProps = (AccordionSingleProps | AccordionMultipleProps) & {
  orientation?: Orientation;
  className?: string;
};

export interface AccordionItemProps {
  /** Unique value identifying this item */
  value: string;
  /** Disable this item */
  disabled?: boolean;
  className?: string;
}

export interface AccordionTriggerProps {
  className?: string;
}

export interface AccordionContentProps {
  /** Keep mounted when collapsed (for animations) */
  forceMount?: boolean;
  className?: string;
}

// =============================================================================
// AlertDialog
// =============================================================================

export interface AlertDialogProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

export interface AlertDialogTriggerProps {
  /** Render as child element */
  asChild?: boolean;
  className?: string;
}

export interface AlertDialogContentProps {
  /** Called when escape pressed or outside click */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /** Called after open animation completes */
  onOpenAutoFocus?: (event: Event) => void;
  /** Called after close animation completes */
  onCloseAutoFocus?: (event: Event) => void;
  /** Keep mounted when closed (for animations) */
  forceMount?: boolean;
  className?: string;
}

export interface AlertDialogTitleProps {
  className?: string;
}

export interface AlertDialogDescriptionProps {
  className?: string;
}

export interface AlertDialogActionProps {
  /** Render as child element */
  asChild?: boolean;
  className?: string;
}

export interface AlertDialogCancelProps {
  /** Render as child element */
  asChild?: boolean;
  className?: string;
}

// =============================================================================
// Sheet
// =============================================================================

export interface SheetProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

export interface SheetTriggerProps {
  asChild?: boolean;
  className?: string;
}

export interface SheetContentProps {
  /** Side from which sheet slides in */
  side?: Side;
  /** Called when escape pressed */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /** Called when clicking outside */
  onPointerDownOutside?: (event: PointerEvent) => void;
  /** Called when interacting outside */
  onInteractOutside?: (event: Event) => void;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  forceMount?: boolean;
  className?: string;
}

export interface SheetCloseProps {
  asChild?: boolean;
  className?: string;
}

// =============================================================================
// Drawer
// =============================================================================

export interface DrawerProps extends SheetProps {
  /** Snap points as fractions (0-1) */
  snapPoints?: number[];
  /** Initial snap point */
  defaultSnapPoint?: number;
  /** Controlled snap point */
  snapPoint?: number;
  /** Callback when snap point changes */
  onSnapPointChange?: (snapPoint: number) => void;
  /** Enable swipe to dismiss */
  dismissible?: boolean;
}

export interface DrawerContentProps extends Omit<SheetContentProps, "side"> {
  /** Drawer always slides from bottom on mobile */
  side?: "bottom" | "left" | "right";
}

// =============================================================================
// DropdownMenu / ContextMenu (shared menu types)
// =============================================================================

export interface MenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface MenuTriggerProps {
  asChild?: boolean;
  className?: string;
}

export interface MenuContentProps {
  /** Side to position relative to trigger */
  side?: Side;
  /** Alignment along side axis */
  align?: Align;
  /** Offset from trigger */
  sideOffset?: number;
  alignOffset?: number;
  /** Collision boundary */
  collisionBoundary?: Element | Element[];
  /** Collision padding */
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  /** Loop focus */
  loop?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  forceMount?: boolean;
  className?: string;
}

export interface MenuItemProps {
  /** Disable item */
  disabled?: boolean;
  /** Callback when selected */
  onSelect?: (event: Event) => void;
  /** Prevent closing on select */
  closeOnSelect?: boolean;
  className?: string;
}

export interface MenuCheckboxItemProps extends MenuItemProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface MenuRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export interface MenuRadioItemProps extends MenuItemProps {
  value: string;
}

export interface MenuSubProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface MenuSubTriggerProps {
  disabled?: boolean;
  className?: string;
}

export interface MenuSubContentProps extends Omit<MenuContentProps, "side" | "align"> {}

// DropdownMenu uses Menu* types
export type DropdownMenuProps = MenuProps;
export type DropdownMenuTriggerProps = MenuTriggerProps;
export type DropdownMenuContentProps = MenuContentProps;
export type DropdownMenuItemProps = MenuItemProps;
export type DropdownMenuCheckboxItemProps = MenuCheckboxItemProps;
export type DropdownMenuRadioGroupProps = MenuRadioGroupProps;
export type DropdownMenuRadioItemProps = MenuRadioItemProps;
export type DropdownMenuSubProps = MenuSubProps;
export type DropdownMenuSubTriggerProps = MenuSubTriggerProps;
export type DropdownMenuSubContentProps = MenuSubContentProps;

// ContextMenu uses Menu* types but trigger is different
export type ContextMenuProps = MenuProps;
export interface ContextMenuTriggerProps {
  /** Disable context menu */
  disabled?: boolean;
  className?: string;
}
export type ContextMenuContentProps = MenuContentProps;
export type ContextMenuItemProps = MenuItemProps;
export type ContextMenuCheckboxItemProps = MenuCheckboxItemProps;
export type ContextMenuRadioGroupProps = MenuRadioGroupProps;
export type ContextMenuRadioItemProps = MenuRadioItemProps;
export type ContextMenuSubProps = MenuSubProps;
export type ContextMenuSubTriggerProps = MenuSubTriggerProps;
export type ContextMenuSubContentProps = MenuSubContentProps;

// =============================================================================
// HoverCard
// =============================================================================

export interface HoverCardProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Delay before opening (ms) */
  openDelay?: number;
  /** Delay before closing (ms) */
  closeDelay?: number;
}

export interface HoverCardTriggerProps {
  asChild?: boolean;
  className?: string;
}

export interface HoverCardContentProps {
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  collisionBoundary?: Element | Element[];
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  forceMount?: boolean;
  className?: string;
}

// =============================================================================
// NavigationMenu
// =============================================================================

export interface NavigationMenuProps {
  /** Controlled value of active menu */
  value?: string;
  /** Default value */
  defaultValue?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Delay before opening submenu (ms) */
  delayDuration?: number;
  /** Delay before closing when leaving trigger area (ms) */
  skipDelayDuration?: number;
  orientation?: Orientation;
  className?: string;
}

export interface NavigationMenuListProps {
  className?: string;
}

export interface NavigationMenuItemProps {
  /** Unique value identifying this item */
  value?: string;
  className?: string;
}

export interface NavigationMenuTriggerProps {
  className?: string;
}

export interface NavigationMenuContentProps {
  forceMount?: boolean;
  className?: string;
}

export interface NavigationMenuLinkProps {
  /** Whether this is the current page */
  active?: boolean;
  /** Callback on select */
  onSelect?: (event: Event) => void;
  asChild?: boolean;
  className?: string;
}

export interface NavigationMenuIndicatorProps {
  forceMount?: boolean;
  className?: string;
}

export interface NavigationMenuViewportProps {
  forceMount?: boolean;
  className?: string;
}

// =============================================================================
// Collapsible
// =============================================================================

export interface CollapsibleProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export interface CollapsibleTriggerProps {
  asChild?: boolean;
  className?: string;
}

export interface CollapsibleContentProps {
  forceMount?: boolean;
  className?: string;
}

// =============================================================================
// Separator
// =============================================================================

export interface SeparatorProps {
  /** Visual orientation */
  orientation?: Orientation;
  /** Whether purely decorative (no role) */
  decorative?: boolean;
  className?: string;
}

// =============================================================================
// AspectRatio
// =============================================================================

export interface AspectRatioProps {
  /** Ratio as width/height (e.g., 16/9) */
  ratio?: number;
  className?: string;
}

// =============================================================================
// ScrollArea
// =============================================================================

export interface ScrollAreaProps {
  /** Scrollbar visibility */
  type?: "auto" | "always" | "scroll" | "hover";
  /** Scroll direction */
  scrollHideDelay?: number;
  className?: string;
}

export interface ScrollAreaViewportProps {
  className?: string;
}

export interface ScrollAreaScrollbarProps {
  orientation?: Orientation;
  forceMount?: boolean;
  className?: string;
}

export interface ScrollAreaThumbProps {
  className?: string;
}

// =============================================================================
// Breadcrumb
// =============================================================================

export interface BreadcrumbProps {
  className?: string;
}

export interface BreadcrumbListProps {
  className?: string;
}

export interface BreadcrumbItemProps {
  className?: string;
}

export interface BreadcrumbLinkProps {
  asChild?: boolean;
  className?: string;
}

export interface BreadcrumbPageProps {
  className?: string;
}

export interface BreadcrumbSeparatorProps {
  className?: string;
}

// =============================================================================
// Pagination
// =============================================================================

export interface PaginationProps {
  /** Current page (1-indexed) */
  page?: number;
  /** Default page */
  defaultPage?: number;
  /** Total number of pages */
  totalPages: number;
  /** Pages shown around current */
  siblingCount?: number;
  /** Pages shown at boundaries */
  boundaryCount?: number;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  className?: string;
}

export interface PaginationContentProps {
  className?: string;
}

export interface PaginationItemProps {
  className?: string;
}

export interface PaginationLinkProps {
  /** Page number this link navigates to */
  page: number;
  /** Whether this is the current page */
  isActive?: boolean;
  asChild?: boolean;
  className?: string;
}

export interface PaginationPreviousProps {
  asChild?: boolean;
  className?: string;
}

export interface PaginationNextProps {
  asChild?: boolean;
  className?: string;
}

export interface PaginationEllipsisProps {
  className?: string;
}

// =============================================================================
// Stepper
// =============================================================================

export interface StepperProps {
  /** Current step (0-indexed) */
  value?: number;
  /** Default step */
  defaultValue?: number;
  /** Callback when step changes */
  onValueChange?: (value: number) => void;
  orientation?: Orientation;
  className?: string;
}

export interface StepperItemProps {
  /** Step index (0-indexed) */
  step: number;
  /** Whether step is completed */
  completed?: boolean;
  /** Whether step is disabled */
  disabled?: boolean;
  className?: string;
}

export interface StepperTriggerProps {
  asChild?: boolean;
  className?: string;
}

export interface StepperIndicatorProps {
  className?: string;
}

export interface StepperTitleProps {
  className?: string;
}

export interface StepperDescriptionProps {
  className?: string;
}

export interface StepperSeparatorProps {
  className?: string;
}

export interface StepperContentProps {
  /** Keep mounted when inactive */
  forceMount?: boolean;
  className?: string;
}

// =============================================================================
// Command
// =============================================================================

export interface CommandProps {
  /** Controlled input value */
  inputValue?: string;
  /** Default input value */
  defaultInputValue?: string;
  /** Callback when input changes */
  onInputValueChange?: (value: string) => void;
  /** Custom filter function */
  filter?: (value: string, search: string) => number;
  /** Loop focus */
  loop?: boolean;
  /** Loading state */
  loading?: boolean;
  className?: string;
}

export interface CommandInputProps {
  /** Placeholder text */
  placeholder?: string;
  className?: string;
}

export interface CommandListProps {
  className?: string;
}

export interface CommandEmptyProps {
  className?: string;
}

export interface CommandLoadingProps {
  className?: string;
}

export interface CommandGroupProps {
  /** Group heading */
  heading?: string;
  className?: string;
}

export interface CommandItemProps {
  /** Unique value */
  value?: string;
  /** Disable item */
  disabled?: boolean;
  /** Callback when selected */
  onSelect?: (value: string) => void;
  className?: string;
}

export interface CommandSeparatorProps {
  className?: string;
}
