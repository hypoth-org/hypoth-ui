"use client";

/**
 * useToast Hook
 *
 * React hook for showing and managing toasts.
 */

import { useCallback, useContext } from "react";
import { ToastContext } from "./provider.js";

export interface ToastOptions {
  /** Toast title (required) */
  title: string;
  /** Optional description */
  description?: string;
  /** Visual variant */
  variant?: "info" | "success" | "warning" | "error";
  /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
  duration?: number;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface UseToastReturn {
  /** Show a toast notification */
  toast: (options: ToastOptions) => string;
  /** Dismiss a specific toast */
  dismiss: (id: string) => void;
  /** Dismiss all toasts */
  dismissAll: () => void;
}

/**
 * Hook for showing toast notifications.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { toast, dismiss } = useToast();
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       toast({ title: "Saved!", variant: "success" });
 *     } catch {
 *       toast({
 *         title: "Error",
 *         description: "Failed to save",
 *         variant: "error",
 *         action: { label: "Retry", onClick: handleSave },
 *       });
 *     }
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 */
export function useToast(): UseToastReturn {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a Toast.Provider");
  }

  const toast = useCallback(
    (options: ToastOptions): string => {
      return context.show(options);
    },
    [context]
  );

  const dismiss = useCallback(
    (id: string): void => {
      context.dismiss(id);
    },
    [context]
  );

  const dismissAll = useCallback((): void => {
    context.dismissAll();
  }, [context]);

  return { toast, dismiss, dismissAll };
}
