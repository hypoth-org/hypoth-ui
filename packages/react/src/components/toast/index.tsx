"use client";

/**
 * Toast Compound Component
 *
 * Non-blocking notification system with queue management and animations.
 */

import { ToastProvider } from "./provider.js";

export type {
  ToastProviderProps,
  ToastVariant,
  ToastPosition,
  ToastState,
  ToastAction,
  ToastData,
  ToastContextValue,
} from "./provider.js";

export { useToast, type ToastOptions, type UseToastReturn } from "./use-toast.js";

/**
 * Toast compound component.
 *
 * @example
 * ```tsx
 * // In your app root (e.g., layout.tsx)
 * import { Toast } from "@ds/react/client";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <Toast.Provider position="top-right" max={5}>
 *           {children}
 *         </Toast.Provider>
 *       </body>
 *     </html>
 *   );
 * }
 *
 * // In any component
 * import { useToast } from "@ds/react/client";
 *
 * function SaveButton() {
 *   const { toast } = useToast();
 *
 *   const handleSave = async () => {
 *     try {
 *       await save();
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
export const Toast = {
  Provider: ToastProvider,
} as const;

export default Toast;
