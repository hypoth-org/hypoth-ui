/**
 * Toast Controller
 *
 * Manages toast queue, lifecycle, and provides imperative API
 * for showing and dismissing toasts.
 */

export type ToastVariant = "info" | "success" | "warning" | "error";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastState = "entering" | "visible" | "exiting" | "dismissed";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** Toast title (required) */
  title: string;
  /** Optional description */
  description?: string;
  /** Visual variant */
  variant?: ToastVariant;
  /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
  duration?: number;
  /** Optional action button */
  action?: ToastAction;
}

export interface ToastData extends ToastOptions {
  /** Unique toast ID */
  id: string;
  /** Current lifecycle state */
  state: ToastState;
  /** Timestamp when created */
  createdAt: number;
  /** Timer ID for auto-dismiss */
  timerId?: ReturnType<typeof setTimeout>;
}

export interface ToastControllerOptions {
  /** Maximum simultaneous toasts */
  maxToasts?: number;
  /** Default duration in ms */
  defaultDuration?: number;
  /** Toast position */
  position?: ToastPosition;
  /** Callback when toast list changes */
  onUpdate?: (toasts: ToastData[]) => void;
}

let toastIdCounter = 0;

function generateId(): string {
  return `toast-${++toastIdCounter}-${Date.now()}`;
}

/**
 * ToastController manages the toast queue and lifecycle.
 *
 * @example
 * ```typescript
 * const controller = new ToastController({
 *   maxToasts: 5,
 *   defaultDuration: 5000,
 *   onUpdate: (toasts) => renderToasts(toasts),
 * });
 *
 * // Show a toast
 * const id = controller.show({ title: "Saved!", variant: "success" });
 *
 * // Dismiss a specific toast
 * controller.dismiss(id);
 *
 * // Dismiss all toasts
 * controller.dismissAll();
 * ```
 */
export class ToastController {
  private toasts: ToastData[] = [];
  private options: Required<ToastControllerOptions>;

  constructor(options: ToastControllerOptions = {}) {
    this.options = {
      maxToasts: options.maxToasts ?? 5,
      defaultDuration: options.defaultDuration ?? 5000,
      position: options.position ?? "top-right",
      onUpdate: options.onUpdate ?? (() => {}),
    };
  }

  /**
   * Show a new toast
   */
  show(options: ToastOptions): string {
    const id = generateId();
    const duration = options.duration ?? this.options.defaultDuration;

    const toast: ToastData = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant ?? "info",
      duration,
      action: options.action,
      state: "entering",
      createdAt: Date.now(),
    };

    // Add to queue
    this.toasts = [toast, ...this.toasts];

    // Trim to max
    if (this.toasts.length > this.options.maxToasts) {
      const toRemove = this.toasts.slice(this.options.maxToasts);
      for (const t of toRemove) {
        this.dismiss(t.id);
      }
      this.toasts = this.toasts.slice(0, this.options.maxToasts);
    }

    // Transition to visible after animation
    setTimeout(() => {
      this.updateState(id, "visible");
    }, 200);

    // Set up auto-dismiss
    if (duration > 0) {
      toast.timerId = setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    this.notify();
    return id;
  }

  /**
   * Dismiss a toast by ID
   */
  dismiss(id: string): void {
    const toast = this.toasts.find((t) => t.id === id);
    if (!toast || toast.state === "exiting" || toast.state === "dismissed") {
      return;
    }

    // Clear auto-dismiss timer
    if (toast.timerId) {
      clearTimeout(toast.timerId);
    }

    // Start exit animation
    this.updateState(id, "exiting");

    // Remove after animation
    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== id);
      this.notify();
    }, 150);
  }

  /**
   * Dismiss all toasts
   */
  dismissAll(): void {
    const ids = this.toasts.map((t) => t.id);
    for (const id of ids) {
      this.dismiss(id);
    }
  }

  /**
   * Pause auto-dismiss for a toast (e.g., on hover)
   */
  pause(id: string): void {
    const toast = this.toasts.find((t) => t.id === id);
    if (toast?.timerId) {
      clearTimeout(toast.timerId);
      toast.timerId = undefined;
    }
  }

  /**
   * Resume auto-dismiss for a toast
   */
  resume(id: string): void {
    const toast = this.toasts.find((t) => t.id === id);
    if (toast?.duration && toast.duration > 0 && toast.state === "visible") {
      // Calculate remaining time based on elapsed time
      const elapsed = Date.now() - toast.createdAt;
      const remaining = Math.max(toast.duration - elapsed, 1000);

      toast.timerId = setTimeout(() => {
        this.dismiss(id);
      }, remaining);
    }
  }

  /**
   * Get current toasts
   */
  getToasts(): ToastData[] {
    return [...this.toasts];
  }

  /**
   * Get controller options
   */
  getOptions(): Required<ToastControllerOptions> {
    return { ...this.options };
  }

  /**
   * Update controller options
   */
  setOptions(options: Partial<ToastControllerOptions>): void {
    this.options = { ...this.options, ...options };
  }

  private updateState(id: string, state: ToastState): void {
    const toast = this.toasts.find((t) => t.id === id);
    if (toast) {
      toast.state = state;
      this.notify();
    }
  }

  private notify(): void {
    this.options.onUpdate(this.getToasts());
  }
}

// Global singleton controller
let globalController: ToastController | null = null;

/**
 * Get or create the global toast controller
 */
export function getGlobalToastController(): ToastController {
  if (!globalController) {
    globalController = new ToastController();
  }
  return globalController;
}

/**
 * Set the global toast controller (used by ToastProvider)
 */
export function setGlobalToastController(controller: ToastController): void {
  globalController = controller;
}

/**
 * Global toast function for showing toasts
 *
 * @example
 * ```typescript
 * dsToast({ title: "Saved!", variant: "success" });
 *
 * dsToast({
 *   title: "Error",
 *   description: "Something went wrong",
 *   variant: "error",
 *   action: { label: "Retry", onClick: () => retry() },
 * });
 * ```
 */
export function dsToast(options: ToastOptions): string {
  return getGlobalToastController().show(options);
}

// Make dsToast available globally
if (typeof window !== "undefined") {
  (window as unknown as { dsToast: typeof dsToast }).dsToast = dsToast;
}
