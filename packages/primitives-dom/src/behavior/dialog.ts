/**
 * Dialog behavior primitive.
 * Provides state management, ARIA computation, focus management, and keyboard handling for dialogs.
 *
 * Uses createOverlayBehavior internally for common overlay functionality.
 */

import type { DismissReason } from "../layer/dismissable-layer.js";
import {
  type OverlayBehavior,
  createOverlayBehavior,
} from "../overlay/create-overlay-behavior.js";

// =============================================================================
// Types
// =============================================================================

export type DialogRole = "dialog" | "alertdialog";

export interface DialogBehaviorOptions {
  /** Initial open state */
  defaultOpen?: boolean;
  /** Dialog role */
  role?: DialogRole;
  /** Whether Escape closes dialog */
  closeOnEscape?: boolean;
  /** Whether clicking outside closes dialog */
  closeOnOutsideClick?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Custom ID generator */
  generateId?: () => string;
}

export interface DialogBehaviorState {
  open: boolean;
  role: DialogRole;
}

export interface DialogBehaviorContext {
  triggerId: string;
  contentId: string;
  titleId: string;
  descriptionId: string | null;
  triggerElement: HTMLElement | null;
}

export type DialogEvent =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "DISMISS"; reason: DismissReason };

export interface DialogTriggerProps {
  id: string;
  "aria-haspopup": "dialog";
  "aria-expanded": "true" | "false";
  "aria-controls": string;
}

export interface DialogContentProps {
  id: string;
  role: DialogRole;
  "aria-modal": "true";
  "aria-labelledby": string;
  "aria-describedby": string | undefined;
  tabIndex: -1;
}

export interface DialogTitleProps {
  id: string;
}

export interface DialogDescriptionProps {
  id: string;
}

export interface DialogBehavior {
  /** Current state */
  readonly state: DialogBehaviorState;
  /** Internal context (IDs, refs) */
  readonly context: DialogBehaviorContext;
  /** Send event to state machine */
  send(event: DialogEvent): void;
  /** Open dialog */
  open(): void;
  /** Close dialog */
  close(): void;
  /** Get props for trigger element */
  getTriggerProps(): DialogTriggerProps;
  /** Get props for content element */
  getContentProps(): DialogContentProps;
  /** Get props for title element */
  getTitleProps(): DialogTitleProps;
  /** Get props for description element */
  getDescriptionProps(): DialogDescriptionProps;
  /** Set trigger element reference (call when trigger mounts) */
  setTriggerElement(element: HTMLElement | null): void;
  /** Set content element and activate focus management (call when content mounts while open) */
  setContentElement(element: HTMLElement | null): void;
  /** Set whether description is present */
  setHasDescription(hasDescription: boolean): void;
  /** Cleanup resources */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

let idCounter = 0;

function defaultGenerateId(): string {
  return `dialog-${++idCounter}`;
}

/**
 * Creates a dialog behavior primitive.
 *
 * Uses createOverlayBehavior internally for common overlay functionality
 * (open/close state, focus trap, dismissal handling).
 *
 * @example
 * ```ts
 * const dialog = createDialogBehavior({
 *   onOpenChange: (open) => console.log("open:", open),
 * });
 *
 * // Set trigger element
 * dialog.setTriggerElement(triggerButton);
 *
 * // Apply trigger props
 * const triggerProps = dialog.getTriggerProps();
 * triggerButton.setAttribute("aria-haspopup", triggerProps["aria-haspopup"]);
 * triggerButton.setAttribute("aria-expanded", triggerProps["aria-expanded"]);
 *
 * // When opening, set content element
 * dialog.open();
 * dialog.setContentElement(dialogContent);
 *
 * // Apply content props
 * const contentProps = dialog.getContentProps();
 * dialogContent.setAttribute("role", contentProps.role);
 * dialogContent.setAttribute("aria-modal", contentProps["aria-modal"]);
 * ```
 */
export function createDialogBehavior(options: DialogBehaviorOptions = {}): DialogBehavior {
  const {
    defaultOpen = false,
    role = "dialog",
    closeOnEscape = true,
    closeOnOutsideClick = true,
    onOpenChange,
    generateId = defaultGenerateId,
  } = options;

  // Generate stable IDs
  const baseId = generateId();
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;

  // Create overlay behavior for common functionality
  const overlay: OverlayBehavior = createOverlayBehavior({
    defaultOpen,
    modal: true, // Dialogs are always modal
    closeOnEscape,
    closeOnOutsideClick,
    returnFocusOnClose: true,
    onOpenChange,
    generateId: () => baseId,
  });

  // Dialog-specific state (role, description tracking)
  let dialogRole: DialogRole = role;
  let hasDescription = false;

  // Context for dialog-specific IDs
  let context: DialogBehaviorContext = {
    triggerId,
    contentId,
    titleId,
    descriptionId: null,
    triggerElement: null,
  };

  function send(event: DialogEvent): void {
    switch (event.type) {
      case "OPEN":
        overlay.open();
        break;
      case "CLOSE":
        overlay.close();
        break;
      case "DISMISS":
        overlay.close();
        break;
    }
  }

  function getTriggerProps(): DialogTriggerProps {
    const overlayProps = overlay.getTriggerProps();
    return {
      id: triggerId,
      "aria-haspopup": "dialog",
      "aria-expanded": overlayProps["aria-expanded"],
      "aria-controls": contentId,
    };
  }

  function getContentProps(): DialogContentProps {
    return {
      id: contentId,
      role: dialogRole,
      "aria-modal": "true",
      "aria-labelledby": titleId,
      "aria-describedby": hasDescription ? descriptionId : undefined,
      tabIndex: -1,
    };
  }

  function getTitleProps(): DialogTitleProps {
    return {
      id: titleId,
    };
  }

  function getDescriptionProps(): DialogDescriptionProps {
    return {
      id: descriptionId,
    };
  }

  function setTriggerElement(element: HTMLElement | null): void {
    context = { ...context, triggerElement: element };
    overlay.setTriggerElement(element);
  }

  function setContentElement(element: HTMLElement | null): void {
    overlay.setContentElement(element);
  }

  function setHasDescription(has: boolean): void {
    hasDescription = has;
    context = {
      ...context,
      descriptionId: has ? descriptionId : null,
    };
  }

  function destroy(): void {
    overlay.destroy();
  }

  return {
    get state(): DialogBehaviorState {
      return {
        open: overlay.state.open,
        role: dialogRole,
      };
    },
    get context() {
      return context;
    },
    send,
    open: () => overlay.open(),
    close: () => overlay.close(),
    getTriggerProps,
    getContentProps,
    getTitleProps,
    getDescriptionProps,
    setTriggerElement,
    setContentElement,
    setHasDescription,
    destroy,
  };
}
