/**
 * React Components Contracts
 *
 * These interfaces define the API for native React components in @ds/react.
 * Components use compound patterns and consume behavior primitives from @ds/primitives-dom.
 */

import type { ReactNode, HTMLAttributes, RefObject, ForwardRefExoticComponent, RefAttributes } from 'react';

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Props for components that support asChild pattern.
 * When asChild is true, the component renders its child and merges props onto it.
 */
export type AsChildProps<DefaultProps> =
  | ({ asChild?: false } & DefaultProps)
  | { asChild: true; children: ReactNode };

/**
 * Slot props for polymorphic rendering.
 */
export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

// =============================================================================
// Button
// =============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size */
  size?: ButtonSize;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Button content */
  children?: ReactNode;
}

export type ButtonComponent = ForwardRefExoticComponent<
  ButtonProps & RefAttributes<HTMLButtonElement>
>;

// =============================================================================
// Dialog
// =============================================================================

export type DialogRole = 'dialog' | 'alertdialog';

export interface DialogRootProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Callback when open changes */
  onOpenChange?: (open: boolean) => void;
  /** Dialog role */
  role?: DialogRole;
  /** Whether Escape closes dialog */
  closeOnEscape?: boolean;
  /** Whether clicking outside closes dialog */
  closeOnOutsideClick?: boolean;
  /** Dialog parts */
  children: ReactNode;
}

export interface DialogTriggerProps extends AsChildProps<HTMLAttributes<HTMLButtonElement>> {
  /** Trigger content */
  children: ReactNode;
}

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Content size */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /** Portal container (default: document.body) */
  container?: HTMLElement | null;
  /** Focus first focusable on open */
  autoFocus?: boolean;
  /** Content children */
  children: ReactNode;
}

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Title content */
  children: ReactNode;
}

export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Description content */
  children: ReactNode;
}

export interface DialogCloseProps extends AsChildProps<HTMLAttributes<HTMLButtonElement>> {
  /** Close button content */
  children: ReactNode;
}

/**
 * Dialog compound component structure.
 *
 * @example
 * ```tsx
 * <Dialog.Root open={open} onOpenChange={setOpen}>
 *   <Dialog.Trigger asChild>
 *     <button>Open</button>
 *   </Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Title>Title</Dialog.Title>
 *     <Dialog.Description>Description</Dialog.Description>
 *     <Dialog.Close asChild>
 *       <button>Close</button>
 *     </Dialog.Close>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 */
export interface DialogCompound {
  Root: (props: DialogRootProps) => ReactNode;
  Trigger: ForwardRefExoticComponent<DialogTriggerProps & RefAttributes<HTMLButtonElement>>;
  Content: ForwardRefExoticComponent<DialogContentProps & RefAttributes<HTMLDivElement>>;
  Title: ForwardRefExoticComponent<DialogTitleProps & RefAttributes<HTMLHeadingElement>>;
  Description: ForwardRefExoticComponent<DialogDescriptionProps & RefAttributes<HTMLParagraphElement>>;
  Close: ForwardRefExoticComponent<DialogCloseProps & RefAttributes<HTMLButtonElement>>;
}

// =============================================================================
// Menu
// =============================================================================

export type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

export interface MenuRootProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Callback when open changes */
  onOpenChange?: (open: boolean) => void;
  /** Menu parts */
  children: ReactNode;
}

export interface MenuTriggerProps extends AsChildProps<HTMLAttributes<HTMLButtonElement>> {
  /** Trigger content */
  children: ReactNode;
}

export interface MenuContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Placement relative to trigger */
  placement?: Placement;
  /** Offset from trigger in pixels */
  offset?: number;
  /** Portal container (default: document.body) */
  container?: HTMLElement | null;
  /** Content children */
  children: ReactNode;
}

export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Item value for selection */
  value?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Callback when item is selected */
  onSelect?: () => void;
  /** Item content */
  children: ReactNode;
}

export interface MenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export interface MenuLabelProps extends HTMLAttributes<HTMLDivElement> {
  /** Label content */
  children: ReactNode;
}

/**
 * Menu compound component structure.
 *
 * @example
 * ```tsx
 * <Menu.Root>
 *   <Menu.Trigger asChild>
 *     <button>Actions</button>
 *   </Menu.Trigger>
 *   <Menu.Content>
 *     <Menu.Label>Actions</Menu.Label>
 *     <Menu.Item value="edit" onSelect={handleEdit}>Edit</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item value="delete" onSelect={handleDelete}>Delete</Menu.Item>
 *   </Menu.Content>
 * </Menu.Root>
 * ```
 */
export interface MenuCompound {
  Root: (props: MenuRootProps) => ReactNode;
  Trigger: ForwardRefExoticComponent<MenuTriggerProps & RefAttributes<HTMLButtonElement>>;
  Content: ForwardRefExoticComponent<MenuContentProps & RefAttributes<HTMLDivElement>>;
  Item: ForwardRefExoticComponent<MenuItemProps & RefAttributes<HTMLDivElement>>;
  Separator: ForwardRefExoticComponent<MenuSeparatorProps & RefAttributes<HTMLDivElement>>;
  Label: ForwardRefExoticComponent<MenuLabelProps & RefAttributes<HTMLDivElement>>;
}

// =============================================================================
// Context Types (Internal)
// =============================================================================

/**
 * Dialog context value shared between compound components.
 */
export interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  titleId: string;
  descriptionId: string;
  triggerRef: RefObject<HTMLButtonElement>;
  contentRef: RefObject<HTMLDivElement>;
}

/**
 * Menu context value shared between compound components.
 */
export interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerId: string;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  registerItem: (element: HTMLElement) => () => void;
  onSelect: (value: string) => void;
}

// =============================================================================
// Export Map
// =============================================================================

/**
 * Expected exports from @ds/react after implementation:
 *
 * // Components
 * export { Button, type ButtonProps } from './components/button';
 * export { Dialog, type DialogRootProps, type DialogTriggerProps, ... } from './components/dialog';
 * export { Menu, type MenuRootProps, type MenuTriggerProps, ... } from './components/menu';
 *
 * // Utilities
 * export { Slot, type SlotProps } from './primitives/slot';
 * export { createCompoundContext } from './utils/create-context';
 */
