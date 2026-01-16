"use client";

/**
 * Toast Provider
 *
 * Context provider and viewport for toast notifications.
 */

import { type ReactNode, createContext, useCallback, useMemo, useState } from "react";
import { Portal } from "@/lib/primitives/portal.js";
import { ToastItem } from "./toast.js";

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
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
}

export interface ToastData extends ToastOptions {
  id: string;
  state: ToastState;
  createdAt: number;
}

export interface ToastContextValue {
  show: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  pause: (id: string) => void;
  resume: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  /** Toast position */
  position?: ToastPosition;
  /** Maximum simultaneous toasts */
  max?: number;
  /** Default duration in ms */
  duration?: number;
  /** Children (your app) */
  children: ReactNode;
}

let toastIdCounter = 0;

function generateId(): string {
  return `toast-${++toastIdCounter}-${Date.now()}`;
}

/**
 * Toast Provider component.
 *
 * @example
 * ```tsx
 * <Toast.Provider position="top-right" max={5}>
 *   <App />
 * </Toast.Provider>
 * ```
 */
export function ToastProvider({
  position = "top-right",
  max = 5,
  duration: defaultDuration = 5000,
  children,
}: ToastProviderProps): ReactNode {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timersRef = useMemo(() => new Map<string, ReturnType<typeof setTimeout>>(), []);

  const show = useCallback(
    (options: ToastOptions): string => {
      const id = generateId();
      const duration = options.duration ?? defaultDuration;

      const newToast: ToastData = {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant ?? "info",
        duration,
        action: options.action,
        state: "entering",
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        const updated = [newToast, ...prev];
        // Trim to max, dismissing oldest
        if (updated.length > max) {
          const toRemove = updated.slice(max);
          for (const t of toRemove) {
            if (timersRef.has(t.id)) {
              clearTimeout(timersRef.get(t.id));
              timersRef.delete(t.id);
            }
          }
          return updated.slice(0, max);
        }
        return updated;
      });

      // Transition to visible
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, state: "visible" as ToastState } : t))
        );
      }, 200);

      // Set up auto-dismiss
      if (duration > 0) {
        const timerId = setTimeout(() => {
          dismiss(id);
        }, duration);
        timersRef.set(id, timerId);
      }

      return id;
    },
    [defaultDuration, max, timersRef]
  );

  const dismiss = useCallback(
    (id: string): void => {
      // Clear timer
      if (timersRef.has(id)) {
        clearTimeout(timersRef.get(id));
        timersRef.delete(id);
      }

      // Start exit animation
      setToasts((prev) =>
        prev.map((t) =>
          t.id === id && t.state !== "exiting" && t.state !== "dismissed"
            ? { ...t, state: "exiting" as ToastState }
            : t
        )
      );

      // Remove after animation
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 150);
    },
    [timersRef]
  );

  const dismissAll = useCallback((): void => {
    for (const toast of toasts) {
      dismiss(toast.id);
    }
  }, [toasts, dismiss]);

  const pause = useCallback(
    (id: string): void => {
      if (timersRef.has(id)) {
        clearTimeout(timersRef.get(id));
        timersRef.delete(id);
      }
    },
    [timersRef]
  );

  const resume = useCallback(
    (id: string): void => {
      const toast = toasts.find((t) => t.id === id);
      if (toast?.duration && toast.duration > 0 && toast.state === "visible") {
        const elapsed = Date.now() - toast.createdAt;
        const remaining = Math.max(toast.duration - elapsed, 1000);

        const timerId = setTimeout(() => {
          dismiss(id);
        }, remaining);
        timersRef.set(id, timerId);
      }
    },
    [toasts, dismiss, timersRef]
  );

  const contextValue = useMemo<ToastContextValue>(
    () => ({ show, dismiss, dismissAll, pause, resume }),
    [show, dismiss, dismissAll, pause, resume]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Portal>
        <section
          className="ds-toast-viewport"
          data-position={position}
          aria-label="Notifications"
          aria-live="polite"
        >
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onDismiss={() => dismiss(toast.id)}
              onPause={() => pause(toast.id)}
              onResume={() => resume(toast.id)}
            />
          ))}
        </section>
      </Portal>
    </ToastContext.Provider>
  );
}

ToastProvider.displayName = "Toast.Provider";
